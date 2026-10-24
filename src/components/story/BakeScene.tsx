/**
 * The stage for the bake story: a bowl on a board, a sifter's flour stream,
 * a jug of milk, a pat of butter, a dough ball that becomes a loaf, and an
 * oven mouth that glows behind it all. Every part is a named class so the
 * scroll timeline (BakeStory.tsx) can choreograph it.
 *
 * Artboard: 600 × 600.
 */

// Dough and loaf share a point count so MorphSVG blends them smoothly
export const DOUGH_PATH =
  "M300 345 C370 345 412 382 414 430 C416 470 372 486 300 486 C228 486 184 470 186 430 C188 382 230 345 300 345 Z";
export const LOAF_PATH =
  "M300 352 C392 352 462 396 468 452 C472 482 400 492 300 492 C200 492 128 482 132 452 C138 396 208 352 300 352 Z";
export const BUTTER_BLOCK = "M262 238 L338 238 C344 238 348 242 348 248 L348 282 C348 288 344 292 338 292 L262 292 C256 292 252 288 252 282 L252 248 C252 242 256 238 262 238 Z";
// A soft, irregular puddle spreading over the milk (same 8-segment structure as the block)
export const BUTTER_MELT = "M238 332 L330 328 C360 326 392 334 398 342 L396 350 C390 360 352 362 330 360 L250 362 C220 364 196 356 194 348 L196 340 C204 332 222 332 238 332 Z";

