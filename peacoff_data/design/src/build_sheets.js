const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const F=path.join(__dirname,'fonts/node_modules/@fontsource');
const b=(p)=>fs.readFileSync(path.join(F,p)).toString('base64');
const sym='data:image/png;base64,'+fs.readFileSync('/home/user/Claude-BugHunter/peacoff_data/design/logo/symbol_tiffany.png').toString('base64');
const AR='U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F,U+2010-2011,U+25CC',LA='U+0000-00FF,U+2013-2014,U+2022,U+00B7';
const ff=(fam,w,f,r)=>`@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${b(f)});unicode-range:${r}}`;
const css0=[400,600,700].flatMap(w=>[ff('NSA',w,`noto-sans-arabic/files/noto-sans-arabic-arabic-${w}-normal.woff2`,AR),ff('NSA',w,`open-sans/files/open-sans-latin-${w}-normal.woff2`,LA)]).join('');
const base=`${css0}
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'NSA',sans-serif;color:#2b3032;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.hdr{display:flex;align-items:center;justify-content:space-between;border-bottom:.5mm solid #2f9a9b;padding-bottom:2.2mm;margin-bottom:3mm}
.hdr .t{font-size:17pt;font-weight:700;color:#2b3032}.hdr .t small{display:block;font-size:7pt;letter-spacing:.3em;color:#2f9a9b;font-weight:600;margin-top:.5mm}
.hdr img{height:13mm}
.meta{display:grid;gap:2mm 5mm;margin-bottom:3mm}
.f{display:flex;align-items:flex-end;gap:1.5mm;font-size:8.5pt;font-weight:600}.f i{flex:1;border-bottom:.25mm solid #8b9293;height:5mm}
h3{font-size:9pt;font-weight:700;color:#fff;background:#2b3032;padding:1mm 2.5mm;border-radius:1mm;margin:3mm 0 1.2mm}
table{width:100%;border-collapse:collapse}th{background:#e9f4f4;font-size:7.6pt;font-weight:700;border:.25mm solid #9aa3a4;padding:1mm}
td{border:.25mm solid #9aa3a4;height:7.4mm;font-size:8.5pt;padding:0 1.5mm}
.sec td{background:#f1f3f3;font-weight:700;font-size:8pt;color:#2f7d7e;height:6mm}
.ck{display:inline-block;width:3.6mm;height:3.6mm;border:.3mm solid #2b3032;border-radius:.7mm;vertical-align:middle;margin-left:1.6mm}
.foot{font-size:6.6pt;color:#7d8788;margin-top:2mm;text-align:center}`;
const field=(l,w='')=>`<div class="f" style="${w}"><span>${l}</span><i></i></div>`;

// ===== ورقة الجرد (أفقي) =====
const BEANS=['Haraz · حراز','Safari · سفاري','Hambela · هامبيلا','Guji Korma · قوجي كورما','Caldas · كالداس'];
const row=(name,unit)=>`<tr><td style="width:46mm;font-weight:600">${name||''}</td><td style="width:14mm;text-align:center;color:#59a">${unit||''}</td><td></td><td></td><td></td><td></td><td></td><td></td><td style="width:42mm"></td></tr>`;
const blanks=(n)=>Array.from({length:n},()=>row('','')).join('');
const inv=`<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>@page{size:A4 landscape;margin:0}${base}
.pg{width:297mm;height:210mm;padding:9mm 11mm}
.meta{grid-template-columns:1.3fr 1fr 1fr 1fr}
td{height:6.6mm}
</style></head><body><section class="pg">
<div class="hdr"><img src="${sym}"><div class="t">PEACOFF · ورقة الجرد<small>INVENTORY SHEET</small></div></div>
<div class="meta">${field('التاريخ')}${field('نوع الجرد (يومي / أسبوعي / شهري)')}${field('اسم المسؤول')}${field('الوقت')}</div>
<table><thead><tr><th>الصنف</th><th>الوحدة</th><th>رصيد أول المدة</th><th>وارد</th><th>مستخدم / مباع</th><th>تالف / هدر</th><th>الرصيد الفعلي (عدّ)</th><th>الحد الأدنى</th><th>ملاحظات</th></tr></thead>
<tbody>
<tr class="sec"><td colspan="9">البن · COFFEE BEANS</td></tr>
${BEANS.map(n=>row(n,'كجم')).join('')}
<tr class="sec"><td colspan="9">مشروبات ومكوّنات · DRINKS &amp; INGREDIENTS</td></tr>
${blanks(5)}
<tr class="sec"><td colspan="9">تغليف ومستلزمات · PACKAGING &amp; SUPPLIES</td></tr>
${blanks(5)}
<tr class="sec"><td colspan="9">أخرى · OTHER</td></tr>
${blanks(2)}
</tbody></table>
<div style="display:flex;justify-content:space-between;margin-top:4mm;gap:12mm">${field('توقيع المسؤول','flex:1')}${field('اعتماد المالك','flex:1')}</div>
<div class="foot">الفرق = (رصيد أول المدة + وارد − مستخدم − تالف) − الرصيد الفعلي · اكتب الوحدة الفعلية لكل صنف (كجم / جرام / عبوة / قطعة)</div>
</section></body></html>`;

