const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const FONTS = path.join(__dirname, 'fonts/node_modules/@fontsource');
const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });

const b64 = (p) => fs.readFileSync(path.join(FONTS, p)).toString('base64');
const face = (family, weight, file, range) =>
  `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${b64(file)}) format('woff2');unicode-range:${range};}`;
const AR = 'U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F,U+2010-2011,U+25CC';
const LA = 'U+0000-00FF,U+2013-2014,U+2022,U+00B7';
const css = [
  ...[300, 400, 600].flatMap((w) => [
    face('Plex', w, `ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-${w}-normal.woff2`, AR),
    face('Plex', w, `ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-latin-${w}-normal.woff2`, LA),
  ]),
  ...[600, 700].map((w) => face('Kufi', w, `noto-kufi-arabic/files/noto-kufi-arabic-arabic-${w}-normal.woff2`, AR)),
  face('Kufi', 600, 'ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-latin-600-normal.woff2', LA),
  face('Kufi', 700, 'ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-latin-600-normal.woff2', LA),
  face('Jost', 300, 'jost/files/jost-latin-300-normal.woff2', LA),
].join('\n');

const LOC = 'ممشى الشوقية · مكة المكرمة';
const H_WEEK = 'السبت – الخميس: 7 الصبح – 2 بعد منتصف الليل';
const H_FRI = 'الجمعة: 2 الظهر – 2 بعد منتصف الليل';

// كل النصوص والأسعار من brand_facts.json فقط.
const stories = [
  { id: '01-sat-cold-coffee', day: 'السبت', kicker: 'قهوة اليوم الباردة',
    head: ['وش قهوة', 'اليوم؟'], accent: true,
    body: 'تتغيّر كل يوم. اسأل عند الطلب، ونقول لك وش فيها.',
    rows: [['عادي', '5.90 ر.س'], ['كبير', '7.90 ر.س']], hours: H_WEEK },
  { id: '02-sun-v60', day: 'الأحد', kicker: 'V60',
    head: ['كلاسيك', 'ولا فاخر؟'], accent: true,
    body: 'الفاخر بمحاصيل مختارة. اسأل عن المحصول المتوفر اليوم.',
    rows: [['V60 كلاسيك', '12.90 ر.س'], ['V60 فاخر', '16.90 ر.س']] },
  { id: '03-mon-question', day: 'الاثنين', kicker: null, big: true,
    head: ['أول كوب', 'في يومك؟'], accent: true,
    body: 'V60 ولا إسبريسو؟ رد علينا هنا.' },
  { id: '04-tue-dessert', day: 'الثلاثاء', kicker: 'الحلا',
    head: ['مع القهوة', 'شي حلو؟'], accent: true,
    body: null,
    rows: [['كوكيز', '8.90 ر.س'], ['كريم كراميل', '9.90 ر.س'], ['بودنق', '11.90 ر.س']] },
  { id: '05-wed-hibiscus', day: 'الأربعاء', kicker: 'مشروبات',
    head: ['ما تبي قهوة', 'الحين؟'], accent: true, size: 128,
    body: 'عندنا كركديه.',
    rows: [['عادي', '6.90 ر.س'], ['كبير', '9.90 ر.س']] },
  { id: '06-thu-late', day: 'الخميس', kicker: null, big: true,
    head: ['الخميس', 'نسهر معك.'], accent: true, size: 150,
    body: 'نقفل الساعة 2 بعد منتصف الليل.', hours: H_WEEK },
  { id: '07-fri-hours', day: 'الجمعة', kicker: null, big: true,
    head: ['الجمعة', 'من 2 الظهر.'], accent: true, size: 148,
    body: 'نفتح 2 الظهر، ونقفل 2 بعد منتصف الليل.', hours: H_FRI },
];

const html = (s) => `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>${css}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;height:1920px;background:#2a3033;color:#f3f4f2;font-family:'Plex',sans-serif;position:relative;overflow:hidden}
.wrap{position:absolute;inset:0;padding:170px 100px 150px;display:flex;flex-direction:column}
.top{display:flex;justify-content:space-between;align-items:baseline}
.mark{font-family:'Jost',sans-serif;font-weight:300;font-size:44px;letter-spacing:.42em;direction:ltr;margin-right:-.42em}
.tag{font-weight:300;font-size:30px;color:#8e9898}
.rule{width:125px;height:3px;background:#7fb5ae;margin-top:46px}
.kicker{margin-top:120px;font-size:34px;font-weight:400;color:#7fb5ae;letter-spacing:.02em}
.head{font-family:'Kufi',sans-serif;font-weight:600;line-height:1.28}
.head .a{color:#7fb5ae}
.body{font-weight:300;color:#b4bcbb;line-height:1.75}
.rows{margin-top:70px}
.row{display:flex;align-items:baseline;gap:22px;margin-bottom:34px}
.row .n{font-size:54px;font-weight:400}
.row .d{flex:1;border-bottom:2px dotted #4b5557;transform:translateY(-8px)}
.row .p{font-size:46px;font-weight:300;color:#b4bcbb;direction:rtl}
.foot{margin-top:auto;border-top:2px solid #3b4547;padding-top:44px}
.loc{font-size:42px;font-weight:600}
.hrs{font-size:34px;font-weight:300;color:#8e9898;margin-top:14px}
${s.big
  ? `.kicker{margin-top:0}.mid{margin-top:230px}.head{font-size:${s.size||178}px}.body{font-size:52px;margin-top:70px}`
  : `.mid{margin-top:0}.head{font-size:${s.size||(s.rows && s.rows.length > 2 ? 140 : 150)}px;margin-top:38px}.body{font-size:46px;margin-top:50px}`}
</style></head><body><div class="wrap">
<div class="top"><div class="mark">PEACOFF</div><div class="tag">قهوة مختصة · مكة</div></div>
<div class="rule"></div>
<div class="mid">
${s.kicker ? `<div class="kicker">${s.kicker}</div>` : ''}
<div class="head">${s.head.map((l, i) => (s.accent && i === s.head.length - 1 ? `<span class="a">${l}</span>` : l)).join('<br>')}</div>
${s.body ? `<div class="body">${s.body}</div>` : ''}
${s.rows ? `<div class="rows">${s.rows.map(([n, p]) => `<div class="row"><span class="n">${n}</span><span class="d"></span><span class="p">${p}</span></div>`).join('')}</div>` : ''}
</div>
<div class="foot"><div class="loc">${LOC}</div>${s.hours ? `<div class="hrs">${s.hours}</div>` : ''}</div>
</div></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  for (const s of stories) {
    await page.setContent(html(s));
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(OUT, `${s.id}.png`) });
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'stories.json'), JSON.stringify(stories, null, 2));
  console.log('done', stories.length);
})();
