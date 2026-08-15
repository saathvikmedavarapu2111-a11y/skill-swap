import React from "react";
import { User, Skill, Review } from "@/types";
import { Modal } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  GraduationCap,
  Star,
  Zap,
  ArrowLeftRight,
  Clock,
  Sparkles,
  Award,
  BookOpen,
  MessageSquare,
  Target,
} from "lucide-react";

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  currentUser: User;
  userSkills: Skill[];
  reviews: Review[];
  allUsers: User[];
  onProposeSwap: (skill: Skill, targetUser: User) => void;
}

export function StudentProfileModal({
  isOpen,
  onClose,
  user,
  currentUser,
  userSkills,
  reviews,
  allUsers,
  onProposeSwap,
}: StudentProfileModalProps) {
  if (!user) return null;

  const isMe = user.id === currentUser.id;

  const userMap: { [id: string]: User } = {};
  allUsers.forEach((u) => (userMap[u.id] = u));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-indigo-400" />
          <span>Student Profile & Reputation</span>
        </div>
      }
      description={`${user.name} • ${user.college}`}
    >
      <div className="space-y-6">
        
        {/* Profile Top Banner */}
        <div className="relative rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <Avatar
                src={user.avatar}
                fallback={user.name[0]}
                size="xl"
                status={user.status}
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-white">{user.name}</h3>
                  <span className="text-xs text-slate-400 font-mono">{user.handle}</span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  {user.major} • {user.year}
                </p>
                <p className="text-xs text-indigo-300 flex items-center gap-1 mt-1">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {user.college}
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-1 text-base font-bold text-amber-400">
                  <Star className="h-4 w-4 fill-amber-400" />
                  {user.rating}
                </div>
                <span className="text-[10px] text-slate-400">{user.reviewsCount} reviews</span>
              </div>

              <div className="flex flex-col items-center px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-1 text-base font-bold text-indigo-400 font-mono">
                  <Zap className="h-4 w-4 text-amber-400" />
                  {user.karmaPoints}
                </div>
                <span className="text-[10px] text-slate-400">Karma pts</span>
              </div>

              <div className="flex flex-col items-center px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {user.swapsCompleted}
                </span>
                <span className="text-[10px] text-slate-400">Swaps</span>
              </div>
            </div>

          </div>

          {/* Bio */}
          <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-4">
            {user.bio}
          </p>

          {/* Badges */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mr-1">
              Badges:
            </span>
            {user.badges.map((b) => (
              <Badge key={b} variant="purple" className="flex items-center gap-1 text-xs">
                <Award className="h-3 w-3" />
                {b}
              </Badge>
            ))}
          </div>

          {/* Availability */}
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span>Availability: <strong className="text-slate-200">{user.availability}</strong></span>
          </div>

        </div>

        {/* Skills They Teach */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-indigo-400" />
              Skills They Teach ({userSkills.length})
            </h4>
          </div>

          {userSkills.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No skills currently listed.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {userSkills.map((skill) => (
                <Card
                  key={skill.id}
                  className="p-4 border-slate-800 bg-slate-900/60 hover:border-indigo-500/40 transition-all rounded-xl"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge variant="cyan">{skill.category}</Badge>
                      <h5 className="mt-2 text-xs font-bold text-white">{skill.title}</h5>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ~{skill.estimatedHours}h
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                    {skill.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-500 font-medium">
                      Level: {skill.level}
                    </span>
                    {!isMe && (
                      <Button
                        onClick={() => {
                          onClose();
                          onProposeSwap(skill, user);
                        }}
                        variant="glow"
                        size="sm"
                        className="text-xs py-1 h-7"
                      >
                        <ArrowLeftRight className="h-3 w-3" /> Propose Swap
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Skills They Want to Learn */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Skills They Are Eager to Learn (Trade Opportunities)
          </h4>
          <div className="flex flex-wrap gap-2">
            {user.skillsLearning.map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300"
              >
                <Target className="h-3 w-3 text-purple-400" />
                <span>{topic}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Peer Reviews & Endorsements */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4 text-amber-400" />
            Peer Testimonials ({reviews.length})
          </h4>

          {reviews.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No reviews yet.</p>
          ) : (
            <div className="space-y-2.5">
              {reviews.map((rev) => {
                const reviewer = userMap[rev.fromUserId];
                return (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/60 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {reviewer && (
                          <Avatar src={reviewer.avatar} fallback={reviewer.name[0]} size="sm" />
                        )}
                        <div>
                          <strong className="text-white">{reviewer?.name || "Student"}</strong>
                          <span className="text-[10px] text-slate-500 ml-1.5">
                            ({reviewer?.college})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="h-3 w-3 fill-amber-400" />
                        {rev.rating}.0
                      </div>
                    </div>
                    <p className="mt-2 text-slate-300 italic">"{rev.comment}"</p>
                    <span className="mt-1.5 inline-block text-[10px] text-indigo-400 font-mono">
                      Topic: {rev.skillName}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </Modal>
  );
}