// ===== ورقة تقفيل الشفت (عمودي) =====
const chk=(t)=>`<div style="display:flex;align-items:center;font-size:8.3pt;padding:.9mm 0;border-bottom:.2mm dotted #b8bfc0"><span class="ck"></span>${t}</div>`;
const CHECK=['إغلاق نقطة البيع وطباعة تقرير الإقفال','تنظيف الماكينات والطواحين وفتح/تفريغ مجمّع القهوة','تنظيف الأسطح والبار والأرضية','رمي المنتهي والمفتوح، والتأكد من ملصقات التاريخ على كل محضّر','تعبئة النواقص وتسجيلها في ورقة الجرد','فحص الثلاجة والمجمّد وإغلاقهما','إفراغ النفايات','إطفاء الأجهزة وفصل ما يلزم','إغلاق الأبواب والمحل'];
const lines=(n)=>Array.from({length:n},()=>`<tr><td></td><td style="width:30mm"></td><td style="width:34mm"></td></tr>`).join('');
const shift=`<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>@page{size:A4;margin:0}${base}
.pg{width:210mm;height:297mm;padding:8mm 12mm;overflow:hidden}
.m4{grid-template-columns:1fr 1fr 1fr}.two{display:grid;grid-template-columns:1fr 1fr;gap:4mm}
td{height:5.5mm}h3{margin:2.2mm 0 1mm}.hdr{margin-bottom:2mm}.meta{margin-bottom:1mm;gap:1mm 5mm}
.tot td{background:#e9f4f4;font-weight:700}
</style></head><body><section class="pg">
<div class="hdr"><img src="${sym}"><div class="t">PEACOFF · تقفيل الشفت<small>SHIFT CLOSING</small></div></div>
<div class="meta m4">${field('التاريخ')}${field('اليوم')}${field('الشفت (صباحي / مسائي)')}${field('من الساعة')}${field('إلى الساعة')}${field('الموظف المسؤول')}</div>

<div class="two"><div>
<h3>١ · المبيعات حسب طريقة الدفع (من نقطة البيع)</h3>
<table><tbody>
<tr><td style="width:46%">نقدي</td><td></td></tr><tr><td>مدى / بطاقة</td><td></td></tr><tr><td>Apple Pay</td><td></td></tr><tr><td>أخرى (حدّد)</td><td></td></tr>
<tr class="tot"><td>الإجمالي</td><td></td></tr><tr><td>عدد الفواتير</td><td></td></tr></tbody></table>
</div><div>
<h3>٢ · الصندوق (النقد فقط)</h3>
<table><tbody>
<tr><td style="width:62%">رصيد الدرج أول الشفت</td><td></td></tr><tr><td>+ مبيعات نقدية</td><td></td></tr><tr><td>− مصروفات من الدرج</td><td></td></tr>
<tr class="tot"><td>المتوقع في الدرج</td><td></td></tr><tr><td>المعدود فعليًا</td><td></td></tr><tr class="tot"><td>الفرق (+ / −)</td><td></td></tr></tbody></table>
</div></div>

<h3>٣ · مصروفات من الدرج (بفواتير فقط)</h3>
<table><thead><tr><th>البيان</th><th>المبلغ</th><th>رقم الفاتورة</th></tr></thead><tbody>${lines(3)}</tbody></table>

<div class="two"><div>
<h3>٤ · مرتجعات وخصومات</h3>
<table><thead><tr><th>السبب</th><th style="width:20mm">العدد</th><th style="width:24mm">المبلغ</th></tr></thead><tbody><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table>
</div><div>
<h3>٥ · هدر وتالف</h3>
<table><thead><tr><th>الصنف</th><th style="width:20mm">الكمية</th><th style="width:24mm">السبب</th></tr></thead><tbody><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table>
</div></div>

<div class="two"><div>
<h3>٦ · قائمة الإقفال</h3>${CHECK.map(chk).join('')}
</div><div>
<h3>٧ · تسليم النقد</h3>
${field('المبلغ المسلَّم','margin-bottom:2mm')}${field('المستلم','margin-bottom:2mm')}${field('الوقت','margin-bottom:2mm')}
<div class="f" style="margin-bottom:2mm"><span>درجة حرارة الثلاجة</span><i></i></div>
<h3>٨ · أعطال ونواقص للطلب</h3>
<div style="border:.25mm solid #9aa3a4;height:26mm;border-radius:1mm"></div>
</div></div>

<h3>٩ · ملاحظات</h3><div style="border:.25mm solid #9aa3a4;height:12mm;border-radius:1mm"></div>
<div style="display:flex;justify-content:space-between;margin-top:3mm;gap:10mm">${field('توقيع الموظف','flex:1')}${field('توقيع المسؤول / المالك','flex:1')}</div>
<div class="foot">أموال المحل لا تُخلط بأموال شخصية · مبيعات نقطة البيع تُسجَّل كما في تقرير الإقفال وليس من الإيداعات</div>
</section></body></html>`;
(async()=>{const br=await chromium.launch();const p=await br.newPage();
for(const [h,n,o] of [[inv,'PEACOFF_inventory_sheet_A4_landscape.pdf',{landscape:true}],[shift,'PEACOFF_shift_closing_A4.pdf',{}]]){
 await p.setContent(h);await p.evaluate(()=>document.fonts.ready);
 await p.pdf({path:path.join(OUT,n),format:'A4',printBackground:true,margin:{top:0,bottom:0,left:0,right:0},...o});}
await br.close();console.log('ok');})();
