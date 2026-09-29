import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@lib/utils";

// ==============================
// Button variants
// ==============================

const buttonVariants = cva(
  // Base styles
  [
    "inline-flex items-center justify-center gap-2",
    "font-semibold whitespace-nowrap",
    "rounded-xl",
    "transition-all duration-200",
    "cursor-pointer select-none",
    "disabled:opacity-50 disabled:pointer-events-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09091a]",
  ],
  {
    variants: {
      variant: {
        // Primary gradient button
        primary: [
          "bg-gradient-to-r from-violet-500 to-blue-500",
          "text-white",
          "shadow-[0_0_20px_rgb(139_92_246/0.3)]",
          "hover:shadow-[0_0_32px_rgb(139_92_246/0.5)]",
          "hover:scale-[1.02]",
          "active:scale-[0.98]",
        ],
        // Ghost / outline style
        secondary: [
          "border border-white/10",
          "bg-white/5",
          "text-white",
          "hover:bg-white/10 hover:border-violet-500/40",
          "active:scale-[0.98]",
        ],
        // Minimal ghost
        ghost: [
          "text-slate-400",
          "hover:text-white hover:bg-white/5",
          "active:scale-[0.98]",
        ],
        // Outline with brand glow
        outline: [
          "border border-violet-500/50",
          "text-violet-400",
          "bg-transparent",
          "hover:bg-violet-500/10 hover:border-violet-500",
          "active:scale-[0.98]",
        ],
        // Destructive
        destructive: [
          "bg-red-500/20 border border-red-500/40",
          "text-red-400",
          "hover:bg-red-500/30",
          "active:scale-[0.98]",
        ],
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

// ==============================
// Button component
// ==============================

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
