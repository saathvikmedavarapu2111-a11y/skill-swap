import React, { useState } from "react";
import { User, SwapRequest, Skill } from "@/types";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Star, Award, Check } from "lucide-react";
import confetti from "canvas-confetti";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: User | null;
  swap: SwapRequest | null;
  currentUser: User;
  allSkills: Skill[];
  onSubmitReview: (targetUserId: string, swapRequestId: string, rating: number, comment: string, skillName: string) => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  targetUser,
  swap,
  _currentUser,
  allSkills,
  onSubmitReview,
}: ReviewModalProps & { _currentUser?: User }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedBadges, setSelectedBadges] = useState<string[]>(["Great Explainer", "Patient Mentor"]);

  if (!targetUser || !swap) return null;

  const skill = allSkills.find((s) => s.id === swap.requestedSkillId);
  const skillName = skill?.title || "Skill Exchange Session";

  const badgeOptions = [
    "Great Explainer",
    "Patient Mentor",
    "Deep Technical Mastery",
    "Well Prepared",
    "Super Friendly",
    "Fast Debugger",
  ];

  const toggleBadge = (b: string) => {
    if (selectedBadges.includes(b)) {
      setSelectedBadges(selectedBadges.filter((x) => x !== b));
    } else {
      setSelectedBadges([...selectedBadges, b]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalComment = comment.trim() || `Awesome skill exchange session with ${targetUser.name}! Very clear explanations and practical knowledge.`;
    
    onSubmitReview(targetUser.id, swap.id, rating, finalComment, skillName);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ["#6366f1", "#eab308", "#10b981", "#ec4899"],
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
          <span>Rate & Endorse Peer</span>
        </div>
      }
      description={`Leave feedback for ${targetUser.name} to help them earn karma and verified peer badges.`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* User Card */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <Avatar src={targetUser.avatar} fallback={targetUser.name[0]} size="md" />
          <div>
            <h4 className="text-sm font-bold text-white">{targetUser.name}</h4>
            <p className="text-xs text-slate-400">
              Exchange Topic: <strong className="text-slate-200">{skillName}</strong>
            </p>
          </div>
        </div>

        {/* 5-Star Selector */}
        <div className="text-center py-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Overall Rating
          </label>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      active ? "fill-amber-400 text-amber-400" : "text-slate-700 hover:text-slate-500"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <span className="mt-1 block text-xs font-bold text-amber-300">
            {rating === 5 && "Exceptional Mentor (5/5)"}
            {rating === 4 && "Great Session (4/5)"}
            {rating === 3 && "Good (3/5)"}
            {rating <= 2 && "Needs Improvement"}
          </span>
        </div>

        {/* Endorsement Badges */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Select Peer Endorsements:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {badgeOptions.map((b) => {
              const isSelected = selectedBadges.includes(b);
              return (
                <button
                  type="button"
                  key={b}
                  onClick={() => toggleBadge(b)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    isSelected
                      ? "bg-indigo-600/30 border-indigo-500 text-indigo-200"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <Award className="h-3 w-3" />
                  {b}
                  {isSelected && <Check className="h-3 w-3 text-indigo-400 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Review Comment */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Feedback & Testimonial
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Tell others what made learning with ${targetUser.name} great...`}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" onClick={onClose} variant="ghost" size="sm">
            Skip
          </Button>
          <Button type="submit" variant="glow" size="md">
            Submit Rating & Award Karma (+100)
          </Button>
        </div>

      </form>
    </Modal>
  );
}
