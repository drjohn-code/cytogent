import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { credentials, isPublic } from "@/content/credentials";
import { footerNav } from "@/content/navigation";
import { site } from "@/content/site";

/**
 * Credentials (email, LinkedIn, affiliation, accelerators, NVIDIA Inception) render only when verified (BRIEF §1.1, §5).
 */
export function Footer() {
  const year = new Date().getFullYear();
  const { email, linkedin, affiliation, accelerators, nvidiaInception, copyright } = credentials;

  return (
    <footer className="mt-24 border-t border-line bg-elevated">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]">
          <div className="max-w-md">
            <Link href="/" className="inline-flex min-h-11 items-center">
              <Logo height={32} />
            </Link>
            <p className="mt-4 text-muted">{site.category}</p>

            {(isPublic(email) || isPublic(linkedin)) && (
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {isPublic(email) && (
                  <li>
                    <a href={`mailto:${email.value}`} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                      {email.value}
                    </a>
                  </li>
                )}
                {isPublic(linkedin) && (
                  <li>
                    <a href={linkedin.value} rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                      LinkedIn
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerNav.map((group) => (
              <div key={group.heading}>
                <h2 className="eyebrow text-muted">{group.heading}</h2>
                <ul className="mt-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="inline-flex min-h-11 min-w-11 items-center text-[0.95rem] text-text/90 underline-offset-4 hover:underline">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-6 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p>
              © {year} {isPublic(copyright) ? copyright.value : "Cytogent"}
            </p>
            {isPublic(affiliation) && <p>{affiliation.value}</p>}
            {isPublic(accelerators) && <p>{accelerators.value}</p>}
          </div>
          {isPublic(nvidiaInception) && (
            /* eslint-disable-next-line @next/next/no-img-element -- small static SVG badge */
            <img
              src="/brand/partners/nvidia-inception-on-dark.svg"
              alt={nvidiaInception.value}
              width={185}
              height={80}
              className="h-16 w-auto"
            />
          )}
        </div>
      </div>
    </footer>
  );
}
