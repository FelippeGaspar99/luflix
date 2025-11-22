import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm text-slate-100 focus:border-rose-500 focus:outline-none",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});
