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


const BEANS=['Haraz · حراز','Safari · سفاري','Hambela · هامبيلا','Guji Korma · قوجي كورما','Caldas · كالداس'];
const irow=(n)=>`<tr><td style="font-weight:600;font-size:10pt">${n||''}</td><td></td><td></td><td></td></tr>`;
const inv=`<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>@page{size:A4;margin:0}${base}
.pg{width:210mm;height:297mm;padding:12mm 14mm}.meta{grid-template-columns:1fr 1fr}
.f{font-size:10pt}td{height:9.4mm;font-size:10pt}th{font-size:9.5pt;padding:2mm}
</style></head><body><section class="pg">
<div class="hdr"><img src="${sym}"><div class="t">PEACOFF · الجرد<small>INVENTORY</small></div></div>
<div class="meta">${field('التاريخ')}${field('المسؤول')}</div>
<table><thead><tr><th style="width:62mm">الصنف</th><th style="width:30mm">الوحدة</th><th style="width:34mm">الموجود</th><th>المطلوب طلبه</th></tr></thead><tbody>
${BEANS.map(irow).join('')}${Array.from({length:15},()=>irow('')).join('')}
</tbody></table>
<div style="margin-top:6mm">${field('توقيع المسؤول')}</div>
</section></body></html>`;
const chk=(t)=>`<div style="display:flex;align-items:center;font-size:10.5pt;padding:2mm 0;border-bottom:.2mm dotted #b8bfc0"><span class="ck" style="width:4.6mm;height:4.6mm"></span>${t}</div>`;
const CHECK=['إغلاق نقطة البيع وطباعة تقرير الإقفال','تنظيف الماكينات والطواحين والبار','رمي المنتهي، وملصقات التاريخ على المحضّر','إغلاق الثلاجة','إخراج النفايات','إطفاء الأجهزة وإغلاق المحل'];
const bx=(rows)=>`<table><tbody>${rows.map(r=>`<tr><td style="width:55%;font-size:10.5pt;height:10mm">${r}</td><td></td></tr>`).join('')}</tbody></table>`;
const shift=`<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>@page{size:A4;margin:0}${base}
.pg{width:210mm;height:297mm;padding:12mm 14mm}.meta{grid-template-columns:1fr 1fr 1fr}.f{font-size:10pt}
.two{display:grid;grid-template-columns:1fr 1fr;gap:6mm}h3{font-size:10.5pt;padding:1.6mm 3mm;margin:6mm 0 2mm}
</style></head><body><section class="pg">
<div class="hdr"><img src="${sym}"><div class="t">PEACOFF · تقفيل الشفت<small>SHIFT CLOSING</small></div></div>
<div class="meta">${field('التاريخ')}${field('الشفت')}${field('الموظف')}</div>
<div class="two"><div><h3>المبيعات</h3>${bx(['نقدي','مدى / بطاقة / Apple Pay','الإجمالي'])}</div>
<div><h3>النقد في الدرج</h3>${bx(['بداية الشفت','مصروفات من الدرج','المعدود الآن','الفرق'])}</div></div>
<h3>قبل الإغلاق</h3>${CHECK.map(chk).join('')}
<h3>ملاحظات ونواقص</h3><div style="border:.25mm solid #9aa3a4;height:46mm;border-radius:1mm"></div>
<div style="margin-top:8mm;display:flex;gap:12mm">${field('توقيع الموظف','flex:1')}${field('اعتماد المالك','flex:1')}</div>
</section></body></html>`;
(async()=>{const br=await chromium.launch();const p=await br.newPage();
for(const [h,n,o] of [[inv,'PEACOFF_inventory_simple_A4.pdf',{}],[shift,'PEACOFF_shift_closing_simple_A4.pdf',{}]]){
 await p.setContent(h);await p.evaluate(()=>document.fonts.ready);
 await p.pdf({path:path.join(OUT,n),format:'A4',printBackground:true,margin:{top:0,bottom:0,left:0,right:0},...o});}
await br.close();console.log('ok');})();
