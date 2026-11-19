import sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import CellIsRule, FormulaRule

OUT = sys.argv[1]
F = "Arial"
CHAR = "2B3032"; TIF = "2F9A9B"; PALE = "E9F4F4"; INPUT = "FFF9C4"
thin = Side(style="thin", color="9AA3A4"); BORDER = Border(left=thin, right=thin, top=thin, bottom=thin)

def font(**k): return Font(name=F, **k)
def hdr(c, text, fill=CHAR, color="FFFFFF", size=11):
    c.value = text; c.font = font(bold=True, color=color, size=size)
    c.fill = PatternFill("solid", fgColor=fill); c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border = BORDER
def label(c, text, bold=False):
    c.value = text; c.font = font(bold=bold, size=11); c.alignment = Alignment(horizontal="right", vertical="center", wrap_text=True); c.border = BORDER
def inp(c, fmt=None, align="center"):
    c.fill = PatternFill("solid", fgColor=INPUT); c.font = font(color="0000FF", size=11)
    c.alignment = Alignment(horizontal=align, vertical="center", wrap_text=True); c.border = BORDER
    if fmt: c.number_format = fmt
def calc(c, fmt=None, bold=False):
    c.font = font(bold=bold, size=11); c.alignment = Alignment(horizontal="center", vertical="center"); c.border = BORDER
    c.fill = PatternFill("solid", fgColor=PALE)
    if fmt: c.number_format = fmt
def title(ws, text, sub, ncols):
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=ncols)
    ws["A1"] = text; ws["A1"].font = font(bold=True, size=16, color=CHAR); ws["A1"].alignment = Alignment(horizontal="right", vertical="center")
    ws.row_dimensions[1].height = 30
    ws.merge_cells(start_row=2, start_column=1, end_row=2, end_column=ncols)
    ws["A2"] = sub; ws["A2"].font = font(size=9, italic=True, color="59666A"); ws["A2"].alignment = Alignment(horizontal="right")
def page(ws):
    ws.sheet_view.rightToLeft = True
    ws.page_setup.paperSize = ws.PAPERSIZE_A4; ws.page_setup.orientation = "portrait"
    ws.page_setup.fitToWidth = 1; ws.page_setup.fitToHeight = 1; ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.print_options.horizontalCentered = True
    ws.sheet_view.showGridLines = False

wb = Workbook()

# ============ الجرد (تصميم فاخر) ============
from openpyxl.drawing.image import Image as XLImage
ws = wb.active; ws.title = "الجرد"; page(ws)
INK="23272A"; TIFF="55C5C6"; TIFD="2F9A9B"; CREAM="FBF8F1"; SAND="F1ECE0"; HAIR="D9DEDE"
red = PatternFill("solid", bgColor="F8D7DA", fgColor="F8D7DA")
hair = Side(style="hair", color="B8C0C1"); thin2 = Side(style="thin", color="D5DADA")
widths = {"A":2.5,"B":34,"C":12,"D":13,"E":13,"F":15,"G":28,"H":2.5}
for k,v in widths.items(): ws.column_dimensions[k].width = v
def fill(c,hexc): c.fill = PatternFill("solid", fgColor=hexc)
# --- الشريط العلوي ---
for r in range(1,5):
    for col in "ABCDEFGH": fill(ws[f"{col}{r}"], INK)
ws.row_dimensions[1].height = 22; ws.row_dimensions[2].height = 22; ws.row_dimensions[3].height = 16; ws.row_dimensions[4].height = 10
ws.merge_cells("C1:G2"); ws["C1"] = "الجرد  ·  INVENTORY"; ws["C1"].font = Font(name=F, bold=True, size=22, color="FFFFFF"); ws["C1"].alignment = Alignment(horizontal="right", vertical="center")
ws.merge_cells("C3:G3"); ws["C3"] = "P E A C O F F   ·   COFFEE & MORE"; ws["C3"].font = Font(name=F, size=8, color=TIFF, bold=True); ws["C3"].alignment = Alignment(horizontal="right", vertical="center")
img = XLImage("/home/user/Claude-BugHunter/peacoff_data/design/logo/symbol_tiffany.png"); img.height = 62; img.width = int(62*739/1669); ws.add_image(img, "B1")
for col in "ABCDEFGH": fill(ws[f"{col}5"], TIFD)
ws.row_dimensions[5].height = 3; ws.row_dimensions[6].height = 12
# --- بيانات الجرد ---
def tag(c, t):
    c.value=t; c.font=Font(name=F,bold=True,size=10,color=INK); c.fill=PatternFill("solid",fgColor=SAND); c.alignment=Alignment(horizontal="center",vertical="center"); c.border=Border(bottom=Side(style="medium",color=TIFD))
