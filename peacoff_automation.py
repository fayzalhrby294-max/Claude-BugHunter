#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
peacoff_automation.py — نظام أتمتة المحتوى التسويقي لبراند بيكوف (PEACOFF) على إنستجرام
مع بوابة موافقة بشرية (Human-in-the-Loop) إلزامية قبل أي نشر.

المبدأ: النظام يولّد المسوّدات فقط. لا شيء يُنشر إلا إذا:
  1) مرّت المسوّدة بفحص الحواجز (Guardrails) دون أخطاء،
  2) وافق عليها إنسان صراحةً (approve) وسُجّل اسمه ووقت الموافقة وبصمة المحتوى،
  3) لم يتغيّر المحتوى بعد الموافقة (أي تعديل يُلغي الموافقة تلقائيًا)،
  4) أُعطي أمر النشر صراحةً مع --confirm-publish.
الوضع الافتراضي للنشر هو "تجريبي" (dry-run) ولا يتصل بإنستجرام.

الاستخدام:
  python peacoff_automation.py generate --topic "قهوة اليوم المختصة" --count 2
  python peacoff_automation.py list
  python peacoff_automation.py show <id>
  python peacoff_automation.py edit <id> --caption "نص جديد"
  python peacoff_automation.py submit <id>            # DRAFT -> PENDING_APPROVAL
  python peacoff_automation.py review                 # مراجعة تفاعلية للمعلّقات
  python peacoff_automation.py approve <id> --by Fayz
  python peacoff_automation.py reject <id> --by Fayz --reason "السبب"
  python peacoff_automation.py publish <id>                          # تجريبي
  python peacoff_automation.py publish <id> --live --confirm-publish # نشر فعلي

متغيرات البيئة (اختيارية):
  ANTHROPIC_API_KEY   لتوليد المحتوى بالذكاء الاصطناعي (وإلا تُستخدم قوالب جاهزة)
  PEACOFF_MODEL       اسم النموذج (الافتراضي claude-sonnet-5-5)
  IG_USER_ID, IG_ACCESS_TOKEN   للنشر الفعلي عبر Instagram Graph API
  PEACOFF_DATA_DIR    مجلد التخزين (الافتراضي ./peacoff_data)
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import uuid
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from enum import Enum
from pathlib import Path
from typing import Optional

# ───────────────────────────── الإعدادات والهوية ─────────────────────────────

DATA_DIR = Path(os.environ.get("PEACOFF_DATA_DIR", "peacoff_data"))
DRAFTS_FILE = DATA_DIR / "drafts.json"
AUDIT_FILE = DATA_DIR / "audit_log.jsonl"
FACTS_FILE = DATA_DIR / "brand_facts.json"

DEFAULT_MODEL = os.environ.get("PEACOFF_MODEL", "claude-sonnet-5-5")
GRAPH_API = "https://graph.facebook.com/v21.0"

IG_CAPTION_MAX = 2200
IG_HASHTAGS_MAX = 30

BRAND = {
    "name": "PEACOFF",
    "name_ar": "بيكوف",
    "city": "مكة المكرمة",
    "tone": "فاخر، هادئ، واثق، مختصر. عربية واضحة وبشرية بلا مبالغة ولا صيغ دعائية صاخبة.",
    "palette": "فحمي (Charcoal)، Gunmetal، تيفاني مطفي (Matte Tiffany)",
    "visual_rules": "إضاءة هادئة، خلفيات داكنة، لمسات تيفاني مطفي محدودة، بلا ازدحام.",
}

# عبارات تحتاج دليلًا موثقًا — تُمنع ما لم يعتمدها الإنسان يدويًا بعد المراجعة.
RISKY_PATTERNS = [
    (r"الأفضل|أفضل\s+(?:قهوة|مقهى)|رقم\s*1|الأول\s+في", "ادّعاء تفوّق غير موثّق"),
    (r"الوحيد|حصري(?:ًا)?\s+في\s+مكة", "ادّعاء تفرّد غير موثّق"),
    (r"يعالج|يشفي|يحرق\s+الدهون|يخسّس|يقوّي\s+المناعة", "ادّعاء صحي غير مسموح"),
    (r"مضمون|100\s*%|مئة\s+في\s+المئة", "صيغة ضمان مطلقة"),
    (r"\d+\s*(?:ر\.?\s?س|ريال|SAR)", "ذكر سعر — يجب أن يكون من الحقائق المعتمدة"),
    (r"خصم\s*\d+|\d+\s*%\s*خصم", "عرض/خصم — يجب أن يكون معتمدًا"),
]

