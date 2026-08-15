import { User, Skill, SwapRequest, Review, Notification, ChatMessage } from "@/types";

const STORAGE_KEYS = {
  USERS: "skillswap_users_v1",
  SKILLS: "skillswap_skills_v1",
  SWAPS: "skillswap_swaps_v1",
  REVIEWS: "skillswap_reviews_v1",
  NOTIFICATIONS: "skillswap_notifications_v1",
  MESSAGES: "skillswap_messages_v1",
  CURRENT_USER_ID: "skillswap_current_user_id_v1",
};

// Initial realistic seed students
const INITIAL_USERS: User[] = [
  {
    id: "usr_alex",
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
  },
  {
    id: "usr_sophia",
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
  },
  {
    id: "usr_marcus",
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
  },
  {
    id: "usr_priya",
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
  },
  {
    id: "usr_liam",
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
  },
  {
    id: "usr_elena",
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
  }
];

// Initial realistic skills catalog
const INITIAL_SKILLS: Skill[] = [
  {
    id: "skl_1",
    userId: "usr_alex",
    title: "Next.js 15 & Modern Tailwind Architecture",
    category: "Full-Stack Web",
    level: "Advanced",
    description: "Master server components, server actions, optimistic UI updates, and sleek dark mode design systems with Tailwind CSS and Framer Motion.",
    tags: ["Next.js", "React", "Tailwind CSS", "TypeScript", "App Router"],
    sessionType: "1-on-1 Swap",
    estimatedHours: 2,
    sampleProjects: ["Interactive Dashboard", "SaaS Landing Page with Glassmorphism"],
    whatYouWillLearn: [
      "Next.js App Router caching & Server Actions",
      "Production-ready component composition",
      "Dynamic micro-interactions with Framer Motion",
      "Building reusable shadcn-compatible primitives"
    ],
    createdAt: "2026-08-10T10:00:00Z",
  },
  {
    id: "skl_2",
    userId: "usr_alex",
    title: "Full-Stack API Design with tRPC & Prisma",
    category: "Full-Stack Web",
    level: "Intermediate",
    description: "End-to-end type safety from database models to frontend client queries. Never write manual API contracts or debug runtime type mismatches again.",
    tags: ["tRPC", "Prisma", "PostgreSQL", "Node.js", "TypeScript"],
    sessionType: "Pair Collaboration",
    estimatedHours: 1.5,
    sampleProjects: ["Real-time Collaborative Note App"],
    whatYouWillLearn: [
      "Prisma schema design & relations",
      "tRPC routers, middlewares, and context",
      "Optimistic cache mutations with TanStack Query"
    ],
    createdAt: "2026-08-11T14:30:00Z",
  },
  {
    id: "skl_3",
    userId: "usr_sophia",
    title: "LLM Fine-Tuning & Production RAG Pipelines",
    category: "AI & Machine Learning",
    level: "Advanced",
    description: "Learn how to build high-accuracy retrieval systems using vector databases (Pinecone/Chroma), chunking strategies, embedding models, and LoRA fine-tuning.",
    tags: ["PyTorch", "LangChain", "Vector DB", "Hugging Face", "LoRA"],
    sessionType: "1-on-1 Swap",
    estimatedHours: 2,
    sampleProjects: ["Custom Research Paper Assistant", "Legal Doc Query Engine"],
    whatYouWillLearn: [
      "Vector embeddings & semantic similarity math",
      "Hybrid search (BM25 + Dense Vectors) & re-ranking",
      "Parameter-efficient fine-tuning with PEFT/LoRA",
      "Evaluation metrics for hallucination mitigation"
    ],
    createdAt: "2026-08-08T09:15:00Z",
  },
  {
    id: "skl_4",
    userId: "usr_sophia",
    title: "Deep Learning Foundations with PyTorch",
    category: "AI & Machine Learning",
    level: "Intermediate",
    description: "From backpropagation calculus to custom neural network architectures. We will train convolutional and transformer models from scratch.",
    tags: ["Python", "PyTorch", "Transformers", "Neural Networks", "Data Science"],
    sessionType: "Direct Mentorship",
    estimatedHours: 2.5,
    sampleProjects: ["Image Classification on Custom Datasets"],
    whatYouWillLearn: [
      "Tensors, autograd, and computational graphs",
      "Writing clean PyTorch training & validation loops",
      "Attention mechanisms visual breakdown"
    ],
    createdAt: "2026-08-09T16:00:00Z",
  },
  {
    id: "skl_5",
    userId: "usr_marcus",
    title: "Blender 3D Hard-Surface Modeling & Lighting",
    category: "3D & Game Dev",
    level: "Intermediate",
    description: "Create stunning 3D tech gadgets, sci-fi props, and cinematic lighting setups. Perfect for developers wanting 3D assets for their web apps.",
    tags: ["Blender", "3D Modeling", "Cycles", "Materials", "Lighting"],
    sessionType: "1-on-1 Swap",
    estimatedHours: 2,
    sampleProjects: ["Cyberpunk Headphone 3D Render", "Glassmorphic Hologram Icon"],
    whatYouWillLearn: [
      "Subdivision surface modeling & Boolean workflows",
      "PBR material nodes & glass refraction shaders",
      "Three-point studio lighting and camera composition",
      "Exporting GLTF/GLB for Three.js web use"
    ],
    createdAt: "2026-08-12T11:20:00Z",
  },
  {
    id: "skl_6",
    userId: "usr_marcus",
    title: "Three.js & WebGL Interactive 3D on the Web",
    category: "3D & Game Dev",
    level: "Advanced",
    description: "Bring 3D graphics alive inside modern browser tabs with React Three Fiber, custom GLSL vertex/fragment shaders, and physics.",
    tags: ["Three.js", "React Three Fiber", "GLSL", "WebGL", "Creative Coding"],
    sessionType: "Pair Collaboration",
    estimatedHours: 2,
    sampleProjects: ["Interactive 3D Portfolio Orb", "Audio-Reactive Particles"],
    whatYouWillLearn: [
      "Scene graph, perspective cameras, and render loops",
      "React Three Fiber components & hooks",
      "Writing simple custom GLSL shaders"
    ],
    createdAt: "2026-08-12T15:45:00Z",
  },
  {
    id: "skl_7",
    userId: "usr_priya",
    title: "Ethical Hacking & Web App Penetration Testing",
    category: "Cybersecurity & Systems",
    level: "Intermediate",
    description: "Understand vulnerabilities from an offensive & defensive perspective. Learn SQL Injection, XSS, CSRF, IDOR, and modern OAuth2 security auditing.",
    tags: ["Cybersecurity", "Burp Suite", "OWASP Top 10", "Linux", "Ethical Hacking"],
    sessionType: "1-on-1 Swap",
    estimatedHours: 2,
    sampleProjects: ["Capture The Flag (CTF) Challenge Walkthroughs"],
    whatYouWillLearn: [
      "Intercepting and tampering HTTP traffic with Burp Suite",
      "Hands-on exploiting OWASP Top 10 vulnerabilities",
      "Patching vulnerabilities in Node & Python backends"
    ],
    createdAt: "2026-08-07T12:00:00Z",
  },
  {
    id: "skl_8",
    userId: "usr_priya",
    title: "Docker, Kubernetes & Production CI/CD Pipelines",
    category: "Cybersecurity & Systems",
    level: "Advanced",
    description: "Containerize multi-service applications, write GitHub Actions workflows, and deploy resilient workloads with zero downtime.",
    tags: ["Docker", "Kubernetes", "GitHub Actions", "DevOps", "AWS"],
    sessionType: "Direct Mentorship",
    estimatedHours: 1.5,
    sampleProjects: ["Automated Multi-Stage CI/CD Deployment"],
    whatYouWillLearn: [
      "Multi-stage Dockerfiles optimization",
      "Kubernetes pods, services, and deployments",
      "Automated testing & artifact push on GitHub Actions"
    ],
    createdAt: "2026-08-10T17:30:00Z",
  },
  {
    id: "skl_9",
    userId: "usr_liam",
    title: "Ableton Live Electronic Music Production & Mixing",
    category: "Music & Audio",
    level: "Beginner",
    description: "Learn beatmaking, synth design in Serum/Wavetable, compression, EQing, and song arrangement to produce your first complete track.",
    tags: ["Ableton Live", "Music Production", "Sound Design", "Audio Mixing", "EDM/Lo-Fi"],
    sessionType: "1-on-1 Swap",
    estimatedHours: 2,
    sampleProjects: ["Lo-Fi Study Beat", "Melodic Synthwave Track"],
    whatYouWillLearn: [
      "Drum programming & groove manipulation",
      "Subtractive synthesis & sound design",
      "Vocal processing, reverb/delay spatial mixing"
    ],
    createdAt: "2026-08-11T19:00:00Z",
  },
  {
    id: "skl_10",
    userId: "usr_elena",
    title: "Figma Mastery: Design Systems & Auto-Layout",
    category: "UI/UX & Product Design",
    level: "Advanced",
    description: "Build scalable component libraries with component properties, variables, nested auto-layout, interactive prototypes, and token exports.",
    tags: ["Figma", "UI/UX", "Design Systems", "Prototyping", "Variables"],
    sessionType: "1-on-1 Swap",
    estimatedHours: 2,
    sampleProjects: ["Complete B2B SaaS Design System", "Mobile App Micro-Interactions"],
    whatYouWillLearn: [
      "Mastering Auto-Layout 5.0 and responsive wrapping",
      "Color, typography, and spacing token variables with modes",
      "Creating realistic animated micro-interaction prototypes"
    ],
    createdAt: "2026-08-09T13:10:00Z",
  },
  {
    id: "skl_11",
    userId: "usr_elena",
    title: "Product UX Strategy & Usability Interviewing",
    category: "UI/UX & Product Design",
    level: "Intermediate",
    description: "Conduct actionable user research interviews, synthesize empathy maps, define user journeys, and run rapid 5-second usability tests.",
    tags: ["UX Research", "User Testing", "Product Strategy", "Wireframing"],
    sessionType: "Direct Mentorship",
    estimatedHours: 1.5,
    sampleProjects: ["Campus Food Delivery App Research Report"],
    whatYouWillLearn: [
      "Drafting non-leading interview questions",
      "Affinity mapping & identifying user pain points",
      "Translating research insights into high-impact wireframes"
    ],
    createdAt: "2026-08-13T10:20:00Z",
  }
];

