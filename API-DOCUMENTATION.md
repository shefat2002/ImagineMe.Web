# Imagine Me API Documentation

Backend API for Imagine Me learning platform.

**Base URL:** `https://imaginemebylovie.com` (dev: `http://localhost:5200`)
**API Version:** v1
**Content Type:** `application/json`
**Authentication:** JWT Bearer Token

---

## Authentication

### Header Format
```
Authorization: Bearer {your_jwt_token}
```

### User Roles
| Role | Permissions |
|------|-------------|
| `Admin` | Full access |
| `Parent` | Manage children, view dashboard |
| `Child` | Access content, log activities, shop |

---

## 1. Authentication Endpoints

### 1.1 Register New User
```http
POST /api/auth/register
```

**Request Body:**
```typescript
{
  email: string;
  password: string;         // min 8 chars
  fullName: string;
  userType: number;        // 1 = Parent, 2 = Admin
}
```

**Response:** `AuthResponse`
```typescript
{
  token: string;
  tokenType: string;       // "Bearer"
  expiresAt: string;       // ISO datetime
}
```

---

### 1.2 Login (Parent/Admin)
```http
POST /api/auth/login
```

**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:** `AuthResponse`

---

### 1.3 Child Login
```http
POST /api/auth/child/login
```

**Request Body:**
```typescript
{
  username: string;
  password: string;
  parentId?: string;
}
```

**Response:** `ChildAuthResponse`
```typescript
{
  token: string;
  tokenType: string;
  expiresAt: string;
  childId: string;
  username: string;
  coins: number;
  currentStreak: number;
}
```

Child gets: updated streak, +10 coins (once/day), JWT token.

---

### 1.4 Send Email Verification OTP
```http
POST /api/auth/send-verification
```

**Request Body:** `{ email: string }`

**Response:** `{ message: string }`

---

### 1.5 Verify Email with OTP
```http
POST /api/auth/verify-email
```

**Request Body:**
```typescript
{
  email: string;
  otp: string;      // 6-digit code
}
```

**Response:** `{ message: string }`

---

### 1.6 Send Password Reset OTP
```http
POST /api/auth/send-reset-otp
```

**Request Body:** `{ email: string }`

---

### 1.7 Reset Password with OTP
```http
POST /api/auth/reset-password
```

**Request Body:**
```typescript
{
  email: string;
  otp: string;
  newPassword: string;   // min 8 chars
}
```

---

## 2. Parent Endpoints

> **Auth Required:** `Bearer` token, `Parent` role

### 2.1 Parent Dashboard
```http
GET /api/parent/dashboard
```

**Response:** `ParentDashboardDto`
```typescript
{
  totalChildren: number;
  activeChildren: number;
  children: ChildActivitySummaryDto[];
}
```

**ChildActivitySummaryDto:**
```typescript
{
  childId: string;
  username: string;
  coins: number;
  currentStreak: number;
  lastActivityAt: string | null;
}
```

---

### 2.2 List All Children
```http
GET /api/parent/children
```

**Response:** `ChildSummaryDto[]`
```typescript
{
  childId: string;
  username: string;
  avatarState: string | null;
  lastActivityAt: string | null;
}
```

---

### 2.3 Get Child Details
```http
GET /api/parent/children/{id}
```

**Response:** `ChildDetailDto`
```typescript
{
  childId: string;
  username: string;
  parentId: string;
  avatarState: string | null;
  coins: number;
  currentStreak: number;
  createdAt: string;
  lastLoginAt: string | null;
}
```

---

### 2.4 Create Child Account
```http
POST /api/parent/children
```

**Request Body:**
```typescript
{
  username: string;
  password: string;
}
```

**Response:** `string` - New child's GUID

---

### 2.5 Update Child Account
```http
PUT /api/parent/children/{id}
```

**Request Body:**
```typescript
{
  username?: string;
  password?: string;
}
```

**Response:** `boolean`

---

### 2.6 Delete Child Account
```http
DELETE /api/parent/children/{id}
```

⚠️ **Irreversible** - All child data permanently deleted.

**Response:** `boolean`

---

### 2.7 Get Child Activity History
```http
GET /api/parent/children/{id}/activities
```

**Response:** `ChildActivityDto[]`
```typescript
{
  activityId: string;
  childId: string;
  activityType: number;     // 0=Story, 1=Quiz, 2=Game, 3=DailyLogin
  storyId: string | null;
  quizId: string | null;
  coinsEarned: number;
  completedAt: string;
  metadata: string | null;
}
```

---

## 3. Child Endpoints

