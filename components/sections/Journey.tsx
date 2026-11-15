"use client";
import { useRef } from "react";
import Chars from "@/components/ui/Chars";
import { Planet, Sparkles } from "@/components/space/Art";
import Ship from "@/components/space/Ship";
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
    <section id="journey" data-wipe="corner" ref={root}>
      <Sparkles n={16} seed={11} />
      <Planet c="#6fb59a" ring par={0.5} size="clamp(90px,11vw,170px)" style={{ right: "5vw", top: "9vh" }} />
      <h2 className="journey-title"><span className="line"><Chars text="Perjalanan" /></span><span className="line"><Chars text="sejauh ini" /></span></h2>
      <div className="jw">
        <div className="jl"><i /><div className="run"><Ship /></div></div>
        {STEPS.map(([y, t, d]) => (
          <div className="step" key={t}><small>{y}</small><h3>{t}</h3><p>{d}</p></div>
        ))}
        <div className="jw-goal">
          <div className="pln ringed" style={{ "--pc": "#8a6fb0", "--sz": "clamp(90px,10vw,150px)" } as React.CSSProperties}><i className="pln-s" /><i className="pln-moon" /></div>
          <div><small>Tujuan berikutnya</small><b>Cretivox</b><span>Season II · Batch 6</span></div>
        </div>
      </div>
    </section>
  );
}
