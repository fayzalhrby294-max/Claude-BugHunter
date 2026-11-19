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

# ============ الجرد ============
ws = wb.active; ws.title = "الجرد"; page(ws)
for col, w in zip("ABCDE", (30, 12, 14, 14, 16)): ws.column_dimensions[col].width = w
title(ws, "PEACOFF · الجرد", "املأ الخانات الصفراء فقط · الحالة تُحسب تلقائيًا: «اطلب» إذا كان الموجود ≤ الحد الأدنى", 5)
label(ws["A4"], "التاريخ", True); inp(ws["B4"], "yyyy-mm-dd"); ws.merge_cells("B4:C4")
label(ws["D4"], "المسؤول", True); inp(ws["E4"])
for c, t in zip("ABCDE", ("الصنف", "الوحدة", "الموجود", "الحد الأدنى", "الحالة")): hdr(ws[f"{c}6"], t)
ws.row_dimensions[6].height = 24
# سطر مثال (يُحذف)
ex = 7
for c, v in zip("ABCD", ("مثال (احذف السطر): حليب تجريبي", "عبوة", 12, 5)): ws[f"{c}{ex}"] = v
for c in "ABCD":
    ws[f"{c}{ex}"].font = font(italic=True, color="8A9496", size=10); ws[f"{c}{ex}"].alignment = Alignment(horizontal="center" if c != "A" else "right"); ws[f"{c}{ex}"].border = BORDER
BEANS = ["Haraz · حراز", "Safari · سفاري", "Hambela · هامبيلا", "Guji Korma · قوجي كورما", "Caldas · كالداس"]
first, last = 8, 8 + 20 - 1  # 20 صفًا
for r in range(first, last + 1):
    i = r - first
    c = ws[f"A{r}"]; inp(c, align="right")
    if i < len(BEANS): c.value = BEANS[i]
    b = ws[f"B{r}"]; inp(b)
    if i < len(BEANS): b.value = "كجم"
    inp(ws[f"C{r}"], "#,##0.##"); inp(ws[f"D{r}"], "#,##0.##")
    ws.row_dimensions[r].height = 22
for r in range(ex, last + 1):
    s = ws[f"E{r}"]; s.value = f'=IF(OR(C{r}="",D{r}=""),"",IF(C{r}<=D{r},"اطلب","✓"))'; calc(s, bold=True)
ws.row_dimensions[ex].height = 22
red = PatternFill("solid", bgColor="F8D7DA", fgColor="F8D7DA")
ws.conditional_formatting.add(f"E{ex}:E{last}", CellIsRule(operator="equal", formula=['"اطلب"'], fill=red, font=Font(name=F, bold=True, color="B71C1C")))
ws.cell(row=last + 2, column=1, value="ملاحظة: الأصناف الخمسة الأولى من البن المعتمد؛ باقي الصفوف فارغة لأصنافك. الحد الأدنى تحدده أنت.").font = font(size=9, italic=True, color="59666A")
ws.merge_cells(start_row=last + 2, start_column=1, end_row=last + 2, end_column=5)
ws.print_area = f"A1:E{last+2}"

# ============ تقفيل الشفت ============
w2 = wb.create_sheet("تقفيل الشفت"); page(w2)
for col, w in zip("ABCD", (30, 18, 30, 18)): w2.column_dimensions[col].width = w
title(w2, "PEACOFF · تقفيل الشفت", "املأ الخانات الصفراء فقط · الإجمالي والمتوقع والفرق تُحسب تلقائيًا · انسخ الورقة (Move or Copy) لكل يوم", 4)
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
wb.save(OUT)
print("saved", OUT)
