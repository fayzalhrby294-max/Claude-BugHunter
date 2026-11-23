const {C,LOGOS,baseCSS,plumage,fs,path}=require('../winter/lib.js');const {chromium}=require('playwright');
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const QRS={hib:'data:image/svg+xml;base64,'+fs.readFileSync('../qr/qr_hib.svg').toString('base64'),v60:'data:image/svg+xml;base64,'+fs.readFileSync('../qr/qr_v60.svg').toString('base64'),choc:'data:image/svg+xml;base64,'+fs.readFileSync('../qr/qr_choc.svg').toString('base64'),cold:'data:image/svg+xml;base64,'+fs.readFileSync('../qr/qr_cold.svg').toString('base64')};
const cards=[
{id:'v60',station:'محطة V60',en:'V60',title:'V60',qr:1,
 ing:[['القهوة','20','جم'],['الثلج','150','جم'],['الماء','150','مل']],
 steps:['ضع 20 جم بن، واطحنه حسب المحصول (الجدول).','ضع 150 جم ثلج في الإبريق.','ضع البن في الفلتر وسوِّ سطحه.','صب الماء على 3 دفعات: 50 جم لكل دفعة، وانتظر 30 ثانية بينها.','قدّم في الكوب.'],
 table:{h:['المحصول','الطحن','حرارة الماء'],r:[['حراز','6.1','89°'],['سفاري','5','86°'],['قوجي كورما','5','89°'],['كالداس','5.2','89°']]}},
{id:'cold',station:'محطة قهوة اليوم',en:'COFFEE OF THE DAY',title:'قهوة اليوم',
 ing:[['القهوة','100','جم'],['الثلج','500','جم'],['الطحن','7','']],qr:1,
 steps:['ضع 500 جم ثلج في الإبريق.','ضع الفلتر في السلة، و100 جم بن مطحون.','ركّب السلة على الفيتكو وشغّل الماكينة.','قدّم في الكوب مع الثلج.'],
 table:{h:['الحجم','الثلج','القهوة'],r:[['صغير','4 مكعبات','155 مل'],['كبير','8 مكعبات','238 مل']]}},
{id:'esp',station:'محطة الإسبريسو',en:'ESPRESSO',title:'إسبريسو',
 ing:[['البن','18.5','جم'],['الطحن','15',''],['حرارة الماء','90','°م'],['الناتج','30','جم']],
 steps:['ضع 18.5 جم بن، واطحنه على 15.','وزّع البن في السلة، ثم اضغطه بالتامبر.','الاستخلاص: 5 ثواني على 3 بار، ثم 5 على 5 بار، ثم 5 على 9 بار.','الناتج 30 جم في 30 ثانية.']},
{id:'hib',station:'محطة الكركديه',en:'HIBISCUS',title:'كركديه',qr:1,
 ing:[['كركديه','80','جم'],['ماء','1100','مل'],['سكر','187','جم'],['توت','70','جم'],['شاي','7','جم'],['حرارة الماء','90','°م']],
 steps:['اغسل الكركديه أولًا.','ضع المكونات كلها في وعاء واحد.','صب الماء فوقها، وانتظر 20 دقيقة.','صفِّه، واتركه 5 دقائق خارج الثلاجة.','ضعه في الثلاجة.'],table:{h:['الحجم','الثلج','الكركديه'],r:[['صغير','4 مكعبات','150 مل'],['كبير','8 مكعبات','250 مل']]}},
{id:'choc',station:'محطة الكوكيز',en:'DARK CHOCOLATE',title:'دارك شوكولاتة',
 ing:[['شوكولاتة','185','جم'],['زيت','25','مل']],qr:1,
 steps:['ضع الشوكولاتة والزيت في وعاء واحد.','ميكرويف على Med: 30 ثانية، قلّب، ثم 20 ثانية وقلّب حتى تذوب.','اصبّه على الكوكيز.']}];
