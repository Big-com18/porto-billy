"use client";
import { useRef } from "react";
import Logo from "@/components/ui/Logo";
import { ABOUT, FRAMEWORKS, PROJECTS, REPOS, SKILLS, STEPS, STICKERS, STACK } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";

const STATS: [number, string][] = [
  [FRAMEWORKS.length, "framework"], [SKILLS.Bahasa.length, "bahasa pemrograman"], [PROJECTS.length, "project"], [REPOS.length, "repo di GitHub"],
];
const LOGOS = Array.from(new Set(STACK.map(([, l]) => l)));
const RING_A = LOGOS.slice(0, 8);
const RING_B = LOGOS.slice(8);

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".about .w", { opacity: 0.15 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ".about .t", start: "top 80%", end: "bottom 50%", scrub: true } });
      gsap.from(".about .facts span", { y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: ".about .facts", start: "top 92%" } });
      gsap.from(".bento > *", { y: 70, opacity: 0, scale: 0.94, stagger: 0.08, duration: 1, ease: "expo.out", clearProps: "transform,opacity", scrollTrigger: { trigger: ".bento", start: "top 88%" } });
      // bentuk melayang dengan kecepatan berbeda saat scroll (parallax)
      gsap.utils.toArray<HTMLElement>(".fl").forEach((el, i) => {
        gsap.to(el, { yPercent: (i % 2 ? -1 : 1) * (40 + i * 25), ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
      // angka naik dari 0
      gsap.utils.toArray<HTMLElement>(".stat b").forEach((el) => {
        const o = { v: 0 }; el.textContent = "0";
        gsap.to(o, { v: Number(el.dataset.n), duration: 1.6, ease: "power2.out", snap: { v: 1 }, onUpdate: () => { el.textContent = String(o.v); }, scrollTrigger: { trigger: el, start: "top 92%", once: true } });
      });
      // logo teknologi mengorbit
      const place = (sel: string, r: number) => {
        const els = gsap.utils.toArray<HTMLElement>(sel);
        els.forEach((el, i) => { const a = (i / els.length) * Math.PI * 2; gsap.set(el, { x: Math.cos(a) * r, y: Math.sin(a) * r }); });
      };
      const tile = root.current!.querySelector<HTMLElement>(".orbit-t")!;
      const R = Math.min(tile.clientWidth, tile.clientHeight) / 2 - 44;
      place(".orbit.a .o", R); place(".orbit.b .o", R * 0.56);
      gsap.to(".orbit.a", { rotation: 360, duration: 46, ease: "none", repeat: -1 });
      gsap.to(".orbit.a .o", { rotation: -360, duration: 46, ease: "none", repeat: -1 });
      gsap.to(".orbit.b", { rotation: -360, duration: 34, ease: "none", repeat: -1 });
      gsap.to(".orbit.b .o", { rotation: 360, duration: 34, ease: "none", repeat: -1 });
    });
  }, { scope: root });

  const edu = STEPS[1], exp = STEPS[2];
  return (
    <section className="about" id="about" ref={root}>
      <i className="fl fl1" aria-hidden="true" /><i className="fl fl2" aria-hidden="true" /><i className="fl fl3" aria-hidden="true" />
      <p className="t">{ABOUT.split(" ").map((w, i) => <span className="w" key={i}>{w}</span>)}</p>
      <div className="facts">{STICKERS.map((s) => <span key={s}>{s}</span>)}</div>

      <div className="bento">
        {STATS.map(([n, l]) => <div className="stat spot" key={l}><b data-n={n}>{n}</b><span>{l}</span></div>)}

        <div className="orbit-t">
          <div className="ring" style={{ "--d": "62%" } as React.CSSProperties} /><div className="ring" style={{ "--d": "34%" } as React.CSSProperties} />
          <div className="orbit a" aria-hidden="true">{RING_A.map((l) => <span className="o" key={l}><Logo n={l} size={30} /></span>)}</div>
          <div className="orbit b" aria-hidden="true">{RING_B.map((l) => <span className="o" key={l}><Logo n={l} size={30} /></span>)}</div>
          <div className="orbit-c">Stack<br />saya</div>
        </div>

        <div className="info-grid">
          <div className="info goal spot">
            <small><i className="live" />Sedang mengincar</small>
            <div><b>Magang Front-End</b><span>Cretivox · Season II Batch 6</span></div>
          </div>
          <div className="info edu spot"><small>{edu[0]}</small><div><b>{edu[1]}</b><span>{edu[2]}</span></div></div>
          <div className="info exp spot wide"><small>{exp[0]}</small><div><b>{exp[1]}</b><span>{exp[2]}</span></div></div>
        </div>
      </div>
    </section>
  );
}
