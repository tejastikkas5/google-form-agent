/**
 * components/common/BackendStatus.tsx
 * ====================================
 * Displays real-time backend connectivity status in the Hero section.
 *
 * States:
 *  Loading  → animated spinner (Loader component)
 *  Error    → EmptyState with Retry button
 *  Online   → green pill with version + URL info
 *  Offline  → red pill (should not happen in error branch, but defensive)
 *
 * Rules:
 *  - This component only renders — zero business logic
 *  - All data comes from the useHealth hook via props
 *  - No direct service or API calls here
 */

import { RefreshCw, ServerCrash } from "lucide-react";
import { cn } from "@lib/utils";
import { Loader } from "@components/common/Loader";
import { EmptyState } from "@components/common/EmptyState";
import { Button } from "@components/ui";
import { useHealth } from "@hooks/useHealth";

// ------------------------------------------------------------------
// Inner display components
// ------------------------------------------------------------------

interface StatusPillProps {
  healthy: boolean;
  project: string | null;
  version: string | null;
  backendUrl: string;
  onRefresh: () => void;
}

function StatusPill({
  healthy,
  project,
  version,
  backendUrl,
  onRefresh,
}: StatusPillProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
      {/* Online / Offline indicator */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border",
          healthy
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            : "bg-red-500/10 border-red-500/30 text-red-400",
        )}
      >
        {/* Animated dot */}
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              healthy ? "bg-emerald-400" : "bg-red-400",
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              healthy ? "bg-emerald-400" : "bg-red-400",
            )}
          />
        </span>
        {healthy ? "Backend Online" : "Backend Offline"}
      </div>

      {/* Version badge */}
      {version && (
        <span className="text-xs text-slate-500 font-mono">
          {project ?? "Prompt2Form"}{" "}
          <span className="text-violet-400">v{version}</span>
        </span>
      )}

      {/* Backend URL */}
      <span className="text-xs text-slate-600 font-mono hidden sm:inline">
        {backendUrl}
      </span>

      {/* Refresh button */}
      <button
        id="backend-status-refresh"
        aria-label="Refresh backend status"
        onClick={onRefresh}
        className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
      >
        <RefreshCw className="h-3 w-3" />
      </button>
    </div>
  );
}

// ------------------------------------------------------------------
// Main export
// ------------------------------------------------------------------

/**
 * BackendStatus
 * Wires useHealth and renders the appropriate UI state.
 * Drop this anywhere — it is fully self-contained.
 */
export function BackendStatus() {
  const { loading, error, healthy, project, version, backendUrl, refresh } =
    useHealth();

  // ---- Loading state ----
  if (loading) {
    return (
      <div className="flex items-center justify-center py-2">
        <Loader size="sm" text="Checking backend..." />
      </div>
    );
  }

  // ---- Error state (network failure / backend down) ----
  if (error) {
    return (
      <div className="max-w-sm mx-auto">
        <EmptyState
          icon={ServerCrash}
          title="Unable to connect to backend."
          description="The API server may be offline. Make sure the FastAPI server is running."
          actionLabel="Retry"
          onAction={refresh}
          className="py-6 border-red-500/20 bg-red-500/[0.03]"
        />
        {/* Show retry as a lighter option too */}
        <div className="flex justify-center mt-3">
          <Button variant="ghost" size="sm" onClick={refresh}>
            <RefreshCw className="h-3.5 w-3.5" />
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  // ---- Success state ----
  return (
    <StatusPill
      healthy={healthy}
      project={project}
      version={version}
      backendUrl={backendUrl}
      onRefresh={refresh}
    />
  );
}
