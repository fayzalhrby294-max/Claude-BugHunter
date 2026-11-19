const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const F=path.join(__dirname,'fonts/node_modules/@fontsource');
const b=(p)=>fs.readFileSync(path.join(F,p)).toString('base64');
const AR='U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F,U+2010-2011,U+25CC',LA='U+0000-00FF,U+2013-2014,U+2022,U+00B7';
const ff=(fam,w,f,r)=>`@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${b(f)});unicode-range:${r}}`;
const css=[300,400,600].flatMap(w=>[ff('NSA',w,`noto-sans-arabic/files/noto-sans-arabic-arabic-${w}-normal.woff2`,AR),ff('NSA',w,`open-sans/files/open-sans-latin-${w}-normal.woff2`,LA)]).join('');
// الهوية الرسمية: سمنتي #6D7171 (80%) · تيفاني #55C5C6 (12%) · أبيض #FFFFFF (8%) — تيفاني للخطوط والتفاصيل فقط
const C={cement:'#6D7171',tiff:'#55C5C6',white:'#FFFFFF'};
const beans=[
 {n:'01',ar:'حراز',en:'YEMEN · HARAZ',alt:'2200 م',proc:'Anaerobic',notes:['برتقال','بطيخ','توت']},
 {n:'02',ar:'كالداس',en:'COLOMBIA · CALDAS',alt:'1730 م',proc:'Natural (مجففة)',notes:['شوكولاتة حليب','شاي أسود','فواكه مجففة','خوخ','ماندرين']},
 {n:'03',ar:'جوز الهند',en:'COLOMBIA · COCONUT',alt:'1700 م',proc:'<bdi>Anaerobic</bdi> · <bdi>120 ساعة</bdi>',notes:['أناناس','مانجو','جوز هند','فواكه صفراء','كراميل']},
 {n:'04',ar:'سفاري',en:'ETHIOPIA · SAFARI',alt:'1900 م',proc:'Anaerobic Natural',notes:['زهور','شوكولاتة','مشمش','أناناس','مانجو'],extra:'فلتر · إسبريسو'},
];
const base=`${css}*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;background:${C.cement};color:${C.white};font-family:'NSA',sans-serif;position:relative;overflow:hidden}
.w{position:absolute;inset:0;padding:110px 100px 90px;display:flex;flex-direction:column}
.top{display:flex;justify-content:space-between;align-items:center;font-size:28px;font-weight:300;letter-spacing:.04em}
.top .l{opacity:.8}.top .r{font-weight:400;letter-spacing:.22em;font-size:24px;direction:ltr}
.tl{height:3px;width:96px;background:${C.tiff};margin-top:34px}
.idx{font-size:30px;font-weight:600;color:${C.tiff};letter-spacing:.2em;margin-top:62px;direction:ltr;text-align:right}
.h{font-size:136px;font-weight:600;line-height:1.15;margin-top:6px}
.en{font-size:28px;font-weight:300;letter-spacing:.34em;direction:ltr;text-align:right;margin-top:26px;opacity:.9}
.rows{margin-top:52px}
.r1{display:flex;justify-content:space-between;align-items:baseline;border-top:2px solid rgba(255,255,255,.35);padding:24px 0}
.r1:last-child{border-bottom:2px solid rgba(255,255,255,.35)}
.l1{font-size:32px;font-weight:300;opacity:.78}.v1{font-size:42px;font-weight:400}
.v1.t{font-size:38px;line-height:1.5;text-align:left;max-width:650px}
.foot{margin-top:auto;display:flex;justify-content:space-between;font-size:26px;font-weight:300;opacity:.85}
.big{font-size:92px;font-weight:600;line-height:1.25;margin-top:64px}.big b{color:${C.tiff};font-weight:600}
.blk{margin-top:54px}.blk h3{font-size:44px;font-weight:600;margin-bottom:12px;direction:ltr;text-align:right;letter-spacing:.06em}
.blk h3 i{display:inline-block;width:46px;height:3px;background:${C.tiff};vertical-align:middle;margin-left:16px}
.blk p{font-size:38px;font-weight:300;line-height:1.7;opacity:.95}`;
const wrap=(inner,foot)=>`<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>${base}</style></head><body><div class="w">
<div class="top"><span class="l">محاصيل V60</span><span class="r">@PEACOFF1</span></div><div class="tl"></div>${inner}
<div class="foot"><span>${foot||''}</span><span>مرّر ←</span></div></div></body></html>`;
const pages=[];
beans.forEach((x,i)=>pages.push([`0${i+2}-${x.en.split(' · ')[1].toLowerCase()}`,wrap(`
<div class="idx">${x.n} / 04</div><div class="h">${x.ar}</div><div class="en">${x.en}</div>
<div class="rows"><div class="r1"><span class="l1">الارتفاع</span><span class="v1">${x.alt}</span></div>
<div class="r1"><span class="l1">المعالجة</span><span class="v1">${x.proc}</span></div>
<div class="r1"><span class="l1">التحميص</span><span class="v1">متوسط</span></div>
<div class="r1"><span class="l1">التحضير</span><span class="v1">${x.extra||'فلتر'}</span></div>
<div class="r1"><span class="l1">النكهات</span><span class="v1 t">${x.notes.map((n,k)=>`<span style="white-space:nowrap">${n}${k<x.notes.length-1?' ·':''}</span>`).join(' ')}</span></div></div>`,'من على الكيس')]));
pages.push(['06-how-to-read',wrap(`<div class="big">كيف نقرأ <b>الكيس</b></div>
<div class="blk"><h3><i></i>Natural</h3><p>تُجفَّف الثمار كاملة بقشرها قبل فصل الحبة، وغالبًا يعطي كوبًا أحلى وأكثر فاكهية.</p></div>
<div class="blk"><h3><i></i>Anaerobic</h3><p>تُخمَّر الثمار في وعاء مغلق قليل الأكسجين قبل التجفيف. المدة تختلف، وعلى أحد أكياسنا: 120 ساعة.</p></div>
<div class="blk"><h3><i></i>النكهات</h3><p>وصف المحمّص للمحصول، وقد تختلف من كوب لآخر.</p></div>`,'')]);
pages.push(['07-close',`<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>${base}
.c{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}
.c .a1{font-size:64px;font-weight:600}.c .ru{width:96px;height:3px;background:${C.tiff};margin:38px 0}.c .a2{font-size:34px;font-weight:300;opacity:.9}.c .h2{font-size:26px;letter-spacing:.3em;margin-top:26px;direction:ltr;font-weight:400}
</style></head><body><div class="c"><div class="a1">اسأل عن المتوفر اليوم</div><div class="ru"></div><div class="a2">الشوقية، مكة المكرمة</div><div class="h2">@PEACOFF1</div></div></body></html>`]);
(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:1080,height:1350}});
for(const [id,h] of pages){await p.setContent(h);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(OUT,id+'.jpg'),type:'jpeg',quality:94});}
await br.close();console.log('v2 cards',pages.length)})();
