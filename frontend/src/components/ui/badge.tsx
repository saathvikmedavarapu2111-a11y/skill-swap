import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "cyan" | "purple" | "rose";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    secondary: "bg-slate-800 text-slate-300 border-slate-700",
    outline: "border-slate-700 text-slate-300 bg-transparent",
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    purple: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    rose: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
