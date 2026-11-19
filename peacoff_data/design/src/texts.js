const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const F=path.join(__dirname,'fonts/node_modules/@fontsource');
const b=(p)=>fs.readFileSync(path.join(F,p)).toString('base64');
const AR='U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F,U+2010-2011,U+25CC',LA='U+0000-00FF,U+2013-2014,U+2022,U+00B7';
const ff=(fam,w,f,r)=>`@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${b(f)});unicode-range:${r}}`;
const css=[ff('Plex',300,'ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-300-normal.woff2',AR),ff('Plex',300,'ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-latin-300-normal.woff2',LA),
ff('Kufi',600,'noto-kufi-arabic/files/noto-kufi-arabic-arabic-600-normal.woff2',AR),ff('Kufi',600,'ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-latin-600-normal.woff2',LA),
ff('Jost',300,'jost/files/jost-latin-300-normal.woff2',LA)].join('');
const card=(big,sub)=>`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>${css}
*{margin:0;padding:0}html,body{background:transparent}body{width:1080px;height:1920px;position:relative;font-family:'Plex'}
.t{position:absolute;left:0;right:0;top:1180px;text-align:center;color:#f4f2ec;text-shadow:0 2px 18px rgba(0,0,0,.55)}
.big{font-family:'Kufi';font-weight:600;font-size:132px;line-height:1.2}
.rule{width:96px;height:3px;background:#7fb5ae;margin:26px auto 24px}
.sub{font-weight:300;font-size:46px;letter-spacing:.04em}
.mark{font-family:'Jost';font-weight:300;font-size:60px;letter-spacing:.42em;direction:ltr;margin-right:-.42em}
</style></head><body><div class="t">${big}<div class="rule"></div><div class="sub">${sub}</div></div></body></html>`;
const end=(loc)=>`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>${css}
*{margin:0;padding:0}html,body{background:transparent}body{width:1080px;height:1920px;position:relative;font-family:'Plex'}
.t{position:absolute;left:0;right:0;top:1300px;text-align:center;color:#f4f2ec;text-shadow:0 2px 18px rgba(0,0,0,.6)}
.loc{font-family:'Kufi';font-weight:600;font-size:52px}.mark{font-family:'Jost';font-weight:300;font-size:64px;letter-spacing:.42em;direction:ltr;margin-right:-.42em;margin-bottom:22px}
</style></head><body><div class="t"><div class="mark">PEACOFF</div><div class="loc">${loc}</div></div></body></html>`;
const endfull=`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>${css}
*{margin:0;padding:0}body{width:1080px;height:1920px;background:#22282a;color:#f1f2ef;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;font-family:'Plex'}
.m{font-family:'Jost';font-weight:300;font-size:92px;letter-spacing:.42em;direction:ltr;margin-right:-.42em}
.r{width:110px;height:3px;background:#7fb5ae;margin:48px 0}
.l{font-family:'Kufi';font-weight:600;font-size:54px}.h{font-family:'Jost';font-weight:300;font-size:38px;letter-spacing:.22em;color:#9aa4a4;margin-top:26px;direction:ltr}
</style></head><body><div class="m">PEACOFF</div><div class="r"></div><div class="l">الشوقية، مكة المكرمة</div><div class="h">@PEACOFF1</div></body></html>`;
(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:1080,height:1920}});
const jobs=[['hookA',card('<div class="big">V60 · حراز</div>','تقطير يدوي')],['hookB',card('<div class="big">إسبريسو</div>','بلا حليب · بلا سكر')],['end',end('')],['endfull',endfull]];
for(const [n,h] of jobs){await p.setContent(h);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(__dirname,'r',n+'.png'),omitBackground:n!=='endfull'});}
await br.close();console.log('ok')})();
