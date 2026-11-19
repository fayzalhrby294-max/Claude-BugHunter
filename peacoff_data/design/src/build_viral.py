import subprocess, os, sys, wave
import numpy as np
U="/root/.claude/uploads/b9087e4e-6c13-5102-8402-2143e0fba601/"
S="/tmp/claude-0/-home-user-Claude-BugHunter/b9087e4e-6c13-5102-8402-2143e0fba601/scratchpad/viral/"
SEG=S+"seg/"
C={"keys":"5f2a9965-IMG_7227.mov","lock":"b76bab98-IMG_7228.mov","pour":"f47c4376-IMG_5536.mov","v60":"7b9fba8a-34F23D1B-57CE-4A5D-9C9C-87C5BED22A37.mov","bloom":"1eefa700-DC9481FC-EBE0-4D32-A6EB-92F3DBD9696F.mov","cup":"c5b82521-IMG_5536.mov"}
TL=[("pour",1.0,2.2,0.5,0.07),("keys",4.9,1.0,1.0,0.0),("lock",0.1,1.6,1.0,0.0),("v60",0.3,1.0,1.2,0.03),
    ("v60",2.8,1.0,1.0,0.03),("bloom",0.8,1.2,1.0,0.04),("v60",4.8,1.1,1.0,0.03),("cup",0.3,2.4,1.0,0.05)]
GRADE=("hqdn3d=1.3:1.3:4:4,eq=contrast=1.1:saturation=0.94:gamma=0.98,"
       "colorbalance=rs=-0.025:bs=0.04:rh=0.05:gh=0.018:bh=-0.05,curves=all='0/0.03 0.45/0.43 1/0.98',"
       "vignette=angle=PI/5,unsharp=5:5:0.8:5:5:0.0,noise=alls=3:allf=t")
def run(c):
    r=subprocess.run(c,capture_output=True,text=True)
    if r.returncode: print(" ".join(c)[:250]); print(r.stderr[-1200:]); sys.exit(1)
segs=[]
for i,(c,ss,d,sp,push) in enumerate(TL):
    out=f"{SEG}s{i}.mp4"; src=d*sp
    if push: sc=f"scale=w='1080*(1+{push}*t/{d})':h=-2:eval=frame:flags=lanczos,crop=1080:1920"
    else: sc="scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920"
    vf=f"setpts=PTS/{sp},{sc},{GRADE},fps=30,format=yuv420p"
    af=f"atempo={sp},aresample=48000,aformat=channel_layouts=stereo,afade=t=in:d=0.03,afade=t=out:st={d-0.04}:d=0.04"
    run(["ffmpeg","-v","error","-y","-ss",str(ss),"-t",str(src),"-i",U+C[c],"-vf",vf,"-af",af,"-r","30","-c:v","libx264","-preset","slow","-crf","15","-c:a","aac","-b:a","160k",out])
    segs.append(out)
open(SEG+"list.txt","w").write("".join(f"file '{p}'\n" for p in segs))
base=S+"base.mp4"; run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i",SEG+"list.txt","-c","copy",base])
dur=sum(d for _,_,d,_,_ in TL)
cuts=[];t=0
for _,_,d,_,_ in TL[:-1]: t+=d; cuts.append(round(t,3))
# --- مؤثرات صوتية خفيفة متزامنة مع القصّات (whoosh قبل القصّة + نبضة منخفضة في البداية) ---
sr=48000; n=int(sr*dur); sfx=np.zeros(n,np.float32); rng=np.random.default_rng(3)
def whoosh(end_t,length=0.30,gain=0.16):
    m=int(sr*length); w=rng.standard_normal(m).astype(np.float32)
    F=np.fft.rfft(w); f=np.fft.rfftfreq(m,1/sr); F*=((f>700)&(f<5200)); w=np.fft.irfft(F,m)
    env=np.linspace(0,1,m)**2.2*np.linspace(1,0.15,m)**0.6; w=w*env; w/=np.abs(w).max()+1e-9
    s=int(sr*end_t)-m+int(sr*0.03); s=max(0,s); sfx[s:s+m]+=w[:max(0,min(m,n-s))]*gain
for ct in cuts: whoosh(ct)
m=int(sr*0.55); tt=np.arange(m)/sr; thump=(np.sin(2*np.pi*58*tt)*np.exp(-tt*7))*0.55+ (rng.standard_normal(m)*np.exp(-tt*90))*0.06
sfx[:m]+=thump.astype(np.float32)
sfx=np.clip(sfx,-1,1); st=np.stack([sfx,sfx],1); wav=S+"sfx.wav"
with wave.open(wav,"wb") as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes((st*32767).astype(np.int16).tobytes())
# --- الطبقات النصية ---
OV=[("hook",0.0,2.1),("cap_door",2.3,4.7),("cap_ice",4.9,5.7),("cap_coffee",5.9,6.7),("cap_bloom",6.9,7.9),("cap_drip",8.1,9.0),("final",9.3,dur-0.15)]
inputs=["-i",base,"-i",wav,"-loop","1","-t",str(dur),"-i","/home/user/Claude-BugHunter/peacoff_data/design/logo/symbol_white.png"]
fc="";prev="[0:v]"
idx=3
for name,a,b in OV:
    inputs+=["-loop","1","-t",str(dur),"-i",S+name+".png"]
    fa=0.0 if name=="hook" else a
    fc+=f"[{idx}:v]format=rgba,fade=t=in:st={a}:d={0.001 if name=='hook' else 0.14}:alpha=1,fade=t=out:st={b-0.14}:d=0.14:alpha=1[o{idx}];{prev}[o{idx}]overlay=0:0:eof_action=pass[v{idx}];"
    prev=f"[v{idx}]"; idx+=1
fc+=f"[2:v]scale=96:-1,format=rgba,colorchannelmixer=aa=0.8[lg];{prev}[lg]overlay=x=70:y=230:eof_action=pass,format=yuv420p[v];"
fc+="[0:a][1:a]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-15:TP=-2:LRA=8[a]"
master=S+"PEACOFF_viral_master.mp4"
run(["ffmpeg","-v","error","-y"]+inputs+["-filter_complex",fc,"-map","[v]","-map","[a]","-t",str(dur),"-c:v","libx264","-preset","slow","-crf","19","-pix_fmt","yuv420p","-c:a","aac","-b:a","160k","-movflags","+faststart",master])
print("master",round(os.path.getsize(master)/1e6,1),"MB dur",dur,"cuts",cuts)
