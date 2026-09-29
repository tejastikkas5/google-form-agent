/**
 * components/forms/CreateFormButton.tsx
 * =====================================
 * Action button to trigger blank Google Form creation via Google Forms REST API.
 */

import React from "react";
import { Plus, Loader2 } from "lucide-react";

interface CreateFormButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export const CreateFormButton: React.FC<CreateFormButtonProps> = ({
  onClick,
  isLoading = false,
  className = "",
  size = "md",
  text = "Create Blank Form",
}) => {
  const sizeClasses = {
    sm: "px-3.5 py-2 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        relative inline-flex items-center justify-center font-bold rounded-xl
        bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500
        text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]
        active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-white" />
      ) : (
        <Plus className="w-4 h-4 text-white stroke-[2.5]" />
      )}
      <span>{isLoading ? "Creating Google Form..." : text}</span>
    </button>
  );
};

export default CreateFormButton;
