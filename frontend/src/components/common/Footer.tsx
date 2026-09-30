import { Link } from "react-router-dom";
import { Zap, Code2, MessageCircle, Globe } from "lucide-react";
import { Container } from "./Container";

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Changelog", href: "#" },
    { label: "Roadmap", href: "#" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const SOCIAL_LINKS = [
  { label: "GitHub", icon: Code2, href: "https://github.com" },
  { label: "Twitter", icon: MessageCircle, href: "https://twitter.com" },
  { label: "LinkedIn", icon: Globe, href: "https://linkedin.com" },
];

/**
 * Site-wide footer with link groups, social icons, and copyright.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.06] bg-[#09091a]">
      {/* Top gradient glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 w-fit group">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 shadow-[0_0_16px_rgb(139_92_246/0.4)] group-hover:shadow-[0_0_24px_rgb(139_92_246/0.6)] transition-shadow">
                <Zap className="h-4 w-4 text-white fill-white" />
              </div>
              <span className="text-base font-bold text-white">
                Prompt<span className="gradient-text">2Form</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Generate complete, professional Google Forms from a single natural
              language prompt. Powered by AI, built for everyone.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2 pt-1">
              {SOCIAL_LINKS.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center h-9 w-9 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-violet-500/40 hover:bg-violet-500/10 transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="space-y-3">
              <h4 className="text-sm font-semibold text-white">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        to={link.href}
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {currentYear} Prompt2Form. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Built with ❤️ using React, TypeScript & Google Forms API
          </p>
        </div>
      </Container>
    </footer>
  );
}
