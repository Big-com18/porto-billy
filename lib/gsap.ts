import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import type Lenis from "lenis";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, Draggable, useGSAP);

export { gsap, ScrollTrigger, Draggable, useGSAP };

/** Run `cb` once the loader curtain lifts. Returns a cleanup function. */
export const onIntro = (cb: () => void) => {
  window.addEventListener("intro:done", cb, { once: true });
  return () => window.removeEventListener("intro:done", cb);
};

let lenis: Lenis | null = null;
export const registerLenis = (l: Lenis | null) => { lenis = l; };

/** Scroll halus ke #id (atau #top). Section yang di-pin dihitung lewat ScrollTrigger. Return false kalau target tidak ada. */
export function smoothTo(hash: string): boolean {
  let y = 0;
  if (hash && hash !== "#top") {
    const el = document.getElementById(hash.slice(1));
    if (!el) return false;
    const st = ScrollTrigger.getAll().find((s) => s.trigger === el && s.pin);
    y = st ? st.start : el.getBoundingClientRect().top + window.scrollY;
  }
  if (lenis) {
    const dist = Math.abs(y - window.scrollY);
    lenis.scrollTo(y, { duration: Math.min(2.2, 0.9 + dist / 3200), easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) });
  } else window.scrollTo(0, y);
  history.replaceState(null, "", hash === "#top" ? window.location.pathname : hash);
  return true;
}
