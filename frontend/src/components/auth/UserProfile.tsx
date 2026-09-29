/**
 * components/auth/UserProfile.tsx
 * ================================
 * User profile display card showing avatar, name, email, Google connection badge,
 * and logout functionality.
 */

import React from "react";
import { User, LogOut, CheckCircle2 } from "lucide-react";
import type { UserProfile as UserProfileType } from "@services/auth";

interface UserProfileProps {
  user: UserProfileType;
  onLogout?: () => void;
  compact?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onLogout,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-[#131326] px-3.5 py-1.5 rounded-full border border-white/10">
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover ring-2 ring-violet-500/30"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-violet-600/30 flex items-center justify-center text-violet-300 font-semibold text-xs">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-sm font-medium text-slate-200 max-w-[120px] truncate">
          {user.name}
        </span>
        {onLogout && (
          <button
            onClick={onLogout}
            title="Log out"
            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-full transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#121225]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl max-w-md w-full">
      <div className="flex items-start gap-4">
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-violet-500/40 shadow-lg"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            <User className="w-8 h-8" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white truncate">{user.name}</h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> Google Connected
            </span>
          </div>

          <p className="text-sm text-slate-400 truncate mt-0.5">{user.email}</p>
          <p className="text-xs text-slate-500 mt-1 font-mono">ID: {user.google_id}</p>
        </div>
      </div>

      {onLogout && (
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl border border-rose-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
