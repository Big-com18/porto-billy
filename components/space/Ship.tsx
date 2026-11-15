import { useId } from "react";

/** Roket pastel menghadap kanan. Nyala api di belakangnya membesar mengikuti kecepatan scroll (--fl). */
export default function Ship() {
  const id = useId();
  return (
    <span className="ship" aria-hidden="true">
      <i className="flame" />
      <svg viewBox="0 0 52 26" width="44" height="22">
        <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c5bdeb" /><stop offset="1" stopColor="#e8c3d2" /></linearGradient></defs>
        <path d="M9 7 L2 2 L6 13 L2 24 L9 19 Z" fill="#b9d0e8" stroke="#09090b" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M8 13 C8 8 18 5 31 6 C42 7 50 11 50 13 C50 15 42 19 31 20 C18 21 8 18 8 13 Z" fill={`url(#${id})`} stroke="#09090b" strokeWidth="1.4" />
        <circle cx="34" cy="13" r="3.4" fill="#09090b" /><circle cx="35" cy="12" r="1" fill="#fff" />
      </svg>
    </span>
  );
}
