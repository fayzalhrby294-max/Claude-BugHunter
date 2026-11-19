const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const F=path.join(__dirname,'fonts/node_modules/@fontsource');
const b=(p)=>fs.readFileSync(path.join(F,p)).toString('base64');
const sym='data:image/png;base64,'+fs.readFileSync('/home/user/Claude-BugHunter/peacoff_data/design/logo/symbol_tiffany.png').toString('base64');
const AR='U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F,U+2010-2011,U+25CC',LA='U+0000-00FF,U+2013-2014,U+2022,U+00B7';
const ff=(fam,w,f,r)=>`@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${b(f)});unicode-range:${r}}`;
const css=[400,600,700].flatMap(w=>[ff('NSA',w,`noto-sans-arabic/files/noto-sans-arabic-arabic-${w}-normal.woff2`,AR),ff('NSA',w,`open-sans/files/open-sans-latin-${w}-normal.woff2`,LA)]).join('');
const COLS=[['التاريخ',22],['الشفت',15],['الموظف',27],['نقدي',21],['بطاقة / Apple Pay',27],['الإجمالي',23],['مصروفات الدرج',24],['المتوقع',22],['المعدود',22],['الفرق',20],['الإغلاق',16]];
const rows=Array.from({length:31},(_,i)=>`<tr><td class="d">${i+1}</td>${COLS.map(()=>'<td></td>').join('')}</tr>`).join('');
const html=`<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>${css}
@page{size:A4 landscape;margin:0}*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'NSA',sans-serif;color:#23272a;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:297mm;height:210mm;position:relative;overflow:hidden}
.top{background:#23272a;height:22mm;padding:0 14mm;display:flex;align-items:center;justify-content:space-between;border-bottom:1.1mm solid #2f9a9b}
.top img{height:16mm}
.ttl{text-align:right}.ttl h1{font-size:21pt;font-weight:700;color:#fff;line-height:1.1}.ttl p{font-size:7.6pt;font-weight:600;color:#55C5C6;letter-spacing:.42em;direction:ltr;text-align:right;margin-top:1mm}
.in{padding:4mm 12mm 0}
.fl{display:grid;grid-template-columns:1fr 1fr;gap:10mm;margin-bottom:3mm}
.f{display:flex;align-items:flex-end;gap:3mm;font-size:9pt;font-weight:600}.f span{background:#f1ece0;padding:.8mm 4mm;border-bottom:.5mm solid #2f9a9b;white-space:nowrap}.f i{flex:1;border-bottom:.3mm solid #8b9293;height:5mm}
table{width:100%;border-collapse:collapse;table-layout:fixed}
th{background:#23272a;color:#fff;font-size:7.4pt;font-weight:600;padding:1.6mm 1mm;border-bottom:.6mm solid #55C5C6;text-align:center;line-height:1.25}
td{height:4.45mm;border-bottom:.22mm solid #d5dada;border-left:.2mm solid #e6eaea;background:#fbf8f1}
td.d{background:#f1ece0;text-align:center;font-size:6.6pt;font-weight:600;color:#2f7d7e;width:8mm}
tr.tot td{background:#f1ece0;border-bottom:.4mm solid #2f9a9b;height:6mm;font-weight:700;font-size:8.4pt;padding-right:2mm}
.st{display:grid;grid-template-columns:repeat(4,1fr);gap:6mm;margin-top:3mm}
.st div{border-top:.6mm solid #2f9a9b;border-bottom:.25mm solid #d5dada;padding:1mm 3mm;display:flex;justify-content:space-between;align-items:flex-end;height:9mm}.st small{font-size:7.6pt;font-weight:600;color:#6b7678}.st i{flex:1;border-bottom:.3mm solid #8b9293;margin-right:3mm;height:4mm}
</style></head><body><section class="pg">
<div class="top"><div class="ttl"><h1>كل الأيام</h1><p>ALL DAYS · PEACOFF</p></div><img src="${sym}"></div>
<div class="in">
<div class="fl"><div class="f"><span>الشهر</span><i></i></div><div class="f"><span>المسؤول</span><i></i></div></div>
<table><thead><tr><th style="width:8mm">#</th>${COLS.map(([t,w])=>`<th style="width:${w}mm">${t}</th>`).join('')}</tr></thead><tbody>${rows}
<tr class="tot"><td class="d" style="height:6mm"></td><td colspan="3">المجموع</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>
<div class="st"><div><small>عدد الشفتات</small><i></i></div><div><small>متوسط مبيعات الشفت</small><i></i></div><div><small>شفتات فيها فرق</small><i></i></div><div><small>صافي الفروق</small><i></i></div></div>
</div></section></body></html>`;
(async()=>{const br=await chromium.launch();const p=await br.newPage();await p.setContent(html);await p.evaluate(()=>document.fonts.ready);
await p.pdf({path:path.join(OUT,'PEACOFF_all_days_print_A4.pdf'),format:'A4',landscape:true,printBackground:true,margin:{top:0,bottom:0,left:0,right:0}});await br.close();console.log('ok');})();
