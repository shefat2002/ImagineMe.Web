# Imagine Me Frontend Project Plan

Complete React frontend implementation with authentication, authorization, API integration.

---

## Phase 1: Project Setup & Infrastructure

### Checklist
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure ESLint, Prettier, TypeScript strict mode
- [ ] Set up folder structure (app/, components/, lib/, hooks/, types/)
- [ ] Configure environment variables (.env.local)
- [ ] Install core dependencies (axios, zustand, react-hook-form, zod)
- [ ] Set up Git repository with .gitignore
- [ ] Configure base CSS with Tailwind CSS or CSS modules

**Parallel Workflow:** 2 agents
- Agent A: Project initialization + dependencies
- Agent B: Folder structure + config files

---

## Phase 2: Authentication System

### 2.1 Auth Context & State
**File:** `contexts/AuthContext.tsx`

**Tasks:**
- [ ] Create AuthContext with user state
- [ ] Implement login mutation (Parent/Admin)
- [ ] Implement child login mutation
- [ ] Implement register mutation
- [ ] Add JWT token storage (secure cookies/localStorage)
- [ ] Add token refresh logic
- [ ] Implement logout function
- [ ] Add auth state persistence

### 2.2 Auth Middleware & Route Protection
**Files:** `middleware.ts`, `components/AuthGuard.tsx`

**Tasks:**
- [ ] Create route protector component
- [ ] Implement role-based access control (Parent/Child/Admin)
- [ ] Add redirect logic for unauthenticated users
- [ ] Create public route wrapper
- [ ] Set up Next.js middleware for token validation
- [ ] Add logout redirect on 401 responses

### 2.3 Auth Forms
**Files:** `app/auth/login/page.tsx`, `app/auth/register/page.tsx`

**Tasks:**
- [ ] Create login form (email/password)
- [ ] Create child login form (username/password)
- [ ] Create registration form with validation
- [ ] Add form validation with react-hook-form + zod
- [ ] Implement error handling display
- [ ] Add success redirects
- [ ] Create "forgot password" flow UI
- [ ] Create OTP verification UI

**Parallel Workflow:** 3 agents
- Agent A: AuthContext + state management
- Agent B: Route protection + middleware
- Agent C: Auth forms + validation

---

## Phase 3: API Client & Type System

### 3.1 API Client Setup
**File:** `lib/api-client.ts`

**Tasks:**
- [ ] Create axios instance with base URL
- [ ] Add request interceptor (attach JWT token)
- [ ] Add response interceptor (handle 401/403/500)
- [ ] Implement retry logic for failed requests
- [ ] Add request timeout configuration
- [ ] Create error handling utilities

### 3.2 TypeScript Types
**File:** `types/api.ts`

**Tasks:**
- [ ] Define all API request/response types
- [ ] Create enums (UserType, ContentStatus, PurchaseStatus, etc.)
- [ ] Define DTO types matching backend contracts
- [ ] Create form input types
- [ ] Export type unions for reusable patterns

### 3.3 API Service Layer
**Files:** `lib/api/*.ts`

**Tasks:**
- [ ] Create auth service (login, register, OTP)
- [ ] Create parent service (dashboard, children CRUD)
- [ ] Create child service (profile, stories, quizzes, games, store)
- [ ] Create admin service (stats, users, content CRUD)
- [ ] Add query key factories for React Query
- [ ] Implement optimistic update helpers

**Parallel Workflow:** 2 agents
- Agent A: API client + interceptors
- Agent B: Type definitions + service layer

---

## Phase 4: Parent Dashboard

### 4.1 Dashboard Layout
**File:** `app/parent/dashboard/layout.tsx`

**Tasks:**
- [ ] Create parent layout shell (sidebar/nav)
- [ ] Add navigation components (Dashboard, Children, Activity)
- [ ] Implement responsive design
- [ ] Add user menu with logout
- [ ] Create breadcrumb component

### 4.2 Dashboard Home
**File:** `app/parent/dashboard/page.tsx`

**Tasks:**
- [ ] Fetch parent dashboard stats
- [ ] Display total/active children counts
- [ ] Render child activity list
- [ ] Add last activity timestamps
- [ ] Implement loading/error states
- [ ] Add empty state design

### 4.3 Children Management
**Files:** `app/parent/children/page.tsx`, `app/parent/children/[id]/page.tsx`

**Tasks:**
- [ ] List all children with avatars
- [ ] Create "Add Child" form modal
- [ ] Implement child CRUD operations
- [ ] Build child detail view
- [ ] Show child stats (coins, streak)
- [ ] Add delete confirmation
- [ ] Display activity history table

**Parallel Workflow:** 2 agents
- Agent A: Layout + dashboard home
- Agent B: Children management + CRUD

