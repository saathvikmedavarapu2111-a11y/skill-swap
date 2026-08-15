# SkillSwap — Peer-to-Peer Student Skill Exchange Platform

SkillSwap is a modern collaborative platform empowering students to trade knowledge, level up their skills, propose swaps, join live virtual session rooms, and earn karma points.

---

## 📁 Repository Structure

```
skill-swap/
├── frontend/                  # React + TypeScript + Vite Frontend Application
│   ├── public/                # Static assets & _redirects SPA fallback
│   ├── src/                   # React components, state, services & UI library
│   │   ├── assets/            # Images and icons
│   │   ├── components/        # Modals, dashboards, explorer & UI components
│   │   ├── services/          # Local db & auth client services
│   │   └── types/             # TypeScript domain definitions
│   ├── package.json           # Frontend dependencies & build scripts
│   ├── vercel.json            # Vercel SPA deployment configuration
│   ├── vite.config.ts         # Vite build configuration
│   └── tailwind.config.js     # Tailwind CSS configuration
│
├── backend/                   # Node.js + Express + TypeScript Backend API
│   ├── src/                   # Server, routes, controllers, middleware & models
│   ├── tests/                 # API endpoint tests
│   ├── .env.example           # Backend environment template
│   ├── package.json           # Backend dependencies & scripts
│   └── tsconfig.json          # TypeScript backend configuration
│
├── package.json               # Root monorepo orchestration scripts
├── vercel.json                # Workspace-level Vercel configuration
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** (v18+)
- **npm** (v9+)

### 2. Installation
Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
npm --prefix frontend install

# Install backend dependencies
npm --prefix backend install
```

### 3. Running Locally

You can run both or individual servers directly from the root workspace:

```bash
# Run Frontend Dev Server (http://localhost:5173)
npm run dev

# Run Backend API Server (http://localhost:5001)
npm run dev:backend
```

### 4. Building for Production

```bash
# Build Frontend
npm run build

# Build Backend
npm run build:backend

# Build All
npm run build:all
```

---

## 🌐 Deployment Guide

### Frontend (Vercel / Netlify / Cloudflare Pages)

#### Deploying on Vercel:
1. Import this repository into Vercel.
2. In the **Project Settings**:
   - **Root Directory**: Set to `frontend` (or leave as `./` as root `vercel.json` is also pre-configured).
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Environment Variables (optional):
   - `VITE_API_URL`: URL of your deployed backend (e.g. `https://your-backend.onrender.com/api`)

### Backend (Render / Railway / Fly.io / VPS)

1. Set the **Root Directory** to `backend`.
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm start`
4. Set required Environment Variables:
   - `PORT`: `5001` (or provider assigned port)
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `<secure-random-secret>`
   - `FRONTEND_URL`: URL of your deployed frontend (e.g. `https://your-app.vercel.app`)

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Canvas-Confetti
- **Backend**: Node.js, Express, TypeScript, JWT authentication, bcryptjs, zod validation