// Initial realistic swap requests
const INITIAL_SWAPS: SwapRequest[] = [
  {
    id: "swp_101",
    senderId: "usr_sophia",
    receiverId: "usr_alex",
    requestedSkillId: "skl_1",
    offeredSkillId: "skl_3",
    status: "in_progress",
    message: "Hey Alex! I would love to learn how to build dynamic server component architectures in Next.js 15 for my AI web demos. In exchange, I can teach you fine-tuning LLMs with PyTorch & RAG pipelines!",
    sessionPlatform: "Google Meet",
    proposedDuration: "2 Hours (Split 1h / 1h)",
    scheduledTime: "Tomorrow at 5:00 PM PST",
    meetingLink: "https://meet.google.com/skp-wapr-xzn",
    createdAt: "2026-08-13T14:00:00Z",
    updatedAt: "2026-08-13T16:30:00Z",
  },
  {
    id: "swp_102",
    senderId: "usr_marcus",
    receiverId: "usr_alex",
    requestedSkillId: "skl_1",
    offeredSkillId: "skl_5",
    status: "pending",
    message: "Hi Alex! Marcus here from CMU. I want to level up my Next.js skills to host my 3D Blender web portfolios. Can swap for hands-on Blender hard surface modeling & lighting!",
    sessionPlatform: "Discord",
    proposedDuration: "1.5 Hours",
    createdAt: "2026-08-14T09:30:00Z",
    updatedAt: "2026-08-14T09:30:00Z",
  },
  {
    id: "swp_103",
    senderId: "usr_alex",
    receiverId: "usr_elena",
    requestedSkillId: "skl_10",
    offeredSkillId: "skl_2",
    status: "accepted",
    message: "Hey Elena! Love your design system portfolio. I'm looking to master Figma variables and auto-layout tokens, and I can teach you end-to-end type safe tRPC backend APIs in return.",
    sessionPlatform: "Google Meet",
    proposedDuration: "2 Hours",
    scheduledTime: "Saturday at 3:00 PM PST",
    meetingLink: "https://meet.google.com/swp-dsgn-lex",
    createdAt: "2026-08-12T11:00:00Z",
    updatedAt: "2026-08-12T18:00:00Z",
  },
  {
    id: "swp_104",
    senderId: "usr_priya",
    receiverId: "usr_liam",
    requestedSkillId: "skl_9",
    offeredSkillId: "skl_7",
    status: "completed",
    message: "Hey Liam, would love a 1-on-1 intro to synth design in Ableton. Can show you web penetration testing & Burp Suite fundamentals in exchange!",
    sessionPlatform: "Zoom",
    proposedDuration: "1 Hour",
    createdAt: "2026-08-08T10:00:00Z",
    updatedAt: "2026-08-09T18:00:00Z",
    reviewSubmitted: true,
  }
];

