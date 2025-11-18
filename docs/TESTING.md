# Testing Guide

This guide will help you test the Coaching Platform at different stages of development.

## ✅ Current Status

- ✅ All TypeScript code compiles successfully
- ✅ Shared types package builds
- ✅ API package builds
- ✅ Web frontend builds
- ⏳ Database setup required (instructions below)
- ⏳ API server testing (requires database)

## 📋 Prerequisites Testing

### 1. Verify Node.js Installation

```bash
node --version
# Should show v18.x or higher

npm --version
# Should show v9.x or higher
```

### 2. Verify Dependencies Installed

```bash
npm list --workspaces
# Should show all installed packages
```

### 3. Verify TypeScript Compilation

```bash
# Build all packages
npm run build

# Or build individually
npm run build:api
npm run build:web
```

All should compile without errors!

## 🗄️ Database Setup & Testing

### Step 1: Install PostgreSQL

**On macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**On Windows:**
Download from https://www.postgresql.org/download/windows/

### Step 2: Create Database

```bash
# Create the database
createdb coaching_db

# Verify it was created
psql -l | grep coaching_db
```

### Step 3: Run Migrations

```bash
# Run the migration SQL file
psql -d coaching_db -f packages/api/migrations/001_initial_schema.sql

# You should see output like:
# CREATE EXTENSION
# CREATE TABLE
# CREATE TABLE
# CREATE INDEX
# INSERT 0 1
```

### Step 4: Verify Database Schema

```bash
# Connect to database
psql -d coaching_db

# List all tables (should see 6 tables)
\dt

# Should show:
# - clients
# - bookings
# - blocked_times
# - invoices
# - settings
# - email_logs

# View settings table (should have 1 row)
SELECT * FROM settings;

# Exit psql
\q
```

### Step 5: Update Database URL

Edit `packages/api/.env` and update the `DATABASE_URL`:

```bash
# If your PostgreSQL user is 'postgres' with no password:
DATABASE_URL=postgresql://postgres@localhost:5432/coaching_db

# If you have a password:
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/coaching_db

# If you created a custom user:
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/coaching_db
```

## 🚀 API Server Testing

### Start the API Server

```bash
# From project root
npm run dev:api

# You should see:
# 🚀 Server running on http://localhost:3000
# 📊 Health check: http://localhost:3000/health
# 🌍 Environment: development
# ✅ Connected to PostgreSQL database
```

If you see the "Connected to PostgreSQL database" message, you're good to go!

### Test Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Coaching Platform API is running!",
  "timestamp": "2025-11-18T..."
}
```

### Test Availability Endpoint

```bash
# Get available slots for tomorrow
curl "http://localhost:3000/api/bookings/availability?date=2025-11-20"
```

Expected response:
```json
{
  "success": true,
  "data": {
    "date": "2025-11-20",
    "slots": [
      {
        "start_time": "2025-11-20T14:00:00.000Z",
        "end_time": "2025-11-20T15:00:00.000Z",
        "available": true
      },
      // ... more slots
    ]
  }
}
```

### Test Creating a Booking

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "John Doe",
    "client_email": "john@example.com",
    "client_phone": "1234567890",
    "start_time": "2025-11-20T14:00:00.000Z",
    "end_time": "2025-11-20T15:00:00.000Z",
    "notes": "First coaching session"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "client_id": "uuid-here",
    "start_time": "2025-11-20T14:00:00.000Z",
    "end_time": "2025-11-20T15:00:00.000Z",
    "status": "pending",
    "client_name": "John Doe",
    "client_email": "john@example.com",
    "client_phone": "1234567890",
    // ...
  }
}
```

### Test Get All Bookings

```bash
curl http://localhost:3000/api/bookings
```

Expected response:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "client_name": "John Doe",
      "status": "pending",
      // ... booking details
    }
  ]
}
```

### Test Approve Booking

```bash
# Replace <booking-id> with actual ID from previous response
curl -X PATCH http://localhost:3000/api/bookings/<booking-id>/approve
```

### Test Client Endpoints

```bash
# Get all clients
curl http://localhost:3000/api/clients

