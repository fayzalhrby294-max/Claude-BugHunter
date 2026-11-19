const fs=require('fs'),path=require('path');const {chromium}=require('playwright');
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const F=path.join(__dirname,'fonts/node_modules/@fontsource');
const b=(p)=>fs.readFileSync(path.join(F,p)).toString('base64');
const sym='data:image/png;base64,'+fs.readFileSync('/home/user/Claude-BugHunter/peacoff_data/design/logo/symbol_tiffany.png').toString('base64');
const AR='U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F,U+2010-2011,U+25CC',LA='U+0000-00FF,U+2013-2014,U+2022,U+00B7';
const ff=(fam,w,f,r)=>`@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${b(f)});unicode-range:${r}}`;
const css=[400,600,700].flatMap(w=>[ff('NSA',w,`noto-sans-arabic/files/noto-sans-arabic-arabic-${w}-normal.woff2`,AR),ff('NSA',w,`open-sans/files/open-sans-latin-${w}-normal.woff2`,LA)]).join('');
// بيانات من brand_facts.json فقط (كوكونات مستبعد بطلب المالك)
const BEANS=[
 {ar:'حراز',en:'Haraz',co:['Yemen','اليمن'],el:'2200',pr:'Anaerobic',notes:'برتقال · بطيخ · توت',roast:'متوسط',brew:'فلتر'},
 {ar:'سفاري',en:'Safari',co:['Ethiopia','إثيوبيا'],el:'1900',pr:'Anaerobic Natural',notes:'زهور · شوكولاتة · مشمش · أناناس · مانجو',roast:'متوسط',brew:'فلتر وإسبريسو'},
 {ar:'هامبيلا',en:'Hambela',co:['Ethiopia','إثيوبيا'],el:'2100',pr:'Natural',notes:'فواكه حمراء · مانجو · ياسمين · خوخ',roast:'متوسط',brew:'فلتر وإسبريسو'},
 {ar:'قوجي كورما',en:'Guji Korma',co:['Ethiopia','إثيوبيا'],el:'1850',pr:'Natural',notes:'توت أزرق · سكر بني · توابل بنية · مشمش · فراولة · عنب',roast:'متوسط',brew:'فلتر وإسبريسو'},
 {ar:'كالداس',en:'Caldas',co:['Colombia','كولومبيا'],el:'1730',pr:'Natural',notes:'شوكولاتة حليب · شاي أسود · فواكه مجففة · خوخ · ماندرين',roast:'متوسط',brew:'فلتر'},
];
const card=(o)=>`<div class="c"><div class="hd"><div class="nm"><div class="en">${o.en}</div><div class="ar">${o.ar}</div></div><img src="${sym}"></div>
 <div class="f"><div><i>ORIGIN · البلد</i><b>${o.co[0]} · ${o.co[1]}</b></div><div><i>ELEVATION · الارتفاع</i><b>${o.el} m · م</b></div><div><i>PROCESS · المعالجة</i><b>${o.pr}</b></div></div>
 <div class="n"><i>NOTES · النكهات</i><b>${o.notes}</b></div>
 <div class="ft"><span>Medium roast · تحميص ${o.roast}</span><span>${o.brew}</span></div></div>`;
const cells=BEANS.flatMap(o=>[card(o),card(o)]);
const html=`<!doctype html><html lang="ar"><head><meta charset="utf-8"><style>${css}
@page{size:A4;margin:0}*{margin:0;padding:0;box-sizing:border-box}body{font-family:'NSA',sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:210mm;height:297mm;padding:12mm 13mm}
.grid{display:grid;grid-template-columns:repeat(2,90mm);column-gap:6mm;row-gap:5mm;justify-content:center}
.c{width:90mm;height:50mm;background:#1f2326;border-radius:3mm;outline:.25mm solid #cfd3d3;outline-offset:1.2mm;padding:4.6mm 6mm 4mm;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;direction:ltr}
.c::after{content:'';position:absolute;inset:1.6mm;border:.25mm solid rgba(85,197,198,.55);border-radius:2mm;pointer-events:none}
.hd{display:flex;align-items:center;justify-content:space-between}
.en{font-size:17pt;font-weight:600;color:#fff;line-height:1.1;letter-spacing:.02em;white-space:nowrap}
.ar{font-size:10.5pt;font-weight:600;color:#55C5C6;margin-top:.4mm;direction:rtl;text-align:left}
.hd img{height:13mm;width:auto}
.f{display:grid;grid-template-columns:1.25fr .9fr 1.15fr;gap:2mm;border-top:.2mm solid rgba(255,255,255,.2);padding-top:1.6mm}
i{display:block;font-style:normal;font-size:5pt;font-weight:600;letter-spacing:.1em;color:#7d8d8e;margin-bottom:.5mm;white-space:nowrap}
b{display:block;font-weight:600;font-size:7.2pt;color:#e9eeee;line-height:1.3}
.n b{direction:rtl;text-align:left;font-size:7.6pt;line-height:1.35}
.ft{display:flex;justify-content:space-between;font-size:6.4pt;color:#9aa5a6;font-weight:600;letter-spacing:.04em;border-top:.2mm solid rgba(255,255,255,.12);padding-top:1.2mm}
</style></head><body><section class="pg"><div class="grid">${cells.join('')}</div></section></body></html>`;
(async()=>{const br=await chromium.launch();const p=await br.newPage();await p.setContent(html);await p.evaluate(()=>document.fonts.ready);
await p.pdf({path:path.join(OUT,'PEACOFF_crop_cards_A4.pdf'),format:'A4',printBackground:true,margin:{top:0,bottom:0,left:0,right:0}});await br.close();console.log('ok');})();
