/**
 * pages/DashboardPage.tsx
 * =======================
 * Authenticated user dashboard displaying welcome message, user profile details,
 * email, profile picture, and logout option.
 */

import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck, User as UserIcon } from "lucide-react";
import { Container } from "@components/common";
import { LoginButton } from "@components/auth/LoginButton";
import { UserProfile } from "@components/auth/UserProfile";
import useAuth from "@hooks/useAuth";

export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
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
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-500/10 text-violet-400 mb-6 border border-violet-500/20">
              <UserIcon className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-2">
              Authentication Required
            </h1>
            <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
              Please sign in with your Google account to access your Prompt2Form dashboard.
            </p>
            <LoginButton size="lg" className="w-full sm:w-auto" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <Container>
        {/* Welcome Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-violet-900/40 via-indigo-900/20 to-blue-900/30 border border-violet-500/20 p-8 sm:p-10 mb-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-3">
                <ShieldCheck className="w-3.5 h-3.5" /> Session Active
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome back, <span className="gradient-text">{user.name}</span>!
              </h1>
              <p className="text-slate-400 text-sm mt-2 max-w-xl">
                Your Google OAuth 2.0 authentication is active and ready for Workspace integrations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/forms"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4" /> Manage Google Forms
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 transition-all"
              >
                View Home Page
              </Link>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-white tracking-tight">
              User Profile
            </h2>
            <UserProfile user={user} onLogout={logout} />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Google Account & Workspace Status
            </h2>

            <div className="bg-[#121225]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                    ID
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Google OAuth Identity (Sub)</p>
                    <p className="text-sm font-mono font-semibold text-white">{user.google_id}</p>
                  </div>
                </div>
                <span className="text-xs bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/20 font-medium">
                  Verified
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-violet-400 font-bold">
                    @
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Authenticated Email</p>
                    <p className="text-sm font-semibold text-white">{user.email}</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                    🔒
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Session Security</p>
                    <p className="text-sm font-semibold text-white">HTTP-Only JWT Cookie (SameSite=Lax)</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">
                  Secure
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DashboardPage;
