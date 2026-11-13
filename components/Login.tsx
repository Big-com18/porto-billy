"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/lib/gsap";
import { login, logout, useSession } from "@/lib/auth";

/** Tombol Masuk di navbar + modal login. Setelah login, navbar menampilkan nama pengguna. */
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
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", esc);
    gsap.fromTo(box.current, { y: 40, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" });
    first.current?.focus();
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const s = await login(email.trim(), pw);
      setOk(s.name);
      window.setTimeout(() => { setOpen(false); setOk(null); setPw(""); }, 1400);
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

      {open && createPortal(
        <div className="modal-bg" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="modal" ref={box} role="dialog" aria-modal="true" aria-labelledby="login-title">
            <button type="button" className="x" aria-label="Tutup" onClick={() => setOpen(false)}>✕</button>
            {ok ? (
              <div className="ok"><h3 id="login-title">Halo, {ok}.</h3><p className="sub">Login berhasil. Selamat menjelajah.</p></div>
            ) : (
              <form onSubmit={submit}>
                <h3 id="login-title">Masuk</h3>
                <p className="sub">Login dengan akun kamu untuk disapa langsung di website ini.</p>
                <div className="field"><label htmlFor="em">Email</label><input id="em" ref={first} type="text" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                <div className="field"><label htmlFor="pw">Password</label>
                  <div className="pw"><input id="pw" type={show ? "text" : "password"} autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} required />
                    <button type="button" onClick={() => setShow(!show)}>{show ? "Sembunyikan" : "Lihat"}</button></div>
                </div>
                {err && <p className="err" role="alert">{err}</p>}
                <button type="submit" className="btn solid go-login" disabled={busy}>{busy ? "Memproses…" : "Masuk"}</button>
              </form>
            )}
          </div>
        </div>, document.body)}
    </>
  );
}
