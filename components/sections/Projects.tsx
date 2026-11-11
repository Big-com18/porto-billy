"use client";
import { useRef } from "react";
import Chars from "@/components/ui/Chars";
import { PROJECTS, type Project } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";

function Card({ p }: { p: Project }) {
  const body = (
    <>
      <div><small>{p.t}</small><h3>{p.n}</h3><p>{p.d}</p></div>
      {p.u && <em>Buka website ↗</em>}
    </>
  );
  return p.u
    ? <a className="card" href={p.u} target="_blank" rel="noreferrer">{body}</a>
    : <div className="card">{body}</div>;
}

export default function Projects() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    // scroll ke bawah = berjalan ke kanan melewati karya (desktop saja)
    mm.add("(min-width: 801px) and (prefers-reduced-motion: no-preference)", () => {
      const rail = root.current!.querySelector<HTMLElement>(".rail")!;
      const dist = () => rail.scrollWidth - innerWidth + innerWidth * 0.06;
      gsap.to(rail, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: root.current, pin: true, scrub: 0.6, end: () => "+=" + dist(), invalidateOnRefresh: true } });
    });
    mm.add("(max-width: 800px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.from(".card", { y: 50, opacity: 0, stagger: 0.1, duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: ".rail", start: "top 85%" } });
    });
  }, { scope: root });

  return (
    <section id="projects" ref={root}>
      <h2><span className="line"><Chars text="Hasil kerja" /></span></h2>
      <p className="lead">Project kuliah dan pribadi. Scroll ke bawah untuk berjalan ke kanan.</p>
      <div className="rail">{PROJECTS.map((p) => <Card key={p.n} p={p} />)}</div>
    </section>
  );
}
