# Database Migrations

This folder contains SQL migration files for the Coaching Platform database.

## Running Migrations

### Option 1: Using psql (Recommended for now)

```bash
# Make sure PostgreSQL is running
# Create the database if it doesn't exist
createdb coaching_db

# Run the migration
psql -d coaching_db -f migrations/001_initial_schema.sql
```

### Option 2: Using psql with connection string

```bash
psql postgresql://user:password@localhost:5432/coaching_db -f migrations/001_initial_schema.sql
```

## Verifying the Migration

After running the migration, verify the tables were created:

```bash
psql -d coaching_db -c "\dt"
```

You should see the following tables:
- clients
- bookings
- blocked_times
- invoices
- settings
- email_logs

## Migration Files

- `001_initial_schema.sql` - Initial database schema with all core tables

## Future Migrations

When we need to make changes to the database schema, we'll create new migration files:
- `002_add_xxx.sql`
- `003_modify_yyy.sql`
- etc.

## Rollback (if needed)

If you need to start fresh:

```bash
# Drop all tables
psql -d coaching_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Re-run migrations
psql -d coaching_db -f migrations/001_initial_schema.sql
```

## Notes

- Migrations are currently manual (run via psql)
- In the future, we may add a migration tool like `node-pg-migrate` or `Prisma`
- Always backup your database before running migrations in production
