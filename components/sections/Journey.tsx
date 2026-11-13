"use client";
import { useRef } from "react";
import Chars from "@/components/ui/Chars";
import { STEPS } from "@/lib/data";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Garis tergambar saat scroll, pelari turun mengikuti, tiap pos menyala saat dilewati. */
export default function Journey() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".journey-title .ch", { yPercent: 110, stagger: 0.03, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: ".journey-title", start: "top 85%" } });
      const st = { trigger: ".jw", start: "top 60%", end: "bottom 70%", scrub: true };
      gsap.to(".jl i", { scaleY: 1, ease: "none", scrollTrigger: st });
      gsap.to(".run", { top: "100%", ease: "none", scrollTrigger: st });
      gsap.utils.toArray<HTMLElement>(".step").forEach((s) => {
        ScrollTrigger.create({ trigger: s, start: "top 62%", onEnter: () => s.classList.add("on"), onLeaveBack: () => s.classList.remove("on") });
      });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      root.current?.querySelectorAll(".step").forEach((s) => s.classList.add("on"));
    });
  }, { scope: root });

  return (
    <section id="journey" className="stack" data-stack ref={root}>
      <h2 className="journey-title"><span className="line"><Chars text="Perjalanan" /></span><span className="line"><Chars text="sejauh ini" /></span></h2>
      <div className="jw">
        <div className="jl"><i /><div className="run" /></div>
        {STEPS.map(([y, t, d]) => (
          <div className="step" key={t}><small>{y}</small><h3>{t}</h3><p>{d}</p></div>
        ))}
      </div>
    </section>
  );
}
