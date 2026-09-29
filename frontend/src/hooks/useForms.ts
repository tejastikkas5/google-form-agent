/**
 * hooks/useForms.ts
 * =================
 * React hook to manage Google Forms creation, AI generation, listing, and state.
 */

import { useState, useCallback } from "react";
import formsService, {
  type FormCreateResponse,
  type FormDetailsResponse,
  type PromptGenerateResponse,
} from "@services/forms";
import type { FormSchema } from "@types/index";

export interface UseFormsReturn {
  forms: PromptGenerateResponse[];
  isLoading: boolean;
  error: string | null;
  promptGenerateForm: (
    prompt: string,
    currentFormId?: string,
    currentSchema?: FormSchema
  ) => Promise<PromptGenerateResponse>;
  createBlankForm: (title?: string) => Promise<FormCreateResponse | null>;
  fetchFormDetails: (formId: string) => Promise<FormDetailsResponse | null>;
  clearError: () => void;
}

export function useForms(): UseFormsReturn {
  const [forms, setForms] = useState<PromptGenerateResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const promptGenerateForm = useCallback(
    async (
      prompt: string,
      currentFormId?: string,
      currentSchema?: FormSchema
    ): Promise<PromptGenerateResponse> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await formsService.promptGenerateForm(prompt, currentFormId, currentSchema);
        setForms((prev) => [result, ...prev]);
        return result;
      } catch (err: unknown) {
        const message =
          err && typeof err === "object" && "message" in err
            ? String((err as { message: unknown }).message)
            : "Failed to generate form. Please try again.";
        setError(message);
        throw new Error(message); // re-throw so caller can catch the real message
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const createBlankForm = useCallback(
    async (title: string = "Untitled Form"): Promise<FormCreateResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const created = await formsService.createBlankForm(title);
        // Wrap in PromptGenerateResponse shape for the list
        const wrapped: PromptGenerateResponse = {
          ...created,
          description: "",
          questionCount: 0,
          form_schema: { title: created.title, questions: [] },
        };
        setForms((prev) => [wrapped, ...prev]);
        return created;
      } catch (err: unknown) {
        const message =
          err && typeof err === "object" && "message" in err
            ? String((err as { message: unknown }).message)
            : "Failed to create Google Form. Ensure you have authorized Google Forms permissions.";
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchFormDetails = useCallback(
    async (formId: string): Promise<FormDetailsResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const details = await formsService.getFormDetails(formId);
        return details;
      } catch (err: unknown) {
        const message =
          err && typeof err === "object" && "message" in err
            ? String((err as { message: unknown }).message)
            : `Failed to retrieve Google Form '${formId}'.`;
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    forms,
    isLoading,
    error,
    promptGenerateForm,
    createBlankForm,
    fetchFormDetails,
    clearError,
  };
}

export default useForms;
