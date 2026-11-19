const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const F=path.join(__dirname,'fonts/node_modules/@fontsource');
const b=(p)=>fs.readFileSync(path.join(F,p)).toString('base64');
const AR='U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F,U+2010-2011,U+25CC',LA='U+0000-00FF,U+2013-2014,U+2022,U+00B7';
const css=`@font-face{font-family:'NK';font-weight:700;src:url(data:font/woff2;base64,${b('noto-naskh-arabic/files/noto-naskh-arabic-arabic-700-normal.woff2')});unicode-range:${AR}}
@font-face{font-family:'NK';font-weight:700;src:url(data:font/woff2;base64,${b('noto-naskh-arabic/files/noto-naskh-arabic-latin-700-normal.woff2')});unicode-range:${LA}}
@font-face{font-family:'JO';font-weight:300;src:url(data:font/woff2;base64,${b('jost/files/jost-latin-300-normal.woff2')});unicode-range:${LA}}`;
const html=`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>${css}
*{margin:0;padding:0}html,body{background:transparent}body{width:1080px;height:1920px;position:relative}
.g{position:absolute;left:0;right:0;bottom:0;height:980px;background:linear-gradient(to top,rgba(0,0,0,.62),rgba(0,0,0,.28) 55%,rgba(0,0,0,0))}
.t{position:absolute;left:0;right:0;bottom:330px;padding:0 70px;text-align:right;color:#fff;text-shadow:0 2px 20px rgba(0,0,0,.55)}
.a{font-family:'NK';font-weight:700;font-size:74px;line-height:1.25;white-space:nowrap}
.e{font-family:'JO';font-weight:300;font-size:44px;letter-spacing:.02em;direction:ltr;text-align:right;margin-top:10px;opacity:.96}</style></head><body>
<div class="g"></div><div class="t"><div class="a">نستقبلكـــم الســـاعة 7 صباحـــاً</div><div class="e">Open from 7 AM · Sat – Thu</div></div></body></html>`;
(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:1080,height:1920}});await p.setContent(html);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(__dirname,'open','text.png'),omitBackground:true});await br.close();console.log('text ok')})();
