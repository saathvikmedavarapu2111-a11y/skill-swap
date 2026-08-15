export type SkillCategory =
  | "All Categories"
  | "AI & Machine Learning"
  | "Full-Stack Web"
  | "Mobile Development"
  | "UI/UX & Product Design"
  | "Data Science & Analytics"
  | "Cybersecurity & Systems"
  | "3D & Game Dev"
  | "Languages & Culture"
  | "Music & Audio"
  | "Career & Speaking";

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export type SessionType = "1-on-1 Swap" | "Direct Mentorship" | "Pair Collaboration";

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  college: string;
  major: string;
  year: string;
  bio: string;
  karmaPoints: number;
  swapsCompleted: number;
  rating: number;
  reviewsCount: number;
  badges: string[];
  skillsTeaching: string[]; // Skill IDs
  skillsLearning: string[]; // Skill names or descriptions
  availability: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    discord?: string;
    portfolio?: string;
  };
  status: "online" | "busy" | "offline";
}

export interface Skill {
  id: string;
  userId: string;
  title: string;
  category: SkillCategory;
  level: SkillLevel;
  description: string;
  tags: string[];
  sessionType: SessionType;
  estimatedHours: number;
  sampleProjects?: string[];
  whatYouWillLearn: string[];
  createdAt: string;
}

export type SwapStatus = "pending" | "accepted" | "declined" | "in_progress" | "completed";

export interface SwapRequest {
  id: string;
  senderId: string;
  receiverId: string;
  requestedSkillId: string;
  offeredSkillId?: string;
  customOfferTitle?: string;
  status: SwapStatus;
  message: string;
  sessionPlatform: "Google Meet" | "Discord" | "Zoom" | "Campus Library / In-Person";
  proposedDuration: string;
  scheduledTime?: string;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
  reviewSubmitted?: boolean;
}

export interface Review {
  id: string;
  fromUserId: string;
  toUserId: string;
  swapRequestId: string;
  rating: number;
  comment: string;
  skillName: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "request_received" | "request_accepted" | "request_declined" | "session_ready" | "review_received";
  title: string;
  message: string;
  swapRequestId?: string;
  read: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  swapRequestId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
}
