import { useMemo, useSyncExternalStore } from "react";

export type Session = { token: string; name: string; identifier: string };

const KEY = "billy:session";
const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  window.addEventListener("auth:change", cb);
  return () => { window.removeEventListener("storage", cb); window.removeEventListener("auth:change", cb); };
};
const snapshot = () => { try { return localStorage.getItem(KEY); } catch { return null; } };

/** Sesi login saat ini (null kalau belum login). */
export function useSession(): Session | null {
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  return useMemo(() => { try { return raw ? (JSON.parse(raw) as Session) : null; } catch { return null; } }, [raw]);
}

export async function login(identifier: string, password: string): Promise<Session> {
  const res = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier, password }) });
  const data = (await res.json().catch(() => ({}))) as Partial<Session> & { message?: string };
  if (!res.ok || !data.token) throw new Error(data.message || "Login gagal. Periksa email dan password.");
  const session: Session = { token: data.token, name: data.name || identifier.split("@")[0], identifier };
  localStorage.setItem(KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("auth:change"));
  return session;
}

export function logout() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("auth:change"));
}
