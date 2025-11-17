# 🎯 Coaching Platform - Development Tracker

A streamlined coaching management platform for booking, calendar sync, and automated invoicing.

---

## 📊 Project Progress

### ✅ Completed Tasks
- [x] Initial project specification created
- [x] README tracking system set up

### 🚧 Current Phase: Project Setup
- [ ] Set up monorepo structure
- [ ] Configure TypeScript
- [ ] Create backend skeleton
- [ ] Create frontend skeleton
- [ ] Set up development environment

### 📋 Upcoming Phases
- **Phase 1**: Database & Backend API (Weeks 1-2)
- **Phase 2**: Frontend Development (Weeks 3-4)
- **Phase 3**: Mobile & Polish (Weeks 5-6)
- **Phase 4**: Testing & Deployment (Weeks 7-8)

---

## 🏗️ Project Structure

```
coaching-platform/
├── packages/
│   ├── web/          # React frontend (client-facing + coach dashboard)
│   ├── api/          # Express backend (business logic)
│   └── shared/       # Shared TypeScript types
├── docs/             # Documentation
├── README.md         # This file - progress tracker
└── package.json      # Monorepo workspace configuration
```

---

## 🚀 Getting Started (For Beginners)

### Prerequisites
You'll need to install:
1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **PostgreSQL** - [Download here](https://www.postgresql.org/download/) OR use Docker
3. **WebStorm IDE** - [Download here](https://www.jetbrains.com/webstorm/)
4. **Git** - Should already be installed

### Initial Setup

```bash
# Clone the repository (you've already done this!)
cd website

# Install dependencies (after we set up package.json)
npm install

# Start development servers
npm run dev
```

---

## 💡 Understanding the Technology Stack

### For Python Developers
Since you're familiar with Python, here's how things compare:

| Concept | Python Equivalent | What We Use |
|---------|------------------|-------------|
| Backend Framework | Flask/Django | Express.js |
| Package Manager | pip | npm |
| Virtual Environment | venv | node_modules |
| Type Hints | typing module | TypeScript |
| Database ORM | SQLAlchemy | pg (raw SQL) or Prisma |
| Frontend | Jinja2 templates | React |
| Testing | pytest | Vitest |

### Key Differences from Python
1. **JavaScript/TypeScript** - Syntax is different but concepts are similar
2. **Async/Await** - Similar to Python's async/await
3. **npm** - Like pip but for JavaScript packages
4. **Components** - React builds UIs with reusable components

---

## 📚 Core Features (MVP)

### ✅ Phase 1 Features
1. **Client Management**
   - Basic client profiles (name, email, phone)
   - Session history view
   - Simple notes per client

2. **Interactive Booking Calendar**
   - Week/month view
   - Client-facing booking interface
   - Time slot selection
   - Booking requests (pending approval)

3. **iPhone Integration**
   - Approve/reject booking requests via mobile
   - Block days/times for unavailability
   - View upcoming sessions
   - Sync with iPhone calendar

4. **Basic Invoice Generation**
   - Auto-generate invoice after session
   - PDF template with basic branding
   - Manual email sending
   - Simple invoice numbering

5. **Email Notifications**
   - Booking confirmation emails
   - Reminder emails (24 hours before)
   - Invoice delivery

---

## 🎨 Development Approach

We're following a **"breadth-first"** approach:

### Step 1: Get Everything Running (Skeleton)
- Set up all folders and files
- Create a "Hello World" API endpoint
- Create a "Hello World" React page
- Make sure everything connects

### Step 2: Build Feature by Feature
- Complete one feature at a time
- Test each feature before moving on
- Keep things simple and working

### Step 3: Polish & Deploy
- Make it look nice
- Test on iPhone
- Deploy to production

---

## 🛠️ WebStorm Setup Guide

### Opening the Project
1. Open WebStorm
2. Click "Open" and select this folder
3. WebStorm will detect it's a Node.js project

### Recommended Plugins
- **ESLint** - Code quality checking
- **Prettier** - Code formatting
- **Tailwind CSS** - CSS IntelliSense
- **.env files support** - Environment variables

### Useful WebStorm Features
- **⌘ + Click** (Mac) or **Ctrl + Click** (Windows) - Jump to definition
- **⌘ + B** - Go to declaration
- **⌥ + Enter** - Quick fixes
- **⌘ + R** - Run configuration
- **Terminal** - Built-in terminal at bottom

---

## 📝 Instructions & Commands Log

### Session 1 - Initial Setup
**Date**: November 17, 2025
**Instructions Given**:
1. Read project specification
2. Set up basic project structure
3. Create README with progress tracking
4. Use WebStorm as IDE
5. Build iteratively - structure first, then features

**Commands to Run Next**:
```bash
# After structure is created, run:
npm install              # Install all dependencies
npm run dev:api          # Start backend server
npm run dev:web          # Start frontend dev server
```

---

## 🐛 Common Issues & Solutions

### Issue: "npm not found"
**Solution**: Install Node.js from https://nodejs.org/

### Issue: "Port already in use"
**Solution**:
```bash
# On Mac/Linux
lsof -i :3000
kill -9 <PID>

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: "Cannot connect to database"
**Solution**: Make sure PostgreSQL is running
```bash
# Check if PostgreSQL is running
psql --version

# Start PostgreSQL (if using Homebrew on Mac)
brew services start postgresql
```

---

## 📖 Learning Resources

### TypeScript Basics
- [TypeScript in 5 Minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- Similar to Python type hints but more powerful

### React Basics
- [React Quick Start](https://react.dev/learn)
- Think of components like Python classes/functions that return HTML

### Express.js
- [Express Hello World](https://expressjs.com/en/starter/hello-world.html)
- Similar to Flask routes

---

## 🎯 Next Steps

1. **Review this README** - Make sure you understand the big picture
2. **Install prerequisites** - Node.js, PostgreSQL, WebStorm
3. **Let me know when ready** - I'll create the project structure
4. **One step at a time** - We'll build this together!

---

## 💬 Questions to Ask

If you're unsure about anything, ask:
- "How does [X] work in JavaScript compared to Python?"
- "What does this file do?"
- "Can you explain [concept]?"
- "Why are we using [technology]?"

Don't hesitate to ask for clarification!

---

## 📊 Progress Metrics

- **Project Start Date**: November 17, 2025
- **Target MVP Completion**: 8 weeks from start
- **Features Completed**: 0/5
- **Current Phase**: Setup
- **Next Milestone**: Runnable skeleton

---

## 🔗 Important Links

- [Project Specification](./COACHING_PLATFORM_PROJECT_SPEC%20(2).md) - Complete technical spec
- [API Documentation](./docs/API.md) - Will be created
- [Database Schema](./docs/DATABASE.md) - Will be created
- [Deployment Guide](./docs/DEPLOYMENT.md) - Will be created

---

**Last Updated**: November 17, 2025
**Status**: 🚀 Ready to Start Development
