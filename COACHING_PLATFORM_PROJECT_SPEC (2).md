# Coaching Platform - Complete Project Specification

## 📋 Project Overview

### Vision
A streamlined coaching management platform focused on booking management, calendar synchronization, and automated invoicing for in-person coaching sessions.

### Core Philosophy
- **Privacy-First**: Minimize client data collection to avoid complex data protection regulations
- **Mobile-First**: Primary management interface through iPhone
- **Simplicity**: Clean, intuitive interfaces over feature bloat
- **Modularity**: Easy to extend, modify, and understand

---

## 🎯 MVP vs Future Features

### ✅ MVP (Phase 1) - Core Features
**Must be implemented for first version:**

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

### 🔮 Future Implementation (Phase 2+)
**Not needed for MVP but plan architecture to support:**

- Client login portal (view bookings, invoices, history)
- Recurring session packages
- Online payment processing (Stripe/PayPal)
- Group session support
- Video call integration (Zoom/Meet)
- Advanced invoice customization (tax, discounts)
- CRM features (progress tracking, goals)
- Multiple calendar sync (Google, Outlook)
- Analytics dashboard
- Multi-coach support

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT DEVICES                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Client Web  │  │ Coach iPhone │  │ Coach Web    │  │
│  │  (Booking)   │  │   (Mobile)   │  │  (Desktop)   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API Gateway   │
                    │   (REST API)    │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
    ┌─────▼─────┐   ┌────────▼────────┐   ┌────▼─────┐
    │  Booking  │   │    Calendar     │   │ Invoice  │
    │  Service  │   │    Service      │   │ Service  │
    └─────┬─────┘   └────────┬────────┘   └────┬─────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │    Database     │
                    │   (PostgreSQL)  │
                    └─────────────────┘
```

### Technology Stack Decisions

#### Frontend
**Choice: React + TypeScript + Tailwind CSS**
- **Why React**: Component reusability, large ecosystem, easy to find help
- **Why TypeScript**: Type safety reduces bugs, better IDE support
- **Why Tailwind**: Rapid UI development, consistent design, mobile-responsive

**Mobile-Responsive Framework**: Progressive Web App (PWA)
- Works on iPhone without app store submission
- Native-like experience with calendar permissions
- Single codebase for web and mobile

#### Backend
**Choice: Node.js + Express + TypeScript**
- **Why Node.js**: JavaScript everywhere (same language as frontend)
- **Why Express**: Simple, well-documented, middleware ecosystem
- **Why TypeScript**: Same benefits as frontend

#### Database
**Choice: PostgreSQL**
- **Why**: 
  - Reliable, mature, ACID compliant
  - Great for relational data (clients, bookings, invoices)
  - JSON support for flexible fields
  - Easy to backup and migrate
  - Free hosting options (Supabase, Railway)

**Alternative Considered**: MongoDB
- Rejected because booking/invoice data is inherently relational

#### Calendar Integration
**Choice: ical.js + native calendar APIs**
- Generate .ics files for calendar imports
- Use iOS Calendar API for direct sync
- Avoid proprietary APIs (Google, Microsoft) for MVP

#### Invoice Generation
**Choice: PDFKit or Puppeteer**
- **PDFKit**: Lightweight, programmatic PDF generation
- **Puppeteer**: HTML/CSS to PDF (easier styling)
- Recommendation: Start with Puppeteer for design flexibility

#### Hosting
**Recommendation: Vercel (Frontend) + Railway/Render (Backend)**
- **Vercel**: Free tier, automatic deployments, great for React
- **Railway/Render**: Simple backend deployment, free PostgreSQL
- **Alternative**: Netlify + Supabase (includes auth and database)

---

## 📐 Architecture Decision Records (ADRs)

### ADR-001: Monorepo vs Separate Repos
**Status**: Decided  
**Decision**: Monorepo structure  
**Rationale**:
- Easier to share TypeScript types between frontend/backend
- Simplified deployment configuration
- Better for small team/solo developer
- Can split later if needed

**Structure**:
```
/coaching-platform
  /packages
    /web          # React frontend
    /api          # Express backend
    /shared       # Shared types, utilities
  /docs
