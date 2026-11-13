"use client";
import { useEffect, useRef, useState } from "react";
import Chars from "@/components/ui/Chars";
import Logo from "@/components/ui/Logo";
import { FRAMEWORKS } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";

const BG = FRAMEWORKS.map((f) => f.n.toUpperCase());

/** Panel akordeon. Berganti otomatis tiap beberapa detik; arahkan kursor atau tap untuk memilih sendiri. */
export default function Frameworks() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = root.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !visible) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % FRAMEWORKS.length), 3600);
    return () => window.clearInterval(t);
  }, [paused, visible]);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".fw-title .ch", { yPercent: 110, stagger: 0.03, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: ".fw-title", start: "top 85%" } });
      gsap.from(".fw", { yPercent: 25, opacity: 0, stagger: 0.08, duration: 0.9, ease: "expo.out", clearProps: "transform,opacity", scrollTrigger: { trigger: ".fw-list", start: "top 85%" } });
      gsap.to(".fw-bg .r1", { xPercent: -50, duration: 50, ease: "none", repeat: -1 });
      gsap.fromTo(".fw-bg .r2", { xPercent: -50 }, { xPercent: 0, duration: 60, ease: "none", repeat: -1 });
      // judul besar di belakang bergeser pelan mengikuti scroll
      gsap.to(".fw-bg", { yPercent: -35, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
    });
  }, { scope: root });

  return (
    <section id="frameworks" className="stack" data-stack ref={root}>
      <div className="fw-bg" aria-hidden="true">
        <div className="row out r1">{[...BG, ...BG].map((t, i) => <span key={i}>{t}</span>)}</div>
        <div className="row out r2">{[...BG, ...BG].reverse().map((t, i) => <span key={i}>{t}</span>)}</div>
      </div>
      <h2 className="fw-title"><span className="line"><Chars text="Framework" /></span><span className="line"><Chars text="jagoan saya" /></span></h2>
      <p className="lead">Tes ini mengutamakan Next.js, jadi website ini dibangun dengan Next.js dan GSAP. Panel berganti sendiri, atau arahkan kursor untuk memilih.</p>
      <div className="fw-list" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {FRAMEWORKS.map((f, i) => (
          <button type="button" key={f.n} className={`fw${active === i ? " open" : ""}`} style={{ backgroundColor: f.c }}
            aria-expanded={active === i} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}>
            <Logo n={f.l} size={80} />
            <span className="fw-note">{f.note}</span>
            <span className="fw-bot">
              <span className="fw-name">{f.n}</span>
              <span className="fw-tags">{f.tags.map((t) => <i key={t}>{t}</i>)}</span>
            </span>
            <span className="fw-ghost" aria-hidden="true"><Logo n={f.l} size={400} /></span>
            <span className="fw-i" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
