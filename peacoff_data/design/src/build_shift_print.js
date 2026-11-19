const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const F=path.join(__dirname,'fonts/node_modules/@fontsource');
const b=(p)=>fs.readFileSync(path.join(F,p)).toString('base64');
const sym='data:image/png;base64,'+fs.readFileSync('/home/user/Claude-BugHunter/peacoff_data/design/logo/symbol_tiffany.png').toString('base64');
const AR='U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F,U+2010-2011,U+25CC',LA='U+0000-00FF,U+2013-2014,U+2022,U+00B7';
const ff=(fam,w,f,r)=>`@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${b(f)});unicode-range:${r}}`;
const css=[400,600,700].flatMap(w=>[ff('NSA',w,`noto-sans-arabic/files/noto-sans-arabic-arabic-${w}-normal.woff2`,AR),ff('NSA',w,`open-sans/files/open-sans-latin-${w}-normal.woff2`,LA)]).join('');
const CHECK=['إغلاق نقطة البيع وطباعة تقرير الإقفال','تنظيف الماكينات والطواحين والبار','رمي المنتهي، وملصقات التاريخ على المحضّر','إغلاق الثلاجة','إخراج النفايات','إطفاء الأجهزة وإغلاق المحل'];
const box=(title,en,rows)=>`<div class="bx"><div class="bh"><b>${title}</b><span>${en}</span></div><table>${rows.map(([t,k])=>`<tr class="${k||''}"><td class="l">${t}</td><td class="v"></td></tr>`).join('')}</table></div>`;
const html=`<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>${css}
@page{size:A4;margin:0}*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'NSA',sans-serif;color:#23272a;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:210mm;height:297mm;position:relative;overflow:hidden}
.top{background:#23272a;height:36mm;padding:0 16mm;display:flex;align-items:center;justify-content:space-between;border-bottom:1.2mm solid #2f9a9b}
.top img{height:23mm}
.ttl{text-align:right}.ttl h1{font-size:28pt;font-weight:700;color:#fff;line-height:1.1}.ttl p{font-size:8.5pt;font-weight:600;color:#55C5C6;letter-spacing:.42em;direction:ltr;text-align:right;margin-top:1.4mm}
.in{padding:7mm 14mm 0}
.fl{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6mm;margin-bottom:6mm}
.f{display:flex;align-items:flex-end;gap:3mm;font-size:10pt;font-weight:600}.f span{background:#f1ece0;padding:1.2mm 4mm;border-bottom:.6mm solid #2f9a9b;white-space:nowrap}.f i{flex:1;border-bottom:.3mm solid #8b9293;height:6mm}
.two{display:grid;grid-template-columns:1fr 1fr;gap:6mm}
.bh{background:#23272a;border-bottom:.7mm solid #55C5C6;padding:2.3mm 4mm;display:flex;justify-content:space-between;align-items:center}.bh b{color:#fff;font-size:9.5pt}.bh span{color:#55C5C6;font-size:6.6pt;font-weight:600;letter-spacing:.24em;direction:ltr}
table{width:100%;border-collapse:collapse}
td{height:8.4mm;border-bottom:.25mm solid #d5dada;font-size:9.6pt}
td.l{padding-right:4mm;font-weight:600;width:58%;background:#fff}td.v{background:#fbf8f1;border-right:.2mm solid #e6eaea}
tr.tot td{background:#f1ece0;font-weight:700;border-bottom:.35mm solid #2f9a9b}tr.tot td.v{background:#f1ece0}
.sec{margin-top:6mm}
.ck{display:grid;grid-template-columns:1fr;border-top:.7mm solid #2f9a9b}
.ck div{display:flex;align-items:center;gap:3.4mm;padding:0 4mm;height:8.4mm;border-bottom:.25mm solid #d5dada;font-size:9.8pt;font-weight:600;background:#fbf8f1}
.ck i{width:4.2mm;height:4.2mm;border:.35mm solid #59666a;border-radius:.8mm;background:#fff;flex:none}
.nt{border:.3mm solid #cfd5d5;border-top:.7mm solid #2f9a9b;height:34mm;background:#fbf8f1}
.sg{display:grid;grid-template-columns:1fr 1fr;gap:10mm;margin-top:8mm}
.note{margin-top:2mm;font-size:6.8pt;color:#7d8788}
.foot{position:absolute;bottom:6mm;left:0;right:0;text-align:center;font-size:7pt;color:#8a9496;letter-spacing:.2em}
</style></head><body><section class="pg">
<div class="top"><div class="ttl"><h1>تقفيل الشفت</h1><p>SHIFT CLOSING · PEACOFF</p></div><img src="${sym}"></div>
<div class="in">
<div class="fl"><div class="f"><span>التاريخ</span><i></i></div><div class="f"><span>الشفت</span><i></i></div><div class="f"><span>الموظف</span><i></i></div></div>
<div class="two">
${box('المبيعات','SALES',[['نقدي'],['مدى / بطاقة / Apple Pay'],['الإجمالي','tot']])}
${box('النقد في الدرج','CASH DRAWER',[['بداية الشفت'],['مصروفات من الدرج (بفواتير)'],['المتوقع في الدرج','tot'],['المعدود الآن'],['الفرق (+ / −)','tot']])}
</div>
<div class="note">المتوقع = بداية الشفت + المبيعات النقدية − المصروفات · الفرق = المعدود − المتوقع</div>
<div class="sec"><div class="bh"><b>قبل الإغلاق</b><span>BEFORE CLOSING</span></div><div class="ck">${CHECK.map(t=>`<div><i></i>${t}</div>`).join('')}</div></div>
<div class="sec"><div class="bh"><b>ملاحظات ونواقص</b><span>NOTES</span></div><div class="nt"></div></div>
<div class="sg"><div class="f"><span>توقيع الموظف</span><i></i></div><div class="f"><span>اعتماد المالك</span><i></i></div></div>
</div><div class="foot">COFFEE &amp; MORE</div></section></body></html>`;
(async()=>{const br=await chromium.launch();const p=await br.newPage();await p.setContent(html);await p.evaluate(()=>document.fonts.ready);
await p.pdf({path:path.join(OUT,'PEACOFF_shift_closing_print_A4.pdf'),format:'A4',printBackground:true,margin:{top:0,bottom:0,left:0,right:0}});await br.close();console.log('ok');})();
