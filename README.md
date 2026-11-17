# Portofolio Billy Andreas

Website portofolio pribadi bertema luar angkasa, dibangun dengan **Next.js (App Router)**, **TypeScript**, dan **GSAP**. Berisi profil, skill, project, perjalanan, showcase repo GitHub, dan kontak, lengkap dengan animasi scroll yang halus.

🔗 **Live:** [porto-billy.vercel.app](https://porto-billy.vercel.app/)

## Fitur

- Animasi scroll dan transisi antar section dengan GSAP + ScrollTrigger
- Smooth scrolling memakai Lenis
- Loader intro, progress bar berbentuk pesawat, dan latar bintang
- Navigasi antar section dengan scroll halus
- Showcase project: preview live (iframe), gambar lokal, atau kartu GitHub
- Login lewat API route (proxy ke API eksternal), nama pengguna tampil di navbar
- Semua konten diatur dari satu file: `lib/data.ts`

## Tech Stack

| Kebutuhan | Teknologi |
| --- | --- |
| Framework | Next.js (App Router), React |
| Bahasa | TypeScript |
| Animasi | GSAP, ScrollTrigger, Draggable, `@gsap/react` |
| Smooth scroll | Lenis |
| Font | Instrument Serif dan Manrope (`next/font/google`) |
| Styling | CSS biasa (`globals.css`, `orbit.css`) |
| Deploy | Vercel |

## Struktur Folder

```
app/
├── api/login/route.ts   # Proxy login ke API eksternal
├── globals.css          # Style utama
├── orbit.css            # Style tambahan (orbit/navigasi)
├── layout.tsx           # Root layout, font, metadata
└── page.tsx             # Susunan semua section
components/
├── sections/            # Hero, About, Photo, Frameworks, Skills,
│                        # Projects, Journey, Repos, Contact, Marquee
├── space/               # Ilustrasi & latar (Stars, Ship, Art, sky)
├── ui/                  # Komponen kecil (Chars, Icons, Logo, Mark)
├── Login.tsx            # Tombol masuk + modal login
├── Navbar.tsx
├── Loader.tsx
├── Progress.tsx
├── Clock.tsx
├── Orbit.tsx            # Setup Lenis + ScrollTrigger
└── Transitions.tsx
lib/
├── data.ts              # Semua konten (profil, skill, project, repo)
├── auth.ts              # Helper sesi login (localStorage)
└── gsap.ts              # Registrasi plugin GSAP + helper scroll
```

## Cara Menjalankan

### 1. Prasyarat

- Node.js 18.18 atau lebih baru
- npm (atau pnpm / yarn)

### 2. Install dependency

```bash
npm install
```

### 3. Jalankan mode development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### 4. Build untuk production

```bash
npm run build
npm start
```

## Environment Variables (opsional)

Buat file `.env.local` di root project. Semua variabel bersifat opsional dan punya nilai default.

| Variabel | Default | Fungsi |
| --- | --- | --- |
| `API_URL` | `https://dummyjson.com` | Base URL API login |
| `LOGIN_PATH` | `/user/login` | Path endpoint login |
| `LOGIN_FIELD` | `username` | Nama field identifier di body request |
| `LOGIN_PASSWORD_FIELD` | `password` | Nama field password di body request |

Contoh `.env.local`:

```env
API_URL=https://dummyjson.com
LOGIN_PATH=/user/login
LOGIN_FIELD=username
LOGIN_PASSWORD_FIELD=password
```

> Catatan: file `.env.example` tidak dibaca oleh Next.js. Pakai `.env.local` untuk konfigurasi sungguhan.

## Login

Login berjalan lewat `app/api/login/route.ts`: browser memanggil `/api/login`, lalu server meneruskan ke API eksternal. Dengan cara ini tidak ada masalah CORS dan URL API tidak tersebar di kode klien.

Default memakai [DummyJSON](https://dummyjson.com/docs/auth). Untuk mencoba, gunakan akun contoh dari dokumentasinya (misalnya `emilys` / `emilyspass`).

Token dan nama pengguna disimpan di `localStorage` dengan key `billy:session`.

## Mengubah Konten

Hampir semua teks diatur di `lib/data.ts`:

- `EMAIL`, `LINKS`: kontak dan sosial media
- `ABOUT`, `STICKERS`: bagian tentang saya
- `SKILLS`, `STACK`, `FRAMEWORKS`: skill dan teknologi
- `PROJECTS`, `STEPS`: project dan perjalanan pendidikan/karier
- `REPOS`, `SHOWCASE`, `GH_USER`: daftar repo GitHub dan showcase

### Aset di folder `public/`

Folder `public/` tidak ikut di dalam `app.zip`, jadi pastikan folder ini ada di project:

- `public/logos/<nama>.svg|png`: logo skill dan framework (nama file sesuai nilai di `lib/data.ts`, misalnya `nextjs`, `react`, `flutter`)
- `public/showcase/<repo>.png|jpg|webp`: gambar preview showcase (opsional)

Urutan preview showcase: URL `live` (iframe), lalu gambar lokal, lalu kartu GitHub, lalu placeholder.

## Deploy

Cara termudah lewat [Vercel](https://vercel.com):

1. Push project ke GitHub
2. Import repo di Vercel
3. (Opsional) isi environment variables di pengaturan project
4. Deploy

## Kontak

- Email: billyandreas441@gmail.com
- GitHub: [Big-com18](https://github.com/Big-com18)
- LinkedIn: [bill-and](https://www.linkedin.com/in/bill-and)
- Instagram: [@bill.and18](https://www.instagram.com/bill.and18/)

---

Dibuat oleh Billy Andreas. *Dream On.*