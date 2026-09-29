/**
 * hooks/useHealth.ts
 * ==================
 * Custom React hook that manages backend health state.
 *
 * Responsibilities:
 *  - Fetch both health status and project info on mount
 *  - Expose loading / error / result state
 *  - Provide a refresh() function for manual re-checks
 *
 * Rules:
 *  - Business logic lives in HealthService, not here
 *  - No JSX / UI here — this is pure state management
 *  - Errors are normalised into human-readable strings
 */

import { useCallback, useEffect, useState } from "react";
import { HealthService } from "@services";
import type { ProjectInfo } from "@/types";

// ------------------------------------------------------------------
// Return shape
// ------------------------------------------------------------------

interface UseHealthReturn {
  /** True while the first fetch or a refresh is in-flight */
  loading: boolean;
  /** Human-readable error message, or null when healthy */
  error: string | null;
  /** Whether the backend responded with status "healthy" */
  healthy: boolean;
  /** Project name from the root endpoint */
  project: string | null;
  /** Application version from the root endpoint */
  version: string | null;
  /** Backend base URL (from env, shown in the UI) */
  backendUrl: string;
  /** Trigger a fresh health check manually */
  refresh: () => void;
}

// ------------------------------------------------------------------
// Hook
// ------------------------------------------------------------------

export function useHealth(): UseHealthReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [healthy, setHealthy] = useState<boolean>(false);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);

  // Strip /api suffix for display — users see the server URL, not the API path
  const backendUrl = (import.meta.env.VITE_API_URL as string).replace(
    /\/api\/?$/,
    "",
  );

  const fetchHealth = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Run both requests concurrently for speed
      const [healthResult, infoResult] = await Promise.all([
        HealthService.checkHealth(),
        HealthService.getProjectInfo(),
      ]);

      setHealthy(healthResult.status === "healthy");
      setProjectInfo(infoResult);
    } catch {
      // Never expose raw technical errors to the UI
      setHealthy(false);
      setError("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    void fetchHealth();
  }, [fetchHealth]);

  return {
    loading,
    error,
    healthy,
    project: projectInfo?.project ?? null,
    version: projectInfo?.version ?? null,
    backendUrl,
    refresh: () => { void fetchHealth(); },
  };
}