---

## Phase 5: Child Portal

### 5.1 Child Portal Layout
**File:** `app/child/portal/layout.tsx`

**Tasks:**
- [ ] Create child-friendly navigation
- [ ] Add coin counter display
- [ ] Add streak counter display
- [ ] Implement logout button
- [ ] Create engaging, colorful design

### 5.2 Child Profile
**File:** `app/child/portal/profile/page.tsx`

**Tasks:**
- [ ] Display child profile info
- [ ] Show stats (stories read, quizzes taken)
- [ ] Implement avatar customization UI
- [ ] Create daily reward claim button
- [ ] Show purchase history

### 5.3 Content Discovery
**Files:** `app/child/portal/stories/page.tsx`, `app/child/portal/quizzes/page.tsx`

**Tasks:**
- [ ] Create story card grid
- [ ] Build story detail/reader view
- [ ] Create quiz listing page
- [ ] Build quiz taking interface
- [ ] Implement progress tracking
- [ ] Add coin award animations

### 5.4 Mini-Games
**File:** `app/child/portal/games/page.tsx`

**Tasks:**
- [ ] List available mini-games
- [ ] Create game launcher
- [ ] Implement game completion logging
- [ ] Add score submission

### 5.5 Store System
**Files:** `app/child/portal/store/page.tsx`

**Tasks:**
- [ ] Display store items grid
- [ ] Show coin prices
- [ ] Implement purchase request flow
- [ ] Display "pending approval" status
- [ ] Show owned items
- [ ] Create purchase history view

**Parallel Workflow:** 3 agents
- Agent A: Layout + profile
- Agent B: Stories + quizzes
- Agent C: Games + store

---

## Phase 6: Admin Panel

### 6.1 Admin Layout
**File:** `app/admin/dashboard/layout.tsx`

**Tasks:**
- [ ] Create admin navigation
- [ ] Add user menu
- [ ] Implement sidebar collapse

### 6.2 Admin Dashboard
**File:** `app/admin/dashboard/page.tsx`

**Tasks:**
- [ ] Display platform statistics
- [ ] Show user counts breakdown
- [ ] Render activity charts
- [ ] Add quick action buttons

### 6.3 Content Management
**Files:** `app/admin/content/stories/page.tsx`, `app/admin/content/quizzes/page.tsx`

**Tasks:**
- [ ] Build story CRUD table
- [ ] Create story editor form
- [ ] Implement image upload helper
- [ ] Build quiz CRUD interface
- [ ] Create question builder UI
- [ ] Add status toggle (Draft/Published)

### 6.4 User Management
**File:** `app/admin/users/page.tsx`

**Tasks:**
- [ ] List all users with pagination
- [ ] Implement user search
- [ ] Add enable/disable toggle
- [ ] Show user details modal
- [ ] Display user statistics

**Parallel Workflow:** 2 agents
- Agent A: Layout + dashboard
- Agent B: Content + user management

---

## Phase 7: State Management & Data Fetching

### 7.1 React Query Setup
**File:** `lib/query-client.ts`

**Tasks:**
- [ ] Configure QueryClient
- [ ] Set up cache timeouts
- [ ] Configure retry behavior
- [ ] Add devtools setup

### 7.2 Global State
**File:** `stores/useAuthStore.ts`, `stores/useUIStore.ts`

**Tasks:**
- [ ] Create auth Zustand store
- [ ] Create UI store (modals, sidebars)
- [ ] Add persistence middleware
- [ ] Implement state hydration

### 7.3 Custom Hooks
**Files:** `hooks/useAuth.ts`, `hooks/useChildData.ts`

**Tasks:**
- [ ] Create useAuth hook
- [ ] Create useChildProfile hook
- [ ] Create useParentDashboard hook
- [ ] Create useStories hook
- [ ] Create useStore hook

**Parallel Workflow:** 2 agents
- Agent A: Query client + stores
- Agent B: Custom hooks

---

## Phase 8: UI Component Library

### 8.1 Base Components
**Folder:** `components/ui/`

**Tasks:**
- [ ] Button component (variants, sizes)
- [ ] Input component (with validation)
- [ ] Card component
- [ ] Modal/Dialog component
- [ ] Loading spinner/skeleton
- [ ] Toast notification system
- [ ] Badge component
- [ ] Avatar component
- [ ] Table component
- [ ] Form label/error components

### 8.2 Business Components
**Folder:** `components/business/`

**Tasks:**
- [ ] CoinCounter component
- [ ] StreakBadge component
- [ ] StoryCard component
- [ ] QuizCard component
- [ ] StoreItemCard component
- [ ] ActivityListItem component
- [ ] ChildProfileCard component

