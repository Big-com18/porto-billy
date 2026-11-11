"use client";
import { useRef } from "react";
import Chars from "@/components/ui/Chars";
import Logo from "@/components/ui/Logo";
import { FRAMEWORKS } from "@/lib/data";
import { gsap, Draggable, useGSAP, onIntro } from "@/lib/gsap";

// posisi stiker [left %, top %]
const POS: [number, number][] = [[52, 17], [70, 9], [80, 27], [58, 37], [86, 46], [66, 52], [40, 40]];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(".hero .ch", { yPercent: 120, rotate: 8 });
      gsap.set(".hero .fade", { y: 24, opacity: 0 });
      gsap.set(".hero .stk", { scale: 0 });

      const off = onIntro(() => {
        gsap.timeline()
          .to(".hero .ch", { yPercent: 0, rotate: 0, duration: 1.1, ease: "expo.out", stagger: 0.04 })
          .to(".hero .fade", { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, "-=0.8")
          .to(".hero .stk", { scale: 1, duration: 0.9, ease: "back.out(2.2)", stagger: 0.08 }, "-=0.9");
      });

      // stiker framework melayang pelan dan bisa diseret
      gsap.utils.toArray<HTMLElement>(".hero .stk-in").forEach((el, i) => {
        gsap.to(el, { y: gsap.utils.random(-14, 14), rotate: gsap.utils.random(-5, 5), duration: gsap.utils.random(2.2, 3.6), repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.15 });
      });
      const drags = Draggable.create(".hero .stk", {
        type: "x,y", bounds: root.current!,
        onPress() { gsap.to(this.target, { scale: 1.12, zIndex: 10, duration: 0.2 }); },
        onRelease() { gsap.to(this.target, { scale: 1, duration: 0.5, ease: "elastic.out(1,.5)" }); },
      });

      gsap.to(".hero h1", { yPercent: -10, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      return () => { off(); drags.forEach((d) => d.kill()); };
    });
  }, { scope: root });

  return (
    <header className="hero" id="top" ref={root}>
      <div className="stickers">
        {FRAMEWORKS.map((f, i) => (
          <div className="stk" key={f.n} style={{ left: `${POS[i][0]}%`, top: `${POS[i][1]}%` }}>
            <div className="stk-in" style={{ background: f.c }}><Logo n={f.l} size={34} />{f.n}</div>
          </div>
        ))}
      </div>
      <div className="hero-top">
        <span className="pill fade"><i />Terbuka untuk magang Front-End Developer</span>
        <p className="sub fade">Saya bikin web yang rapi, cepat, dan terasa hidup. Coba seret stiker framework di kanan.</p>
        <div className="cta fade">
          <a className="btn dark" href="#projects">Lihat project</a>
          <a className="btn" href="#contact">Hubungi saya</a>
        </div>
      </div>
      <h1 aria-label="Billy Andreas">
        <span className="line" aria-hidden="true"><Chars text="BILLY" /></span>
        <span className="line" aria-hidden="true"><Chars text="ANDREAS" /></span>
      </h1>
      <div className="hero-foot fade"><span>Front-End Developer dan QA, Jakarta</span><span>Ilmu Komputer, Universitas Cakrawala</span></div>
    </header>
  );
}
