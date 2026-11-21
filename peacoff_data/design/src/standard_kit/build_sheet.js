const {C,LOGOS,baseCSS,plumage,fs,path}=require('../winter/lib.js');const {chromium}=require('playwright');
const cards=require('./cards_data.js');const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const order={v60:0,hib:1,cold:2,esp:3,choc:4};
const col1=['v60','hib'],col2=['cold','esp','choc'];const by=Object.fromEntries(cards.map(c=>[c.id,c]));
const block=c=>`<section class="b"><div class="h"><div><small>${c.en}</small><h1>${c.title}</h1></div></div>
<div class="ing">${c.ing.map(([n,v,u])=>`<div class="r"><span class="n">${n}</span><span class="v">${v}</span><span class="u">${u}</span></div>`).join('')}</div>
<ol>${c.steps.map(s=>`<li><span>${s}</span></li>`).join('')}</ol>
${c.table?`<table><tr>${c.table.h.map(x=>`<th>${x}</th>`).join('')}</tr>${c.table.r.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</table>`:''}</section>`;
const html=`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>${baseCSS}@page{size:A4;margin:0}
body{width:210mm;height:297mm;position:relative;overflow:hidden;background:#fff;color:${C.gun}}
.top{height:20mm;background:${C.gun};border-bottom:1.1mm solid ${C.tif};padding:0 10mm;display:flex;align-items:center;justify-content:space-between;position:relative;overflow:hidden}
.top .pl{position:absolute;inset:0;opacity:.3}.top img{height:11mm;position:relative}.top .t{position:relative;text-align:right}.top .t small{display:block;font-size:6.4pt;letter-spacing:.3em;color:${C.tif};direction:ltr;text-align:right}.top .t h1{font-size:15pt;color:#fff;font-weight:700;margin-top:.6mm}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:6mm;margin:8mm 10mm 0 0;width:calc(190mm/1.3);transform:scale(1.3);transform-origin:100% 0}.col{display:flex;flex-direction:column;gap:6mm}
.b{border:.3mm solid #d5dada;border-radius:1.6mm;overflow:hidden}
.h{background:${C.gun};color:#fff;padding:2mm 3.4mm;display:flex;align-items:center;justify-content:space-between;border-bottom:.8mm solid ${C.tif}}
.h small{display:block;font-size:5.4pt;letter-spacing:.2em;color:${C.tif};direction:ltr;text-align:right}.h h1{font-size:12pt;font-weight:700;line-height:1.2}.h span{font-size:7pt;background:${C.cem};padding:.6mm 2mm;border-radius:1mm}
.ing{padding:2mm 3.4mm 0;display:grid;grid-template-columns:1fr 1fr;gap:0 4mm}.r{display:flex;align-items:baseline;border-bottom:.22mm solid #e0e5e5;padding:.5mm 0}
.r .n{flex:1;font-size:8pt;font-weight:600}.r .v{font-size:11pt;font-weight:700}.r .u{font-size:6.8pt;color:#6b7678;margin-right:1mm;font-weight:600}
ol{list-style:none;padding:2mm 3.4mm 0;counter-reset:s}li{counter-increment:s;display:flex;gap:2mm;font-size:8pt;line-height:1.5;margin-bottom:1mm}
li:before{content:counter(s);flex:none;width:4.2mm;height:4.2mm;border-radius:50%;background:${C.gun};color:#fff;font-weight:700;font-size:6.6pt;display:flex;align-items:center;justify-content:center;margin-top:.3mm}
table{width:calc(100% - 6.8mm);margin:1mm 3.4mm 3mm;border-collapse:collapse;font-size:7.6pt}th{background:${C.cem};color:#fff;padding:.8mm;font-size:7pt}td{border-bottom:.22mm solid #d5dada;padding:.6mm;text-align:center;font-weight:600}
.pad{height:2mm}.ft{position:absolute;left:10mm;right:10mm;bottom:6mm;display:flex;justify-content:space-between;font-size:6.5pt;color:#6b7678;letter-spacing:.2em}</style></head><body>
<div class="top"><div class="pl">${plumage(794,76,{r:24,line:C.tif,fill:C.gun,eye:C.tif,eyeOp:.8,lw:.8,op:.5,id:'t'})}</div><div class="t"><small>PEACOFF · STANDARD</small><h1>ستاندر التحضير</h1></div><img src="${LOGOS.symT}"></div>
<div class="cols"><div class="col">${col1.map(i=>block(by[i])+'').join('')}</div><div class="col">${col2.map(i=>block(by[i])).join('')}</div></div>
<div class="ft"><span>PEACOFF</span><span>COFFEE &amp; MORE</span></div></body></html>`;
(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:794,height:1123}});await p.setContent(html);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);
console.log(await p.evaluate(()=>[...document.querySelectorAll('.col')].map(c=>Math.round(c.getBoundingClientRect().bottom))),'limit',1123-30);
await p.screenshot({path:path.join(OUT,'sheet.png')});await p.pdf({path:path.join(OUT,'PEACOFF_standard_A4.pdf'),format:'A4',printBackground:true,margin:{top:0,bottom:0,left:0,right:0}});await br.close();})();
