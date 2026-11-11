"use client";
import { useRef } from "react";
import { ABOUT, FRAMEWORKS, PROJECTS, REPOS, SKILLS, STICKERS } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";

const STATS: [number, string][] = [
  [FRAMEWORKS.length, "framework"], [SKILLS.Bahasa.length, "bahasa pemrograman"], [PROJECTS.length, "project"], [REPOS.length, "repo di GitHub"],
];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".about .w", { opacity: 0.15 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ".about .t", start: "top 80%", end: "bottom 50%", scrub: true } });
      gsap.from(".about .facts span", { y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: ".about .facts", start: "top 92%" } });
      gsap.from(".stat", { y: 60, opacity: 0, stagger: 0.1, duration: 0.9, ease: "expo.out", clearProps: "transform,opacity", scrollTrigger: { trigger: ".stats", start: "top 85%" } });
      // angka naik dari 0 saat masuk layar
      gsap.utils.toArray<HTMLElement>(".stat b").forEach((el) => {
        const o = { v: 0 }; el.textContent = "0";
        gsap.to(o, { v: Number(el.dataset.n), duration: 1.6, ease: "power2.out", snap: { v: 1 }, onUpdate: () => { el.textContent = String(o.v); }, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      });
    });
  }, { scope: root });

  return (
    <section className="about" id="about" ref={root}>
      <p className="t">{ABOUT.split(" ").map((w, i) => <span className="w" key={i}>{w}</span>)}</p>
      <div className="facts">{STICKERS.map((s) => <span key={s}>{s}</span>)}</div>
      <div className="stats">
        {STATS.map(([n, l]) => <div className="stat" key={l}><b data-n={n}>{n}</b><span>{l}</span></div>)}
      </div>
    </section>
  );
}
