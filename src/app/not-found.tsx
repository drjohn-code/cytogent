import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Section";

// 404 via the not-found convention (not an indexable /404 route). Next adds robots noindex itself. Kept out of the sitemap.
export const metadata: Metadata = {
  title: { absolute: "Page not found | Cytogent" },
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[70svh] flex-col justify-center py-20">
      <p className="eyebrow">404 · Not found</p>
      <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">We can’t find that page.</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">
        The address may be mistyped, or the page may have moved when this site was rebuilt.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Go to the home page
        </Link>
        <Link href="/platform" className="btn btn-ghost">
          How the loop works
        </Link>
        <Link href="/glossary" className="btn btn-ghost">
          Glossary
        </Link>
      </div>
    </Container>
  );
}
