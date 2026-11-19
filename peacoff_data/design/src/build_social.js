const {C,LOGOS,baseCSS,plumage,feather2,fs,path}=require('./lib.js');const {chromium}=require('playwright');
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const hr=(w,col=C.tif,t=3)=>`<div style="width:${w}px;height:${t}px;background:${col};margin:0 auto"></div>`;
const shell=(w,h,bg,inner)=>`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>${baseCSS}body{width:${w}px;height:${h}px;position:relative;overflow:hidden;background:${bg}}.a{position:absolute}.c{position:absolute;left:0;right:0;text-align:center;color:#fff}</style></head><body>${inner}</body></html>`;
const bgp=(w,h,from,id,r=62)=>`<div class="a" style="inset:0;background:radial-gradient(ellipse ${w*0.9}px ${h*0.6}px at 50% 32%,rgba(255,255,255,.15),rgba(255,255,255,0) 70%)"></div><div class="a" style="inset:0">${plumage(w,h,{r,line:'#555a5a',fill:C.cem,eye:C.tif,eyeOp:.5,lw:1.8,fade:[[0,0],[from,0],[Math.min(from+0.3,1),1],[1,1]],id})}</div>`;
const SW=1080,SH=1920, PW=1080,PH=1350;
const sym=(h,w,top)=>`<img class="a" src="${LOGOS.symW}" style="height:${h}px;left:${(w-h*0.443)/2}px;top:${top}px">`;
const hor=(w,W_,bottom)=>`<img class="a" src="${LOGOS.horW}" style="width:${w}px;left:${(W_-w)/2}px;bottom:${bottom}px">`;
const items=[];
// ---- feed posts 1080x1350 ----
items.push(['P1_teaser',PW,PH,shell(PW,PH,C.cem,bgp(PW,PH,.62,'p1')+
 `<div class="a" style="left:${(PW-560)/2}px;top:90px">${feather2(560,{line:'#fff',core:C.tif,lw:1.5,barbOp:.5,stemEnd:.7})}</div>`+
 `<div class="c" style="top:760px;font-size:150px;font-weight:700;line-height:1">قريبًا</div>`+
 `<div class="c" style="top:940px">${hr(100)}</div>`+
 `<div class="c" style="top:980px;font-size:44px;font-weight:600">الشتاء له ريش</div>`+
 `<div class="c" style="top:1054px;font-size:28px;font-weight:400;color:#e9eded">اترك عينك على الصباح</div>`+hor(300,PW,70))]);
items.push(['P2_launch',PW,PH,shell(PW,PH,C.cem,bgp(PW,PH,.66,'p2')+
 `<div class="a" style="left:${(PW-640)/2}px;top:70px">${feather2(640,{line:'#fff',core:C.tif,lw:1.6,barbOp:.55,stemEnd:.7})}</div>`+
 `<div class="c" style="top:735px;font-size:168px;font-weight:700;line-height:1">ريش الشتاء</div>`+
 `<div class="c" style="top:935px;font-size:24px;font-weight:600;letter-spacing:12px;direction:ltr">WINTER PLUMAGE · 26</div>`+
 `<div class="c" style="top:990px">${hr(100)}</div>`+
 `<div class="c" style="top:1030px;font-size:32px;font-weight:400">دفء الصباح، بحرفية القهوة المختصة</div>`+hor(300,PW,66))]);
items.push(['P3_secret_word',PW,PH,shell(PW,PH,C.cem,bgp(PW,PH,.76,'p3')+sym(120,PW,70)+
 `<div class="c" style="top:235px;font-size:50px;font-weight:600">الصبح عندنا كلمة سر</div>`+
 `<div class="c" style="top:322px">${hr(90)}</div>`+
 `<div class="a" style="left:${(PW-860)/2}px;top:390px;width:860px;height:330px;border:3px solid #fff;border-radius:30px;display:flex;align-items:center;justify-content:center;flex-direction:column;background:rgba(0,0,0,.08)"><div style="font-size:28px;margin-bottom:6px;color:#fff">قل للكاشير</div><div style="font-size:140px;font-weight:700;color:#fff;line-height:1.15">صباح بيكوف</div></div>`+
 `<div class="c" style="top:770px;font-size:104px;font-weight:700;line-height:1.1">خصم 15%</div>`+
 `<div class="c" style="top:900px;font-size:36px;font-weight:600">على أي طلب · من 7 إلى 10 صباحًا</div>`+
 `<div class="c" style="top:958px;font-size:28px;font-weight:400">من السبت 21 إلى الخميس 26 نوفمبر</div>`+hor(280,PW,64))]);
