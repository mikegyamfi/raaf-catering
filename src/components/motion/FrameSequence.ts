import { asset } from "@/lib/site";

/**
 * Real footage played frame-by-frame from scroll position.
 * Frames are WebP stills in /public/frames/<name>/000.webp … (extracted with
 * scripts/video-frames.mjs). They load lazily, and the nearest loaded frame
 * is drawn so scrubbing never stalls while the rest arrive.
 */
export class FrameSequence {
  images: HTMLImageElement[] = [];
  loaded: boolean[] = [];
  private started = false;

  constructor(
    public name: string,
    public count: number,
  ) {}

  /** Start fetching (first, last and middle frames first, so scrubbing works early). */
  load(onFrame?: () => void) {
    if (this.started) return;
    this.started = true;
    const order = [0, this.count - 1, Math.floor(this.count / 2), ...Array.from({ length: this.count }, (_, i) => i)];
    const seen = new Set<number>();
    for (const i of order) {
      if (seen.has(i)) continue;
      seen.add(i);
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        this.loaded[i] = true;
        onFrame?.();
      };
      img.src = asset(`/frames/${this.name}/${String(i).padStart(3, "0")}.webp`);
      this.images[i] = img;
    }
  }

  /** The loaded frame closest to progress p (0..1), or null if none yet. */
  frame(p: number) {
    const want = Math.round(Math.min(1, Math.max(0, p)) * (this.count - 1));
    for (let d = 0; d < this.count; d++) {
      if (this.loaded[want - d]) return this.images[want - d];
      if (this.loaded[want + d]) return this.images[want + d];
    }
    return null;
  }
}

/** Draw an image to fill the canvas like CSS object-fit: cover, with a focal point. */
export function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number, alpha = 1, focusX = 0.5, focusY = 0.5) {
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * s;
  const dh = img.naturalHeight * s;
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, (w - dw) * focusX, (h - dh) * focusY, dw, dh);
  ctx.globalAlpha = 1;
}
