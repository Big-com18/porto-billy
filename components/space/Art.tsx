import { useId } from "react";
import type { CSSProperties, ReactNode } from "react";

type Base = { style?: CSSProperties; par?: number; className?: string };

/** Pembungkus ilustrasi: `par` = kekuatan parallax saat scroll (GSAP di Orbit.tsx); .art-in = melayang pelan lewat CSS. */
function Art({ style, par = 0, className = "", children }: Base & { children: ReactNode }) {
  return <div className={`art ${className}`} data-par={par || undefined} style={style} aria-hidden="true"><div className="art-in">{children}</div></div>;
}

const Limb = ({ d, w = 22, c = "#f4f2f8" }: { d: string; w?: number; c?: string }) => (
  <>
    <path d={d} fill="none" stroke="#09090b" strokeWidth={w + 6} strokeLinecap="round" />
    <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" />
  </>
);

/** Astronaut pastel yang melambai, terikat tali putus-putus. */
export function Astronaut(p: Base) {
  const id = useId();
  return (
    <Art {...p}>
      <svg viewBox="0 0 200 250">
        <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3b3860" /><stop offset="1" stopColor="#09090b" /></linearGradient></defs>
        <path d="M138 150 C192 160 198 112 188 70" fill="none" stroke="#f4f2f8" strokeWidth="2.5" strokeDasharray="1 7" strokeLinecap="round" opacity=".8" />
        <rect x="58" y="104" width="84" height="70" rx="18" fill="#b9d0e8" stroke="#09090b" strokeWidth="3" />
        <Limb d="M88 168 Q84 200 74 226" w={24} /><Limb d="M112 168 Q118 198 128 222" w={24} />
        <circle cx="74" cy="231" r="15" fill="#c5bdeb" stroke="#09090b" strokeWidth="3" /><circle cx="129" cy="227" r="15" fill="#c5bdeb" stroke="#09090b" strokeWidth="3" />
        <Limb d="M74 116 Q44 128 38 160" /><circle cx="36" cy="167" r="13" fill="#c5bdeb" stroke="#09090b" strokeWidth="3" />
        <rect x="70" y="98" width="60" height="82" rx="24" fill="#f4f2f8" stroke="#09090b" strokeWidth="3" />
        <rect x="88" y="126" width="24" height="18" rx="4" fill="#e8c3d2" stroke="#09090b" strokeWidth="2.5" />
        <circle cx="95" cy="135" r="2.6" fill="#09090b" /><circle cx="105" cy="135" r="2.6" fill="#bcd8c6" stroke="#09090b" strokeWidth="1" />
        <Limb d="M126 116 Q158 108 166 72" /><circle cx="166" cy="64" r="13" fill="#c5bdeb" stroke="#09090b" strokeWidth="3" />
        <ellipse cx="100" cy="104" rx="28" ry="9" fill="#c5bdeb" stroke="#09090b" strokeWidth="3" />
        <circle cx="100" cy="64" r="44" fill="#f4f2f8" stroke="#09090b" strokeWidth="3" />
        <ellipse cx="100" cy="66" rx="31" ry="26" fill={`url(#${id})`} stroke="#09090b" strokeWidth="3" />
        <ellipse cx="88" cy="56" rx="9" ry="5" fill="#fff" opacity=".6" transform="rotate(-25 88 56)" />
        <ellipse cx="113" cy="77" rx="4" ry="2.5" fill="#c5bdeb" opacity=".85" />
      </svg>
    </Art>
  );
}

/** Satelit dengan dua panel surya. */
export function Satellite(p: Base) {
  return (
    <Art {...p}>
      <svg viewBox="0 0 200 100">
        <g stroke="#09090b" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
          <path d="M100 26 V10" fill="none" /><circle cx="100" cy="8" r="4.5" fill="#e8c3d2" />
          <rect x="6" y="30" width="64" height="40" rx="4" fill="#b9d0e8" /><rect x="130" y="30" width="64" height="40" rx="4" fill="#b9d0e8" />
          <path d="M22 30V70M38 30V70M54 30V70M146 30V70M162 30V70M178 30V70M6 50H70M130 50H194" fill="none" strokeWidth="1.6" opacity=".6" />
          <path d="M70 50H76M124 50H130" fill="none" />
          <rect x="76" y="26" width="48" height="48" rx="12" fill="#f4f2f8" />
          <circle cx="100" cy="50" r="11" fill="#c5bdeb" /><circle cx="100" cy="50" r="4" fill="#09090b" stroke="none" />
        </g>
      </svg>
    </Art>
  );
}

/** Planet CSS: pita warna, bayangan, cincin, dan bulan yang mengorbit. */
export function Planet({ c = "#c5bdeb", size = "200px", ring, moon, ...p }: Base & { c?: string; size?: string; ring?: boolean; moon?: boolean }) {
  return (
    <Art {...p}>
      <div className={`pln${ring ? " ringed" : ""}`} style={{ "--pc": c, "--sz": size } as CSSProperties}>
        <i className="pln-s" />{moon && <i className="pln-moon" />}
      </div>
    </Art>
  );
}

/** Komet yang melintas sesekali (animasi CSS). Warna ikut `color` induk. */
export function Comet({ style }: { style?: CSSProperties }) {
  return <i className="comet" style={style} aria-hidden="true" />;
}

/** Bintang kecil berkelip. Posisi deterministik supaya tidak beda antara server dan klien. */
export function Sparkles({ n = 14, seed = 1 }: { n?: number; seed?: number }) {
  let s = seed * 9301 + 49297;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  return (
    <div className="spks" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <i key={i} className="spk" style={{ left: `${rnd() * 100}%`, top: `${rnd() * 100}%`, ["--s" as string]: `${8 + rnd() * 14}px`, ["--d" as string]: `${2 + rnd() * 3}s`, animationDelay: `${rnd() * 3}s` }} />
      ))}
    </div>
  );
}