```

### ADR-002: Authentication Strategy
**Status**: Decided  
**Decision**: Simple JWT tokens + Magic Links for MVP  
**Rationale**:
- No passwords to manage (security + UX win)
- Email magic links for coach login
- Future: Add OAuth (Google) in Phase 2
- Skip client authentication entirely for MVP (booking via unique tokens)

### ADR-003: Data Privacy Approach
**Status**: Decided  
**Decision**: Minimal data collection + clear data retention policy  
**Rationale**:
- Store ONLY: name, email, phone, session dates, invoice data
- No sensitive notes, health data, or extensive personal information
- Auto-delete client data after 2 years of inactivity (configurable)
- Comply with GDPR/privacy laws through simplicity, not complexity
- Easy export of client data on request

### ADR-004: Calendar Synchronization
**Status**: Decided  
**Decision**: Two-way sync via .ics files + webhook updates  
**Rationale**:
- Generate .ics calendar events for approved bookings
- Coach imports into iPhone calendar
- Block dates by creating calendar events in app
- Phase 2: Direct CalDAV integration if needed

### ADR-005: Invoice Numbering
**Status**: Decided  
**Decision**: Sequential with prefix (e.g., INV-2024-0001)  
**Rationale**:
- Simple, professional
- Year prefix allows annual reset
- Database sequence ensures no duplicates

### ADR-006: Email Delivery
**Status**: Decided  
**Decision**: Transactional email service (SendGrid or Resend)  
**Rationale**:
- Reliable delivery (vs SMTP)
- Free tiers available
- Template management
- SendGrid: 100 emails/day free
- Resend: 3,000 emails/month free (better for MVP)

### ADR-007: Mobile Interface
**Status**: Decided  
**Decision**: Progressive Web App (PWA) not native app  
**Rationale**:
- No app store submission delays
- Works on iPhone immediately
- Single codebase
- Can add to home screen for native feel
- Phase 2: Consider React Native if needed

### ADR-008: State Management
**Status**: Decided  
**Decision**: React Query + Context API  
**Rationale**:
- React Query: Perfect for server state (bookings, clients)
- Context API: Sufficient for UI state (modals, theme)
- Avoid Redux complexity for MVP
- Easy to upgrade to Zustand/Redux later

---

## 📊 Database Schema

### Core Tables

```sql
-- Clients table (minimal data)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  last_session_at TIMESTAMP,
  notes TEXT,
  archived BOOLEAN DEFAULT FALSE
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(50) NOT NULL, -- 'pending', 'approved', 'completed', 'cancelled'
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  booking_token VARCHAR(255) UNIQUE, -- For client to view their booking
  CONSTRAINT no_overlap CHECK (start_time < end_time)
);

-- Blocked times (coach unavailability)
CREATE TABLE blocked_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  issue_date DATE NOT NULL,
  due_date DATE,
  status VARCHAR(50) DEFAULT 'unpaid', -- 'unpaid', 'paid', 'cancelled'
  pdf_url TEXT,
  sent_at TIMESTAMP,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Coach settings (singleton table)
CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  business_name VARCHAR(255),
  business_email VARCHAR(255),
  business_phone VARCHAR(50),
  session_duration_minutes INTEGER DEFAULT 60,
  buffer_time_minutes INTEGER DEFAULT 15,
  working_hours JSONB, -- {"monday": {"start": "09:00", "end": "17:00"}, ...}
  booking_advance_days INTEGER DEFAULT 7,
  invoice_template JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Email log (for tracking)
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email VARCHAR(255) NOT NULL,
  email_type VARCHAR(50), -- 'booking_confirmation', 'reminder', 'invoice'
  subject TEXT,
  sent_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50), -- 'sent', 'failed'
  error_message TEXT
);
```

### Indexes
```sql
CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_clients_email ON clients(email);
```

---

## 🔐 Security Considerations

### Data Protection
1. **Minimal Data**: Only collect what's absolutely necessary
2. **Data Retention**: Auto-delete inactive clients after 2 years
3. **Export Capability**: API endpoint for client data export
4. **No Sensitive Data**: Avoid storing health info, payment details

### Authentication
1. **Coach Access**: Magic link authentication (email-based)
2. **Client Booking**: Unique tokens per booking (no account needed)
3. **API Security**: JWT tokens with short expiration (1 hour)
4. **Rate Limiting**: Protect against brute force attacks

### Best Practices
1. **HTTPS Only**: Force SSL in production
2. **Environment Variables**: Never commit secrets
3. **Input Validation**: Sanitize all user inputs
4. **SQL Injection**: Use parameterized queries (ORM)
5. **XSS Protection**: Escape output, use Content Security Policy

---

## 📱 User Flows

### Flow 1: Client Books a Session

```
1. Client visits booking page (public URL)
2. Sees available time slots (calendar view)
3. Selects date + time
4. Enters basic info (name, email, phone)
5. Submits booking request
6. Receives confirmation email (status: pending)
   ↓
