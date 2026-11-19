const {chromium}=require('playwright');const fs=require('fs');const D=process.argv[2];
const img=(i)=>'data:image/png;base64,'+fs.readFileSync(`${D}/W${i}.png`).toString('base64');
const fr=(i)=>`<div class="fr"><img src="${img(i)}"></div>`;
const html=`<style>*{margin:0}body{width:1400px;height:2400px;background:#aaa7b6;position:relative;overflow:hidden}
.niche{position:absolute;left:210px;top:620px;width:980px;height:1500px;background:#e9e1d3;border-radius:490px 490px 0 0;box-shadow:inset 0 0 90px rgba(0,0,0,.25)}
.glow{position:absolute;left:210px;top:620px;width:980px;height:520px;border-radius:490px 490px 0 0;box-shadow:inset 0 14px 40px rgba(255,214,150,.75)}
.row{position:absolute;left:300px;width:800px;display:flex;gap:40px;justify-content:center}
.fr{width:240px;height:320px;background:#111;padding:10px;box-shadow:0 18px 26px rgba(0,0,0,.35)}.fr img{width:100%;height:100%;object-fit:cover;display:block}
.shelf{position:absolute;left:210px;width:980px;height:26px;background:#f2ece1}
.panel{position:absolute;left:0;right:0;top:2120px;height:280px;background:repeating-linear-gradient(90deg,#9fd0dc 0 34px,#b6e0ea 34px 44px)}</style>
<div class="niche"></div><div class="glow"></div>
<div class="row" style="top:830px">${[1,2,3].map(fr).join('')}</div><div class="shelf" style="top:1170px"></div>
<div class="row" style="top:1235px">${[4,5,6].map(fr).join('')}</div><div class="shelf" style="top:1575px"></div>
<div class="row" style="top:1640px">${[7,8,9].map(fr).join('')}</div><div class="shelf" style="top:1980px"></div><div class="panel"></div>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:2400}});await p.setContent(html);await p.waitForTimeout(300);await p.screenshot({path:D+'/mockup.png'});await b.close()})();
