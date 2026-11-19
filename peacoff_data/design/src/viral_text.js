const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const F=path.join(__dirname,'fonts/node_modules/@fontsource');
const b=(p)=>fs.readFileSync(path.join(F,p)).toString('base64');
const AR='U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F,U+2010-2011,U+25CC',LA='U+0000-00FF,U+2013-2014,U+2022,U+00B7';
const css=`@font-face{font-family:'NK';font-weight:700;src:url(data:font/woff2;base64,${b('noto-naskh-arabic/files/noto-naskh-arabic-arabic-700-normal.woff2')});unicode-range:${AR}}
@font-face{font-family:'JO';font-weight:300;src:url(data:font/woff2;base64,${b('jost/files/jost-latin-300-normal.woff2')});unicode-range:${LA}}`;
const page=(inner)=>`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>${css}*{margin:0;padding:0}html,body{background:transparent}body{width:1080px;height:1920px;position:relative}
.gb{position:absolute;left:0;right:0;bottom:0;height:900px;background:linear-gradient(to top,rgba(0,0,0,.6),rgba(0,0,0,.25) 55%,rgba(0,0,0,0))}
.gt{position:absolute;left:0;right:0;top:0;height:760px;background:linear-gradient(to bottom,rgba(0,0,0,.6),rgba(0,0,0,.22) 55%,rgba(0,0,0,0))}
.c{position:absolute;left:0;right:0;text-align:center;color:#fff;text-shadow:0 3px 26px rgba(0,0,0,.65)}
.a{font-family:'NK';font-weight:700;line-height:1.2}.r{width:110px;height:3px;background:#55C5C6;margin:24px auto 20px}.e{font-family:'JO';font-weight:300;letter-spacing:.34em;direction:ltr}</style></head><body>${inner}</body></html>`;
const P={
 hook:page(`<div class="gb"></div><div class="c" style="top:1300px"><div class="a" style="font-size:118px">٧ صباحًا… أول كوب</div><div class="r"></div><div class="e" style="font-size:36px">PEACOFF · MAKKAH</div></div>`),
 cap_door:page(`<div class="gb"></div><div class="c" style="top:1380px"><div class="a" style="font-size:86px">نفتح الباب</div></div>`),
 cap_ice:page(`<div class="gb"></div><div class="c" style="top:1380px"><div class="a" style="font-size:86px">ثلج</div></div>`),
 cap_coffee:page(`<div class="gb"></div><div class="c" style="top:1380px"><div class="a" style="font-size:86px">قهوة</div></div>`),
 cap_bloom:page(`<div class="gb"></div><div class="c" style="top:1380px"><div class="a" style="font-size:86px">بلوم</div></div>`),
 cap_drip:page(`<div class="gb"></div><div class="c" style="top:1380px"><div class="a" style="font-size:86px">تقطير بطيء</div></div>`),
 final:page(`<div class="gt"></div><div class="c" style="top:330px"><div class="a" style="font-size:96px">نستقبلكم من الساعة 7 صباحًا</div><div class="r"></div><div class="e" style="font-size:38px;letter-spacing:.2em">OPEN FROM 7 AM · SAT – THU</div></div>`)};
(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:1080,height:1920}});
for(const [n,h] of Object.entries(P)){await p.setContent(h);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(__dirname,'viral',n+'.png'),omitBackground:true});}
await br.close();console.log('text ok',Object.keys(P).length)})();
