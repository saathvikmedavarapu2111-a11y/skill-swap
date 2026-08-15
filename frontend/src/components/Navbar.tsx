import React, { useState, useRef, useEffect } from "react";
import { User, Notification } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Bell,
  PlusCircle,
  Trophy,
  Compass,
  ArrowLeftRight,
  ChevronDown,
  CheckCheck,
  LogOut,
  LogIn,
  KeyRound,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";

interface NavbarProps {
  currentUser: User;
  allUsers: User[];
  onSelectUser: (userId: string) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  pendingRequestsCount: number;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onOpenAddSkill: () => void;
  onOpenProfile: (user: User) => void;
  onOpenLogin?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

export function Navbar({
  currentUser,
  allUsers: _allUsers,
  onSelectUser: _onSelectUser,
  activeView,
  setActiveView,
  pendingRequestsCount,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onOpenAddSkill,
  onOpenProfile,
  onOpenLogin,
  onLogout,
  isAuthenticated = false,
}: NavbarProps) {
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadNotifs = notifications.filter((n) => !n.read);

  const personaRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (personaRef.current && !personaRef.current.contains(e.target as Node)) {
        setShowPersonaMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#07090e]/90 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => setActiveView("explore")}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 shadow-md shadow-indigo-600/20 group-hover:shadow-indigo-600/30 transition-all">
              <ArrowLeftRight className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">
                SkillSwap
              </span>
              <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 uppercase tracking-wider">
                Campus
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveView("explore")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold tracking-wide transition-all ${
                activeView === "explore"
                  ? "bg-slate-800/90 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <Compass className="h-3.5 w-3.5 text-indigo-400" />
              Discover Skills
            </button>

            <button
              onClick={() => setActiveView("swaps")}
              className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold tracking-wide transition-all ${
                activeView === "swaps"
                  ? "bg-slate-800/90 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <ArrowLeftRight className="h-3.5 w-3.5 text-purple-400" />
              My Swaps
              {pendingRequestsCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView("leaderboard")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold tracking-wide transition-all ${
                activeView === "leaderboard"
                  ? "bg-slate-800/90 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              Leaderboard
            </button>

            <button
              onClick={() => setActiveView("spotlight-demo")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold tracking-wide transition-all ${
                activeView === "spotlight-demo"
                  ? "bg-slate-800/90 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              Spotlight
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          
          {/* Post Skill Button */}
          <Button
            onClick={onOpenAddSkill}
            variant="gradient"
            size="sm"
            className="hidden sm:inline-flex h-9 px-3.5 text-xs font-semibold shadow-indigo-600/20"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Teach a Skill</span>
          </Button>

          {/* Notifications Popover */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-800 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-white">Notifications</span>
                    {unreadNotifs.length > 0 && (
                      <Badge variant="rose">{unreadNotifs.length} new</Badge>
                    )}
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={onMarkAllNotificationsRead}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="mt-3 max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          onMarkNotificationRead(n.id);
                          setActiveView("swaps");
                          setShowNotifications(false);
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                          n.read
                            ? "border-slate-800/50 bg-slate-900/40 text-slate-400 opacity-80"
                            : "border-indigo-500/30 bg-indigo-950/20 text-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">{n.title}</span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-300 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Action: Sign In Button for Guests (No profile pic for Guest) */}
          {!isAuthenticated && onOpenLogin ? (
            <Button
              onClick={onOpenLogin}
              variant="gradient"
              size="sm"
              className="h-9 px-4 text-xs font-semibold shadow-indigo-600/20"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </Button>
          ) : isAuthenticated ? (
            /* Authenticated User Account Menu */
            <div className="relative" ref={personaRef}>
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 py-1.5 pl-2 pr-2.5 hover:border-slate-700 transition-all select-none"
              >
                <Avatar
                  src={currentUser.avatar}
                  fallback={currentUser.name.charAt(0)}
                  size="sm"
                  status={currentUser.status}
                />
                <div className="hidden lg:flex flex-col text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-white leading-tight">
                      {currentUser.name.split(" ")[0]}
                    </span>
                    <span title="JWT Authenticated">
                      <ShieldCheck className="h-3 w-3 text-emerald-400" />
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {currentUser.karmaPoints} karma
                  </span>
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {showPersonaMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-800 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 z-50">
                  {/* User Info Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                    <Avatar src={currentUser.avatar} fallback={currentUser.name[0]} size="md" />
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-400 truncate">{currentUser.college}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.5 rounded-md">
                          <ShieldCheck className="h-2.5 w-2.5" /> Authenticated
                        </span>
                        <span className="text-[10px] font-mono text-indigo-400">
                          {currentUser.karmaPoints} pts
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 space-y-1">
                    <button
                      onClick={() => {
                        onOpenProfile(currentUser);
                        setShowPersonaMenu(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                        <span>View Profile</span>
                      </span>
                    </button>

                    {onOpenLogin && (
                      <button
                        onClick={() => {
                          onOpenLogin();
                          setShowPersonaMenu(false);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs font-medium text-indigo-300 hover:bg-indigo-950/30 hover:text-indigo-200 border border-indigo-500/20 transition-all"
                      >
                        <KeyRound className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Switch Account</span>
                      </button>
                    )}

                    {onLogout && (
                      <button
                        onClick={() => {
                          onLogout();
                          setShowPersonaMenu(false);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs font-medium text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-all"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Log Out</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : null}

        </div>

      </div>
    </header>
  );
}
