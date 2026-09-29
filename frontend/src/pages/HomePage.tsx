import { useRef } from "react";
import {
  Zap,
  Sparkles,
  Brain,
  ListChecks,
  LayoutGrid,
  FileSpreadsheet,
  Share2,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { Button, Card, Badge } from "@components/ui";
import { Container, BackendStatus } from "@components/common";

// ============================================================
//  DATA
// ============================================================

const FEATURES = [
  {
    id: "ai-generation",
    icon: Brain,
    title: "AI-Powered Generation",
    description:
      "Describe your form in plain English. Our AI instantly understands context, infers question types, and structures sections intelligently.",
    badge: "Core",
    gradient: "from-violet-500/20 to-purple-500/10",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/15 border-violet-500/20",
  },
  {
    id: "smart-questions",
    icon: ListChecks,
    title: "Smart Question Types",
    description:
      "Automatically chooses the right field — short text, dropdowns, MCQs, scales, file uploads — based on context. No configuration needed.",
    badge: "AI",
    gradient: "from-blue-500/20 to-cyan-500/10",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/15 border-blue-500/20",
  },
  {
    id: "auto-sections",
    icon: LayoutGrid,
    title: "Auto Section Grouping",
    description:
      "For long forms, the AI intelligently organizes questions into logical sections like Personal Info, Academic Details, and Preferences.",
    badge: "Smart",
    gradient: "from-indigo-500/20 to-blue-500/10",
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/15 border-indigo-500/20",
  },
  {
    id: "sheets-integration",
    icon: FileSpreadsheet,
    title: "Google Sheets Linked",
    description:
      "Automatically creates and links a Google Sheets spreadsheet to your form for instant response tracking and analysis.",
    badge: "Google",
    gradient: "from-emerald-500/20 to-green-500/10",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/15 border-emerald-500/20",
  },
  {
    id: "instant-sharing",
    icon: Share2,
    title: "Instant Sharing",
    description:
      "Get both the edit link and the public respondent link the moment your form is ready. Share it anywhere in seconds.",
    badge: "Instant",
    gradient: "from-orange-500/20 to-amber-500/10",
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/15 border-orange-500/20",
  },
  {
    id: "prompt-understanding",
    icon: MessageSquare,
    title: "Deep Prompt Understanding",
    description:
      "Even vague prompts work. Ask for a 'hackathon registration' and the agent fills in team name, size, members, GitHub, and more.",
    badge: "LLM",
    gradient: "from-pink-500/20 to-rose-500/10",
    iconColor: "text-pink-400",
    iconBg: "bg-pink-500/15 border-pink-500/20",
  },
] as const;

const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Describe Your Form",
    description:
      'Type a natural language prompt like "Create a workshop registration form for 200 students."',
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Understands & Plans",
    description:
      "The AI agent parses intent, infers all necessary questions, types, and structure into a structured JSON spec.",
  },
  {
    number: "03",
    icon: Zap,
    title: "Form Is Created",
    description:
      "The Google Forms API is called automatically — questions added, sections organized, sheet linked, permissions set.",
  },
  {
    number: "04",
    icon: Share2,
    title: "Get Your Links",
    description:
      "Receive the edit link, shareable public URL, and the Google Sheets response tracker — all within seconds.",
  },
] as const;

const EXAMPLE_PROMPTS = [
  "Create a student registration form for Annual Gathering 2026 with name, roll number, branch, and T-shirt size",
  "Make a hackathon registration form with team details, GitHub link, and problem statement",
  "Build a workshop feedback form with ratings, comments, and improvement suggestions",
  "Generate a college admission form with personal info, marks, and document uploads",
];

const BENEFITS = [
  "No Google Forms UI knowledge required",
  "Works for any form type — registration, feedback, quiz",
  "Supports file uploads, conditional fields, and sections",
  "Auto-generates confirmation messages",
  "Connects to Google Sheets automatically",
  "Share-ready in under 30 seconds",
];

import { useNavigate } from "react-router-dom";
import useAuth from "@hooks/useAuth";

