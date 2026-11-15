"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, registerLenis, ScrollTrigger, smoothTo, useGSAP } from "@/lib/gsap";
import { sky } from "@/components/space/sky";

/** Jenis transisi masuk tiap section: [bentuk awal, bentuk akhir] dari clip-path. Masing-masing datang dari arah yang berbeda. */
const WIPE: Record<string, [string, string]> = {
  circle: ["circle(0% at 50% 0%)", "circle(160% at 50% 0%)"],          // planet membesar dari atas tengah
  right: ["inset(0% 0% 0% 100%)", "inset(0% 0% 0% 0%)"],              // masuk dari kanan
  left: ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"],              // masuk dari kiri
  top: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"],               // tirai turun dari atas
  zoom: ["inset(9% 7% 0% 7% round 60px)", "inset(0% 0% 0% 0% round 0px)"], // kartu membesar memenuhi layar
  corner: ["circle(0% at 100% 0%)", "circle(160% at 100% 0%)"],       // melebar dari pojok kanan atas
};

/** Scroll halus (Lenis), langit berbintang yang bereaksi pada scroll, link #anchor, dan transisi antar section. */
export default function Orbit() {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lenis = new Lenis({ duration: 1.15 });
      registerLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t) => lenis!.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }
    const flame = () => document.documentElement.style.setProperty("--fl", String(Math.min(1.7, 0.55 + Math.abs(sky.sv) / 900)));
    gsap.ticker.add(flame);
    const move = (e: PointerEvent) => { sky.mx = e.clientX / innerWidth - 0.5; sky.my = e.clientY / innerHeight - 0.5; };
    const click = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const h = a.getAttribute("href")!;
      if (h.length > 1 && smoothTo(h)) e.preventDefault();
    };
    window.addEventListener("pointermove", move);
    document.addEventListener("click", click);
    return () => {
      gsap.ticker.remove(flame);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy(); registerLenis(null);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("click", click);
    };
  }, []);

  useGSAP(() => {
    // bintang bergeser dan memanjang mengikuti scroll
    ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => { sky.p = s.progress; sky.v = s.getVelocity(); } });

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // ilustrasi (astronaut, planet, satelit) bergeser dengan kecepatan berbeda = kedalaman
      gsap.utils.toArray<HTMLElement>("[data-par]").forEach((el) => {
        const k = Number(el.dataset.par);
        gsap.fromTo(el, { yPercent: k * 30 }, { yPercent: -k * 30, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-wipe]").forEach((el) => {
        const [from, to] = WIPE[el.dataset.wipe ?? "circle"];
        gsap.fromTo(el, { clipPath: from }, {
          clipPath: to, ease: "none",
          scrollTrigger: { trigger: el, start: "top 95%", end: "top 20%", scrub: true, invalidateOnRefresh: true },
          onComplete: () => gsap.set(el, { clearProps: "clipPath" }),   // jangan sisakan clip-path (penting untuk section yang di-pin)
        });
      });
    });
  });

  return null;
}
