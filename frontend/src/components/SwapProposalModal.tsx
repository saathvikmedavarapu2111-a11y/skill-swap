import React, { useState } from "react";
import { Skill, User, SwapRequest } from "@/types";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  ArrowLeftRight,
  Send,
  CheckCircle,
} from "lucide-react";

interface SwapProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSkill: Skill | null;
  targetUser: User | null;
  currentUser: User;
  userTeachableSkills: Skill[];
  onSubmitProposal: (
    targetSkillId: string,
    targetUserId: string,
    offeredSkillId: string | undefined,
    message: string,
    platform: SwapRequest["sessionPlatform"],
    duration: string
  ) => void;
}

export function SwapProposalModal({
  isOpen,
  onClose,
  targetSkill,
  targetUser,
  currentUser,
  userTeachableSkills,
  onSubmitProposal,
}: SwapProposalModalProps) {
  const [selectedOfferSkillId, setSelectedOfferSkillId] = useState<string>(
    userTeachableSkills[0]?.id || ""
  );
  const [sessionPlatform, setSessionPlatform] = useState<SwapRequest["sessionPlatform"]>("Google Meet");
  const [duration, setDuration] = useState<string>("1 Hour (Split 30m / 30m)");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!targetSkill || !targetUser) return null;

  const offeredSkill = userTeachableSkills.find((s) => s.id === selectedOfferSkillId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const defaultMsg = message.trim() || `Hey ${targetUser.name}! I'd love to learn ${targetSkill.title} from you. In return, I can teach you ${offeredSkill ? offeredSkill.title : "my skills"}!`;

    setTimeout(() => {
      onSubmitProposal(
        targetSkill.id,
        targetUser.id,
        selectedOfferSkillId || undefined,
        defaultMsg,
        sessionPlatform,
        duration
      );
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2 text-lg">
          <ArrowLeftRight className="h-5 w-5 text-indigo-400" />
          <span>Propose Skill Swap</span>
        </div>
      }
      description="Design your 1-on-1 peer exchange offer and agree on session logistics."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Exchange Matchup Banner */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            
            {/* Target Student */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <Avatar src={targetUser.avatar} fallback={targetUser.name[0]} size="md" />
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  You Learn From
                </span>
                <h4 className="text-xs font-bold text-white truncate">{targetUser.name}</h4>
                <p className="text-[11px] text-slate-300 font-semibold truncate">
                  {targetSkill.title}
                </p>
              </div>
            </div>

            {/* Current User */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <Avatar src={currentUser.avatar} fallback={currentUser.name[0]} size="md" />
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  You Teach in Return
                </span>
                <h4 className="text-xs font-bold text-white truncate">{currentUser.name}</h4>
                <p className="text-[11px] text-slate-300 font-semibold truncate">
                  {offeredSkill ? offeredSkill.title : "General Mentorship"}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Pick Your Teachable Skill to Offer */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            1. Select Which Skill You Offer To Teach:
          </label>
          {userTeachableSkills.length === 0 ? (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              You haven't listed any teachable skills yet. You can still send a mentorship request or post a skill first!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 max-h-44 overflow-y-auto pr-1">
              {userTeachableSkills.map((s) => {
                const isSelected = selectedOfferSkillId === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedOfferSkillId(s.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-950/30 text-white shadow-md"
                        : "border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300"
                    }`}
                  >
                    <div>
                      <h5 className="text-xs font-bold text-slate-100">{s.title}</h5>
                      <span className="text-[10px] text-slate-400">{s.category} • {s.level}</span>
                    </div>
                    {isSelected && <CheckCircle className="h-4 w-4 text-indigo-400" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Platform & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Preferred Platform
            </label>
            <select
              value={sessionPlatform}
              onChange={(e) => setSessionPlatform(e.target.value as any)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900 px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Google Meet">Google Meet</option>
              <option value="Discord">Discord Voice / Screen Share</option>
              <option value="Zoom">Zoom</option>
              <option value="Campus Library / In-Person">Campus Library / In-Person</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Proposed Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900 px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="45 Mins (Quick Intro & Demo)">45 Mins (Quick Intro & Demo)</option>
              <option value="1 Hour (Split 30m / 30m)">1 Hour (Split 30m / 30m)</option>
              <option value="1.5 Hours (Deep Dive)">1.5 Hours (Deep Dive)</option>
              <option value="2 Hours (Project Pair Build)">2 Hours (Project Pair Build)</option>
            </select>
          </div>
        </div>

        {/* Intro Message */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Intro Pitch / What you want to focus on:
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Hey ${targetUser.name}! I'm working on a project and would love your guidance on ${targetSkill.title}. In exchange, I can teach you...`}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" onClick={onClose} variant="ghost" size="sm">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="glow"
            size="md"
            disabled={isSubmitting}
            className="min-w-[150px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Send className="h-4 w-4" /> Send Swap Proposal
              </span>
            )}
          </Button>
        </div>

      </form>
    </Modal>
  );
}