# Get client with stats
curl "http://localhost:3000/api/clients/<client-id>?stats=true"

# Create a new client
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "0987654321",
    "notes": "Interested in career coaching"
  }'
```

## 🌐 Frontend Testing

### Start the Frontend Dev Server

```bash
# In a separate terminal
npm run dev:web

# You should see:
# VITE v5.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5173/
```

### Test in Browser

1. Open http://localhost:5173 in your browser
2. You should see the Coaching Platform homepage
3. The API connection status should show as "connected" (green dot)
4. Try the example features as they're built

## 🧪 Testing Both Together

### Start Both Servers

```bash
# From project root
npm run dev

# This starts both API (port 3000) and Web (port 5173)
```

### Verify Connection

1. Open http://localhost:5173
2. Check the API status indicator
3. Should show "Hello from Coaching Platform API!"

## 📝 Manual Testing Checklist

Once everything is running, test these scenarios:

### Booking Flow
- [ ] View available time slots for a date
- [ ] Create a booking request
- [ ] Verify booking appears in list
- [ ] Approve booking
- [ ] Verify status changes to "approved"
- [ ] Complete booking
- [ ] Verify status changes to "completed"

### Client Management
- [ ] Create a new client
- [ ] View client list
- [ ] View client details with stats
- [ ] Update client information
- [ ] View client booking history
- [ ] Archive a client
- [ ] Unarchive a client

### Edge Cases
- [ ] Try to book in the past (should fail)
- [ ] Try to double-book same time slot (should fail)
- [ ] Try to create client with existing email (should fail)
- [ ] Try to book outside working hours (should fail)

## 🐛 Troubleshooting

### "Connection refused" error

**Problem:** API server isn't running
**Solution:** Start it with `npm run dev:api`

### "Failed to connect to database"

**Problem:** PostgreSQL isn't running or DATABASE_URL is wrong
**Solution:**
```bash
# Check if PostgreSQL is running
pg_isready

# If not running, start it
# macOS: brew services start postgresql@14
# Linux: sudo systemctl start postgresql
```

### "Relation does not exist" error

**Problem:** Database migrations haven't been run
**Solution:**
```bash
psql -d coaching_db -f packages/api/migrations/001_initial_schema.sql
```

### TypeScript errors in IDE

**Problem:** IDE hasn't picked up types yet
**Solution:**
```bash
# Rebuild all packages
npm run build

# Restart your IDE or reload window
```

### Port already in use

**Problem:** Another process is using port 3000 or 5173
**Solution:**
```bash
# Find and kill the process
# On macOS/Linux:
lsof -i :3000
kill -9 <PID>

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 📊 Success Criteria

Your setup is complete when:

✅ All packages compile without errors
✅ Database is created and migrated
✅ API server starts and shows "Connected to PostgreSQL"
✅ Health check endpoint returns success
✅ Availability endpoint returns time slots
✅ Can create a booking via API
✅ Frontend loads at http://localhost:5173
✅ Frontend shows "connected" to API

## 🔍 Logs and Debugging

### View API Logs

The API server logs all queries in development mode. You'll see:
```
Executed query { text: 'SELECT * FROM bookings...', duration: 15, rows: 5 }
```

### Check Database Data

```bash
psql -d coaching_db

# View all bookings
SELECT * FROM bookings;

# View all clients
SELECT * FROM clients;

# View settings
SELECT * FROM settings;

# Exit
\q
```

## 🎯 Next Steps

Once all tests pass:
1. Continue building the frontend booking calendar
2. Add more features (invoice generation, email notifications)
3. Deploy to production!

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

---

**Questions?** Check the [GETTING_STARTED.md](./GETTING_STARTED.md) or [DEVELOPMENT.md](./DEVELOPMENT.md) guides!
