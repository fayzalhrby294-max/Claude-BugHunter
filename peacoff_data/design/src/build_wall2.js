const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const OUT=process.argv[2];const FIELDS=process.argv[3];fs.mkdirSync(OUT,{recursive:true});
const L='/home/user/Claude-BugHunter/peacoff_data/design/logo/';
const png=(p)=>'data:image/png;base64,'+fs.readFileSync(p).toString('base64');
const fld=(n)=>png(path.join(FIELDS,n+'.png'));
const logoW=png(L+'logo_stacked_white.png');
const f1=(n)=>n.toFixed(1);
const cx=900;

const DEFS=`<defs>
 <linearGradient id="gold" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1800" y2="2400">
  <stop offset="0" stop-color="#8a6a2f"/><stop offset=".3" stop-color="#f2dfa8"/><stop offset=".55" stop-color="#b98a45"/><stop offset=".8" stop-color="#f6e8bd"/><stop offset="1" stop-color="#9a7436"/></linearGradient>
 <filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <filter id="glow2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="26" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <radialGradient id="spot" cx="50%" cy="46%" r="60%"><stop offset="0" stop-color="#1c6a6c" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
 <radialGradient id="warm" cx="50%" cy="100%" r="80%"><stop offset="0" stop-color="#e3b66a" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
</defs>`;
const darkBg='<rect width="1800" height="2400" fill="#06181a"/><rect width="1800" height="2400" fill="url(#spot)"/>';
const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
const featherCol=(d)=>{const st=[[0,[226,188,108]],[.35,[28,160,134]],[.7,[36,150,160]],[1,[34,128,168]]];
  for(let i=0;i<st.length-1;i++){if(d<=st[i+1][0]){const t=(d-st[i][0])/(st[i+1][0]-st[i][0]);const c=mix(st[i][1],st[i+1][1],Math.max(0,t));return `rgb(${c})`;}}return 'rgb(34,128,168)';};

function eye(x,y,rx,ry,rot=0){return `<g transform="translate(${x} ${y}) rotate(${rot})" filter="url(#glow)">
  <ellipse rx="${rx*1.12}" ry="${ry*1.12}" fill="#07191b"/>
  <ellipse rx="${rx}" ry="${ry}" fill="#0f4d52" stroke="url(#gold)" stroke-width="${rx*.05}"/>
  <ellipse rx="${rx*.76}" ry="${ry*.76}" fill="#1b8f86"/>
  <ellipse rx="${rx*.55}" ry="${ry*.55}" fill="#0e3a66"/>
  <ellipse rx="${rx*.36}" ry="${ry*.36}" fill="#061423" stroke="#55C5C6" stroke-width="${rx*.025}"/>
  <ellipse cx="${-rx*.1}" cy="${-ry*.12}" rx="${rx*.09}" ry="${ry*.11}" fill="#fff" opacity=".35"/></g>`;}

function feather(){let s='';const ry=960,rx=720,cy=1120,ex=900,ey=900;
  for(let y=190;y<=2070;y+=10.5){const d=(y-cy)/ry;if(Math.abs(d)>=1)continue;const w=rx*Math.sqrt(1-d*d);
    for(const sg of[-1,1]){const x2=cx+sg*w;const dist=Math.min(1,Math.hypot((x2-ex)/rx,(y-ey)/ry));
      s+=`<path d="M${cx} ${f1(y+130)} Q${f1(cx+sg*w*.55)} ${f1(y+44)} ${f1(x2)} ${f1(y)}" stroke="${featherCol(dist)}" stroke-width="3" fill="none" opacity=".93"/>`;}}
  return darkBg+`<g stroke-linecap="round">${s}</g><line x1="${cx}" y1="150" x2="${cx}" y2="2400" stroke="url(#gold)" stroke-width="7"/>`+eye(ex,ey,260,340);}

function fan(){let s='';const ox=cx,oy=2200;
  for(let a=-40;a<=40;a+=10){const t=a*Math.PI/180,len=1420-Math.abs(a)*7;const ex=ox+len*Math.sin(t),ey=oy-len*Math.cos(t);let barbs='';
    for(let q=.12;q<.97;q+=.012){const px=ox+len*q*Math.sin(t),py=oy-len*q*Math.cos(t);const bl=(74*Math.sin(Math.PI*(q-.05)/.95)+10);const col=featherCol(Math.min(1,(1-q)*1.05));
      for(const sg of[-1,1]){const bt=t+sg*.95;barbs+=`<line x1="${f1(px)}" y1="${f1(py)}" x2="${f1(px+bl*Math.sin(bt))}" y2="${f1(py-bl*Math.cos(bt))}" stroke="${col}"/>`;}}
    s+=`<g><g stroke-width="2.2" opacity=".85">${barbs}</g><line x1="${ox}" y1="${oy}" x2="${f1(ex)}" y2="${f1(ey)}" stroke="url(#gold)" stroke-width="4.5"/>${eye(f1(ex),f1(ey),88,124,a)}</g>`;}
  return darkBg+`<rect width="1800" height="2400" fill="url(#warm)"/>`+s+`<circle cx="${ox}" cy="${oy}" r="18" fill="url(#gold)"/>`;}

