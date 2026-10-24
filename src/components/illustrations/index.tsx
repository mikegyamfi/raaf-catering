import type { SVGProps } from "react";

/**
 * Hand-built food illustrations, one consistent style:
 * flat shapes in the RAAF palette, a darker shade layer for form,
 * a light highlight for gloss, and a soft ground shadow.
 * All drawn on a 200×200 artboard so they swap freely.
 */

const C = {
  crust: "#C7832C",
  crustDeep: "#A9661D",
  crustDark: "#8A4F17",
  butter: "#F2CF74",
  butterSoft: "#F8E4AB",
  toast: "#7A4520",
  cocoa: "#2A1A11",
  cocoaSoft: "#4A2E1E",
  flour: "#FBF6EE",
  cream: "#F3EADB",
  milk: "#FFFDF8",
  palm: "#1F3D2C",
  leaf: "#4F7A3A",
  leafLight: "#7FA35A",
  tomato: "#C2461E",
  tomatoDeep: "#9A3214",
  jollof: "#D2602A",
  plate: "#FFFDF8",
  plateShade: "#E8DCC6",
  orange: "#E8892B",
  fish: "#9C8B6E",
  fishDark: "#6E5F48",
};

const Shadow = ({ cx = 100, cy = 172, rx = 70, ry = 9 }: { cx?: number; cy?: number; rx?: number; ry?: number }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={C.cocoa} opacity={0.12} />
);

const Plate = ({ cy = 128, r = 78 }: { cy?: number; r?: number }) => (
  <g>
    <ellipse cx={100} cy={cy + 8} rx={r + 2} ry={r * 0.36} fill={C.cocoa} opacity={0.12} />
    <ellipse cx={100} cy={cy} rx={r} ry={r * 0.36} fill={C.plateShade} />
    <ellipse cx={100} cy={cy - 3} rx={r} ry={r * 0.34} fill={C.plate} />
    <ellipse cx={100} cy={cy - 2} rx={r * 0.72} ry={r * 0.24} fill={C.cream} />
  </g>
);

const Bowl = ({ fill, inner }: { fill: string; inner: string }) => (
  <g>
    <ellipse cx={100} cy={170} rx={64} ry={9} fill={C.cocoa} opacity={0.12} />
    <path d="M30 104 Q34 166 100 168 Q166 166 170 104 Z" fill={C.plate} />
    <path d="M30 104 Q34 166 100 168 Q120 168 136 160 Q70 150 46 104 Z" fill={C.plateShade} opacity={0.8} />
    <ellipse cx={100} cy={104} rx={70} ry={20} fill={C.plateShade} />
    <ellipse cx={100} cy={106} rx={62} ry={15} fill={fill} />
    <ellipse cx={92} cy={102} rx={40} ry={7} fill={inner} opacity={0.55} />
  </g>
);

