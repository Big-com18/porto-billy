import { NextResponse } from "next/server";

/**
 * Proxy login: browser -> /api/login -> API dari soal (lihat dokumentasi Postman).
 * Lewat server supaya tidak kena CORS dan URL API tidak tersebar di kode klien.
 * Atur lewat .env.local (lihat .env.example).
 */
// Default = API dari soal (Login API Intern: POST https://dummyjson.com/user/login, body username + password).
// Bisa ditimpa lewat .env.local (bukan .env.example, file itu tidak dibaca Next.js).
const BASE = process.env.API_URL ?? "https://dummyjson.com";
const rawPath = process.env.LOGIN_PATH ?? "/user/login";
const PATH = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
const ID_FIELD = process.env.LOGIN_FIELD ?? "username";
const PW_FIELD = process.env.LOGIN_PASSWORD_FIELD ?? "password";

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null;

/** Cari nilai string di objek respons, di level atas maupun di data / user / data.user. */
function dig(res: unknown, keys: string[]): string | undefined {
  if (!isObj(res)) return undefined;
  const levels: unknown[] = [res, res.data, res.user, isObj(res.data) ? res.data.user : undefined, res.result];
  for (const l of levels) {
    if (!isObj(l)) continue;
    for (const k of keys) if (typeof l[k] === "string" && l[k]) return l[k] as string;
  }
  return undefined;
}

export async function POST(req: Request) {
  const { identifier, password } = (await req.json().catch(() => ({}))) as { identifier?: string; password?: string };
  if (!identifier || !password) return NextResponse.json({ message: "Username dan password wajib diisi." }, { status: 400 });

  let upstream: Response;
  try {
    upstream = await fetch(new URL(PATH, BASE).toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ [ID_FIELD]: identifier, [PW_FIELD]: password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ message: "Tidak bisa terhubung ke server API." }, { status: 502 });
  }

  const text = await upstream.text();
  let data: unknown;
  try { data = JSON.parse(text); } catch { data = { message: text.slice(0, 160) }; }

  if (!upstream.ok) return NextResponse.json({ message: dig(data, ["message", "error", "msg"]) ?? "Username atau password salah." }, { status: upstream.status });

  const token = dig(data, ["token", "accessToken", "access_token", "jwt"]);
  if (!token) return NextResponse.json({ message: "Login berhasil, tapi token tidak ditemukan di respons API." }, { status: 502 });
  const full = [dig(data, ["firstName", "first_name"]), dig(data, ["lastName", "last_name"])].filter(Boolean).join(" ");
  return NextResponse.json({ token, name: full || dig(data, ["name", "fullName", "full_name", "username"]) });
}