"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import Chars from "@/components/ui/Chars";
import { GH_USER, LANG_COLOR, SHOWCASE } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";

const AUTO_MS = 7000;
const EXTS = ["png", "jpg", "webp"];

/** Sumber gambar berurutan: gambar lokal (png/jpg/webp) lalu kartu GitHub. Kalau semua gagal -> placeholder. */
const sources = (repo: string, image?: string) => [
  ...(image ? [image] : EXTS.map((e) => `/showcase/${repo}.${e}`)),
  `https://opengraph.githubassets.com/1/${GH_USER}/${repo}`,
];

/** Showcase: pilih project di kiri, previewnya tampil di jendela browser. Ada URL live -> website sungguhan; tidak ada -> gambar lokal. */
export default function Repos() {
  const root = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const [pref, setPref] = useState<"live" | "card" | null>(null);
  const [miss, setMiss] = useState<Record<string, number>>({});

  const it = SHOWCASE[i];
  const live = it.live || undefined;
  const mode = live ? (pref ?? "live") : "card";
  const gh = `https://github.com/${GH_USER}/${it.repo}`;
  const srcs = sources(it.repo, it.image);
  const n = miss[it.repo] ?? 0;

  const pick = (k: number) => { setAuto(false); setPref(null); setI(k); };

  useEffect(() => {
    if (!auto) return;
    const t = window.setInterval(() => { setPref(null); setI((x) => (x + 1) % SHOWCASE.length); }, AUTO_MS);
    return () => window.clearInterval(t);
  }, [auto]);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".repos-title .ch", { yPercent: 110, stagger: 0.03, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: ".repos-title", start: "top 85%" } });
      gsap.from(".sc-list li", { x: -40, opacity: 0, stagger: 0.05, duration: 0.8, ease: "expo.out", clearProps: "transform,opacity", scrollTrigger: { trigger: ".sc", start: "top 80%" } });
      gsap.from(".win", { y: 90, opacity: 0, rotationX: 8, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".sc", start: "top 80%" } });
    });
    mm.add("(hover: hover) and (prefers-reduced-motion: no-preference)", () => {
      const w = root.current!.querySelector<HTMLElement>(".win")!;
      gsap.set(w, { transformPerspective: 1100 });
      const rx = gsap.quickTo(w, "rotationX", { duration: 0.6, ease: "power3" });
      const ry = gsap.quickTo(w, "rotationY", { duration: 0.6, ease: "power3" });
      const move = (e: MouseEvent) => { const r = w.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 6); rx(-((e.clientY - r.top) / r.height - 0.5) * 6); };
      const leave = () => { rx(0); ry(0); };
      w.addEventListener("mousemove", move); w.addEventListener("mouseleave", leave);
      return () => { w.removeEventListener("mousemove", move); w.removeEventListener("mouseleave", leave); };
    });
  }, { scope: root });

  // transisi isi preview saat project / mode berganti
  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(".win-body > *", { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" });
    gsap.fromTo(".sc-meta > *", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" });
  }, { scope: root, dependencies: [i, mode], revertOnUpdate: false });

  return (
    <section id="repos" className="stack" data-stack ref={root}>
      <h2 className="repos-title"><span className="line"><Chars text="Showcase kode" /></span><span className="line"><Chars text="dan karya saya" /></span></h2>
      <p className="lead">Empat project unggulan di depan, lalu repo lainnya. Pilih salah satu untuk melihat previewnya.</p>

      <div className={`sc${auto ? " auto" : ""}`}>
        <ol className="sc-list">
          {SHOWCASE.map((p, k) => (
            <Fragment key={p.repo}>
              {k === 4 && <li className="sc-sep" aria-hidden="true">Repo lainnya</li>}
              <li>
                <button type="button" className={k === i ? "on" : ""} style={{ "--c": LANG_COLOR[p.lang] } as React.CSSProperties} onClick={() => pick(k)} aria-current={k === i}>
                  <span className="n">{String(k + 1).padStart(2, "0")}</span>
                  <span className="t">{p.name}{p.featured && <em>Unggulan</em>}</span>
                  <span className="lang"><i style={{ background: LANG_COLOR[p.lang] }} />{p.lang}</span>
                  <span className="prog" key={k === i ? `a${i}` : "x"} />
                </button>
              </li>
            </Fragment>
          ))}
        </ol>

        <div className="sc-view">
          <div className="win">
            <div className="win-bar">
              <i style={{ background: "var(--rose)" }} /><i style={{ background: "var(--sand)" }} /><i style={{ background: "var(--mint)" }} />
              <span className="url">{mode === "live" ? live : gh}</span>
              {live && (
                <span className="seg">
                  <button type="button" className={mode === "live" ? "on" : ""} onClick={() => setPref("live")}>Live</button>
                  <button type="button" className={mode === "card" ? "on" : ""} onClick={() => setPref("card")}>Gambar</button>
                </span>
              )}
            </div>
            <div className="win-body">
              {mode === "live" ? (
                <iframe key={`live-${it.repo}`} src={live} title={`Preview ${it.name}`} loading="lazy" referrerPolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
              ) : n < srcs.length ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={`${it.repo}-${n}`} src={srcs[n]} alt={`Preview ${it.name}`} onError={() => setMiss((m) => ({ ...m, [it.repo]: n + 1 }))} />
              ) : (
                <div className="fallback" key={`fb-${it.repo}`}><b>{it.name}</b><span>{it.lang}</span></div>
              )}
            </div>
          </div>
          <div className="sc-meta">
            <div>
              <h3 className="serif">{it.name}</h3>
              <p>{it.desc}</p>
            </div>
            <div className="acts">
              <a className="btn solid" href={gh} target="_blank" rel="noreferrer">Lihat kode</a>
              {live && <a className="btn" href={live} target="_blank" rel="noreferrer">Buka live</a>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
