/**
 * services/index.ts
 * =================
 * Central barrel export for all service modules.
 *
 * Components and hooks import from "@services" — never from individual
 * service files. This keeps import paths stable when services move.
 *
 * Usage:
 *   import { HealthService } from "@services";
 *   import { apiClient }     from "@services";
 */

export { default as apiClient } from "./api";
export { default as HealthService } from "./health";
