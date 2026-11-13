"use client";
import { useRef } from "react";
import Mark from "@/components/ui/Mark";
import Login from "@/components/Login";
import { NAV } from "@/lib/data";
import { gsap } from "@/lib/gsap";

export default function Navbar() {
  const box = useRef<HTMLDivElement>(null);
  const hl = useRef<HTMLSpanElement>(null);

  // sorotan pil meluncur mengikuti link yang di-hover
  const over = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const a = e.currentTarget;
    gsap.to(hl.current, { x: a.offsetLeft, width: a.offsetWidth, opacity: 1, duration: 0.45, ease: "power3.out", overwrite: "auto" });
  };
  const out = () => gsap.to(hl.current, { opacity: 0, duration: 0.3, overwrite: "auto" });

  return (
    <nav aria-label="Navigasi utama">
      <a className="brand" href="#top"><Mark />Billy A.</a>
      <div ref={box} onMouseLeave={out}>
        <span className="nav-hl" ref={hl} aria-hidden="true" />
        {NAV.map(([l, h], i) => <a key={h} href={h} onMouseEnter={i < NAV.length - 1 ? over : out}>{l}</a>)}
        <Login />
      </div>
    </nav>
  );
}
