"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { site } from "@/content/site";
import { NavLinks } from "./NavLinks";

/**
 * Full-screen mobile menu on a native modal <dialog>: the browser handles the focus trap, Escape,
 * inert background and focus return to the menu button. The CTA is pinned to the bottom.
 */
export function MobileNav() {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = () => ref.current?.close();

  // Close if the route changes underneath (back/forward while open).
  useEffect(() => {
    ref.current?.close();
  }, [pathname]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => {
          ref.current?.showModal();
          setOpen(true);
        }}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-line-strong px-4 text-sm font-medium"
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 5h14M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        Menu
      </button>

      <dialog
        id="mobile-menu"
        ref={ref}
        aria-label="Menu"
        onClose={() => setOpen(false)}
        className="m-0 h-[100svh] max-h-none w-full max-w-none bg-canvas p-0 text-text opacity-100 transition-opacity duration-200 backdrop:bg-canvas starting:open:opacity-0"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-line px-4">
            <Link href="/" onClick={close} className="inline-flex min-h-11 items-center">
              <Logo height={30} />
            </Link>
            <button
              type="button"
              onClick={close}
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-line-strong px-4 text-sm font-medium"
            >
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              Close
            </button>
          </div>

          <nav aria-label="Main" className="flex-1 overflow-y-auto px-4 py-4">
            <NavLinks variant="drawer" onNavigate={close} />
          </nav>

          <div className="shrink-0 border-t border-line px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Link href={site.primaryCta.href} onClick={close} className="btn btn-primary w-full">
              {site.primaryCta.label}
            </Link>
          </div>
        </div>
      </dialog>
    </div>
  );
}
