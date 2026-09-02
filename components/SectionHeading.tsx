export default function SectionHeading({
  eyebrow,
  title,
  description,
  center = true
}: {
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className="eyebrow shadow-sm">
        <span className="pulse-dot" />
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
        {title}
      </h2>
      {description && <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">{description}</p>}
    </div>
  );
}
