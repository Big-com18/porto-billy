"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { sky } from "./sky";

const TINT = ["#c5bdeb", "#e8c3d2", "#b9d0e8", "#bcd8c6", "#ecdfb5"];
type Star = { x: number; y: number; z: number; r: number; t: number; c: string };

/** Bintang 3 lapis kedalaman. Bergeser mengikuti scroll, memanjang jadi garis "warp" saat scroll cepat, plus bintang jatuh. */
export default function Stars() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!, ctx = cv.getContext("2d")!;
    let W = 0, H = 0;
    const small = matchMedia("(max-width: 900px)").matches;
    const stars: Star[] = Array.from({ length: small ? 130 : 300 }, () => ({
      x: Math.random(), y: Math.random(), z: 0.15 + Math.random() * 0.85, r: Math.random() * 1.1 + 0.3, t: Math.random() * 6.28,
      c: Math.random() < 0.22 ? TINT[(Math.random() * TINT.length) | 0] : "#ffffff",
    }));
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + "px"; cv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    addEventListener("resize", size);

    const shoot = { x: 0, y: 0, vx: 0, vy: 0, life: 0 };
    let next = 3;

    const tick = (t: number, dt: number) => {
      sky.v *= 0.92;
      sky.sv += (sky.v - sky.sv) * 0.12;
      const warp = Math.min(Math.abs(sky.sv) / 2200, 1);
      const dir = sky.sv < 0 ? -1 : 1;
      ctx.clearRect(0, 0, W, H);

      for (const s of stars) {
        const px = ((((s.x - sky.p * s.z * 1.6) % 1) + 1) % 1) * W + sky.mx * 24 * s.z;
        const py = s.y * H + sky.my * 14 * s.z;
        ctx.globalAlpha = Math.min(0.25 + (0.5 + 0.5 * Math.sin(t * 1.3 + s.t)) * 0.6 * s.z + 0.15, 1);
        if (warp > 0.06) {
          ctx.strokeStyle = s.c; ctx.lineWidth = s.r * s.z + 0.4;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + dir * warp * 140 * s.z, py); ctx.stroke();
        } else {
          ctx.fillStyle = s.c; ctx.beginPath(); ctx.arc(px, py, s.r * s.z + 0.2, 0, 6.283); ctx.fill();
        }
      }

      // bintang jatuh sesekali
      next -= dt / 1000;
      if (next <= 0 && shoot.life <= 0) {
        shoot.x = W * (0.4 + Math.random() * 0.6); shoot.y = Math.random() * H * 0.4;
        shoot.vx = -(500 + Math.random() * 300); shoot.vy = 260 + Math.random() * 160; shoot.life = 1;
        next = 5 + Math.random() * 6;
      }
      if (shoot.life > 0) {
        shoot.x += (shoot.vx * dt) / 1000; shoot.y += (shoot.vy * dt) / 1000; shoot.life -= dt / 900;
        const g = ctx.createLinearGradient(shoot.x, shoot.y, shoot.x - shoot.vx * 0.18, shoot.y - shoot.vy * 0.18);
        g.addColorStop(0, "rgba(255,255,255,.9)"); g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalAlpha = Math.max(shoot.life, 0); ctx.strokeStyle = g; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(shoot.x, shoot.y); ctx.lineTo(shoot.x - shoot.vx * 0.18, shoot.y - shoot.vy * 0.18); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); removeEventListener("resize", size); };
  }, []);

  return <canvas ref={ref} className="sp-stars" aria-hidden="true" />;
}
