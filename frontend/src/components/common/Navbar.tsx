import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Zap } from "lucide-react";
import { cn } from "@lib/utils";
import { Button } from "@components/ui";
import { useScrollPosition } from "@hooks/useScrollPosition";
import useAuth from "@hooks/useAuth";
import UserProfile from "@components/auth/UserProfile";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "About", href: "/about" },
] as const;

/**
 * Sticky navigation bar with blur-on-scroll effect and mobile drawer.
 */
export function Navbar() {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const scrollY = useScrollPosition();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isScrolled = scrollY > 20;
  const isHome = location.pathname === "/";

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("#") && isHome) {
      const el = document.getElementById(href.slice(1));
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAuthNavigation = (target: "/login" | "/dashboard") => {
    setMobileOpen(false);
    navigate(target);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "transition-all duration-300",
          isScrolled
            ? "bg-[#09091a]/80 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group"
              aria-label="Prompt2Form Home"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 shadow-[0_0_16px_rgb(139_92_246/0.4)] group-hover:shadow-[0_0_24px_rgb(139_92_246/0.6)] transition-shadow">
                <Zap className="h-4 w-4 text-white fill-white" />
              </div>
              <span className="text-base font-bold text-white">
                Prompt<span className="gradient-text">2Form</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map((link) =>
                link.href.startsWith("#") ? (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                  >
                    {link.label}
                  </Link>
                ),
              )}
              {isAuthenticated && (
                <Link
                  to="/forms"
                  className="px-4 py-2 text-sm font-semibold text-violet-400 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 rounded-lg transition-colors border border-violet-500/20"
                >
                  My Forms
                </Link>
              )}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated && user ? (
                <UserProfile user={user} onLogout={logout} compact />
              ) : (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleAuthNavigation("/login")}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAuthNavigation("/login")}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-toggle"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileOpen}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden",
          "transition-all duration-300",
          isMobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer panel */}
        <div
          className={cn(
            "absolute top-16 left-0 right-0",
            "bg-[#0f0f1c] border-b border-white/[0.08]",
            "p-4 space-y-2",
            "transition-transform duration-300",
            isMobileOpen ? "translate-y-0" : "-translate-y-full",
          )}
        >
          {NAV_LINKS.map((link) =>
            link.href.startsWith("#") ? (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                {link.label}
              </Link>
            ),
          )}

          <div className="pt-2 flex flex-col gap-2 border-t border-white/[0.08]">
            {isAuthenticated && user ? (
              <UserProfile user={user} onLogout={logout} />
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  onClick={() => handleAuthNavigation("/login")}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => handleAuthNavigation("/login")}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

