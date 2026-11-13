"use client";
import { useEffect, useRef, useState } from "react";
import Chars from "@/components/ui/Chars";
import Logo from "@/components/ui/Logo";
import { InstagramIcon, LinkedInIcon } from "@/components/ui/Icons";
import { EMAIL, LINKS } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";

const TILE = ["var(--sand)", "var(--mint)", "var(--blue)"];
const handle = (u: string) => u.replace(/\/$/, "").split("/").pop();

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState("");

  const copy = async () => {
    try { await navigator.clipboard.writeText(EMAIL); } catch { /* clipboard diblokir: tetap tampilkan feedback */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  // jam Jakarta (dirender setelah mount supaya tidak bentrok saat hydration)
  useEffect(() => {
    const f = () => setTime(new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jakarta" }).format(new Date()).replace(".", ":"));
    f();
    const t = window.setInterval(f, 30000);
    return () => window.clearInterval(t);
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".contact h2 .ch", { yPercent: 120, stagger: 0.03, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".contact", start: "top 60%" } });
      gsap.from(".mail-card, .soc", { y: 50, opacity: 0, stagger: 0.1, duration: 0.9, ease: "expo.out", clearProps: "transform,opacity", scrollTrigger: { trigger: ".ct-grid", start: "top 85%" } });

      // efek magnet: elemen sedikit menempel ke kursor
      const mags = gsap.utils.toArray<HTMLElement>(".mag").map((el) => {
        const k = Number(el.dataset.s ?? 0.3);
        const mx = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
        const my = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
        const onMove = (e: MouseEvent) => { const r = el.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * k); my((e.clientY - r.top - r.height / 2) * k); };
        const onLeave = () => { mx(0); my(0); };
        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
        return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
      });
      return () => mags.forEach((f) => f());
    });
  }, { scope: root });

  return (
    <section className="contact stack" id="contact" data-stack ref={root}>
      <p className="lead">Punya brief, kolaborasi, atau mau ngobrol soal magang? Kirim saja, saya balas secepatnya.</p>
      <h2><span className="line"><Chars text="Ayo ngobrol." /></span></h2>

      <div className="ct-grid">
        <button type="button" className="mail-card spot mag" data-s="0.06" onClick={copy}>
          <span className="mc-label">Email</span>
          <span className="mc-mail">{EMAIL}</span>
          <span className="mc-act">{copied ? "Tersalin ✓" : "Klik untuk salin"}</span>
        </button>
        <div className="soc-grid">
          {LINKS.map(([l, h], i) => (
            <a className="soc mag" data-s="0.12" key={l} href={h} target="_blank" rel="noreferrer" style={{ "--c": TILE[i % TILE.length] } as React.CSSProperties}>
              <span>{l === "GitHub" ? <Logo n="github" size={28} /> : <i className="ic">{l === "Instagram" ? <InstagramIcon /> : <LinkedInIcon />}</i>}<span><b>{l}</b><small>{handle(h)}</small></span></span>
              <span className="arr">↗</span>
            </a>
          ))}
        </div>
      </div>

      <footer>
        <span>© 2026 Billy Andreas</span>
        <span>Jakarta{time && `, ${time} WIB`}</span>
        <span>Cretivox Internship Experience S2 Batch 6</span>
        <button type="button" className="up" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Kembali ke atas ↑</button>
      </footer>
    </section>
  );
}