"use client";
import { useRef } from "react";
import Chars from "@/components/ui/Chars";
import Logo from "@/components/ui/Logo";
import { SKILLS } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Skills() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".skills-title .ch", { yPercent: 110, stagger: 0.03, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: ".skills-title", start: "top 85%" } });
      // chip berserakan lalu berkumpul rapi saat di-scroll: bekal yang dikumpulkan
      gsap.utils.toArray<HTMLElement>(".chip").forEach((c) => {
        gsap.from(c, { x: gsap.utils.random(-240, 240), y: gsap.utils.random(-160, 160), rotate: gsap.utils.random(-40, 40), ease: "power2.out", scrollTrigger: { trigger: "#skills", start: "top 75%", end: "center 55%", scrub: true } });
      });
    });
  }, { scope: root });

  const groups = Object.entries(SKILLS).filter(([g]) => g !== "Framework");
  return (
    <section id="skills" ref={root}>
      <h2 className="skills-title"><span className="line"><Chars text="Bahasa dan tools" /></span><span className="line"><Chars text="yang saya bawa" /></span></h2>
      {groups.map(([g, items], gi) => (
        <div className={`grp g${gi}`} key={g}>
          <h3>{g}</h3>
          <div className="chips">{items.map(([l, n]) => <span className="chip" key={l}><Logo n={n} size={26} />{l}</span>)}</div>
        </div>
      ))}
    </section>
  );
}