export function BakeScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 600" className={className} aria-hidden>
      <defs>
        <radialGradient id="bk-oven" cx="50%" cy="62%" r="55%">
          <stop offset="0%" stopColor="#ffd98a" />
          <stop offset="38%" stopColor="#f2a33c" />
          <stop offset="72%" stopColor="#a64d14" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#2a1a11" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bk-loaf" cx="40%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#e6a548" />
          <stop offset="55%" stopColor="#c7832c" />
          <stop offset="100%" stopColor="#8a4f17" />
        </radialGradient>
        <linearGradient id="bk-milk" x1="0" x2="1">
          <stop offset="0%" stopColor="#f1ebdf" />
          <stop offset="45%" stopColor="#fffdf8" />
          <stop offset="100%" stopColor="#ebe3d4" />
        </linearGradient>
        <linearGradient id="bk-bowl" x1="0" x2="1">
          <stop offset="0%" stopColor="#d9cbb3" />
          <stop offset="40%" stopColor="#f6efe2" />
          <stop offset="100%" stopColor="#cdbd9f" />
        </linearGradient>
        <radialGradient id="bk-dust">
          <stop offset="0%" stopColor="#fbf6ee" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fbf6ee" stopOpacity="0" />
        </radialGradient>
        <clipPath id="bk-oven-mouth">
          <path d="M140 520 L140 304 C140 192 214 128 300 128 C386 128 460 192 460 304 L460 520 Z" />
        </clipPath>
        <clipPath id="bk-bowl-clip">
          <ellipse cx="300" cy="330" rx="158" ry="35" />
          <rect x="140" y="330" width="320" height="200" />
        </clipPath>
      </defs>

      {/* Oven mouth: appears for the bake */}
      <g className="bk-oven" opacity="0">
        <path d="M110 520 L110 300 C110 170 200 96 300 96 C400 96 490 170 490 300 L490 520 Z" fill="#3d281b" />
        <path d="M140 520 L140 304 C140 192 214 128 300 128 C386 128 460 192 460 304 L460 520 Z" fill="#1c110b" />
        <g clipPath="url(#bk-oven-mouth)">
          <g className="bk-glow" style={{ transformOrigin: "300px 420px" }}>
            <ellipse cx="300" cy="420" rx="210" ry="200" fill="url(#bk-oven)" />
          </g>
        </g>
        {[180, 240, 300, 360, 420].map((x) => (
          <rect key={x} x={x - 2} y="508" width="4" height="12" rx="2" fill="#a64d14" opacity="0.6" />
        ))}
      </g>

      {/* Board */}
      <g className="bk-board">
        <ellipse cx="300" cy="528" rx="236" ry="36" fill="#5b3418" />
        <ellipse cx="300" cy="518" rx="236" ry="36" fill="#8a5427" />
        <ellipse cx="300" cy="516" rx="220" ry="29" fill="#9b6230" />
        <path d="M120 512 C220 524 380 524 480 512" stroke="#7a4520" strokeWidth="2" fill="none" opacity="0.5" />
        {/* Soft flour patches dusted on the board */}
        <ellipse className="bk-flourdust" cx="196" cy="512" rx="34" ry="7" fill="url(#bk-dust)" opacity="0" />
        <ellipse className="bk-flourdust" cx="410" cy="514" rx="42" ry="8" fill="url(#bk-dust)" opacity="0" />
        <ellipse className="bk-flourdust" cx="330" cy="528" rx="26" ry="5" fill="url(#bk-dust)" opacity="0" />
      </g>

      {/* Bowl + its contents */}
      <g className="bk-bowl" style={{ transformOrigin: "300px 500px" }}>
        <ellipse cx="300" cy="330" rx="170" ry="40" fill="#cdbd9f" />
        <ellipse cx="300" cy="334" rx="158" ry="34" fill="#b9a78a" />
        <g clipPath="url(#bk-bowl-clip)">
          {/* Flour mound */}
          <path className="bk-mound" d="M170 372 C210 330 250 300 300 296 C350 300 390 330 430 372 Z" fill="#fbf6ee" style={{ transformOrigin: "300px 372px" }} />
          <path className="bk-mound-shade" d="M300 296 C350 300 390 330 430 372 L360 372 C350 340 330 312 300 296 Z" fill="#e8dcc6" opacity="0" />
          {/* Milk */}
          <g className="bk-milk">
            <ellipse cx="300" cy="350" rx="160" ry="34" fill="url(#bk-milk)" />
            <ellipse className="bk-ripple" cx="318" cy="346" rx="20" ry="5" fill="none" stroke="#e8dcc6" strokeWidth="2.5" opacity="0" />
            <ellipse className="bk-ripple" cx="318" cy="346" rx="20" ry="5" fill="none" stroke="#e8dcc6" strokeWidth="2" opacity="0" />
          </g>
          {/* Butter melting into it */}
          <path className="bk-butter" d={BUTTER_BLOCK} fill="#f2cf74" />
          <path className="bk-butter-gloss" d="M266 246 L318 246" stroke="#fff6d6" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
          <ellipse className="bk-butter-spec" cx="276" cy="338" rx="16" ry="3" fill="#fffbe9" opacity="0" />
        </g>
        <path d="M130 330 C134 440 200 504 300 506 C400 504 466 440 470 330 C466 352 400 372 300 372 C200 372 134 352 130 330 Z" fill="url(#bk-bowl)" />
        <path d="M150 360 C170 430 220 476 270 488" stroke="#fffdf8" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.7" />
        <path d="M130 330 C134 352 200 372 300 372 C400 372 466 352 470 330" stroke="#e8dcc6" strokeWidth="5" fill="none" />
      </g>

      {/* Flour stream from a sifter */}
      <g className="bk-sifter">
        <ellipse cx="300" cy="42" rx="70" ry="16" fill="#cdbd9f" />
        <path d="M232 40 L248 82 C260 92 340 92 352 82 L368 40 Z" fill="#b9a78a" />
        <path d="M250 82 C270 90 330 90 350 82" stroke="#8e7c60" strokeWidth="3" fill="none" />
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={i} x1={258 + i * 14} y1="58" x2={262 + i * 14} y2="80" stroke="#8e7c60" strokeWidth="1.5" opacity="0.6" />
        ))}
      </g>
      {/* Powdery fall: a soft veil plus dotted grains that keep streaming down */}
      <g className="bk-flourfall" style={{ transformOrigin: "300px 88px" }}>
        <path d="M300 88 C301 170 299 250 300 330" stroke="#fbf6ee" strokeWidth="22" strokeLinecap="butt" fill="none" opacity="0.28" />
        <path d="M300 88 C301 170 299 250 300 330" stroke="#fbf6ee" strokeWidth="9" strokeLinecap="butt" fill="none" opacity="0.4" />
        {[
          [292, 3.2, "1 11", 0.9],
          [300, 4, "1 7", 1],
          [308, 3, "1 11", 0.85],
          [286, 2.2, "1 15", 0.7],
          [314, 2.4, "1 13", 0.7],
          [296, 1.6, "1 5", 0.8],
          [304, 1.8, "1 6", 0.8],
        ].map(([x, w, dash, o], i) => (
          <path
            key={i}
            className="flour-fall"
            d={`M${x} 88 C${(x as number) + 1} 170 ${(x as number) - 1} 250 ${x} 330`}
            stroke="#fffdf8"
            strokeWidth={w as number}
            strokeLinecap="round"
            strokeDasharray={dash as string}
            fill="none"
            opacity={o as number}
            style={{ animationDuration: `${1.1 + i * 0.08}s` }}
          />
        ))}
      </g>

      {/* Milk jug + stream */}
      <g className="bk-jug" style={{ transformOrigin: "470px 120px" }}>
        <path d="M420 60 L520 60 L510 180 C508 190 432 190 430 180 Z" fill="#fffdf8" />
        <path d="M420 60 L404 76 L428 82 Z" fill="#fffdf8" />
        <path d="M520 84 C552 84 556 140 516 146" stroke="#e8dcc6" strokeWidth="10" fill="none" />
        <path d="M424 64 L516 64" stroke="#e8dcc6" strokeWidth="3" />
        <rect x="436" y="100" width="64" height="70" rx="6" fill="#f3eadb" />
      </g>
      <path className="bk-milkstream" d="M406 78 C380 120 336 160 322 220 C316 260 318 300 318 344" stroke="url(#bk-milk)" strokeWidth="14" strokeLinecap="round" fill="none" />

      {/* Dough → loaf */}
      <g className="bk-doughwrap" style={{ transformOrigin: "300px 488px" }}>
        <ellipse className="bk-dough-shadow" cx="300" cy="490" rx="120" ry="7" fill="#2a1a11" opacity="0" />
        <path className="bk-dough" d={DOUGH_PATH} fill="#f1e2c4" opacity="0" />
        <path className="bk-dough-crust" d={DOUGH_PATH} fill="url(#bk-loaf)" opacity="0" />
        <path className="bk-fold" d="M240 400 C270 420 330 420 360 400" stroke="#d9c49b" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0" />
        <path className="bk-dough-shine" d="M246 382 C276 364 324 364 354 382" stroke="#fffaf0" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0" />
        <g className="bk-scores" stroke="#8a4f17" strokeWidth="7" strokeLinecap="round" fill="none">
          <path className="bk-score" d="M214 420 C236 396 258 388 280 384" />
          <path className="bk-score" d="M272 416 C294 392 316 384 338 380" />
          <path className="bk-score" d="M330 418 C352 396 374 390 396 388" />
        </g>
        <path className="bk-loaf-shine" d="M200 402 C240 370 300 362 352 368" stroke="#f8d48a" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0" />
      </g>

      {/* Steam over the finished loaf */}
      <g className="bk-steam" stroke="#f8e4ab" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0">
        <path d="M250 330 C236 300 266 286 252 254 C242 232 260 214 254 196" />
        <path d="M300 320 C286 288 316 274 302 240 C292 218 310 200 304 180" />
        <path d="M350 330 C336 300 366 286 352 254 C342 232 360 214 354 196" />
      </g>
    </svg>
  );
}
