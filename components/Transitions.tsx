"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, registerLenis, ScrollTrigger, smoothTo, useGSAP } from "@/lib/gsap";

/** Efek tumpuk: saat section berikutnya naik, section di bawahnya mengecil dan meredup, seperti kartu yang ditumpuk. */
export default function Transitions() {
  // scroll inersia yang halus (Lenis), disinkronkan dengan ScrollTrigger
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15 });
    registerLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); registerLenis(null); };
  }, []);

  // semua link #anchor (navbar, tombol hero, dll) scroll dengan halus
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const h = a.getAttribute("href")!;
      if (h.length > 1 && smoothTo(h)) e.preventDefault();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 801px)", () => {
      gsap.utils.toArray<HTMLElement>("[data-stack]").forEach((s) => {
        const prev = s.previousElementSibling as HTMLElement | null;
        // section yang di-pin (Project) tidak boleh ditransform
        if (!prev || prev.id === "projects" || prev.querySelector("#projects") || prev.classList.contains("pin-spacer")) return;
        gsap.to(prev, {
          scale: 0.95, transformOrigin: "50% 100%", ease: "none", force3D: true,
          scrollTrigger: { trigger: s, start: "top bottom", end: "top 15%", scrub: true },
        });
      });
    });
  });
  return null;
}
