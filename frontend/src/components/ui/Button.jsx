import { cn } from "../../lib/utils";

const VARIANT_CLASSES = {
  primary: "ht-button",
  muted: "ht-button ht-button-muted",
  danger: "ht-button ht-button-danger",
};

export function Button({ variant = "primary", className, children, ...props }) {
  return (
    <button className={cn(VARIANT_CLASSES[variant], className)} {...props}>
      {children}
    </button>
  );
}
