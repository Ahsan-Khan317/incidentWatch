import { TrendingDown, TrendingUp } from "lucide-react";

const toneClasses: Record<string, string> = {
  neutral: "border-border bg-surface-1",
  success: "border-success-border bg-success-soft",
  warning: "border-warning-border bg-warning-soft",
  danger: "border-danger-border bg-danger-soft",
};

export default function OverviewMetricCard({
  title,
  value,
  meta,
  icon: Icon,
  tone = "neutral",
}: any) {
  const accentClassName =
    tone === "success"
      ? "text-success"
      : tone === "warning"
        ? "text-warning"
        : tone === "danger"
          ? "text-danger"
          : "text-body";

  const TrendIcon = tone === "success" ? TrendingDown : TrendingUp;

  return (
    <article
      className={`rounded-none border p-4 ${toneClasses[tone] || toneClasses.neutral}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[0.6875rem] uppercase tracking-[0.15em] text-body/45">
          {title}
        </p>
        <div className="flex items-center gap-2 text-primary">
          {Icon ? <Icon size={16} /> : null}
          <TrendIcon size={13} className={accentClassName} />
        </div>
      </div>

      <p className="text-3xl font-light tracking-tight text-heading">{value}</p>
      <p className={`mt-1 text-[0.6875rem] ${accentClassName}`}>{meta}</p>
    </article>
  );
}
