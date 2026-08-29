import { cn } from "../../lib/utils";

/** Maps to .ht-panel -- the shared surface used for every content block. */
export function Card({ children, className, title, icon: Icon, aside }) {
  return (
    <div className={cn("ht-panel", className)}>
      {title && (
        <h2>
          {Icon && (
            <span className="ht-section-icon" aria-hidden="true">
              <Icon size={16} strokeWidth={1.8} />
            </span>
          )}
          {title}
          {aside && <span className="ml-auto flex items-center gap-2 text-xs font-normal">{aside}</span>}
        </h2>
      )}
      {children}
    </div>
  );
}

/** Plain surface with no built-in padding/header, for custom layouts. */
export function CardBody({ children, className }) {
  return <div className={cn("ht-card p-4", className)}>{children}</div>;
}

/** .ht-metric -- one number in the metrics row on a dashboard. */
export function StatCard({ label, value, tone }) {
  const toneColor = tone === "brand" ? "var(--color-brand)" : tone === "warm" ? "var(--color-brand-warm)" : undefined;
  return (
    <div className="ht-metric">
      <h3>{label}</h3>
      <p style={toneColor ? { color: toneColor } : undefined}>{value}</p>
    </div>
  );
}