DEFAULT_HASHTAGS = ["#بيكوف", "#PEACOFF", "#مكة", "#قهوة_مختصة"]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


# ───────────────────────────── نموذج البيانات ─────────────────────────────

class Status(str, Enum):
    DRAFT = "DRAFT"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    PUBLISHED = "PUBLISHED"
    FAILED = "FAILED"


@dataclass
class Draft:
    id: str
    topic: str
    caption: str
    hashtags: list[str]
    image_brief: str                      # وصف للمصمم/أداة التصميم
    image_url: Optional[str] = None       # رابط عام مباشر للصورة (مطلوب للنشر الفعلي)
    status: str = Status.DRAFT.value
    created_at: str = field(default_factory=now_iso)
    generated_by: str = "template"
    approval: Optional[dict] = None       # {by, at, content_hash}
    rejection: Optional[dict] = None      # {by, at, reason}
    publish_result: Optional[dict] = None
    warnings: list[str] = field(default_factory=list)

    def full_caption(self) -> str:
        tags = " ".join(self.hashtags)
        return f"{self.caption.strip()}\n\n{tags}".strip()

    def content_hash(self) -> str:
        """بصمة المحتوى الذي سيُنشر فعليًا (النص + الوسوم + الصورة)."""
        payload = json.dumps(
            {"caption": self.caption, "hashtags": self.hashtags, "image_url": self.image_url},
            ensure_ascii=False, sort_keys=True,
        )
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()


# ───────────────────────────── التخزين وسجل التدقيق ─────────────────────────────