def field_(c, fmt=None):
    c.fill=PatternFill("solid",fgColor=CREAM); c.font=Font(name=F,size=11,color=INK); c.alignment=Alignment(horizontal="center",vertical="center"); c.border=Border(bottom=Side(style="thin",color="8B9293"))
    if fmt: c.number_format=fmt
tag(ws["B7"],"التاريخ"); ws.merge_cells("C7:D7"); field_(ws["C7"],"yyyy-mm-dd"); field_(ws["D7"])
tag(ws["E7"],"المسؤول"); ws.merge_cells("F7:G7"); field_(ws["F7"]); field_(ws["G7"])
ws.row_dimensions[7].height = 26; ws.row_dimensions[8].height = 10
# --- بطاقات الملخص (تُعبّأ لاحقًا بعد معرفة النطاقات) ---
ws.row_dimensions[9].height = 16; ws.row_dimensions[10].height = 34; ws.row_dimensions[11].height = 12
# --- رأس الجدول ---
HR = 12
for col,t in zip("BCDEFG",("الصنف","الوحدة","الموجود","الحد الأدنى","الحالة","ملاحظات")):
    c=ws[f"{col}{HR}"]; c.value=t; c.font=Font(name=F,bold=True,size=10,color="FFFFFF"); fill(c,INK); c.alignment=Alignment(horizontal="center" if col!="B" else "right",vertical="center",indent=1 if col=="B" else 0); c.border=Border(bottom=Side(style="medium",color=TIFF))
ws.row_dimensions[HR].height = 26
dvu = DataValidation(type="list", formula1='"كجم,جرام,لتر,عبوة,كرتون,قطعة"', allow_blank=True); ws.add_data_validation(dvu)
r = HR+1
# سطر مثال
for col,v in zip("BCDE",("مثال — احذف هذا السطر: حليب تجريبي","عبوة",12,5)):
    c=ws[f"{col}{r}"]; c.value=v; c.font=Font(name=F,italic=True,size=10,color="8A9496"); c.alignment=Alignment(horizontal="right" if col=="B" else "center",vertical="center",indent=1 if col=="B" else 0)
ws[f"F{r}"] = f'=IF(OR(D{r}="",E{r}=""),"",IF(D{r}<=E{r},"اطلب","متوفر"))'
ws[f"G{r}"].value = None
ws.row_dimensions[r].height = 22
ex_row = r; r += 1
GROUPS = [("البن  ·  COFFEE BEANS", ["Haraz  ·  حراز","Safari  ·  سفاري","Hambela  ·  هامبيلا","Guji Korma  ·  قوجي كورما","Caldas  ·  كالداس"], "كجم"),
          ("مشروبات ومكوّنات  ·  DRINKS & INGREDIENTS", [""]*5, ""),
          ("تغليف ومستلزمات  ·  PACKAGING & SUPPLIES", [""]*5, ""),
          ("أخرى  ·  OTHER", [""]*3, "")]
