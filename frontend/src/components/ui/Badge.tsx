import { cn } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium text-xs transition-colors",
  {
    variants: {
      variant: {
        default: "bg-white/10 text-white border border-white/10",
        purple: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
        blue: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
        green: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
        gradient: [
          "border border-transparent",
          "bg-gradient-to-r from-violet-500 to-blue-500",
          "text-white",
        ],
      },
      size: {
        sm: "px-2 py-0.5 text-[11px]",
        md: "px-3 py-1",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
