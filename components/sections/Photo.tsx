"use client";
import { useEffect, useRef, useState } from "react";
import Chars from "@/components/ui/Chars";
import { STICKERS } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";

const VIEWS = [
  { src: "/profile/FotoKiri.jpg", label: "Kiri", pos: "30% 30%" },
  { src: "/profile/FotoDepan.jpg", label: "Depan", pos: "50% 30%" },
  { src: "/profile/FotoKanan.jpg", label: "Kanan", pos: "70% 30%" },
] as const;
const SEQ = [1, 0, 1, 2];

/** Foto tiga sisi. Geser kursor / jari ke kiri atau kanan di atas foto, kepalanya ikut menoleh. */
export default function Photo() {
  const root = useRef<HTMLElement>(null);
  const [view, setView] = useState(1);
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = root.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // sebelum pengunjung berinteraksi, kepala menoleh sendiri: depan, kiri, depan, kanan
  useEffect(() => {
    if (!auto || !visible) return;
    let k = 0;
    const t = window.setInterval(() => { k = (k + 1) % SEQ.length; setView(SEQ[k]); }, 2600);
    return () => window.clearInterval(t);
  }, [auto, visible]);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".photo-title .ch", { yPercent: 110, stagger: 0.03, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: ".photo-title", start: "top 85%" } });
      gsap.from(".ph-stage", { y: 80, scale: 0.92, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".ph-grid", start: "top 82%" } });
      gsap.from(".ph-th", { y: 40, opacity: 0, stagger: 0.1, duration: 0.8, ease: "expo.out", clearProps: "transform,opacity", scrollTrigger: { trigger: ".ph-thumbs", start: "top 92%" } });
      gsap.from(".ph-facts span", { y: 24, opacity: 0, stagger: 0.08, duration: 0.7, ease: "expo.out", scrollTrigger: { trigger: ".ph-facts", start: "top 95%" } });
    });
  }, { scope: root });

  // transisi menoleh
  useGSAP(() => {
    const k = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1;
    gsap.utils.toArray<HTMLElement>(".ph-stage img").forEach((im, i) => {
      gsap.to(im, { opacity: i === view ? 1 : 0, xPercent: i === view ? 0 : i < view ? -5 : 5, scale: i === view ? 1 : 0.96, duration: 0.6 * k, ease: "power3.out", overwrite: "auto" });
    });
    gsap.fromTo(".ph-cap b", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 * k, ease: "power3.out" });
  }, { scope: root, dependencies: [view], revertOnUpdate: false });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    setAuto(false);
    setView(x < 0.34 ? 0 : x > 0.66 ? 2 : 1);
    gsap.to(".ph-in", { x: (0.5 - x) * 18, y: (0.5 - (e.clientY - r.top) / r.height) * 10, duration: 0.7, ease: "power3.out", overwrite: "auto" });
  };
  const onLeave = () => gsap.to(".ph-in", { x: 0, y: 0, duration: 0.8, ease: "power3.out" });
  const pick = (i: number) => { setAuto(false); setView(i); };

  return (
    <section id="foto" className="stack photo" data-stack ref={root}>
      <h2 className="photo-title"><span className="line"><Chars text="Wajah di balik" /></span><span className="line"><Chars text="kode saya" /></span></h2>

      <div className="ph-grid">
        <div className="ph-stage" onPointerMove={onMove} onPointerLeave={onLeave}>
          <div className="ph-in">
            {VIEWS.map((v, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={v.src} src={v.src} alt={`Foto Billy Andreas tampak ${v.label.toLowerCase()}`} width={836} height={640} draggable={false} data-i={i} fetchPriority={i === 1 ? "high" : "low"} />
            ))}
          </div>
          <div className="ph-cap"><i />Tampak <b>{VIEWS[view].label.toLowerCase()}</b><small>{view + 1}/3</small></div>
          <div className="ph-hint"><span className="h-mouse">Geser kursor untuk menoleh</span><span className="h-touch">Geser jari untuk menoleh</span></div>
        </div>

        <div className="ph-side">
          <p className="lead">Tiga sisi, satu orang. Biar kamu kenal siapa yang ada di balik website ini sebelum kita ngobrol soal kode.</p>
          <div className="ph-thumbs" role="tablist" aria-label="Pilih sisi foto">
            {VIEWS.map((v, i) => (
              <button type="button" role="tab" aria-selected={view === i} key={v.label} className={`ph-th${view === i ? " on" : ""}`} onClick={() => pick(i)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.src} alt="" width={836} height={640} loading="lazy" draggable={false} style={{ objectPosition: v.pos }} />
                <span>{v.label}</span>
              </button>
            ))}
          </div>
          <div className="ph-facts">{STICKERS.map((s) => <span key={s}>{s}</span>)}</div>
        </div>
      </div>
    </section>
  );
}
