const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const F=path.join(__dirname,'fonts/node_modules/@fontsource');
const b=(p)=>fs.readFileSync(path.join(F,p)).toString('base64');
const L='/home/user/Claude-BugHunter/peacoff_data/design/logo/';
const logo='data:image/png;base64,'+fs.readFileSync(L+'logo_stacked_tiffany.png').toString('base64');
const AR='U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F,U+2010-2011,U+25CC',LA='U+0000-00FF,U+2013-2014,U+2022,U+00B7';
const ff=(fam,w,f,r)=>`@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${b(f)});unicode-range:${r}}`;
const css=[400,600,700].flatMap(w=>[ff('NSA',w,`noto-sans-arabic/files/noto-sans-arabic-arabic-${w}-normal.woff2`,AR),ff('NSA',w,`open-sans/files/open-sans-latin-${w}-normal.woff2`,LA)]).join('');
const ITEMS=[['Ice Box','ايس بوكس'],['Infusion','انفيوجن'],['Hibiscus','كركديه']];
const st=(en,ar)=>`<div class="s"><div class="lg"><img src="${logo}"></div><div class="tx"><div class="en">${en||'&nbsp;'}</div><div class="ar">${ar||'&nbsp;'}</div>
 <div class="rows"><div class="r"><span>PREP</span><i></i><span class="a">التحضير</span></div><div class="r"><span>USE BY</span><i></i><span class="a">ينتهي</span></div></div></div></div>`;
const cells=[...ITEMS.flatMap(([e,a])=>[st(e,a),st(e,a),st(e,a)]),...Array.from({length:3},()=>st('',''))];
const html=`<!doctype html><html lang="ar"><head><meta charset="utf-8"><style>${css}
@page{size:A4;margin:0}*{margin:0;padding:0;box-sizing:border-box}body{font-family:'NSA',sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:210mm;height:297mm;padding:14mm 22mm}
.grid{display:grid;grid-template-columns:repeat(2,80mm);column-gap:6mm;row-gap:5mm}
.s{width:80mm;height:40mm;background:#1f2326;border-radius:3mm;outline:.25mm solid #cfd3d3;outline-offset:1.2mm;display:flex;align-items:center;padding:0 5mm 0 4mm;gap:4mm;position:relative;overflow:hidden}
.s::after{content:'';position:absolute;inset:1.6mm;border:.25mm solid rgba(85,197,198,.55);border-radius:2mm;pointer-events:none}
.lg{flex:none;width:17mm;display:flex;align-items:center;justify-content:center}.lg img{width:17mm;height:auto}
.tx{flex:1;min-width:0;direction:ltr}
.en{font-size:19pt;font-weight:600;color:#fff;line-height:1.1;letter-spacing:.02em;white-space:nowrap}
.ar{font-size:10pt;font-weight:600;color:#55C5C6;direction:rtl;text-align:left;margin-top:.8mm}
.rows{margin-top:2.6mm;border-top:.2mm solid rgba(255,255,255,.2);padding-top:1.4mm}
.r{display:flex;align-items:flex-end;gap:1.6mm;height:6.4mm;color:#aab4b5}
.r span{font-size:5.6pt;font-weight:600;letter-spacing:.1em;white-space:nowrap;width:9mm}.r .a{font-size:6.4pt;letter-spacing:0;width:auto;direction:rtl}
.r i{flex:1;border-bottom:.25mm solid #7d8788;height:3.8mm}
</style></head><body><section class="pg"><div class="grid">${cells.join('')}</div></section></body></html>`;
(async()=>{const br=await chromium.launch();const p=await br.newPage();await p.setContent(html);await p.evaluate(()=>document.fonts.ready);
await p.pdf({path:path.join(OUT,'PEACOFF_bottle_stickers_A4.pdf'),format:'A4',printBackground:true,margin:{top:0,bottom:0,left:0,right:0}});await br.close();console.log('ok');})();
