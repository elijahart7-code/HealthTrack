import { cn } from "../../lib/utils";

export function Input({ className, ...props }) {
  return <input className={cn("ht-input", className)} {...props} />;
}

export function Textarea({ className, rows = 3, ...props }) {
  return <textarea rows={rows} className={cn("ht-input", className)} {...props} />;
}

export function Select({ className, children, ...props }) {
  return (
    <select className={cn("ht-input", className)} {...props}>
      {children}
    </select>
  );
}

/**
 * One labelled form control -- mirrors the original Blade <x-field>
 * component's markup (label wrapping a .ht-input, optional required mark
 * and error message) so forms look identical without every page hand
 * re-building the same label/input pairing.
 */
export function Field({ label, required, error, children, className }) {
  return (
    <label className={cn("ht-field", className)}>
      <span>
        {label}
        {required && <span style={{ color: "var(--color-danger)" }}>*</span>}
      </span>
      {children}
      {error && <span className="ht-error">{error}</span>}
    </label>
  );
}
