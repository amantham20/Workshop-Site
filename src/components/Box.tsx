import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Only the variants actually used in the codebase
export type BoxVariant =
  | "concept" // Concept explanation boxes with left border
  | "alert-warning" // Yellow warning alerts
  | "alert-info" // Blue informational alerts
  | "alert-tip"; // Indigo tip/suggestion alerts

interface BoxProps {
  variant: BoxVariant;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  // Concept variant specific props
  code?: ReactNode;
  uses?: ReactNode;
}

const variantStyles: Record<
  BoxVariant,
  {
    container: string;
    title?: string;
    text?: string;
    hasLeftBorder?: boolean;
  }
> = {
  concept: {
    container: "bg-[var(--muted)] border-[var(--border)]",
    title: "text-lg font-bold text-[var(--foreground)]",
    text: "text-[var(--foreground)] text-sm",
    hasLeftBorder: true,
  },
  "alert-warning": {
    container:
      "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    text: "text-yellow-800 dark:text-yellow-300",
  },
  "alert-info": {
    container:
      "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    text: "text-blue-800 dark:text-blue-200",
  },
  "alert-tip": {
    container:
      "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800",
    text: "text-indigo-800 dark:text-indigo-300",
  },
};

export default function Box({
  variant,
  title,
  subtitle,
  children,
  icon,
  className,
  code,
  uses,
}: BoxProps) {
  const styles = variantStyles[variant];
  const isAlert = variant.startsWith("alert-");
  const isConcept = variant === "concept";

  // Alert rendering (warning, info, tip)
  if (isAlert) {
    return (
      <div className={cn("border rounded-lg p-4", styles.container, className)}>
        <div className="flex items-start gap-3">
          {icon && <div className={cn("mt-0.5", styles.text)}>{icon}</div>}
          <div className={cn("space-y-1 text-sm", styles.text)}>
            {title && <p className="font-semibold">{title}</p>}
            <div>{children}</div>
          </div>
        </div>
      </div>
    );
  }

  // Concept rendering
  if (isConcept) {
    return (
      <div
        className={cn(
          "flex flex-col gap-3 rounded-lg p-6",
          styles.hasLeftBorder && "border-l-4",
          styles.container,
          className
        )}
      >
        {title && <h4 className={styles.title}>{title}</h4>}
        {subtitle && (
          <p className="text-[var(--foreground)] text-sm font-semibold">
            {subtitle}
          </p>
        )}
        <div className={cn(styles.text, "flex-1")}>{children}</div>
        {code && (
          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded text-xs">
            {code}
          </div>
        )}
        {uses && (
          <div className="text-[var(--foreground)] text-sm">
            <strong>When to use:</strong>
            <br />
            {uses}
          </div>
        )}
      </div>
    );
  }

  // This should never be reached, but TypeScript needs it
  return null;
}
