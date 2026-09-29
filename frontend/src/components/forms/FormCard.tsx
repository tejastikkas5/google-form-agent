/**
 * components/forms/FormCard.tsx
 * ==============================
 * Displays metadata for a created Google Form, including ID, Created Time,
 * and direct links to Open in Google Forms (Edit) and Open Public Form (Responder).
 */

import React from "react";
import { ExternalLink, Eye, Edit3, Calendar, FileText } from "lucide-react";
import type { FormCreateResponse } from "@services/forms";

interface FormCardProps {
  form: FormCreateResponse;
}

export const FormCard: React.FC<FormCardProps> = ({ form }) => {
  const formattedDate = new Date(form.createdTime).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="bg-[#121225]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl hover:border-violet-500/30 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">{form.title}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Created {formattedDate}</span>
            </div>
          </div>
        </div>

        <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
          Google Forms REST API
        </span>
      </div>

      {/* Form ID Section */}
      <div className="mt-5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
        <span className="text-xs text-slate-400">Form ID</span>
        <code className="text-xs font-mono font-semibold text-slate-200">{form.formId}</code>
      </div>

      {/* Direct Action Links */}
      <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center gap-3">
        <a
          href={form.editUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 rounded-xl transition-colors shadow-lg"
        >
          <Edit3 className="w-4 h-4" />
          Open in Google Forms
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>

        <a
          href={form.responderUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
        >
          <Eye className="w-4 h-4 text-emerald-400" />
          Open Public Form
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>
      </div>
    </div>
  );
};

export default FormCard;
