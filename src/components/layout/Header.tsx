import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { site } from "@/content/site";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-[var(--header-h)] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex min-h-11 shrink-0 items-center">
          <Logo height={34} priority />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <NavLinks variant="bar" />
        </nav>

        <Link href={site.primaryCta.href} className="btn btn-primary hidden lg:inline-flex">
          {site.primaryCta.label}
        </Link>

        <MobileNav />
      </div>
    </header>
  );
}
