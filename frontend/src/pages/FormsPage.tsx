/**
 * pages/FormsPage.tsx
 * ===================
 * AI-powered Google Form generator.
 * User types a natural language prompt → AI designs the form → Google Form is created instantly.
 */

import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ShieldAlert,
  Send,
  ExternalLink,
  Edit3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Bot,
  User,
  FileText,
  Clock,
} from "lucide-react";
import { Container } from "@components/common";
import useAuth from "@hooks/useAuth";
import useForms from "@hooks/useForms";
import type { PromptGenerateResponse } from "@services/forms";
import type { QuestionSchema } from "../types";

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────

const EXAMPLE_PROMPTS = [
  "Create a SPACE Club event registration form with name, email, phone, branch, year, and T-shirt size",
  "Generate a customer satisfaction survey with rating scale, feedback, and recommendation questions",
  "Make a job application form with personal details, skills, experience, and upload portfolio link",
  "Build a college feedback form for students to rate faculty, infrastructure, and curriculum",
];

interface QuestionBadgeProps {
  type: string;
}

function QuestionBadge({ type }: QuestionBadgeProps) {
  const map: Record<string, { label: string; color: string }> = {
    short_answer: { label: "Short Answer", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
    paragraph: { label: "Paragraph", color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
    multiple_choice: { label: "Multiple Choice", color: "bg-violet-500/20 text-violet-300 border-violet-500/30" },
    checkboxes: { label: "Checkboxes", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
    dropdown: { label: "Dropdown", color: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30" },
    date: { label: "Date", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    time: { label: "Time", color: "bg-teal-500/20 text-teal-300 border-teal-500/30" },
    email: { label: "Email", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
    number: { label: "Number", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
    linear_scale: { label: "Rating Scale", color: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
  };
  const info = map[type] ?? { label: type, color: "bg-slate-500/20 text-slate-300 border-slate-500/30" };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${info.color}`}>
      {info.label}
    </span>
  );
}

interface FormResultCardProps {
  form: PromptGenerateResponse;
}

function FormResultCard({ form }: FormResultCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#0d0d1f] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border-b border-white/10 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-violet-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate">{form.title}</h3>
              {form.description && (
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{form.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-semibold">Created</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-violet-400" />
            {form.questionCount} question{form.questionCount !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(form.createdTime).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 p-4 border-b border-white/[0.07]">
        <a
          href={form.editUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition-all"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit in Google Forms
        </a>
        <a
          href={form.responderUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold rounded-xl transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Live Form
        </a>
      </div>

      {/* Expandable Question List */}
      {form.form_schema?.questions && form.form_schema.questions.length > 0 && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-4 py-3 text-xs text-slate-400 hover:text-slate-300 hover:bg-white/[0.03] transition-all"
          >
            <span>View generated questions ({form.form_schema.questions.length})</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {expanded && (
            <div className="px-4 pb-4 space-y-2">
              {form.form_schema.questions.map((q: QuestionSchema, i: number) => (
                <div
                  key={q.id}
                  className="flex items-start gap-3 p-3 bg-white/[0.03] border border-white/[0.07] rounded-xl"
                >
                  <span className="text-xs font-bold text-slate-500 w-5 flex-shrink-0 pt-0.5">
                    {i + 1}.
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs text-slate-200 font-medium">{q.title}</p>
                      {q.required && (
                        <span className="text-[10px] text-rose-400 font-bold">*required</span>
                      )}
                    </div>
                    <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                      <QuestionBadge type={q.type} />
                      {q.choices && q.choices.length > 0 && (
                        <span className="text-[10px] text-slate-500">
                          {q.choices.map((c) => c.value).slice(0, 3).join(" · ")}
                          {q.choices.length > 3 ? ` +${q.choices.length - 3} more` : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Chat message types
// ──────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  form?: PromptGenerateResponse;
  isError?: boolean;
}

// ──────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────

export const FormsPage: React.FC = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { isLoading, promptGenerateForm, clearError } = useForms();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hi! I'm your AI Form Generator. Just describe the Google Form you want — including the title, fields, and question types — and I'll create it instantly in your Google account!",
    },
  ]);
  const [activeForm, setActiveForm] = useState<PromptGenerateResponse | null>(null);
  const [prompt, setPrompt] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [prompt]);

  const handleSend = async () => {
    const trimmed = prompt.trim();
    if (!trimmed || isLoading) return;

    clearError();
    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `assistant-${Date.now()}`;

    // Add user message + pending assistant message
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user", content: trimmed },
      { id: assistantMsgId, role: "assistant", content: activeForm ? "⏳ Updating your form..." : "⏳ Generating your form..." },
    ]);
    setPrompt("");

    try {
      const result = await promptGenerateForm(
        trimmed,
        activeForm?.formId,
        activeForm?.form_schema
      );
      setActiveForm(result);
      const isUpdate = Boolean(activeForm && result.formId === activeForm.formId);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id !== assistantMsgId
            ? msg
            : {
                ...msg,
                content: isUpdate
                  ? `✅ Updated "${result.title}"! It now has ${result.questionCount} question${result.questionCount !== 1 ? "s" : ""}.`
                  : `✅ Done! I created "${result.title}" with ${result.questionCount} question${result.questionCount !== 1 ? "s" : ""} in your Google account.`,
                form: result,
              }
        )
      );
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id !== assistantMsgId
            ? msg
            : { ...msg, content: `❌ Error: ${errMessage}`, isError: true }
        )
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    textareaRef.current?.focus();
  };

  // ── Auth Gates ──

  if (isAuthLoading) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
          <p className="text-sm text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <Container size="sm" className="text-center">
          <div className="bg-[#0e0e1e]/90 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 mb-6 border border-amber-500/20">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-2">Sign In Required</h1>
            <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
              Sign in with Google to start generating AI-powered Google Forms.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 rounded-xl transition-all shadow-lg"
            >
              Sign In with Google
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  // ── Main Chat UI ──

  return (
    <div className="pt-16 min-h-screen flex flex-col">
      {/* Page Header */}
      <div className="border-b border-white/[0.08] bg-[#080814]/80 backdrop-blur-md px-4 py-3">
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white">AI Form Generator</h1>
                <p className="text-[11px] text-slate-400">Describe a form → AI creates it instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/[0.07]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {user.email}
            </div>
          </div>
        </Container>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <Container className="py-6 space-y-5 max-w-3xl">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.role === "user"
                    ? "bg-violet-600/30 border border-violet-500/30"
                    : "bg-indigo-600/30 border border-indigo-500/30"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4 text-violet-300" />
                ) : (
                  <Bot className="w-4 h-4 text-indigo-300" />
                )}
              </div>

              {/* Bubble */}
              <div className={`flex-1 max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-2`}>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-violet-600/20 border border-violet-500/20 text-white rounded-tr-sm"
                      : msg.isError
                      ? "bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-tl-sm"
                      : "bg-white/[0.05] border border-white/[0.08] text-slate-200 rounded-tl-sm"
                  }`}
                >
                  {msg.content}
                </div>
                {/* Attach form result card */}
                {msg.form && (
                  <div className="w-full">
                    <FormResultCard form={msg.form} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-indigo-300" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.05] border border-white/[0.08] flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
                <span className="text-xs text-slate-400">AI is generating your form...</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </Container>
      </div>

      {/* Example Prompts (shown only when chat is fresh) */}
      {messages.length <= 1 && (
        <div className="border-t border-white/[0.06] bg-[#080814]/60 backdrop-blur-md px-4 py-3">
          <Container className="max-w-3xl">
            <p className="text-[11px] text-slate-500 mb-2 font-medium uppercase tracking-wider">
              Try an example
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXAMPLE_PROMPTS.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => handleExampleClick(ex)}
                  className="text-left text-xs text-slate-400 hover:text-slate-200 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] px-3 py-2.5 rounded-xl transition-all line-clamp-2"
                >
                  {ex}
                </button>
              ))}
            </div>
          </Container>
        </div>
      )}

      {/* Input Bar */}
      <div className="border-t border-white/[0.08] bg-[#080814]/90 backdrop-blur-md px-4 py-4">
        <Container className="max-w-3xl">
          <div className="flex items-end gap-3 bg-white/[0.04] border border-white/[0.12] rounded-2xl px-4 py-3 focus-within:border-violet-500/50 transition-all">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the Google Form you want to create... (Press Enter to send)"
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 resize-none focus:outline-none leading-relaxed disabled:opacity-50"
              style={{ maxHeight: "200px" }}
            />
            <button
              onClick={handleSend}
              disabled={!prompt.trim() || isLoading}
              className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-[10px] text-slate-600 text-center mt-2">
            Enter ↵ to send · Shift+Enter for new line · Forms are created in your Google account
          </p>
        </Container>
      </div>
    </div>
  );
};

export default FormsPage;
