"""Generate replaceable placeholder photos + audio for the experience.

Run: python3 scripts/generate-placeholders.py
Swap the outputs in public/media with real photos / recordings later.
"""
import math, os, random, subprocess, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "media")
PHOTOS = os.path.join(ROOT, "photos")
AUDIO = os.path.join(ROOT, "audio")
os.makedirs(PHOTOS, exist_ok=True)
os.makedirs(AUDIO, exist_ok=True)

PALETTES = [
    ((52, 34, 40), (201, 146, 140), (235, 207, 213)),
    ((24, 22, 38), (120, 104, 150), (217, 168, 181)),
    ((40, 32, 24), (200, 173, 125), (246, 240, 232)),
    ((18, 26, 32), (90, 122, 130), (235, 207, 213)),
    ((44, 28, 30), (217, 168, 181), (200, 173, 125)),
    ((30, 24, 20), (160, 120, 90), (246, 228, 200)),
]

def photo(name, w, h, seed, label):
    rnd = random.Random(seed)
    base, mid, light = PALETTES[seed % len(PALETTES)]
    y = np.linspace(0, 1, h)[:, None]
    x = np.linspace(0, 1, w)[None, :]
    ang = rnd.uniform(0, math.pi)
    t = np.clip((x * math.cos(ang) + y * math.sin(ang)), 0, 1)
    img = np.zeros((h, w, 3))
    for c in range(3):
        img[..., c] = base[c] * (1 - t) + mid[c] * t
    im = Image.fromarray(img.astype("uint8"))
    glow = Image.new("RGB", (w, h), (0, 0, 0))
    d = ImageDraw.Draw(glow)
    for _ in range(14):
        r = rnd.randint(int(w * 0.04), int(w * 0.22))
        cx, cy = rnd.randint(0, w), rnd.randint(0, h)
        a = rnd.uniform(0.25, 0.7)
        col = tuple(int(v * a) for v in light)
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)
    glow = glow.filter(ImageFilter.GaussianBlur(w * 0.05))
    im = Image.fromarray(np.clip(np.asarray(im, dtype=float) + np.asarray(glow, dtype=float) * 0.8, 0, 255).astype("uint8"))
    # vignette + grain
    arr = np.asarray(im, dtype=float)
    vx = (x - 0.5) ** 2 + (y - 0.5) ** 2
    arr *= (1 - np.clip(vx * 1.4, 0, 0.75))[..., None]
    arr += np.random.default_rng(seed).normal(0, 9, arr.shape)
    im = Image.fromarray(np.clip(arr, 0, 255).astype("uint8"))
    d = ImageDraw.Draw(im)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", max(16, w // 28))
    except OSError:
        font = ImageFont.load_default()
    d.text((w * 0.06, h * 0.9), label, fill=(246, 240, 232), font=font)
    im.save(os.path.join(PHOTOS, name), quality=82)

shapes = [(1200, 1500), (1500, 1000), (1000, 1250), (1400, 1400), (1600, 1067)]
for i in range(1, 17):
    w, h = shapes[i % len(shapes)]
    photo(f"photo-{i:02d}.jpg", w, h, i, f"photo {i:02d} — replace me")

SR = 22050

def write(name, sig):
    sig = np.clip(sig, -1, 1)
    path = os.path.join(AUDIO, name + ".wav")
    with wave.open(path, "w") as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes((sig * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", path, "-b:a", "96k", os.path.join(AUDIO, name + ".mp3")], check=True)
    os.remove(path)

def env(n, a=0.01, r=0.5):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / r)

def tone(f, dur, a=0.01, r=0.5, harm=(1, 0.3, 0.1)):
    n = int(SR * dur); t = np.arange(n) / SR
    s = sum(h * np.sin(2 * math.pi * f * (k + 1) * t) for k, h in enumerate(harm))
    return s * env(n, a, r)

def mix(*parts, dur):
    out = np.zeros(int(SR * dur))
    for start, sig in parts:
        i = int(start * SR); out[i:i + len(sig)] += sig[: len(out) - i]
    return out

write("chime", 0.35 * mix((0, tone(880, 1.6, r=0.6)), (0.09, tone(1318.5, 1.6, r=0.6)), dur=1.8))
write("soft", 0.25 * tone(392, 0.9, a=0.03, r=0.25, harm=(1, 0.15)))
write("discover", 0.3 * mix((0, tone(1567, 1.2, r=0.4)), (0.07, tone(2093, 1.2, r=0.4)), (0.14, tone(2637, 1.4, r=0.5)), dur=1.6))
noise = np.random.default_rng(3).normal(0, 1, int(SR * 0.9))
paper = np.convolve(noise, np.ones(18) / 18, mode="same") * env(len(noise), a=0.05, r=0.25)
write("paper", 0.5 * paper)

def pad(dur, chords, seed):
    rng = np.random.default_rng(seed)
    n = int(SR * dur); t = np.arange(n) / SR; out = np.zeros(n)
    seg = dur / len(chords)
    for i, chord in enumerate(chords):
        a, b = int(i * seg * SR), int(min(n, (i + 1) * seg * SR + SR * 1.5))
        tt = t[a:b] - t[a]
        e = np.sin(np.pi * np.clip(tt / (b / SR - a / SR), 0, 1)) ** 2
        for f in chord:
            out[a:b] += 0.12 * np.sin(2 * math.pi * f * tt + rng.uniform(0, 6)) * e
            out[a:b] += 0.04 * np.sin(2 * math.pi * f * 2.003 * tt) * e
    return out

ambient = pad(32, [(220, 277.2, 329.6), (196, 246.9, 329.6), (174.6, 220, 261.6), (196, 246.9, 293.7)], 1)
fade = int(SR * 2); ambient[:fade] *= np.linspace(0, 1, fade); ambient[-fade:] *= np.linspace(1, 0, fade)
write("ambient", 0.6 * ambient)
voice = pad(48, [(261.6, 329.6, 392), (220, 261.6, 329.6), (174.6, 220, 261.6), (196, 246.9, 293.7)] * 2, 2)
melody = [523.3, 587.3, 659.3, 587.3, 523.3, 440, 493.9, 523.3]
for i, f in enumerate(melody * 2):
    s = tone(f, 2.5, a=0.05, r=0.9, harm=(1, 0.2)) * 0.18
    st = int((1.5 + i * 2.8) * SR); voice[st:st + len(s)] += s[: len(voice) - st]
write("voice-letter", 0.7 * voice)
write("secret-note", 0.6 * pad(20, [(293.7, 370, 440), (246.9, 311.1, 370)], 3))
print("done")