class Store:
    def __init__(self) -> None:
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        self.drafts: dict[str, Draft] = {}
        if DRAFTS_FILE.exists():
            for d in json.loads(DRAFTS_FILE.read_text(encoding="utf-8")):
                self.drafts[d["id"]] = Draft(**d)

    def save(self) -> None:
        tmp = DRAFTS_FILE.with_suffix(".tmp")
        tmp.write_text(
            json.dumps([asdict(d) for d in self.drafts.values()], ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        tmp.replace(DRAFTS_FILE)

    def get(self, draft_id: str) -> Draft:
        matches = [d for k, d in self.drafts.items() if k.startswith(draft_id)]
        if len(matches) != 1:
            raise SystemExit(f"❌ لم أجد مسوّدة واحدة مطابقة للمعرّف '{draft_id}'.")
        return matches[0]

    @staticmethod
    def audit(event: str, draft_id: str, **details) -> None:
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        rec = {"at": now_iso(), "event": event, "draft": draft_id, **details}
        with AUDIT_FILE.open("a", encoding="utf-8") as f:
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")


def load_brand_facts() -> list[str]:
    """حقائق معتمدة من صاحب البراند فقط (ساعات العمل، المنتجات، العروض...).
    ملف JSON بصيغة: {"facts": ["...", "..."]}. بدونه لا يُسمح للمولّد بأي معلومة تشغيلية."""
    if FACTS_FILE.exists():
        try:
            return list(json.loads(FACTS_FILE.read_text(encoding="utf-8")).get("facts", []))
        except (json.JSONDecodeError, AttributeError):
            print("⚠️ ملف brand_facts.json غير صالح — تم تجاهله.", file=sys.stderr)
    return []


# ───────────────────────────── فحص الحواجز ─────────────────────────────

def validate(draft: Draft, facts: list[str]) -> tuple[list[str], list[str]]:
    """يعيد (أخطاء تمنع الإرسال للموافقة، تحذيرات للمراجِع)."""
    errors: list[str] = []
    warns: list[str] = []
    text = draft.caption

    if not text.strip():
        errors.append("النص فارغ.")
    if len(draft.full_caption()) > IG_CAPTION_MAX:
        errors.append(f"النص مع الوسوم يتجاوز {IG_CAPTION_MAX} حرفًا.")
    if len(draft.hashtags) > IG_HASHTAGS_MAX:
        errors.append(f"عدد الوسوم يتجاوز {IG_HASHTAGS_MAX}.")
    if any(not h.startswith("#") or " " in h for h in draft.hashtags):
        errors.append("وسم غير صالح (يجب أن يبدأ بـ # وبلا مسافات).")

    fact_blob = " ".join(facts)
    for pattern, reason in RISKY_PATTERNS:
        m = re.search(pattern, text)
        if m and m.group(0) not in fact_blob:
            warns.append(f"«{m.group(0)}» ← {reason}")

    if not draft.image_url:
        warns.append("لا يوجد image_url — مطلوب للنشر الفعلي (رابط عام مباشر).")
    return errors, warns


# ───────────────────────────── توليد المحتوى ─────────────────────────────

SYSTEM_PROMPT = f"""أنت كاتب محتوى تسويقي لبراند مقهى {BRAND['name']} ({BRAND['name_ar']}) في {BRAND['city']}.
النبرة: {BRAND['tone']}
الهوية البصرية: {BRAND['palette']}. {BRAND['visual_rules']}

قواعد صارمة:
- لا تخترع أسعارًا أو عروضًا أو ساعات عمل أو مواقع أو أرقامًا أو شهادات أو ادعاءات تفوّق/صحة.
- استخدم فقط المعلومات الواردة في «الحقائق المعتمدة»؛ وإن لم تكفِ فاكتب نصًا وجدانيًا عامًا بلا معلومات تشغيلية.
- لا تغيّر اسم البراند أو شعاره.
- عربية فصيحة مبسّطة، بلا مبالغة وبلا إيموجي مفرط (حدّ أقصى 2).
- أنهِ النص بدعوة هادئة (زيارة/تجربة) دون إلحاح.
أعد JSON فقط بالمفاتيح: caption (نص)، hashtags (قائمة 4-8 وسوم)، image_brief (وصف بصري بالعربية للمصمم)."""


class ContentGenerator:
    """يولّد مسوّدات عبر Claude إن توفّر المفتاح، وإلا يستخدم قوالب آمنة."""

    def __init__(self, model: str = DEFAULT_MODEL) -> None:
        self.model = model
        self.api_key = os.environ.get("ANTHROPIC_API_KEY")

    def generate(self, topic: str, facts: list[str], variant: int = 0) -> Draft:
        if self.api_key:
            try:
                return self._from_llm(topic, facts, variant)
            except Exception as exc:  # الاعتماد على القالب عند أي فشل بدل إيقاف العمل
                print(f"⚠️ فشل التوليد بالنموذج ({exc}) — استخدام قالب بديل.", file=sys.stderr)
        return self._from_template(topic, variant)

    def _from_llm(self, topic: str, facts: list[str], variant: int) -> Draft:
        facts_txt = "\n".join(f"- {f}" for f in facts) or "(لا توجد حقائق معتمدة)"
        user = (
            f"الموضوع: {topic}\nرقم النسخة: {variant + 1} (اجعلها مختلفة عن النسخ الأخرى)\n"
            f"الحقائق المعتمدة:\n{facts_txt}"
        )
        body = json.dumps({
            "model": self.model,
            "max_tokens": 1200,
            "system": SYSTEM_PROMPT,
            "messages": [{"role": "user", "content": user}],
        }).encode("utf-8")
        req = urllib.request.Request(
            "https://api.anthropic.com/v1/messages", data=body, method="POST",
            headers={
                "content-type": "application/json",
                "x-api-key": self.api_key,
                "anthropic-version": "2023-06-01",
            },
        )
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        text = "".join(b.get("text", "") for b in data.get("content", []))
        m = re.search(r"\{.*\}", text, re.S)
        if not m:
            raise ValueError("رد غير متوقع (لا JSON)")
        obj = json.loads(m.group(0))
        tags = [t if t.startswith("#") else f"#{t}" for t in obj.get("hashtags", [])]
        tags = [t.replace(" ", "_") for t in tags] or list(DEFAULT_HASHTAGS)
        return Draft(
            id=uuid.uuid4().hex[:8], topic=topic,
            caption=str(obj["caption"]).strip(), hashtags=tags[:IG_HASHTAGS_MAX],
            image_brief=str(obj.get("image_brief", "")).strip(),
            generated_by=f"llm:{self.model}",
        )

    @staticmethod
    def _from_template(topic: str, variant: int) -> Draft:
        templates = [
            "{t}\nلحظة هدوء في مكة، وفنجان يُحضَّر بعناية.\nنراكم في بيكوف.",
            "بعض اللحظات تستحق أن تُدار ببطء.\n{t} — في بيكوف.",
            "{t}\nتفاصيل صغيرة، وطعم يبقى.\nمرحبًا بكم في بيكوف.",
        ]
        caption = templates[variant % len(templates)].format(t=topic)
        return Draft(
            id=uuid.uuid4().hex[:8], topic=topic, caption=caption,
            hashtags=list(DEFAULT_HASHTAGS),
            image_brief=(
                f"لقطة قريبة مرتبطة بـ «{topic}»، خلفية فحمية/Gunmetal، إضاءة جانبية دافئة هادئة، "
                "لمسة تيفاني مطفي واحدة، مساحة فارغة للنص، بلا ازدحام."
            ),
            generated_by="template",
        )


# ───────────────────────────── النشر ─────────────────────────────

class PublishError(RuntimeError):
    pass


class DryRunPublisher:
    """لا يتصل بأي خدمة؛ يعرض ما كان سيُنشر فقط."""
    live = False

    def publish(self, draft: Draft) -> dict:
        return {"mode": "dry-run", "would_publish": draft.full_caption(), "image_url": draft.image_url}


class InstagramPublisher:
    """نشر صورة واحدة عبر Instagram Graph API (إنشاء حاوية ثم نشرها)."""
    live = True

    def __init__(self) -> None:
        self.user_id = os.environ.get("IG_USER_ID")
        self.token = os.environ.get("IG_ACCESS_TOKEN")
        if not (self.user_id and self.token):
            raise PublishError("المتغيران IG_USER_ID و IG_ACCESS_TOKEN مطلوبان للنشر الفعلي.")

    def _post(self, path: str, params: dict) -> dict:
        params = {**params, "access_token": self.token}
        req = urllib.request.Request(
            f"{GRAPH_API}/{path}", data=urllib.parse.urlencode(params).encode("utf-8"), method="POST"
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            raise PublishError(f"Instagram API {e.code}: {e.read().decode('utf-8', 'replace')[:300]}")
        except urllib.error.URLError as e:
            raise PublishError(f"تعذّر الاتصال: {e.reason}")

    def publish(self, draft: Draft) -> dict:
        if not draft.image_url:
            raise PublishError("image_url مفقود — لا يمكن النشر بدون صورة.")
        container = self._post(f"{self.user_id}/media",
                               {"image_url": draft.image_url, "caption": draft.full_caption()})
        media = self._post(f"{self.user_id}/media_publish", {"creation_id": container["id"]})
        return {"mode": "live", "media_id": media.get("id")}


# ───────────────────────────── بوابة الموافقة ─────────────────────────────

def submit_for_approval(store: Store, draft: Draft) -> None:
    if draft.status not in (Status.DRAFT.value, Status.REJECTED.value):
        raise SystemExit(f"❌ الحالة الحالية ({draft.status}) لا تسمح بالإرسال للموافقة.")
    errors, warns = validate(draft, load_brand_facts())
    draft.warnings = warns
    if errors:
        store.save()
        raise SystemExit("❌ أخطاء تمنع الإرسال:\n  - " + "\n  - ".join(errors))
    draft.status = Status.PENDING_APPROVAL.value
    draft.rejection = None
    store.audit("submitted", draft.id, warnings=warns)
    store.save()


def approve(store: Store, draft: Draft, reviewer: str) -> None:
    if draft.status != Status.PENDING_APPROVAL.value:
        raise SystemExit(f"❌ لا يمكن اعتماد مسوّدة حالتها {draft.status}.")
    if not reviewer.strip():
        raise SystemExit("❌ اسم المراجِع مطلوب.")
    draft.approval = {"by": reviewer.strip(), "at": now_iso(), "content_hash": draft.content_hash()}
    draft.status = Status.APPROVED.value
    store.audit("approved", draft.id, by=reviewer, content_hash=draft.approval["content_hash"])
    store.save()


def reject(store: Store, draft: Draft, reviewer: str, reason: str) -> None:
    if draft.status not in (Status.PENDING_APPROVAL.value, Status.APPROVED.value):
        raise SystemExit(f"❌ لا يمكن رفض مسوّدة حالتها {draft.status}.")
    draft.rejection = {"by": reviewer, "at": now_iso(), "reason": reason}
    draft.approval = None
    draft.status = Status.REJECTED.value
    store.audit("rejected", draft.id, by=reviewer, reason=reason)
    store.save()


def publish(store: Store, draft: Draft, live: bool, confirm: bool) -> None:
    """البوابة النهائية: لا نشر بدون موافقة سارية + بصمة مطابقة + تأكيد صريح."""
    if draft.status != Status.APPROVED.value or not draft.approval:
        raise SystemExit("❌ مرفوض: المسوّدة غير معتمدة بشريًا.")
    if draft.approval["content_hash"] != draft.content_hash():
        draft.status = Status.DRAFT.value
        draft.approval = None
        store.audit("approval_invalidated", draft.id, reason="content_changed")
        store.save()
        raise SystemExit("❌ المحتوى تغيّر بعد الموافقة — أُلغيت الموافقة، أعد الإرسال للمراجعة.")
    errors, _ = validate(draft, load_brand_facts())
    if errors:
        raise SystemExit("❌ أخطاء تمنع النشر:\n  - " + "\n  - ".join(errors))
    if live and not confirm:
        raise SystemExit("❌ النشر الفعلي يتطلب --confirm-publish صراحةً.")

    try:
        publisher = InstagramPublisher() if live else DryRunPublisher()
        result = publisher.publish(draft)
    except PublishError as exc:
        draft.status = Status.FAILED.value
        draft.publish_result = {"error": str(exc), "at": now_iso()}
        store.audit("publish_failed", draft.id, error=str(exc))
        store.save()
        raise SystemExit(f"❌ فشل النشر: {exc}")

    result["at"] = now_iso()
    draft.publish_result = result
    if live:
        draft.status = Status.PUBLISHED.value
    store.audit("published" if live else "dry_run", draft.id, **{k: v for k, v in result.items() if k != "would_publish"})
    store.save()
    if live:
        print(f"✅ نُشرت المسوّدة {draft.id} (media_id={result.get('media_id')}).")
    else:
        print("🧪 تشغيل تجريبي — لم يُنشر شيء. كان سيُنشر:\n")
        print(result["would_publish"])


# ───────────────────────────── واجهة سطر الأوامر ─────────────────────────────

def show(draft: Draft) -> None:
    bar = "─" * 56
    print(f"\n{bar}\nالمعرّف: {draft.id} | الحالة: {draft.status} | المصدر: {draft.generated_by}")
    print(f"الموضوع: {draft.topic}\n{bar}\n{draft.full_caption()}\n{bar}")
    print(f"وصف الصورة: {draft.image_brief}")
    print(f"رابط الصورة: {draft.image_url or '— (غير محدد)'}")
    for w in draft.warnings:
        print(f"⚠️  {w}")
    if draft.approval:
        print(f"✔ اعتمدها: {draft.approval['by']} في {draft.approval['at']}")
    if draft.rejection:
        print(f"✘ رفضها: {draft.rejection['by']} — {draft.rejection['reason']}")
    print(bar)


def cmd_generate(a, store: Store) -> None:
    facts = load_brand_facts()
    if not facts:
        print("ℹ️ لا توجد حقائق معتمدة (peacoff_data/brand_facts.json) — سيُكتب نص عام بلا معلومات تشغيلية.")
    gen = ContentGenerator()
    for i in range(a.count):
        d = gen.generate(a.topic, facts, i)
        d.image_url = a.image_url
        _, d.warnings = validate(d, facts)
        store.drafts[d.id] = d
        store.audit("generated", d.id, source=d.generated_by)
        show(d)
    store.save()
    print("\nالخطوة التالية: راجِع النص ثم `submit <id>` ثم `approve <id> --by اسمك`.")


def cmd_list(a, store: Store) -> None:
    if not store.drafts:
        print("لا توجد مسوّدات.")
    for d in sorted(store.drafts.values(), key=lambda x: x.created_at):
        first = d.caption.strip().splitlines()[0][:45]
        print(f"{d.id}  {d.status:<17} {first}")


def cmd_edit(a, store: Store) -> None:
    d = store.get(a.id)
    if d.status in (Status.PUBLISHED.value,):
        raise SystemExit("❌ لا يمكن تعديل منشور تم نشره.")
    if a.caption is not None:
        d.caption = a.caption
    if a.hashtags is not None:
        d.hashtags = a.hashtags
    if a.image_url is not None:
        d.image_url = a.image_url
    if d.status in (Status.APPROVED.value, Status.PENDING_APPROVAL.value):
        d.status, d.approval = Status.DRAFT.value, None
        print("ℹ️ التعديل أعاد المسوّدة إلى DRAFT وألغى أي موافقة سابقة.")
    _, d.warnings = validate(d, load_brand_facts())
    store.audit("edited", d.id)
    store.save()
    show(d)


def cmd_review(a, store: Store) -> None:
    pending = [d for d in store.drafts.values() if d.status == Status.PENDING_APPROVAL.value]
    if not pending:
        print("لا توجد مسوّدات بانتظار الموافقة.")
        return
    reviewer = a.by or input("اسم المراجِع: ").strip()
    for d in pending:
        show(d)
        choice = input("[a] اعتماد  [r] رفض  [s] تخطّي  [q] خروج : ").strip().lower()
        if choice == "a":
            approve(store, d, reviewer)
            print("✔ اعتُمدت.")
        elif choice == "r":
            reject(store, d, reviewer, input("سبب الرفض: ").strip() or "بدون سبب")
            print("✘ رُفضت.")
        elif choice == "q":
            break


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="أتمتة محتوى إنستجرام لبيكوف مع موافقة بشرية قبل النشر")
    sub = p.add_subparsers(dest="cmd", required=True)

    g = sub.add_parser("generate", help="توليد مسوّدات")
    g.add_argument("--topic", required=True)
    g.add_argument("--count", type=int, default=1)
    g.add_argument("--image-url", default=None)

    sub.add_parser("list", help="عرض المسوّدات")
    s = sub.add_parser("show"); s.add_argument("id")

    e = sub.add_parser("edit", help="تعديل مسوّدة (يلغي أي موافقة سابقة)")
    e.add_argument("id"); e.add_argument("--caption")
    e.add_argument("--hashtags", nargs="+"); e.add_argument("--image-url")

    sm = sub.add_parser("submit", help="إرسال للموافقة"); sm.add_argument("id")
    r = sub.add_parser("review", help="مراجعة تفاعلية"); r.add_argument("--by")

    ap = sub.add_parser("approve"); ap.add_argument("id"); ap.add_argument("--by", required=True)
    rj = sub.add_parser("reject"); rj.add_argument("id"); rj.add_argument("--by", required=True)
    rj.add_argument("--reason", required=True)

    pb = sub.add_parser("publish", help="نشر (تجريبي افتراضيًا)")
    pb.add_argument("id")
    pb.add_argument("--live", action="store_true", help="نشر فعلي على إنستجرام")
    pb.add_argument("--confirm-publish", action="store_true", help="تأكيد صريح للنشر الفعلي")
    return p


def main(argv: Optional[list[str]] = None) -> None:
    a = build_parser().parse_args(argv)
    store = Store()
    if a.cmd == "generate":
        cmd_generate(a, store)
    elif a.cmd == "list":
        cmd_list(a, store)
    elif a.cmd == "show":
        show(store.get(a.id))
    elif a.cmd == "edit":
        cmd_edit(a, store)
    elif a.cmd == "submit":
        d = store.get(a.id); submit_for_approval(store, d); show(d)
    elif a.cmd == "review":
        cmd_review(a, store)
    elif a.cmd == "approve":
        d = store.get(a.id); approve(store, d, a.by); show(d)
    elif a.cmd == "reject":
        d = store.get(a.id); reject(store, d, a.by, a.reason); show(d)
    elif a.cmd == "publish":
        publish(store, store.get(a.id), a.live, a.confirm_publish)


if __name__ == "__main__":
    main()