// ... inside HeroSection:
function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-600/8 blur-[100px]" />

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgb(255 255 255) 1px, transparent 1px),
              linear-gradient(90deg, rgb(255 255 255) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <Container className="relative z-10 pt-28 pb-20 text-center">
        {/* Badge */}
        <div className="flex justify-center mb-6 animate-fade-in-up">
          <Badge
            variant="purple"
            size="lg"
            className="gap-2 px-4 py-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 fill-current" />
            AI-Powered Form Generation
          </Badge>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 animate-fade-in-up delay-100">
          <span className="text-white">Type a Prompt.</span>
          <br />
          <span className="gradient-text">Get a Google Form.</span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 leading-relaxed mb-10 animate-fade-in-up delay-200">
          Prompt2Form uses AI to instantly generate complete, professional Google
          Forms from a single natural language description — including questions,
          types, sections, and a linked spreadsheet.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up delay-300">
          <Button
            id="hero-get-started"
            variant="primary"
            size="xl"
            className="group min-w-[200px]"
            onClick={handleGetStarted}
          >
            Get Started Free
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            id="hero-how-it-works"
            variant="secondary"
            size="xl"
            className="min-w-[200px]"
            onClick={() => {
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            See How it Works
          </Button>
        </div>

        {/* Demo prompt mockup */}
        <div className="max-w-3xl mx-auto animate-fade-in-up delay-400">
          <div className="glass-card p-1 rounded-2xl shadow-[0_32px_80px_rgb(0_0_0/0.5)]">
            {/* Window header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <div className="h-3 w-3 rounded-full bg-green-500/70" />
              <span className="ml-2 text-xs text-slate-500 font-mono">prompt2form.ai</span>
            </div>

            {/* Prompt input */}
            <div className="p-5">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 shrink-0 mt-0.5">
                  <Zap className="h-3.5 w-3.5 text-white fill-white" />
                </div>
                <p className="text-left text-sm sm:text-base text-slate-200 leading-relaxed">
                  Create a Google Form for student registration for Annual
                  Gathering 2026. Ask for Name, Roll Number, Branch, Year,
                  Mobile Number, Email, T-shirt Size, Food Preference
                  (Veg/Non-Veg), and Participation Category (Dance, Singing,
                  Drama, Volunteer). Allow file upload for ID Card.
                </p>
              </div>

              {/* Response */}
              <div className="mt-3 flex items-center gap-3 p-4 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-emerald-300">
                    Google Form Created Successfully!
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    10 questions · 2 sections · Sheets linked · Shareable link ready
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs font-mono text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-1 rounded-md">
                    ~8s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Backend status — live connectivity indicator */}
        <div className="mt-12 animate-fade-in-up delay-500">
          <BackendStatus />
        </div>
      </Container>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="section-padding relative" aria-label="Features">
      <Container>
        {/* Section header */}
        <div className="text-center mb-16">
          <Badge variant="purple" size="md" className="mb-4">
            ✦ Features
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Everything you need to{" "}
            <span className="gradient-text">ship faster</span>
          </h2>
          <p className="max-w-xl mx-auto text-slate-400 text-lg leading-relaxed">
            From a single sentence to a fully configured Google Form — in
            seconds. No manual work required.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                variant="glass"
                hover="glow"
                padding="lg"
                className="group"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
                  aria-hidden
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`flex items-center justify-center h-11 w-11 rounded-xl border ${feature.iconBg} mb-5`}
                  >
                    <Icon className={`h-5 w-5 ${feature.iconColor}`} strokeWidth={2} />
                  </div>

                  {/* Badge + Title */}
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-semibold text-white">
                      {feature.title}
                    </h3>
                    <Badge variant="default" size="sm">
                      {feature.badge}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="section-padding relative overflow-hidden"
      aria-label="How it Works"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/6 blur-[100px]" />
      </div>

      <Container>
        <div className="text-center mb-16">
          <Badge variant="blue" size="md" className="mb-4">
            ✦ How it Works
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            From prompt to form in{" "}
            <span className="gradient-text">4 simple steps</span>
          </h2>
          <p className="max-w-xl mx-auto text-slate-400 text-lg leading-relaxed">
            Our AI agent handles all the complexity so you don't have to.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div
            className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent"
            aria-hidden
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative flex flex-col items-center text-center group">
                  {/* Step number + icon */}
                  <div className="relative mb-6">
                    <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30 group-hover:border-violet-500/60 group-hover:shadow-[0_0_24px_rgb(139_92_246/0.3)] transition-all duration-300">
                      <Icon className="h-7 w-7 text-violet-400" strokeWidth={1.5} />
                    </div>
                    <span className="absolute -top-2 -right-2 flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-[10px] font-black text-white shadow-[0_0_12px_rgb(139_92_246/0.4)]">
                      {idx + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-[220px]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Example prompts carousel */}
        <div className="mt-16">
          <p className="text-center text-sm text-slate-500 mb-5 font-medium tracking-wide uppercase">
            Try These Prompts
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl mx-auto">
            {EXAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                id={`example-prompt-${idx}`}
                className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-left text-sm text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-violet-500/30 transition-all group cursor-pointer"
              >
                <ChevronRight className="h-4 w-4 text-violet-500 mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function BenefitsSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const handleGetStarted = () => navigate(isAuthenticated ? "/dashboard" : "/login");

  return (
    <section
      id="benefits"
      className="section-padding"
      aria-label="Benefits"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: text */}
          <div>
            <Badge variant="green" size="md" className="mb-5">
              ✦ Why Prompt2Form
            </Badge>
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight mb-6">
              Stop wasting time on{" "}
              <span className="gradient-text">manual form building</span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-8">
              Building a Google Form manually is tedious — choosing question
              types, setting required fields, organizing sections, creating a
              response sheet. Prompt2Form does it all in one shot.
            </p>

            <ul className="space-y-3">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-violet-400 shrink-0" />
                  <span className="text-sm text-slate-300">{benefit}</span>
                </li>
              ))}
            </ul>

            <Button
              id="benefits-get-started"
              variant="primary"
              size="lg"
              className="mt-8 group"
              onClick={handleGetStarted}
            >
              Start Building for Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Right: stat cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                value: "< 30s",
                label: "Average time to create a form",
                color: "from-violet-500/20 to-purple-500/10",
                border: "border-violet-500/20",
              },
              {
                value: "10+",
                label: "Question types supported automatically",
                color: "from-blue-500/20 to-cyan-500/10",
                border: "border-blue-500/20",
              },
              {
                value: "100%",
                label: "Automatic Google Sheets integration",
                color: "from-emerald-500/20 to-green-500/10",
                border: "border-emerald-500/20",
              },
              {
                value: "∞",
                label: "Form types — registration, feedback, quiz, survey",
                color: "from-orange-500/20 to-amber-500/10",
                border: "border-orange-500/20",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl bg-gradient-to-br ${stat.color} border ${stat.border} p-6 flex flex-col gap-2`}
              >
                <span className="text-4xl font-black text-white">{stat.value}</span>
                <span className="text-xs text-slate-400 leading-relaxed">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function CtaSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const handleGetStarted = () => navigate(isAuthenticated ? "/dashboard" : "/login");

  return (
    <section id="cta" className="section-padding relative overflow-hidden" aria-label="Call to Action">
      <Container size="md">
        <div className="relative rounded-3xl bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-blue-600/20 border border-violet-500/30 p-10 sm:p-14 text-center overflow-hidden">
          {/* Glow */}
          <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-violet-500/20 blur-[80px] pointer-events-none" aria-hidden />

          {/* Content */}
          <div className="relative z-10">
            <Badge variant="gradient" size="lg" className="mb-6">
              🚀 Get Started Today — It's Free
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-5">
              Ready to build your first{" "}
              <span className="gradient-text">AI-powered form?</span>
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-lg mx-auto">
              Join thousands of people who use Prompt2Form to create Google Forms
              in seconds. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                id="cta-get-started"
                variant="primary"
                size="xl"
                className="group min-w-[200px]"
                onClick={handleGetStarted}
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                id="cta-learn-more"
                variant="ghost"
                size="xl"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ============================================================
//  PAGE EXPORT
// ============================================================

/**
 * Landing page — home route "/"
 */
export default function HomePage() {
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={pageRef} className="overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BenefitsSection />
      <CtaSection />
    </div>
  );
}
