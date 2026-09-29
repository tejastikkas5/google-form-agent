import { cn } from "../../lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const sizeMap = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

/**
 * Animated spinner loader with optional label text.
 */
export function Loader({ size = "md", className, text }: LoaderProps) {
  return (
    <div
      role="status"
      aria-label={text ?? "Loading..."}
      className={cn("flex flex-col items-center justify-center gap-3", className)}
    >
      <div
        className={cn(
          "rounded-full",
          "border-violet-500/30",
          "border-t-violet-500",
          "animate-spin",
          sizeMap[size],
        )}
      />
      {text && (
        <p className="text-sm text-slate-400 animate-pulse">{text}</p>
      )}
    </div>
  );
}

/**
 * Full-page centered loader overlay.
 */
export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#09091a]/80 backdrop-blur-sm z-50">
      <Loader size="lg" text={text} />
    </div>
  );
}
