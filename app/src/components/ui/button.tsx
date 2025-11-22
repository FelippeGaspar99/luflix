import { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const baseStyles =
  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-rose-500 text-white hover:bg-rose-400 focus-visible:outline-rose-500 shadow-lg shadow-rose-900/40",
  secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700 focus-visible:outline-slate-600",
  ghost: "bg-transparent text-slate-100 hover:bg-slate-800 focus-visible:outline-slate-700",
  danger: "bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  asChild?: boolean;
}

export function Button({ className, variant = "primary", asChild, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn(baseStyles, variants[variant], className)} {...props} />;
}
