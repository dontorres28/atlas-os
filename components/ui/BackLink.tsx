import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Small, consistent back-link for every detail page. Anchors Apple's
 * wayfinding rule: every screen should answer "how do I get out?".
 * One-tap return to the parent list, always top-left of the content.
 */
export function BackLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="press-scale inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-bone-500 transition-colors duration-200 ease-out hover:text-white"
    >
      <ArrowLeft size={11} strokeWidth={1.4} />
      {label}
    </Link>
  );
}