7. Coach receives notification (iPhone)
8. Coach reviews request on iPhone app
9. Coach approves/rejects booking
   ↓
10. Client receives approval email (if approved)
11. Booking appears in coach's calendar
12. .ics file generated for iPhone Calendar
```

### Flow 2: Coach Blocks Time

```
1. Coach opens iPhone app
2. Navigates to calendar
3. Selects date(s) to block
4. Optionally adds reason (vacation, personal, etc.)
5. Saves blocked time
   ↓
6. Blocked time marked as unavailable
7. Clients cannot book those slots
8. Coach calendar updated
```

### Flow 3: Session Completion & Invoicing

```
1. Coach marks session as "completed" (or auto-completes after end time)
2. System auto-generates invoice PDF
3. Invoice saved to database
4. Email sent to client with PDF attachment
5. Coach can view invoice in dashboard
6. Coach manually marks as "paid" when payment received
```

### Flow 4: Coach Reviews Dashboard

```
1. Coach opens web dashboard (or iPhone app)
2. Sees today's schedule at a glance
3. Views upcoming bookings (next 7 days)
4. Checks pending booking requests (needs approval)
5. Reviews recent invoices
6. Searches client history
```

---

## 🎨 UI/UX Guidelines

### Design Principles
1. **Mobile-First**: Design for iPhone, scale up to desktop
2. **Minimal Clicks**: Common actions in 1-2 taps
3. **Clear Feedback**: Loading states, success/error messages
4. **Consistent**: Same patterns throughout app
5. **Accessible**: WCAG 2.1 AA compliance

### Color Palette (Suggestions)
- **Primary**: Calm blue (#3B82F6) - trust, professionalism
- **Success**: Green (#10B981) - approvals, completed
- **Warning**: Amber (#F59E0B) - pending items
- **Danger**: Red (#EF4444) - cancellations, blocks
- **Neutral**: Gray scale for backgrounds, text

### Key Screens

#### 1. Client Booking Page
```
┌─────────────────────────────────┐
│  [Logo] Book a Session          │
├─────────────────────────────────┤
│  [Calendar Month View]          │
│  Available dates highlighted    │
│                                 │
│  Selected: Monday, Jan 15       │
│  ┌───┐ ┌───┐ ┌───┐            │
│  │9am│ │1pm│ │3pm│ ...        │
│  └───┘ └───┘ └───┘            │
│                                 │
│  Your Information:              │
│  [Name    ]                     │
│  [Email   ]                     │
│  [Phone   ]                     │
│  [Notes (optional)]             │
│                                 │
│  [Request Booking] button       │
└─────────────────────────────────┘
```

#### 2. Coach iPhone Dashboard
```
┌─────────────────────────────────┐
│  ☰  Today • Jan 15              │
├─────────────────────────────────┤
│  ⚠️  2 Pending Requests         │
├─────────────────────────────────┤
│  📅 Today's Schedule            │
│  ┌─────────────────────────┐   │
│  │ 9:00 AM - 10:00 AM      │   │
│  │ John Doe                │   │
│  │ ☎ +1234567890          │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 2:00 PM - 3:00 PM       │   │
│  │ Jane Smith              │   │
│  │ ☎ +0987654321          │   │
│  └─────────────────────────┘   │
├─────────────────────────────────┤
│  [➕ Block Time]  [📅 Calendar] │
└─────────────────────────────────┘
```

#### 3. Pending Approval Screen
```
┌─────────────────────────────────┐
│  ← Booking Request              │
├─────────────────────────────────┤
│  John Doe                       │
│  📧 john@example.com            │
│  ☎ +1 234 567 890               │
│                                 │
│  Requested Time:                │
│  Wednesday, Jan 17              │
│  2:00 PM - 3:00 PM              │
│                                 │
│  Notes:                         │
│  "First session, interested     │
│   in career coaching"           │
│                                 │
│  [✅ Approve]  [❌ Decline]      │
└─────────────────────────────────┘
```

---

## 🚀 Implementation Plan

### Phase 1: Foundation (Week 1-2)

#### Week 1: Setup & Database
- [ ] Initialize monorepo structure
- [ ] Set up PostgreSQL database
- [ ] Create database schema + migrations
- [ ] Set up backend API (Express + TypeScript)
- [ ] Implement basic CRUD endpoints for clients
- [ ] Set up authentication (magic link)

#### Week 2: Core Booking Logic
- [ ] Build booking availability algorithm
- [ ] Implement booking request system
- [ ] Create blocked times functionality
- [ ] Set up email service (Resend)
- [ ] Build basic email templates

### Phase 2: Frontend (Week 3-4)

#### Week 3: Client-Facing Booking
- [ ] Set up React app with TypeScript
- [ ] Build calendar component (available slots)
- [ ] Create booking form
- [ ] Implement booking submission flow
- [ ] Add email confirmations

#### Week 4: Coach Dashboard
- [ ] Build coach authentication
- [ ] Create dashboard layout
- [ ] Implement booking approval interface
- [ ] Add block time feature
- [ ] Build today's schedule view

### Phase 3: Mobile & Polish (Week 5-6)

#### Week 5: Mobile Optimization
- [ ] Convert to Progressive Web App (PWA)
- [ ] Optimize for iPhone (responsive design)
- [ ] Add push notifications (booking requests)
- [ ] Implement calendar export (.ics files)
- [ ] Test on actual iPhone device

#### Week 6: Invoicing
- [ ] Design invoice PDF template
- [ ] Implement PDF generation (Puppeteer)
- [ ] Auto-generate invoice after session
- [ ] Email invoice to client
- [ ] Build invoice management dashboard

### Phase 4: Testing & Launch (Week 7-8)

#### Week 7: Testing
- [ ] Unit tests for critical functions
- [ ] Integration tests for booking flow
- [ ] End-to-end tests (Playwright)
- [ ] Manual testing on iPhone
- [ ] Fix bugs and edge cases

#### Week 8: Deployment & Documentation
- [ ] Deploy backend to Railway/Render
- [ ] Deploy frontend to Vercel
- [ ] Set up domain + SSL
- [ ] Write user documentation
- [ ] Create coach onboarding guide
- [ ] Soft launch with test clients

---

## 🧪 Testing Strategy

### Testing Pyramid

```
       /\
      /E2E\          End-to-End (10%)
     /──────\        - Critical user flows
    /Integ. \       Integration (20%)
   /──────────\     - API + Database
  /   Unit     \    Unit (70%)
 /──────────────\   - Business logic
