"use client";
import { useId, useRef } from "react";
import Ship from "@/components/space/Ship";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const STOPS: [string, string][] = [
  ["#top", "Start"], ["#about", "Kenalan"], ["#foto", "Wajah"], ["#frameworks", "Framework"], ["#skills", "Bekal"],
  ["#projects", "Karya"], ["#journey", "Rute"], ["#repos", "Showcase"], ["#contact", "Finish"],
];

type Mode = "moon" | "link" | "drag" | "text" | "busy";
const DUST = [0.18, 0.28, 0.4, 0.52, 0.66, 0.82];   // durasi menyusul tiap butir debu bulan

/**
 * Trek lari di sisi kanan (terisi sesuai scroll, dengan roket) + kursor bulan:
 * bulan kecil bertabur debu bintang. Di atas elemen interaktif bulan membesar dan dikelilingi cincin orbit.
 * Kursor bawaan browser disembunyikan selama kursor bulan aktif.
 */
export default function Progress({ track = true }: { track?: boolean }) {
  const mid = useId();
  const fill = useRef<HTMLElement>(null);
  const label = useRef<HTMLElement>(null);
  const trk = useRef<HTMLDivElement>(null);
  const cur = useRef<HTMLDivElement>(null);
  const moon = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const beam = useRef<HTMLDivElement>(null);
  const rip = useRef<HTMLDivElement>(null);
  const dust = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (!track) return;
      gsap.to(fill.current, { scaleY: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3, onUpdate: (s) => trk.current?.style.setProperty("--sp", String(s.progress)) } });
      STOPS.forEach(([id, name]) => {
        ScrollTrigger.create({
          trigger: id, start: "top 55%", end: "bottom 55%",
          onToggle: (s) => { if (s.isActive && label.current) label.current.textContent = name; },
        });
      });
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    });

    // perangkat dengan mouse saja
    mm.add("(hover: hover) and (pointer: fine)", () => {
      const k = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1;
      const html = document.documentElement;
      html.classList.add("has-cursor");

      const mx = gsap.quickTo(cur.current, "x", { duration: 0.06 * k, ease: "power3" });
      const my = gsap.quickTo(cur.current, "y", { duration: 0.06 * k, ease: "power3" });
      const trail = dust.current.map((el, i) => ({ x: gsap.quickTo(el, "x", { duration: DUST[i] * k, ease: "power3" }), y: gsap.quickTo(el, "y", { duration: DUST[i] * k, ease: "power3" }) }));

      let shown = false, hidden = false, down = false, mode: Mode = "moon";
      const apply = () => {
        const vis = shown && !hidden ? 1 : 0;
        const hot = mode === "link" || mode === "drag";
        gsap.to(cur.current, { opacity: vis, duration: 0.2 * k, overwrite: "auto" });
        gsap.to(moon.current, { opacity: mode === "text" ? 0 : 1, scale: (hot ? 1.4 : 1) * (down ? 0.82 : 1), rotation: hot ? -20 : 0, duration: 0.4 * k, ease: "back.out(2)", overwrite: "auto" });
        gsap.to(ring.current, { opacity: hot || mode === "busy" ? 1 : 0, scale: hot || mode === "busy" ? 1 : 0.5, duration: 0.4 * k, ease: "back.out(2)", overwrite: "auto" });
        ring.current?.classList.toggle("busy", mode === "busy");
        gsap.to(beam.current, { opacity: mode === "text" ? 1 : 0, duration: 0.15 * k, overwrite: "auto" });
        dust.current.forEach((el, i) => gsap.to(el, { opacity: vis && mode !== "text" ? 0.6 - i * 0.09 : 0, duration: 0.3 * k, overwrite: "auto" }));
      };

      const move = (e: MouseEvent) => {
        mx(e.clientX); my(e.clientY);
        trail.forEach((t) => { t.x(e.clientX); t.y(e.clientY); });
        if (!shown) { shown = true; gsap.set([cur.current, ...dust.current], { x: e.clientX, y: e.clientY }); apply(); }
      };
      const over = (e: MouseEvent) => {
        const t = e.target as Element;
        hidden = t instanceof HTMLIFrameElement;           // di dalam iframe, kursor bawaan iframe yang tampil
        const el = t.closest("a, button, .stk, .ph-stage, [data-cursor]");
        mode = t.closest("input, textarea") ? "text" : !el ? "moon" : el.closest(".stk, .ph-stage") ? "drag" : (el as HTMLButtonElement).disabled ? "busy" : "link";
        apply();
      };
      const press = (e: MouseEvent) => {
        down = true; apply();
        if (!k) return;
        gsap.fromTo(rip.current, { x: e.clientX, y: e.clientY, scale: 0.2, opacity: 0.8 }, { scale: 1.6, opacity: 0, duration: 0.6, ease: "power2.out" });
      };
      const release = () => { down = false; apply(); };
      const leave = () => { hidden = true; apply(); };
      const enter = () => { hidden = false; apply(); };
      // sorotan cahaya di atas kartu
      const spot = (e: MouseEvent) => {
        const s = (e.target as Element).closest<HTMLElement>(".spot");
        if (s) { const r = s.getBoundingClientRect(); s.style.setProperty("--mx", `${e.clientX - r.left}px`); s.style.setProperty("--my", `${e.clientY - r.top}px`); }
      };

      window.addEventListener("mousemove", move);
      window.addEventListener("mousemove", spot);
      document.addEventListener("mouseover", over);
      window.addEventListener("mousedown", press);
      window.addEventListener("mouseup", release);
      html.addEventListener("mouseleave", leave);
      html.addEventListener("mouseenter", enter);
      return () => {
        html.classList.remove("has-cursor");
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mousemove", spot);
        document.removeEventListener("mouseover", over);
        window.removeEventListener("mousedown", press);
        window.removeEventListener("mouseup", release);
        html.removeEventListener("mouseleave", leave);
        html.removeEventListener("mouseenter", enter);
      };
    });
  });

  return (
    <>
      {track && <div className="track" ref={trk} aria-hidden="true"><i ref={fill} /><b ref={label}>Start</b><span className="trk-ship"><Ship /></span></div>}

      {DUST.map((_, i) => <div key={i} className="cur-dust" ref={(el) => { if (el) dust.current[i] = el; }} style={{ width: 7 - i, height: 7 - i, margin: `${-(7 - i) / 2}px 0 0 ${-(7 - i) / 2}px` }} aria-hidden="true" />)}

      <div className="cur" ref={cur} aria-hidden="true">
        <div className="cur-ring" ref={ring} />
        <div className="cur-a" ref={moon}>
          <svg width="32" height="32" viewBox="0 0 32 32">
            <defs>
              <radialGradient id={`${mid}g`} cx=".35" cy=".3" r=".9"><stop offset="0" stopColor="#fffaf0" /><stop offset=".6" stopColor="#f0e4c4" /><stop offset="1" stopColor="#bfb48f" /></radialGradient>
              <clipPath id={`${mid}c`}><circle cx="16" cy="16" r="14" /></clipPath>
            </defs>
            <circle cx="16" cy="16" r="14" fill={`url(#${mid}g)`} stroke="#09090b" strokeWidth="1.6" />
            <g clipPath={`url(#${mid}c)`}>
              <circle cx="11" cy="12" r="3.2" fill="#cdbf98" opacity=".8" /><circle cx="21.5" cy="10" r="2" fill="#cdbf98" opacity=".8" />
              <circle cx="20" cy="21" r="4" fill="#cdbf98" opacity=".75" /><circle cx="10" cy="22" r="1.8" fill="#cdbf98" opacity=".8" />
              <circle cx="24" cy="19" r="14" fill="#09090b" opacity=".16" />
            </g>
          </svg>
        </div>
        <div className="cur-i" ref={beam}>
          <svg width="16" height="28" viewBox="0 0 16 28"><rect x="6" y="2" width="4" height="24" rx="2" fill="#f4f2f8" stroke="#09090b" strokeWidth="1.4" /></svg>
        </div>
      </div>
      <div className="cur-rip" ref={rip} aria-hidden="true" />
    </>
  );
}