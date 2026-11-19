const {C,LOGOS,baseCSS,plumage,fs,path}=require('./lib.js');const {chromium}=require('playwright');
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const W=945,H=359;               // 250 x 95 mm at 96 dpi  (x3.125 => 300 dpi)
const R=W/20;                     // 10 scales across: seamless wrap
const page=(bg,inner)=>`<!doctype html><html lang="ar"><head><meta charset="utf-8"><style>${baseCSS}body{width:${W}px;height:${H}px;position:relative;overflow:hidden;background:${bg}}.a{position:absolute}</style></head><body>${inner}</body></html>`;
const logoPos=(src,w)=>`<img class="a" src="${src}" style="width:${w}px;left:${W/2-w/2}px;top:18px">`;
const txt=(x,y,t,sz,ls,col,wt=600,dir='rtl')=>`<div class="a" style="left:${x}px;top:${y}px;transform:translateX(-50%);font-size:${sz}px;letter-spacing:${ls}px;color:${col};font-weight:${wt};direction:${dir};white-space:nowrap">${t}</div>`;
const A=page(C.cem,
 `<div class="a" style="inset:0">${plumage(W,H,{r:R,line:'#565b5b',fill:C.cem,eye:C.tif,eyeOp:0.55,lw:1.3,fade:[[0,0],[0.52,0],[0.86,1],[1,1]],id:'a'})}</div>`+
 `<div class="a" style="inset:0;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(0,0,0,0) 40%)"></div>`+
 logoPos(LOGOS.stackW,132)+txt(W*0.2,150,'ريش الشتاء',17,0,'#fff',600)+txt(W*0.8,152,'WINTER 26',11,4,'#fff',600,'ltr'));
const B=page(C.gun,
 `<div class="a" style="inset:0">${plumage(W,H,{r:R,line:C.tif,fill:C.gun,eye:C.tif,lw:1.1,op:.5,id:'b'})}</div>`+
 `<div class="a" style="inset:0;background:radial-gradient(ellipse 240px 200px at 50% 38%,${C.gun} 52%,rgba(47,52,54,0) 100%)"></div>`+
 `<div class="a" style="left:0;right:0;bottom:0;height:5px;background:${C.tif}"></div>`+
 logoPos(LOGOS.stackW,132)+txt(W*0.2,150,'ريش الشتاء',17,0,'#fff',600)+txt(W*0.8,152,'WINTER 26',11,4,'#fff',600,'ltr'));
const Cc=page('#fff',
 `<div class="a" style="inset:0">${plumage(W,H,{r:R,line:'#c9d1d1',fill:'#fff',eye:C.tif,lw:1.2,fade:[[0,0],[0.55,0],[0.9,1],[1,1]],id:'c'})}</div>`+
 `<div class="a" style="left:0;right:0;bottom:0;height:5px;background:${C.tif}"></div>`+
 logoPos(LOGOS.stackT,132)+txt(W*0.2,150,'ريش الشتاء',17,0,C.cem,600)+txt(W*0.8,152,'WINTER 26',11,4,C.cem,600,'ltr'));
(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:W,height:H},deviceScaleFactor:3.125});
for(const [n,h] of [['cup_A_cement',A],['cup_B_gunmetal',B],['cup_C_white',Cc]]){await p.setContent(h);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);await p.screenshot({path:path.join(OUT,n+'.png')});}
await br.close();console.log('cups ok');})();
