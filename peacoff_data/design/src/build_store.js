const {C,LOGOS,baseCSS,plumage,feather,feather2,fs,path}=require('./lib.js');const {chromium}=require('playwright');
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const MM=3.7795275591;                       // px per mm @96dpi
const shell=(w,h,bg,inner,extra='')=>`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>${baseCSS}body{width:${w}px;height:${h}px;position:relative;overflow:hidden;background:${bg}}.a{position:absolute}.c{position:absolute;left:0;right:0;text-align:center}${extra}</style></head><body>${inner}</body></html>`;
const hr=(w,col=C.tif,t=2)=>`<div style="width:${w}px;height:${t}px;background:${col};margin:0 auto"></div>`;
const OFFER={word:'صباح بيكوف',pct:'خصم 15%',hours:'من 7 إلى 10 صباحًا',dates:'من السبت 21 إلى الخميس 26 نوفمبر',days:'السبت إلى الخميس'};

// ---------- A3 hero ----------
const A3w=Math.round(297*MM),A3h=Math.round(420*MM);
const hero=shell(A3w,A3h,C.cem,
 `<div class="a" style="inset:0;background:radial-gradient(ellipse 900px 800px at 50% 25%,rgba(255,255,255,.18),rgba(255,255,255,0) 70%)"></div>`+
 `<div class="a" style="inset:0">${plumage(A3w,A3h,{r:64,line:'#555a5a',fill:C.cem,eye:C.tif,eyeOp:.55,lw:1.6,fade:[[0,0],[0.60,0],[0.93,1],[1,1]],id:'h'})}</div>`+
 `<div class="a" style="left:${(A3w-1000)/2}px;top:60px">${feather2(1000,{line:'#ffffff',core:C.tif,lw:1.9,barbOp:.55,stemEnd:0.74})}</div>`+
 `<div class="c" style="top:${A3h*0.585}px;font-size:170px;font-weight:700;color:#fff;line-height:1">ريش الشتاء</div>`+
 `<div class="c" style="top:${A3h*0.585+215}px;font-size:23px;font-weight:600;color:#fff;letter-spacing:15px;direction:ltr;opacity:.92">WINTER PLUMAGE · 26</div>`+
 `<div class="c" style="top:${A3h*0.585+272}px">${hr(120)}</div>`+
 `<div class="c" style="top:${A3h*0.585+304}px;font-size:30px;font-weight:400;color:#fff">دفء الصباح، بحرفية القهوة المختصة</div>`+
 `<img class="a" src="${LOGOS.horW}" style="width:400px;left:${(A3w-400)/2}px;bottom:128px">`+
 `<div class="c" style="bottom:78px;font-size:22px;font-weight:400;color:#fff">ممشى الشوقية · مكة المكرمة</div>`+
 `<div class="c" style="bottom:44px;font-size:18px;font-weight:400;color:#e9eded">السبت إلى الخميس 7 ص إلى 2 ص · الجمعة 2 م إلى 2 ص</div>`);

// ---------- A3 offer (secret word) ----------
const offer=shell(A3w,A3h,C.cem,
 `<div class="a" style="inset:0;background:radial-gradient(ellipse 1000px 900px at 50% 38%,rgba(255,255,255,.14),rgba(255,255,255,0) 70%)"></div>`+
 `<div class="a" style="inset:0">${plumage(A3w,A3h,{r:64,line:'#555a5a',fill:C.cem,eye:C.tif,eyeOp:.5,lw:1.6,fade:[[0,0],[0.66,0],[0.95,1],[1,1]],id:'o'})}</div>`+
 `<img class="a" src="${LOGOS.symW}" style="height:150px;left:${(A3w-66)/2}px;top:96px">`+
 `<div class="c" style="top:316px;font-size:52px;font-weight:600;color:#fff">الصبح عندنا كلمة سر</div>`+
 `<div class="c" style="top:412px">${hr(110)}</div>`+
 `<div class="a" style="left:${(A3w-880)/2}px;top:480px;width:880px;height:370px;border:3px solid #fff;border-radius:32px;display:flex;align-items:center;justify-content:center;flex-direction:column;background:rgba(0,0,0,.08)">
   <div style="font-size:30px;font-weight:400;color:#fff;margin-bottom:10px">قل للكاشير</div>
   <div style="font-size:150px;font-weight:700;color:#fff;line-height:1.15">${OFFER.word}</div></div>`+
 `<div class="c" style="top:925px;font-size:116px;font-weight:700;color:#fff;line-height:1.1">${OFFER.pct}</div>`+
 `<div class="c" style="top:1085px;font-size:40px;font-weight:600;color:#fff">على أي طلب</div>`+
 `<div class="c" style="top:1170px;font-size:34px;font-weight:400;color:#fff">${OFFER.hours} · ${OFFER.days}</div>`+
 `<div class="c" style="top:1230px;font-size:30px;font-weight:400;color:#fff">${OFFER.dates}</div>`+
 `<img class="a" src="${LOGOS.horW}" style="width:380px;left:${(A3w-380)/2}px;bottom:108px">`+
 `<div class="c" style="bottom:58px;font-size:20px;font-weight:400;color:#fff">العرض لمدة أسبوع فقط · ممشى الشوقية، مكة</div>`);

