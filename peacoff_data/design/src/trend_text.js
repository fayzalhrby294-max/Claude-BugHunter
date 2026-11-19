const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const F=path.join(__dirname,'fonts/node_modules/@fontsource');
const b=(p)=>fs.readFileSync(path.join(F,p)).toString('base64');
const AR='U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F,U+2010-2011,U+25CC',LA='U+0000-00FF,U+2013-2014,U+2022,U+00B7';
const css=`@font-face{font-family:'NK';font-weight:700;src:url(data:font/woff2;base64,${b('noto-naskh-arabic/files/noto-naskh-arabic-arabic-700-normal.woff2')});unicode-range:${AR}}
@font-face{font-family:'JO';font-weight:300;src:url(data:font/woff2;base64,${b('jost/files/jost-latin-300-normal.woff2')});unicode-range:${LA}}`;
const page=(inner)=>`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>${css}*{margin:0;padding:0}html,body{background:transparent}body{width:1080px;height:1920px;position:relative}
.sc{position:absolute;left:0;right:0;top:0;height:760px;background:linear-gradient(to bottom,rgba(0,0,0,.55),rgba(0,0,0,0))}
.g{position:absolute;left:0;right:0;bottom:0;height:980px;background:linear-gradient(to top,rgba(0,0,0,.62),rgba(0,0,0,.28) 55%,rgba(0,0,0,0))}
.h{position:absolute;left:0;right:0;top:1330px;text-align:center;color:#fff;text-shadow:0 3px 26px rgba(0,0,0,.6)}
.h .a{font-family:'NK';font-weight:700;font-size:104px;line-height:1.2}.h .r{width:110px;height:3px;background:#55C5C6;margin:26px auto 22px}.h .e{font-family:'JO';font-weight:300;font-size:36px;letter-spacing:.34em;direction:ltr}
.t{position:absolute;left:0;right:0;bottom:190px;padding:0 70px;text-align:right;color:#fff;text-shadow:0 2px 20px rgba(0,0,0,.55)}
.t .a{font-family:'NK';font-weight:700;font-size:96px;line-height:1.2}.t .e{font-family:'JO';font-weight:300;font-size:44px;letter-spacing:.04em;direction:ltr;text-align:right;margin-top:8px}</style></head><body>${inner}</body></html>`;
const pages={
 hook:page(`<div class="g"></div><div class="h"><div class="a">قبل ما توصلك قهوتك</div><div class="r"></div><div class="e">BEFORE IT REACHES YOU</div></div>`),
 final:page(`<div class="g"></div><div class="t"><div class="a">V60 مثلّج</div><div class="e">Iced V60 · PEACOFF</div></div>`)};
(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:1080,height:1920}});
for(const [n,h] of Object.entries(pages)){await p.setContent(h);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(__dirname,'trend',n+'.png'),omitBackground:true});}
await br.close();console.log('text ok')})();
