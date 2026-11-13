export default function Mark() {
  return (
    <svg className="mark" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c5bdeb" />
          <stop offset="1" stopColor="#e8c3d2" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="24" fill="url(#mg)" />
      <text x="24" y="31" textAnchor="middle" fontFamily="Georgia, serif" fontSize="21" fill="#09090b">BA</text>
    </svg>
  );
}
