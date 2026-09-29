import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@lib/utils";

// ==============================
// Card variants
// ==============================

const cardVariants = cva(
  ["relative overflow-hidden rounded-2xl transition-all duration-300"],
  {
    variants: {
      variant: {
        default: [
          "bg-[rgb(22_22_40/0.6)] backdrop-blur-xl",
          "border border-white/[0.08]",
        ],
        glass: [
          "bg-white/[0.04] backdrop-blur-2xl",
          "border border-white/[0.08]",
        ],
        solid: [
          "bg-[#0f0f1c]",
          "border border-white/[0.06]",
        ],
        gradient: [
          "bg-gradient-to-br from-violet-500/10 via-transparent to-blue-500/10",
          "border border-white/[0.08]",
        ],
      },
      hover: {
        none: "",
        lift: [
          "hover:-translate-y-1 hover:shadow-[0_8px_32px_rgb(0_0_0/0.4)]",
          "hover:border-violet-500/30",
        ],
        glow: [
          "hover:shadow-[0_0_30px_rgb(139_92_246/0.2)]",
          "hover:border-violet-500/30",
        ],
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: "none",
      padding: "md",
    },
  },
);

// ==============================
// Card components
// ==============================

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, hover, padding }), className)}
        {...props}
      />
    );
  },
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1.5", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold text-white leading-tight", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-slate-400 leading-relaxed", className)}
      {...props}
    />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-4", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mt-4 flex items-center pt-4 border-t border-white/[0.06]", className)}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
