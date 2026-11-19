const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const FONTS = path.join(__dirname, 'fonts/node_modules/@fontsource');
const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });

const b64 = (p) => fs.readFileSync(path.join(FONTS, p)).toString('base64');
const face = (family, weight, file, range) =>
  `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${b64(file)}) format('woff2');unicode-range:${range};}`;
const AR = 'U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F,U+2010-2011,U+25CC';
const LA = 'U+0000-00FF,U+2013-2014,U+2022,U+00B7';
const css = [
  ...[300, 400, 600].flatMap((w) => [
    face('Plex', w, `ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-${w}-normal.woff2`, AR),
    face('Plex', w, `ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-latin-${w}-normal.woff2`, LA),
  ]),
  ...[600, 700].map((w) => face('Kufi', w, `noto-kufi-arabic/files/noto-kufi-arabic-arabic-${w}-normal.woff2`, AR)),
  face('Kufi', 600, 'ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-latin-600-normal.woff2', LA),
  face('Kufi', 700, 'ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-latin-600-normal.woff2', LA),
  face('Jost', 300, 'jost/files/jost-latin-300-normal.woff2', LA),
].join('\n');

const LOC = 'ممشى الشوقية · مكة المكرمة';
const TAGS = ['#بيكوف', '#PEACOFF', '#مكة', '#قهوة_مختصة'];
const menu = [
  ['قهوة مختصة', [['قهوة اليوم الباردة (عادي / كبير)', '5.90 / 7.90'], ['V60 فاخر', '16.90'], ['V60', '12.90'], ['إسبريسو', '11.90']]],
  ['مشروبات', [['كركديه (عادي / كبير)', '6.90 / 9.90'], ['ماء', '1.00']]],
  ['الحلا', [['كوكيز', '8.90'], ['كريم كراميل', '9.90'], ['بودنق', '11.90']]],
];
// كل النصوص والأسعار من brand_facts.json فقط.
const stories = [
  { id: '01-intro', kicker: null, big: true, head: ['بيكوف.', 'قهوة مختصة', 'في مكة.'], accent: true, size: 112,
    body: 'ممشى الشوقية. السبت – الخميس من 7 الصبح لين 2 بعد منتصف الليل، والجمعة من 2 الظهر.',
    caption: 'بيكوف.\nمقهى قهوة مختصة في ممشى الشوقية، مكة.\n\nقهوتنا سوداء، بلا حليب وبلا سكر، بمحصول تختاره. وإذا ما تدري وش تختار، اسأل ونقول لك.\n\nنفتح من السبت للخميس من 7 الصبح لين 2 بعد منتصف الليل، والجمعة من 2 الظهر.' },
  { id: '02-menu', menu: true, kicker: null, head: ['القائمة'], accent: false, size: 96,
    caption: 'قائمتنا كاملة. الأسعار بالريال.\n\nقهوة اليوم الباردة تتغيّر كل يوم، ومحاصيل الـV60 تتغيّر، فاسأل عن المتوفر وقت زيارتك.' },
  { id: '03-v60', kicker: 'V60', head: ['كلاسيك', 'ولا فاخر؟'], accent: true, size: 124,
    body: 'الفاخر بمحاصيل مختارة. اسأل عن المحصول المتوفر اليوم.',
    rows: [['V60 كلاسيك', '12.90 ر.س'], ['V60 فاخر', '16.90 ر.س']],
    caption: 'V60 كلاسيك بالتقطير اليدوي: 12.90 ر.س.\nV60 فاخر بمحاصيل مختارة: 16.90 ر.س.\n\nالمحاصيل تتغيّر، فاسأل عن المتوفر وقت زيارتك.' },
  { id: '04-cold-coffee', kicker: 'قهوة اليوم الباردة', head: ['وش قهوة', 'اليوم؟'], accent: true,
    body: 'تتغيّر كل يوم. اسأل عند الطلب، ونقول لك وش فيها.',
    rows: [['عادي', '5.90 ر.س'], ['كبير', '7.90 ر.س']],
    caption: 'قهوة اليوم الباردة تتغيّر كل يوم. اسأل عنها وقت زيارتك.\n\nعادي 5.90 ر.س، وكبير 7.90 ر.س.' },
  { id: '05-dessert', kicker: 'الحلا', head: ['مع القهوة', 'شي حلو؟'], accent: true, body: null,
    rows: [['كوكيز', '8.90 ر.س'], ['كريم كراميل', '9.90 ر.س'], ['بودنق', '11.90 ر.س']],
    caption: 'مع القهوة؟\n\nكوكيز 8.90 ر.س\nكريم كراميل 9.90 ر.س\nبودنق 11.90 ر.س\n\nوش تختار؟' },
  { id: '06-hibiscus', kicker: 'مشروبات', head: ['ما تبي قهوة', 'الحين؟'], accent: true, size: 128,
    body: 'عندنا كركديه.',
    rows: [['عادي', '6.90 ر.س'], ['كبير', '9.90 ر.س']],
    caption: 'مو كل واحد يبي قهوة وقت ما يجي. عندنا كركديه: عادي 6.90 ر.س، وكبير 9.90 ر.س.' },
  { id: '07-hours', kicker: 'وين نلقاك', head: ['ممشى', 'الشوقية.'], accent: true, size: 150,
    body: null,
    rows: [['السبت – الخميس', '7 الصبح – 2 الليل'], ['الجمعة', '2 الظهر – 2 الليل']],
    caption: 'وين نلقاك؟\nممشى الشوقية، مكة المكرمة.\n\nالسبت – الخميس: من 7 الصبح لين 2 بعد منتصف الليل.\nالجمعة: من 2 الظهر لين 2 بعد منتصف الليل.' },
  { id: '08-black-only', kicker: null, big: true, head: ['قهوة سوداء.', 'فقط.'], accent: true, size: 150,
    body: 'بلا حليب، بلا سكر. القهوة كما هي، بمحصول تختاره.',
    caption: 'هذا اختيارنا: القهوة كما هي، بلا حليب وبلا سكر.\n\nتجي وتجرّب؟' },
  { id: '09-question', kicker: null, big: true, head: ['أول كوب', 'في يومك؟'], accent: true, size: 150,
    body: 'V60 ولا إسبريسو؟ اكتب لنا في التعليقات.',
    caption: 'أول كوب في يومك: V60 ولا إسبريسو؟\n\nاكتب لنا في التعليقات.' },
];
const html = (s) => `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>${css}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;height:1350px;background:#2a3033;color:#f3f4f2;font-family:'Plex',sans-serif;position:relative;overflow:hidden}
.wrap{position:absolute;inset:0;padding:110px 90px 90px;display:flex;flex-direction:column}
.top{display:flex;justify-content:space-between;align-items:baseline}
.mark{font-family:'Jost',sans-serif;font-weight:300;font-size:44px;letter-spacing:.42em;direction:ltr;margin-right:-.42em}
.tag{font-weight:300;font-size:30px;color:#8e9898}
.rule{width:125px;height:3px;background:#7fb5ae;margin-top:46px}
.kicker{margin-top:70px;font-size:34px;font-weight:400;color:#7fb5ae;letter-spacing:.02em}
.head{font-family:'Kufi',sans-serif;font-weight:600;line-height:1.28}
.head .a{color:#7fb5ae}
.body{font-weight:300;color:#b4bcbb;line-height:1.75}
.rows{margin-top:50px}
.row{display:flex;align-items:baseline;gap:22px;margin-bottom:34px}
.row .n{font-size:54px;font-weight:400}
.row .d{flex:1;border-bottom:2px dotted #4b5557;transform:translateY(-8px)}
.row .p{font-size:46px;font-weight:300;color:#b4bcbb;direction:rtl}
.foot{margin-top:auto;border-top:2px solid #3b4547;padding-top:36px}
.msec{font-size:30px;color:#7fb5ae;margin:18px 0 6px;border-bottom:2px solid #3b4547;padding-bottom:6px}
.mrow{display:flex;align-items:baseline;gap:18px;margin-bottom:6px}.mrow .n{font-size:36px}.mrow .d{flex:1;border-bottom:2px dotted #4b5557;transform:translateY(-6px)}.mrow .p{font-size:32px;font-weight:300;color:#b4bcbb}
.loc{font-size:42px;font-weight:600}
.hrs{font-size:34px;font-weight:300;color:#8e9898;margin-top:14px}
${s.big
  ? `.kicker{margin-top:0}.mid{margin-top:90px}.head{font-size:${s.size||178}px}.body{font-size:52px;margin-top:70px}`
  : `.mid{margin-top:0}.head{font-size:${s.size||(s.rows && s.rows.length > 2 ? 140 : 150)}px;margin-top:38px}.body{font-size:46px;margin-top:50px}`}
</style></head><body><div class="wrap">
<div class="top"><div class="mark">PEACOFF</div><div class="tag">قهوة مختصة · مكة</div></div>
<div class="rule"></div>
<div class="mid">
${s.kicker ? `<div class="kicker">${s.kicker}</div>` : ''}
<div class="head">${s.head.map((l, i) => (s.accent && i === s.head.length - 1 ? `<span class="a">${l}</span>` : l)).join('<br>')}</div>
${s.body ? `<div class="body">${s.body}</div>` : ''}
${s.menu ? menu.map(([t,r])=>`<div class="msec">${t}</div>`+r.map(([n,p])=>`<div class="mrow"><span class="n">${n}</span><span class="d"></span><span class="p">${p} ر.س</span></div>`).join('')).join('') : ''}
${s.rows ? `<div class="rows">${s.rows.map(([n, p]) => `<div class="row"><span class="n">${n}</span><span class="d"></span><span class="p">${p}</span></div>`).join('')}</div>` : ''}
</div>
<div class="foot"><div class="loc">${LOC}</div>${s.hours ? `<div class="hrs">${s.hours}</div>` : ''}</div>
</div></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  for (const s of stories) {
    await page.setContent(html(s));
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(OUT, `${s.id}.jpg`), type: 'jpeg', quality: 93 });
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'stories.json'), JSON.stringify(stories.map(({id,caption})=>({id,image:id+'.jpg',caption,hashtags:TAGS})), null, 2));
  console.log('done', stories.length);
})();
