export const EMAIL = "billyandreas441@gmail.com";

export const LINKS: [string, string][] = [
  ["GitHub", "https://github.com/Big-com18"],
  ["LinkedIn", "https://www.linkedin.com/in/bill-and"],
  ["Instagram", "https://www.instagram.com/bill.and18/"],
];

export const NAV: [string, string][] = [
  ["Tentang", "#about"],
  ["Framework", "#frameworks"],
  ["Skill", "#skills"],
  ["Project", "#projects"],
  ["Jalan", "#journey"],
  ["Showcase", "#repos"],
  ["Kontak", "#contact"],
];

export const ABOUT =
  "Mahasiswa Ilmu Komputer yang suka bikin web yang rapi, cepat, dan enak dipakai. Dari front-end, database, sampai quality assurance, saya belajar dengan langsung praktik.";

export const STICKERS = ["Jakarta, ID", "CS · Universitas Cakrawala", "Front-End + QA"];

/** [label, logo file name in /public/logos] */
export const SKILLS: Record<string, [string, string][]> = {
  Bahasa: [["JavaScript", "javascript"], ["TypeScript", "typescript"], ["HTML & CSS", "html5"], ["Python", "python"], ["C++", "cplusplus"], ["Dart", "dart"]],
  Framework: [["Next.js", "nextjs"], ["React", "react"], ["Vue", "vue"], ["Angular", "angular"], [".NET", "dotnet"], ["Flutter", "flutter"], ["Tailwind", "tailwindcss"]],
  Tools: [["Supabase", "supabase"], ["GitHub", "github"], ["Figma", "figma"], ["Jira", "jira"], ["Android Studio", "androidstudio"], ["SQL Server", "sqlserver"]],
};

export const STACK: [string, string][] = [
  ["React", "react"], ["Next.js", "nextjs"], ["Vue", "vue"], ["Angular", "angular"], [".NET", "dotnet"], ["Dart", "dart"], ["Flutter", "flutter"],
  ["React Native", "react"], ["Python", "python"], ["JavaScript", "javascript"], ["TypeScript", "typescript"], ["C++", "cplusplus"], ["Tailwind CSS", "tailwindcss"], ["Supabase", "supabase"],
];

export type Project = { n: string; d: string; t: string; u?: string };
export const PROJECTS: Project[] = [
  { n: "KasbonKu", d: "Manajemen kasbon & arus kas. Backend dan desain schema database.", t: "Back-End · Database", u: "https://sistem-kasbon.vercel.app/" },
  { n: "Backlogify", d: "Aplikasi Streamlit untuk analisis backlog dan keputusan pembelian.", t: "Python · Data" },
  { n: "Booking Film", d: "Aplikasi pemesanan tiket film.", t: "App" },
  { n: "Translink", d: "Desain aplikasi transportasi.", t: "UI Design" },
  { n: "Web Petani Apel", d: "Website untuk petani apel.", t: "Web" },
  { n: "Bot WA", d: "Sistem bot WhatsApp terintegrasi.", t: "Automation" },
];

export const STEPS: [string, string, string][] = [
  ["2021 – 2024", "SMAN 24 Jakarta", "IPA. Aktif di organisasi Rohkris."],
  ["2024 – 2027", "Universitas Cakrawala", "Ilmu Komputer (S.Kom). Algoritma, struktur data, pengembangan perangkat lunak."],
  ["Jan – Apr 2026", "Front-End Developer & QA", "PT Benih Inovasi Teknologi. Bangun UI dan uji kualitas produk."],
];

export const REPOS: [string, string][] = [
  ["porto_billy", "TypeScript"], ["pos_toko", "TypeScript"], ["sistem-kasbon", "CSS"], ["UAS_Sdlc_K2_Lost-Found", "JavaScript"], ["backend-api", "Backend"],
  ["mahreen_indonesia", "TypeScript"], ["tugas_sesi5_sdlf", "Python"], ["game", "JavaScript"], ["BMI-project", "CSS"], ["rancar-mobile", "Mobile"],
];

