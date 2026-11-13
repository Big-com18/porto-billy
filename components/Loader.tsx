"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      document.body.style.overflow = "hidden";
      const count = { v: 0 };
      gsap.timeline({ onComplete: () => { document.body.style.overflow = ""; } })
        .to(count, { v: 100, duration: 2.0, ease: "power2.inOut", onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(count.v)); } })
        .to(root.current, { yPercent: -100, duration: 0.9, ease: "expo.inOut" })
        .add(() => { window.dispatchEvent(new Event("intro:done")); }, "-=0.55");
      return () => { document.body.style.overflow = ""; };
    });
    mm.add("(prefers-reduced-motion: reduce)", () => { gsap.set(root.current, { display: "none" }); });
  }, { scope: root });

  return (
    <div className="loader" ref={root}>
      <small>Code.</small>
      <span><span ref={num}>0</span>%</span>
    </div>
  );
}