function arches(){let s='';const n=15;
  for(let i=0;i<n;i++){const w=1500-i*92,top=330+i*74,r=w/2,sp=top+r;const op=(.35+i*.045).toFixed(2);
    s+=`<path d="M${cx-r} 2500 V${f1(sp)} A${r} ${r} 0 0 1 ${cx+r} ${f1(sp)} V2500" fill="none" stroke="url(#gold)" stroke-width="${i%4==0?6:2.6}" opacity="${Math.min(1,op)}"/>`;}
  return `<rect width="1800" height="2400" fill="#071b1d"/><rect width="1800" height="2400" fill="url(#warm)"/><g filter="url(#glow)">${s}</g>
   <circle cx="${cx}" cy="1000" r="12" fill="#55C5C6" filter="url(#glow2)"/>`;}

function rings(){let s='';
  for(let i=0;i<20;i++){const r=70+i*40;const cxx=cx+i*3.2,cyy=1200-i*2.2;const op=(1-i*.032).toFixed(2);
    s+=`<circle cx="${f1(cxx)}" cy="${f1(cyy)}" r="${r}" fill="none" stroke="${i==7?'#55C5C6':'url(#gold)'}" stroke-width="${i==7?7:(i%3==0?4.5:2.3)}" opacity="${i==7?1:op}"/>`;}
  return darkBg+`<g filter="url(#glow)">${s}</g><circle cx="${cx}" cy="1200" r="26" fill="url(#gold)" filter="url(#glow2)"/>`;}

function arabesque(){let s='';const sz=300,R=sz/2;
  const oct=(x,y,r,sw,op)=>{let d='';for(const rot of[0,45]){for(let k=0;k<4;k++){const a=(rot+k*90)*Math.PI/180+Math.PI/4*(rot==45?0:0);}}
    const pts=(rot)=>[0,1,2,3].map(k=>{const a=(rot+k*90)*Math.PI/180;return `${f1(x+r*Math.cos(a))},${f1(y+r*Math.sin(a))}`}).join(' ');
    return `<polygon points="${pts(0)}" /><polygon points="${pts(45)}"/>`;};
  for(let i=-1;i<=7;i++)for(let j=-1;j<=9;j++){const x=i*sz,y=j*sz;
    s+=oct(x,y,R*1.414,1,1);                       // نجمة ثمانية
    s+=`<circle cx="${x}" cy="${y}" r="${R*.5}" />`;
    const dx=x+sz/2,dy=y+sz/2;s+=`<polygon points="${dx},${dy-R*.42} ${dx+R*.42},${dy} ${dx},${dy+R*.42} ${dx-R*.42},${dy}" />`;}
  return `<rect width="1800" height="2400" fill="#06181a"/><rect width="1800" height="2400" fill="url(#spot)"/>
   <mask id="fade"><radialGradient id="fg" cx="50%" cy="48%" r="62%"><stop offset="0" stop-color="#fff"/><stop offset=".75" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#000"/></radialGradient><rect width="1800" height="2400" fill="url(#fg)"/></mask>
   <g mask="url(#fade)" filter="url(#glow)" fill="none" stroke="url(#gold)" stroke-width="3" stroke-linejoin="round">${s}</g>`;}

const bgimg=(n,extra='')=>`<image href="${fld(n)}" width="1800" height="2400" ${extra}/>`;
const vign='<rect width="1800" height="2400" fill="url(#vg)"/>';
const heroLogo=`<div style="position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center"><div style="width:880px;height:${Math.round(880*2184/1407)}px;background:linear-gradient(135deg,#8a6a2f 0%,#f2dfa8 30%,#b98a45 55%,#f6e8bd 80%,#9a7436 100%);-webkit-mask-image:url(${logoW});-webkit-mask-size:contain;-webkit-mask-repeat:no-repeat;-webkit-mask-position:center;filter:drop-shadow(0 0 30px rgba(226,188,108,.45))"></div></div>`;

const P=[
 [1,feather(),''],
 [2,bgimg('marble'),''],
 [3,arabesque(),''],
 [4,bgimg('topo'),''],
 [5,bgimg('marble_soft')+'<rect width="1800" height="2400" fill="url(#spot)"/>',heroLogo],
 [6,bgimg('crema','transform="translate(-90 0) scale(1.1)"'),''],
 [7,arches(),''],
 [8,rings(),''],
 [9,fan(),''],
];
const html=(art,extra)=>`<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0;padding:0}body{width:1800px;height:2400px;position:relative;overflow:hidden;background:#000}
svg{position:absolute;inset:0}.v{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 46%,rgba(0,0,0,0) 52%,rgba(0,0,0,.5) 100%)}</style></head><body>
<svg viewBox="0 0 1800 2400" width="1800" height="2400" xmlns="http://www.w3.org/2000/svg">${DEFS}<radialGradient id="vg"/>${art}</svg>${extra}<div class="v"></div></body></html>`;
(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:1800,height:2400},deviceScaleFactor:2});
for(const [n,art,extra] of P){await p.setContent(html(art,extra));await p.waitForTimeout(250);await p.screenshot({path:path.join(OUT,`D${n}.png`)});}
await br.close();console.log('decor',P.length)})();
