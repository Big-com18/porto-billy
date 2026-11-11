import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, Draggable, useGSAP);

export { gsap, ScrollTrigger, Draggable, useGSAP };

/** Run `cb` once the loader curtain lifts. Returns a cleanup function. */
export const onIntro = (cb: () => void) => {
  window.addEventListener("intro:done", cb, { once: true });
  return () => window.removeEventListener("intro:done", cb);
};
