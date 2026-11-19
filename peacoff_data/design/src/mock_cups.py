import numpy as np
from PIL import Image, ImageDraw, ImageFilter
OUT='out/'
def cup(art_path, scale=1.0):
    art=np.asarray(Image.open(art_path).convert('RGB')).astype(np.float32)
    Ha,Wa,_=art.shape
    Hc=int(1000*scale); rt=int(360*scale); rb=int(240*scale)
    pad=int(160*scale); Wc=2*rt+2*pad; Hh=Hc+int(0.14*rb)+int(300*scale)
    cx=Wc//2; top=int(150*scale)           # y where body starts
    img=np.zeros((Hh,Wc,4),np.float32)
    ys=np.arange(Hh)[:,None]; xs=np.arange(Wc)[None,:]
    yb=ys-top
    tt=np.clip(yb/Hc,0,1)
    r=rt+(rb-rt)*tt                      # top wide -> bottom narrow
    s=(xs-cx)/r
    inside=(np.abs(s)<=1)&(yb>=0)
    ry_b=0.12*rb
    ybot=Hc+ry_b*np.sqrt(np.clip(1-((xs-cx)/rb)**2,0,1))
    inside&=(yb<=ybot)
    th=np.arcsin(np.clip(s,-1,1))
    u=0.5+th/(2*np.pi)
    v=np.clip(yb/Hc,0,1)
    ax=np.clip(u*Wa,0,Wa-1.001); ay=np.clip(v*Ha,0,Ha-1.001)
    x0=ax.astype(int); y0=ay.astype(int); fx=ax-x0; fy=ay-y0
    def smp(c): return (art[y0,x0,c]*(1-fx)*(1-fy)+art[y0,np.minimum(x0+1,Wa-1),c]*fx*(1-fy)+art[np.minimum(y0+1,Ha-1),x0,c]*(1-fx)*fy+art[np.minimum(y0+1,Ha-1),np.minimum(x0+1,Wa-1),c]*fx*fy)
    rgb=np.stack([smp(0),smp(1),smp(2)],-1)
    shade=0.52+0.48*np.cos(th)**0.9
    spec=np.exp(-((th+0.62)/0.2)**2)*0.20+np.exp(-((th-0.95)/0.15)**2)*0.06
    rgb=rgb*shade[...,None]+255*spec[...,None]
    rgb=np.clip(rgb,0,255)
    below=(yb>Hc)
    rgb=np.where(below[...,None],rgb*0.78,rgb)
    img[...,:3]=rgb; img[...,3]=inside*255
    body=Image.fromarray(img.astype(np.uint8),'RGBA')
    # antialias edges slightly
    a=body.split()[3].filter(ImageFilter.GaussianBlur(0.8)); body.putalpha(a)
    # lid (matte black) drawn above body
    lid=Image.new('RGBA',body.size,(0,0,0,0)); d=ImageDraw.Draw(lid)
    L_top=top-int(70*scale); fr=int(0.12*rt)
    lw_t=rt+int(8*scale); lw_f=rt+int(30*scale)
    # flange ellipse and dome body
    d.polygon([(cx-lw_t,top-int(8*scale)),(cx+lw_t,top-int(8*scale)),(cx+int(rt*0.88),L_top),(cx-int(rt*0.88),L_top)],fill=(26,30,32,255))
    d.ellipse([cx-lw_f,top-int(8*scale)-fr,cx+lw_f,top-int(8*scale)+fr],fill=(30,35,37,255))
    d.ellipse([cx-int(rt*0.88),L_top-int(fr*0.9),cx+int(rt*0.88),L_top+int(fr*0.9)],fill=(40,46,48,255))
    d.ellipse([cx-int(rt*0.55),L_top-int(fr*0.5),cx+int(rt*0.2),L_top+int(fr*0.5)],fill=(24,28,30,255))
    # lid shading
    lidarr=np.asarray(lid).astype(np.float32); xx=(np.arange(lidarr.shape[1])[None,:]-cx)/(rt+30*scale)
    sh=0.55+0.45*np.cos(np.clip(np.arcsin(np.clip(xx,-1,1)),-1.6,1.6))
    lidarr[...,:3]=np.clip(lidarr[...,:3]*sh[...,None]+20*np.exp(-((xx+0.55)/0.2)**2)[...,None],0,255)
    lid=Image.fromarray(lidarr.astype(np.uint8),'RGBA')
    out=Image.new('RGBA',body.size,(0,0,0,0)); out.alpha_composite(body); out.alpha_composite(lid)
    return out, (cx, top+Hc)
bg=Image.new('RGB',(2400,1500))
g=np.linspace(0,1,1500)[:,None,None]; arr=(np.array([78,84,85])*(1-g)+np.array([22,26,28])*g)*np.ones((1500,2400,3)); 
vx=np.linspace(-1,1,2400)[None,:,None]; arr=arr*(1-0.28*vx**2)
bg=Image.fromarray(np.clip(arr,0,255).astype(np.uint8)).convert('RGBA')
spots=[('cup_B_gunmetal',420,1.0,0),('cup_A_cement',1200,1.1,0),('cup_C_white',1980,1.0,0)]
sh=Image.new('RGBA',bg.size,(0,0,0,0)); d=ImageDraw.Draw(sh)
placed=[]
for n,cxp,sc,_ in spots:
    c,(bx,by)=cup(OUT+n+'.png',sc); placed.append((c,cxp,bx,by,sc))
base_y=1290
for c,cxp,bx,by,sc in placed:
    d.ellipse([cxp-300*sc,base_y-18*sc,cxp+300*sc,base_y+40*sc],fill=(0,0,0,120))
sh=sh.filter(ImageFilter.GaussianBlur(28)); bg.alpha_composite(sh)
for c,cxp,bx,by,sc in placed:
    bg.alpha_composite(c,(int(cxp-bx),int(base_y-by)))
bg.convert('RGB').save(OUT+'cups_mockup.jpg',quality=92)
bg.convert('RGB').resize((1200,750),Image.LANCZOS).save(OUT+'cups_mockup_small.jpg',quality=90)