data_rows=[]; first_data = r
for gt, items, unit in GROUPS:
    ws.merge_cells(start_row=r,start_column=2,end_row=r,end_column=7)
    c=ws[f"B{r}"]; c.value=gt; c.font=Font(name=F,bold=True,size=9,color=TIFD); c.alignment=Alignment(horizontal="right",vertical="center",indent=1)
    for col in "BCDEFG": fill(ws[f"{col}{r}"],SAND); ws[f"{col}{r}"].border=Border(bottom=Side(style="thin",color=TIFD))
    ws.row_dimensions[r].height = 20; r += 1
    for it in items:
        for col in "BCDEG": 
            cc=ws[f"{col}{r}"]; cc.fill=PatternFill("solid",fgColor=CREAM); cc.border=Border(bottom=thin2,left=Side(style="hair",color="E6EAEA"),right=Side(style="hair",color="E6EAEA"))
            cc.font=Font(name=F,size=11,color=INK,bold=(col=="B")); cc.alignment=Alignment(horizontal="right" if col in "BG" else "center",vertical="center",indent=1 if col in "BG" else 0)
        if it: ws[f"B{r}"]=it
        if unit: ws[f"C{r}"]=unit
        dvu.add(f"C{r}"); ws[f"D{r}"].number_format="#,##0.##"; ws[f"E{r}"].number_format="#,##0.##"
        ws[f"F{r}"] = f'=IF(OR(D{r}="",E{r}=""),"",IF(D{r}<=E{r},"اطلب","متوفر"))'
        fc=ws[f"F{r}"]; fc.font=Font(name=F,bold=True,size=10); fc.alignment=Alignment(horizontal="center",vertical="center"); fc.border=Border(bottom=thin2); fc.fill=PatternFill("solid",fgColor="FFFFFF")
        ws.row_dimensions[r].height = 23; data_rows.append(r); r += 1
last_data = r-1
# حالة المثال
fc=ws[f"F{ex_row}"]; fc.font=Font(name=F,bold=True,size=10,color="8A9496"); fc.alignment=Alignment(horizontal="center",vertical="center")
rng=f"F{ex_row}:F{last_data}"
ws.conditional_formatting.add(rng, CellIsRule(operator="equal", formula=['"اطلب"'], fill=PatternFill("solid",bgColor="F8D7DA",fgColor="F8D7DA"), font=Font(name=F,bold=True,color="B71C1C")))
ws.conditional_formatting.add(rng, FormulaRule(formula=[f'LEFT(F{ex_row},5)="متوفر"'], font=Font(name=F,bold=True,color="1E6B34")))
# --- بطاقات الملخص ---
dr = f"D{first_data}:D{last_data}"; fr = f"F{first_data}:F{last_data}"
cards=(("B","C","الأصناف المجرودة",f"=COUNT({dr})"),("D","E","تحتاج طلب",f'=COUNTIF({fr},"اطلب")'),("F","G","متوفرة",f'=COUNTIF({fr},"متوفر*")'))
for a_,b_,t,f_ in cards:
    ws.merge_cells(f"{a_}9:{b_}9"); ws.merge_cells(f"{a_}10:{b_}10")
    c=ws[f"{a_}9"]; c.value=t; c.font=Font(name=F,size=9,bold=True,color="6B7678"); c.alignment=Alignment(horizontal="center",vertical="bottom")
    n=ws[f"{a_}10"]; n.value=f_; n.font=Font(name=F,size=20,bold=True,color=(("B71C1C") if t=="تحتاج طلب" else INK)); n.alignment=Alignment(horizontal="center",vertical="center")
    for col in (a_,b_):
        for rr in (9,10): ws[f"{col}{rr}"].fill=PatternFill("solid",fgColor="FFFFFF"); ws[f"{col}{rr}"].border=Border(top=Side(style="medium",color=TIFD) if rr==9 else None, bottom=Side(style="thin",color=HAIR) if rr==10 else None)
# --- التذييل ---
r = last_data + 2
ws.merge_cells(f"B{r}:G{r}"); ws[f"B{r}"]="الخانات الكريمية للتعبئة · الحالة تُحسب تلقائيًا: «اطلب» إذا الموجود ≤ الحد الأدنى · الحد الأدنى تحدده أنت"
ws[f"B{r}"].font=Font(name=F,size=8,italic=True,color="7D8788"); ws[f"B{r}"].alignment=Alignment(horizontal="right",indent=1)
r += 2
ws.row_dimensions[r].height = 26
tag(ws[f"B{r}"],"توقيع المسؤول"); ws.merge_cells(f"C{r}:D{r}"); field_(ws[f"C{r}"]); field_(ws[f"D{r}"])
tag(ws[f"E{r}"],"اعتماد المالك"); ws.merge_cells(f"F{r}:G{r}"); field_(ws[f"F{r}"]); field_(ws[f"G{r}"])
ws.freeze_panes = f"A{HR+1}"
ws.print_area = f"A1:H{r+1}"
ws.page_margins.left = ws.page_margins.right = 0.4; ws.page_margins.top = 0.4; ws.page_margins.bottom = 0.4

