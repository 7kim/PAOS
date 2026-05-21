import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "dark" | "tinted";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[4px] p-6",
          variant === "default" &&
            "bg-canvas text-ink border border-hairline/10",
          variant === "dark" &&
            "bg-canvas-dark text-on-dark border border-surface-dark-soft",
          variant === "tinted" && "bg-brand-mint text-ink",
          className,
        )}
        {...props}
      />
    );
  },
);
Card.displayName = "Card";

export { Card };
