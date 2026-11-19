#!/usr/bin/env python3
"""Reel montage builder: tone-maps HDR, crops to 9:16, applies one brand grade, cuts on action,
overlays hook text, and two-pass encodes under the connector's ~3 MB upload limit."""
import subprocess, os, sys, json

U = "/root/.claude/uploads/b9087e4e-6c13-5102-8402-2143e0fba601/"
S = "/tmp/claude-0/-home-user-Claude-BugHunter/b9087e4e-6c13-5102-8402-2143e0fba601/scratchpad/"
OUT = "/home/user/Claude-BugHunter/peacoff_data/reels/"
SEG = S + "r/seg/"
os.makedirs(SEG, exist_ok=True)

M1 = U + "3959ba03-copy_AE3D2A74-F5D7-4DA2-AF72-92E5A21632DE.mov"
M3 = U + "257a8253-IMG_5963.mov"
M5 = U + "aaafa923-copy_589070FA-0513-4A0D-B2F0-0501CB10559B.mov"
M7 = U + "44cd9ae2-ff02fe45543e4b5b9bae25ca8ce14da0.mov"   # 720p HLG HDR

HDR2SDR = ("zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,"
           "tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p")
# one grade for every shot: gentle contrast, restrained saturation, teal shadows / warm highlights, soft vignette
GRADE = ("eq=contrast=1.07:saturation=0.88:gamma=1.03:brightness=-0.015,"
         "colorbalance=rs=-0.035:bs=0.05:rh=0.03:bh=-0.025,"
         "vignette=angle=PI/5,unsharp=5:5:0.45:5:5:0.0")


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        print(" ".join(cmd)[:300]); print(r.stderr[-1500:]); sys.exit(1)


def seg(tag, src, ss, dur, hdr=False, zoom=1.0, speed=1.0):
    vf = []
    if hdr:
        vf.append(HDR2SDR)
    if zoom > 1.0:
        vf.append(f"crop=iw/{zoom}:ih/{zoom}")
    vf.append("scale=1080:1920:flags=lanczos:force_original_aspect_ratio=increase,crop=1080:1920")
    if speed != 1.0:
        vf.append(f"setpts={1/speed}*PTS")
    vf += ["fps=30", GRADE, "format=yuv420p"]
    out = SEG + tag + ".mp4"
    run(["ffmpeg", "-v", "error", "-y", "-ss", str(ss), "-t", str(dur * speed), "-i", src, "-an",
         "-vf", ",".join(vf), "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p", out])
    return out


def build(name, segs, hook_png, hook_window, end_dur, target_mb=2.85):
    lst = SEG + name + ".txt"
    open(lst, "w").write("".join(f"file '{p}'\n" for p in segs))
    base = SEG + name + "_base.mp4"
    run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", base])
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                         "-of", "csv=p=0", base]).decode().strip())
    h0, h1 = hook_window
    e0 = dur - end_dur
    fc = (f"[1:v]format=rgba,fade=t=in:st={h0}:d=0.35:alpha=1,fade=t=out:st={h1-0.35}:d=0.35:alpha=1[h];"
          f"[0:v][h]overlay=0:0:eof_action=pass,format=yuv420p[v]")
    kbps = int((target_mb * 8 * 1000 * 1000) / dur / 1000) - 40
    final = OUT + name + ".mp4"
    common = ["-i", base, "-loop", "1", "-t", str(dur), "-i", hook_png, "-loop", "1", "-t", str(dur), "-i", S + "r/end.png"]  # 3rd input unused (kept for index stability)
    log = SEG + name + "_pass"
    enc = ["-filter_complex", fc, "-map", "[v]", "-c:v", "libx264", "-preset", "slow", "-b:v", f"{kbps}k",
           "-maxrate", f"{int(kbps*1.35)}k", "-bufsize", f"{int(kbps*2)}k", "-r", "30", "-pix_fmt", "yuv420p"]
    sil = ["-f", "lavfi", "-t", str(dur), "-i", "anullsrc=r=44100:cl=stereo"]
    run(["ffmpeg", "-v", "error", "-y"] + common + sil + enc + ["-pass", "1", "-passlogfile", log, "-an", "-f", "mp4", "/dev/null"])
    run(["ffmpeg", "-v", "error", "-y"] + common + sil + enc + ["-pass", "2", "-passlogfile", log,
        "-map", "3:a", "-c:a", "aac", "-b:a", "32k", "-shortest", "-movflags", "+faststart", final])
    size = os.path.getsize(final)
    print(name, f"dur={dur:.1f}s size={size/1e6:.2f}MB kbps={kbps}")
    return final


os.makedirs(OUT, exist_ok=True)
def endcard(dur=1.5):
    out = SEG + "endcard.mp4"
    run(["ffmpeg","-v","error","-y","-loop","1","-framerate","30","-t",str(dur),"-i",S+"r/endfull.png",
         "-vf","scale=1080:1920,fade=t=in:st=0:d=0.3,format=yuv420p","-c:v","libx264","-preset","slow","-crf","14","-pix_fmt","yuv420p",out])
    return out
# ── Reel A: V60 · حراز ── hook = steady pour on the bed with the Haraz bag visible
a = [seg("a1", M5, 0.8, 2.6), seg("a2", M5, 3.8, 2.1, zoom=1.18), seg("a3", M3, 1.2, 2.2), seg("a4", M1, 0.0, 1.1), endcard(1.5)]
build("reel_v60_haraz", a, S + "r/hookA.png", (0.3, 2.7), 1.5)
# ── Reel B: إسبريسو ── hook = macro espresso pull with flowers behind
b = [seg("b1", M1, 7.0, 2.0), seg("b3", M7, 2.5, 4.4, hdr=True), seg("b4", M1, 10.4, 1.5), seg("b5", M1, 0.0, 1.1), endcard(1.5)]
build("reel_espresso", b, S + "r/hookB.png", (0.3, 2.3), 1.5)
