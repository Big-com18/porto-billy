"use client";
import { useEffect, useState } from "react";

const gmt = (d: Date) => {
  const m = -d.getTimezoneOffset();
  const h = Math.trunc(m / 60), min = Math.abs(m % 60);
  return `GMT${m < 0 ? "-" : "+"}${Math.abs(h)}${min ? ":" + String(min).padStart(2, "0") : ""}`;
};

/** Jam live sesuai zona waktu perangkat pengunjung, lengkap dengan GMT. Melayang di bawah tengah layar. */
export default function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  const [zone, setZone] = useState("");

  useEffect(() => {
    setZone(Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, " "));
    setNow(new Date());
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  if (!now) return null;
  const time = now.toLocaleTimeString("en-GB", { hour12: false });
  return (
    <div className="clockbar" role="timer" aria-label={`Waktu setempat ${time} ${gmt(now)}`}>
      <i className="live" aria-hidden="true" />
      <b>{time}</b>
      <span>{gmt(now)}</span>
      {zone && <small>{zone}</small>}
    </div>
  );
}
