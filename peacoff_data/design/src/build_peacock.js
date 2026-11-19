const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const W=1200,H=1600;
const CREAM='#efe6d3',INK='#161616',NAVY='#1f3350',OLIVE='#7f8e5e',BLUE='#5b86b5',SKY='#a9c3dc';
const f=n=>n.toFixed(1);
function waves(y0,count,pitch,thick,amp,lam,color,ph0=0,phStep=.35){let s='';
  for(let i=0;i<count;i++){const ya=y0+i*pitch,ph=ph0+i*phStep,top=[],bot=[];
    for(let x=0;x<=W;x+=12){const y=ya+amp*Math.sin(2*Math.PI*x/lam+ph);top.push(`${f(x)},${f(y)}`);bot.unshift(`${f(x)},${f(y+thick)}`);}
    s+=`<polygon points="${top.join(' ')} ${bot.join(' ')}" fill="${color}"/>`;}return s;}

// cubic bezier helper for the train: point on curve
const bz=(p0,p1,p2,p3,t)=>{const u=1-t;return [u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0],u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]];};
const dbz=(p0,p1,p2,p3,t)=>{const u=1-t;return [3*u*u*(p1[0]-p0[0])+6*u*t*(p2[0]-p1[0])+3*t*t*(p3[0]-p2[0]),3*u*u*(p1[1]-p0[1])+6*u*t*(p2[1]-p1[1])+3*t*t*(p3[1]-p2[1])];};

// train: three long feather strands curling behind the body and trailing on the ground
const strands=[
  {p:[[780,900],[1000,820],[1170,960],[1110,1245]],n:7},
  {p:[[780,930],[980,930],[1090,1080],[1000,1255]],n:6},
  {p:[[770,960],[930,1010],[970,1150],[880,1262]],n:5},
];
let train='',eyes='';
// filled backing silhouette of the train
train+=`<path d="M770 880 C1010 790 1190 940 1150 1250 L1146 1268 C1060 1272 950 1270 850 1268 C940 1200 900 1090 760 1010Z" fill="${NAVY}"/>`;
strands.forEach((s,si)=>{
  // barbs
  for(let k=0;k<=70;k++){const t=.05+k/70*.9,[x,y]=bz(...s.p,t),[dx,dy]=dbz(...s.p,t),l=Math.hypot(dx,dy),nx=-dy/l,ny=dx/l;
    const bl=44*Math.sin(Math.PI*t)+8;
    train+=`<line x1="${f(x)}" y1="${f(y)}" x2="${f(x+nx*bl-dx/l*12)}" y2="${f(y+ny*bl-dy/l*12)}" stroke="${SKY}" stroke-width="2" opacity=".55"/>`+
           `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x-nx*bl-dx/l*12)}" y2="${f(y-ny*bl-dy/l*12)}" stroke="${SKY}" stroke-width="2" opacity=".55"/>`;}
  train+=`<path d="M${s.p[0]} C${s.p[1]} ${s.p[2]} ${s.p[3]}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
  for(let i=0;i<s.n;i++){const t=.3+i*(.66/(s.n-1)),[x,y]=bz(...s.p,t),[dx,dy]=dbz(...s.p,t),ang=Math.atan2(dy,dx)*180/Math.PI,r=1-.3*(i/s.n);
    eyes+=`<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})"><ellipse rx="${32*r}" ry="${24*r}" fill="${BLUE}"/><ellipse rx="${22*r}" ry="${16*r}" fill="${NAVY}"/><ellipse rx="${13*r}" ry="${9.5*r}" fill="${OLIVE}"/><ellipse rx="${5*r}" ry="${4*r}" fill="${INK}"/></g>`;}
});

// body + neck + head as one filled silhouette (faces left)
const body=`<path d="M338 456 L398 440 C404 418 424 404 446 404 C474 404 492 424 490 452 C488 486 486 508 498 548 C512 600 548 636 590 690 C640 756 712 826 800 868 C846 906 806 1004 704 1050 C620 1084 520 1064 484 992 C458 940 436 904 430 846 C426 790 460 738 448 676 C440 632 420 590 410 540 C404 506 404 480 408 470Z" fill="${INK}"/>`;
// wing bars
let bars='';for(let i=0;i<6;i++){const y0=860+i*28;bars+=`<path d="M${600+i*8} ${y0} C${680+i*10} ${y0-28} ${760+i*6} ${y0-20} ${800-i*6} ${y0+14}" fill="none" stroke="${BLUE}" stroke-width="4" stroke-linecap="round" opacity=".75"/>`;}
// breast sheen
const sheen=`<path d="M440 700 C470 780 470 860 500 940" fill="none" stroke="${BLUE}" stroke-width="5" stroke-linecap="round" opacity=".6"/><path d="M425 640 C450 700 455 740 450 790" fill="none" stroke="${SKY}" stroke-width="3" stroke-linecap="round" opacity=".4"/>`;
const legs=`<g stroke="${INK}" stroke-width="9" stroke-linecap="round" fill="none"><path d="M610 1060 L604 1250"/><path d="M670 1050 L688 1250"/>
 <path d="M604 1250 L570 1268 M604 1250 L608 1270 M604 1250 L640 1266 M688 1250 L654 1268 M688 1250 L692 1272 M688 1250 L724 1266" stroke-width="7"/></g>`;
const head=`<g stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"><path d="M440 408 Q420 372 404 338"/><path d="M452 405 Q456 368 458 326"/><path d="M466 410 Q486 378 504 346"/></g>
 <circle cx="402" cy="332" r="10" fill="${INK}"/><circle cx="458" cy="318" r="10" fill="${INK}"/><circle cx="508" cy="340" r="10" fill="${INK}"/>
 <path d="M418 440 q22 -14 44 -4" stroke="${CREAM}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M420 456 q20 12 40 2" stroke="${CREAM}" stroke-width="4" fill="none" stroke-linecap="round"/>
 <circle cx="440" cy="447" r="6" fill="${CREAM}"/><circle cx="440" cy="447" r="2.8" fill="${INK}"/>`;

const art=`
 <circle cx="640" cy="640" r="330" fill="${OLIVE}"/>
 <rect y="1290" width="${W}" height="${H-1290}" fill="${NAVY}"/>
 ${waves(1340,4,64,6,5,260,'#2f4a6f',0,.7)}
 ${train}${eyes}${legs}${body}${bars}${sheen}${head}`;
const defs=`<filter id="ink" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4"/></filter>
<filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="8"/><feColorMatrix values="0 0 0 0 .35  0 0 0 0 .3  0 0 0 0 .22  0 0 0 .22 0"/></filter>
<filter id="mott"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="2"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .45  0 0 0 0 .3  0 0 0 .22 -.04"/></filter>`;
const html=`<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0}body{width:${W}px;height:${H}px;overflow:hidden;background:${CREAM}}</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${defs}</defs><rect width="${W}" height="${H}" fill="${CREAM}"/>
<g filter="url(#ink)">${art}</g><rect width="${W}" height="${H}" filter="url(#mott)"/><rect width="${W}" height="${H}" filter="url(#paper)"/></svg></body></html>`;
(async()=>{const br=await chromium.launch();const pg=await br.newPage({viewport:{width:W,height:H},deviceScaleFactor:1.5});
await pg.setContent(html);await pg.waitForTimeout(200);await pg.screenshot({path:path.join(OUT,'P_peacock.png')});await br.close();console.log('ok');})();
