import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-mono text-[11px] font-medium uppercase tracking-[0.55px] text-body"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            "w-full bg-canvas text-ink border border-hairline/20 rounded-[4px] px-3 py-2.5",
            "font-sans text-[16px] leading-[20.8px]",
            "placeholder:text-body/50",
            "focus:outline-none focus:ring-2 focus:ring-brand-periwinkle/40 focus:border-brand-periwinkle",
            "transition-all duration-200",
            error && "border-red-400 focus:ring-red-400/40 focus:border-red-400",
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-[14px] text-red-400 font-sans">{error}</p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