```

### Critical Test Scenarios

1. **Booking Flow**
   - Client can view available slots
   - Client can submit booking request
   - Double booking prevention
   - Blocked times are unavailable
   - Email notifications sent

2. **Approval Flow**
   - Coach receives pending requests
   - Approve/reject updates status correctly
   - Client receives approval notification
   - Calendar sync works

3. **Invoice Generation**
   - Invoice auto-generates after session
   - PDF renders correctly
   - Email sends successfully
   - Invoice number increments properly

4. **Edge Cases**
   - Overlapping bookings
   - Past date booking attempts
   - Invalid email addresses
   - Timezone handling
   - Network failures

---

## 📦 Project Structure

```
coaching-platform/
├── packages/
│   ├── web/                    # React frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── booking/
│   │   │   │   │   ├── Calendar.tsx
│   │   │   │   │   ├── BookingForm.tsx
│   │   │   │   │   └── TimeSlotPicker.tsx
│   │   │   │   ├── coach/
│   │   │   │   │   ├── Dashboard.tsx
│   │   │   │   │   ├── ApprovalList.tsx
│   │   │   │   │   ├── BlockTimeModal.tsx
│   │   │   │   │   └── TodaySchedule.tsx
│   │   │   │   ├── invoices/
│   │   │   │   │   ├── InvoiceList.tsx
│   │   │   │   │   └── InvoicePreview.tsx
│   │   │   │   └── common/
│   │   │   │       ├── Button.tsx
│   │   │   │       ├── Input.tsx
│   │   │   │       └── Modal.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useBookings.ts
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useCalendar.ts
│   │   │   ├── pages/
│   │   │   │   ├── BookingPage.tsx
│   │   │   │   ├── CoachDashboard.tsx
│   │   │   │   └── LoginPage.tsx
│   │   │   ├── services/
│   │   │   │   └── api.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── App.tsx
│   │   ├── public/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── api/                    # Express backend
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   ├── bookings.controller.ts
│   │   │   │   ├── clients.controller.ts
│   │   │   │   ├── invoices.controller.ts
│   │   │   │   └── auth.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── booking.service.ts
│   │   │   │   ├── calendar.service.ts
│   │   │   │   ├── email.service.ts
│   │   │   │   ├── invoice.service.ts
│   │   │   │   └── availability.service.ts
│   │   │   ├── models/
│   │   │   │   ├── client.model.ts
│   │   │   │   ├── booking.model.ts
│   │   │   │   └── invoice.model.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── validation.middleware.ts
│   │   │   │   └── errorHandler.middleware.ts
│   │   │   ├── routes/
│   │   │   │   ├── bookings.routes.ts
│   │   │   │   ├── clients.routes.ts
│   │   │   │   ├── invoices.routes.ts
│   │   │   │   └── auth.routes.ts
│   │   │   ├── utils/
│   │   │   │   ├── database.ts
│   │   │   │   ├── logger.ts
│   │   │   │   └── validators.ts
│   │   │   ├── templates/
│   │   │   │   ├── emails/
│   │   │   │   │   ├── booking-confirmation.html
│   │   │   │   │   ├── booking-reminder.html
│   │   │   │   │   └── invoice-email.html
│   │   │   │   └── invoice.html
│   │   │   └── server.ts
│   │   ├── migrations/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared/                 # Shared types
│       ├── src/
│       │   ├── types/
│       │   │   ├── booking.types.ts
│       │   │   ├── client.types.ts
│       │   │   ├── invoice.types.ts
│       │   │   └── api.types.ts
│       │   └── utils/
│       │       ├── dates.ts
│       │       └── validation.ts
│       ├── package.json
│       └── tsconfig.json
│
├── docs/
│   ├── API.md                  # API documentation
│   ├── DEPLOYMENT.md           # Deployment guide
│   └── USER_GUIDE.md           # User manual
│
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions
│
├── package.json                # Root package.json (workspaces)
├── .gitignore
├── README.md
└── tsconfig.json
```

---

## 🔌 API Endpoints

### Public Endpoints (No Auth)

```
GET    /api/availability?date=2024-01-15
       → Get available time slots for a date

