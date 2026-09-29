/**
 * services/forms.ts
 * ==================
 * Service layer for Google Forms API endpoints.
 */

import apiClient from "./api";
import type { FormSchema } from "@/types";

export interface FormCreateResponse {
  formId: string;
  title: string;
  editUrl: string;
  responderUrl: string;
  createdTime: string;
}

export interface FormDetailsResponse {
  formId: string;
  title: string;
  description: string;
  revisionId: string;
  responderUrl: string;
  editUrl: string;
}

export interface PromptGenerateResponse {
  formId: string;
  title: string;
  description: string;
  editUrl: string;
  responderUrl: string;
  createdTime: string;
  questionCount: number;
  form_schema: FormSchema;
}

export const formsService = {
  /**
   * Create a new blank Google Form via backend API.
   */
  async createBlankForm(title: string = "Untitled Form"): Promise<FormCreateResponse> {
    const response = await apiClient.post<FormCreateResponse>("/v1/forms/create", { title });
    return response.data;
  },

  /**
   * AI-powered: Generate a full Google Form from a natural language prompt.
   * Calls LLM → creates Google Form with all questions via batchUpdate.
   */
  async promptGenerateForm(
    prompt: string,
    currentFormId?: string,
    currentSchema?: FormSchema
  ): Promise<PromptGenerateResponse> {
    const response = await apiClient.post<PromptGenerateResponse>("/v1/forms/prompt-generate", {
      prompt,
      current_form_id: currentFormId,
      current_schema: currentSchema,
    });
    return response.data;
  },

  /**
   * Fetch metadata for an existing Google Form by ID.
   */
  async getFormDetails(formId: string): Promise<FormDetailsResponse> {
    const response = await apiClient.get<FormDetailsResponse>(`/v1/forms/${formId}`);
    return response.data;
  },
};

export default formsService;
