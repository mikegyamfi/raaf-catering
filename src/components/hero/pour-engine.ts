/**
 * Flour & wheat pour, a small particle engine for the hero.
 *
 * 1. The wordmark text is rasterised off-screen and sampled into target points.
 * 2. A "hand" sweeps left → right sifting grains; each grain falls under real
 *    gravity, lands, bounces a touch on a damped spring and settles. Columns fill
 *    bottom-up, so the letters build like a pile.
 * 3. Once settled, the grains lift away as flour dust while the crisp DOM
 *    wordmark fades in (handled by the component).
 * 4. Then the loop stops: nothing keeps drawing once the word is done.
 */

type Grain = {
  tx: number;
  ty: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  spawn: number;
  state: 0 | 1 | 2 | 3 | 4; // waiting, falling, settling, settled, lifting
  sprite: number;
  liftDelay: number;
  alpha: number;
};

type Dust = { x: number; y: number; vx: number; vy: number; life: number; r: number };

export type PourOptions = {
  canvas: HTMLCanvasElement;
  /** The element whose text forms the grains */
  textEl: HTMLElement;
  /** Container the canvas covers */
  host: HTMLElement;
  mobile: boolean;
  onSettled: () => void;
};

const GRAIN_COLORS = ["#c7832c", "#a9661d", "#d99a3c", "#f2cf74", "#8a4f17", "#e0b061"];
const FLOUR_COLORS = ["#fffdf8", "#f3eadb"];

