/**
 * Editorial posts (BRIEF §9). Topics are proposed in docs/EDITORIAL_PLAN_PROPOSAL.md and need owner approval;
 * no drafts exist yet. `publishedPosts()` is the only accessor that /insights, the sitemap, RSS, llms.txt
 * and article JSON-LD may use, so a draft can never leak into them.
 */
import type { Faq } from "@/content/faq";

export type Cluster = "resistance-biology" | "models-and-methods" | "experiment-selection" | "governance" | "plain-language";

interface PostBase {
  id: string; // B01 … B16
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  cluster: Cluster;
  audience: string[];
  summary: string;
  answerBlock: string;
  keyTakeaways: string[];
  plainWordsCallout: string;
  boundaryNote: string;
  visualType: string;
  faqs: Faq[];
  references: string[]; // ids from src/content/references.ts
  relatedRoutes: string[];
  ctaLabel: string;
  ctaHref: string;
  /** Only when the content actually changed after publication. Never the build date. */
  dateModified?: string;
}

/** A draft has no publication date. */
export interface DraftPost extends PostBase {
  published: false;
  datePublished?: never;
}

/** Published only after scientific/editorial review and owner approval. Do not backdate. */
export interface PublishedPost extends PostBase {
  published: true;
  datePublished: string; // ISO date, set by hand at publication
}

export type Post = DraftPost | PublishedPost;

export const posts: Post[] = [];

export function publishedPosts(): PublishedPost[] {
  return posts.filter((p): p is PublishedPost => p.published);
}
