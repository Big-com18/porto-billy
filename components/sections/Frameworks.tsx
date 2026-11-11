"use client";
import { useRef, useState } from "react";
import Chars from "@/components/ui/Chars";
import Logo from "@/components/ui/Logo";
import { FRAMEWORKS } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";

/** Panel akordeon: arahkan kursor (atau tap) ke framework untuk membuka panelnya. */
export default function Frameworks() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".fw-title .ch", { yPercent: 110, stagger: 0.03, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: ".fw-title", start: "top 85%" } });
      gsap.from(".fw", { yPercent: 25, opacity: 0, stagger: 0.08, duration: 0.9, ease: "expo.out", clearProps: "transform,opacity", scrollTrigger: { trigger: ".fw-list", start: "top 85%" } });
    });
  }, { scope: root });

  return (
    <section id="frameworks" ref={root}>
      <h2 className="fw-title"><span className="line"><Chars text="Framework" /></span><span className="line"><Chars text="jagoan saya" /></span></h2>
      <p className="lead">Tes ini mengutamakan Next.js, jadi website ini dibangun dengan Next.js dan GSAP. Arahkan kursor ke tiap panel untuk melihat detailnya.</p>
      <div className="fw-list">
        {FRAMEWORKS.map((f, i) => (
          <button type="button" key={f.n} className={`fw${active === i ? " open" : ""}`} style={{ background: f.c }}
            aria-expanded={active === i} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}>
            <Logo n={f.l} size={80} />
            <span className="fw-name">{f.n}</span>
            <span className="fw-note">{f.note}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