POST   /api/bookings
       Body: { clientName, email, phone, startTime, endTime, notes }
       → Create booking request

GET    /api/bookings/:token
       → View booking status by token
```

### Coach Endpoints (Auth Required)

```
POST   /api/auth/magic-link
       Body: { email }
       → Send magic link for login

GET    /api/auth/verify?token=xxx
       → Verify magic link and return JWT

GET    /api/bookings
       Query: ?status=pending&date=2024-01-15
       → Get all bookings (with filters)

PATCH  /api/bookings/:id/approve
       → Approve booking request

PATCH  /api/bookings/:id/reject
       Body: { reason }
       → Reject booking request

PATCH  /api/bookings/:id/complete
       → Mark session as completed

GET    /api/clients
       → Get all clients

GET    /api/clients/:id
       → Get client details + history

POST   /api/blocked-times
       Body: { startTime, endTime, reason }
       → Block coach availability

DELETE /api/blocked-times/:id
       → Remove blocked time

GET    /api/invoices
       → Get all invoices

GET    /api/invoices/:id/pdf
       → Download invoice PDF

POST   /api/invoices/:id/send
       → Resend invoice email

PATCH  /api/invoices/:id
       Body: { status: 'paid' }
       → Update invoice status

GET    /api/dashboard/today
       → Get today's schedule + pending requests

GET    /api/settings
       → Get coach settings

PATCH  /api/settings
       Body: { businessName, sessionDuration, ... }
       → Update settings

GET    /api/calendar/export?startDate=...&endDate=...
       → Export calendar as .ics file
```

---

## 🎯 Key Algorithms

### 1. Availability Calculation

```typescript
/**
 * Calculate available time slots for a given date
 * 
 * Considers:
 * - Working hours (from settings)
 * - Existing bookings
 * - Blocked times
 * - Session duration + buffer time
 */
