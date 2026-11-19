const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const L='/home/user/Claude-BugHunter/peacoff_data/design/logo/';
const b64=p=>'data:image/png;base64,'+fs.readFileSync(L+p).toString('base64');
const STACK=b64('logo_stacked_tiffany.png'),WORD=b64('wordmark_white.png');
const f=n=>n.toFixed(1);
const mx=x=>900-x; // mirror
const mirrorPath=d=>d.replace(/(-?\d+\.?\d*)\s+(-?\d+\.?\d*)/g,(m,x,y)=>`${mx(+x)} ${y}`);

const BASE='#16191b';
const defs=`<defs>
 <linearGradient id="gb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#08090a"/><stop offset=".18" stop-color="${BASE}"/><stop offset=".5" stop-color="#1f2326"/><stop offset=".82" stop-color="${BASE}"/><stop offset="1" stop-color="#08090a"/></linearGradient>
 <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".07"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>
 <linearGradient id="gs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#08090a"/><stop offset=".35" stop-color="#1c2023"/><stop offset=".65" stop-color="#181b1e"/><stop offset="1" stop-color="#090b0c"/></linearGradient>
 <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c3536"/><stop offset=".6" stop-color="#2b7a7b"/><stop offset="1" stop-color="#3a9494"/></linearGradient>
 <radialGradient id="glo" cx="50%" cy="30%" r="70%"><stop offset="0" stop-color="#071d1e"/><stop offset="1" stop-color="#1f5f60"/></radialGradient>
 <pattern id="rib" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#15181a"/><rect width="3.2" height="9" fill="#0a0c0d"/><rect x="5" width="1.6" height="9" fill="#272c2f" opacity=".8"/></pattern>
 <filter id="fab" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.25" numOctaves="2" seed="5"/><feColorMatrix values="0 0 0 0 .7  0 0 0 0 .75  0 0 0 0 .75  0 0 0 .11 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
 <filter id="shadow" x="-20%" y="-10%" width="140%" height="130%"><feDropShadow dx="0" dy="22" stdDeviation="22" flood-color="#000" flood-opacity=".6"/></filter>
 <filter id="tone"><feFlood flood-color="#2a3235"/><feComposite in2="SourceAlpha" operator="in"/></filter>
 <filter id="toneHi"><feFlood flood-color="#434d50"/><feComposite in2="SourceAlpha" operator="in"/></filter>
 <filter id="toneLo"><feFlood flood-color="#0b0d0e"/><feComposite in2="SourceAlpha" operator="in"/></filter>
</defs>`;

// geometry (front & back share silhouette)
const sleeveL='M236 240 C190 258 130 292 100 318 C84 334 74 372 70 420 L58 800 L190 820 L204 560 L218 440Z';
const cuffL='M58 790 L192 810 L180 868 L56 846Z';
const sleeveR=mirrorPath(sleeveL),cuffR=mirrorPath(cuffL);
const body='M330 214 C300 226 262 234 236 240 L218 440 L232 960 L668 960 L682 440 L664 240 C638 234 600 226 570 214Z';
const hem='M232 950 L668 950 L674 1040 L226 1040Z';
const shp=(d,fill,extra='')=>`<path d="${d}" fill="${fill}" ${extra}/><path d="${d}" fill="#000" filter="url(#fab)"/>`;

function seams(){return `<g fill="none" stroke="#3a4044" stroke-width="2" stroke-dasharray="7 4" opacity=".7">
 <path d="M236 244 L218 440"/><path d="M664 244 L682 440"/>
 <path d="M70 420 L192 560" opacity=".0"/></g>
 <g fill="none" stroke="#0b0d0e" stroke-width="3" opacity=".55"><path d="M218 440 C222 520 214 560 204 560"/><path d="M682 440 C678 520 686 560 696 560"/></g>
 <g fill="none" stroke="#050607" stroke-width="5" opacity=".28"><path d="M120 360 C140 520 120 700 118 780"/><path d="M780 360 C760 520 780 700 782 780"/></g>
 <g fill="none" stroke="#505a5d" stroke-width="3" opacity=".2"><path d="M360 300 C350 520 340 760 336 940"/><path d="M540 300 C550 520 560 760 564 940"/></g>`;}

function garment(inner){return `<g filter="url(#shadow)">
 ${shp(sleeveL,'url(#gs)')}${shp(sleeveR,'url(#gs)')}
 <path d="${cuffL}" fill="url(#rib)"/><path d="${cuffR}" fill="url(#rib)"/>
 ${shp(body,'url(#gb)')}<path d="${body}" fill="url(#gv)"/>
 <path d="${hem}" fill="url(#rib)"/><path d="M232 950 L668 950" stroke="#0a0c0d" stroke-width="3" opacity=".6"/>
 ${seams()}${inner}</g>`;}

