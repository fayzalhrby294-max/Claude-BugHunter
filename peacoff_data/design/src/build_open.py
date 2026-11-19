import subprocess, os, sys
U="/root/.claude/uploads/b9087e4e-6c13-5102-8402-2143e0fba601/"
S="/tmp/claude-0/-home-user-Claude-BugHunter/b9087e4e-6c13-5102-8402-2143e0fba601/scratchpad/open/"
SEG=S+"seg/"
CL={4:"5f2a9965-IMG_7227.mov",3:"ae662c5a-IMG_7225.mov",2:"bde6b851-IMG_7224.mov",5:"b76bab98-IMG_7228.mov",6:"d510305b-IMG_7230.mov",1:"3261eb24-IMG_7219.mov"}
# (clip, ss, dur, push)
TL=[(4,4.0,2.4,0),(5,0.0,2.5,0),(6,0.15,0.7,0),(1,3.0,5.4,1)]
GRADE=("hqdn3d=1.4:1.4:5:5,eq=contrast=1.06:saturation=0.9:gamma=1.02,"
       "colorbalance=rs=-0.02:bs=0.035:rh=0.05:gh=0.015:bh=-0.05,curves=all='0/0.04 0.5/0.5 1/0.97',"
       "vignette=angle=PI/6,unsharp=5:5:0.7:5:5:0.0,noise=alls=3:allf=t")
def run(c):
    r=subprocess.run(c,capture_output=True,text=True)
    if r.returncode: print(" ".join(c)[:250]); print(r.stderr[-1200:]); sys.exit(1)
segs=[]
for i,(c,ss,d,push) in enumerate(TL):
    out=f"{SEG}s{i}.mp4"
    if push==2: vf=f"scale=1080:1974:flags=lanczos,crop=734:1305:x='(iw-734)/2-22+44*t/{d}':y=0,scale=1080:1920:flags=lanczos"
    elif push: vf=f"scale=w='1080*(1+0.055*t/{d})':h=-2:eval=frame:flags=lanczos,crop=1080:1920"
    else: vf="scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920"
    vf+=","+GRADE+",fps=30"+(",fade=t=in:st=0:d=0.3" if i==0 else "")+",format=yuv420p"
    af=f"aresample=48000,aformat=channel_layouts=stereo,afade=t=in:d=0.04,afade=t=out:st={d-0.04}:d=0.04"
    run(["ffmpeg","-v","error","-y","-ss",str(ss),"-t",str(d),"-i",U+CL[c],"-vf",vf,"-af",af,"-c:v","libx264","-preset","slow","-crf","14","-c:a","aac","-b:a","160k",out])
    segs.append(out)
# end card
end=SEG+"end.mp4"
run(["ffmpeg","-v","error","-y","-loop","1","-framerate","30","-t","1.4","-i","/home/user/Claude-BugHunter/peacoff_data/design/brand/endcard.png","-f","lavfi","-t","1.4","-i","anullsrc=r=48000:cl=stereo",
     "-vf","scale=1080:1920,fade=t=in:st=0:d=0.35,format=yuv420p","-c:v","libx264","-crf","14","-c:a","aac","-shortest",end])
segs.append(end)
lst=SEG+"list.txt"; open(lst,"w").write("".join(f"file '{p}'\n" for p in segs))
base=S+"base.mp4"; run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i",lst,"-c","copy",base])
dur=sum(d for _,_,d,_ in TL); t0=sum(d for _,_,d,_ in TL[:-1])+0.7; t1=dur-0.2
fc=(f"[1:v]format=rgba,fade=t=in:st={t0}:d=0.6:alpha=1,fade=t=out:st={t1-0.4}:d=0.4:alpha=1[tx];[0:v][tx]overlay=0:0:eof_action=pass,format=yuv420p[v];"
    f"[0:a]loudnorm=I=-16:TP=-2:LRA=9[a]")
master=S+"PEACOFF_opening_master.mp4"
run(["ffmpeg","-v","error","-y","-i",base,"-loop","1","-t",str(dur+1.4),"-i",S+"text.png","-filter_complex",fc,"-map","[v]","-map","[a]",
     "-c:v","libx264","-preset","slow","-crf","20","-pix_fmt","yuv420p","-c:a","aac","-b:a","160k","-movflags","+faststart",master])
print("master",os.path.getsize(master)/1e6,"MB","dur",dur+1.4,"text at",t0)