items.push(['P4_v60',PW,PH,shell(PW,PH,C.gun,
 `<div class="a" style="inset:0">${plumage(PW,PH,{r:62,line:C.tif,fill:C.gun,eye:C.tif,eyeOp:.8,lw:1.4,op:.32,id:'p4'})}</div><div class="a" style="inset:0;background:radial-gradient(ellipse 760px 760px at 50% 44%,${C.gun} 55%,rgba(47,52,54,0) 100%)"></div>`+sym(110,PW,80)+
 `<div class="c" style="top:300px;font-size:200px;font-weight:700;line-height:1">V60</div>`+
 `<div class="c" style="top:545px">${hr(100)}</div>`+
 `<div class="c" style="top:590px;font-size:46px;font-weight:600">قطرة بقطرة، ببطء يليق بالشتاء</div>`+
 `<div class="c" style="top:700px;font-size:28px;color:#e9eded">اسأل عن محصول اليوم</div>`+
 `<div class="c" style="top:760px;font-size:38px;font-weight:600;line-height:1.85">حراز · اليمن<br>سفاري · إثيوبيا<br>قوجي كورما · إثيوبيا</div>`+hor(280,PW,64))]);
items.push(['P5_last_days',PW,PH,shell(PW,PH,C.cem,bgp(PW,PH,.7,'p5')+sym(120,PW,80)+
 `<div class="c" style="top:260px;font-size:44px;font-weight:600">آخر أيام كلمة السر</div>`+
 `<div class="c" style="top:340px">${hr(90)}</div>`+
 `<div class="c" style="top:400px;font-size:260px;font-weight:700;line-height:1">الخميس</div>`+
 `<div class="c" style="top:700px;font-size:48px;font-weight:600">قل «صباح بيكوف» قبل 10 صباحًا</div>`+
 `<div class="c" style="top:780px;font-size:34px;font-weight:400">خصم 15% · ينتهي الخميس 26 نوفمبر</div>`+hor(280,PW,64))]);
// ---- stories 1080x1920 (keep UI-safe zones: top 250 / bottom 340) ----
const st=(n,body)=>items.push([n,SW,SH,shell(SW,SH,C.cem,bgp(SW,SH,.66,n.toLowerCase().replace(/\W/g,''),66)+body)]);
st('S1_teaser',`<div class="a" style="left:${(SW-720)/2}px;top:300px">${feather2(720,{line:'#fff',core:C.tif,lw:1.7,barbOp:.5,stemEnd:.7})}</div><div class="c" style="top:1060px;font-size:180px;font-weight:700;line-height:1">قريبًا</div><div class="c" style="top:1280px">${hr(100)}</div><div class="c" style="top:1320px;font-size:52px;font-weight:600">الشتاء له ريش</div>`+hor(320,SW,380));
st('S2_launch',`<div class="a" style="left:${(SW-820)/2}px;top:270px">${feather2(820,{line:'#fff',core:C.tif,lw:1.8,barbOp:.55,stemEnd:.7})}</div><div class="c" style="top:1030px;font-size:190px;font-weight:700;line-height:1">ريش الشتاء</div><div class="c" style="top:1260px;font-size:26px;font-weight:600;letter-spacing:13px;direction:ltr">WINTER PLUMAGE · 26</div>`+hor(320,SW,380));
st('S3_secret_word',sym(130,SW,300)+`<div class="c" style="top:470px;font-size:58px;font-weight:600">الصبح عندنا كلمة سر</div><div class="c" style="top:560px">${hr(100)}</div><div class="a" style="left:${(SW-900)/2}px;top:640px;width:900px;height:380px;border:3px solid #fff;border-radius:32px;display:flex;align-items:center;justify-content:center;flex-direction:column;background:rgba(0,0,0,.08)"><div style="font-size:30px;margin-bottom:8px;color:#fff">قل للكاشير</div><div style="font-size:150px;font-weight:700;color:#fff;line-height:1.15">صباح بيكوف</div></div><div class="c" style="top:1090px;font-size:120px;font-weight:700;line-height:1.1">خصم 15%</div><div class="c" style="top:1240px;font-size:40px;font-weight:600">من 7 إلى 10 صباحًا</div><div class="c" style="top:1300px;font-size:30px;color:#e9eded">من السبت 21 إلى الخميس 26 نوفمبر</div>`+hor(300,SW,380));
st('S4_last_days',sym(130,SW,300)+`<div class="c" style="top:500px;font-size:50px;font-weight:600">آخر أيام كلمة السر</div><div class="c" style="top:590px">${hr(100)}</div><div class="c" style="top:660px;font-size:280px;font-weight:700;line-height:1">الخميس</div><div class="c" style="top:1020px;font-size:50px;font-weight:600">قل «صباح بيكوف» قبل 10 صباحًا</div><div class="c" style="top:1100px;font-size:36px">خصم 15% · ينتهي الخميس 26 نوفمبر</div>`+hor(300,SW,380));
(async()=>{const br=await chromium.launch();
for(const [n,w,h,html] of items){const p=await br.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});await p.setContent(html);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);await p.screenshot({path:path.join(OUT,n+'.png')});await p.close();}
await br.close();console.log('social',items.length);})();