export function createPour(opts: PourOptions) {
  const { canvas, textEl, host, mobile } = opts;
  const ctx = canvas.getContext("2d", { alpha: true })!;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0;
  let H = 0;
  let grains: Grain[] = [];
  let dust: Dust[] = [];
  let sprites: HTMLCanvasElement[] = [];
  let gap = 4;
  let raf = 0;
  let t0 = 0;
  let last = 0;
  let phase: "pour" | "lift" | "motes" | "done" = "pour";
  let settledFired = false;
  let running = false;
  let lastSpawnEnd = 0;
  const G = 2400; // px/s²: real-feeling gravity at this scale

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = host.getBoundingClientRect();
    W = r.width;
    H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeSprites() {
    sprites = [];
    const s = Math.ceil(gap * 2.2 * dpr);
    // Golden grains: little rotated ellipses with a highlight
    for (let i = 0; i < GRAIN_COLORS.length * 3; i++) {
      const c = document.createElement("canvas");
      c.width = c.height = s;
      const g = c.getContext("2d")!;
      g.translate(s / 2, s / 2);
      g.rotate((i * 1.1) % Math.PI);
      g.fillStyle = GRAIN_COLORS[i % GRAIN_COLORS.length];
      g.beginPath();
      g.ellipse(0, 0, s * 0.36, s * 0.2, 0, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "rgba(255,240,200,0.45)";
      g.beginPath();
      g.ellipse(-s * 0.08, -s * 0.05, s * 0.16, s * 0.06, 0, 0, Math.PI * 2);
      g.fill();
      sprites.push(c);
    }
    // Flour: soft round specks
    for (const col of FLOUR_COLORS) {
      const c = document.createElement("canvas");
      c.width = c.height = s;
      const g = c.getContext("2d")!;
      const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s * 0.32);
      grd.addColorStop(0, col);
      grd.addColorStop(1, "rgba(255,253,248,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, s, s);
      sprites.push(c);
    }
  }

  /** Rasterise the DOM text exactly where it sits, then sample it */
  function sampleTargets() {
    const cs = getComputedStyle(textEl);
    const hostR = host.getBoundingClientRect();
    const r = textEl.getBoundingClientRect();
    const fontSize = parseFloat(cs.fontSize);
    gap = Math.max(mobile ? 2.6 : 3.4, fontSize / (mobile ? 38 : 72));

    const scale = 1 / gap;
    const ow = Math.ceil(W * scale);
    const oh = Math.ceil(H * scale);
    const off = document.createElement("canvas");
    off.width = ow;
    off.height = oh;
    const o = off.getContext("2d", { willReadFrequently: true })!;
    o.scale(scale, scale);
    o.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    (o as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
    o.textBaseline = "alphabetic";
    const m = o.measureText(textEl.textContent || "");
    const contentH = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
    const lineH = r.height;
    const baseline = r.top - hostR.top + (lineH - contentH) / 2 + m.fontBoundingBoxAscent;
    o.fillStyle = "#000";
    o.fillText(textEl.textContent || "", r.left - hostR.left, baseline);

    const data = o.getImageData(0, 0, ow, oh).data;
    const pts: { x: number; y: number }[] = [];
    for (let y = 0; y < oh; y++) {
      for (let x = 0; x < ow; x++) {
        if (data[(y * ow + x) * 4 + 3] > 128) pts.push({ x: x / scale + (Math.random() - 0.5) * gap * 0.5, y: y / scale + (Math.random() - 0.5) * gap * 0.5 });
      }
    }
    return pts;
  }

  function build() {
    size();
    const pts = sampleTargets();
    makeSprites();
    if (!pts.length) return;
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    for (const p of pts) {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }
    const sweep = 1.25; // seconds for the hand to cross the word
    const fill = 0.45; // seconds to build a column bottom → top
    const flourSprites = FLOUR_COLORS.length;
    grains = pts.map((p) => {
      const across = (p.x - minX) / Math.max(1, maxX - minX);
      const up = (maxY - p.y) / Math.max(1, maxY - minY);
      // Ease the sweep so it starts gently and accelerates, like a real hand
      const sweepT = sweep * (0.5 - Math.cos(across * Math.PI) / 2);
      const spawn = sweepT + up * fill + Math.random() * 0.14;
      const isFlour = Math.random() < 0.22;
      return {
        tx: p.x,
        ty: p.y,
        x: p.x + (Math.random() - 0.5) * gap * 6,
        y: -30 - Math.random() * 120,
        vx: (Math.random() - 0.5) * 18,
        vy: 80 + Math.random() * 120,
        spawn,
        state: 0,
        sprite: isFlour ? sprites.length - 1 - Math.floor(Math.random() * flourSprites) : Math.floor(Math.random() * (sprites.length - flourSprites)),
        liftDelay: Math.random() * 0.55 + (1 - up) * 0.25,
        alpha: 1,
      };
    });
    lastSpawnEnd = grains.reduce((m, g) => Math.max(m, g.spawn), 0);
  }

  function puff(x: number, y: number, n: number, force = 1) {
    if (dust.length > (mobile ? 120 : 260)) return;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9;
      const s = (30 + Math.random() * 90) * force;
      dust.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.6 + Math.random() * 0.5, r: 0.6 + Math.random() * 1.6 });
    }
  }

  function drawSprite(i: number, x: number, y: number, alpha = 1) {
    const s = sprites[i];
    const w = s.width / dpr;
    ctx.globalAlpha = alpha;
    ctx.drawImage(s, x - w / 2, y - w / 2, w, w);
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (!t0) {
      t0 = now;
      last = now;
    }
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    const t = (now - t0) / 1000;
    ctx.clearRect(0, 0, W, H);

    if (phase === "pour" || phase === "lift") {
      let unsettled = 0;
      for (const g of grains) {
        if (g.state === 0) {
          if (t >= g.spawn) g.state = 1;
          else {
            unsettled++;
            continue;
          }
        }
        if (g.state === 1) {
          g.vy += G * dt;
          // A gentle pull toward its column as it falls
          g.vx += (g.tx - g.x) * 3.2 * dt;
          g.x += g.vx * dt;
          g.y += g.vy * dt;
          if (g.y >= g.ty) {
            const impact = g.vy;
            g.y = g.ty;
            g.vy = -impact * (0.08 + Math.random() * 0.1);
            g.vx = (Math.random() - 0.5) * impact * 0.12;
            g.state = 2;
            if (Math.random() < (mobile ? 0.03 : 0.05)) puff(g.x, g.y, 2 + Math.floor(Math.random() * 3), 0.8);
          }
          unsettled++;
        } else if (g.state === 2) {
          // Damped spring toward the resting spot: a small bounce, then still
          const k = 260;
          const c = 18;
          g.vx += (-k * (g.x - g.tx) - c * g.vx) * dt;
          g.vy += (-k * (g.y - g.ty) - c * g.vy) * dt;
          g.x += g.vx * dt;
          g.y += g.vy * dt;
          if (Math.abs(g.vx) + Math.abs(g.vy) < 4 && Math.abs(g.x - g.tx) + Math.abs(g.y - g.ty) < 0.4) {
            g.x = g.tx;
            g.y = g.ty;
            g.state = 3;
          } else unsettled++;
        } else if (g.state === 4) {
          if (g.liftDelay > 0) g.liftDelay -= dt;
          else {
            g.vy -= 60 * dt;
            g.vx += (Math.random() - 0.5) * 40 * dt;
            g.x += g.vx * dt;
            g.y += g.vy * dt;
            g.alpha -= dt * 1.6;
          }
        }
        if (g.alpha > 0) drawSprite(g.sprite, g.x, g.y, g.alpha);
      }

      if (phase === "pour" && !settledFired && t > lastSpawnEnd && unsettled === 0) {
        settledFired = true;
        opts.onSettled();
      }
      if (phase === "lift" && grains.every((g) => g.alpha <= 0)) {
        phase = "motes";
        grains = [];
      }
    }

    // Flour dust
    for (const d of dust) {
      d.vy += 120 * dt;
      d.vx *= 0.96;
      d.vy *= 0.96;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.life -= dt;
      ctx.globalAlpha = Math.max(0, d.life) * 0.8;
      ctx.fillStyle = "#fffdf8";
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
    dust = dust.filter((d) => d.life > 0);

    ctx.globalAlpha = 1;
    // Word resolved and the last dust has settled: stop drawing entirely
    if (phase === "motes" && dust.length === 0) {
      ctx.clearRect(0, 0, W, H);
      cancelAnimationFrame(raf);
      running = false;
      phase = "done" as typeof phase;
    }
  }

  return {
    start() {
      build();
      running = true;
      raf = requestAnimationFrame(frame);
    },
    /** Grains lift away as dust (call when the DOM wordmark fades in) */
    lift() {
      phase = "lift";
      for (const g of grains) {
        g.state = 4;
        g.vx = (Math.random() - 0.5) * 30;
        g.vy = -10 - Math.random() * 30;
      }
      for (let i = 0; i < (mobile ? 10 : 22); i++) {
        const g = grains[Math.floor(Math.random() * grains.length)];
        if (g) puff(g.tx, g.ty, 3, 0.7);
      }
    },
    /** Skip to the end (resize mid-pour) */
    finish() {
      grains = [];
      phase = "motes";
      if (!settledFired) {
        settledFired = true;
        opts.onSettled();
      }
    },
    resize() {
      size();
    },
    pause() {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    },
    resume() {
      if (running || phase === "done") return;
      running = true;
      raf = requestAnimationFrame((n) => {
        last = n;
        frame(n);
      });
    },
    get phase() {
      return phase;
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
    },
  };
}
