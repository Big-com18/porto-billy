"use client";
import { useRef, useState } from "react";
import Chars from "@/components/ui/Chars";
import Logo from "@/components/ui/Logo";
import { SKILLS } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";

const ALL = Object.entries(SKILLS).flatMap(([g, items]) => items.map(([l, n]) => ({ l, n, g })));
const TABS = ["Semua", ...Object.keys(SKILLS)];
const LABEL: Record<string, string> = { Bahasa: "Bahasa", Framework: "Framework", Tools: "Tools" };

/** Semua skill sebagai tabel ala tabel periodik. Pilih kategori untuk menyorot, sisanya meredup. */
export default function Skills() {
  const root = useRef<HTMLElement>(null);
  const [tab, setTab] = useState("Semua");
  const shown = ALL.filter((s) => tab === "Semua" || s.g === tab).length;

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".skills-title .ch", { yPercent: 110, stagger: 0.03, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: ".skills-title", start: "top 85%" } });
      gsap.from(".sk-bar", { y: 30, opacity: 0, duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: ".sk-bar", start: "top 92%" } });
      gsap.from(".sk", { y: 60, scale: 0.8, opacity: 0, duration: 0.9, ease: "expo.out", stagger: { amount: 0.9, from: "random" }, clearProps: "transform,opacity", scrollTrigger: { trigger: ".sk-grid", start: "top 88%" } });
    });
  }, { scope: root });

  return (
    <section id="skills" className="stack" data-stack ref={root}>
      <h2 className="skills-title"><span className="line"><Chars text="Bekal teknologi" /></span><span className="line"><Chars text="yang saya bawa" /></span></h2>
      <p className="lead">{ALL.length} bahasa, framework, dan tools yang pernah saya pakai. Pilih kategori untuk menyorotnya.</p>

      <div className="sk-bar" role="tablist" aria-label="Kategori skill">
        {TABS.map((t) => (
          <button type="button" role="tab" aria-selected={tab === t} key={t} className={`sk-tab${tab === t ? " on" : ""}`} onClick={() => setTab(t)}>
            {LABEL[t] ?? t}<small>{t === "Semua" ? ALL.length : SKILLS[t as keyof typeof SKILLS].length}</small>
          </button>
        ))}
        <span className="sk-count"><b>{shown}</b> dari {ALL.length}</span>
      </div>

      <div className="sk-grid">
        {ALL.map((s, i) => (
          <div key={s.l} data-g={s.g} className={`sk spot${tab === "Semua" || tab === s.g ? "" : " off"}`}>
            <span className="i">{String(i + 1).padStart(2, "0")}</span>
            <Logo n={s.n} size={44} />
            <div><b>{s.l}</b><small>{s.g}</small></div>
          </div>
        ))}
      </div>
    </section>
  );
}
