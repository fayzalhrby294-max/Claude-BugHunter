// Shared library for the PEACOFF "ريش الشتاء" (Winter Plumage) campaign
const fs=require('fs'),path=require('path');
const FONTS=path.join(__dirname,'..','fonts/node_modules/@fontsource');
const LOGO='/home/user/Claude-BugHunter/peacoff_data/design/logo/';
const b64=(p)=>fs.readFileSync(p).toString('base64');
const png=(n)=>'data:image/png;base64,'+b64(LOGO+n);
const AR='U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F,U+2010-2011,U+25CC',LA='U+0000-00FF,U+2013-2014,U+2022,U+00B7';
const ff=(fam,w,f,r)=>`@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${b64(path.join(FONTS,f))});unicode-range:${r}}`;
const FONT_CSS=[300,400,600,700].flatMap(w=>[ff('NSA',w,`noto-sans-arabic/files/noto-sans-arabic-arabic-${w}-normal.woff2`,AR),ff('NSA',w,`open-sans/files/open-sans-latin-${w}-normal.woff2`,LA)]).join('');
// palette (official trio + tonal depths of the cement gray)
const C={cem:'#6D7171',cem2:'#5a5f5f',cem3:'#474c4d',gun:'#2f3436',ink:'#1f2325',tif:'#55C5C6',tifd:'#3d9ea0',wh:'#ffffff',mist:'#e9eded'};
const LOGOS={stackW:png('logo_stacked_white.png'),stackT:png('logo_stacked_tiffany.png'),horW:png('logo_horizontal_white.png'),horT:png('logo_horizontal_tiffany.png'),symW:png('symbol_white.png'),symT:png('symbol_tiffany.png')};

/* plumage scales (seigaiha-style) with a peacock "eye" in every scale.
   W,H in px; r = scale radius; rows are drawn from top to bottom so the lower rows overlay upper ones.
   opts: line, fill(bg), eye, lw, fadeFrom/fadeTo (0..1 of height, opacity ramp), eyeScale */
function plumage(W,H,o){
  const r=o.r, step=r/2, line=o.line, fill=o.fill, eye=o.eye||o.line, lw=o.lw||1.4, op=o.op??1;
  const cols=Math.ceil(W/(2*r))+2, rows=Math.ceil((H+r)/step)+2;
  let s='';
  for(let j=0;j<rows;j++){
    const cy=j*step - r*0.2; const off=(j%2)*r;
    for(let i=-1;i<cols;i++){
      const cx=i*2*r+off;
      let g=`<g transform="translate(${cx.toFixed(2)} ${cy.toFixed(2)})">`;
      g+=`<circle r="${r}" fill="${fill}" stroke="${line}" stroke-width="${lw}"/>`;
      for(const k of [0.78,0.56,0.34]) g+=`<circle r="${(r*k).toFixed(2)}" fill="none" stroke="${line}" stroke-width="${lw*0.8}"/>`;
      g+=`<ellipse cx="0" cy="${(-r*0.18).toFixed(2)}" rx="${(r*0.085).toFixed(2)}" ry="${(r*0.14).toFixed(2)}" fill="${eye}" opacity="${o.eyeOp??0.9}"/>`;
      g+='</g>';
      s+=g;
    }
  }
  const fade=o.fade? `<mask id="${o.id||'m'}"><linearGradient id="${(o.id||'m')}g" x1="0" y1="0" x2="0" y2="1">${o.fade.map(([p,a])=>`<stop offset="${p}" stop-color="#fff" stop-opacity="${a}"/>`).join('')}</linearGradient><rect width="${W}" height="${H}" fill="url(#${(o.id||'m')}g)"/></mask>`:'';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${fade}<g ${o.fade?`mask="url(#${o.id||'m'})"`:''} opacity="${op}">${s}</g></svg>`;
}
// single large feather-eye (for hero posters)
function feather(size,o={}){
  const w=size, h=size*1.45, cx=w/2, cy=h*0.42; let s='';
  const line=o.line||C.tif, lw=o.lw||1.6;
  // barbs radiating
  for(let a=-90;a<=90;a+=3){
    const t=a*Math.PI/180, r0=h*0.17, r1=h*(0.46+0.04*Math.cos(t*3));
    s+=`<line x1="${(cx+r0*Math.sin(t)*0.78).toFixed(1)}" y1="${(cy-r0*Math.cos(t)*0.98).toFixed(1)}" x2="${(cx+r1*Math.sin(t)*0.78).toFixed(1)}" y2="${(cy-r1*Math.cos(t)*0.98).toFixed(1)}" stroke="${line}" stroke-width="${lw*0.6}" opacity="${o.barbOp||.55}"/>`;
  }
  s+=`<path d="M${cx} ${h*0.62} L${cx} ${h}" stroke="${line}" stroke-width="${lw*1.4}" fill="none"/>`;
  [[0.16,0.22],[0.12,0.17],[0.085,0.12],[0.05,0.07]].forEach(([rx,ry],i)=>{s+=`<ellipse cx="${cx}" cy="${cy}" rx="${h*rx*0.8}" ry="${h*ry}" fill="${i==3?(o.core||C.tif):'none'}" stroke="${line}" stroke-width="${lw*(i==0?1.6:1)}"/>`});
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${s}</svg>`;
}

