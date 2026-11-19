// Wall prints v3 — flat ink-on-paper, mid-century / woodblock look (reference: owner's wall photo)
const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const F=path.join(__dirname,'fonts/node_modules/@fontsource');
const font=fs.readFileSync(path.join(F,'jost/files/jost-latin-400-normal.woff2')).toString('base64');
const W=1200,H=1600;
const CREAM='#efe6d3',CREAM2='#e4d9c2',INK='#161616',NAVY='#1f3350',OLIVE='#7f8e5e',RED='#c4372f',BLUE='#5b86b5',SKY='#a9c3dc';
const f=(n)=>n.toFixed(1);

// wave bands: count bands, each a filled sine strip
function waves(y0,count,pitch,thick,amp,lam,color,ph0=0,phStep=.35,x0=0,x1=W){
  let s='';
  for(let i=0;i<count;i++){
    const ya=y0+i*pitch,ph=ph0+i*phStep;
    const top=[],bot=[];
    for(let x=x0;x<=x1;x+=12){
      const y=ya+amp*Math.sin(2*Math.PI*x/lam+ph);
      top.push(`${f(x)},${f(y)}`);bot.unshift(`${f(x)},${f(y+thick)}`);}
    s+=`<polygon points="${top.join(' ')} ${bot.join(' ')}" fill="${color}"/>`;}
  return s;}
function rays(cx,cy,r0,r1,n,a0,a1,color,w=3){
  let s='';for(let i=0;i<=n;i++){const a=(a0+(a1-a0)*i/n)*Math.PI/180;
    s+=`<line x1="${f(cx+r0*Math.cos(a))}" y1="${f(cy+r0*Math.sin(a))}" x2="${f(cx+r1*Math.cos(a))}" y2="${f(cy+r1*Math.sin(a))}" stroke="${color}" stroke-width="${w}"/>`;}
  return s;}
function leaf(ox,oy,ang,len,droop,w,color){
  const a=ang*Math.PI/180,c=Math.cos(a),s=Math.sin(a);
  const tx=ox+c*len,ty=oy+s*len+droop;
  const mx=ox+c*len*.5,my=oy+s*len*.5-len*.12;
  const nx=-s,ny=c;
  return `<path d="M${f(ox)} ${f(oy)} Q${f(mx+nx*w)} ${f(my+ny*w)} ${f(tx)} ${f(ty)} Q${f(mx-nx*w)} ${f(my-ny*w)} ${f(ox)} ${f(oy)}Z" fill="${color}"/>`;}
function palm(x,y,h,lean,fr,color){
  const tx=x+lean,ty=y-h;
  let s=`<path d="M${x-9} ${y} Q${x+lean*.15} ${y-h*.55} ${tx-4} ${ty} L${tx+5} ${ty} Q${x+lean*.15+16} ${y-h*.55} ${x+9} ${y}Z" fill="${color}"/>`;
  const angs=[-175,-150,-125,-100,-75,-50,-25,-5,10,168,190];
  angs.forEach((a,i)=>{s+=leaf(tx,ty,a,fr*(.85+.25*Math.sin(i*2.1)),(a>-20||a<-160)?fr*.45:fr*.1,fr*.09,color);});
  return s;}
function gull(x,y,sc,color,rot=0){
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})"><path d="M-70 4 Q-38 -46 0 -6 Q38 -46 70 4 Q36 -18 0 16 Q-36 -18 -70 4Z" fill="${color}"/></g>`;}
function peaHead(x,y,sc,col,flip=1){ // profile head with crown dots (brand motif)
  return `<g transform="translate(${x} ${y}) scale(${sc*flip} ${sc})">
   <path d="M-8 -6 Q-62 -4 -118 40 Q-64 22 -10 24 Q22 24 40 -2 Q34 -34 0 -38 Q-26 -36 -8 -6Z" fill="${col}"/>
   <circle cx="8" cy="-8" r="5" fill="${CREAM}"/>
   <g stroke="${col}" stroke-width="3.2" fill="none" stroke-linecap="round"><path d="M-2 -36 Q-14 -64 -24 -84"/><path d="M10 -38 Q10 -70 10 -92"/><path d="M22 -34 Q34 -62 46 -80"/></g>
   <circle cx="-24" cy="-88" r="7" fill="${col}"/><circle cx="10" cy="-97" r="7" fill="${col}"/><circle cx="46" cy="-84" r="7" fill="${col}"/></g>`;}
