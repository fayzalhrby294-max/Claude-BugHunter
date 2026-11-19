import subprocess, os, sys
U="/root/.claude/uploads/b9087e4e-6c13-5102-8402-2143e0fba601/"
S="/tmp/claude-0/-home-user-Claude-BugHunter/b9087e4e-6c13-5102-8402-2143e0fba601/scratchpad/trend/"
SEG=S+"seg/"
C={1:"f47c4376-IMG_5536.mov",2:"7b9fba8a-34F23D1B-57CE-4A5D-9C9C-87C5BED22A37.mov",3:"1eefa700-DC9481FC-EBE0-4D32-A6EB-92F3DBD9696F.mov",5:"c5b82521-IMG_5536.mov"}
# (clip, ss, out_dur, speed, push)
TL=[(1,1.0,2.8,0.5,0.06),(2,0.1,1.6,1.4,0.03),(2,2.7,1.6,1.0,0.03),(3,0.4,1.6,1.0,0.04),(2,4.6,1.4,1.0,0.03),(5,0.0,2.7,1.0,0.05)]
GRADE=("hqdn3d=1.2:1.2:4:4,eq=contrast=1.1:saturation=0.95:gamma=0.98,"
       "colorbalance=rs=-0.03:bs=0.04:rh=0.05:gh=0.02:bh=-0.05,curves=all='0/0.02 0.45/0.42 1/0.98',"
       "vignette=angle=PI/5,unsharp=5:5:0.9:5:5:0.0,noise=alls=3:allf=t")
def run(c):
    r=subprocess.run(c,capture_output=True,text=True)
    if r.returncode: print(" ".join(c)[:250]); print(r.stderr[-1200:]); sys.exit(1)
segs=[]
for i,(c,ss,d,sp,push) in enumerate(TL):
    out=f"{SEG}s{i}.mp4"; src=d*sp
    vf=(f"setpts=PTS/{sp},scale=w='1080*(1+{push}*t/{d})':h=-2:eval=frame:flags=lanczos,crop=1080:1920,"+GRADE+",fps=30,format=yuv420p")
    if i==0: vf+=",fade=t=in:st=0:d=0.12"
    af=f"atempo={sp},aresample=48000,aformat=channel_layouts=stereo,afade=t=in:d=0.04,afade=t=out:st={d-0.05}:d=0.05"
    run(["ffmpeg","-v","error","-y","-ss",str(ss),"-t",str(src),"-i",U+C[c],"-vf",vf,"-af",af,"-r","30","-c:v","libx264","-preset","slow","-crf","15","-c:a","aac","-b:a","160k",out])
    segs.append(out)
end=SEG+"end.mp4"
run(["ffmpeg","-v","error","-y","-loop","1","-framerate","30","-t","1.4","-i","/home/user/Claude-BugHunter/peacoff_data/design/brand/endcard.png","-f","lavfi","-t","1.4","-i","anullsrc=r=48000:cl=stereo",
     "-vf","scale=1080:1920,fade=t=in:st=0:d=0.3,format=yuv420p","-c:v","libx264","-crf","15","-c:a","aac","-shortest",end])
segs.append(end)
open(SEG+"list.txt","w").write("".join(f"file '{p}'\n" for p in segs))
base=S+"base.mp4"; run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i",SEG+"list.txt","-c","copy",base])
dur=sum(d for _,_,d,_,_ in TL); t_last=dur-TL[-1][2]
fc=(f"[1:v]format=rgba,fade=t=in:st=0.15:d=0.3:alpha=1,fade=t=out:st=2.55:d=0.35:alpha=1[h];"
    f"[2:v]format=rgba,fade=t=in:st={t_last+0.3}:d=0.5:alpha=1,fade=t=out:st={dur-0.3}:d=0.3:alpha=1[f];"
    f"[0:v][h]overlay=0:0:eof_action=pass[a];[a][f]overlay=0:0:eof_action=pass,format=yuv420p[v];[0:a]loudnorm=I=-16:TP=-2:LRA=9[aa]")
master=S+"PEACOFF_trend_master.mp4"
run(["ffmpeg","-v","error","-y","-i",base,"-loop","1","-t",str(dur+1.4),"-i",S+"hook.png","-loop","1","-t",str(dur+1.4),"-i",S+"final.png","-filter_complex",fc,"-map","[v]","-map","[aa]",
     "-c:v","libx264","-preset","slow","-crf","20","-pix_fmt","yuv420p","-c:a","aac","-b:a","160k","-movflags","+faststart",master])
print("master",round(os.path.getsize(master)/1e6,1),"MB dur",dur+1.4)
