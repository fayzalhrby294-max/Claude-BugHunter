const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const L='/home/user/Claude-BugHunter/peacoff_data/design/logo/';
const F=path.join(__dirname,'fonts/node_modules/@fontsource');
const b=(p)=>fs.readFileSync(path.join(F,p)).toString('base64');
const logo=(n)=>'data:image/png;base64,'+fs.readFileSync(L+n).toString('base64');
const AR='U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F,U+2010-2011,U+25CC',LA='U+0000-00FF,U+2013-2014,U+2022,U+00B7';
const ff=(fam,w,f,r)=>`@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${b(f)});unicode-range:${r}}`;
const css=[300,400,600].flatMap(w=>[ff('NSA',w,`noto-sans-arabic/files/noto-sans-arabic-arabic-${w}-normal.woff2`,AR),ff('NSA',w,`open-sans/files/open-sans-latin-${w}-normal.woff2`,LA)]).join('');
const C='#6D7171',T='#55C5C6',W='#FFFFFF';
const cx=780;
const f2=(n)=>n.toFixed(1);

// 1) ريشة الطاووس
function feather(){
  let s='';const ry=700,rx=430,cy=820;
  for(let y=150;y<=1560;y+=13){const d=(y-cy)/ry;if(Math.abs(d)>=1)continue;const w=rx*Math.sqrt(1-d*d);
    for(const sg of[-1,1]) s+=`<path d="M${cx} ${y+95} Q${f2(cx+sg*w*0.55)} ${y+28} ${f2(cx+sg*w)} ${y}" />`;}
  return `<g stroke="${W}" stroke-width="2.6" fill="none" opacity=".9" stroke-linecap="round">${s}</g>
  <line x1="${cx}" y1="120" x2="${cx}" y2="2160" stroke="${W}" stroke-width="5"/>
  <ellipse cx="${cx}" cy="700" rx="205" ry="265" fill="${C}"/>
  <ellipse cx="${cx}" cy="700" rx="170" ry="228" fill="none" stroke="${T}" stroke-width="7"/>
  <ellipse cx="${cx}" cy="700" rx="105" ry="150" fill="none" stroke="${W}" stroke-width="3"/>
  <ellipse cx="${cx}" cy="700" rx="52" ry="74" fill="${T}"/>`;
}
// 2) خطوط كنتورية
function topo(){
  let s='';for(let i=1;i<=17;i++){const r0=60+i*52;let d='';
    for(let k=0;k<=140;k++){const th=k/140*Math.PI*2;const r=r0*(1+0.09*Math.sin(3*th+i*0.33)+0.05*Math.sin(5*th+1.1+i*0.21));
      d+=(k?'L':'M')+f2(cx+r*Math.cos(th)*1.04)+' '+f2(860+r*Math.sin(th));}
    s+=`<path d="${d}Z" fill="none" stroke="${i===6?T:C}" stroke-width="${i===6?7:2.6}" opacity="${i===6?1:.75}"/>`;}
  return `<clipPath id="tc"><rect width="1560" height="1640"/></clipPath><g clip-path="url(#tc)">${s}</g><circle cx="${cx}" cy="860" r="20" fill="${T}"/>`;
}
// 3) V60
function v60(){
  let r='';for(let k=-5;k<=5;k++) r+=`<line x1="${cx+k*62}" y1="738" x2="${cx+k*15}" y2="1295" />`;
  return `<g stroke="${W}" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
   <path d="M430 700 L1130 700 L902 1285 Q884 1335 840 1335 L720 1335 Q676 1335 658 1285 Z"/>
   <ellipse cx="${cx}" cy="700" rx="350" ry="36"/>
   <g stroke-width="3" opacity=".55">${r}</g>
   <path d="M560 1580 Q538 1960 622 2000 L938 2000 Q1022 1960 1000 1580"/><line x1="560" y1="1580" x2="1000" y2="1580"/>
   <line x1="568" y1="1810" x2="992" y2="1810" stroke="${T}"/></g>
   <path d="M${cx} 1392 Q${cx+52} 1462 ${cx} 1512 Q${cx-52} 1462 ${cx} 1392Z" fill="${T}"/>`;
}
// 4) حبوب
function bean(x,y,rx,ry,rot,col,sw){return `<g transform="translate(${x} ${y}) rotate(${rot})" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"><ellipse rx="${rx}" ry="${ry}"/><path d="M0 ${-ry} C${rx*0.75} ${-ry*0.4} ${-rx*0.75} ${ry*0.4} 0 ${ry}"/></g>`;}
function beans(){return bean(780,720,330,470,-28,C,6)+bean(410,1390,150,215,22,C,4)+bean(1150,1340,128,188,-40,T,5);}
// 7) تموّجات
function ripples(){let s='';for(let i=0;i<12;i++){const r=95+i*58;const op=(1-i*0.06).toFixed(2);
  s+=`<circle cx="${cx}" cy="1010" r="${r}" fill="none" stroke="${i===4?T:W}" stroke-width="${i===4?8:3+((i%3)==0?2:0)}" opacity="${i===4?1:op}"/>`;}
  return s+`<circle cx="${cx}" cy="1010" r="22" fill="${T}"/>`;}