**Parallel Workflow:** 2 agents
- Agent A: Base UI components
- Agent B: Business components

---

## Phase 9: Error Handling & Validation

### 9.1 Error Boundaries
**File:** `components/ErrorBoundary.tsx`

**Tasks:**
- [ ] Create error boundary component
- [ ] Add fallback UI
- [ ] Implement error logging
- [ ] Add retry mechanism

### 9.2 Form Validation
**File:** `lib/validations.ts`

**Tasks:**
- [ ] Create validation schemas (zod)
- [ ] Register form schema
- [ ] Login form schema
- [ ] Child creation schema
- [ ] Content editing schemas
- [ ] Add custom error messages

### 9.3 API Error Handling
**File:** `lib/error-handler.ts`

**Tasks:**
- [ ] Create error type mapper
- [ ] Implement toast notifications for errors
- [ ] Add field-level error display
- [ ] Handle network errors gracefully

**Parallel Workflow:** 2 agents
- Agent A: Error boundaries + form validation
- Agent B: API error handling

---

## Phase 10: Testing

### 10.1 Unit Tests
**Tasks:**
- [ ] Test auth context hooks
- [ ] Test API client functions
- [ ] Test utility functions
- [ ] Test form validators
- [ ] Test custom hooks

### 10.2 Integration Tests
**Tasks:**
- [ ] Test login flow
- [ ] Test parent dashboard data fetching
- [ ] Test child profile operations
- [ ] Test form submissions
- [ ] Test error scenarios

### 10.3 E2E Tests (Playwright)
**Tasks:**
- [ ] Test authentication journey
- [ ] Test parent creates child
- [ ] Test child completes story
- [ ] Test purchase request flow
- [ ] Test admin content management

**Parallel Workflow:** 2 agents
- Agent A: Unit + integration tests
- Agent B: E2E tests

---

## Phase 11: Performance & Optimization

### Tasks
- [ ] Implement code splitting
- [ ] Add image optimization
- [ ] Configure lazy loading
- [ ] Add service worker for offline
- [ ] Implement bundle size monitoring
- [ ] Add React.memo where needed
- [ ] Optimize re-renders
- [ ] Add loading states
- [ ] Implement skeleton screens

---

## Phase 12: Deployment

### Tasks
- [ ] Configure production environment variables
- [ ] Set up build process
- [ ] Configure nginx for SPA routing
- [ ] Set up HTTPS
- [ ] Configure CORS properly
- [ ] Add health check endpoint
- [ ] Set up CI/CD pipeline
- [ ] Configure error monitoring (Sentry)
- [ ] Add analytics

---

## Parallel Agent Execution Plan

### Wave 1: Foundation (2 agents parallel)
- Agent 1: Project setup + folder structure
- Agent 2: API client + type definitions

### Wave 2: Auth System (3 agents parallel)
- Agent 1: AuthContext + state
- Agent 2: Route protection + middleware
- Agent 3: Auth forms + validation

### Wave 3: Core Features (3 agents parallel)
- Agent 1: Parent dashboard
- Agent 2: Child portal (profile + store)
- Agent 3: Child portal (stories + quizzes + games)

### Wave 4: Admin + Components (2 agents parallel)
- Agent 1: Admin panel
- Agent 2: UI component library

### Wave 5: State + Hooks (2 agents parallel)
- Agent 1: Query client + stores
- Agent 2: Custom hooks

### Wave 6: Polish (2 agents parallel)
- Agent 1: Error handling + validation
- Agent 2: Testing suite

### Wave 7: Optimization (2 agents parallel)
- Agent 1: Performance optimization
- Agent 2: Deployment configuration

---

## Task Dependencies

```
Setup → Auth → API Client → Parent Dashboard
                              ↓
                         Child Portal
                              ↓
                         Admin Panel
                              ↓
                    State + Hooks → Testing → Deploy
```

---

## File Structure Target

```
app/
├── auth/
│   ├── login/
│   ├── register/
│   └── verify/
├── parent/
│   └── dashboard/
├── child/
│   └── portal/
├── admin/
│   └── dashboard/
└── layout.tsx

components/
├── ui/
├── business/
├── layouts/
└── providers/

lib/
├── api-client.ts
├── api/
│   ├── auth.ts
│   ├── parent.ts
│   ├── child.ts
│   └── admin.ts
├── query-client.ts
├── validations.ts
└── utils.ts

hooks/
├── useAuth.ts
├── useChildData.ts
└── useParentData.ts

contexts/
└── AuthContext.tsx

stores/
├── useAuthStore.ts
└── useUIStore.ts

types/
└── api.ts
```

---

**Total Estimated Phases:** 12
**Parallel Workflow Waves:** 7
**Primary Dependencies:** Auth → API → Features → Polish → Deploy
