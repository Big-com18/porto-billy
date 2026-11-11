export default function Mark() {
  return (
    <svg className="mark" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c3b5f5" />
          <stop offset="1" stopColor="#f4b3a6" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="15" fill="url(#mg)" />
      <text x="24" y="32" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="22" fill="#2a2740">BA</text>
    </svg>
  );
}