// elegant drooping feather: nested eye + curved barbs all around + short curved stem
function feather2(size,o={}){
  const w=size,h=size*1.12,cx=w/2,cy=h*0.41,line=o.line||'#fff',core=o.core||C.tif,lw=o.lw||1.4;
  const ry0=h*0.17,rx0=ry0*0.66; let s='';
  const rnd=(i)=>{const x=Math.sin(i*12.9898)*43758.5453;return x-Math.floor(x)};
  const N=o.n||260;
  for(let i=0;i<N;i++){
    const deg=-158+316*i/(N-1),t=deg*Math.PI/180,sn=Math.sin(t),cs=Math.cos(t);
    const sx=cx+rx0*sn*1.02,sy=cy-ry0*cs*1.02;
    const L=w*(0.27+0.17*Math.cos(t*0.85))*(0.9+0.2*rnd(i));
    const droop=Math.pow(Math.abs(sn),2.2)*L*0.62;
    const ex=sx+sn*L*1.0,ey=sy-cs*L*0.92+droop;
    const qx=sx+sn*L*0.55,qy=sy-cs*L*0.62+droop*0.15;
    s+=`<path d="M${sx.toFixed(1)} ${sy.toFixed(1)} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="${line}" stroke-width="${(lw*0.62).toFixed(2)}" fill="none" opacity="${(o.barbOp||0.5)*(0.7+0.3*rnd(i+7))}"/>`;
  }
  // inner short fringe ring
  for(let i=0;i<120;i++){const t=(-170+340*i/119)*Math.PI/180,sn=Math.sin(t),cs=Math.cos(t);
    s+=`<line x1="${(cx+rx0*0.82*sn).toFixed(1)}" y1="${(cy-ry0*0.82*cs).toFixed(1)}" x2="${(cx+rx0*1.28*sn).toFixed(1)}" y2="${(cy-ry0*1.28*cs).toFixed(1)}" stroke="${line}" stroke-width="${lw*0.5}" opacity=".6"/>`;}
  const se=(o.stemEnd||1)*h; s+=`<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${line}" stop-opacity="1"/><stop offset="1" stop-color="${line}" stop-opacity="0"/></linearGradient></defs><path d="M${cx} ${cy+ry0*1.05} C${cx-w*0.02} ${cy+ry0*1.7} ${cx+w*0.02} ${se*0.86} ${cx+w*0.006} ${se}" stroke="url(#sg)" stroke-width="${lw*1.5}" fill="none"/>`;
  [[1,1],[0.74,0.74],[0.5,0.5],[0.27,0.27]].forEach(([a,b],i)=>{s+=`<ellipse cx="${cx}" cy="${cy}" rx="${rx0*a}" ry="${ry0*b}" fill="${i==3?core:'none'}" stroke="${i==3?core:line}" stroke-width="${lw*(i==0?1.7:1)}"/>`});
  s+=`<ellipse cx="${cx}" cy="${cy}" rx="${rx0*0.1}" ry="${ry0*0.13}" fill="${o.pupil||'#fff'}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${s}</svg>`;
}
const baseCSS=`${FONT_CSS}*{margin:0;padding:0;box-sizing:border-box}body{font-family:'NSA',sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}`;
module.exports={C,LOGOS,FONT_CSS,baseCSS,plumage,feather,feather2,fs,path};
