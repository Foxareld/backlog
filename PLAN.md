# Plan: Video Game Backlog App

Build a full-stack React CRUD app for managing a personal video game backlog with multi-user authentication, IGDB API integration, and filtering capabilities.

**TL;DR**: Create a Next.js full-stack app with Supabase (PostgreSQL + Auth) backend. Users can search games via IGDB API (proxied through Next.js API routes), add them to their personal backlog, mark status (not started/in progress/completed), add notes/ratings, set priorities, and filter by console/genre. Deploy to Vercel with Supabase cloud database.

---

## Stack Summary

- **Framework**: Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- **State Management**: TanStack Query for server state
- **Backend/Database**: Supabase (PostgreSQL + Auth) + Next.js API Routes
- **External API**: IGDB.com (via Twitch OAuth, proxied through Next.js API routes)
- **Deployment**: Vercel (handles both frontend & API routes) + Supabase cloud

---

## Steps

### Phase 1: Project Setup & Configuration

1. **Initialize Next.js project**
    - Run `npx create-next-app@latest` → select TypeScript, Tailwind CSS, App Router
    - Install dependencies: TanStack Query, Supabase client
    - Configure project structure (app directory, components, lib folders)

2. **Set up Supabase project** (_parallel with step 1_)
    - Create free Supabase account and new project
    - Save project URL and anon key for frontend configuration
    - Enable email authentication in Supabase dashboard

3. **Register for IGDB API access** (_parallel with steps 1-2_)
    - Create Twitch Developer account
    - Register application to get Client ID and Client Secret
    - Document OAuth flow for getting access tokens

### Phase 2: Database Schema & Authentication

4. **Design and create database schema in Supabase**
    - Create `profiles` table (user metadata)
    - Create `backlog_games` table with fields:
        - id (primary key)
        - user_id (foreign key to auth.users)
        - igdb_game_id (from IGDB API)
        - game_title, cover_url, genres, platforms (cached from IGDB)
        - status (enum: not_started, in_progress, completed)
        - priority (integer: 1-5 or low/medium/high)
        - personal_rating (integer: 1-10, nullable)
        - personal_notes (text, nullable)
        - created_at, updated_at (timestamps)
    - Set up Row Level Security (RLS) policies so users only see their own games

5. **Implement authentication flow**
    - Create login/signup pages using Next.js App Router
    - Implement Supabase auth (email/password)
    - Add middleware for protected routes
    - Create auth context for user state management (or use Supabase SSR)

### Phase 3: IGDB API Integration

6. **Create IGDB API proxy with Next.js API Routes** (_depends on step 3_)
    - Create `/app/api/games/search/route.ts` for game search
    - Create `/app/api/games/[id]/route.ts` for game details
    - Implement OAuth token management (Twitch credentials) with token caching
    - Store access token in memory or Redis (or regenerate as needed)
    - Add error handling and rate limit management

7. **Build game search interface**
    - Create search bar component with debouncing
    - Display search results with game covers, title, platforms, genres
    - Add "Add to Backlog" button for each result
    - Handle loading and error states

### Phase 4: Core CRUD Operations

