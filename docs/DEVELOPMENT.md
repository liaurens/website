# Development Guidelines

This document outlines the development practices and conventions for the Coaching Platform project.

## Technology Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Testing**: Vitest

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query + Context API
- **Testing**: Vitest

## Code Style & Conventions

### TypeScript

- Use **strict mode** (already enabled)
- Prefer `interface` over `type` for object shapes
- Use `type` for unions, intersections, and primitives
- Always type function parameters and return values

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// Avoid
function getUser(id) {
  // No types
}
```

### Naming Conventions

- **Files**: `kebab-case` (e.g., `booking.service.ts`)
- **Components**: `PascalCase` (e.g., `BookingForm.tsx`)
- **Variables/Functions**: `camelCase` (e.g., `getUserById`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_SESSIONS`)
- **Interfaces**: `PascalCase` (e.g., `BookingRequest`)
- **Types**: `PascalCase` (e.g., `BookingStatus`)

### Project Structure

#### Backend (`packages/api/src/`)

```
src/
├── controllers/     # Request handlers
├── services/        # Business logic
├── models/          # Database models
├── middleware/      # Express middleware
├── routes/          # API routes
├── utils/           # Helper functions
├── templates/       # Email/PDF templates
└── server.ts        # Entry point
```

#### Frontend (`packages/web/src/`)

```
src/
├── components/      # React components
│   ├── booking/     # Feature-specific components
│   ├── coach/
│   └── common/      # Reusable components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── services/        # API service layer
├── types/           # TypeScript types
└── App.tsx          # Root component
```

## Git Workflow

### Branch Naming

- `feature/` - New features (e.g., `feature/booking-calendar`)
- `fix/` - Bug fixes (e.g., `fix/validation-error`)
- `docs/` - Documentation (e.g., `docs/api-reference`)
- `refactor/` - Code refactoring (e.g., `refactor/auth-service`)

### Commit Messages

Use conventional commits format:

```
<type>(<scope>): <subject>

<body>
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

Examples:
```
feat(booking): add booking calendar component

fix(api): resolve timezone handling in availability calculation

docs: update getting started guide
```

## Testing Strategy

### Unit Tests

- Test individual functions and utilities
- Mock external dependencies
- Aim for 70% coverage

```typescript
// Example: packages/api/src/services/booking.service.test.ts
import { describe, it, expect } from 'vitest';
import { calculateAvailability } from './booking.service';

describe('BookingService', () => {
  it('should calculate available time slots', () => {
    const date = new Date('2024-01-15');
    const slots = calculateAvailability(date);
    expect(slots).toHaveLength(8); // 8 hour slots
  });
});
```

### Integration Tests

- Test API endpoints
- Use test database
- Test request/response flows

### E2E Tests (Future)

- Test complete user flows
- Use Playwright
- Run before deployment

## API Development

### REST API Conventions

- Use proper HTTP methods:
  - `GET` - Retrieve data
  - `POST` - Create new resource
  - `PUT/PATCH` - Update resource
  - `DELETE` - Remove resource

- Use proper status codes:
  - `200` - Success
  - `201` - Created
  - `400` - Bad request
  - `401` - Unauthorized
  - `404` - Not found
  - `500` - Server error

- Always return JSON:
```typescript
// Good
res.status(200).json({ data: booking });

// Avoid
res.send('Success');
```

### Error Handling

Use consistent error format:

```typescript
{
  error: {
    code: "BOOKING_CONFLICT",
    message: "This time slot is already booked",
    details: {
      conflictingBooking: "booking-123"
    }
  }
}
```

### Validation

Use Zod for request validation:

```typescript
import { z } from 'zod';

const BookingRequestSchema = z.object({
  clientName: z.string().min(1),
  email: z.string().email(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

// In route handler
const result = BookingRequestSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ error: result.error });
}
```

## Frontend Development

### Component Guidelines

- Keep components small and focused
- Use functional components with hooks
- Extract reusable logic into custom hooks
- Use TypeScript for props

```typescript
// Good component structure
interface BookingFormProps {
  onSubmit: (booking: BookingRequest) => void;
  loading?: boolean;
}

export function BookingForm({ onSubmit, loading = false }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingRequest>({...});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### State Management

- Use React Query for server state
- Use Context API for UI state
- Avoid prop drilling

```typescript
// Server state with React Query
import { useQuery } from '@tanstack/react-query';

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: () => api.getBookings(),
  });
}
```

### Styling

- Use Tailwind CSS utility classes
- Create reusable component classes when needed
- Follow mobile-first approach

```tsx
// Mobile-first responsive design
<div className="w-full md:w-1/2 lg:w-1/3">
  <button className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-blue-600">
    Book Session
  </button>
</div>
```

## Database

### Schema Changes

1. Create migration file (coming soon with migration tool)
2. Test migration locally
3. Document changes
4. Run migration in production

### Query Optimization

- Use indexes for frequently queried fields
- Avoid N+1 queries
- Use transactions for related operations

```typescript
// Good: Single query with join
const bookingsWithClients = await db.query(`
  SELECT b.*, c.name, c.email
  FROM bookings b
  JOIN clients c ON b.client_id = c.id
  WHERE b.status = 'pending'
`);

// Avoid: N+1 queries
const bookings = await db.query('SELECT * FROM bookings');
for (const booking of bookings) {
  const client = await db.query('SELECT * FROM clients WHERE id = ?', booking.client_id);
}
```

## Performance

### Backend

- Use caching for frequent queries
- Implement rate limiting
- Optimize database queries
- Use pagination for large datasets

### Frontend

- Code split routes
- Lazy load components
- Optimize images
- Minimize bundle size

## Security

### Best Practices

- Never commit secrets (use `.env` files)
- Validate all user inputs
- Use parameterized queries (prevent SQL injection)
- Sanitize output (prevent XSS)
- Use HTTPS in production
- Implement rate limiting
- Use JWT with short expiration
- Hash passwords with bcrypt

### Environment Variables

```bash
# Never do this
const secret = 'my-secret-key';

# Always do this
const secret = process.env.JWT_SECRET;
```

## Code Review Checklist

Before submitting PR:

- [ ] Code follows style guidelines
- [ ] Types are properly defined
- [ ] Tests are written and passing
- [ ] No console.logs or debug code
- [ ] Error handling is implemented
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance is acceptable

## Useful Commands

```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Run tests
npm test

# Build all packages
npm run build

# Clean and reinstall
npm run clean && npm install
```

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev/)

## Questions?

If you're unsure about any development practice, ask! It's better to clarify than to guess.
