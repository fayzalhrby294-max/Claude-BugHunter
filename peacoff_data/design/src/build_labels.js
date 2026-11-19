const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const F=path.join(__dirname,'fonts/node_modules/@fontsource');
const b=(p)=>fs.readFileSync(path.join(F,p)).toString('base64');
const sym='data:image/png;base64,'+fs.readFileSync('/home/user/Claude-BugHunter/peacoff_data/design/logo/symbol_tiffany.png').toString('base64');
const AR='U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F,U+2010-2011,U+25CC',LA='U+0000-00FF,U+2013-2014,U+2022,U+00B7';
const ff=(fam,w,f,r)=>`@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${b(f)});unicode-range:${r}}`;
const css=[400,600,700].flatMap(w=>[ff('NSA',w,`noto-sans-arabic/files/noto-sans-arabic-arabic-${w}-normal.woff2`,AR),ff('NSA',w,`open-sans/files/open-sans-latin-${w}-normal.woff2`,LA)]).join('');
const C='#4a4f4f',T='#2f9a9b';
// أسماء المكوّنات (ما طلبه المالك فقط + اليمني من قائمة الحقائق المعتمدة)
const ITEMS=[['كركديه','HIBISCUS'],['انفيوجن','INFUSION'],['ايس بوكس','ICE BOX'],['كوكونات','COCONUT'],['إثيوبي','ETHIOPIAN'],['كولومبي','COLOMBIAN'],['يمني','YEMENI']];
const label=(ar,en)=>`<div class="lb"><div class="top"><div class="nm"><div class="ar">${ar||'&nbsp;'}</div><div class="en">${en||'&nbsp;'}</div></div><img src="${sym}"></div>
 <div class="rows"><div class="r"><span>التحضير · PREP</span><i></i></div><div class="r"><span>ينتهي · USE BY</span><i></i></div></div></div>`;
const sheet=(cells)=>`<section class="pg"><div class="grid">${cells.join('')}</div></section>`;
const named=ITEMS.flatMap(([a,e])=>[0,1,2].map(()=>label(a,e)));
const blank=Array.from({length:21},()=>label('',''));
const html=`<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>${css}
@page{size:A4;margin:0}*{margin:0;padding:0;box-sizing:border-box}body{font-family:'NSA',sans-serif;color:${C};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:210mm;height:297mm;padding:15.1mm 7.2mm;page-break-after:always;overflow:hidden}
.grid{display:grid;grid-template-columns:repeat(3,63.5mm);column-gap:2.5mm;direction:ltr}
.lb{direction:rtl;width:63.5mm;height:38.1mm;padding:3.2mm 4mm 3mm;border:.2mm solid #d6dada;border-radius:2mm;display:flex;flex-direction:column;justify-content:space-between}
.top{display:flex;align-items:center;justify-content:space-between;gap:3mm}
.nm{flex:1;min-width:0}.ar{font-size:19pt;font-weight:700;line-height:1.15;color:${C};white-space:nowrap}
.en{font-size:6.8pt;font-weight:600;letter-spacing:.32em;color:${T};direction:ltr;text-align:right;margin-top:.6mm}
.top img{height:11mm;width:auto;flex:none}
.rows{border-top:.35mm solid ${T};padding-top:1.4mm}
.r{display:flex;align-items:flex-end;gap:2mm;height:7.1mm}
.r span{font-size:6.3pt;font-weight:600;letter-spacing:.06em;white-space:nowrap;color:${C}}
.r i{flex:1;border-bottom:.25mm solid #9aa0a0;height:4.4mm}
</style></head><body>${sheet(named)}${sheet(blank)}</body></html>`;
(async()=>{const br=await chromium.launch();const p=await br.newPage();await p.setContent(html);await p.evaluate(()=>document.fonts.ready);
await p.pdf({path:path.join(OUT,'PEACOFF_labels_A4.pdf'),format:'A4',printBackground:true,margin:{top:0,bottom:0,left:0,right:0}});
await p.setViewportSize({width:794,height:1123});await p.screenshot({path:path.join(OUT,'labels_preview.png'),fullPage:true});
await br.close();console.log('ok');})();
