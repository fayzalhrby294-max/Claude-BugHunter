const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const F=path.join(__dirname,'fonts/node_modules/@fontsource');
const b=(p)=>fs.readFileSync(path.join(F,p)).toString('base64');
const AR='U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F,U+2010-2011,U+25CC',LA='U+0000-00FF,U+2013-2014,U+2022,U+00B7';
const ff=(fam,w,f,r)=>`@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${b(f)});unicode-range:${r}}`;
const css=[300,400,600].flatMap(w=>[ff('NSA',w,`noto-sans-arabic/files/noto-sans-arabic-arabic-${w}-normal.woff2`,AR),ff('NSA',w,`open-sans/files/open-sans-latin-${w}-normal.woff2`,LA)]).join('');
const html=`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>${css}
*{margin:0;padding:0}html,body{background:transparent}body{width:1080px;height:1920px;position:relative;font-family:'NSA'}
.t{position:absolute;right:86px;bottom:300px;text-align:right;color:#fff;text-shadow:0 2px 22px rgba(0,0,0,.55)}
.g{position:absolute;left:0;right:0;bottom:0;height:980px;background:linear-gradient(to top,rgba(0,0,0,.62),rgba(0,0,0,.28) 55%,rgba(0,0,0,0))}.a{font-size:88px;font-weight:600;line-height:1.25}.r{width:96px;height:3px;background:#55C5C6;margin:26px 0 22px auto}
.s{font-size:44px;font-weight:400;opacity:.95}.e{font-size:30px;font-weight:300;letter-spacing:.3em;direction:ltr;margin-top:18px;opacity:.9}</style></head><body>
<div class="g"></div><div class="t"><div class="a">نستقبلكم من الساعة<br>٧ صباحًا</div><div class="r"></div><div class="s">السبت – الخميس</div><div class="e">OPEN FROM 7 AM</div></div></body></html>`;
(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:1080,height:1920}});await p.setContent(html);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(__dirname,'open','text.png'),omitBackground:true});await br.close();console.log('text ok')})();
