// ==============================
// Global TypeScript type definitions
// ==============================

/**
 * Common navigation route definition
 */
export interface NavRoute {
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
}

/**
 * Feature card for landing page
 */
export interface Feature {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  badge?: string;
}

/**
 * How It Works step
 */
export interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
}

/**
 * Generic loading/error state for async operations
 */
export interface AsyncState<T = unknown> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

// ==============================
// Backend API types (Phase 0.3+)
// ==============================

/**
 * Response from GET / (root endpoint)
 * Matches FastAPI: { "status": "running", "project": "...", "version": "..." }
 */
export interface ProjectInfo {
  status: string;
  project: string;
  version: string;
}

/**
 * Response from GET /api/v1/health
 * Matches FastAPI: { "status": "healthy" }
 */
export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
}

/**
 * Normalised API error — built from Axios error responses.
 */
export interface ApiError {
  code: string;
  message: string;
  detail?: unknown;
}

// ==============================
// Form Schema types (AI-generated)
// ==============================

export type QuestionType =
  | "short_answer"
  | "paragraph"
  | "multiple_choice"
  | "checkboxes"
  | "dropdown"
  | "date"
  | "time"
  | "email"
  | "number"
  | "linear_scale";

export interface ChoiceSchema {
  value: string;
  is_other?: boolean;
}

export interface QuestionSchema {
  id: string;
  title: string;
  type: QuestionType;
  required?: boolean;
  placeholder?: string | null;
  help_text?: string | null;
  choices?: ChoiceSchema[] | null;
  low_label?: string | null;
  high_label?: string | null;
  min_scale?: number | null;
  max_scale?: number | null;
}

export interface FormSettings {
  collect_email?: boolean;
  allow_response_editing?: boolean;
  limit_to_one_response?: boolean;
  shuffle_question_order?: boolean;
  show_progress_bar?: boolean;
  confirmation_message?: string | null;
}

export interface FormSchema {
  title: string;
  description?: string | null;
  settings?: FormSettings;
  questions: QuestionSchema[];
}
