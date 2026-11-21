const {C,LOGOS,baseCSS,plumage,fs,path}=require('../../winter/lib.js');const {chromium}=require('playwright');
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const base=`${baseCSS}@page{size:A4;margin:0}*{margin:0;padding:0;box-sizing:border-box}body{color:${C.gun}}
.pg{width:210mm;height:297mm;position:relative;overflow:hidden;page-break-after:always}
.top{height:22mm;background:${C.gun};border-bottom:1.1mm solid ${C.tif};padding:0 12mm;display:flex;align-items:center;justify-content:space-between;position:relative;overflow:hidden}
.top .pl{position:absolute;inset:0;opacity:.3}.top img{height:12mm;position:relative}.top .t{position:relative;text-align:right}.top small{display:block;font-size:6.4pt;letter-spacing:.3em;color:${C.tif};direction:ltr;text-align:right}.top h1{font-size:17pt;color:#fff;font-weight:700;margin-top:.8mm}
.ft{position:absolute;left:12mm;right:12mm;bottom:7mm;display:flex;justify-content:space-between;font-size:6.5pt;color:#6b7678;letter-spacing:.2em}`;
const head=(t,s)=>`<div class="top"><div class="pl">${plumage(794,84,{r:24,line:C.tif,fill:C.gun,eye:C.tif,eyeOp:.8,lw:.8,op:.5,id:'t'})}</div><div class="t"><small>${s}</small><h1>${t}</h1></div><img src="${LOGOS.symT}"></div>`;
const Q=[
['بن V60: ___ جم · ثلج ___ جم · ماء ___ مل','20 · 150 · 150'],
['صب V60: ___ دفعات، كل دفعة ___ جم، وانتظار ___ ثانية بينها','3 · 50 · 30'],
['طحن V60: حراز ___ · سفاري ___ · كالداس ___','6.1 · 5 · 5.2'],
['حرارة الماء: سفاري ___° · وبقية المحاصيل ___°','86 · 89'],
['إسبريسو: بن ___ جم · طحن ___ · ماء ___° · ناتج ___ جم في ___ ثانية','18.5 · 15 · 90 · 30 · 30'],
['ضغط الإسبريسو بالترتيب (5 ثواني لكل مرحلة): ___ ثم ___ ثم ___ بار','3 · 5 · 9'],
['قهوة اليوم: بن ___ جم على ___ جم ثلج · الطحن ___','100 · 500 · 7'],
['قهوة اليوم الصغير: ___ مكعبات ثلج + ___ مل · الكبير: ___ مكعبات + ___ مل','4 · 155 · 8 · 238'],
['الكركديه: أول خطوة ___ · حرارة الماء ___° · المدة ___ دقيقة','الغسل · 90 · 20'],
['الكركديه بعد التصفية يُترك ___ دقائق خارج الثلاجة ثم يوضع في الثلاجة','5'],
['دارك شوكولاتة: ___ جم شوكولاتة + ___ مل زيت','185 · 25'],
['ميكرويف الدارك شوكولاتة: قوة ___ لمدة ___ ثانية، ثم ___ ثانية مع التقليب','Med · 30 · 20']];
const quiz=(key)=>`<section class="pg">${head(key?'مفتاح الإجابات (للمدير)':'اختبار الموظف الجديد','PEACOFF · STANDARD')}
<div style="padding:9mm 14mm 0"><div style="display:flex;gap:10mm;margin-bottom:6mm;font-size:10pt;font-weight:600"><div style="flex:1;border-bottom:.3mm solid #8b9293;padding-bottom:1mm">الاسم: </div><div style="width:50mm;border-bottom:.3mm solid #8b9293;padding-bottom:1mm">التاريخ: </div></div>
${Q.map((q,i)=>`<div style="display:flex;gap:4mm;margin-bottom:${key?4.6:6.3}mm;align-items:flex-start"><div style="flex:none;width:6.6mm;height:6.6mm;border-radius:50%;background:${C.gun};color:#fff;font-weight:700;font-size:8.5pt;display:flex;align-items:center;justify-content:center">${i+1}</div><div style="flex:1;font-size:10.6pt;line-height:1.7">${q[0].replace(/___/g,'<span style="display:inline-block;width:15mm;border-bottom:.3mm solid #8b9293"></span>')}${key?`<div style="margin-top:1mm;background:#eef6f6;border-right:1mm solid ${C.tif};padding:.8mm 3mm;font-weight:700;font-size:10pt">${q[1]}</div>`:''}</div></div>`).join('')}
${key?'':`<div style="margin-top:6mm;display:flex;gap:10mm;font-size:10pt;font-weight:600"><div style="flex:1;border-top:.3mm solid #8b9293;padding-top:1mm">النتيجة: ____ / 12</div><div style="flex:1;border-top:.3mm solid #8b9293;padding-top:1mm">توقيع المدير: </div></div>`}</div>
<div class="ft"><span>PEACOFF</span><span>COFFEE &amp; MORE</span></div></section>`;
const rows=Array.from({length:22},()=>`<tr>${'<td></td>'.repeat(9)}</tr>`).join('');
const dial=`<section class="pg" style="width:297mm;height:210mm">${head('سجل المعايرة اليومي (إسبريسو)','PEACOFF · DIAL-IN').replace('height:22mm','')}
<div style="padding:5mm 12mm 0"><div style="display:flex;gap:6mm;margin-bottom:4mm;font-size:9pt;font-weight:600"><span style="background:#eef6f6;border-right:1mm solid ${C.tif};padding:1.2mm 4mm">الهدف: بن 18.5 جم · ناتج 30 جم · وقت 30 ثانية · ماء 90° · الطحن الأساسي 15</span></div>
<table style="width:100%;border-collapse:collapse;table-layout:fixed;font-size:8pt"><thead><tr>${['التاريخ','الوقت','الطحن','البن (جم)','الناتج (جم)','الاستخلاص (ث)','الطعم: حامض / متوازن / مر','التعديل','الموظف'].map((h,i)=>`<th style="background:${C.gun};color:#fff;padding:1.6mm 1mm;font-weight:600;border-bottom:.6mm solid ${C.tif};${i==6?'width:48mm':''}">${h}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>
<div class="ft" style="left:12mm;right:12mm"><span>PEACOFF</span><span>COFFEE &amp; MORE</span></div></section>
<style>td{height:6.1mm;border-bottom:.22mm solid #d5dada;border-left:.2mm solid #e6eaea;background:#fbf8f1}</style>`;
(async()=>{const br=await chromium.launch();
async function pdf(htmlBody,file,opts){const p=await br.newPage();await p.setContent(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>${base}</style></head><body>${htmlBody}</body></html>`);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);await p.pdf({path:path.join(OUT,file),printBackground:true,margin:{top:0,bottom:0,left:0,right:0},...opts});await p.screenshot({path:path.join(OUT,file.replace('.pdf','.png'))});}
await pdf(quiz(false)+quiz(true),'PEACOFF_staff_quiz_A4.pdf',{preferCSSPageSize:true});
await pdf(dial+'<style>@page{size:297mm 210mm}</style>','PEACOFF_dialin_log_A4.pdf',{preferCSSPageSize:true});
await br.close();console.log('ok');})();