function calculateAvailability(date: Date): TimeSlot[] {
  const workingHours = getWorkingHours(date);
  const sessionDuration = getSetting('sessionDuration'); // e.g., 60 min
  const bufferTime = getSetting('bufferTime'); // e.g., 15 min
  
  const allPossibleSlots = generateTimeSlots(
    workingHours.start,
    workingHours.end,
    sessionDuration + bufferTime
  );
  
  const bookedSlots = getBookingsForDate(date);
  const blockedSlots = getBlockedTimesForDate(date);
  
  return allPossibleSlots.filter(slot => {
    return !overlapsWithBooked(slot, bookedSlots) &&
           !overlapsWithBlocked(slot, blockedSlots) &&
           isInFuture(slot.startTime);
  });
}
```

### 2. Double Booking Prevention

```typescript
/**
 * Check for booking conflicts before saving
 * 
 * Validates:
 * - No overlap with existing bookings
 * - No overlap with blocked times
 * - Within working hours
 * - Not in the past
 */
async function validateBooking(booking: BookingRequest): Promise<boolean> {
  // Check past date
  if (isPast(booking.startTime)) {
    throw new Error('Cannot book in the past');
  }
  
  // Check working hours
  if (!isWithinWorkingHours(booking.startTime, booking.endTime)) {
    throw new Error('Outside working hours');
  }
  
  // Check existing bookings
  const overlappingBookings = await db.bookings.findOverlapping(
    booking.startTime,
    booking.endTime
  );
  if (overlappingBookings.length > 0) {
    throw new Error('Time slot already booked');
  }
  
  // Check blocked times
  const overlappingBlocks = await db.blockedTimes.findOverlapping(
    booking.startTime,
    booking.endTime
  );
  if (overlappingBlocks.length > 0) {
    throw new Error('Time slot unavailable');
  }
  
  return true;
}
```

### 3. Invoice Number Generation

```typescript
/**
 * Generate unique invoice number
 * Format: INV-YYYY-XXXX (e.g., INV-2024-0001)
 */
async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;
  
  const lastInvoice = await db.invoices.findLast({
    where: { invoiceNumber: { startsWith: prefix } },
    orderBy: { invoiceNumber: 'desc' }
  });
  
  let sequence = 1;
  if (lastInvoice) {
    const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
    sequence = lastNumber + 1;
  }
  
  const paddedSequence = sequence.toString().padStart(4, '0');
  return `${prefix}${paddedSequence}`;
}
```

---

## 📧 Email Templates

### 1. Booking Confirmation (Pending)
**Subject**: Your coaching session request has been received

```html
Hi {{clientName}},

Thank you for requesting a coaching session!

Session Details:
- Date: {{sessionDate}}
- Time: {{sessionTime}}
- Duration: {{duration}} minutes

Your request is currently pending approval. You'll receive 
another email once it's confirmed.

If you need to make changes, please reply to this email.

Best regards,
{{coachName}}
```

### 2. Booking Approved
**Subject**: Your coaching session is confirmed ✓

```html
Hi {{clientName}},

Great news! Your coaching session has been confirmed.

Session Details:
- Date: {{sessionDate}}
- Time: {{sessionTime}}
- Location: {{location}}
- Duration: {{duration}} minutes

You'll receive a reminder 24 hours before your session.

Looking forward to meeting you!

Best regards,
{{coachName}}

[Add to Calendar] (attached .ics file)
```

### 3. Session Reminder (24 hours before)
**Subject**: Reminder: Coaching session tomorrow

```html
Hi {{clientName}},

This is a friendly reminder about your coaching session tomorrow:

- Date: {{sessionDate}}
- Time: {{sessionTime}}
- Location: {{location}}

If you need to reschedule, please contact me as soon as possible.

See you soon!

Best regards,
{{coachName}}
```

### 4. Invoice Email
**Subject**: Invoice for coaching session on {{sessionDate}}

```html
Hi {{clientName}},

Thank you for your coaching session!

Please find your invoice ({{invoiceNumber}}) attached.

Session Summary:
- Date: {{sessionDate}}
- Duration: {{duration}} minutes
- Amount: {{currency}}{{amount}}

Payment instructions: {{paymentInstructions}}

If you have any questions, feel free to reach out.