# ============ تقفيل الشفت ============
w2 = wb.create_sheet("تقفيل الشفت"); page(w2)
for col, w in zip("ABCD", (30, 18, 30, 18)): w2.column_dimensions[col].width = w
title(w2, "PEACOFF · تقفيل الشفت", "املأ الخانات الكريمية فقط · الإجمالي والمتوقع والفرق تُحسب تلقائيًا · انسخ الورقة (Move or Copy) لكل يوم", 4)
label(w2["A4"], "التاريخ", True); inp(w2["B4"], "yyyy-mm-dd")
label(w2["C4"], "الشفت", True); inp(w2["D4"])
label(w2["A5"], "الموظف", True); inp(w2["B5"]); w2.merge_cells("B5:D5")
dv = DataValidation(type="list", formula1='"صباحي,مسائي"', allow_blank=True); w2.add_data_validation(dv); dv.add("D4")

hdr(w2["A7"], "المبيعات (من نقطة البيع)"); hdr(w2["B7"], "ريال"); hdr(w2["C7"], "النقد في الدرج"); hdr(w2["D7"], "ريال")
money = '#,##0.00'; signed = '+#,##0.00;-#,##0.00;0.00'
label(w2["A8"], "نقدي"); inp(w2["B8"], money)
label(w2["A9"], "مدى / بطاقة / Apple Pay"); inp(w2["B9"], money)
label(w2["A10"], "الإجمالي", True); w2["B10"] = "=SUM(B8:B9)"; calc(w2["B10"], money, True)
label(w2["C8"], "بداية الشفت"); inp(w2["D8"], money)
label(w2["C9"], "مصروفات من الدرج (بفواتير)"); inp(w2["D9"], money)
label(w2["C10"], "المتوقع في الدرج", True); w2["D10"] = "=D8+B8-D9"; calc(w2["D10"], money, True)
label(w2["C11"], "المعدود الآن"); inp(w2["D11"], money)
label(w2["C12"], "الفرق (+ زيادة / − نقص)", True); w2["D12"] = '=IF(D11="","",D11-D10)'; calc(w2["D12"], signed, True)
w2.conditional_formatting.add("D12", FormulaRule(formula=['AND(ISNUMBER($D$12),$D$12<>0)'], fill=red, font=Font(name=F, bold=True, color="B71C1C")))
w2.conditional_formatting.add("D12", FormulaRule(formula=['AND(ISNUMBER($D$12),$D$12=0)'], fill=PatternFill("solid", bgColor="D4EDDA", fgColor="D4EDDA"), font=Font(name=F, bold=True, color="1E6B34")))

hdr(w2["A14"], "قبل الإغلاق"); hdr(w2["B14"], "تم؟"); w2.merge_cells("C14:D14"); hdr(w2["C14"], "المنجز")
CHECK = ["إغلاق نقطة البيع وطباعة تقرير الإقفال", "تنظيف الماكينات والطواحين والبار", "رمي المنتهي، وملصقات التاريخ على المحضّر", "إغلاق الثلاجة", "إخراج النفايات", "إطفاء الأجهزة وإغلاق المحل"]
dv2 = DataValidation(type="list", formula1='"✓"', allow_blank=True); w2.add_data_validation(dv2)
for i, t in enumerate(CHECK):
    r = 15 + i; label(w2[f"A{r}"], t); inp(w2[f"B{r}"]); dv2.add(f"B{r}"); w2[f"B{r}"].font = font(color="1E6B34", bold=True, size=13)
