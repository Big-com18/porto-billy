import Image from "next/image";

export default function Logo({ n, size = 28 }: { n: string; size?: number }) {
  return <Image className="logo" src={`/logos/${n}.svg`} alt="" width={size} height={size} unoptimized />;
}
