import numpy as np, os
from PIL import Image, ImageFilter
W, H = 1800, 2400
OUT = os.environ["OUT"]
os.makedirs(OUT, exist_ok=True)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

def noise(scale, seed):
    rng = np.random.default_rng(seed)
    gh, gw = H // scale + 4, W // scale + 4
    g = rng.random((gh, gw)).astype(np.float32)
    im = Image.fromarray(g, mode='F').resize((gw * scale, gh * scale), Image.BICUBIC)
    return np.asarray(im)[:H, :W]

def fbm(base, octv, seed):
    s = np.zeros((H, W), np.float32); amp = 1.0; tot = 0.0
    for i in range(octv):
        sc = max(3, int(base / (2 ** i)))
        s += amp * noise(sc, seed + i); tot += amp; amp *= 0.5
    s /= tot
    return (s - s.min()) / (s.max() - s.min())

def samp(f, X, Y):
    X = np.clip(X, 0, W - 1.01); Y = np.clip(Y, 0, H - 1.01)
    x0 = X.astype(np.int32); y0 = Y.astype(np.int32); fx = X - x0; fy = Y - y0
    return (f[y0, x0] * (1 - fx) * (1 - fy) + f[y0, x0 + 1] * fx * (1 - fy) +
            f[y0 + 1, x0] * (1 - fx) * fy + f[y0 + 1, x0 + 1] * fx * fy)

def blur(a, r):
    return np.asarray(Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r))).astype(np.float32) / 255.0

GOLD = np.array([218, 180, 108], np.float32)
def comp(bg, line, glow, color=GOLD, ga=0.45):
    a = np.clip(line, 0, 1)[..., None]
    out = bg * (1 - a) + color * a
    out = out + color * np.clip(glow, 0, 1)[..., None] * ga
    return np.clip(out, 0, 255)

def save(name, rgb):
    Image.fromarray(rgb.astype(np.uint8)).save(os.path.join(OUT, name + ".png"))

def teal_bg(seed, lo=(5, 20, 22), hi=(20, 66, 68)):
    c = fbm(520, 5, seed); c = blur(c, 30)
    c = (c - c.min()) / (c.max() - c.min())
    lo = np.array(lo, np.float32); hi = np.array(hi, np.float32)
    return lo + (hi - lo) * c[..., None]

# ---------- 1) رخام بعروق ذهبية ----------
n = blur(fbm(1300, 3, 1), 26); n = (n - n.min()) / (n.max() - n.min())
q = blur(fbm(1000, 3, 10), 20); r = blur(fbm(1000, 3, 20), 20)
base = samp(n, xx + (q - .5) * 900, yy + (r - .5) * 900)
base = (base - base.min()) / (base.max() - base.min())
t = (yy / H * .55 + xx / W * .95) * 2.3 + (base - .5) * 3.4
line = np.power(1 - np.abs(np.sin(t * np.pi)), 22)
line2 = np.power(1 - np.abs(np.sin((t * 1.7 + .6) * np.pi)), 70) * .55
ln = np.clip(line + line2, 0, 1)
bg = teal_bg(31)
save("marble", comp(bg, ln, blur(ln, 9), ga=.5))
save("marble_soft", comp(bg, ln * .4, blur(ln, 9) * .5, ga=.25))

# ---------- 2) كريما ----------
a1 = blur(fbm(1100, 4, 3), 8); a2 = blur(fbm(1100, 4, 4), 8)
X = xx + (a1 - .5) * 1100; Y = yy + (a2 - .5) * 1100
m1 = samp(blur(fbm(800, 4, 5), 6), X, Y)
f = samp(blur(fbm(900, 4, 6), 6), xx + (m1 - .5) * 900, yy + (samp(a2, X, Y) - .5) * 900)
f = (f - f.min()) / (f.max() - f.min())
f = np.power(np.clip((f - .03) / .94, 0, 1), 1.35)
stops = [0, .25, .5, .76, 1.0]
cols = np.array([(12, 7, 6), (48, 26, 14), (112, 66, 32), (178, 122, 66), (226, 192, 140)], np.float32)
rgb = np.stack([np.interp(f, stops, cols[:, i]) for i in range(3)], -1)
iso = np.power(1 - np.abs(np.sin(f * np.pi * 8)), 45)
save("crema", comp(rgb, iso * .55, blur(iso, 7), ga=.18))

# ---------- 3) خطوط كنتورية ذهبية ----------
tf = blur(fbm(900, 4, 7), 14); tf = (tf - tf.min()) / (tf.max() - tf.min())
lv = tf * 30; fr = np.abs(lv - np.round(lv))
thin = np.exp(-(fr / .075) ** 2) * .85
idx = (np.round(lv).astype(int) % 5 == 0)
thick = np.exp(-(fr / .12) ** 2) * idx
ln = np.clip(thin * .55 + thick * .75, 0, 1)
save("topo", comp(teal_bg(41, (4, 16, 18), (14, 52, 54)), ln, blur(ln, 8)))
print("fields ok")
