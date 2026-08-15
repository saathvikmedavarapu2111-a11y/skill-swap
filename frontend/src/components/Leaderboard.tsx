import React from "react";
import { User } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Trophy,
  Medal,
  Award,
  Star,
  Zap,
  GraduationCap,
} from "lucide-react";

interface LeaderboardProps {
  users: User[];
  currentUser: User;
  onViewProfile: (user: User) => void;
}

export function Leaderboard({ users, currentUser, onViewProfile }: LeaderboardProps) {
  // Sort users by karma points descending
  const sortedUsers = [...users].sort((a, b) => b.karmaPoints - a.karmaPoints);

  const campusStats = [
    { rank: 1, name: "Stanford University", swaps: 842, activeStudents: 310 },
    { rank: 2, name: "UC Berkeley", swaps: 790, activeStudents: 290 },
    { rank: 3, name: "MIT", swaps: 680, activeStudents: 240 },
    { rank: 4, name: "Georgia Tech", swaps: 520, activeStudents: 180 },
    { rank: 5, name: "Carnegie Mellon", swaps: 490, activeStudents: 165 },
  ];

  const achievements = [
    {
      title: "First Swap Completed",
      desc: "Complete your first 1-on-1 skill exchange session",
      karma: "+100 Karma",
      unlocked: currentUser.swapsCompleted >= 1,
    },
    {
      title: "5-Star Mentor",
      desc: "Maintain a perfect 5.0 rating over 5+ reviews",
      karma: "+300 Karma",
      unlocked: currentUser.rating >= 4.9 && currentUser.reviewsCount >= 5,
    },
    {
      title: "Polymath Swapper",
      desc: "Teach 3 or more distinct technology or creative domains",
      karma: "+500 Karma",
      unlocked: currentUser.skillsTeaching.length >= 2,
    },
    {
      title: "Fast Responder",
      desc: "Respond to incoming swap proposals within 2 hours",
      karma: "+200 Karma",
      unlocked: true,
    },
  ];

  const myRank = sortedUsers.findIndex((u) => u.id === currentUser.id) + 1;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto pb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 backdrop-blur-md mb-4">
          <Trophy className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-semibold text-amber-300">
            Campus Reputation & Karma Standings
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Top Student Mentors & Campus Standings
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Earn karma points by sharing knowledge, completing skill exchanges, and receiving glowing peer endorsements.
        </p>
      </div>

      {/* Current User Rank Spotlight Banner */}
      <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/60 p-6 shadow-2xl backdrop-blur-xl mb-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <Avatar src={currentUser.avatar} fallback={currentUser.name[0]} size="lg" />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Your Standings
              </span>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
                {currentUser.name}
                {myRank > 0 && <Badge variant="purple">Rank #{myRank} Leader</Badge>}
              </h3>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
                <span>{currentUser.karmaPoints} total karma</span>
                <span>•</span>
                <span>{currentUser.swapsCompleted} swaps completed</span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-amber-300">
                  <Star className="h-3 w-3 fill-amber-400" /> {currentUser.rating}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <span className="text-xs text-slate-400 block">Next Milestone</span>
              <span className="text-sm font-bold text-amber-300 font-mono">2,000 Karma</span>
            </div>
            <div className="w-36">
              <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 rounded-full"
                  style={{ width: `${Math.min((currentUser.karmaPoints / 2000) * 100, 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block text-right font-mono">
                {Math.round((currentUser.karmaPoints / 2000) * 100)}% to Milestone
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Top Mentors List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
            <Medal className="h-5 w-5 text-amber-400" />
            Global Student Leaderboard
          </h2>

          <div className="space-y-3">
            {sortedUsers.map((user, idx) => {
              const rank = idx + 1;
              const isCurrentUser = user.id === currentUser.id;

              const medalColors = {
                1: "border-amber-500/60 bg-amber-500/15 text-amber-300 font-bold",
                2: "border-slate-300/50 bg-slate-400/15 text-slate-200 font-bold",
                3: "border-amber-700/60 bg-amber-800/15 text-amber-400 font-bold",
              };

              return (
                <Card
                  key={user.id}
                  onClick={() => onViewProfile(user)}
                  className={`p-4 flex items-center justify-between gap-4 cursor-pointer hover:border-indigo-500/60 transition-all rounded-2xl ${
                    isCurrentUser ? "border-indigo-500 bg-indigo-950/20" : "border-slate-800 bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Rank Number / Badge */}
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs border font-mono ${
                        rank <= 3
                          ? medalColors[rank as keyof typeof medalColors]
                          : "border-slate-800 bg-slate-950 text-slate-400"
                      }`}
                    >
                      #{rank}
                    </div>

                    <Avatar src={user.avatar} fallback={user.name[0]} size="md" status={user.status} />

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white hover:text-indigo-300 transition-colors">
                          {user.name}
                        </h4>
                        {isCurrentUser && (
                          <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/20 px-1.5 py-0.5 rounded">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {user.college} • {user.major}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="hidden sm:flex flex-col items-end text-right">
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-300">
                        <Star className="h-3 w-3 fill-amber-400" />
                        {user.rating} ({user.reviewsCount})
                      </div>
                      <span className="text-[10px] text-slate-400">{user.swapsCompleted} Swaps</span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                      <Zap className="h-4 w-4 text-amber-400" />
                      <span className="text-sm font-bold text-white font-mono">{user.karmaPoints}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right: Campus Chapters & Achievements (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Top Campus Chapters */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 mb-3">
              <GraduationCap className="h-4 w-4 text-cyan-400" />
              Campus Standings
            </h3>

            <div className="space-y-2.5">
              {campusStats.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-900 text-[10px] font-bold text-slate-400 border border-slate-800">
                      #{c.rank}
                    </span>
                    <div>
                      <strong className="text-white block">{c.name}</strong>
                      <span className="text-[10px] text-slate-400">{c.activeStudents} active peers</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-indigo-400">{c.swaps} swaps</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 mb-3">
              <Award className="h-4 w-4 text-purple-400" />
              Karma Achievements
            </h3>

            <div className="space-y-2.5">
              {achievements.map((ach) => (
                <div
                  key={ach.title}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    ach.unlocked
                      ? "border-emerald-500/30 bg-emerald-950/15 text-slate-200"
                      : "border-slate-800 bg-slate-950/40 text-slate-500"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className={ach.unlocked ? "text-white" : "text-slate-400"}>
                      {ach.title}
                    </strong>
                    <Badge variant={ach.unlocked ? "success" : "outline"} className="text-[10px]">
                      {ach.karma}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 leading-snug">{ach.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
