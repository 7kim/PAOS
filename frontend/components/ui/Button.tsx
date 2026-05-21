import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-mono text-[16px] font-medium leading-[16px] tracking-[0.08px] uppercase transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-black text-white hover:bg-neutral-900 active:bg-neutral-800",
        gradient:
          "text-white bg-gradient-to-r from-brand-orange via-brand-magenta to-brand-periwinkle hover:opacity-90 active:opacity-80",
        secondary:
          "bg-brand-mint text-ink hover:bg-brand-mint/80 active:bg-brand-mint/70",
        "secondary-white":
          "bg-canvas text-ink hover:bg-canvas/90 active:bg-canvas/80",
        ghost:
          "bg-surface-dark-soft text-on-dark hover:bg-surface-dark-soft/80 active:bg-surface-dark-soft/70",
        outline:
          "bg-canvas text-ink border border-hairline/20 hover:bg-neutral-50 active:bg-neutral-100",
      },
      size: {
        sm: "px-4 py-1.5 text-[14px]",
        md: "px-6 py-1.5",
        lg: "px-8 py-2 text-[18px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
