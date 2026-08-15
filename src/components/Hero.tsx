import React from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  GraduationCap,
  Star,
  Search,
} from "lucide-react";
import { SkillCategory } from "@/types";

interface HeroProps {
  onExplore: () => void;
  onTeach: () => void;
  onSelectCategory: (cat: SkillCategory) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function Hero({
  onExplore,
  onTeach,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
}: HeroProps) {
  const popularCategories: SkillCategory[] = [
    "AI & Machine Learning",
    "Full-Stack Web",
    "UI/UX & Product Design",
    "3D & Game Dev",
    "Cybersecurity & Systems",
  ];

  return (
    <div className="relative w-full overflow-hidden border-b border-slate-800/60 bg-gradient-to-b from-[#0a0d18] via-[#07090e] to-[#07090e] pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Background Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40 select-none" />

      {/* Spotlight Effect Component */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />
      <Spotlight
        className="top-10 right-0 md:top-20 md:right-40"
        fill="#818cf8"
      />

      {/* Radial Glow Blob */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 backdrop-blur-md mb-6 animate-pulse-slow">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-semibold text-indigo-200">
            Next-Gen Student Skill Exchange
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Hero Main Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Swap Skills, Not Money. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
            Learn Directly From Peers.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
          Connect with talented students across top campuses. Teach what you master — from Next.js & PyTorch to 3D Blender & Design Systems — and learn what you need through 1-on-1 collaborative exchanges.
        </p>

        {/* Interactive Search Bar in Hero */}
        <div className="mt-8 mx-auto max-w-2xl">
          <div className="relative flex items-center rounded-2xl border border-slate-700/80 bg-slate-900/90 p-2 shadow-2xl backdrop-blur-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/40 transition-all">
            <div className="pl-3 pr-2 text-slate-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills (e.g. PyTorch, Figma, Next.js, 3D Modeling, DevOps)..."
              className="w-full bg-transparent px-2 py-2 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
            <Button
              onClick={onExplore}
              variant="default"
              size="md"
              className="rounded-xl px-5 shrink-0"
            >
              Find Peers
            </Button>
          </div>

          {/* Quick Tag Pills */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-400">
            <span className="text-slate-500 font-medium">Trending:</span>
            {popularCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  onExplore();
                }}
                className="rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-slate-300 hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-slate-800/80 transition-all"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={onExplore}
            variant="glow"
            size="lg"
            className="font-semibold shadow-indigo-600/30"
          >
            Explore 85+ Student Mentors
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            onClick={onTeach}
            variant="secondary"
            size="lg"
            className="border-slate-700 bg-slate-900/80 hover:bg-slate-800"
          >
            Post Teachable Skill
          </Button>
        </div>

        {/* Live Metrics Ticker */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/60">
          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/40">
            <div className="flex items-center gap-1.5 text-2xl font-bold text-white font-mono">
              <Zap className="h-5 w-5 text-amber-400" />
              2,450+
            </div>
            <span className="text-xs text-slate-400 mt-0.5">Skills Exchanged</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/40">
            <div className="flex items-center gap-1.5 text-2xl font-bold text-white font-mono">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              4.96 / 5
            </div>
            <span className="text-xs text-slate-400 mt-0.5">Average Peer Rating</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/40">
            <div className="flex items-center gap-1.5 text-2xl font-bold text-white font-mono">
              <GraduationCap className="h-5 w-5 text-cyan-400" />
              48+ Campuses
            </div>
            <span className="text-xs text-slate-400 mt-0.5">Universities Active</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/40">
            <div className="flex items-center gap-1.5 text-2xl font-bold text-emerald-400 font-mono">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              100% Free
            </div>
            <span className="text-xs text-slate-400 mt-0.5">Pure Peer Barter</span>
          </div>
        </div>

      </div>
    </div>
  );
}