// 9) مروحة الطاووس
function fan(){let s='';const ox=cx,oy=1880;
  for(let a=-36;a<=36;a+=9){const t=a*Math.PI/180,len=1240-Math.abs(a)*3;const ex=ox+len*Math.sin(t),ey=oy-len*Math.cos(t);
    let barbs='';for(let q=0.22;q<0.9;q+=0.026){const px=ox+len*q*Math.sin(t),py=oy-len*q*Math.cos(t);const bl=70*Math.sin(Math.PI*(q-0.12)/0.9)+8;
      for(const sg of[-1,1]){const bt=t+sg*0.9;barbs+=`<line x1="${f2(px)}" y1="${f2(py)}" x2="${f2(px+bl*Math.sin(bt))}" y2="${f2(py-bl*Math.cos(bt))}"/>`;}}
    s+=`<g><line x1="${ox}" y1="${oy}" x2="${f2(ex)}" y2="${f2(ey)}" stroke="${W}" stroke-width="4"/><g stroke="${W}" stroke-width="1.8" opacity=".7">${barbs}</g>
      <g transform="translate(${f2(ex)} ${f2(ey)}) rotate(${a})"><ellipse rx="62" ry="90" fill="${C}" stroke="${T}" stroke-width="7"/><ellipse rx="22" ry="32" fill="${T}"/></g></g>`;}
  return s;}

const mk=(n,bg,art,html,foot)=>`<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>${css}
*{margin:0;padding:0;box-sizing:border-box}body{width:1800px;height:2400px;background:#fff;position:relative;font-family:'NSA',sans-serif}
.in{position:absolute;left:120px;top:120px;width:1560px;height:2160px;background:${bg};overflow:hidden}
.in svg{position:absolute;inset:0}
.ft{position:absolute;left:70px;right:70px;bottom:52px;display:flex;justify-content:space-between;font-family:'NSA';font-weight:400;font-size:27px;letter-spacing:.38em;color:${foot};direction:ltr}
</style></head><body><div class="in"><svg viewBox="0 0 1560 2160" width="1560" height="2160" xmlns="http://www.w3.org/2000/svg">${art}</svg>${html}<div class="ft"><span>PEACOFF</span><span>0${n} / 09</span></div></div></body></html>`;
const ctr='position:absolute;left:0;right:0;text-align:center';
const P=[
 [1,C,feather(),'',W],
 [2,W,topo(),`<div style="${ctr};top:1655px"><div style="font-size:240px;font-weight:300;color:${C};line-height:1;letter-spacing:.02em;direction:ltr">2200 M</div><div style="font-size:40px;font-weight:400;color:${C};letter-spacing:.42em;margin-top:18px;direction:ltr">HARAZ · YEMEN</div><div style="width:110px;height:5px;background:${T};margin:26px auto 18px"></div><div style="font-size:54px;font-weight:600;color:${C}">حراز · اليمن</div></div>`,C],
 [3,C,v60(),`<div style="${ctr};top:2040px;font-size:34px;letter-spacing:.5em;color:${W};direction:ltr;font-weight:300">V60</div>`,W],
 [4,W,beans(),`<div style="${ctr};top:1660px"><div style="font-size:210px;font-weight:600;color:${C};line-height:1.1">مصنوع بحب</div><div style="width:110px;height:5px;background:${T};margin:12px auto 20px"></div><div style="font-size:38px;letter-spacing:.5em;color:${C};direction:ltr;font-weight:300">MADE WITH LOVE</div></div>`,C],
 [5,C,'',`<div style="${ctr};top:400px"><img src="${logo('logo_stacked_tiffany.png')}" style="width:880px"></div>`,W],
 [6,W,'',`<div style="${ctr};top:560px;color:${C}"><div style="font-size:470px;font-weight:600;line-height:1.05">قهوة</div><div style="font-size:470px;font-weight:600;line-height:1.05">مختصة</div><div style="width:150px;height:6px;background:${T};margin:70px auto 44px"></div><div style="font-size:48px;letter-spacing:.55em;direction:ltr;font-weight:300">SPECIALTY COFFEE</div></div>`,C],
 [7,C,ripples(),'',W],
 [8,W,'',`<div style="${ctr};top:640px;color:${C}"><div style="font-size:340px;font-weight:300;line-height:1.05;direction:ltr">Coffee</div><div style="font-size:340px;font-weight:300;line-height:1.05;direction:ltr"><span style="color:${T}">&amp;</span> more</div><div style="width:150px;height:6px;background:${T};margin:70px auto 50px"></div><div style="font-size:150px;font-weight:600">قهوة وأكثر</div></div>`,C],
 [9,C,fan(),'',W],
];
(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:1800,height:2400},deviceScaleFactor:2});
for(const [n,bg,art,html,foot] of P){await p.setContent(mk(n,bg,art,html,foot));await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(OUT,`P${n}.png`)});}
await br.close();console.log('posters',P.length)})();
