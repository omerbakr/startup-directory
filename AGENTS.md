# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Running the Application
- `npm run dev` - Start development server with file watching (uses Node.js --watch)
- Server runs on `http://localhost:3000` (configurable via PORT env var)

### Database Operations
- `npm run db:generate` - Generate Drizzle migrations from schema changes
- `npm run db:migrate` - Apply pending migrations to database
- `npm run db:studio` - Launch Drizzle Studio for database inspection

### Code Quality
- `npm run lint` - Run ESLint on entire codebase
- `npm run lint:fix` - Fix auto-fixable ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check Prettier formatting without changes

## Architecture Overview

This is an Express.js REST API using ES modules with the following structure:

### Core Flow
- Entry point: `src/index.js` → `src/server.js` → `src/app.js`
- Request flow: Routes → Controllers → Services → Database Models
- Database: PostgreSQL via Drizzle ORM with Supabase connection

### Module Organization
- **Config** (`#config/*`): Database connection, logger (Winston)
- **Routes** (`#routes/*`): Express router definitions (currently auth)
- **Controllers** (`#controllers/*`): Request handlers with validation and response logic
- **Services** (`#services/*`): Business logic layer
- **Models** (`#models/*`): Drizzle ORM table schemas
- **Validations** (`#validations/*`): Zod schemas for request validation
- **Utils** (`#utils/*`): JWT tokens, cookie helpers, formatting utilities

### Key Dependencies
- **Drizzle ORM** for type-safe database operations
- **Zod** for request validation
- **JWT** for authentication
- **Winston** for structured logging
- **Helmet/CORS** for security

### Import Paths
Uses Node.js subpath imports with `#` prefix (e.g., `#config/database.js`, `#controllers/auth.controller.js`)

### Database Schema
Located in `src/models/*.js`, migrations in `drizzle/` directory. Schema changes require running `npm run db:generate` to create migrations.

### Environment Configuration
- Database connection via `DATABASE_URL` (Supabase PostgreSQL)
- Server configuration in `.env` (PORT, NODE_ENV, LOG_LEVEL)