Best regards,
{{coachName}}
```

---

## 🎨 Invoice Template Design

### Basic Invoice PDF Layout

```
┌────────────────────────────────────────────────┐
│  [LOGO]                  INVOICE               │
│  {{businessName}}        INV-2024-0001         │
│  {{businessEmail}}                             │
│  {{businessPhone}}       Date: Jan 15, 2024    │
│                          Due: Jan 30, 2024     │
├────────────────────────────────────────────────┤
│  Bill To:                                      │
│  {{clientName}}                                │
│  {{clientEmail}}                               │
│  {{clientPhone}}                               │
├────────────────────────────────────────────────┤
│  Description              Qty    Rate    Total │
│  ───────────────────────────────────────────── │
│  Coaching Session          1    $100    $100   │
│  ({{sessionDate}})                             │
│                                                 │
├────────────────────────────────────────────────┤
│                              Subtotal:  $100    │
│                                  Total:  $100    │
│                                                 │
│  Payment Instructions:                         │
│  {{paymentInstructions}}                       │
│                                                 │
│  Notes:                                        │
│  {{invoiceNotes}}                              │
└────────────────────────────────────────────────┘
```

---

## ⚙️ Configuration & Environment Variables

### Backend (.env)

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/coaching_db

# Server
PORT=3000
NODE_ENV=development

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRY=1h
MAGIC_LINK_EXPIRY=15m

# Email Service (Resend)
RESEND_API_KEY=re_xxx
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Your Coaching Business

# Calendar
TIMEZONE=America/New_York

# Invoice
INVOICE_CURRENCY=USD
INVOICE_PAYMENT_INSTRUCTIONS=Please transfer to [bank details]

# Frontend URL (for magic links)
FRONTEND_URL=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)

```bash
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Coaching Platform
```

---

## 🚨 Error Handling

### API Error Responses

```typescript
// Standardized error format
{
  error: {
    code: "BOOKING_CONFLICT",
    message: "This time slot is no longer available",
    details: {
      conflictingBooking: "booking-uuid",
      suggestedAlternatives: [...]
    }
  }
}
```

### Common Error Codes

```typescript
// Authentication
AUTH_INVALID_TOKEN
AUTH_EXPIRED_TOKEN
AUTH_MISSING_TOKEN

// Bookings
BOOKING_CONFLICT
BOOKING_PAST_DATE
BOOKING_OUTSIDE_HOURS
BOOKING_NOT_FOUND
BOOKING_ALREADY_APPROVED

// Validation
VALIDATION_INVALID_EMAIL
VALIDATION_INVALID_PHONE
VALIDATION_MISSING_FIELD
VALIDATION_INVALID_DATE

// Server
SERVER_ERROR
DATABASE_ERROR
EMAIL_SEND_FAILED
```

---

## 📊 Monitoring & Analytics (Future)

### Key Metrics to Track

1. **Booking Metrics**
   - Total bookings per month
   - Approval rate (approved / total requests)
   - Cancellation rate
   - Average response time for approvals

2. **Client Metrics**
   - New clients per month
   - Returning clients rate
   - Client lifetime value
   - Most common booking times

3. **Revenue Metrics**
   - Total revenue per month
   - Paid vs unpaid invoices
   - Average session price

4. **System Health**
   - API response times
   - Error rates
   - Email delivery rate
   - Uptime percentage

*Note: Analytics dashboard is Phase 2+ feature*

---

## 🔄 Backup & Data Management

### Backup Strategy

1. **Database Backups**
   - Automated daily backups (PostgreSQL dumps)
   - Retain for 30 days
   - Store in separate location (S3 or similar)

2. **Invoice PDFs**
   - Store in cloud storage (S3, Cloudflare R2)
   - Keep permanently (legal requirement)

3. **Email Logs**
   - Retain for 90 days
   - Archive older logs

### Data Export

```typescript
// Client data export endpoint
GET /api/clients/:id/export
→ Returns JSON with all client data including:
  - Client info
  - All bookings
  - All invoices
  - Session notes
