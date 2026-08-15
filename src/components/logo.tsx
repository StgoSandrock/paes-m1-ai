import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className="logo" aria-label="Savia M1, inicio"><span className="logo-mark">S</span>{!compact && <span>Savia <b>M1</b></span>}</Link>;
}
