"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const STOPS: [string, string][] = [
  ["#top", "Start"], ["#about", "Kenalan"], ["#foto", "Wajah"], ["#frameworks", "Framework"], ["#skills", "Bekal"],
  ["#projects", "Karya"], ["#journey", "Rute"], ["#repos", "Showcase"], ["#contact", "Finish"],
];

const NAME = "Billy A.";

/** Teks label di kursor untuk elemen yang disorot. */
const labelFor = (el: Element): string =>
  el.getAttribute("data-cursor") ??
  (el.closest(".ph-stage") ? "Toleh" : el.closest(".stk") ? "Seret" : el.closest(".mail-card") ? "Salin" : el.closest(".sc-list button") ? "Pilih" : el.closest(".card, .soc") ? "Buka" : "Klik");

type Mode = "arrow" | "link" | "drag" | "text" | "busy";

/**
 * Trek lari di sisi kanan (terisi sesuai scroll) + kursor buatan sendiri:
 * panah pastel dengan label nama yang menyusul di belakangnya. Kursor bawaan browser disembunyikan.
 */
export default function Progress() {
  const fill = useRef<HTMLElement>(null);
  const label = useRef<HTMLElement>(null);
  const cur = useRef<HTMLDivElement>(null);
  const art = useRef<HTMLDivElement>(null);
  const beam = useRef<HTMLDivElement>(null);
  const blob = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);
  const tagText = useRef<HTMLSpanElement>(null);
  const rip = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(fill.current, { scaleY: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
      STOPS.forEach(([id, name]) => {
        ScrollTrigger.create({
          trigger: id, start: "top 55%", end: "bottom 55%",
          onToggle: (s) => { if (s.isActive && label.current) label.current.textContent = name; },
        });
      });
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    });

    // perangkat dengan mouse saja
    mm.add("(hover: hover) and (pointer: fine)", () => {
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const k = reduce ? 0 : 1;
      const html = document.documentElement;
      html.classList.add("has-cursor");

      const ax = gsap.quickTo(cur.current, "x", { duration: 0.06 * k, ease: "power3" });
      const ay = gsap.quickTo(cur.current, "y", { duration: 0.06 * k, ease: "power3" });
      const tx = gsap.quickTo(tag.current, "x", { duration: 0.4 * k, ease: "power3" });
      const ty = gsap.quickTo(tag.current, "y", { duration: 0.4 * k, ease: "power3" });

      let shown = false, hidden = false, down = false, mode: Mode = "arrow", word = "";
      const apply = () => {
        const vis = shown && !hidden ? 1 : 0;
        const round = mode === "link" || mode === "drag" || mode === "busy";
        gsap.to(cur.current, { opacity: vis, duration: 0.2 * k, overwrite: "auto" });
        // 1) panah: kursor utama
        gsap.to(art.current, { opacity: mode === "arrow" ? 1 : 0, scale: down ? 0.86 : 1, duration: 0.3 * k, ease: "back.out(2)", overwrite: "auto" });
        // 2) garis: di atas kolom teks
        gsap.to(beam.current, { opacity: mode === "text" ? 1 : 0, duration: 0.15 * k, overwrite: "auto" });
        // 3) bulatan mint: link, tombol, seret, loading
        gsap.to(blob.current, { opacity: round ? 1 : 0, scale: round ? (down ? 0.8 : 1) : 0.4, duration: 0.35 * k, ease: "back.out(2.4)", overwrite: "auto" });
        if (blob.current) { blob.current.classList.toggle("busy", mode === "busy"); blob.current.textContent = mode === "drag" ? "↔" : mode === "busy" ? "" : "↗"; }
        gsap.to(tag.current, { opacity: vis && mode !== "text" ? 1 : 0, scale: round ? 1.06 : 1, duration: 0.3 * k, ease: "power3.out", overwrite: "auto" });
        tag.current?.classList.toggle("hot", round);
        if (tagText.current) tagText.current.textContent = mode === "drag" && down && word === "Seret" ? "Lepas" : word || NAME;
      };

      const move = (e: MouseEvent) => {
        ax(e.clientX); ay(e.clientY); tx(e.clientX); ty(e.clientY);
        if (!shown) { shown = true; gsap.set([cur.current, tag.current], { x: e.clientX, y: e.clientY }); apply(); }
      };
      const over = (e: MouseEvent) => {
        const t = e.target as Element;
        hidden = t instanceof HTMLIFrameElement;           // di dalam iframe, kursor bawaan iframe yang tampil
        const el = t.closest("a, button, .stk, .ph-stage, [data-cursor]");
        mode = t.closest("input, textarea") ? "text" : !el ? "arrow" : el.closest(".stk, .ph-stage") ? "drag" : (el as HTMLButtonElement).disabled ? "busy" : "link";
        word = el && mode !== "text" ? labelFor(el) : "";
        apply();
      };
      const press = (e: MouseEvent) => {
        down = true; apply();
        if (!k) return;
        gsap.fromTo(rip.current, { x: e.clientX, y: e.clientY, scale: 0.2, opacity: 0.8 }, { scale: 1.5, opacity: 0, duration: 0.6, ease: "power2.out" });
      };
      const release = () => { down = false; apply(); };
      const leave = () => { hidden = true; apply(); };
      const enter = () => { hidden = false; apply(); };

      window.addEventListener("mousemove", move);
      document.addEventListener("mouseover", over);
      window.addEventListener("mousedown", press);
      window.addEventListener("mouseup", release);
      html.addEventListener("mouseleave", leave);
      html.addEventListener("mouseenter", enter);

      // sorotan cahaya di atas kartu
      const spot = (e: MouseEvent) => {
        const s = (e.target as Element).closest<HTMLElement>(".spot");
        if (s) { const r = s.getBoundingClientRect(); s.style.setProperty("--mx", `${e.clientX - r.left}px`); s.style.setProperty("--my", `${e.clientY - r.top}px`); }
      };
      window.addEventListener("mousemove", spot);

      return () => {
        html.classList.remove("has-cursor");
        window.removeEventListener("mousemove", move);
        document.removeEventListener("mouseover", over);
        window.removeEventListener("mousedown", press);
        window.removeEventListener("mouseup", release);
        html.removeEventListener("mouseleave", leave);
        html.removeEventListener("mouseenter", enter);
        window.removeEventListener("mousemove", spot);
      };
    });
  });

  return (
    <>
      <div className="track" aria-hidden="true"><i ref={fill} /><b ref={label}>Start</b></div>

      <div className="cur" ref={cur} aria-hidden="true">
        <div className="cur-a" ref={art}>
          <svg width="28" height="28" viewBox="0 0 28 28">
            <defs>
              <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#c5bdeb" /><stop offset="1" stopColor="#e8c3d2" />
              </linearGradient>
            </defs>
            <path d="M3 3 L3 21 L8 16.6 L11.4 24 L14.4 22.7 L11 15.4 L17.8 15.4 Z" fill="url(#cg)" stroke="#09090b" strokeWidth="1.7" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="cur-b" ref={blob} />
        <div className="cur-i" ref={beam}>
          <svg width="16" height="28" viewBox="0 0 16 28"><rect x="6" y="2" width="4" height="24" rx="2" fill="#f4f2f8" stroke="#09090b" strokeWidth="1.4" /></svg>
        </div>
      </div>
      <div className="cur-tag" ref={tag} aria-hidden="true"><span ref={tagText}>{NAME}</span></div>
      <div className="cur-rip" ref={rip} aria-hidden="true" />
    </>
  );
}
