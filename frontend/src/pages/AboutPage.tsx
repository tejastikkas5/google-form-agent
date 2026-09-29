import { Zap, Target, Users, Code2 } from "lucide-react";
import { Badge, Card, CardContent } from "@components/ui";
import { Container } from "@components/common";

const TEAM_VALUES = [
  {
    icon: Target,
    title: "Mission",
    description:
      "Eliminate the friction of building data-collection forms. Let AI handle the tedious structure so you can focus on what matters.",
  },
  {
    icon: Users,
    title: "Built for Everyone",
    description:
      "From a student organizing a college event to an HR manager collecting resumes — Prompt2Form works for any scale and any form type.",
  },
  {
    icon: Code2,
    title: "Open & Extensible",
    description:
      "Built on proven open standards — Google APIs, LangGraph agents, and a clean REST API. Easy to extend, audit, and integrate.",
  },
];

const TECH_STACK = [
  { name: "React 19", color: "text-blue-400" },
  { name: "TypeScript", color: "text-blue-300" },
  { name: "FastAPI", color: "text-emerald-400" },
  { name: "LangGraph", color: "text-violet-400" },
  { name: "Google Forms API", color: "text-orange-400" },
  { name: "Gemini AI", color: "text-pink-400" },
  { name: "OAuth 2.0", color: "text-yellow-400" },
  { name: "Tailwind CSS", color: "text-cyan-400" },
];

/**
 * About page — route "/about"
 */
export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <Container size="lg">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="purple" size="md" className="mb-4">
            About Prompt2Form
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-5">
            We make form building{" "}
            <span className="gradient-text">effortless</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-400 leading-relaxed">
            Prompt2Form is an AI SaaS application that converts natural language
            into complete, shareable Google Forms within seconds. No templates,
            no drag-and-drop, no friction.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {TEAM_VALUES.map((value) => {
            const Icon = value.icon;
            return (
              <Card key={value.title} variant="glass" hover="glow" padding="lg">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-violet-500/15 border border-violet-500/20 mb-4">
                  <Icon className="h-6 w-6 text-violet-400" strokeWidth={1.5} />
                </div>
                <h2 className="text-lg font-semibold text-white mb-2">
                  {value.title}
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {value.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Tech Stack */}
        <Card variant="gradient" padding="lg" className="mb-16">
          <CardContent className="mt-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-violet-500/15 border border-violet-500/20">
                <Zap className="h-5 w-5 text-violet-400 fill-violet-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Tech Stack</h2>
                <p className="text-sm text-slate-400">
                  Built with the best tools available
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map((tech) => (
                <span
                  key={tech.name}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${tech.color} bg-white/5 border border-white/[0.08]`}
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project context */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-slate-400 leading-relaxed text-base">
            This project was designed as a production-grade AI SaaS application,
            following a structured development roadmap from OAuth integration to
            multi-step AI agents, conversational editing, and enterprise features.
          </p>
        </div>
      </Container>
    </div>
  );
}
