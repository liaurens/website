# Getting Started with Coaching Platform

Welcome! This guide will help you set up the development environment and start working on the Coaching Platform.

## Prerequisites

Make sure you have these installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **WebStorm** (recommended IDE) - [Download](https://www.jetbrains.com/webstorm/)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/liaurens/website.git
cd website
```

### 2. Install Dependencies

```bash
# Install all dependencies for all packages
npm install
```

This will install dependencies for:
- Root workspace
- Backend API (packages/api)
- Frontend web app (packages/web)
- Shared utilities (packages/shared)

### 3. Set Up Environment Variables

#### Backend API

```bash
cd packages/api
cp .env.example .env
```

Edit `packages/api/.env` and update:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - A secure random string
- Other settings as needed

#### Frontend Web

```bash
cd packages/web
cp .env.example .env
```

The default values should work for local development.

### 4. Set Up Database

```bash
# Create a new PostgreSQL database
createdb coaching_db

# Or using psql
psql -U postgres
CREATE DATABASE coaching_db;
\q
```

Update the `DATABASE_URL` in `packages/api/.env` with your database credentials.

### 5. Start Development Servers

You have two options:

#### Option A: Start Both Servers Together

```bash
# From the root directory
npm run dev
```

This starts both the API server (port 3000) and the web server (port 5173).

#### Option B: Start Servers Separately

In separate terminal windows:

```bash
# Terminal 1 - Start API server
npm run dev:api

# Terminal 2 - Start web server
npm run dev:web
```

### 6. Verify Everything Works

1. **Check API**: Open [http://localhost:3000/health](http://localhost:3000/health)
   - You should see a JSON response with status "ok"

2. **Check Web App**: Open [http://localhost:5173](http://localhost:5173)
   - You should see the Coaching Platform homepage
   - The API connection status should show as connected

## Development Workflow

### Project Structure

```
website/
├── packages/
│   ├── api/          # Backend Express server
│   ├── web/          # React frontend
│   └── shared/       # Shared TypeScript types
├── docs/             # Documentation
└── package.json      # Root workspace config
```

### Working with the Backend

```bash
cd packages/api

# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### Working with the Frontend

```bash
cd packages/web

# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Common Tasks

### Adding a New Package/Dependency

```bash
# For backend
npm install <package-name> --workspace=packages/api

# For frontend
npm install <package-name> --workspace=packages/web

# For shared utilities
npm install <package-name> --workspace=packages/shared
```

### Running TypeScript Compiler

```bash
# Check for type errors in all packages
npx tsc --build

# Or for individual packages
cd packages/api && npx tsc --noEmit
cd packages/web && npx tsc --noEmit
```

### Database Migrations (Coming Soon)

Database migration tools will be set up in the next phase.

## WebStorm Setup

1. Open WebStorm
2. Click **Open** and select the `website` folder
3. WebStorm will automatically detect the monorepo structure
4. Install recommended plugins when prompted:
   - ESLint
   - Prettier
   - Tailwind CSS

### Run Configurations

WebStorm can create run configurations for easy development:

1. Go to **Run > Edit Configurations**
2. Click **+** and select **npm**
3. Create configurations for:
   - `dev:api` (Command: `run dev:api`)
   - `dev:web` (Command: `run dev:web`)
   - `dev` (Command: `run dev`)

## Troubleshooting

### "Cannot find module" errors

```bash
# Clean install
npm run clean
npm install
```

### Port already in use

```bash
# Find and kill the process using the port
# On Mac/Linux:
lsof -i :3000
kill -9 <PID>

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database connection errors

- Make sure PostgreSQL is running
- Check your `DATABASE_URL` in `.env`
- Verify database exists: `psql -l`

### TypeScript errors

```bash
# Rebuild TypeScript declarations
npx tsc --build --force
```

## Next Steps

Once you have everything running:

1. Read the [Project Specification](../COACHING_PLATFORM_PROJECT_SPEC%20(2).md)
2. Check the [README.md](../README.md) for current progress
3. Start with the first feature: Client Management

## Getting Help

- Check the [README.md](../README.md) for progress tracking
- Review the [Project Specification](../COACHING_PLATFORM_PROJECT_SPEC%20(2).md)
- Ask questions about the codebase or concepts

Happy coding! 🚀
