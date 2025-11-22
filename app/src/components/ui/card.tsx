import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-3xl bg-slate-900/60 p-6 shadow-2xl shadow-black/40", className)}>
      {children}
    </div>
  );
}