w2.merge_cells("C15:D20"); w2["C15"] = '=COUNTIF(B15:B20,"✓")&" / 6"'; calc(w2["C15"], bold=True); w2["C15"].font = font(bold=True, size=18, color=TIF)
for r in range(15, 21): w2.row_dimensions[r].height = 22

hdr(w2["A22"], "ملاحظات ونواقص"); w2.merge_cells("A22:D22")
w2.merge_cells("A23:D27"); inp(w2["A23"], align="right"); w2["A23"].alignment = Alignment(horizontal="right", vertical="top", wrap_text=True)
for r in range(23, 28):
    for c in "ABCD": w2[f"{c}{r}"].border = BORDER; w2[f"{c}{r}"].fill = PatternFill("solid", fgColor=INPUT)
label(w2["A29"], "توقيع الموظف", True); inp(w2["B29"]); label(w2["C29"], "اعتماد المالك", True); inp(w2["D29"])
w2.row_dimensions[29].height = 30
w2.print_area = "A1:D29"

# ============ كل الأيام ============
w3 = wb.create_sheet("كل الأيام"); page(w3)
w3.page_setup.orientation = "landscape"
widths = (20, 13, 10, 14, 12, 12, 13, 12, 13, 12, 12, 10)
for i, w in enumerate(widths): w3.column_dimensions[chr(65 + i)].width = w
title(w3, "PEACOFF · كل الأيام", "لكل يوم: انسخ ورقة «تقفيل الشفت» (Move or Copy) وسمِّها بالتاريخ، ثم اكتب اسمها في العمود الأول · باقي الأعمدة تُسحب تلقائيًا", 12)
ex_row = 4
for c, v in zip("ABCDEFGHIJKL", ("مثال: 2026-11-20", "", "صباحي", "", "", "", "", "", "", "", "", "")):
    cell = w3[f"{c}{ex_row}"]; cell.value = v or None; cell.font = font(italic=True, color="8A9496", size=9); cell.alignment = Alignment(horizontal="center")
heads = ("اسم ورقة اليوم", "التاريخ", "الشفت", "الموظف", "نقدي", "بطاقة / Apple Pay", "الإجمالي", "مصروفات الدرج", "المتوقع", "المعدود", "الفرق", "الإغلاق")
for i, h in enumerate(heads): hdr(w3.cell(row=6, column=i + 1), h)
w3.row_dimensions[6].height = 30
src = (None, "B4", "D4", "B5", "B8", "B9", "B10", "D9", "D10", "D11", "D12", "C15")
fmts = (None, "yyyy-mm-dd", None, None, money, money, money, money, money, money, signed, None)
R0, R1 = 7, 37  # 31 يومًا
def pull(r, ref):
    t = f"INDIRECT(\"'\"&$A{r}&\"'!{ref}\")"
    return f'=IF($A{r}="","",IFERROR(IF({t}="","",{t}),"؟"))'
for r in range(R0, R1 + 1):
    inp(w3[f"A{r}"], align="center")
    for j in range(1, 12):
        c = w3.cell(row=r, column=j + 1); c.value = pull(r, src[j]); calc(c, fmts[j]); c.fill = PatternFill("fill" if False else "solid", fgColor="FFFFFF")
    w3.row_dimensions[r].height = 20
T = R1 + 1
label(w3[f"A{T}"], "المجموع", True); w3[f"A{T}"].alignment = Alignment(horizontal="center"); w3[f"A{T}"].fill = PatternFill("solid", fgColor=PALE)
for j in range(1, 12):
    col = chr(65 + j); c = w3[f"{col}{T}"]
    if col in "EFGHIJK": c.value = f"=SUM({col}{R0}:{col}{R1})"
    calc(c, fmts[j], True)
w3.conditional_formatting.add(f"K{R0}:K{R1}", FormulaRule(formula=[f'AND(ISNUMBER(K{R0}),K{R0}<>0)'], font=Font(name=F, bold=True, color="B71C1C"), fill=red))
# إحصائيات
S = T + 2
stats = (("عدد الشفتات المسجّلة", f'=COUNTIF(G{R0}:G{R1},">0")', "0"),
         ("متوسط مبيعات الشفت", f'=IFERROR(G{T}/B{S},0)', money),
         ("عدد الشفتات التي فيها فرق", f'=SUMPRODUCT(ISNUMBER(K{R0}:K{R1})*(K{R0}:K{R1}<>0))', "0"),
         ("صافي الفروق (+/−)", f"=K{T}", signed))
