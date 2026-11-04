import { FeatureCard } from "@/components/ui/FeatureCard";
import { IconBadge, type IconName, type Tone } from "@/components/ui/Icon";

/** Cytogent's operating principles (BRIEF §3). Replaces any vendor comparison matrix. */
const principles: { title: string; body: string; icon: IconName; tone: Tone }[] = [
  {
    title: "Bounded experimental batches",
    body: "Each round is a small, feasible batch chosen for what it can teach, not an open-ended screen.",
    icon: "wells",
    tone: "signal",
  },
  {
    title: "Visible uncertainty and abstention",
    body: "Every ranking carries an uncertainty estimate. Where the evidence is too thin, the system should say so rather than guess.",
    icon: "uncertainty",
    tone: "shift",
  },
  {
    title: "Planned reproducibility",
    body: "A signal counts once it has been seen again: out of batch, or with an orthogonal readout.",
    icon: "repeat",
    tone: "actin",
  },
  {
    title: "Project-specific data governance",
    body: "Each sponsor's data stays in its own project, under the terms agreed for that project.",
    icon: "shieldLock",
    tone: "dose",
  },
];

/** `compact`: one column of rows with small icon tiles (home, beside the ranked batch). */
export function DesignPrinciples({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <ol className="border-t border-line">
        {principles.map((p) => (
          <li key={p.title} className="grid grid-cols-[auto_1fr] gap-5 border-b border-line py-6">
            <IconBadge name={p.icon} tone={p.tone} size="sm" />
            <div>
              <h3 className="text-lg font-normal">{p.title}</h3>
              <p className="mt-1 text-muted">{p.body}</p>
            </div>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ol className="grid gap-5 sm:grid-cols-2">
      {principles.map((p, i) => (
        <FeatureCard key={p.title} icon={p.icon} tone={p.tone} kicker={String(i + 1).padStart(2, "0")} title={p.title}>
          <p className="mt-2 text-muted">{p.body}</p>
        </FeatureCard>
      ))}
    </ol>
  );
}