const css=`${baseCSS}@page{size:105mm 148mm;margin:0}
body{width:105mm;height:148mm;position:relative;overflow:hidden;background:#fff;color:${C.gun}}
.top{height:24mm;background:${C.gun};border-bottom:1.1mm solid ${C.tif};padding:0 7mm;display:flex;align-items:center;justify-content:space-between;position:relative;overflow:hidden}
.top .pl{position:absolute;inset:0;opacity:.35}.top img{height:12mm;position:relative}
.ttl{position:relative;text-align:right}.ttl small{display:block;font-size:6pt;font-weight:600;letter-spacing:.25em;color:${C.tif};direction:ltr;text-align:right}
.ttl h1{font-size:16pt;font-weight:700;color:#fff;line-height:1.25;margin-top:.8mm}
.st{background:${C.cem};color:#fff;font-size:7.6pt;font-weight:600;padding:1.2mm 7mm}
.in{padding:2.8mm 7mm 0}
h2{font-size:7.4pt;font-weight:700;color:#2f7d7e;letter-spacing:.05em;margin:0 0 1mm}
.r{display:flex;align-items:baseline;border-bottom:.25mm solid #d5dada;padding:.2mm 0 .5mm}
.r .n{flex:1;font-size:9pt;font-weight:600}.r .v{font-size:13pt;font-weight:700;line-height:1.15}.r .u{font-size:7.6pt;font-weight:600;margin-right:1.4mm;color:#6b7678}
ol{list-style:none;margin-top:2.2mm;counter-reset:s}
li{counter-increment:s;display:flex;gap:2.2mm;font-size:8pt;line-height:1.5;margin-bottom:1.1mm}
li:before{content:counter(s);flex:none;width:4.6mm;height:4.6mm;border-radius:50%;background:${C.gun};color:#fff;font-weight:700;font-size:7pt;display:flex;align-items:center;justify-content:center;margin-top:.3mm}
table{width:100%;border-collapse:collapse;margin-top:2mm;font-size:8pt}th{background:${C.gun};color:#fff;font-weight:600;padding:1mm;font-size:7.4pt}td{border-bottom:.25mm solid #d5dada;padding:.8mm 1mm;text-align:center;font-weight:600}
.ft{position:absolute;left:0;right:0;bottom:0;height:9mm;border-top:.3mm solid #d5dada;padding:0 7mm;display:flex;align-items:center;justify-content:space-between;font-size:6.5pt;color:#6b7678;letter-spacing:.2em}`;
const html=c=>`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>${css}</style></head><body>
<div class="top"><div class="pl">${plumage(397,92,{r:22,line:C.tif,fill:C.gun,eye:C.tif,eyeOp:.8,lw:.8,op:.5,id:'t'})}</div><div class="ttl"><small>${c.en}</small><h1>${c.title}</h1></div><img src="${LOGOS.symT}"></div>
<div class="st">${c.station}</div><div class="in"><h2>المقادير</h2>${c.ing.map(([n,v,u])=>`<div class="r"><span class="n">${n}</span><span class="v">${v}</span><span class="u">${u}</span></div>`).join('')}
<ol>${c.steps.map(s=>`<li><span>${s}</span></li>`).join('')}</ol>
${c.table?`<table><tr>${c.table.h.map(x=>`<th>${x}</th>`).join('')}</tr>${c.table.r.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</table>`:''}</div>
${c.qr?`<div style="position:absolute;left:0;right:0;bottom:10mm;display:flex;justify-content:center;align-items:center;gap:4mm"><img src="${QRS[c.id]}" style="width:25mm;height:25mm"><div style="font-size:8.5pt;font-weight:600;line-height:1.6">امسح لمشاهدة<br>طريقة التحضير</div></div>`:''}<div class="ft"><span>PEACOFF</span><span>STANDARD</span></div></body></html>`;
(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:397,height:559}});
for(const c of cards){await p.setContent(html(c));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);
await p.evaluate((res)=>{const inn=document.querySelector('.in');const ft=document.querySelector('.ft').getBoundingClientRect().top;const top=inn.getBoundingClientRect().top;const used=inn.lastElementChild.getBoundingClientRect().bottom-top;const f=Math.min(1.4,Math.max(0.78,(ft-top-8-res)/used));inn.style.zoom=f;},c.qr?132:0);const over=await p.evaluate(()=>{const f=document.querySelector('.ft').getBoundingClientRect().top;const l=document.querySelector('.in').lastElementChild.getBoundingClientRect().bottom;return Math.round(f-l)});console.log(c.id,'gap px',over);
await p.screenshot({path:path.join(OUT,`final_${c.id}.png`)});await p.pdf({path:path.join(OUT,`final_${c.id}.pdf`),width:'105mm',height:'148mm',printBackground:true,margin:{top:0,bottom:0,left:0,right:0}});}
await br.close();})();
