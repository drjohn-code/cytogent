"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/content/navigation";

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({ variant, onNavigate }: { variant: "bar" | "drawer"; onNavigate?: () => void }) {
  const pathname = usePathname();
  const bar = variant === "bar";
  return (
    <ul className={bar ? "flex items-center gap-1" : "flex flex-col"}>
      {mainNav.map((item) => {
        const current = isCurrent(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              onClick={onNavigate}
              className={
                bar
                  ? `inline-flex min-h-11 items-center rounded-full px-3 text-[0.95rem] transition-[color] duration-150 hover:text-text ${
                      current ? "text-text" : "text-muted"
                    } aria-[current=page]:underline aria-[current=page]:decoration-signal aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8`
                  : `flex min-h-14 items-center border-b border-line text-2xl font-medium ${
                      current ? "text-signal" : "text-text"
                    }`
              }
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