function front(){
 const hood=`<path d="M322 215 C300 110 370 62 450 62 C530 62 600 110 578 215 C570 272 500 330 450 358 C400 330 330 272 322 215Z" fill="#1d2124"/>
  <path d="M322 215 C300 110 370 62 450 62 C530 62 600 110 578 215 C570 272 500 330 450 358 C400 330 330 272 322 215Z" fill="#000" filter="url(#fab)"/>
  <path d="M352 192 C345 122 395 92 450 92 C505 92 555 122 548 192 C545 242 500 300 450 332 C400 300 355 242 352 192Z" fill="url(#glo)"/>
  <path d="M352 192 C345 122 395 92 450 92 C505 92 555 122 548 192 C545 242 500 300 450 332 C400 300 355 242 352 192Z" fill="none" stroke="#1a1d20" stroke-width="5"/>
  <path d="M368 205 C372 150 410 118 450 118" fill="none" stroke="#58b9ba" stroke-width="3" opacity=".25"/>
  <circle cx="410" cy="296" r="7" fill="#101315" stroke="#4a5256" stroke-width="3"/><circle cx="490" cy="296" r="7" fill="#101315" stroke="#4a5256" stroke-width="3"/>`;
 const cords=`<g stroke="#c8d0d0" stroke-width="7" stroke-linecap="round" fill="none"><path d="M410 300 C402 360 406 420 402 478"/><path d="M490 300 C498 360 494 420 498 478"/></g>
  <rect x="396" y="478" width="12" height="34" rx="5" fill="#55C5C6"/><rect x="492" y="478" width="12" height="34" rx="5" fill="#55C5C6"/>`;
 const pocket=`<path d="M290 700 L610 700 L636 910 L264 910Z" fill="#000" opacity=".16"/>
  <path d="M290 700 L610 700 L636 910 L264 910Z" fill="none" stroke="#4a5256" stroke-width="3" opacity=".9"/>
  <path d="M292 704 L276 800" stroke="#0a0c0d" stroke-width="9" opacity=".55" stroke-linecap="round"/><path d="M608 704 L624 800" stroke="#0a0c0d" stroke-width="9" opacity=".55" stroke-linecap="round"/>`;
 const logo=`<image href="${STACK}" x="540" y="396" width="82" height="127"/>`;
 const wm=(dx,dy)=>`<g transform="translate(${800+dx} ${560+dy}) rotate(85.2)"><image href="${WORD}" x="-130" y="-28.5" width="260" height="57"/></g>`;
 const sleeveTxt=`<g filter="url(#toneLo)" opacity=".7">${wm(-1.5,-2)}</g><g filter="url(#toneHi)" opacity=".5">${wm(1.2,1.6)}</g><g filter="url(#tone)">${wm(0,0)}</g>`;
 return garment(pocket+hood+cords+logo)+sleeveTxt;}

function back(){
 const hoodD='M285 215 C268 96 362 56 450 56 C538 56 632 96 615 215 C602 300 524 346 450 352 C376 346 298 300 285 215Z';
 const hood=`<path d="${hoodD}" fill="#1b1f22"/><path d="${hoodD}" fill="#000" filter="url(#fab)"/>
  <path d="${hoodD}" fill="none" stroke="#14171a" stroke-width="3" opacity=".6"/>
  <path d="M450 58 C446 140 454 250 450 352" stroke="#12151a" stroke-width="4" fill="none" opacity=".75"/><path d="M455 60 C451 140 459 250 455 350" stroke="#444c50" stroke-width="2" fill="none" opacity=".45"/>
  <path d="M300 230 C330 300 390 336 450 342 C510 336 570 300 600 230" fill="none" stroke="#050607" stroke-width="9" opacity=".25"/>`;
 const label=`<rect x="425" y="364" width="50" height="22" rx="2" fill="#101315"/><text x="450" y="379" text-anchor="middle" font-family="Jost,Arial" font-size="9" letter-spacing="2.5" fill="#55C5C6">PEACOFF</text>`;
 const logo=`<image href="${STACK}" x="330" y="430" width="240" height="373"/>`;
 return garment(hood+label+logo);}

const svg=(inner)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1150" width="900" height="1150">${defs}${inner}</svg>`;
const page=(inner)=>`<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0}body{width:900px;height:1150px;background:transparent}</style></head><body>${svg(inner)}</body></html>`;
(async()=>{const br=await chromium.launch();const pg=await br.newPage({viewport:{width:900,height:1150},deviceScaleFactor:3});
for(const [n,fn] of [['front',front],['back',back]]){await pg.setContent(page(fn()));await pg.waitForTimeout(250);await pg.screenshot({path:path.join(OUT,`hoodie_${n}.png`),omitBackground:true});}
await br.close();console.log('ok');})();