// ---------- table tent faces (100 x 150 mm) ----------
const Tw=Math.round(100*MM),Th=Math.round(150*MM);
const tent1=shell(Tw,Th,C.cem,
 `<div class="a" style="inset:0;background:radial-gradient(ellipse 360px 300px at 50% 36%,rgba(255,255,255,.13),rgba(255,255,255,0) 72%)"></div>`+
 `<div class="a" style="inset:0">${plumage(Tw,Th,{r:24,line:'#555a5a',fill:C.cem,eye:C.tif,eyeOp:.5,lw:1,fade:[[0,0],[0.72,0],[0.96,1],[1,1]],id:'t1'})}</div>`+
 `<img class="a" src="${LOGOS.symW}" style="height:64px;left:${(Tw-28)/2}px;top:30px">`+
 `<div class="c" style="top:118px;font-size:20px;font-weight:600;color:#fff">الصبح عندنا كلمة سر</div>`+
 `<div class="c" style="top:152px">${hr(44)}</div>`+
 `<div class="c" style="top:180px;font-size:14px;color:#fff">قل للكاشير</div>`+
 `<div class="c" style="top:204px;font-size:48px;font-weight:700;color:#fff;line-height:1.15">${OFFER.word}</div>`+
 `<div class="c" style="top:290px;font-size:34px;font-weight:700;color:#fff;line-height:1.15">${OFFER.pct}</div>`+
 `<div class="c" style="top:346px;font-size:14px;color:#fff">${OFFER.hours}</div>`+
 `<div class="c" style="top:370px;font-size:12.5px;color:#e9eded">${OFFER.dates}</div>`+
 `<div class="c" style="top:422px;font-size:10.5px;color:#e9eded">العرض لمدة أسبوع فقط</div>`);
const tent2=shell(Tw,Th,C.gun,
 `<div class="a" style="inset:0">${plumage(Tw,Th,{r:24,line:C.tif,fill:C.gun,eye:C.tif,eyeOp:.8,lw:.9,op:.34,id:'t2'})}</div>`+
 `<div class="a" style="inset:0;background:radial-gradient(ellipse 300px 380px at 50% 46%,${C.gun} 58%,rgba(47,52,54,0) 100%)"></div>`+
 `<img class="a" src="${LOGOS.symW}" style="height:60px;left:${(Tw-26)/2}px;top:30px">`+
 `<div class="c" style="top:112px;font-size:44px;font-weight:700;color:#fff;line-height:1">V60</div>`+
 `<div class="c" style="top:170px;font-size:16px;font-weight:400;color:#fff">قطرة بقطرة، ببطء يليق بالشتاء</div>`+
 `<div class="c" style="top:204px">${hr(44)}</div>`+
 `<div class="c" style="top:232px;font-size:13px;color:#e9eded">اسأل عن محصول اليوم</div>`+
 `<div class="c" style="top:268px;font-size:19px;font-weight:600;color:#fff;line-height:1.9">حراز · اليمن<br>سفاري · إثيوبيا<br>قوجي كورما · إثيوبيا</div>`+
 `<div class="c" style="top:426px;font-size:11px;color:#e9eded;letter-spacing:.5px">مصنوع بحب</div>`);

// ---------- window decal (circle 40 cm) ----------
const D=Math.round(400*MM),S0=D*0.26,SW=S0*0.443;
const decalBody=(col,sub)=>
 `<img class="a" src="${LOGOS.symW}" style="height:${S0}px;left:${D/2-SW/2}px;top:${D*0.15}px">`+
 `<div class="c" style="top:${D*0.455}px;font-size:${D*0.082}px;font-weight:700;color:#fff;line-height:1.1">ريش الشتاء</div>`+
 `<div class="c" style="top:${D*0.605}px;font-size:${D*0.026}px;font-weight:600;color:#fff;letter-spacing:${D*0.011}px;direction:ltr;line-height:1">WINTER PLUMAGE 26</div>`;
