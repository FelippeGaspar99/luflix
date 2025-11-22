import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface BadgeProps {
  children: ReactNode;
  color?: "default" | "success" | "warning";
  className?: string;
}

const styles = {
  default: "bg-slate-800/70 text-slate-200",
  success: "bg-emerald-500/20 text-emerald-300",
  warning: "bg-amber-500/20 text-amber-200",
};

export function Badge({ children, color = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        styles[color],
        className,
      )}
    >
      {children}
    </span>
  );
}