8. **Implement "Add Game" functionality** (_depends on step 7_)
    - When user clicks "Add to Backlog", save to Supabase `backlog_games` table
    - Cache game data from IGDB to avoid repeated API calls
    - Show success notification
    - Prevent duplicates (check if game already in user's backlog)

9. **Build backlog list view** (_parallel with step 8_)
    - Fetch user's backlog games from Supabase
    - Display as grid/list with game covers, titles, status badges
    - Implement pagination or infinite scroll if needed
    - Show empty state when backlog is empty

10. **Add update/edit functionality**
    - Create modal or detail view for each game
    - Allow editing: status, priority, rating, notes
    - Save updates to Supabase
    - Implement optimistic updates for better UX

11. **Implement delete functionality**
    - Add delete button (with confirmation dialog)
    - Remove game from Supabase
    - Update UI immediately

### Phase 5: Filtering & Sorting

12. **Build filter/sort system** (_depends on step 9_)
    - Create filter sidebar or dropdown with options:
        - Status (not started / in progress / completed)
        - Priority (high / medium / low)
        - Platform/console (dynamically from user's games)
        - Genre (dynamically from user's games)
    - Implement sort options:
        - Date added (newest/oldest)
        - Priority (high to low / low to high)
        - Title (A-Z / Z-A)
        - Rating (if rated)
    - Apply filters using Supabase queries or client-side filtering

13. **Add search within backlog**
    - Search bar to filter user's existing games by title
    - Works alongside other filters

### Phase 6: Polish & Deployment

14. **Add responsive design and polish**
    - Ensure mobile-friendly layout
    - Add loading skeletons
    - Improve error handling and user feedback
    - Add animations/transitions with Tailwind

15. **Set up deployment** (_parallel with step 14_)
    - Connect GitHub repository to Vercel
    - Add environment variables (Supabase URL/Key/JWT Secret, IGDB/Twitch credentials)
    - Vercel automatically handles Next.js deployment (both frontend & API routes)
    - Deploy and test production build

16. **Testing and bug fixes**
    - Test all CRUD operations
    - Test authentication flow
    - Test filtering/sorting combinations
    - Test on different devices/browsers
    - Fix any issues found

---

## Relevant Files (To Be Created)

**Project Structure (Next.js App Router):**

- `/app/layout.tsx` - Root layout with providers
- `/app/page.tsx` - Landing/home page
- `/app/login/page.tsx` - Login/signup page
- `/app/dashboard/page.tsx` - Main backlog view (protected route)
- `/app/api/games/search/route.ts` - IGDB search API route
- `/app/api/games/[id]/route.ts` - IGDB game detail API route
- `/middleware.ts` - Auth middleware for protected routes
- `/lib/supabase.ts` - Supabase client configuration
- `/lib/igdb.ts` - IGDB API helper functions
- `/components/GameSearch.tsx` - IGDB search component
- `/components/BacklogList.tsx` - Display user's backlog
- `/components/GameCard.tsx` - Individual game display
- `/components/GameDetailModal.tsx` - Edit game details
- `/components/FilterSidebar.tsx` - Filtering UI
- `/hooks/useGames.ts` - TanStack Query hooks for game operations
- `.env.local` - Environment variables (not committed)

---

## Verification

1. **Authentication**: Sign up new user, log in, log out, verify protected routes work
2. **Search**: Search for games via IGDB, verify results display correctly with images
3. **Add Games**: Add multiple games to backlog, verify saved to database
4. **CRUD Operations**:
    - Update game status, priority, rating, notes
    - Delete games from backlog
    - Verify changes persist after page refresh
5. **Filtering**: Apply various filter combinations, verify correct games shown
6. **Sorting**: Test all sort options
7. **Multi-user**: Create two accounts, verify users only see their own backlogs
8. **Responsive**: Test on mobile, tablet, desktop viewports
9. **Deployment**: Verify production build works on Vercel with all features

---

## Decisions & Assumptions

**Why Next.js over Vanilla React:**

- Built-in API routes (handle IGDB proxy without serverless functions)
- File-based routing (simpler than React Router)
- Built-in image optimization for game covers
- Better performance out of the box
- More impressive on resume/portfolio
- Industry standard for modern React apps

**Why Supabase over Firebase:**

- Teaches SQL (more transferable skill)
- PostgreSQL is industry-standard relational database
- Better for portfolio (shows database design skills)
- Built-in RLS for security

**Why TypeScript:**

- Valuable for portfolio/job applications
- Catches errors during development
- Better IntelliSense/autocomplete
- Slight learning curve but worth it

**IGDB API Considerations:**

- Requires Twitch OAuth (free but needs setup)
- Has rate limits (500 requests per second)
- Need to cache responses in your database to avoid repeated calls
- Alternative: RAWG API (simpler, no OAuth, but less comprehensive)

**Authentication Approach:**

- Starting with email/password (simplest)
- Can add OAuth providers later (Google, Discord, etc.) via Supabase

**Scope Boundaries:**

- **Included**: Single backlog per user, basic CRUD, filtering, status tracking
- **Excluded (for now)**:
    - Multiple lists (wishlist vs backlog)
    - Social features (sharing lists, friends)
    - Game recommendations
    - Progress tracking (percentage complete)
    - Integration with gaming platforms (Steam, PlayStation, Xbox)

---

## Further Considerations

1. **IGDB API Alternative**: If IGDB setup is complex, would you prefer to start with **RAWG API** (simpler, no OAuth required but less data)?
    - **Recommendation**: Start with RAWG for faster initial development, migrate to IGDB later if needed

2. **TypeScript vs JavaScript**: TypeScript adds complexity but is better for portfolio.
    - **Recommendation**: Use TypeScript (Next.js makes it easy, and it's valuable for job market)

3. **Component Library**: Plain Tailwind CSS vs shadcn/ui (pre-built components)?
    - **Recommendation**: shadcn/ui for faster development with professional look

4. **App Router vs Pages Router**: Next.js has two routing systems - App Router (modern, recommended) and Pages Router (legacy).
    - **Recommendation**: Use App Router (it's the future of Next.js and teaches latest React patterns)
