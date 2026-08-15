import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "busy" | "offline";
}

export function Avatar({
  src,
  alt = "User avatar",
  fallback = "U",
  size = "md",
  status,
  className,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(!src);

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
    xl: "h-20 w-20 text-xl font-bold",
  };

  const statusSizes = {
    sm: "h-2 w-2 ring-1",
    md: "h-2.5 w-2.5 ring-2",
    lg: "h-3.5 w-3.5 ring-2",
    xl: "h-4 w-4 ring-2",
  };

  const statusColors = {
    online: "bg-emerald-500",
    busy: "bg-amber-500",
    offline: "bg-slate-500",
  };

  return (
    <div className={cn("relative inline-block select-none", className)} {...props}>
      <div
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full border border-slate-700/60 bg-slate-800",
          sizes[size]
        )}
      >
        {!imageError && src ? (
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            className="aspect-square h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-indigo-900 to-purple-800 font-semibold text-indigo-100">
            {fallback}
          </div>
        )}
      </div>

      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-slate-950",
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
}