for i, (t, f_, nf) in enumerate(stats):
    r = S + i
    w3.merge_cells(start_row=r, start_column=3, end_row=r, end_column=5); label(w3[f"C{r}"], t, True)
    for cc in "DE": w3[f"{cc}{r}"].border = BORDER
    w3[f"B{r}"] = f_; calc(w3[f"B{r}"], nf, True)
w3.print_area = f"A1:L{S+3}"

# ============ توحيد تصميم ورقتي التقفيل وكل الأيام مع الجرد ============
def restyle(ws, ncols, ttl, sub, legend_row):
    from openpyxl.utils import get_column_letter as L
    legend = ws["A2"].value
    for rng in list(ws.merged_cells.ranges):
        if rng.min_row in (1, 2) and rng.max_row in (1, 2): ws.unmerge_cells(str(rng))
    ws["A1"].value = None; ws["A2"].value = None
    for r_ in (1, 2):
        for ci in range(1, ncols + 1):
            c = ws.cell(row=r_, column=ci); c.fill = PatternFill("solid", fgColor=INK)
    for ci in range(1, ncols + 1): ws.cell(row=3, column=ci).fill = PatternFill("solid", fgColor=TIFD)
    ws.row_dimensions[1].height = 36; ws.row_dimensions[2].height = 22; ws.row_dimensions[3].height = 3
    last = L(ncols)
    ws.merge_cells(f"B1:{last}1"); ws["B1"] = ttl; ws["B1"].font = Font(name=F, bold=True, size=20, color="FFFFFF"); ws["B1"].alignment = Alignment(horizontal="right", vertical="center")
    ws.merge_cells(f"B2:{last}2"); ws["B2"] = sub; ws["B2"].font = Font(name=F, size=8, color=TIFF, bold=True); ws["B2"].alignment = Alignment(horizontal="right", vertical="center")
    ws.merge_cells(f"A{legend_row}:{last}{legend_row}"); ws[f"A{legend_row}"] = legend; ws[f"A{legend_row}"].font = Font(name=F, size=8, italic=True, color="59666A"); ws[f"A{legend_row}"].alignment = Alignment(horizontal="right", vertical="center")
    im = XLImage("/home/user/Claude-BugHunter/peacoff_data/design/logo/symbol_tiffany.png"); im.height = 52; im.width = int(52*739/1669); ws.add_image(im, "A1")
    for row in ws.iter_rows(min_row=4):
        for c in row:
            rgb = (c.fill.fgColor.rgb or "") if c.fill and c.fill.fill_type else ""
            if rgb.endswith("FFF9C4"): c.fill = PatternFill("solid", fgColor=CREAM)
            elif rgb.endswith("E9F4F4"): c.fill = PatternFill("solid", fgColor=SAND)
            elif rgb.endswith("2B3032"):
                c.fill = PatternFill("solid", fgColor=INK); c.border = Border(bottom=Side(style="medium", color=TIFF))
            if c.border and c.border.left and c.border.left.style == "thin":
                c.border = Border(left=thin2, right=thin2, top=thin2, bottom=thin2) if rgb.endswith("2B3032") is False else c.border
            if c.font and c.font.color is not None and c.font.color.rgb and str(c.font.color.rgb).endswith("0000FF"):
                c.font = Font(name=F, size=c.font.size or 11, bold=c.font.bold, color=INK)
restyle(w2, 4, "تقفيل الشفت  ·  SHIFT CLOSING", "P E A C O F F   ·   COFFEE & MORE", 6)
restyle(w3, 12, "كل الأيام  ·  ALL DAYS", "P E A C O F F   ·   COFFEE & MORE", 5)
w2["B4"].value = w2["B4"].value

wb.save(OUT)
print("saved", OUT)
