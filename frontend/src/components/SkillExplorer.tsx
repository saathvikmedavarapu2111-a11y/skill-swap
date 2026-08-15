import React, { useState, useMemo } from "react";
import { Skill, User, SkillCategory, SkillLevel, SessionType } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Search,
  ArrowLeftRight,
  Star,
  GraduationCap,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
  BookOpen,
  Zap,
} from "lucide-react";

interface SkillExplorerProps {
  skills: Skill[];
  users: User[];
  currentUser: User;
  onProposeSwap: (skill: Skill, targetUser: User) => void;
  onViewProfile: (user: User) => void;
  selectedCategory: SkillCategory;
  setSelectedCategory: (cat: SkillCategory) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const CATEGORIES: SkillCategory[] = [
  "All Categories",
  "AI & Machine Learning",
  "Full-Stack Web",
  "UI/UX & Product Design",
  "3D & Game Dev",
  "Cybersecurity & Systems",
  "Data Science & Analytics",
  "Music & Audio",
  "Career & Speaking",
];

const LEVELS: (SkillLevel | "All Levels")[] = [
  "All Levels",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
];

export function SkillExplorer({
  skills,
  users,
  currentUser,
  onProposeSwap,
  onViewProfile,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
}: SkillExplorerProps) {
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | "All Levels">("All Levels");
  const [selectedSessionType, setSelectedSessionType] = useState<SessionType | "All Types">("All Types");
  const [showFilters, setShowFilters] = useState(false);

  // Map users for fast lookup
  const userMap = useMemo(() => {
    const map: { [id: string]: User } = {};
    users.forEach((u) => {
      map[u.id] = u;
    });
    return map;
  }, [users]);

  // Calculate peer match score between current user and skill owner
  const calculateMatchScore = (skillOwner: User | undefined, skill: Skill): number => {
    if (!skillOwner || skillOwner.id === currentUser.id) return 0;
    
    let score = 70; // baseline

    // If currentUser wants to learn something this skill or user teaches
    const userWantsSkill = currentUser.skillsLearning.some((target) =>
      skill.title.toLowerCase().includes(target.toLowerCase()) ||
      skill.tags.some((t) => target.toLowerCase().includes(t.toLowerCase())) ||
      target.toLowerCase().includes(skill.category.toLowerCase().split(" ")[0])
    );
    if (userWantsSkill) score += 20;

    // If skill owner wants something currentUser teaches
    const currentUserSkills = skills.filter((s) => s.userId === currentUser.id);
    const ownerWantsMySkill = skillOwner.skillsLearning.some((wanted) =>
      currentUserSkills.some((mySkill) =>
        mySkill.title.toLowerCase().includes(wanted.toLowerCase()) ||
        mySkill.tags.some((t) => wanted.toLowerCase().includes(t.toLowerCase()))
      )
    );
    if (ownerWantsMySkill) score += 10;

    return Math.min(score, 99);
  };

  // Filter skills
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      // Category filter
      if (selectedCategory !== "All Categories" && skill.category !== selectedCategory) {
        return false;
      }
      // Level filter
      if (selectedLevel !== "All Levels" && skill.level !== selectedLevel) {
        return false;
      }
      // Session type filter
      if (selectedSessionType !== "All Types" && skill.sessionType !== selectedSessionType) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = skill.title.toLowerCase().includes(query);
        const matchesDesc = skill.description.toLowerCase().includes(query);
        const matchesTags = skill.tags.some((t) => t.toLowerCase().includes(query));
        const owner = userMap[skill.userId];
        const matchesOwner = owner ? owner.name.toLowerCase().includes(query) || owner.college.toLowerCase().includes(query) : false;
        
        return matchesTitle || matchesDesc || matchesTags || matchesOwner;
      }
      return true;
    });
  }, [skills, selectedCategory, selectedLevel, selectedSessionType, searchQuery, userMap]);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
            <BookOpen className="h-4 w-4" /> Peer Knowledge Hub
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Discover What Peers Are Teaching
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Browse skills listed by top students, check match compatibility, and trade insights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
            <span>Filters</span>
            {(selectedLevel !== "All Levels" || selectedSessionType !== "All Types") && (
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
            )}
          </Button>
        </div>
      </div>

      {/* Categories Horizontal Scrollbar */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all select-none border ${
                isSelected
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/25"
                  : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Expandable Advanced Filters */}
      {showFilters && (
        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md animate-in fade-in zoom-in-95">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            
            {/* Level Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Skill Level
              </label>
              <div className="flex flex-wrap gap-1.5">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                      selectedLevel === lvl
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                        : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Session Type Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Exchange Format
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(["All Types", "1-on-1 Swap", "Direct Mentorship", "Pair Collaboration"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedSessionType(type)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                      selectedSessionType === type
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                        : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            <div className="flex items-end justify-start sm:justify-end">
              <Button
                onClick={() => {
                  setSelectedCategory("All Categories");
                  setSelectedLevel("All Levels");
                  setSelectedSessionType("All Types");
                  setSearchQuery("");
                }}
                variant="ghost"
                size="sm"
                className="text-xs text-slate-400 hover:text-white"
              >
                Reset All Filters
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* Search status & count */}
      <div className="mt-6 flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing <strong className="text-slate-200">{filteredSkills.length}</strong> available skills</span>
        {searchQuery && (
          <span>Filtering by <span className="text-indigo-300 font-mono">"{searchQuery}"</span></span>
        )}
      </div>

      {/* Grid of Skill Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.length === 0 ? (
          <div className="col-span-full py-16 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
            <Search className="mx-auto h-10 w-10 text-slate-600 mb-3" />
            <h3 className="text-lg font-bold text-white">No skills match your search</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search query, clearing filters, or post your own skill offer.
            </p>
            <Button
              onClick={() => {
                setSelectedCategory("All Categories");
                setSelectedLevel("All Levels");
                setSearchQuery("");
              }}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          filteredSkills.map((skill) => {
            const owner = userMap[skill.userId];
            const isMe = owner?.id === currentUser.id;
            const matchScore = calculateMatchScore(owner, skill);

            const levelColors: { [key in SkillLevel]: "cyan" | "purple" | "warning" | "rose" } = {
              Beginner: "cyan",
              Intermediate: "purple",
              Advanced: "warning",
              Expert: "rose",
            };

            return (
              <Card
                key={skill.id}
                className="group relative flex flex-col justify-between border border-slate-800/90 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 rounded-2xl p-6"
              >
                <div>
                  
                  {/* Card Header: Owner Info & Match Badge */}
                  <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800/70">
                    {owner && (
                      <div
                        onClick={() => onViewProfile(owner)}
                        className="flex items-center gap-3 cursor-pointer group/user"
                      >
                        <Avatar
                          src={owner.avatar}
                          fallback={owner.name[0]}
                          size="md"
                          status={owner.status}
                        />
                        <div className="text-left">
                          <h4 className="text-sm font-bold text-white group-hover/user:text-indigo-300 transition-colors flex items-center gap-1.5">
                            {owner.name}
                            {isMe && (
                              <span className="rounded bg-indigo-500/20 px-1 text-[9px] font-bold text-indigo-300">
                                (You)
                              </span>
                            )}
                          </h4>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1">
                            <GraduationCap className="h-3 w-3 text-slate-500" />
                            {owner.college}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Match Score or Rating */}
                    {owner && (
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span>{owner.rating}</span>
                        </div>
                        {!isMe && matchScore > 75 && (
                          <span className="mt-1 text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                            <Zap className="h-2.5 w-2.5" /> {matchScore}% Match
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Skill Category & Level */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Badge variant="default">{skill.category}</Badge>
                    <Badge variant={levelColors[skill.level]}>{skill.level}</Badge>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 ml-auto">
                      <Clock className="h-3 w-3" /> ~{skill.estimatedHours}h session
                    </span>
                  </div>

                  {/* Skill Title & Description */}
                  <h3 className="mt-3 text-lg font-bold text-white tracking-tight group-hover:text-indigo-200 transition-colors leading-snug">
                    {skill.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {skill.description}
                  </p>

                  {/* Learning Highlights */}
                  {skill.whatYouWillLearn && skill.whatYouWillLearn.length > 0 && (
                    <div className="mt-3.5 space-y-1.5">
                      <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                        Key Takeaways:
                      </p>
                      {skill.whatYouWillLearn.slice(0, 2).map((item, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {skill.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700/50"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  {owner && (
                    <Button
                      onClick={() => onViewProfile(owner)}
                      variant="ghost"
                      size="sm"
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Profile & Reviews
                    </Button>
                  )}

                  {isMe ? (
                    <Badge variant="secondary" className="ml-auto py-1">
                      Your Skill Listing
                    </Badge>
                  ) : (
                    <Button
                      onClick={() => owner && onProposeSwap(skill, owner)}
                      variant="default"
                      size="sm"
                      className="ml-auto bg-indigo-600 hover:bg-indigo-500 text-xs shadow-md shadow-indigo-600/30"
                    >
                      <ArrowLeftRight className="h-3.5 w-3.5" />
                      Propose Swap
                    </Button>
                  )}
                </div>

              </Card>
            );
          })
        )}
      </div>

    </section>
  );
}
