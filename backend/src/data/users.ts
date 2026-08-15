import bcrypt from "bcryptjs";

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
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
  skillsTeaching: string[];
  skillsLearning: string[];
  availability: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    discord?: string;
    portfolio?: string;
  };
  status: "online" | "busy" | "offline";
  createdAt: string;
  updatedAt: string;
}

export type SafeUser = Omit<StoredUser, "passwordHash">;

export function sanitizeUser(user: StoredUser): SafeUser {
  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

// Generate default bcrypt hash for seed accounts ("password123")
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync("password123", 10);

// In-memory student user store matching the frontend's accounts
const INITIAL_USERS: StoredUser[] = [
  {
    id: "usr_alex",
    email: "alex@berkeley.edu",
    passwordHash: DEFAULT_PASSWORD_HASH,
    name: "Alex Rivera",
    handle: "@alexrivera_dev",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    college: "UC Berkeley",
    major: "Computer Science & Design",
    year: "Senior",
    bio: "Full-stack craftsman building high-performance React & Next.js apps. Love teaching frontend animations, Tailwind, and GraphQL. Currently fascinated by LLM agent architectures!",
    karmaPoints: 1250,
    swapsCompleted: 18,
    rating: 4.96,
    reviewsCount: 14,
    badges: ["Top Mentor", "React Wizard", "Fast Responder", "5-Star Swapper"],
    skillsTeaching: ["skl_1", "skl_2"],
    skillsLearning: ["PyTorch & Deep Learning", "Blender 3D", "System Design"],
    availability: "Tue & Thu evenings (PST), Weekend mornings",
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      discord: "alex_dev#4021",
    },
    status: "online",
    createdAt: "2026-01-10T08:00:00.000Z",
    updatedAt: "2026-08-15T08:00:00.000Z",
  },
  {
    id: "usr_sophia",
    email: "sophia@stanford.edu",
    passwordHash: DEFAULT_PASSWORD_HASH,
    name: "Sophia Chen",
    handle: "@sophia_ml",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    college: "Stanford University",
    major: "Artificial Intelligence & Symbolic Systems",
    year: "Graduate Student",
    bio: "AI researcher focusing on RAG pipelines, fine-tuning LLMs, and computer vision. Excited to exchange practical ML intuition for UI/UX prototyping and public speaking.",
    karmaPoints: 1820,
    swapsCompleted: 24,
    rating: 4.98,
    reviewsCount: 22,
    badges: ["Grandmaster Mentor", "AI Specialist", "Community Star"],
    skillsTeaching: ["skl_3", "skl_4"],
    skillsLearning: ["Figma Design Systems", "Next.js App Router", "Music Production"],
    availability: "Mon, Wed after 6 PM, Sundays",
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
    },
    status: "online",
    createdAt: "2026-01-15T10:30:00.000Z",
    updatedAt: "2026-08-15T08:00:00.000Z",
  },
  {
    id: "usr_marcus",
    email: "marcus@cmu.edu",
    passwordHash: DEFAULT_PASSWORD_HASH,
    name: "Marcus Vance",
    handle: "@marcus_3d",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    college: "Carnegie Mellon University",
    major: "Human-Computer Interaction & Digital Media",
    year: "Junior",
    bio: "3D visual artist and shader developer. Passionate about procedural texturing, Blender hard-surface modeling, and Three.js interactive graphics. Eager to master Rust & Backend APIs.",
    karmaPoints: 940,
    swapsCompleted: 11,
    rating: 4.91,
    reviewsCount: 9,
    badges: ["3D Virtuoso", "Creative Polymath"],
    skillsTeaching: ["skl_5", "skl_6"],
    skillsLearning: ["Rust Programming", "Docker & Kubernetes", "Mobile Flutter"],
    availability: "Flexible on weekdays, anytime on Saturday",
    socialLinks: {
      portfolio: "https://marcus3d.art",
      discord: "marcus_render#1102",
    },
    status: "online",
    createdAt: "2026-02-01T12:00:00.000Z",
    updatedAt: "2026-08-15T08:00:00.000Z",
  },
  {
    id: "usr_priya",
    email: "priya@gatech.edu",
    passwordHash: DEFAULT_PASSWORD_HASH,
    name: "Priya Sharma",
    handle: "@priya_cloud",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    college: "Georgia Tech",
    major: "Computer Engineering & Cybersecurity",
    year: "Senior",
    bio: "Cloud infrastructure enthusiast and security researcher. AWS Certified Solutions Architect. Love teaching penetration testing basics and CI/CD pipelines. Looking for acoustic guitar mentor!",
    karmaPoints: 1110,
    swapsCompleted: 15,
    rating: 4.94,
    reviewsCount: 12,
    badges: ["Security Guardian", "DevOps Pro"],
    skillsTeaching: ["skl_7", "skl_8"],
    skillsLearning: ["Acoustic Guitar Basics", "Japanese N4", "Product Management"],
    availability: "Fridays & Weekends",
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
    },
    status: "busy",
    createdAt: "2026-02-10T14:00:00.000Z",
    updatedAt: "2026-08-15T08:00:00.000Z",
  },
  {
    id: "usr_liam",
    email: "liam@mit.edu",
    passwordHash: DEFAULT_PASSWORD_HASH,
    name: "Liam O'Connor",
    handle: "@liam_sound",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    college: "MIT",
    major: "Music Technology & Electrical Engineering",
    year: "Sophomore",
    bio: "Electronic music producer & DSP audio coder. Expert in Ableton Live synthesis, audio mixing, and Foley design. Want to learn TypeScript and algorithm interview prep.",
    karmaPoints: 780,
    swapsCompleted: 9,
    rating: 4.88,
    reviewsCount: 8,
    badges: ["Sound Architect", "Fast Responder"],
    skillsTeaching: ["skl_9"],
    skillsLearning: ["LeetCode Mediums", "Full-Stack Web", "Machine Learning"],
    availability: "Evenings 7 PM - 10 PM EST",
    socialLinks: {
      portfolio: "https://soundcloud.com",
    },
    status: "offline",
    createdAt: "2026-03-01T16:00:00.000Z",
    updatedAt: "2026-08-15T08:00:00.000Z",
  },
  {
    id: "usr_elena",
    email: "elena@utexas.edu",
    passwordHash: DEFAULT_PASSWORD_HASH,
    name: "Elena Rostova",
    handle: "@elena_design",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    college: "UT Austin",
    major: "Product Design & Cognitive Psychology",
    year: "Junior",
    bio: "Design systems fanatic & micro-interaction geek. I teach Figma auto-layout mastery, design tokens, usability testing, and UX research methods. Want to learn iOS Swift development!",
    karmaPoints: 1390,
    swapsCompleted: 19,
    rating: 4.97,
    reviewsCount: 16,
    badges: ["UI/UX Master", "Top Mentor", "5-Star Swapper"],
    skillsTeaching: ["skl_10", "skl_11"],
    skillsLearning: ["SwiftUI & iOS", "Data Visualization", "Public Speaking"],
    availability: "Wednesday and Friday afternoons",
    socialLinks: {
      portfolio: "https://dribbble.com",
      linkedin: "https://linkedin.com",
    },
    status: "online",
    createdAt: "2026-03-15T18:00:00.000Z",
    updatedAt: "2026-08-15T08:00:00.000Z",
  },
];

// In-Memory Repository
class UserRepository {
  private users: Map<string, StoredUser> = new Map();

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.users.clear();
    for (const user of INITIAL_USERS) {
      this.users.set(user.id, { ...user });
    }
  }

  public findById(id: string): StoredUser | undefined {
    return this.users.get(id);
  }

  public findByEmail(email: string): StoredUser | undefined {
    const normalized = email.trim().toLowerCase();
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === normalized) {
        return user;
      }
    }
    return undefined;
  }

  public findByHandle(handle: string): StoredUser | undefined {
    const normalized = handle.trim().toLowerCase();
    for (const user of this.users.values()) {
      if (user.handle.toLowerCase() === normalized) {
        return user;
      }
    }
    return undefined;
  }

  public create(userData: Omit<StoredUser, "id" | "createdAt" | "updatedAt"> & { id?: string }): StoredUser {
    const id = userData.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const newUser: StoredUser = {
      ...userData,
      id,
      email: userData.email.trim().toLowerCase(),
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  public listAll(): StoredUser[] {
    return Array.from(this.users.values());
  }
}

export const userRepository = new UserRepository();
