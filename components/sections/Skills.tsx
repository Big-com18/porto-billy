"use client";
import { useRef } from "react";
import Chars from "@/components/ui/Chars";
import Logo from "@/components/ui/Logo";
import { SKILLS } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";

const GROUPS = Object.entries(SKILLS);
const TOTAL = GROUPS.reduce((n, [, a]) => n + a.length, 0);
const LABEL: Record<string, string> = { Bahasa: "Bahasa pemrograman", Framework: "Framework", Tools: "Tools" };

/** Semua skill tampil sebagai tiga baris berjalan berlawanan arah. Arahkan kursor ke baris untuk menghentikannya. */
export default function Skills() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".skills-title .ch", { yPercent: 110, stagger: 0.03, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: ".skills-title", start: "top 85%" } });
      gsap.from(".sk-row", { y: 70, opacity: 0, stagger: 0.15, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".sk-rows", start: "top 85%" } });
      gsap.utils.toArray<HTMLElement>(".sk-row").forEach((row, i) => {
        const run = row.querySelector(".sk-run")!;
        const dur = 38 + i * 7;
        const t = i % 2 === 0 ? gsap.to(run, { xPercent: -50, duration: dur, ease: "none", repeat: -1 }) : gsap.fromTo(run, { xPercent: -50 }, { xPercent: 0, duration: dur, ease: "none", repeat: -1 });
        const slow = () => gsap.to(t, { timeScale: 0, duration: 0.5, overwrite: true });
        const go = () => gsap.to(t, { timeScale: 1, duration: 0.8, overwrite: true });
        row.addEventListener("mouseenter", slow); row.addEventListener("mouseleave", go);
      });
    });
  }, { scope: root });

  return (
    <section id="skills" className="stack" data-stack ref={root}>
      <h2 className="skills-title"><span className="line"><Chars text="Bekal teknologi" /></span><span className="line"><Chars text="yang saya bawa" /></span></h2>
      <p className="lead">{TOTAL} bahasa, framework, dan tools yang pernah saya pakai. Arahkan kursor ke sebuah baris untuk menghentikannya.</p>
      <div className="sk-rows">
        {GROUPS.map(([g, items]) => (
          <div className="sk-row" key={g}>
            <div className="sk-label"><b>{LABEL[g] ?? g}</b><span>{items.length}</span></div>
            <div className="sk-track">
              <div className="sk-run">
                {[0, 1, 2, 3].flatMap((k) => items.map(([l, n]) => <span className="chip" key={`${k}-${l}`}><Logo n={n} size={32} />{l}</span>))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
