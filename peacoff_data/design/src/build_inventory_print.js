const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const F=path.join(__dirname,'fonts/node_modules/@fontsource');
const b=(p)=>fs.readFileSync(path.join(F,p)).toString('base64');
const sym='data:image/png;base64,'+fs.readFileSync('/home/user/Claude-BugHunter/peacoff_data/design/logo/symbol_tiffany.png').toString('base64');
const AR='U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F,U+2010-2011,U+25CC',LA='U+0000-00FF,U+2013-2014,U+2022,U+00B7';
const ff=(fam,w,f,r)=>`@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${b(f)});unicode-range:${r}}`;
const css=[400,600,700].flatMap(w=>[ff('NSA',w,`noto-sans-arabic/files/noto-sans-arabic-arabic-${w}-normal.woff2`,AR),ff('NSA',w,`open-sans/files/open-sans-latin-${w}-normal.woff2`,LA)]).join('');
const GROUPS=[['البن','COFFEE BEANS',['Haraz · حراز','Safari · سفاري','Hambela · هامبيلا','Guji Korma · قوجي كورما','Caldas · كالداس'],'كجم'],
 ['مشروبات ومكوّنات','DRINKS & INGREDIENTS',['','','','',''],''],['تغليف ومستلزمات','PACKAGING & SUPPLIES',['','','','',''],''],['أخرى','OTHER',['','',''],'']];
const row=(n,u)=>`<tr><td class="nm">${n||''}</td><td class="c">${u||''}</td><td></td><td class="st"><span><i></i>اطلب</span><span><i></i>متوفر</span></td><td></td></tr>`;
const body=GROUPS.map(([a,e,items,u])=>`<tr class="band"><td colspan="5"><b>${a}</b><span>${e}</span></td></tr>${items.map(n=>row(n,u)).join('')}`).join('');
const html=`<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>${css}
@page{size:A4;margin:0}*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'NSA',sans-serif;color:#23272a;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:210mm;height:297mm;position:relative;overflow:hidden}
.top{background:#23272a;height:36mm;padding:0 16mm;display:flex;align-items:center;justify-content:space-between;border-bottom:1.2mm solid #2f9a9b}
.top img{height:23mm}
.ttl{text-align:right}.ttl h1{font-size:30pt;font-weight:700;color:#fff;line-height:1.1}.ttl p{font-size:8.5pt;font-weight:600;color:#55C5C6;letter-spacing:.42em;direction:ltr;text-align:right;margin-top:1.4mm}
.in{padding:7mm 14mm 0}
.fl{display:grid;grid-template-columns:1fr 1fr;gap:8mm;margin-bottom:6mm}
.f{display:flex;align-items:flex-end;gap:3mm;font-size:10pt;font-weight:600}.f span{background:#f1ece0;padding:1.2mm 4mm;border-bottom:.6mm solid #2f9a9b;white-space:nowrap}.f i{flex:1;border-bottom:.3mm solid #8b9293;height:6mm}
.sm{display:grid;grid-template-columns:repeat(3,1fr);gap:5mm;margin-bottom:6mm}
.sm div{border-top:.7mm solid #2f9a9b;border-bottom:.25mm solid #d5dada;padding:2mm 0 1.5mm;text-align:center;height:15mm}.sm small{display:block;font-size:8pt;font-weight:600;color:#6b7678}
table{width:100%;border-collapse:collapse}
th{background:#23272a;color:#fff;font-size:8.8pt;font-weight:600;padding:2.4mm 2mm;border-bottom:.7mm solid #55C5C6;text-align:center}th:first-child{text-align:right;padding-right:4mm}
td{height:7.4mm;border-bottom:.25mm solid #d5dada;border-left:.2mm solid #e6eaea;background:#fbf8f1;font-size:9.5pt}
td.nm{font-weight:700;padding-right:4mm;font-size:10pt}td.c{text-align:center;color:#59666a}
td.st{text-align:center;font-size:7.4pt;font-weight:600;background:#fff;white-space:nowrap}td.st span{display:inline-flex;align-items:center;gap:1mm;margin:0 1.6mm;color:#59666a}td.st i{display:inline-block;width:3mm;height:3mm;border:.3mm solid #59666a;border-radius:.6mm}
tr.band td{background:#f1ece0;border-bottom:.3mm solid #2f9a9b;height:7mm;padding-right:4mm}tr.band b{font-size:9pt;color:#2f7d7e;margin-left:3mm}tr.band span{font-size:7pt;font-weight:600;letter-spacing:.22em;color:#2f9a9b;direction:ltr;display:inline-block}
.sg{display:grid;grid-template-columns:1fr 1fr;gap:10mm;margin-top:6mm}
.foot{position:absolute;bottom:6mm;left:0;right:0;text-align:center;font-size:7pt;color:#8a9496;letter-spacing:.2em}
</style></head><body><section class="pg">
<div class="top"><div class="ttl"><h1>الجرد</h1><p>INVENTORY · PEACOFF</p></div><img src="${sym}"></div>
<div class="in">
<div class="fl"><div class="f"><span>التاريخ</span><i></i></div><div class="f"><span>المسؤول</span><i></i></div></div>
<div class="sm"><div><small>الأصناف المجرودة</small></div><div><small>تحتاج طلب</small></div><div><small>متوفرة</small></div></div>
<table><thead><tr><th style="width:56mm">الصنف</th><th style="width:17mm">الوحدة</th><th style="width:20mm">الموجود</th><th style="width:42mm">الحالة</th><th>ملاحظات</th></tr></thead><tbody>${body}</tbody></table>
<div class="sg"><div class="f"><span>توقيع المسؤول</span><i></i></div><div class="f"><span>اعتماد المالك</span><i></i></div></div>
</div><div class="foot">COFFEE &amp; MORE</div></section></body></html>`;
(async()=>{const br=await chromium.launch();const p=await br.newPage();await p.setContent(html);await p.evaluate(()=>document.fonts.ready);
await p.pdf({path:path.join(OUT,'PEACOFF_inventory_print_A4.pdf'),format:'A4',printBackground:true,margin:{top:0,bottom:0,left:0,right:0}});await br.close();console.log('ok');})();
