import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "gradient" | "danger" | "glow";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none rounded-xl";

    const variants = {
      default: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25",
      secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60",
      outline: "border border-slate-700 hover:border-slate-500 hover:bg-slate-800/60 text-slate-200",
      ghost: "hover:bg-slate-800/60 text-slate-300 hover:text-white",
      gradient: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 text-white shadow-lg shadow-indigo-500/20 font-semibold",
      danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20",
      glow: "bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.7)] hover:bg-indigo-500 border border-indigo-400/30",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
