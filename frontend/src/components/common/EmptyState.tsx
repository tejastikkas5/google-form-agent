import { cn } from "../../lib/utils";
import { Button } from "@components/ui";
import type { LucideIcon } from "lucide-react";
import { FileX2 } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * EmptyState – shown when a list or data set is empty.
 */
export function EmptyState({
  icon: Icon = FileX2,
  title = "Nothing here yet",
  description = "Get started by creating something new.",
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-20 px-8 text-center",
        "rounded-2xl border border-dashed border-white/10",
        "bg-white/[0.02]",
        className,
      )}
    >
      {/* Icon container */}
      <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-violet-500/10 border border-violet-500/20">
        <Icon className="h-8 w-8 text-violet-400" strokeWidth={1.5} />
      </div>

      {/* Text */}
      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>

      {/* Optional CTA */}
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