> **Auth Required:** `Bearer` token, `Child` role

### 3.1 Child Profile
```http
GET /api/child/profile
```

**Response:** `ChildProfileDto`
```typescript
{
  childId: string;
  username: string;
  parentId: string;
  avatarState: string | null;
  coins: number;
  currentStreak: number;
  lastLoginAt: string | null;
}
```

---

### 3.2 Child Statistics
```http
GET /api/child/stats
```

**Response:** `ChildStatsDto`
```typescript
{
  storiesRead: number;
  quizzesTaken: number;
  gamesPlayed: number;
  totalCoinsEarned: number;
  totalCoinsSpent: number;
  currentStreak: number;
}
```

---

### 3.3 Update Avatar
```http
PUT /api/child/avatar
```

**Request Body:**
```typescript
{
  avatarState: string;  // JSON string
}
```

**Response:** `boolean`

---

### 3.4 Claim Daily Reward
```http
POST /api/child/daily-reward
```

**Response:** `DailyRewardResultDto`
```typescript
{
  coinsAwarded: number;    // 10 if first login today
  currentStreak: number;
  message: string;
}
```

---

### 3.5 List Stories
```http
GET /api/child/stories
```

**Response:** `StoryDto[]`
```typescript
{
  id: string;
  title: string;
  coverImageUrl: string;
  contentPayload: string;
  status: number;
  createdAt: string;
  updatedAt: string | null;
}
```

---

### 3.6 Get Single Story
```http
GET /api/child/stories/{id}
```

**Response:** `StoryDto`

---

### 3.7 List Quizzes
```http
GET /api/child/quizzes
```

**Query:** `storyId` (optional)

**Response:** `QuizDto[]`
```typescript
{
  id: string;
  storyId: string | null;
  title: string;
  questions: QuestionDto[];
  status: number;
  createdAt: string;
  updatedAt: string | null;
}
```

---

### 3.8 Get Single Quiz
```http
GET /api/child/quizzes/{id}
```

**Response:** `QuizDto`

---

### 3.9 Log Story Activity
```http
POST /api/child/activities/story
```

**Request Body:**
```typescript
{
  storyId: string;
  coinsEarned?: number;
}
```

**Response:** `ActivityLoggedDto`
```typescript
{
  activityId: string;
  coinsEarned: number;
  message: string;
}
```

---

### 3.10 Log Quiz Activity
```http
POST /api/child/activities/quiz
```

**Request Body:**
```typescript
{
  quizId: string;
  score: number;
  coinsEarned?: number;
}
```

**Response:** `ActivityLoggedDto`

---

### 3.11 Log Game Activity
```http
POST /api/child/activities/game
```

**Request Body:**
```typescript
{
  gameType: string;
  score: number;
  durationMinutes: number;
  coinsEarned?: number;
}
```

**Response:** `ActivityLoggedDto`

---

### 3.12 List Store Items
```http
GET /api/child/store/items
```

**Response:** `StoreItemDto[]`
```typescript
{
  id: string;
  name: string;
  priceInCoins: number;
  assetUrl: string;
  metadata: string | null;
  createdAt: string;
  updatedAt: string | null;
}
```

---

### 3.13 Request Purchase
```http
POST /api/child/store/purchase
```

**Request Body:** `{ storeItemId: string }`

**Response:** `PurchaseDto`
```typescript
{
  id: string;
  childId: string;
  childUsername: string;
  storeItemId: string;
  storeItemName: string;
  storeItemAssetUrl: string;
  priceInCoins: number;
  status: number;           // 0=Pending, 1=Approved, 2=Rejected
  requestedAt: string;
  completedAt: string | null;
  rejectionReason: string | null;
}
```

---

### 3.14 Get My Purchases
```http
GET /api/child/store/my-items
```

**Response:** `PurchaseDto[]`

---

### 3.15 List Mini-Games
```http
GET /api/child/minigames
```

**Query:** `gameType` (optional)

**Response:** `MiniGameContentDto[]`
```typescript
{
  id: string;
  title: string;
  gameType: string;
  description: string;
  status: number;
  thumbnailUrl: string;
  createdAt: string;
}
```

---

### 3.16 Get Mini-Game Details
```http
GET /api/child/minigames/{id}
```

**Response:** `MiniGameContentDetailDto`
```typescript
{
  id: string;
  title: string;
  gameType: string;
  description: string;
  thumbnailUrl: string;
  gamePayload: string;
  assets: string;
  status: number;
  createdAt: string;
  updatedAt: string | null;
}
```

---

## 4. Admin Endpoints