const eyeFeather=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="40" ry="62" fill="${BLUE}"/><ellipse rx="27" ry="44" fill="${NAVY}"/><ellipse rx="14" ry="24" fill="${OLIVE}"/><ellipse rx="5" ry="9" fill="${INK}"/></g>`;

// ---------- the 9 prints ----------
const P=[];
// 1 sun + rays + waves (brand name)
P.push({bg:CREAM,art:`
 ${rays(600,860,420,640,48,-178,-2,OLIVE,3)}
 <path d="M300 860 A300 300 0 0 1 900 860Z" fill="${OLIVE}"/>
 ${waves(800,11,64,40,26,330,INK,0,.5)}
 <text x="600" y="190" text-anchor="middle" font-family="J" font-size="64" letter-spacing="26" fill="${OLIVE}">PEACOFF</text>`});
// 2 peacock standing at the waterline
P.push({bg:CREAM,art:`
 <circle cx="760" cy="600" r="250" fill="${OLIVE}"/>
 <rect y="1090" width="${W}" height="${H-1090}" fill="${NAVY}"/>
 ${waves(1140,6,70,6,5,260,'#2f4a6f',0,.7)}
 <g>
  <g stroke="${INK}" stroke-width="8" stroke-linecap="round"><line x1="610" y1="1010" x2="604" y2="1092"/><line x1="668" y1="1012" x2="676" y2="1092"/></g>
  <path d="M742 928 C860 920 990 990 1120 1088 L1088 1092 C990 1034 880 1008 742 996Z" fill="${INK}"/>
  <path d="M730 900 C860 870 1010 900 1130 1010 L1104 1014 C1000 934 870 918 730 950Z" fill="${NAVY}"/>
  ${[0,1,2,3,4].map(i=>`<ellipse cx="${860+i*58}" cy="${948+i*18}" rx="15" ry="22" transform="rotate(${-22+i*6} ${860+i*58} ${948+i*18})" fill="${BLUE}"/><ellipse cx="${860+i*58}" cy="${948+i*18}" rx="7" ry="11" transform="rotate(${-22+i*6} ${860+i*58} ${948+i*18})" fill="${OLIVE}"/>`).join('')}
  <ellipse cx="660" cy="955" rx="125" ry="66" transform="rotate(-14 660 955)" fill="${INK}"/>
  <path d="M572 930 C500 890 600 810 548 720 C534 690 540 660 540 640" stroke="${INK}" stroke-width="30" stroke-linecap="round" fill="none"/>
  <path d="M548 720 C534 690 540 660 540 640" stroke="${INK}" stroke-width="20" stroke-linecap="round" fill="none"/>
  <ellipse cx="534" cy="622" rx="26" ry="21" fill="${INK}"/>
  <path d="M512 618 L462 636 L514 636Z" fill="${INK}"/>
  <g stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"><path d="M530 604 Q520 574 508 548"/><path d="M540 602 Q542 570 544 540"/><path d="M552 606 Q566 578 584 556"/></g>
  <circle cx="507" cy="543" r="9" fill="${INK}"/><circle cx="544" cy="534" r="9" fill="${INK}"/><circle cx="586" cy="551" r="9" fill="${INK}"/>
  <circle cx="528" cy="620" r="4.5" fill="${CREAM}"/>
 </g>`});
// 3 waves only
P.push({bg:CREAM,art:`${waves(380,14,92,56,44,380,NAVY,0,.45)}`});
// 4 palms + sun
P.push({bg:CREAM,art:`
 <circle cx="520" cy="560" r="270" fill="${OLIVE}"/>
 ${palm(430,1480,980,90,330,INK)}
 ${palm(810,1480,640,-70,250,INK)}
 <rect y="1480" width="${W}" height="120" fill="${NAVY}"/>`});
// 5 red sun + gulls (split paper)
P.push({bg:CREAM,art:`
 <rect width="520" height="${H}" fill="${CREAM2}"/>
 <circle cx="420" cy="520" r="120" fill="${RED}"/>
 ${gull(640,720,2.1,INK,-8)}${gull(470,1000,1.2,INK,6)}${gull(760,1210,.85,INK,-4)}${gull(330,1400,.6,INK,3)}`});
// 6 coffee bean sun
P.push({bg:CREAM,art:`
 <circle cx="600" cy="700" r="400" fill="${OLIVE}"/>
 <g transform="translate(600 700) rotate(-28)"><ellipse rx="215" ry="300" fill="${INK}"/><path d="M0 -300 C120 -110 -120 110 0 300" stroke="${CREAM}" stroke-width="22" fill="none" stroke-linecap="round"/></g>
 ${waves(1200,6,66,40,22,300,NAVY,.6,.5)}`});
// 7 peacock tail fan of eyes
P.push({bg:CREAM,art:`
 <circle cx="600" cy="1500" r="360" fill="${OLIVE}"/>
 ${[-40,-30,-20,-10,0,10,20,30,40].map((a,i)=>{const len=(i%2?1000:1140)-Math.abs(a)*9,t=a*Math.PI/180,ex=600+len*Math.sin(t),ey=1500-len*Math.cos(t);
  return `<line x1="600" y1="1500" x2="${f(ex)}" y2="${f(ey)}" stroke="${INK}" stroke-width="5"/><g transform="translate(${f(ex)} ${f(ey)}) rotate(${a})"><ellipse rx="66" ry="96" fill="${BLUE}"/><ellipse rx="46" ry="68" fill="${NAVY}"/><ellipse rx="26" ry="38" fill="${OLIVE}"/><ellipse rx="10" ry="15" fill="${INK}"/></g>`;}).join('')}
 <circle cx="600" cy="1500" r="26" fill="${INK}"/>`});
// 8 V60 + olive sun + waves
P.push({bg:CREAM,art:`
 <circle cx="600" cy="640" r="330" fill="${OLIVE}"/>
 <path d="M330 520 L870 520 L700 1040 Q688 1075 655 1075 L545 1075 Q512 1075 500 1040Z" fill="${INK}"/>
 <ellipse cx="600" cy="520" rx="270" ry="30" fill="${INK}"/><ellipse cx="600" cy="520" rx="236" ry="19" fill="${CREAM2}"/>
 <g stroke="${CREAM}" stroke-width="5" opacity=".85">${[-4,-2,0,2,4].map(k=>`<line x1="${600+k*52}" y1="560" x2="${600+k*21}" y2="1030"/>`).join('')}</g>
 <path d="M600 1115 q22 34 0 56 q-22 -22 0 -56z" fill="${INK}"/>
 ${waves(1260,5,66,40,22,300,NAVY,.2,.5)}`});
// 9 three feathers (crown motif) over waves
P.push({bg:CREAM,art:`
 ${[[360,1280,820,-60,.95],[600,1300,1040,0,1.2],[840,1280,780,60,.9]].map(([x,y,h,l,sc])=>{
   const tx=x+l,ty=y-h;let barbs='';
   for(let q=.12;q<.82;q+=.028){const px=x+(tx-x)*q+l*.25*Math.sin(Math.PI*q)*0,py=y-h*q;const bl=60*sc*Math.sin(Math.PI*(q+.04));
     barbs+=`<line x1="${f(px)}" y1="${f(py)}" x2="${f(px-bl)}" y2="${f(py-bl*.5)}"/><line x1="${f(px)}" y1="${f(py)}" x2="${f(px+bl)}" y2="${f(py-bl*.5)}"/>`;}
   return `<line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" stroke="${INK}" stroke-width="7"/><g stroke="${NAVY}" stroke-width="3" opacity=".8">${barbs}</g>
   <g transform="translate(${tx} ${ty})"><ellipse rx="${80*sc}" ry="${118*sc}" fill="${BLUE}"/><ellipse rx="${56*sc}" ry="${84*sc}" fill="${NAVY}"/><ellipse rx="${32*sc}" ry="${48*sc}" fill="${OLIVE}"/><ellipse rx="${12*sc}" ry="${18*sc}" fill="${INK}"/></g>`;}).join('')}
 ${waves(1290,5,60,38,22,300,INK,0,.45)}`});

const defs=`<filter id="ink" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5"/></filter>
<filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="8"/><feColorMatrix values="0 0 0 0 .35  0 0 0 0 .3  0 0 0 0 .22  0 0 0 .22 0"/></filter>
<filter id="mott"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="2"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .45  0 0 0 0 .3  0 0 0 .22 -.04"/></filter>`;
const html=(p)=>`<!doctype html><html><head><meta charset="utf-8"><style>@font-face{font-family:J;src:url(data:font/woff2;base64,${font})}*{margin:0}body{width:${W}px;height:${H}px;overflow:hidden;background:${p.bg}}</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${defs}</defs>
<rect width="${W}" height="${H}" fill="${p.bg}"/>
<g filter="url(#ink)">${p.art}</g>
<rect width="${W}" height="${H}" filter="url(#mott)"/><rect width="${W}" height="${H}" filter="url(#paper)"/></svg></body></html>`;
(async()=>{const br=await chromium.launch();const pg=await br.newPage({viewport:{width:W,height:H},deviceScaleFactor:1.5});
for(let i=0;i<P.length;i++){await pg.setContent(html(P[i]));await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(150);await pg.screenshot({path:path.join(OUT,`W${i+1}.png`)});}
await br.close();console.log('ok',P.length);})();
