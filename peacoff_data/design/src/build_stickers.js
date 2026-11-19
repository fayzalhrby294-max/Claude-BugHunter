const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const F=path.join(__dirname,'fonts/node_modules/@fontsource');
const b=(p)=>fs.readFileSync(path.join(F,p)).toString('base64');
const sym='data:image/png;base64,'+fs.readFileSync('/home/user/Claude-BugHunter/peacoff_data/design/logo/symbol_tiffany.png').toString('base64');
const AR='U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F,U+2010-2011,U+25CC',LA='U+0000-00FF,U+2013-2014,U+2022,U+00B7';
const ff=(fam,w,f,r)=>`@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${b(f)});unicode-range:${r}}`;
const css=[400,600,700].flatMap(w=>[ff('NSA',w,`noto-sans-arabic/files/noto-sans-arabic-arabic-${w}-normal.woff2`,AR),ff('NSA',w,`open-sans/files/open-sans-latin-${w}-normal.woff2`,LA)]).join('');
// الكلمات كما كتبها المالك بالضبط (إنجليزي أساسي + عربي صغير)
const BEANS=[['Ice Box','ايس بوكس'],['Coconut','كوكونات'],['Infusion','انفيوجن'],['Ethiopian','اثيوبي'],['Colombian','كولومبي']];
const st=(en,ar)=>`<div class="s"><img src="${sym}"><div class="tx"><div class="en">${en||'&nbsp;'}</div><div class="ar">${ar||'&nbsp;'}</div></div></div>`;
const cells=[...BEANS.flatMap(([e,a])=>[st(e,a),st(e,a)]),st('',''),st('',''),st('',''),st('','')];
const html=`<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>${css}
@page{size:A4;margin:0}*{margin:0;padding:0;box-sizing:border-box}body{font-family:'NSA',sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:210mm;height:297mm;padding:12mm 32mm}
.grid{display:grid;grid-template-columns:repeat(2,70mm);column-gap:6mm;row-gap:5mm;direction:ltr}
.s{direction:rtl;width:70mm;height:35mm;background:#1f2326;border-radius:3mm;outline:.25mm solid #cfd3d3;outline-offset:1.2mm;display:flex;align-items:center;justify-content:space-between;padding:0 6mm 0 5mm;position:relative;overflow:hidden}
.s::after{content:'';position:absolute;inset:1.6mm;border:.25mm solid rgba(85,197,198,.55);border-radius:2mm;pointer-events:none}
.s img{height:20mm;width:auto;flex:none;margin-left:1mm}
.tx{flex:1;min-width:0;padding-right:3mm;direction:ltr}
.en{font-family:'NSA';font-size:23pt;font-weight:600;color:#fff;direction:ltr;text-align:left;line-height:1.1;white-space:nowrap;letter-spacing:.02em}
.ar{font-size:11pt;font-weight:600;letter-spacing:0;color:#55C5C6;direction:rtl;text-align:left;margin-top:2.2mm;padding-top:1.8mm;border-top:.2mm solid rgba(255,255,255,.2);white-space:nowrap}
</style></head><body><section class="pg"><div class="grid">${cells.join('')}</div></section></body></html>`;
(async()=>{const br=await chromium.launch();const p=await br.newPage();await p.setContent(html);await p.evaluate(()=>document.fonts.ready);
await p.pdf({path:path.join(OUT,'PEACOFF_machine_stickers_A4.pdf'),format:'A4',printBackground:true,margin:{top:0,bottom:0,left:0,right:0}});await br.close();console.log('ok');})();