// Initial reviews
const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev_1",
    fromUserId: "usr_sophia",
    toUserId: "usr_alex",
    swapRequestId: "swp_100",
    rating: 5,
    comment: "Alex is an incredible teacher! He explained React Server Actions and custom Tailwind animations with such clarity. Walked away with a working demo in under an hour.",
    skillName: "Next.js 15 & Modern Tailwind Architecture",
    createdAt: "2026-08-06T19:00:00Z",
  },
  {
    id: "rev_2",
    fromUserId: "usr_alex",
    toUserId: "usr_sophia",
    swapRequestId: "swp_100",
    rating: 5,
    comment: "Sophia demystified RAG embeddings and vector distance calculations. Her hands-on PyTorch examples were crystal clear. Highly recommend swapping skills with her!",
    skillName: "LLM Fine-Tuning & Production RAG Pipelines",
    createdAt: "2026-08-06T19:15:00Z",
  },
  {
    id: "rev_3",
    fromUserId: "usr_priya",
    toUserId: "usr_elena",
    swapRequestId: "swp_99",
    rating: 5,
    comment: "Elena's design tokens and Figma variable session transformed how I structure my developer handoffs. 10/10 mentor!",
    skillName: "Figma Mastery: Design Systems & Auto-Layout",
    createdAt: "2026-08-04T15:00:00Z",
  }
];

