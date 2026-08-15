import React, { useState } from "react";
import { Skill, SkillCategory, SkillLevel, SessionType, User } from "@/types";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onAddSkill: (skill: Omit<Skill, "id" | "createdAt">) => void;
}

const CATEGORIES: SkillCategory[] = [
  "AI & Machine Learning",
  "Full-Stack Web",
  "UI/UX & Product Design",
  "3D & Game Dev",
  "Cybersecurity & Systems",
  "Data Science & Analytics",
  "Mobile Development",
  "Music & Audio",
  "Languages & Culture",
  "Career & Speaking",
];

export function AddSkillModal({
  isOpen,
  onClose,
  currentUser,
  onAddSkill,
}: AddSkillModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<SkillCategory>("Full-Stack Web");
  const [level, setLevel] = useState<SkillLevel>("Intermediate");
  const [sessionType, setSessionType] = useState<SessionType>("1-on-1 Swap");
  const [estimatedHours, setEstimatedHours] = useState(2);
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("React, Tailwind, Architecture");
  const [takeaway1, setTakeaway1] = useState("Hands-on architecture patterns");
  const [takeaway2, setTakeaway2] = useState("Live code review and bug debugging");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const whatYouWillLearn = [takeaway1.trim(), takeaway2.trim()].filter((t) => t.length > 0);

    onAddSkill({
      userId: currentUser.id,
      title: title.trim(),
      category,
      level,
      sessionType,
      estimatedHours: Number(estimatedHours),
      description: description.trim(),
      tags: tags.length > 0 ? tags : ["Coding", "PeerLearning"],
      whatYouWillLearn,
    });

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
    });

    // Reset and close
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2 text-lg">
          <PlusCircle className="h-5 w-5 text-indigo-400" />
          <span>List a Skill You Can Teach</span>
        </div>
      }
      description="Offer your expertise to campus peers. Earn karma points & trade for skills you want to learn."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Skill Title */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Skill / Topic Title *
          </label>
          <Input
            type="text"
            required
            placeholder="e.g. Next.js 15 App Router & Server Actions, or PyTorch LLM Fine-Tuning"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Category & Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as SkillCategory)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900 px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Proficiency Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as SkillLevel)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900 px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Beginner">Beginner (Foundations & Syntax)</option>
              <option value="Intermediate">Intermediate (Real-world Projects)</option>
              <option value="Advanced">Advanced (Production & Optimization)</option>
              <option value="Expert">Expert (Architecture & Deep Mastery)</option>
            </select>
          </div>
        </div>

        {/* Format & Session Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Exchange Format
            </label>
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value as SessionType)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900 px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1-on-1 Swap">1-on-1 Peer Swap</option>
              <option value="Direct Mentorship">Direct Mentorship</option>
              <option value="Pair Collaboration">Pair Collaboration</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Estimated Duration (Hours)
            </label>
            <Input
              type="number"
              min="0.5"
              max="6"
              step="0.5"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(parseFloat(e.target.value))}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            What will you teach & how will you help? *
          </label>
          <Textarea
            required
            rows={3}
            placeholder="Describe what you will cover, your teaching style, and any project templates you will provide..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Takeaways */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            What will the student walk away with?
          </label>
          <Input
            placeholder="Takeaway 1: e.g. Configured GitHub starter template"
            value={takeaway1}
            onChange={(e) => setTakeaway1(e.target.value)}
          />
          <Input
            placeholder="Takeaway 2: e.g. Deploying to production on Vercel"
            value={takeaway2}
            onChange={(e) => setTakeaway2(e.target.value)}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Tags (comma separated)
          </label>
          <Input
            placeholder="e.g. Next.js, TypeScript, Tailwind, GraphQL"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" onClick={onClose} variant="ghost" size="sm">
            Cancel
          </Button>
          <Button type="submit" variant="gradient" size="md">
            Publish Teachable Skill (+50 Karma)
          </Button>
        </div>

      </form>
    </Modal>
  );
}
