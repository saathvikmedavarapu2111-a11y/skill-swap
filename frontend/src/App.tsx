import React, { useState, useEffect } from "react";
import { User, Skill, SwapRequest, SkillCategory, Review, Notification } from "@/types";
import { db } from "@/services/db";
import { authApi } from "@/services/authApi";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SkillExplorer } from "@/components/SkillExplorer";
import { SwapRequestsDashboard } from "@/components/SwapRequestsDashboard";
import { Leaderboard } from "@/components/Leaderboard";
import { SwapProposalModal } from "@/components/SwapProposalModal";
import { AddSkillModal } from "@/components/AddSkillModal";
import { StudentProfileModal } from "@/components/StudentProfileModal";
import { LiveSessionRoom } from "@/components/LiveSessionRoom";
import { ReviewModal } from "@/components/ReviewModal";
import { LoginModal } from "@/components/LoginModal";
import SpotlightPreview from "@/components/spotlight-demo";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Heart,
  CheckCircle2,
  ArrowLeftRight,
} from "lucide-react";

const GUEST_USER: User = {
  id: "usr_guest",
  name: "Guest",
  handle: "@guest",
  avatar: "",
  college: "",
  major: "",
  year: "",
  bio: "",
  karmaPoints: 0,
  swapsCompleted: 0,
  rating: 5.0,
  reviewsCount: 0,
  badges: [],
  skillsTeaching: [],
  skillsLearning: [],
  availability: "",
  socialLinks: {},
  status: "online",
};

