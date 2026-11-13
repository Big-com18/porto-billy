import Mark from "@/components/ui/Mark";
import Login from "@/components/Login";
import { NAV } from "@/lib/data";

export default function Navbar() {
  return (
    <nav aria-label="Navigasi utama">
      <a className="brand" href="#top"><Mark />Billy A.</a>
      <div>
        {NAV.map(([l, h]) => <a key={h} href={h}>{l}</a>)}
        <Login />
      </div>
    </nav>
  );
}
