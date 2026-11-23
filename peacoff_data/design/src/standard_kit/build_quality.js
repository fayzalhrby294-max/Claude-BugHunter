const {C,LOGOS,baseCSS,plumage,fs,path}=require('../../winter/lib.js');const {chromium}=require('playwright');
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const D=[
{t:'V60',rows:[['القهوة','20 جم'],['الثلج','150 جم'],['الماء','3 صبات × 50 جم'],['الانتظار','30 ثانية'],['الطحن','حراز 6.1 · سفاري وكورما 5 · كالداس 5.2'],['حرارة الماء','سفاري 86° · الباقي 89°']]},
{t:'قهوة اليوم',rows:[['القهوة','100 جم'],['الثلج','500 جم'],['الطحن','7'],['الصغير','4 مكعبات + 155 مل'],['الكبير','8 مكعبات + 238 مل']]},
{t:'إسبريسو',rows:[['البن','18.5 جم'],['الطحن','15'],['حرارة الماء','90°'],['الضغط (5 ث لكل)','3 ثم 5 ثم 9 بار'],['الناتج والوقت','30 جم في 30 ثانية']]},
{t:'كركديه',rows:[['أول خطوة','غسل الكركديه'],['كركديه · سكر','80 جم · 187 جم'],['توت · شاي','70 جم · 7 جم'],['الماء','1100 مل · 90°'],['المدة','20 دقيقة ثم تصفية'],['الصغير','4 مكعبات + 150 مل'],['الكبير','8 مكعبات + 250 مل']]},
{t:'دارك شوكولاتة',rows:[['شوكولاتة','185 جم'],['زيت','25 مل'],['الميكرويف','Med: 30 ث ثم 20 ث وتقليب']]}];
const css=`${baseCSS}@page{size:A4;margin:0}*{margin:0;padding:0;box-sizing:border-box}body{color:${C.gun}}
.pg{width:210mm;height:297mm;position:relative;overflow:hidden;page-break-after:always;background:#fff}
.top{height:22mm;background:${C.gun};border-bottom:1.1mm solid ${C.tif};padding:0 12mm;display:flex;align-items:center;justify-content:space-between;position:relative;overflow:hidden}
.top .pl{position:absolute;inset:0;opacity:.3}.top img{height:12mm;position:relative}.top .t{position:relative;text-align:right}.top small{display:block;font-size:6.4pt;letter-spacing:.3em;color:${C.tif};direction:ltr;text-align:right}.top h1{font-size:17pt;color:#fff;font-weight:700;margin-top:.8mm}
.ft{position:absolute;left:12mm;right:12mm;bottom:7mm;display:flex;justify-content:space-between;font-size:6.5pt;color:#6b7678;letter-spacing:.2em}
.in{padding:6mm 12mm 0}.f{display:flex;gap:8mm;margin-bottom:4mm;font-size:9.6pt;font-weight:600}.f div{flex:1;border-bottom:.3mm solid #8b9293;padding-bottom:1mm}
.who{display:flex;gap:6mm;font-size:9.4pt;font-weight:600;margin-bottom:4mm;align-items:center}.who i{display:inline-block;width:3.6mm;height:3.6mm;border:.35mm solid #6b7678;margin-left:1.6mm;vertical-align:-.6mm}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:4mm}
.b{border:.3mm solid #d5dada;border-radius:1.6mm;overflow:hidden;break-inside:avoid}.h{background:${C.gun};color:#fff;padding:1.7mm 3.2mm;font-size:11pt;font-weight:700;border-bottom:.8mm solid ${C.tif}}
table{width:100%;border-collapse:collapse;font-size:8.2pt}th{background:#eef6f6;color:#2f7d7e;font-size:7pt;padding:.9mm 1.4mm;font-weight:700;text-align:right}
td{border-bottom:.22mm solid #e0e5e5;padding:1.5mm 1.4mm;vertical-align:middle}td.n{font-weight:600;white-space:nowrap}td.s{color:${C.gun};font-weight:700;white-space:nowrap}td.a{width:19mm;border-right:.22mm solid #e0e5e5;border-left:.22mm solid #e0e5e5}td.c{width:7mm;text-align:center}td.c i{display:inline-block;width:3.6mm;height:3.6mm;border:.35mm solid #6b7678}
.note{margin-top:4mm;border-right:1.2mm solid ${C.tif};background:#eef6f6;padding:2mm 4mm;font-size:8.6pt;line-height:1.7;font-weight:600}
.sc{display:flex;gap:1.2mm;justify-content:center}.sc i{display:inline-flex;width:5mm;height:5mm;border:.35mm solid #8b9293;border-radius:50%;font-style:normal;font-size:6.6pt;align-items:center;justify-content:center;color:#6b7678}
.tt th{background:${C.gun};color:#fff;font-size:7.6pt;text-align:center;padding:1.8mm 1mm}.tt td{padding:3.1mm 1.2mm;text-align:center}.tt td.n{text-align:right;font-size:9.4pt;font-weight:700}
.v{display:flex;gap:2.4mm;justify-content:center;font-size:7.6pt;font-weight:600}.v i{display:inline-block;width:3.4mm;height:3.4mm;border:.35mm solid #6b7678;margin-left:1mm;vertical-align:-.5mm}
.sig{display:flex;gap:10mm;margin-top:10mm;font-size:9.4pt;font-weight:600}.sig div{flex:1;border-top:.3mm solid #8b9293;padding-top:1.4mm}`;
const head=(t,s)=>`<div class="top"><div class="pl">${plumage(794,84,{r:24,line:C.tif,fill:C.gun,eye:C.tif,eyeOp:.8,lw:.8,op:.5,id:'t'})}</div><div class="t"><small>${s}</small><h1>${t}</h1></div><img src="${LOGOS.symT}"></div>`;
const box=d=>`<div class="b"><div class="h">${d.t}</div><table><tr><th>البند</th><th>المعيار</th><th>الفعلي</th><th></th></tr>${d.rows.map(r=>`<tr><td class="n">${r[0]}</td><td class="s">${r[1]}</td><td class="a"></td><td class="c"><i></i></td></tr>`).join('')}</table></div>`;
const sc=()=>`<div class="sc">${[1,2,3,4,5].map(n=>`<i>${n}</i>`).join('')}</div>`;
const html=`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>${css}</style></head><body>
<section class="pg">${head('اختبار الجودة (1/2): فحص المقادير','PEACOFF · QUALITY CHECK')}<div class="in">
<div class="f"><div>الاسم: </div><div>التاريخ: </div><div>الشفت: </div></div>
<div class="who"><span>من يُجري الاختبار:</span><span><i></i>موظف</span><span><i></i>مشرف</span><span><i></i>المؤسس</span></div>
<div class="grid"><div style="display:flex;flex-direction:column;gap:4mm">${box(D[0])}${box(D[2])}${box(D[4])}</div><div style="display:flex;flex-direction:column;gap:4mm">${box(D[1])}${box(D[3])}</div></div>
<div class="note">اكتب القياس الفعلي من الميزان والمؤقت، وعلّم ✓ إن طابق المعيار. أي بند لا يطابق يُعاد التحضير ويُسجَّل في الصفحة التالية.</div></div>
<div class="ft"><span>PEACOFF</span><span>COFFEE &amp; MORE</span></div></section>
<section class="pg">${head('اختبار الجودة (2/2): الطعم والحكم','PEACOFF · QUALITY CHECK')}<div class="in">
<div class="f"><div>الاسم: </div><div>التاريخ: </div></div>
<table class="tt"><tr><th style="width:30mm">المشروب</th><th>الحموضة</th><th>الحلاوة</th><th>المرارة</th><th>القوام</th><th style="width:44mm">الحكم</th></tr>
${['V60','قهوة اليوم','إسبريسو','كركديه','دارك شوكولاتة'].map(n=>`<tr><td class="n">${n}</td><td>${sc()}</td><td>${sc()}</td><td>${sc()}</td><td>${sc()}</td><td><div class="v"><span><i></i>ممتاز</span><span><i></i>مقبول</span><span><i></i>يُعاد</span></div></td></tr>`).join('')}</table>
<div class="note">الدرجات 1 إلى 5: (1 ضعيف جدًا، 3 متوازن، 5 قوي جدًا). الذوق الجيد هو المتوازن لا الأعلى، وما يخالف ما تعوّدت عليه يُكتب ملاحظةً ولا يُغيَّر الوصفة بدون قرار.</div>
<div style="margin-top:6mm;font-size:9.6pt;font-weight:700">ملاحظات وما يلزم تعديله</div>
${[0,1,2,3,4,5,6,7].map(()=>'<div style="border-bottom:.3mm solid #c9d1d1;height:8.4mm"></div>').join('')}
<div class="sig"><div>توقيع من أجرى الاختبار</div><div>توقيع المشرف / المؤسس</div></div></div>
<div class="ft"><span>PEACOFF</span><span>COFFEE &amp; MORE</span></div></section></body></html>`;
(async()=>{const br=await chromium.launch();const p=await br.newPage();await p.setContent(html);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(250);
await p.pdf({path:path.join(OUT,'PEACOFF_quality_check_A4.pdf'),preferCSSPageSize:true,printBackground:true,margin:{top:0,bottom:0,left:0,right:0}});await br.close();console.log('ok');})();
