import type { ReactNode } from "react";
import Reveal from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

const SectionHeading = ({ eyebrow, title, description, action }: SectionHeadingProps) => (
  <Reveal className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
    <div className="max-w-2xl">
      <div className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
        <span className="h-px w-8 bg-primary/60" />
        {eyebrow}
      </div>
      <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </Reveal>
);

export default SectionHeading;