```

---

## 🛠️ Development Tips for Claude Code

### Getting Started

1. **First Steps**:
   ```bash
   # Initialize project
   mkdir coaching-platform
   cd coaching-platform
   npm init -y
   
   # Set up workspaces in package.json
   # Create packages/web, packages/api, packages/shared
   ```

2. **Database Setup**:
   ```bash
   # Install PostgreSQL locally or use Docker
   docker run --name coaching-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
   
   # Create database
   createdb coaching_db
   ```

3. **Backend First**: Build API endpoints before frontend
4. **Test as You Go**: Write tests for each module
5. **Use TypeScript**: Catch errors early
6. **Mock Data**: Create seed data for testing

### Code Quality Checklist

- [ ] TypeScript strict mode enabled
- [ ] ESLint + Prettier configured
- [ ] Git hooks for linting (Husky)
- [ ] API input validation (Zod or Joi)
- [ ] Error boundaries in React
- [ ] Loading states for all async operations
- [ ] Mobile responsive (test on actual device)
- [ ] Accessible (keyboard navigation, screen readers)

### Common Pitfalls to Avoid

1. **Timezone Issues**: Always store UTC in database, convert for display
2. **Race Conditions**: Use database transactions for bookings
3. **Memory Leaks**: Clean up React useEffect subscriptions
4. **N+1 Queries**: Use eager loading or DataLoader
5. **Hardcoded Values**: Use environment variables
6. **No Validation**: Validate on both frontend AND backend
7. **Large Bundles**: Code split React routes

---

## 📚 Useful Libraries & Tools

### Frontend

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "react-query": "^5.0.0",
  "date-fns": "^3.0.0",
  "react-calendar": "^4.7.0",
  "axios": "^1.6.0",
  "zod": "^3.22.0",
  "tailwindcss": "^3.4.0",
  "lucide-react": "^0.300.0"
}
```

### Backend

```json
{
  "express": "^4.18.0",
  "pg": "^8.11.0",
  "jsonwebtoken": "^9.0.0",
  "bcrypt": "^5.1.0",
  "nodemailer": "^6.9.0",
  "puppeteer": "^21.0.0",
  "ical-generator": "^5.0.0",
  "zod": "^3.22.0",
  "winston": "^3.11.0"
}
```

### Development

```json
{
  "typescript": "^5.3.0",
  "vite": "^5.0.0",
  "vitest": "^1.0.0",
  "playwright": "^1.40.0",
  "eslint": "^8.55.0",
  "prettier": "^3.1.0"
}
```

---

## 🎓 Learning Resources

### If You Get Stuck

1. **React**: https://react.dev/learn
2. **TypeScript**: https://www.typescriptlang.org/docs/
3. **PostgreSQL**: https://www.postgresql.org/docs/
4. **Express**: https://expressjs.com/en/guide/routing.html
5. **Tailwind CSS**: https://tailwindcss.com/docs

### Similar Projects for Reference

- Calendly (booking system)
- Acuity Scheduling (calendar + payments)
- SimplyBook.me (appointment booking)

---

## ✅ Definition of Done (MVP)

The MVP is complete when:

- [ ] Client can book a session via web interface
- [ ] Coach receives booking requests on iPhone
- [ ] Coach can approve/reject bookings from iPhone
- [ ] Approved bookings sync to iPhone calendar
- [ ] Coach can block dates/times
- [ ] Automatic invoice generation after sessions
- [ ] Invoice PDFs emailed to clients
- [ ] Coach can view client history
- [ ] All email notifications working
- [ ] Responsive design works on iPhone & desktop
- [ ] No critical bugs
- [ ] Deployed to production with custom domain

---

## 🔮 Phase 2+ Ideas (Not MVP)

### High Priority
- Client login portal (view bookings, history)
- Payment processing (Stripe)
- Recurring session packages
- Advanced invoice customization
- Google Calendar sync

### Medium Priority
- Client intake forms
- Session notes/records
- Progress tracking
- Analytics dashboard
- Multiple coaches support

### Low Priority
- Video call integration
- Group sessions
- SMS notifications
- Mobile apps (iOS/Android)
- API for third-party integrations

---

## 📝 Final Notes

### Design Philosophy Recap
1. **Start Simple**: MVP first, features later
2. **Privacy First**: Minimal data = fewer regulations
3. **Mobile Matters**: Coach uses iPhone primarily
4. **Automate Billing**: Invoices reduce admin work
5. **Stay Flexible**: Easy to modify and extend

### Success Criteria
- Coach spends <5 minutes/day managing bookings
- Clients can book in <2 minutes
- Zero double bookings
- Invoices sent within 5 minutes of session end
- Works flawlessly on iPhone

### Questions Before Starting?

If anything is unclear, ask about:
- Specific technical implementation details
- Architecture decisions
- Database schema
- API design
- UI/UX flows

---

**Document Version**: 1.0  
**Last Updated**: November 2024  
**Status**: Ready for Development

Good luck building! 🚀