export const LANG_COLOR: Record<string, string> = {
  TypeScript: "#7aa7e0", JavaScript: "#f2d675", CSS: "#b79be0", Python: "#8fc2e8", Backend: "#9bd6b5", Mobile: "#f4a79a",
};

/** Framework unggulan: n = nama, l = file logo di /public/logos, note = deskripsi singkat, c = warna panel */
export const FRAMEWORKS: { n: string; l: string; note: string; c: string; tags: string[] }[] = [
  { n: "Next.js", l: "nextjs", note: "Framework utama. Website ini dibangun dengan Next.js dan GSAP.", c: "#ecdfb5", tags: ["App Router", "SSR", "Routing"] },
  { n: "React", l: "react", note: "Komponen, state, dan antarmuka yang interaktif.", c: "#b9d0e8", tags: ["Hooks", "Komponen", "State"] },
  { n: "Vue", l: "vue", note: "UI reaktif yang ringan dan mudah dibaca.", c: "#bcd8c6", tags: ["Reaktif", "Composition API"] },
  { n: "Angular", l: "angular", note: "Struktur rapi untuk aplikasi berskala besar.", c: "#e8c3d2", tags: ["TypeScript", "Modular"] },
  { n: ".NET", l: "dotnet", note: "Aplikasi dan layanan di ekosistem Microsoft.", c: "#c5bdeb", tags: ["C#", "Web API"] },
  { n: "Flutter", l: "flutter", note: "Aplikasi mobile lintas platform dengan Dart.", c: "#eccdb6", tags: ["Dart", "Lintas platform"] },
  { n: "Tailwind", l: "tailwindcss", note: "Styling cepat dan konsisten langsung di markup.", c: "#bcd8c6", tags: ["Utility-first", "Responsif"] },
];

export const GH_USER = "Big-com18";

/**
 * Showcase. 4 project unggulan tampil paling atas, sisanya repo lain.
 * Preview tiap item dicari berurutan: URL live (iframe) -> gambar lokal -> kartu GitHub -> placeholder.
 *  - live  : isi URL deploy supaya tampil sebagai website sungguhan.
 *  - image : path gambar di folder /public (default otomatis: /showcase/<repo>.png, .jpg, atau .webp).
 */
export type Showcase = { name: string; repo: string; lang: string; desc: string; featured?: boolean; live?: string; image?: string };

const FEATURED: Showcase[] = [
  { name: "Portofolio", repo: "porto_billy", lang: "TypeScript", desc: "Website portofolio ini: Next.js, TypeScript, dan GSAP.", featured: true, live: "" /* isi URL Vercel portofolio kamu */ },
  { name: "KasbonKu", repo: "sistem-kasbon", lang: "CSS", desc: "Manajemen kasbon dan arus kas, lengkap dengan backend dan schema database.", featured: true, live: "https://sistem-kasbon.vercel.app/" },
  { name: "Backlogify", repo: "Backlogify", lang: "Python", desc: "Aplikasi Streamlit untuk analisis backlog dan keputusan pembelian.", featured: true, live: "" /* isi URL Streamlit */ },
  { name: "Game", repo: "game", lang: "JavaScript", desc: "Game kecil berbasis JavaScript.", featured: true, live: "" /* isi URL game */ },
];

const OTHER_DESC: Record<string, string> = {
  "backend-api": "Layanan back-end / REST API.",
  "rancar-mobile": "Aplikasi mobile.",
  "BMI-project": "Kalkulator BMI sederhana.",
};

export const SHOWCASE: Showcase[] = [
  ...FEATURED,
  ...REPOS.filter(([n]) => !FEATURED.some((f) => f.repo === n)).map(([n, l]) => ({ name: n, repo: n, lang: l, desc: OTHER_DESC[n] ?? `Repo ${l} di GitHub.` })),
];
