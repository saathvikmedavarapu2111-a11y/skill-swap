import React, { useState, useEffect, useRef } from "react";
import { SwapRequest, Skill, User, ChatMessage } from "@/types";
import { Modal } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Send,
  Code2,
  FileText,
  Clock,
  Star,
  CheckSquare,
  Copy,
  Check,
  MessageSquare,
} from "lucide-react";
import { db } from "@/services/db";

interface LiveSessionRoomProps {
  isOpen: boolean;
  onClose: () => void;
  swap: SwapRequest | null;
  currentUser: User;
  allUsers: User[];
  allSkills: Skill[];
  onCompleteAndReview: (swap: SwapRequest, targetUser: User) => void;
}

interface LiveSessionRoomContentProps {
  isOpen: boolean;
  onClose: () => void;
  swap: SwapRequest;
  currentUser: User;
  allUsers: User[];
  allSkills: Skill[];
  onCompleteAndReview: (swap: SwapRequest, targetUser: User) => void;
}

function LiveSessionRoomContent({
  isOpen,
  onClose,
  swap,
  currentUser,
  allUsers,
  allSkills,
  onCompleteAndReview,
}: LiveSessionRoomContentProps) {
  const userMap: { [id: string]: User } = {};
  allUsers.forEach((u) => (userMap[u.id] = u));

  const skillMap: { [id: string]: Skill } = {};
  allSkills.forEach((s) => (skillMap[s.id] = s));

  const isSender = swap.senderId === currentUser.id;
  const partnerId = isSender ? swap.receiverId : swap.senderId;
  const partner = userMap[partnerId];

  const requestedSkill = skillMap[swap.requestedSkillId];
  const offeredSkill = swap.offeredSkillId ? skillMap[swap.offeredSkillId] : undefined;

  // Session states
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [seconds, setSeconds] = useState(1450); // Start with an active session time
  const [timerRunning] = useState(true);
  const [activeTab, setActiveTab] = useState<"notes" | "code" | "goals">("notes");
  const [copiedLink, setCopiedLink] = useState(false);

  // Collaborative notepad & code state
  const [sharedNotes, setSharedNotes] = useState(
    `# SkillSwap Collaborative Workspace\n\n**Topic 1:** ${requestedSkill?.title || "Key Concept"}\n- Break down core data structures\n- Live coding example\n\n**Topic 2:** ${offeredSkill?.title || "Counter-skill Exchange"}\n- Architecture walkthrough & QA\n- Useful resources & links\n`
  );

  const [sharedCode, setSharedCode] = useState(
    `// Live Code Sandbox
import React, { useState } from 'react';

export function SkillExchangeDemo() {
  const [status, setStatus] = useState("Connected");
  
  return (
    <div className="p-4 bg-slate-900 text-white rounded-xl">
      <h2>Collaborative Session in Progress</h2>
      <p>Status: {status}</p>
    </div>
  );
}`
  );

  const [goals, setGoals] = useState([
    { id: "1", text: "Walkthrough project architecture", completed: true },
    { id: "2", text: "Debug custom animation & state flow", completed: true },
    { id: "3", text: "Exchange questions & portfolio advice", completed: false },
  ]);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (swap) {
      setMessages(db.getMessages(swap.id));
    }
  }, [swap]);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const msg = db.sendMessage(
      swap.id,
      currentUser.id,
      currentUser.name,
      currentUser.avatar,
      newMessageText.trim()
    );
    setMessages((prev) => [...prev, msg]);
    setNewMessageText("");

    // Simulate partner response if sent
    if (partner) {
      setTimeout(() => {
        const autoReplies = [
          "Got it! That makes total sense.",
          "Awesome point! Let's test this in the sandbox.",
          "Check out the code in the editor tab, just updated it!",
          "Great question! Here's how I approach that problem...",
        ];
        const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
        const partnerMsg = db.sendMessage(
          swap.id,
          partner.id,
          partner.name,
          partner.avatar,
          randomReply
        );
        setMessages((prev) => [...prev, partnerMsg]);
      }, 1200);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(swap.meetingLink || window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const toggleGoal = (goalId: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, completed: !g.completed } : g))
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={
        <div className="flex items-center justify-between w-full pr-6">
          <div className="flex items-center gap-2 text-base">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-white">Live Skill Exchange Room</span>
            <Badge variant="success">Active Session</Badge>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatTime(seconds)}</span>
          </div>
        </div>
      }
      description={`Collaborative session between ${currentUser.name} and ${partner?.name || "Peer"}`}
    >
      <div className="space-y-4">
        {/* Top Control & Video Simulation Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Video Tile 1: Current User */}
          <div className="relative h-44 rounded-2xl border border-slate-800 bg-slate-950/80 flex flex-col items-center justify-center overflow-hidden group">
            {videoOn ? (
              <div className="flex flex-col items-center">
                <Avatar src={currentUser.avatar} fallback={currentUser.name[0]} size="lg" />
                <span className="mt-2 text-xs font-semibold text-white">{currentUser.name} (You)</span>
                <span className="text-[10px] text-slate-400">
                  Teaching: {isSender ? offeredSkill?.title : requestedSkill?.title}
                </span>
              </div>
            ) : (
              <div className="text-center text-slate-500 text-xs">
                <VideoOff className="mx-auto h-6 w-6 mb-1 text-slate-600" />
                Camera Off
              </div>
            )}

            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-white">
              {micOn ? <Mic className="h-3 w-3 text-emerald-400" /> : <MicOff className="h-3 w-3 text-rose-400" />}
              <span>{currentUser.name.split(" ")[0]}</span>
            </div>
          </div>

          {/* Video Tile 2: Peer */}
          <div className="relative h-44 rounded-2xl border border-indigo-500/30 bg-slate-950/80 flex flex-col items-center justify-center overflow-hidden group">
            <div className="flex flex-col items-center">
              <Avatar src={partner?.avatar} fallback={partner?.name[0] || "P"} size="lg" status="online" />
              <span className="mt-2 text-xs font-semibold text-white">{partner?.name}</span>
              <span className="text-[10px] text-indigo-300">
                Teaching: {isSender ? requestedSkill?.title : offeredSkill?.title}
              </span>
            </div>

            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-white">
              <Mic className="h-3 w-3 text-emerald-400" />
              <span>{partner?.name.split(" ")[0]} ({partner?.college})</span>
            </div>

            <div className="absolute top-2 right-2">
              <Badge variant="cyan" className="text-[10px]">Connected</Badge>
            </div>
          </div>
        </div>

        {/* Media Toolbar Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-2.5 rounded-xl border transition-all ${
                micOn
                  ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                  : "bg-rose-500/20 border-rose-500/40 text-rose-300"
              }`}
              title={micOn ? "Mute Mic" : "Unmute Mic"}
            >
              {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setVideoOn(!videoOn)}
              className={`p-2.5 rounded-xl border transition-all ${
                videoOn
                  ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                  : "bg-rose-500/20 border-rose-500/40 text-rose-300"
              }`}
              title={videoOn ? "Turn Camera Off" : "Turn Camera On"}
            >
              {videoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white transition-all"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedLink ? "Link Copied!" : "Copy Meeting Link"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => partner && onCompleteAndReview(swap, partner)}
              variant="glow"
              size="sm"
              className="text-xs bg-amber-600 hover:bg-amber-500 border-amber-400/30 text-white"
            >
              <Star className="h-3.5 w-3.5 fill-white" /> Finish & Rate Peer
            </Button>
          </div>
        </div>

        {/* Workspace Split: Editor & Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Collaborative Workspace Tabs (7 Cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 flex flex-col h-80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
                    activeTab === "notes"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" /> Shared Notes
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
                    activeTab === "code"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Code2 className="h-3.5 w-3.5" /> Code Sandbox
                </button>
                <button
                  onClick={() => setActiveTab("goals")}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
                    activeTab === "goals"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <CheckSquare className="h-3.5 w-3.5" /> Goal Checklist
                </button>
              </div>

              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live Syncing
              </span>
            </div>

            <div className="mt-3 flex-1 overflow-y-auto">
              {activeTab === "notes" && (
                <textarea
                  value={sharedNotes}
                  onChange={(e) => setSharedNotes(e.target.value)}
                  className="w-full h-full bg-transparent text-xs text-slate-200 focus:outline-none resize-none font-mono leading-relaxed"
                  placeholder="Type shared lesson notes and takeaways..."
                />
              )}

              {activeTab === "code" && (
                <textarea
                  value={sharedCode}
                  onChange={(e) => setSharedCode(e.target.value)}
                  className="w-full h-full bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-indigo-200 font-mono focus:outline-none resize-none leading-relaxed"
                  placeholder="// Paste or write code snippets here..."
                />
              )}

              {activeTab === "goals" && (
                <div className="space-y-2">
                  {goals.map((g) => (
                    <div
                      key={g.id}
                      onClick={() => toggleGoal(g.id)}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 cursor-pointer hover:bg-slate-900"
                    >
                      <input
                        type="checkbox"
                        checked={g.completed}
                        onChange={() => {}}
                        className="rounded border-slate-700 text-indigo-600"
                      />
                      <span className={`text-xs ${g.completed ? "line-through text-slate-500" : "text-slate-200"}`}>
                        {g.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Live Chat Box (5 Cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 flex flex-col h-80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
                <span>Exchange Chat</span>
              </span>
              <span className="text-[10px] text-slate-500">{messages.length} messages</span>
            </div>

            {/* Message Feed */}
            <div className="mt-3 flex-1 overflow-y-auto space-y-2.5 pr-1">
              {messages.map((m) => {
                const isMe = m.senderId === currentUser.id;
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2 ${isMe ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar src={m.senderAvatar} fallback={m.senderName[0]} size="sm" />
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs ${
                        isMe
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50"
                      }`}
                    >
                      <p className="leading-relaxed">{m.text}</p>
                      <span className="mt-1 block text-[9px] opacity-60 text-right">
                        {m.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Type a message..."
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function LiveSessionRoom(props: LiveSessionRoomProps) {
  if (!props.isOpen || !props.swap) return null;
  return <LiveSessionRoomContent {...props} swap={props.swap} />;
}
