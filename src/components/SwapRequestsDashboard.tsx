import React, { useState } from "react";
import { SwapRequest, Skill, User } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import {
  ArrowLeftRight,
  Check,
  X,
  Video,
  Clock,
  Sparkles,
  ExternalLink,
  Star,
  CheckCircle2,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import confetti from "canvas-confetti";

interface SwapRequestsDashboardProps {
  currentUser: User;
  users: User[];
  skills: Skill[];
  swaps: {
    incoming: SwapRequest[];
    outgoing: SwapRequest[];
    active: SwapRequest[];
    completed: SwapRequest[];
  };
  onAcceptSwap: (swapId: string) => void;
  onDeclineSwap: (swapId: string) => void;
  onOpenSessionRoom: (swap: SwapRequest) => void;
  onOpenReviewModal: (swap: SwapRequest, targetUser: User) => void;
  onViewProfile: (user: User) => void;
  onExploreSkills: () => void;
}

export function SwapRequestsDashboard({
  currentUser,
  users,
  skills,
  swaps,
  onAcceptSwap,
  onDeclineSwap,
  onOpenSessionRoom,
  onOpenReviewModal,
  onViewProfile,
  onExploreSkills,
}: SwapRequestsDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("incoming");

  const userMap: { [id: string]: User } = {};
  users.forEach((u) => (userMap[u.id] = u));

  const skillMap: { [id: string]: Skill } = {};
  skills.forEach((s) => (skillMap[s.id] = s));

  const handleAcceptWithConfetti = (swapId: string) => {
    onAcceptSwap(swapId);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#a855f7", "#38bdf8", "#34d399"],
    });
  };

  const tabsConfig = [
    {
      id: "incoming",
      label: "Incoming Proposals",
      count: swaps.incoming.length,
      icon: <ArrowLeftRight className="h-4 w-4" />,
    },
    {
      id: "active",
      label: "Active Sessions",
      count: swaps.active.length,
      icon: <Video className="h-4 w-4 text-emerald-400" />,
    },
    {
      id: "outgoing",
      label: "Sent Requests",
      count: swaps.outgoing.length,
      icon: <Clock className="h-4 w-4 text-purple-400" />,
    },
    {
      id: "completed",
      label: "Completed Swaps",
      count: swaps.completed.length,
      icon: <CheckCircle2 className="h-4 w-4 text-slate-400" />,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
            <Sparkles className="h-4 w-4" /> Exchange Central
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            My Skill Swaps & Requests
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage incoming trade offers, coordinate live sessions, and track exchange history.
          </p>
        </div>

        <Button
          onClick={onExploreSkills}
          variant="outline"
          size="sm"
          className="self-start sm:self-auto"
        >
          Browse More Skills
        </Button>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <Tabs
          tabs={tabsConfig}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab)}
          className="w-full sm:w-auto"
        />
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        
        {/* 1. INCOMING PROPOSALS */}
        {activeTab === "incoming" && (
          <div className="space-y-4">
            {swaps.incoming.length === 0 ? (
              <div className="py-16 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8">
                <ArrowLeftRight className="mx-auto h-10 w-10 text-slate-600 mb-3" />
                <h3 className="text-base font-bold text-white">No incoming swap proposals right now</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  When other students want to learn your listed skills, their proposals will appear here for your review!
                </p>
              </div>
            ) : (
              swaps.incoming.map((swap) => {
                const sender = userMap[swap.senderId];
                const requestedSkill = skillMap[swap.requestedSkillId];
                const offeredSkill = swap.offeredSkillId ? skillMap[swap.offeredSkillId] : undefined;

                return (
                  <Card
                    key={swap.id}
                    className="p-5 border-indigo-500/30 bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-xl hover:border-indigo-500/60 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      
                      {/* Left: Sender & Match details */}
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          {sender && (
                            <Avatar
                              src={sender.avatar}
                              fallback={sender.name[0]}
                              size="md"
                              status={sender.status}
                            />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h4
                                onClick={() => sender && onViewProfile(sender)}
                                className="text-sm font-bold text-white hover:text-indigo-300 cursor-pointer"
                              >
                                {sender?.name}
                              </h4>
                              <span className="text-[11px] text-slate-400">
                                ({sender?.college} • {sender?.year})
                              </span>
                              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                                <Star className="h-3 w-3 fill-amber-400" />
                                {sender?.rating}
                              </div>
                            </div>
                            <span className="text-[11px] text-slate-500">
                              Proposed {new Date(swap.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Trade Matchup Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-indigo-400">
                              They want to learn:
                            </span>
                            <p className="text-xs font-semibold text-slate-200 truncate">
                              {requestedSkill?.title || "Your listed skill"}
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-emerald-400">
                              They offer in exchange:
                            </span>
                            <p className="text-xs font-semibold text-slate-200 truncate">
                              {offeredSkill ? offeredSkill.title : "1-on-1 Mentorship & Code Review"}
                            </p>
                          </div>
                        </div>

                        {/* Message pitch */}
                        {swap.message && (
                          <p className="text-xs text-slate-300 italic bg-slate-800/40 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
                            "{swap.message}"
                          </p>
                        )}

                        {/* Logistics */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="h-3.5 w-3.5 text-slate-500" /> {swap.proposedDuration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Video className="h-3.5 w-3.5 text-indigo-400" /> {swap.sessionPlatform}
                          </span>
                        </div>
                      </div>

                      {/* Right Actions */}
                      <div className="flex sm:flex-col items-center justify-end gap-2 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                        <Button
                          onClick={() => handleAcceptWithConfetti(swap.id)}
                          variant="glow"
                          size="md"
                          className="w-full sm:w-40 bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20 text-xs"
                        >
                          <Check className="h-4 w-4" /> Accept Proposal
                        </Button>
                        <Button
                          onClick={() => onDeclineSwap(swap.id)}
                          variant="ghost"
                          size="sm"
                          className="w-full sm:w-40 text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-950/20"
                        >
                          <X className="h-3.5 w-3.5" /> Decline
                        </Button>
                      </div>

                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* 2. ACTIVE COLLABORATIONS */}
        {activeTab === "active" && (
          <div className="space-y-4">
            {swaps.active.length === 0 ? (
              <div className="py-16 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8">
                <Video className="mx-auto h-10 w-10 text-slate-600 mb-3" />
                <h3 className="text-base font-bold text-white">No active live swap sessions</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Accepted proposals become active sessions with live meeting rooms and collaborative scratchpads.
                </p>
              </div>
            ) : (
              swaps.active.map((swap) => {
                const isSender = swap.senderId === currentUser.id;
                const partnerId = isSender ? swap.receiverId : swap.senderId;
                const partner = userMap[partnerId];
                const requestedSkill = skillMap[swap.requestedSkillId];
                const offeredSkill = swap.offeredSkillId ? skillMap[swap.offeredSkillId] : undefined;

                return (
                  <Card
                    key={swap.id}
                    className="p-5 border-emerald-500/30 bg-slate-900/90 rounded-2xl shadow-2xl relative overflow-hidden"
                  >
                    {/* Active Session Glow Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-3 flex-1">
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {partner && (
                              <Avatar
                                src={partner.avatar}
                                fallback={partner.name[0]}
                                size="md"
                                status={partner.status}
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <h4
                                  onClick={() => partner && onViewProfile(partner)}
                                  className="text-sm font-bold text-white hover:text-emerald-300 cursor-pointer"
                                >
                                  {partner?.name}
                                </h4>
                                <Badge variant="success">Active Session</Badge>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                {partner?.college} • {swap.scheduledTime || "Ready to connect"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Skills Being Exchanged */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 text-indigo-300 font-medium">
                            <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                            <span>{requestedSkill?.title || "Skill 1"}</span>
                          </span>
                          <ArrowLeftRight className="h-3.5 w-3.5 text-slate-500" />
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-emerald-300 font-medium">
                            <Lightbulb className="h-3.5 w-3.5 text-emerald-400" />
                            <span>{offeredSkill?.title || "Skill 2"}</span>
                          </span>
                        </div>

                        {/* Meeting details */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                          <span className="flex items-center gap-1.5 font-mono text-emerald-400">
                            <Video className="h-4 w-4" /> {swap.sessionPlatform}
                          </span>
                          {swap.meetingLink && (
                            <a
                              href={swap.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 underline font-mono text-xs"
                            >
                              {swap.meetingLink}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>

                      </div>

                      {/* Right actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                        <Button
                          onClick={() => onOpenSessionRoom(swap)}
                          variant="glow"
                          size="md"
                          className="w-full sm:w-44 text-xs font-semibold"
                        >
                          <Video className="h-4 w-4" /> Open Workspace Room
                        </Button>
                        <Button
                          onClick={() => partner && onOpenReviewModal(swap, partner)}
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-44 text-xs text-amber-300 border-amber-500/40 hover:bg-amber-950/20"
                        >
                          <Star className="h-3.5 w-3.5 fill-amber-400" /> Complete & Rate Peer
                        </Button>
                      </div>

                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* 3. SENT PROPOSALS */}
        {activeTab === "outgoing" && (
          <div className="space-y-4">
            {swaps.outgoing.length === 0 ? (
              <div className="py-16 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8">
                <Clock className="mx-auto h-10 w-10 text-slate-600 mb-3" />
                <h3 className="text-base font-bold text-white">No pending sent requests</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Find a student teaching a skill you want to learn and send a swap proposal!
                </p>
                <Button onClick={onExploreSkills} variant="outline" size="sm" className="mt-4">
                  Find Peers to Swap With
                </Button>
              </div>
            ) : (
              swaps.outgoing.map((swap) => {
                const target = userMap[swap.receiverId];
                const requestedSkill = skillMap[swap.requestedSkillId];
                const offeredSkill = swap.offeredSkillId ? skillMap[swap.offeredSkillId] : undefined;

                return (
                  <Card key={swap.id} className="p-5 border-slate-800 bg-slate-900/60 rounded-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          {target && <Avatar src={target.avatar} fallback={target.name[0]} size="sm" />}
                          <div>
                            <h4 className="text-sm font-bold text-white">
                              Sent proposal to {target?.name || "Student"}
                            </h4>
                            <p className="text-xs text-slate-400">
                              Requested skill: <strong className="text-slate-200">{requestedSkill?.title}</strong>
                            </p>
                          </div>
                        </div>

                        {offeredSkill && (
                          <p className="text-xs text-slate-400">
                            Offered in return: <span className="text-emerald-400">{offeredSkill.title}</span>
                          </p>
                        )}
                        <p className="text-[11px] text-slate-500 font-mono">
                          Duration: {swap.proposedDuration} • Platform: {swap.sessionPlatform}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant="warning" className="animate-pulse">
                          Awaiting Response
                        </Badge>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* 4. COMPLETED SWAPS */}
        {activeTab === "completed" && (
          <div className="space-y-4">
            {swaps.completed.length === 0 ? (
              <div className="py-16 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8">
                <CheckCircle2 className="mx-auto h-10 w-10 text-slate-600 mb-3" />
                <h3 className="text-base font-bold text-white">No completed swaps recorded yet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Completed sessions and endorsements will be archived here.
                </p>
              </div>
            ) : (
              swaps.completed.map((swap) => {
                const isSender = swap.senderId === currentUser.id;
                const partnerId = isSender ? swap.receiverId : swap.senderId;
                const partner = userMap[partnerId];
                const requestedSkill = skillMap[swap.requestedSkillId];

                return (
                  <Card key={swap.id} className="p-5 border-slate-800/80 bg-slate-900/40 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {partner && <Avatar src={partner.avatar} fallback={partner.name[0]} size="sm" />}
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            Exchange with {partner?.name}
                          </h4>
                          <p className="text-xs text-slate-400">
                            Topic: {requestedSkill?.title || "Skill Session"}
                          </p>
                        </div>
                      </div>

                      <Badge variant={swap.status === "completed" ? "success" : "rose"}>
                        {swap.status === "completed" ? "Completed (+100 Karma)" : "Declined"}
                      </Badge>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

      </div>
    </div>
  );
}