const decalW=shell(D,D,'transparent',
 `<div class="a" style="inset:4px;border:4px solid #fff;border-radius:50%"></div>`+
 `<div class="a" style="inset:0;border-radius:50%;overflow:hidden">${plumage(D,D,{r:D/16,line:'#ffffff',fill:'rgba(0,0,0,0)',eye:'#ffffff',eyeOp:.9,lw:2.2,fade:[[0,0],[0.7,0],[0.86,1],[1,1]],id:'w'})}</div>`+decalBody(),'html{background:transparent}');
const decalC=shell(D,D,'transparent',
 `<div class="a" style="inset:0;border-radius:50%;background:${C.cem};overflow:hidden">${plumage(D,D,{r:D/16,line:'#565b5b',fill:C.cem,eye:C.tif,eyeOp:.55,lw:2.2,fade:[[0,0],[0.56,0],[0.84,1],[1,1]],id:'w2'})}</div>`+
 `<div class="a" style="inset:10px;border:3px solid #fff;border-radius:50%"></div>`+decalBody(),'html{background:transparent}');

// ---------- wall panel 70 x 100 cm ----------
const Pw=Math.round(700*MM),Ph=Math.round(1000*MM);
const rP=Pw/10,ecx=Pw/2,ecy=Ph*0.40;
let eyeRings='';
[[0.40,0.74,.30],[0.33,0.62,.42],[0.26,0.50,.55],[0.19,0.37,.70],[0.12,0.24,.85]].forEach(([a,b,o])=>{eyeRings+=`<ellipse cx="${ecx}" cy="${ecy}" rx="${Pw*a}" ry="${Pw*b*0.82}" fill="none" stroke="${C.tif}" stroke-width="5" opacity="${o}"/>`});
const wall=shell(Pw,Ph,C.cem,
 `<div class="a" style="inset:0;background:linear-gradient(180deg,#7a7f7f,${C.cem} 40%,#4f5454)"></div>`+
 `<div class="a" style="inset:0">${plumage(Pw,Ph,{r:rP,line:'#5a5f5f',fill:'rgba(0,0,0,0)',eye:'#5a5f5f',eyeOp:.9,lw:3.4,op:.95})}</div>`+
 `<div class="a" style="inset:0;background:radial-gradient(ellipse ${Pw*0.55}px ${Ph*0.34}px at 50% 40%,rgba(255,255,255,.14),rgba(255,255,255,0) 70%)"></div>`+
 `<svg class="a" style="inset:0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Pw} ${Ph}" width="${Pw}" height="${Ph}">${eyeRings}<ellipse cx="${ecx}" cy="${ecy}" rx="${Pw*0.075}" ry="${Pw*0.14*0.82}" fill="${C.tif}" opacity=".95"/><ellipse cx="${ecx}" cy="${ecy}" rx="${Pw*0.013}" ry="${Pw*0.022}" fill="#fff"/></svg>`);

(async()=>{const br=await chromium.launch();
async function shot(html,w,h,name,{pdfMM,scale=2,omit=false}={}){
  const p=await br.newPage({viewport:{width:w,height:h},deviceScaleFactor:scale});
  await p.setContent(html);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(250);
  await p.screenshot({path:path.join(OUT,name+'.png'),omitBackground:omit});
  if(pdfMM) await p.pdf({path:path.join(OUT,name+'.pdf'),width:pdfMM[0]+'mm',height:pdfMM[1]+'mm',printBackground:true,margin:{top:0,bottom:0,left:0,right:0}});
  await p.close();}
await shot(hero,A3w,A3h,'poster_hero_A3',{pdfMM:[297,420],scale:2.67});
await shot(offer,A3w,A3h,'poster_offer_A3',{pdfMM:[297,420],scale:2.67});
await shot(tent1,Tw,Th,'tent_face1_offer_100x150',{pdfMM:[100,150],scale:4});
await shot(tent2,Tw,Th,'tent_face2_v60_100x150',{pdfMM:[100,150],scale:4});
await shot(decalW,D,D,'window_decal_white_40cm',{omit:true,scale:2});
await shot(decalC,D,D,'window_decal_cement_40cm',{omit:true,scale:2});
await shot(wall,Pw,Ph,'wall_panel_70x100',{scale:0.6});
await br.close();console.log('store ok');})();
