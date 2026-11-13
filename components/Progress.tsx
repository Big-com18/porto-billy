"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const STOPS: [string, string][] = [
  ["#top", "Start"], ["#about", "Kenalan"], ["#frameworks", "Framework"], ["#skills", "Bekal"],
  ["#projects", "Karya"], ["#journey", "Rute"], ["#repos", "Showcase"], ["#contact", "Finish"],
];

/** Trek lari di sisi kanan: terisi sesuai scroll, label berganti per bagian. Plus kursor kustom. */
export default function Progress() {
  const fill = useRef<HTMLElement>(null);
  const label = useRef<HTMLElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(fill.current, { scaleY: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
      STOPS.forEach(([id, name]) => {
        ScrollTrigger.create({
          trigger: id, start: "top 55%", end: "bottom 55%",
          onToggle: (s) => { if (s.isActive && label.current) label.current.textContent = name; },
        });
      });
      const cx = gsap.quickTo(dot.current, "x", { duration: 0.3, ease: "power3" });
      const cy = gsap.quickTo(dot.current, "y", { duration: 0.3, ease: "power3" });
      const move = (e: MouseEvent) => {
        cx(e.clientX); cy(e.clientY);
        const s = (e.target as Element).closest<HTMLElement>(".spot");
        if (s) { const r = s.getBoundingClientRect(); s.style.setProperty("--mx", `${e.clientX - r.left}px`); s.style.setProperty("--my", `${e.clientY - r.top}px`); }
      };
      const over = (e: MouseEvent) => {
        const hit = (e.target as Element).closest("a, button");
        gsap.to(dot.current, { scale: hit ? 3.2 : 1, duration: 0.3 });
      };
      window.addEventListener("mousemove", move);
      document.addEventListener("mouseover", over);
      document.fonts.ready.then(() => ScrollTrigger.refresh());
      return () => { window.removeEventListener("mousemove", move); document.removeEventListener("mouseover", over); };
    });
  });

  return (
    <>
      <div className="track" aria-hidden="true"><i ref={fill} /><b ref={label}>Start</b></div>
      <div className="cursor" ref={dot} aria-hidden="true" />
    </>
  );
}
