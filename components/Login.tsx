"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/lib/gsap";
import { login, logout, useSession } from "@/lib/auth";

/** Tombol Masuk di navbar + modal login. Setelah login, website di belakang diburamkan dan muncul sapaan besar "Hi, <nama>!". */
export default function Login() {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState<string | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); setOk(null); } };
    window.addEventListener("keydown", esc);
    if (!ok) gsap.fromTo(box.current, { y: 40, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" });
    first.current?.focus();
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [open, ok]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const s = await login(email.trim(), pw);
      setOk(s.name.split(" ")[0]); // "Emily Johnson" -> "Emily"
      window.setTimeout(() => { setOpen(false); setOk(null); setPw(""); }, 2800);
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Terjadi kesalahan.");
    } finally { setBusy(false); }
  };

  return (
    <>
      {session ? (
        <div className="me">
          <i>{session.name.charAt(0).toUpperCase()}</i>
          <span>{session.name}</span>
          <button type="button" onClick={logout}>Keluar</button>
        </div>
      ) : (
        <button type="button" className="login-btn" onClick={() => setOpen(true)}>Masuk</button>
      )}

      {open && ok && createPortal(
        <div
          role="status"
          aria-live="polite"
          onClick={() => { setOpen(false); setOk(null); setPw(""); }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 6vw",
            background: "rgba(9,9,11,.4)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
            color: "var(--paper)",
            cursor: "pointer",
            animation: "greetFade 2.8s ease forwards",
          }}
        >
          <style>{`
            @keyframes greetFade{0%{opacity:0}15%{opacity:1}85%{opacity:1}100%{opacity:0}}
            @keyframes greetRise{0%{transform:translateY(40px);opacity:0}25%{transform:translateY(0);opacity:1}100%{transform:translateY(0);opacity:1}}
          `}</style>
          <h2
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(4rem, 16vw, 13rem)",
              lineHeight: 0.95,
              letterSpacing: "-.03em",
              margin: 0,
              animation: "greetRise 1.2s cubic-bezier(.16,1,.3,1) both",
            }}
          >
            Hi, <em style={{ color: "var(--lav)" }}>{ok}</em>!
          </h2>
          <p
            style={{
              marginTop: "2vh",
              fontSize: "clamp(1rem, 2vw, 1.4rem)",
              fontWeight: 500,
              color: "var(--mutd)",
              animation: "greetRise 1.2s .2s cubic-bezier(.16,1,.3,1) both",
            }}
          >
            Selamat datang, selamat menjelajah.
          </p>
        </div>, document.body)}

      {open && !ok && createPortal(
        <div className="modal-bg" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="modal" ref={box} role="dialog" aria-modal="true" aria-labelledby="login-title">
            <button type="button" className="x" aria-label="Tutup" onClick={() => setOpen(false)}>✕</button>
            <form onSubmit={submit}>
              <h3 id="login-title">Masuk</h3>
              <p className="sub">Login dengan akun kamu untuk disapa langsung di website ini.</p>
              <div className="field"><label htmlFor="em">Username</label><input id="em" ref={first} type="text" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div className="field"><label htmlFor="pw">Password</label>
                <div className="pw"><input id="pw" type={show ? "text" : "password"} autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} required />
                  <button type="button" onClick={() => setShow(!show)}>{show ? "Sembunyikan" : "Lihat"}</button></div>
              </div>
              {err && <p className="err" role="alert">{err}</p>}
              <button type="submit" className="btn solid go-login" disabled={busy}>{busy ? "Memproses…" : "Masuk"}</button>
            </form>
          </div>
        </div>, document.body)}
    </>
  );
}