> **Auth Required:** `Bearer` token, `Admin` role

### 4.1 Admin Dashboard Stats
```http
GET /api/admin/stats
```

**Response:**
```typescript
{
  totalUsers: number;
  activeChildren: number;
  totalStories: number;
}
```

---

### 4.2 List Users (Paginated)
```http
GET /api/admin/users
```

**Query:** `page` (default: 1), `pageSize` (default: 10)

**Response:** `PaginatedUsersDto`
```typescript
{
  users: UserDto[];
  total: number;
  page: number;
  pageSize: number;
}
```

---

### 4.3 Get User Statistics
```http
GET /api/admin/users/stats
```

**Response:** `UserStatsDto`
```typescript
{
  totalUsers: number;
  totalParents: number;
  totalChildren: number;
  totalAdmins: number;
}
```

---

### 4.4 Disable/Enable User
```http
PATCH /api/admin/users/{id}/disable
```

**Request Body:** `{ disabled: boolean }`

**Response:** `204 No Content`

---

### 4.5 Stories CRUD
```
POST   /api/admin/stories
GET    /api/admin/stories
GET    /api/admin/stories/{id}
PUT    /api/admin/stories/{id}
DELETE /api/admin/stories/{id}
```

**Create Request:**
```typescript
{
  title: string;
  coverImageUrl: string;
  contentPayload: string;
  status: number;
}
```

**Query Params (List):** `status`, `titleSearch`

---

### 4.6 Quizzes CRUD
```
POST   /api/admin/quizzes
GET    /api/admin/quizzes
GET    /api/admin/quizzes/{id}
PUT    /api/admin/quizzes/{id}
DELETE /api/admin/quizzes/{id}
```

**Create Request:**
```typescript
{
  storyId: string | null;
  title: string;
  questions: {
    questionText: string;
    options: string[];
    correctAnswer: number;
  }[];
  status: number;
}
```

**Query Params (List):** `status`, `storyId`, `searchTitle`

---

### 4.7 Store Items CRUD
```
POST   /api/admin/store-items
GET    /api/admin/store-items
GET    /api/admin/store-items/{id}
PUT    /api/admin/store-items/{id}
DELETE /api/admin/store-items/{id}
```

**Create Request:**
```typescript
{
  name: string;
  priceInCoins: number;
  assetUrl: string;
  metadata?: string;
}
```

**Query Params (List):** `minPrice`, `maxPrice`, `nameSearch`

---

### 4.8 Mini-Games CRUD
```
POST   /api/admin/minigames
GET    /api/admin/minigames
GET    /api/admin/minigames/{id}
PUT    /api/admin/minigames/{id}
DELETE /api/admin/minigames/{id}
```

**Create Request:**
```typescript
{
  title: string;
  gameType: string;
  description: string;
  thumbnailUrl: string;
  gamePayload: string;
  assets: string;
  status: number;
}
```

**Query Params (List):** `gameType`, `status`

---

### 4.9 Story Audio Management
```
GET    /api/admin/storyaudio/story/{storyId}
GET    /api/admin/storyaudio/story/{storyId}/page/{pageNumber}
GET    /api/admin/storyaudio/story/{storyId}/language/{language}
POST   /api/admin/storyaudio
PUT    /api/admin/storyaudio/{id}
DELETE /api/admin/storyaudio/{id}
```

**Create Request:**
```typescript
{
  storyId: string;
  audioUrl: string;
  mimeType: string;
  type: number;
  startTime?: number;
  endTime?: number;
  language: string;
  durationSeconds: number;
}
```

---

## 5. Data Models

### Enums
```typescript
enum UserType { Parent = 1, Admin = 2, Child = 3 }
enum ContentStatus { Draft = 0, Published = 1 }
enum PurchaseStatus { Pending = 0, Approved = 1, Rejected = 2 }
enum AudioType { BackgroundMusic = 0, Narration = 1, SoundEffect = 2 }
enum ActivityType { Story = 0, Quiz = 1, Game = 2, DailyLogin = 3 }
```

---

## 6. Error Responses

All errors follow:
```typescript
{
  status: number;
  message: string;
  details?: string;
}
```

### Common Status Codes
| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 204  | No Content |
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 500  | Internal Server Error |

---

## 7. Health Check
```http
GET /health
```

No auth required. Returns JSON with DB status.

---

## 8. Swagger/OpenAPI

- **Development:** `http://localhost:5200/`
- **Production:** `https://imaginemebylovie.com/swagger/index.html`

---

**Last Updated:** 2026-08-17
**API Version:** v1