// Initial notifications
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "notif_1",
    userId: "usr_alex",
    type: "request_received",
    title: "New Swap Proposal Received",
    message: "Marcus Vance proposed a skill swap: Blender 3D for Next.js 15.",
    swapRequestId: "swp_102",
    read: false,
    createdAt: "2026-08-14T09:30:00Z",
  },
  {
    id: "notif_2",
    userId: "usr_alex",
    type: "request_accepted",
    title: "Proposal Accepted",
    message: "Elena Rostova accepted your Figma & tRPC skill exchange proposal.",
    swapRequestId: "swp_103",
    read: false,
    createdAt: "2026-08-12T18:00:00Z",
  },
  {
    id: "notif_3",
    userId: "usr_alex",
    type: "session_ready",
    title: "Active Collaboration Session Ready",
    message: "Your live swap session with Sophia Chen is active and ready to join.",
    swapRequestId: "swp_101",
    read: false,
    createdAt: "2026-08-13T16:30:00Z",
  }
];

// Initial live chat messages for active swap session
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg_1",
    swapRequestId: "swp_101",
    senderId: "usr_sophia",
    senderName: "Sophia Chen",
    senderAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    text: "Hey Alex! I prepared the PyTorch Colab notebook with the LoRA fine-tuning script. Let me know when you're ready to start!",
    timestamp: "10:15 AM",
  },
  {
    id: "msg_2",
    swapRequestId: "swp_101",
    senderId: "usr_alex",
    senderName: "Alex Rivera",
    senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    text: "Awesome Sophia! I also pushed the Next.js 15 starter repo with Tailwind and the Spotlight component we can plug into your project.",
    timestamp: "10:17 AM",
  },
];

// Helper to load or initialize local storage
function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

function setStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

export const db = {
  // Users
  getUsers: (): User[] => getStorage(STORAGE_KEYS.USERS, INITIAL_USERS),
  
  getUserById: (id: string): User | undefined => {
    const users = db.getUsers();
    return users.find((u) => u.id === id);
  },

  getCurrentUser: (): User => {
    const users = db.getUsers();
    const currentId = getStorage(STORAGE_KEYS.CURRENT_USER_ID, "usr_alex");
    return users.find((u) => u.id === currentId) || users[0];
  },

  setCurrentUser: (userId: string): void => {
    setStorage(STORAGE_KEYS.CURRENT_USER_ID, userId);
  },

  updateUser: (updatedUser: User): void => {
    const users = db.getUsers().map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setStorage(STORAGE_KEYS.USERS, users);
  },

  // Skills
  getSkills: (): Skill[] => getStorage(STORAGE_KEYS.SKILLS, INITIAL_SKILLS),

  getSkillById: (id: string): Skill | undefined => {
    return db.getSkills().find((s) => s.id === id);
  },

  getSkillsByUser: (userId: string): Skill[] => {
    return db.getSkills().filter((s) => s.userId === userId);
  },

  addSkill: (skill: Omit<Skill, "id" | "createdAt">): Skill => {
    const skills = db.getSkills();
    const newSkill: Skill = {
      ...skill,
      id: `skl_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    skills.unshift(newSkill);
    setStorage(STORAGE_KEYS.SKILLS, skills);

    // Update user's teaching list
    const user = db.getUserById(skill.userId);
    if (user) {
      user.skillsTeaching = [...user.skillsTeaching, newSkill.id];
      user.karmaPoints += 50; // Bonus for posting a skill
      db.updateUser(user);
    }
    return newSkill;
  },

  deleteSkill: (skillId: string): void => {
    const skills = db.getSkills().filter((s) => s.id !== skillId);
    setStorage(STORAGE_KEYS.SKILLS, skills);
  },

  // Swaps
  getSwaps: (): SwapRequest[] => getStorage(STORAGE_KEYS.SWAPS, INITIAL_SWAPS),

  getSwapById: (id: string): SwapRequest | undefined => {
    return db.getSwaps().find((s) => s.id === id);
  },

  getSwapsForUser: (userId: string): { incoming: SwapRequest[]; outgoing: SwapRequest[]; active: SwapRequest[]; completed: SwapRequest[] } => {
    const swaps = db.getSwaps();
    const incoming = swaps.filter((s) => s.receiverId === userId && s.status === "pending");
    const outgoing = swaps.filter((s) => s.senderId === userId && s.status === "pending");
    const active = swaps.filter((s) => (s.senderId === userId || s.receiverId === userId) && (s.status === "accepted" || s.status === "in_progress"));
    const completed = swaps.filter((s) => (s.senderId === userId || s.receiverId === userId) && (s.status === "completed" || s.status === "declined"));
    return { incoming, outgoing, active, completed };
  },

  createSwapRequest: (
    senderId: string,
    receiverId: string,
    requestedSkillId: string,
    offeredSkillId: string | undefined,
    message: string,
    sessionPlatform: SwapRequest["sessionPlatform"],
    proposedDuration: string
  ): SwapRequest => {
    const swaps = db.getSwaps();
    const newSwap: SwapRequest = {
      id: `swp_${Date.now()}`,
      senderId,
      receiverId,
      requestedSkillId,
      offeredSkillId,
      status: "pending",
      message,
      sessionPlatform,
      proposedDuration,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    swaps.unshift(newSwap);
    setStorage(STORAGE_KEYS.SWAPS, swaps);

    // Notify receiver
    const sender = db.getUserById(senderId);
    const requestedSkill = db.getSkillById(requestedSkillId);
    db.addNotification({
      userId: receiverId,
      type: "request_received",
      title: "New Swap Proposal",
      message: `${sender?.name || "A student"} proposed to swap for your "${requestedSkill?.title || "skill"}".`,
      swapRequestId: newSwap.id,
      read: false,
    });

    return newSwap;
  },

  updateSwapStatus: (swapId: string, status: SwapRequest["status"], meetingLink?: string): SwapRequest | undefined => {
    const swaps = db.getSwaps();
    const swap = swaps.find((s) => s.id === swapId);
    if (!swap) return undefined;

    swap.status = status;
    swap.updatedAt = new Date().toISOString();
    if (meetingLink) {
      swap.meetingLink = meetingLink;
    } else if (status === "accepted" && !swap.meetingLink) {
      swap.meetingLink = `https://meet.google.com/swp-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
      swap.scheduledTime = "Scheduled for today at 6:00 PM";
    }

    setStorage(STORAGE_KEYS.SWAPS, swaps);

    // Send notification to the other party
    const isReceiver = swap.receiverId;
    const notificationTarget = status === "accepted" || status === "declined" ? swap.senderId : isReceiver;
    
    if (status === "accepted") {
      db.addNotification({
        userId: notificationTarget,
        type: "request_accepted",
        title: "Skill Swap Accepted",
        message: `Your exchange proposal has been accepted! Meeting link is ready.`,
        swapRequestId: swap.id,
        read: false,
      });
    }

    return swap;
  },

  // Reviews
  getReviews: (): Review[] => getStorage(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS),

  getReviewsForUser: (userId: string): Review[] => {
    return db.getReviews().filter((r) => r.toUserId === userId);
  },

  addReview: (review: Omit<Review, "id" | "createdAt">): Review => {
    const reviews = db.getReviews();
    const newReview: Review = {
      ...review,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    reviews.unshift(newReview);
    setStorage(STORAGE_KEYS.REVIEWS, reviews);

    // Update target user rating & karma
    const targetUser = db.getUserById(review.toUserId);
    if (targetUser) {
      const userReviews = db.getReviewsForUser(review.toUserId);
      const totalRating = userReviews.reduce((sum, r) => sum + r.rating, 0);
      targetUser.rating = Number((totalRating / userReviews.length).toFixed(2));
      targetUser.reviewsCount = userReviews.length;
      targetUser.swapsCompleted += 1;
      targetUser.karmaPoints += 100; // 100 karma points per positive exchange
      db.updateUser(targetUser);
    }

    // Mark swap request as completed and review submitted
    const swap = db.getSwapById(review.swapRequestId);
    if (swap) {
      swap.status = "completed";
      swap.reviewSubmitted = true;
      const swaps = db.getSwaps().map((s) => (s.id === swap.id ? swap : s));
      setStorage(STORAGE_KEYS.SWAPS, swaps);
    }

    return newReview;
  },

  // Notifications
  getNotifications: (userId: string): Notification[] => {
    const all = getStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return all.filter((n) => n.userId === userId);
  },

  addNotification: (notif: Omit<Notification, "id" | "createdAt">): void => {
    const notifs = getStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif: Notification = {
      ...notif,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    notifs.unshift(newNotif);
    setStorage(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  markNotificationRead: (notifId: string): void => {
    const notifs = getStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS).map((n) =>
      n.id === notifId ? { ...n, read: true } : n
    );
    setStorage(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  markAllNotificationsRead: (userId: string): void => {
    const notifs = getStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS).map((n) =>
      n.userId === userId ? { ...n, read: true } : n
    );
    setStorage(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  // Messages
  getMessages: (swapRequestId: string): ChatMessage[] => {
    const all = getStorage(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    return all.filter((m) => m.swapRequestId === swapRequestId);
  },

  sendMessage: (swapRequestId: string, senderId: string, senderName: string, senderAvatar: string, text: string): ChatMessage => {
    const all = getStorage(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      swapRequestId,
      senderId,
      senderName,
      senderAvatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    all.push(newMsg);
    setStorage(STORAGE_KEYS.MESSAGES, all);
    return newMsg;
  },

  // Reset to initial seed state
  resetToDefaults: (): void => {
    setStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    setStorage(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
    setStorage(STORAGE_KEYS.SWAPS, INITIAL_SWAPS);
    setStorage(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    setStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    setStorage(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    setStorage(STORAGE_KEYS.CURRENT_USER_ID, "usr_alex");
  }
};
