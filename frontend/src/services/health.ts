/**
 * services/health.ts
 * ==================
 * Health & project-info service.
 *
 * Responsibilities:
 *  - Call GET /  → returns ProjectInfo
 *  - Call GET /api/v1/health → returns HealthStatus
 *
 * Rules:
 *  - No state management here — that belongs in hooks/useHealth.ts
 *  - No UI logic here — components never import this directly
 *  - Always use apiClient — never instantiate axios independently
 */

import type { HealthStatus, ProjectInfo } from "@/types";
import apiClient from "./api";

// ------------------------------------------------------------------
// Health service
// ------------------------------------------------------------------

const HealthService = {
  /**
   * GET /api/v1/health
   *
   * Returns the backend health status.
   * Throws an ApiError if the request fails or the backend is down.
   */
  async checkHealth(): Promise<HealthStatus> {
    // Note: the health endpoint is under /api/v1, but VITE_API_URL
    // already points to http://localhost:8000/api, so we call /v1/health
    const response = await apiClient.get<HealthStatus>("/v1/health");
    return response.data;
  },

  /**
   * GET / (root endpoint, not under /api)
   *
   * Returns project name and version from the backend root.
   * Uses a direct path override since VITE_API_URL includes /api.
   */
  async getProjectInfo(): Promise<ProjectInfo> {
    // We need to hit the root "/" not "/api/", so we use baseURL override
    const baseWithoutApi = (import.meta.env.VITE_API_URL as string).replace(
      /\/api\/?$/,
      "",
    );
    const response = await apiClient.get<ProjectInfo>("/", {
      baseURL: baseWithoutApi,
    });
    return response.data;
  },
} as const;

export default HealthService;
