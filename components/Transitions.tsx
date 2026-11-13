"use client";
import { gsap, useGSAP } from "@/lib/gsap";

/** Efek tumpuk: saat section berikutnya naik, section di bawahnya mengecil dan meredup, seperti kartu yang ditumpuk. */
export default function Transitions() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 801px)", () => {
      gsap.utils.toArray<HTMLElement>("[data-stack]").forEach((s) => {
        const prev = s.previousElementSibling as HTMLElement | null;
        // section yang di-pin (Project) tidak boleh ditransform
        if (!prev || prev.id === "projects" || prev.querySelector("#projects") || prev.classList.contains("pin-spacer")) return;
        gsap.to(prev, {
          scale: 0.94, opacity: 0.45, transformOrigin: "50% 100%", ease: "none",
          scrollTrigger: { trigger: s, start: "top bottom", end: "top 15%", scrub: true },
        });
      });
    });
  });
  return null;
}
