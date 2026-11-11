"use client";
import { useRef } from "react";
import Logo from "@/components/ui/Logo";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const A: [string, string?][] = [["Front-End"], ["Next.js", "nextjs"], ["QA"], ["React", "react"], ["Dream On"], ["Vue", "vue"], ["TypeScript", "typescript"], ["Flutter", "flutter"]];
const B = ["DREAM ON", "FRONT-END", "DREAM ON", "QA"];

/** Dua pita hitam berlawanan arah. Makin kencang scroll, makin kencang jalannya. */
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const t1 = gsap.to(".row1", { xPercent: -50, duration: 30, ease: "none", repeat: -1 });
      const t2 = gsap.fromTo(".row2", { xPercent: -50 }, { xPercent: 0, duration: 36, ease: "none", repeat: -1 });
      ScrollTrigger.create({
        onUpdate: (s) => {
          const v = Math.min(Math.abs(s.getVelocity()) / 180, 7);
          [t1, t2].forEach((t) => { t.timeScale(1 + v); gsap.to(t, { timeScale: 1, duration: 1.2, overwrite: true }); });
        },
      });
    });
  }, { scope: root });

  return (
    <div className="tag" ref={root} aria-hidden="true">
      <div className="band">
        <div className="row row1">{[...A, ...A].map(([t, l], i) => <span key={i}>{l && <Logo n={l} size={64} />}{t}</span>)}</div>
        <div className="row row2 out">{[...B, ...B, ...B, ...B].map((t, i) => <span key={i}>{t}</span>)}</div>
      </div>
    </div>
  );
}