export function App() {
  // Global Data State
  const [currentUser, setCurrentUser] = useState<User>(GUEST_USER);
  const [allUsers, setAllUsers] = useState<User[]>(db.getUsers());
  const [allSkills, setAllSkills] = useState<Skill[]>(db.getSkills());
  const [swaps, setSwaps] = useState(db.getSwapsForUser(currentUser.id));
  const [notifications, setNotifications] = useState<Notification[]>(
    db.getNotifications(currentUser.id)
  );
  const [allReviews, setAllReviews] = useState<Review[]>(db.getReviews());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Navigation State
  const [activeView, setActiveView] = useState<string>("explore");
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>("All Categories");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Modals State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [proposalTargetSkill, setProposalTargetSkill] = useState<Skill | null>(null);
  const [proposalTargetUser, setProposalTargetUser] = useState<User | null>(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedProfileUser, setSelectedProfileUser] = useState<User | null>(null);

  const [isSessionRoomOpen, setIsSessionRoomOpen] = useState(false);
  const [activeSessionSwap, setActiveSessionSwap] = useState<SwapRequest | null>(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewTargetUser, setReviewTargetUser] = useState<User | null>(null);
  const [reviewSwap, setReviewSwap] = useState<SwapRequest | null>(null);

  // Check existing JWT authentication on initial mount; if none, show login popup immediately
  useEffect(() => {
    async function initAuth() {
      const existingUser = await authApi.getMe();
      if (existingUser) {
        setCurrentUser(existingUser);
        db.setCurrentUser(existingUser.id);
        setIsAuthenticated(true);
        setSwaps(db.getSwapsForUser(existingUser.id));
        setNotifications(db.getNotifications(existingUser.id));
      } else {
        // Initial entry without token: start in Guest mode and show login popup immediately
        setCurrentUser(GUEST_USER);
        setIsAuthenticated(false);
        setIsLoginOpen(true);
      }
    }
    initAuth();
  }, []);

  // Sync state when current user or data changes
  const refreshData = () => {
    const updatedUsers = db.getUsers();
    setAllUsers(updatedUsers);
    setAllSkills(db.getSkills());
    setSwaps(db.getSwapsForUser(currentUser.id));
    setNotifications(db.getNotifications(currentUser.id));
    setAllReviews(db.getReviews());
  };

  const handleSelectUser = (userId: string) => {
    const targetUser = allUsers.find((u) => u.id === userId);
    if (targetUser) {
      setCurrentUser(targetUser);
      db.setCurrentUser(userId);
      setSwaps(db.getSwapsForUser(userId));
      setNotifications(db.getNotifications(userId));
      showToast(`Switched active view to ${targetUser.name}`);
    }
  };

  // Handle successful login from LoginModal
  const handleLoginSuccess = (user: User) => {
    db.setCurrentUser(user.id);
    setCurrentUser(user);
    setIsAuthenticated(true);
    setSwaps(db.getSwapsForUser(user.id));
    setNotifications(db.getNotifications(user.id));
    refreshData();
    showToast(`Welcome back, ${user.name}!`);
  };

  // Handle Guest Mode
  const handleLoginAsGuest = () => {
    authApi.clearToken();
    setCurrentUser(GUEST_USER);
    setIsAuthenticated(false);
    showToast("Exploring SkillSwap as Guest");
  };

  // Handle Logout
  const handleLogout = async () => {
    await authApi.logout();
    setCurrentUser(GUEST_USER);
    setIsAuthenticated(false);
    showToast("Logged out of SkillSwap session");
    setIsLoginOpen(true);
  };

  // Open add skill modal (guards against unauthenticated guest)
  const handleOpenAddSkill = () => {
    if (!isAuthenticated) {
      showToast("Please sign in or create an account to teach a skill");
      setIsLoginOpen(true);
      return;
    }
    setIsAddSkillOpen(true);
  };

  // Open swap proposal (guards against unauthenticated guest)
  const handleOpenProposal = (skill: Skill, targetUser: User) => {
    if (!isAuthenticated) {
      showToast("Please sign in or create an account to propose a skill swap");
      setIsLoginOpen(true);
      return;
    }
    setProposalTargetSkill(skill);
    setProposalTargetUser(targetUser);
    setIsProposalOpen(true);
  };

  // Submit swap proposal
  const handleSubmitProposal = (
    targetSkillId: string,
    targetUserId: string,
    offeredSkillId: string | undefined,
    message: string,
    platform: SwapRequest["sessionPlatform"],
    duration: string
  ) => {
    db.createSwapRequest(
      currentUser.id,
      targetUserId,
      targetSkillId,
      offeredSkillId,
      message,
      platform,
      duration
    );
    refreshData();
    showToast("Swap proposal sent successfully! You can track it in My Swaps.");
    setActiveView("swaps");
  };

  // Accept swap
  const handleAcceptSwap = (swapId: string) => {
    db.updateSwapStatus(swapId, "accepted");
    refreshData();
    showToast("Proposal accepted! Live session room created.");
  };

  // Decline swap
  const handleDeclineSwap = (swapId: string) => {
    db.updateSwapStatus(swapId, "declined");
    refreshData();
    showToast("Proposal declined.");
  };

  // Add new teachable skill
  const handleAddSkill = (newSkillData: Omit<Skill, "id" | "createdAt">) => {
    db.addSkill(newSkillData);
    refreshData();
    showToast(`Published "${newSkillData.title}"! +50 Karma added to your profile.`);
    setActiveView("explore");
  };

  // Submit review
  const handleSubmitReview = (
    targetUserId: string,
    swapRequestId: string,
    rating: number,
    comment: string,
    skillName: string
  ) => {
    db.addReview({
      fromUserId: currentUser.id,
      toUserId: targetUserId,
      swapRequestId,
      rating,
      comment,
      skillName,
    });
    refreshData();
    showToast("Review submitted! Karma points awarded to your peer.");
  };

  // Open profile modal
  const handleViewProfile = (user: User) => {
    setSelectedProfileUser(user);
    setIsProfileOpen(true);
  };

  // Open live session room
  const handleOpenSessionRoom = (swap: SwapRequest) => {
    setActiveSessionSwap(swap);
    setIsSessionRoomOpen(true);
  };

  // Trigger review modal from session or dashboard
  const handleOpenReviewModal = (swap: SwapRequest, targetUser: User) => {
    setReviewSwap(swap);
    setReviewTargetUser(targetUser);
    setIsSessionRoomOpen(false);
    setIsReviewModalOpen(true);
  };

  // Reset database to initial realistic mock data
  const handleResetData = () => {
    db.resetToDefaults();
    refreshData();
    showToast("Reset demo database with fresh student profiles and skills!");
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Notifier */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-indigo-500/40 bg-slate-900/95 px-4 py-3 text-sm text-white shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentUser={currentUser}
        allUsers={allUsers}
        onSelectUser={handleSelectUser}
        activeView={activeView}
        setActiveView={setActiveView}
        pendingRequestsCount={swaps.incoming.length}
        notifications={notifications}
        onMarkNotificationRead={(id) => {
          db.markNotificationRead(id);
          refreshData();
        }}
        onMarkAllNotificationsRead={() => {
          db.markAllNotificationsRead(currentUser.id);
          refreshData();
        }}
        onOpenAddSkill={handleOpenAddSkill}
        onOpenProfile={handleViewProfile}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* VIEW 1: DISCOVER / EXPLORE */}
        {activeView === "explore" && (
          <div>
            <Hero
              onExplore={() => {
                const el = document.getElementById("skill-explorer-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              onTeach={handleOpenAddSkill}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <div id="skill-explorer-section">
              <SkillExplorer
                skills={allSkills}
                users={allUsers}
                currentUser={currentUser}
                onProposeSwap={handleOpenProposal}
                onViewProfile={handleViewProfile}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: MY SWAPS & REQUESTS */}
        {activeView === "swaps" && (
          <SwapRequestsDashboard
            currentUser={currentUser}
            users={allUsers}
            skills={allSkills}
            swaps={swaps}
            onAcceptSwap={handleAcceptSwap}
            onDeclineSwap={handleDeclineSwap}
            onOpenSessionRoom={handleOpenSessionRoom}
            onOpenReviewModal={handleOpenReviewModal}
            onViewProfile={handleViewProfile}
            onExploreSkills={() => setActiveView("explore")}
          />
        )}

        {/* VIEW 3: LEADERBOARD */}
        {activeView === "leaderboard" && (
          <Leaderboard
            users={allUsers}
            currentUser={currentUser}
            onViewProfile={handleViewProfile}
          />
        )}

        {/* VIEW 4: SPOTLIGHT DEMO SHOWCASE */}
        {activeView === "spotlight-demo" && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Spotlight Component Preview</h2>
                <p className="text-sm text-slate-400">
                  Interactive demo rendering the requested Spotlight & SpotlightPreview components.
                </p>
              </div>
              <Button onClick={() => setActiveView("explore")} variant="outline" size="sm">
                Back to SkillSwap
              </Button>
            </div>

            <SpotlightPreview />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-10 mt-16 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
              <ArrowLeftRight className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-sm text-white">SkillSwap</span>
            <span>— Peer-to-Peer Student Skill Exchange</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetData}
              className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-300 transition-colors"
              title="Reset initial student profiles and skill dataset"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Demo Data
            </button>
            <span>•</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="h-3 w-3 text-rose-500 fill-rose-500 inline" /> for Students
            </span>
          </div>
        </div>
      </footer>

      {/* MODALS */}

      {/* 1. Propose Swap Modal */}
      <SwapProposalModal
        isOpen={isProposalOpen}
        onClose={() => setIsProposalOpen(false)}
        targetSkill={proposalTargetSkill}
        targetUser={proposalTargetUser}
        currentUser={currentUser}
        userTeachableSkills={allSkills.filter((s) => s.userId === currentUser.id)}
        onSubmitProposal={handleSubmitProposal}
      />

      {/* 2. Add Teachable Skill Modal */}
      <AddSkillModal
        isOpen={isAddSkillOpen}
        onClose={() => setIsAddSkillOpen(false)}
        currentUser={currentUser}
        onAddSkill={handleAddSkill}
      />

      {/* 3. Student Profile Modal */}
      <StudentProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={selectedProfileUser}
        currentUser={currentUser}
        userSkills={allSkills.filter((s) => s.userId === selectedProfileUser?.id)}
        reviews={allReviews.filter((r) => r.toUserId === selectedProfileUser?.id)}
        allUsers={allUsers}
        onProposeSwap={handleOpenProposal}
      />

      {/* 4. Live Session Room */}
      <LiveSessionRoom
        isOpen={isSessionRoomOpen}
        onClose={() => setIsSessionRoomOpen(false)}
        swap={activeSessionSwap}
        currentUser={currentUser}
        allUsers={allUsers}
        allSkills={allSkills}
        onCompleteAndReview={handleOpenReviewModal}
      />

      {/* 5. Review & Rating Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        targetUser={reviewTargetUser}
        swap={reviewSwap}
        currentUser={currentUser}
        allSkills={allSkills}
        onSubmitReview={handleSubmitReview}
      />

      {/* 6. Authentication Login & Register Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onLoginAsGuest={handleLoginAsGuest}
      />

    </div>
  );
}

export default App;
