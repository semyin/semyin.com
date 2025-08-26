# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Start Development Server**
```bash
npm run dev
```
Starts the Vite development server with hot reloading, typically at `http://localhost:5173`. Requires a `.env` file to be present.

**Build for Production**
```bash
npm run build
```
Uses vavite to build both client (`dist/client`) and server (`dist/server`) bundles.

**Start Production Server**
```bash
npm start
```
Runs the production build from `dist/server/index`.

## Architecture Overview

This is a **NestJS + React SSR** application using TypeScript throughout. Key architectural patterns:

### Backend Architecture (NestJS)
- **Entry Point**: `src/main.ts` - bootstraps NestJS application with global interceptors and filters
- **Module Structure**: Modular design with `src/app.module.ts` as root, `src/module/api.module.ts` for API routes
- **Database**: TypeORM with MySQL using snake_case naming strategy
- **Global Middleware**: React SSR middleware applies to all non-API routes (`/api/*` excluded)
- **API Structure**: All API endpoints prefixed with `/api` and organized by domain modules

### Frontend Architecture (React)
- **SSR Implementation**: Server-side rendering via `src/middleware/reactSsr.middleware.ts`
- **Hydration**: Client-side hydration with `ReactDOM.hydrateRoot`
- **Routing**: React Router v7 with routes defined in `src/renderer/routes.tsx`
- **State Management**: Valtio for global state, React Query for data fetching
- **Build Tool**: Vite with vavite for full-stack development

### Key Directories
- `src/module/`: Domain-specific modules (article, auth, user, etc.) with controller/service/entity/dto structure
- `src/common/`: Shared utilities, decorators, filters, interceptors, and pipes
- `src/renderer/`: React application entry points and routing
- `src/pages/`: React page components
- `src/layouts/`: Page layout components

### Environment Configuration
- Environment variables managed through NestJS ConfigModule (global)
- Development vs production mode detection via `src/environment/index.ts`
- Vite environment variables prefixed with `VITE_`
- Database configuration through TypeORM async configuration

### Build System
- **Development**: Vite dev server with vavite plugin integration
- **Production**: Dual build system (client + server) using vavite
- **Static Assets**: Served from `dist/client/assets` in production
- **Path Alias**: `@/*` maps to `src/*`

### Database Pattern
- TypeORM entities use decorators with snake_case database naming
- All modules follow controller → service → repository pattern
- DTOs for request/response validation using class-transformer