const art = {
  loaf: () => (
    <g>
      <Shadow />
      <path d="M28 150 C22 108 52 66 100 66 C148 66 178 108 172 150 Q100 162 28 150 Z" fill={C.crust} />
      <path d="M28 150 C26 132 32 116 42 104 C46 130 70 150 120 156 Q70 160 28 150 Z" fill={C.crustDeep} />
      <path d="M58 92 C78 74 122 74 142 92" stroke={C.butter} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.7} />
      <path d="M72 84 L84 112 M100 78 L106 110 M128 84 L124 112" stroke={C.crustDark} strokeWidth={5} strokeLinecap="round" opacity={0.45} />
      <ellipse cx={80} cy={86} rx={18} ry={6} fill={C.butterSoft} opacity={0.55} transform="rotate(-18 80 86)" />
    </g>
  ),
  wheatLoaf: () => (
    <g>
      <Shadow />
      <rect x={36} y={74} width={128} height={84} rx={22} fill={C.toast} />
      <path d="M36 112 C36 84 60 64 100 64 C140 64 164 84 164 112 Z" fill={C.crustDeep} />
      <path d="M36 140 Q36 158 58 158 L142 158 Q120 150 60 140 Z" fill={C.crustDark} opacity={0.6} />
      {[56, 76, 96, 116, 136].map((x, i) => (
        <ellipse key={x} cx={x + 6} cy={80 + (i % 2) * 8} rx={3.4} ry={1.8} fill={C.butterSoft} opacity={0.9} transform={`rotate(${-20 + i * 9} ${x + 6} ${80 + (i % 2) * 8})`} />
      ))}
      {[66, 88, 108, 128].map((x, i) => (
        <ellipse key={x} cx={x} cy={96 - (i % 2) * 6} rx={3} ry={1.6} fill={C.cream} opacity={0.85} transform={`rotate(${15 - i * 10} ${x} ${96 - (i % 2) * 6})`} />
      ))}
      <path d="M64 72 C84 62 116 62 136 72" stroke={C.butter} strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.55} />
    </g>
  ),
  marbleLoaf: () => (
    <g>
      <Shadow />
      <path d="M30 152 L30 92 C30 76 44 66 60 66 L140 66 C156 66 170 76 170 92 L170 152 Z" fill={C.crust} />
      <rect x={96} y={66} width={74} height={86} fill={C.crustDeep} opacity={0.35} />
      <rect x={40} y={80} width={52} height={66} rx={8} fill={C.butterSoft} />
      <path d="M44 96 C58 86 70 108 62 118 C54 128 74 136 88 128" stroke={C.cocoaSoft} strokeWidth={9} strokeLinecap="round" fill="none" />
      <path d="M50 138 C60 130 70 142 84 136" stroke={C.cocoaSoft} strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.8} />
      <path d="M60 72 L150 72" stroke={C.butter} strokeWidth={4} strokeLinecap="round" opacity={0.5} />
    </g>
  ),
  cornLoaf: () => (
    <g>
      <Shadow />
      <rect x={34} y={76} width={132} height={80} rx={14} fill={C.crust} />
      <rect x={34} y={76} width={132} height={22} rx={11} fill={C.butter} />
      {Array.from({ length: 18 }).map((_, i) => (
        <circle key={i} cx={46 + (i % 9) * 14} cy={110 + Math.floor(i / 9) * 22} r={3.2} fill={C.butterSoft} opacity={0.8} />
      ))}
      <path d="M34 140 L166 140 L166 142 Q166 156 152 156 L48 156 Q34 156 34 142 Z" fill={C.crustDeep} />
    </g>
  ),
  bananaBread: () => (
    <g>
      <Shadow />
      <path d="M34 154 L34 96 C34 82 46 72 62 72 L138 72 C154 72 166 82 166 96 L166 154 Z" fill={C.toast} />
      <path d="M34 106 C34 84 60 70 100 70 C140 70 166 84 166 106 C150 96 120 92 100 92 C80 92 50 96 34 106 Z" fill={C.cocoaSoft} />
      <path d="M48 86 C74 64 128 62 156 80 C130 76 96 80 66 94 Z" fill={C.butter} />
      <path d="M52 86 C76 70 124 68 150 80" stroke={C.butterSoft} strokeWidth={3} fill="none" strokeLinecap="round" />
      {[[60, 120], [92, 132], [128, 118], [146, 140], [74, 144]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={4} fill={C.cocoa} opacity={0.6} />
      ))}
    </g>
  ),
  pie: () => (
    <g>
      <Shadow rx={74} />
      <path d="M26 132 C26 104 60 84 100 84 C140 84 174 104 174 132 C174 150 140 160 100 160 C60 160 26 150 26 132 Z" fill={C.crust} />
      <path d="M26 132 C26 150 60 160 100 160 C140 160 174 150 174 132 C160 146 130 152 100 152 C70 152 40 146 26 132 Z" fill={C.crustDeep} />
      {Array.from({ length: 13 }).map((_, i) => {
        const a = Math.PI + (i / 12) * Math.PI;
        const x = 100 + Math.cos(a) * 70;
        const y = 126 + Math.sin(a) * 38;
        return <ellipse key={i} cx={x} cy={y} rx={7} ry={4.5} fill={C.crustDeep} opacity={0.75} transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`} />;
      })}
      <path d="M70 108 Q100 96 130 108" stroke={C.butter} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.75} />
      <path d="M92 120 L108 120 M100 112 L100 128" stroke={C.crustDark} strokeWidth={3.5} strokeLinecap="round" opacity={0.6} />
    </g>
  ),
  sausageRoll: () => (
    <g>
      <Shadow />
      <g transform="rotate(-8 100 116)">
        <rect x={22} y={86} width={156} height={58} rx={28} fill={C.crust} />
        <rect x={22} y={118} width={156} height={26} rx={13} fill={C.crustDeep} />
        <ellipse cx={30} cy={115} rx={16} ry={26} fill={C.butterSoft} />
        <ellipse cx={30} cy={115} rx={10} ry={17} fill={C.tomatoDeep} opacity={0.75} />
        {[64, 96, 128, 156].map((x) => (
          <path key={x} d={`M${x} 90 L${x - 10} 112`} stroke={C.crustDark} strokeWidth={4.5} strokeLinecap="round" opacity={0.5} />
        ))}
        <path d="M54 94 L168 94" stroke={C.butter} strokeWidth={5} strokeLinecap="round" opacity={0.6} />
      </g>
    </g>
  ),
  rockBun: () => (
    <g>
      <Shadow rx={60} />
      <path d="M40 150 C30 128 42 100 64 96 C66 76 92 66 108 78 C126 66 156 80 154 104 C172 114 172 142 156 152 Q100 162 40 150 Z" fill={C.crust} />
      <path d="M40 150 C36 140 38 128 46 120 C56 140 90 152 140 154 Q90 160 40 150 Z" fill={C.crustDeep} />
      {[[74, 100], [112, 92], [136, 116], [92, 124], [60, 128], [124, 140]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={4.5} fill={C.cocoa} opacity={0.65} />
      ))}
      <ellipse cx={86} cy={88} rx={14} ry={5} fill={C.butterSoft} opacity={0.6} transform="rotate(-25 86 88)" />
    </g>
  ),
  quiche: () => (
    <g>
      <Shadow rx={74} />
      <ellipse cx={100} cy={128} rx={76} ry={32} fill={C.crustDeep} />
      <path d="M24 118 L24 128 C24 146 58 160 100 160 C142 160 176 146 176 128 L176 118 Z" fill={C.crust} />
      {Array.from({ length: 16 }).map((_, i) => (
        <path key={i} d={`M${30 + i * 9.4} 124 L${30 + i * 9.4} 152`} stroke={C.crustDeep} strokeWidth={2.5} opacity={0.5} />
      ))}
      <ellipse cx={100} cy={118} rx={76} ry={32} fill={C.crust} />
      <ellipse cx={100} cy={117} rx={66} ry={26} fill={C.butter} />
      <ellipse cx={86} cy={112} rx={30} ry={9} fill={C.butterSoft} opacity={0.8} />
      {[[70, 120, C.crustDeep], [112, 108, C.tomato], [130, 124, C.leaf], [94, 128, C.tomato], [80, 106, C.leaf]].map(([x, y, f]) => (
        <ellipse key={`${x}${y}`} cx={x as number} cy={y as number} rx={6} ry={3.5} fill={f as string} opacity={0.75} />
      ))}
    </g>
  ),
  springRoll: () => (
    <g>
      <Shadow />
      {[0, 1].map((n) => (
        <g key={n} transform={`translate(${n * 10} ${n * 26}) rotate(${n ? 14 : -12} 100 100)`}>
          <rect x={26} y={74} width={148} height={40} rx={20} fill={n ? C.crust : C.crustDeep} />
          <rect x={26} y={96} width={148} height={18} rx={9} fill={C.crustDark} opacity={0.35} />
          {[52, 84, 116, 146].map((x) => (
            <path key={x} d={`M${x} 76 Q${x + 6} 94 ${x} 112`} stroke={C.crustDark} strokeWidth={3} fill="none" opacity={0.4} />
          ))}
          <path d="M44 82 L156 82" stroke={C.butter} strokeWidth={4} strokeLinecap="round" opacity={0.65} />
          <ellipse cx={174} cy={94} rx={8} ry={19} fill={C.crustDeep} />
          <ellipse cx={174} cy={94} rx={4} ry={11} fill={C.leaf} opacity={0.7} />
        </g>
      ))}
    </g>
  ),
  samosa: () => (
    <g>
      <Shadow rx={66} />
      <path d="M34 150 L100 42 L166 150 Z" fill={C.crust} strokeLinejoin="round" stroke={C.crust} strokeWidth={12} />
      <path d="M100 42 L166 150 L104 150 Z" fill={C.crustDeep} stroke={C.crustDeep} strokeWidth={12} strokeLinejoin="round" />
      <path d="M36 152 L164 152" stroke={C.crustDark} strokeWidth={8} strokeLinecap="round" opacity={0.6} />
      <path d="M70 110 L94 70" stroke={C.butter} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
      {[[62, 132], [80, 120], [118, 128], [138, 136], [100, 104]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={2.5} fill={C.crustDark} opacity={0.55} />
      ))}
    </g>
  ),
  doughnut: () => (
    <g>
      <Shadow rx={64} />
      <path fillRule="evenodd" d="M100 66 C146 66 172 90 172 116 C172 142 146 160 100 160 C54 160 28 142 28 116 C28 90 54 66 100 66 Z M100 102 C88 102 80 108 80 114 C80 120 88 126 100 126 C112 126 120 120 120 114 C120 108 112 102 100 102 Z" fill={C.crust} />
      <path d="M28 116 C28 142 54 160 100 160 C146 160 172 142 172 116 C164 136 136 148 100 148 C64 148 36 136 28 116 Z" fill={C.crustDeep} />
      <path d="M50 92 C66 78 90 74 110 76" stroke={C.butterSoft} strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.7} />
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return <circle key={i} cx={100 + Math.cos(a) * 52} cy={114 + Math.sin(a) * 26} r={1.8} fill={C.milk} opacity={0.9} />;
      })}
    </g>
  ),
  bofrot: () => (
    <g>
      <Shadow rx={74} />
      {[[66, 122, 34], [130, 126, 32], [98, 92, 30], [100, 140, 26]].map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill={i % 2 ? C.crustDeep : C.crust} />
          <path d={`M${x - r * 0.9} ${y + r * 0.2} A${r} ${r} 0 0 0 ${x + r * 0.9} ${y + r * 0.2} A${r * 1.1} ${r * 0.8} 0 0 1 ${x - r * 0.9} ${y + r * 0.2} Z`} fill={C.crustDark} opacity={0.35} />
          <ellipse cx={x - r * 0.3} cy={y - r * 0.4} rx={r * 0.35} ry={r * 0.18} fill={C.butterSoft} opacity={0.7} transform={`rotate(-25 ${x - r * 0.3} ${y - r * 0.4})`} />
        </g>
      ))}
      {Array.from({ length: 22 }).map((_, i) => (
        <circle key={i} cx={46 + ((i * 37) % 110)} cy={70 + ((i * 53) % 84)} r={1.4} fill={C.milk} opacity={0.85} />
      ))}
    </g>
  ),
  kebab: () => (
    <g>
      <Shadow />
      <path d="M18 166 L182 40" stroke={C.toast} strokeWidth={4} strokeLinecap="round" />
      {[[48, 143, C.toast], [76, 121, C.leaf], [102, 101, C.cocoaSoft], [128, 81, C.tomato], [152, 63, C.toast]].map(([x, y, f], i) => (
        <g key={i}>
          <ellipse cx={x as number} cy={y as number} rx={i % 2 ? 13 : 18} ry={i % 2 ? 16 : 15} fill={f as string} />
          <ellipse cx={(x as number) - 4} cy={(y as number) - 6} rx={6} ry={3} fill={C.butterSoft} opacity={0.4} />
          {i % 2 === 0 && <path d={`M${(x as number) - 10} ${(y as number) + 4} l20 -6`} stroke={C.cocoa} strokeWidth={2.5} opacity={0.5} strokeLinecap="round" />}
        </g>
      ))}
    </g>
  ),
  wings: () => (
    <g>
      <Shadow rx={74} />
      {[[70, 118, -20], [128, 112, 25], [100, 140, 0]].map(([x, y, r], i) => (
        <g key={i} transform={`rotate(${r} ${x} ${y})`}>
          <path d={`M${x - 34} ${y} C${x - 34} ${y - 26} ${x - 6} ${y - 28} ${x + 10} ${y - 18} C${x + 22} ${y - 26} ${x + 40} ${y - 16} ${x + 34} ${y} C${x + 30} ${y + 18} ${x - 30} ${y + 20} ${x - 34} ${y} Z`} fill={i === 1 ? C.crustDeep : C.toast} />
          <path d={`M${x - 26} ${y - 10} C${x - 12} ${y - 22} ${x + 4} ${y - 18} ${x + 10} ${y - 10}`} stroke={C.butter} strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.55} />
          <path d={`M${x - 20} ${y + 4} l10 -3 M${x + 6} ${y + 2} l10 -3`} stroke={C.cocoa} strokeWidth={3} strokeLinecap="round" opacity={0.45} />
        </g>
      ))}
    </g>
  ),
  drumstick: () => (
    <g>
      <Shadow rx={64} />
      <g transform="rotate(-30 100 110)">
        <path d="M60 110 C60 76 84 62 108 64 C138 66 150 92 144 116 C140 132 126 138 112 138 L146 150" fill={C.toast} />
        <path d="M64 120 C70 136 92 144 112 138 C96 134 74 128 64 120 Z" fill={C.cocoaSoft} opacity={0.6} />
        <rect x={108} y={128} width={56} height={14} rx={7} fill={C.milk} />
        <circle cx={166} cy={128} r={9} fill={C.milk} />
        <circle cx={166} cy={144} r={9} fill={C.milk} />
        <path d="M80 82 C92 72 112 70 126 78" stroke={C.butter} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.6} />
        <path d="M86 100 l14 -6 M106 108 l14 -6 M84 120 l12 -5" stroke={C.cocoa} strokeWidth={3.5} strokeLinecap="round" opacity={0.45} />
      </g>
    </g>
  ),
  cake: () => (
    <g>
      <Shadow rx={68} />
      <path d="M40 92 L40 150 C40 160 160 160 160 150 L160 92 Z" fill={C.butterSoft} />
      <path d="M40 120 L160 120 L160 128 L40 128 Z" fill={C.crust} opacity={0.55} />
      <path d="M118 92 L160 92 L160 150 C160 156 140 158 118 158 Z" fill={C.butter} opacity={0.55} />
      <ellipse cx={100} cy={92} rx={60} ry={18} fill={C.milk} />
      <path d="M40 92 C40 104 52 98 56 108 C60 116 70 100 76 106 C82 112 92 100 100 108 C108 114 118 100 124 106 C130 114 142 100 146 106 C152 114 160 104 160 92" fill={C.milk} />
      <rect x={96} y={52} width={8} height={30} rx={3} fill={C.palm} />
      <path d="M100 38 C108 46 104 52 100 52 C96 52 92 46 100 38 Z" fill={C.orange} />
    </g>
  ),
  orangeCake: () => (
    <g>
      <Shadow rx={68} />
      <path d="M40 92 L40 150 C40 160 160 160 160 150 L160 92 Z" fill={C.crust} />
      <path d="M118 92 L160 92 L160 150 C160 156 140 158 118 158 Z" fill={C.crustDeep} opacity={0.5} />
      <ellipse cx={100} cy={92} rx={60} ry={18} fill={C.butter} />
      <path d="M40 92 C44 104 52 112 54 124 M70 100 C72 110 70 118 72 126 M140 100 C140 112 144 118 142 130" stroke={C.butter} strokeWidth={5} strokeLinecap="round" fill="none" />
      {[[78, 88], [112, 86], [96, 98]].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <circle cx={x} cy={y} r={9} fill={C.orange} />
          <circle cx={x} cy={y} r={6} fill={C.butterSoft} opacity={0.7} />
          <path d={`M${x - 6} ${y} L${x + 6} ${y} M${x} ${y - 6} L${x} ${y + 6}`} stroke={C.orange} strokeWidth={1.5} />
        </g>
      ))}
    </g>
  ),
  chocolateCake: () => (
    <g>
      <Shadow rx={68} />
      <path d="M40 92 L40 150 C40 160 160 160 160 150 L160 92 Z" fill={C.cocoaSoft} />
      <path d="M40 118 L160 118 L160 124 L40 124 Z" fill={C.butterSoft} opacity={0.6} />
      <path d="M118 92 L160 92 L160 150 C160 156 140 158 118 158 Z" fill={C.cocoa} opacity={0.45} />
      <ellipse cx={100} cy={92} rx={60} ry={18} fill={C.cocoa} />
      <path d="M40 92 C40 112 50 104 52 116 C56 126 62 104 70 108 C78 112 82 128 88 110 C94 100 108 120 116 106 C122 98 132 122 138 108 C144 98 152 114 160 92" fill={C.cocoa} />
      <ellipse cx={86} cy={86} rx={20} ry={5} fill={C.toast} opacity={0.6} />
      <circle cx={100} cy={74} r={8} fill={C.tomato} />
      <path d="M100 66 Q104 58 110 56" stroke={C.leaf} strokeWidth={2.5} fill="none" strokeLinecap="round" />
    </g>
  ),
  chips: () => (
    <g>
      <Bowl fill={C.crust} inner={C.butter} />
      {Array.from({ length: 26 }).map((_, i) => {
        const x = 50 + ((i * 41) % 100);
        const y = 86 + ((i * 23) % 26) - (Math.abs(x - 100) < 30 ? 8 : 0);
        return <rect key={i} x={x} y={y} width={11} height={8} rx={2.5} fill={i % 3 ? C.crust : C.crustDeep} transform={`rotate(${(i * 47) % 90} ${x + 5} ${y + 4})`} />;
      })}
    </g>
  ),
  jollof: () => (
    <g>
      <Plate />
      <path d="M38 124 C42 98 70 84 100 86 C120 88 132 96 134 112 C130 128 90 134 38 124 Z" fill={C.jollof} />
      {Array.from({ length: 30 }).map((_, i) => (
        <ellipse key={i} cx={48 + ((i * 29) % 84)} cy={96 + ((i * 17) % 28)} rx={3} ry={1.6} fill={i % 4 ? C.tomato : C.butter} opacity={0.6} transform={`rotate(${(i * 37) % 180} ${48 + ((i * 29) % 84)} ${96 + ((i * 17) % 28)})`} />
      ))}
      {/* Grilled drumstick */}
      <g transform="rotate(-24 140 108)">
        <path d="M108 112 C106 92 124 82 142 84 C160 86 168 102 162 116 C158 126 146 130 136 128 L162 136" fill={C.toast} />
        <path d="M112 120 C120 130 136 132 146 128 C132 126 120 124 112 120 Z" fill={C.cocoaSoft} opacity={0.6} />
        <rect x={136} y={124} width={30} height={9} rx={4.5} fill={C.milk} />
        <circle cx={168} cy={124} r={6} fill={C.milk} />
        <circle cx={168} cy={134} r={6} fill={C.milk} />
        <path d="M118 96 C126 90 140 88 150 92" stroke={C.butter} strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.55} />
        <path d="M122 108 l10 -4 M132 116 l10 -4" stroke={C.cocoa} strokeWidth={3} strokeLinecap="round" opacity={0.5} />
      </g>
      <ellipse cx={60} cy={128} rx={10} ry={4} fill={C.leaf} />
      <ellipse cx={74} cy={132} rx={8} ry={3.5} fill={C.leafLight} />
    </g>
  ),
  friedRice: () => (
    <g>
      <Plate />
      <path d="M36 124 C40 96 70 82 102 84 C130 86 146 100 146 116 C140 130 90 136 36 124 Z" fill={C.butter} />
      {Array.from({ length: 34 }).map((_, i) => {
        const fills = [C.leaf, C.orange, C.butterSoft, C.tomato, C.leafLight];
        return <rect key={i} x={46 + ((i * 31) % 94)} y={94 + ((i * 19) % 28)} width={5} height={5} rx={1.2} fill={fills[i % 5]} opacity={0.85} />;
      })}
      <path d="M128 118 C128 102 146 96 158 104 C168 112 164 128 150 130 C138 132 128 128 128 118 Z" fill={C.crustDeep} />
    </g>
  ),
  riceStew: () => (
    <g>
      <Plate />
      <path d="M36 122 C38 98 62 86 88 88 C108 90 116 104 112 120 C100 132 60 132 36 122 Z" fill={C.milk} />
      {Array.from({ length: 24 }).map((_, i) => (
        <ellipse key={i} cx={46 + ((i * 23) % 62)} cy={98 + ((i * 13) % 24)} rx={3} ry={1.5} fill={C.plateShade} transform={`rotate(${(i * 41) % 180} ${46 + ((i * 23) % 62)} ${98 + ((i * 13) % 24)})`} />
      ))}
      <path d="M100 118 C104 98 126 88 146 94 C166 100 168 122 150 130 C132 136 104 132 100 118 Z" fill={C.tomato} />
      <path d="M110 112 C118 102 134 98 150 104" stroke={C.orange} strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.6} />
      {[[124, 114], [142, 120], [132, 104]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={5.5} fill={C.toast} />
      ))}
    </g>
  ),
  waakye: () => (
    <g>
      <Plate />
      <path d="M34 122 C36 96 62 84 92 86 C112 88 122 100 118 118 C106 132 60 132 34 122 Z" fill={C.cocoaSoft} />
      {Array.from({ length: 26 }).map((_, i) => (
        <ellipse key={i} cx={42 + ((i * 23) % 70)} cy={96 + ((i * 13) % 24)} rx={3} ry={1.6} fill={i % 3 ? C.toast : C.tomatoDeep} opacity={0.75} />
      ))}
      <ellipse cx={138} cy={104} rx={16} ry={12} fill={C.milk} />
      <ellipse cx={140} cy={106} rx={8} ry={6} fill={C.butter} />
      <path d="M112 124 C120 116 140 116 156 122 C152 130 128 134 112 124 Z" fill={C.tomato} />
      <rect x={70} y={74} width={34} height={14} rx={6} fill={C.cream} transform="rotate(-10 87 81)" />
      <ellipse cx={58} cy={130} rx={10} ry={4} fill={C.leaf} />
    </g>
  ),
  soupBowl: () => (
    <g>
      <Bowl fill={C.crustDeep} inner={C.orange} />
      <ellipse cx={92} cy={102} rx={22} ry={9} fill={C.flour} />
      <ellipse cx={88} cy={99} rx={12} ry={4} fill={C.milk} />
      <path d="M118 104 C122 98 134 98 140 104" stroke={C.toast} strokeWidth={7} strokeLinecap="round" fill="none" />
      <circle cx={70} cy={110} r={3} fill={C.tomato} />
      <circle cx={124} cy={112} r={2.5} fill={C.leaf} />
    </g>
  ),
  banku: () => (
    <g>
      <Bowl fill={C.leaf} inner={C.leafLight} />
      <ellipse cx={86} cy={96} rx={26} ry={14} fill={C.cream} />
      <ellipse cx={82} cy={92} rx={14} ry={5} fill={C.milk} />
      {[[124, 106], [136, 100], [116, 112]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={4.5} fill={C.leafLight} stroke={C.leaf} strokeWidth={1.5} />
      ))}
    </g>
  ),
  tilapia: () => (
    <g>
      <Plate />
      <path d="M40 112 C60 88 110 86 136 104 L164 88 L158 114 L166 136 L136 120 C110 138 60 136 40 112 Z" fill={C.fish} />
      <path d="M40 112 C60 124 100 132 136 120 C110 138 60 136 40 112 Z" fill={C.fishDark} />
      {[70, 88, 106].map((x) => (
        <path key={x} d={`M${x} 98 Q${x + 6} 112 ${x} 124`} stroke={C.cocoa} strokeWidth={3} fill="none" opacity={0.5} strokeLinecap="round" />
      ))}
      <circle cx={54} cy={108} r={3.5} fill={C.cocoa} />
      <ellipse cx={70} cy={140} rx={18} ry={8} fill={C.cream} />
      <ellipse cx={126} cy={140} rx={14} ry={6} fill={C.tomato} />
    </g>
  ),
  yam: () => (
    <g>
      <Plate />
      {[[58, 108], [84, 98], [70, 124]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 18} y={y - 10} width={36} height={22} rx={6} fill={C.cream} transform={`rotate(${i * 14 - 10} ${x} ${y})`} />
          <rect x={x - 18} y={y + 6} width={36} height={6} rx={3} fill={C.plateShade} transform={`rotate(${i * 14 - 10} ${x} ${y})`} />
        </g>
      ))}
      <path d="M100 118 C104 96 128 88 148 96 C166 104 164 126 146 132 C128 136 104 132 100 118 Z" fill={C.leaf} />
      <path d="M112 110 C122 100 138 98 152 104" stroke={C.leafLight} strokeWidth={4} fill="none" strokeLinecap="round" />
      <circle cx={128} cy={120} r={4} fill={C.orange} />
    </g>
  ),
  plantain: () => (
    <g>
      <Plate />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${36 + i * 6} ${98 + i * 12} C${60 + i * 6} ${86 + i * 12} ${96 + i * 6} ${90 + i * 12} ${110 + i * 4} ${100 + i * 12} C${96} ${110 + i * 12} ${60} ${110 + i * 12} ${36 + i * 6} ${98 + i * 12} Z`} fill={i === 1 ? C.butter : C.orange} />
      ))}
      <path d="M108 118 C112 98 132 90 150 98 C166 106 162 126 146 132 C130 136 110 132 108 118 Z" fill={C.leaf} />
      <path d="M118 110 C126 102 140 100 152 106" stroke={C.leafLight} strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  ),
  milk: () => (
    <g>
      <Shadow rx={46} />
      <path d="M66 48 L134 48 L128 160 C128 166 72 166 72 160 Z" fill={C.milk} stroke={C.plateShade} strokeWidth={3} />
      <path d="M69 84 L131 84 L128 160 C128 166 72 166 72 160 Z" fill={C.flour} />
      <ellipse cx={100} cy={84} rx={31} ry={6} fill={C.milk} stroke={C.plateShade} strokeWidth={2} />
      <path d="M80 96 L82 150" stroke={C.milk} strokeWidth={5} strokeLinecap="round" />
    </g>
  ),
  whisk: () => (
    <g>
      <Shadow rx={50} />
      <rect x={92} y={24} width={16} height={56} rx={8} fill={C.toast} />
      <rect x={92} y={70} width={16} height={10} fill={C.crustDark} />
      {[-28, -14, 0, 14, 28].map((d) => (
        <path key={d} d={`M100 80 C${100 + d * 1.6} 110 ${100 + d * 1.5} 150 100 162 C${100 - d * 0.2} 150 ${100 + d * 0.5} 110 100 80`} stroke={C.plateShade} strokeWidth={3.5} fill="none" />
      ))}
    </g>
  ),
  clock: () => (
    <g>
      <Shadow rx={50} />
      <circle cx={100} cy={102} r={58} fill={C.butter} />
      <circle cx={100} cy={102} r={48} fill={C.milk} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <circle key={i} cx={100 + Math.cos(a) * 40} cy={102 + Math.sin(a) * 40} r={i % 3 ? 1.8 : 3} fill={C.toast} />;
      })}
      <path d="M100 102 L100 72 M100 102 L120 112" stroke={C.cocoa} strokeWidth={5} strokeLinecap="round" />
      <circle cx={100} cy={102} r={4} fill={C.palm} />
    </g>
  ),
  table: () => (
    <g>
      <Shadow rx={80} />
      <ellipse cx={100} cy={120} rx={84} ry={34} fill={C.crust} />
      <ellipse cx={100} cy={114} rx={84} ry={34} fill={C.butterSoft} />
      {[[60, 108], [100, 96], [140, 108], [100, 128]].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={20} ry={8} fill={C.milk} />
          <ellipse cx={x} cy={y - 2} rx={11} ry={4} fill={[C.jollof, C.crust, C.leaf, C.toast][i]} />
        </g>
      ))}
    </g>
  ),
  wheat: () => (
    <g>
      <path d="M100 180 C100 140 100 100 100 30" stroke={C.crust} strokeWidth={3} fill="none" strokeLinecap="round" />
      {Array.from({ length: 7 }).map((_, i) => (
        <g key={i}>
          <ellipse cx={92} cy={46 + i * 14} rx={5} ry={10} fill={C.butter} transform={`rotate(-28 92 ${46 + i * 14})`} />
          <ellipse cx={108} cy={46 + i * 14} rx={5} ry={10} fill={C.crust} transform={`rotate(28 108 ${46 + i * 14})`} />
        </g>
      ))}
      <ellipse cx={100} cy={32} rx={4.5} ry={10} fill={C.butter} />
    </g>
  ),
};

export type IllustrationName = keyof typeof art;
export const illustrationNames = Object.keys(art) as IllustrationName[];

type Props = SVGProps<SVGSVGElement> & { name: IllustrationName; title?: string };

export function Illustration({ name, title, ...rest }: Props) {
  const Art = art[name];
  return (
    <svg viewBox="0 0 200 200" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} {...rest}>
      {title ? <title>{title}</title> : null}
      <Art />
    </svg>
  );
}
