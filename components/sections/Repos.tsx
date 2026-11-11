"use client";
import { useRef } from "react";
import Chars from "@/components/ui/Chars";
import Logo from "@/components/ui/Logo";
import { LANG_COLOR, REPOS } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Repos() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".repos-title .ch", { yPercent: 110, stagger: 0.03, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: ".repos-title", start: "top 85%" } });
      gsap.from(".repo", { y: 50, opacity: 0, stagger: 0.06, duration: 0.8, ease: "expo.out", clearProps: "transform,opacity", scrollTrigger: { trigger: ".repo-grid", start: "top 80%" } });
    });
  }, { scope: root });

  return (
    <section id="repos" ref={root}>
      <h2 className="repos-title"><span className="line"><Chars text="Kode di GitHub" /></span></h2>
      <div className="repo-grid">
        {REPOS.map(([n, l]) => (
          <a className="repo" key={n} href={`https://github.com/Big-com18/${n}`} target="_blank" rel="noreferrer">
            <div className="repo-top"><Logo n="github" size={30} /><span>↗</span></div>
            <div><b>{n}</b><span className="lang"><i style={{ background: LANG_COLOR[l] }} />{l}</span></div>
          </a>
        ))}
      </div>
    </section>
  );
}
