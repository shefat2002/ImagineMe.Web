export enum UserType {
  Parent = 1,
  Admin = 2,
  Child = 3,
}

export enum ContentStatus {
  Draft = 0,
  Published = 1,
}

export enum PurchaseStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

export enum AudioType {
  BackgroundMusic = 0,
  Narration = 1,
  SoundEffect = 2,
}

export enum ActivityType {
  Story = 0,
  Quiz = 1,
  Game = 2,
  DailyLogin = 3,
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresAt: string;
}

export interface ChildAuthResponse extends AuthResponse {
  childId: string;
  username: string;
  coins: number;
  currentStreak: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  userType: UserType;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChildLoginRequest {
  username: string;
  password: string;
  parentId?: string;
}

export interface OtpRequest {
  email: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChildActivitySummaryDto {
  childId: string;
  username: string;
  coins: number;
  currentStreak: number;
  lastActivityAt: string | null;
}

export interface ParentDashboardDto {
  totalChildren: number;
  activeChildren: number;
  children: ChildActivitySummaryDto[];
}

export interface ChildSummaryDto {
  childId: string;
  username: string;
  avatarState: string | null;
  lastActivityAt: string | null;
}

export interface ChildDetailDto {
  childId: string;
  username: string;
  parentId: string;
  avatarState: string | null;
  coins: number;
  currentStreak: number;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface CreateChildRequest {
  username: string;
  password: string;
}

export interface UpdateChildRequest {
  username?: string;
  password?: string;
}

export interface ChildActivityDto {
  activityId: string;
  childId: string;
  activityType: ActivityType;
  storyId: string | null;
  quizId: string | null;
  coinsEarned: number;
  completedAt: string;
  metadata: string | null;
}

export interface ChildProfileDto {
  childId: string;
  username: string;
  parentId: string;
  avatarState: string | null;
  coins: number;
  currentStreak: number;
  lastLoginAt: string | null;
}

export interface ChildStatsDto {
  storiesRead: number;
  quizzesTaken: number;
  gamesPlayed: number;
  totalCoinsEarned: number;
  totalCoinsSpent: number;
  currentStreak: number;
}

export interface UpdateAvatarRequest {
  avatarState: string;
}

export interface DailyRewardResultDto {
  coinsAwarded: number;
  currentStreak: number;
  message: string;
}

export interface StoryDto {
  id: string;
  title: string;
  coverImageUrl: string;
  contentPayload: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string | null;
}

export interface QuestionDto {
  questionText: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizDto {
  id: string;
  storyId: string | null;
  title: string;
  questions: QuestionDto[];
  status: ContentStatus;
  createdAt: string;
  updatedAt: string | null;
}

export interface LogStoryActivityRequest {
  storyId: string;
  coinsEarned?: number;
}

export interface LogQuizActivityRequest {
  quizId: string;
  score: number;
  coinsEarned?: number;
}

export interface LogGameActivityRequest {
  gameType: string;
  score: number;
  durationMinutes: number;
  coinsEarned?: number;
}

export interface ActivityLoggedDto {
  activityId: string;
  coinsEarned: number;
  message: string;
}

export interface StoreItemDto {
  id: string;
  name: string;
  priceInCoins: number;
  assetUrl: string;
  metadata: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface PurchaseRequest {
  storeItemId: string;
}

export interface PurchaseDto {
  id: string;
  childId: string;
  childUsername: string;
  storeItemId: string;
  storeItemName: string;
  storeItemAssetUrl: string;
  priceInCoins: number;
  status: PurchaseStatus;
  requestedAt: string;
  completedAt: string | null;
  rejectionReason: string | null;
}

export interface MiniGameContentDto {
  id: string;
  title: string;
  gameType: string;
  description: string;
  status: ContentStatus;
  thumbnailUrl: string;
  createdAt: string;
}

export interface MiniGameContentDetailDto {
  id: string;
  title: string;
  gameType: string;
  description: string;
  thumbnailUrl: string;
  gamePayload: string;
  assets: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminStatsDto {
  totalUsers: number;
  activeChildren: number;
  totalStories: number;
}

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  userType: UserType;
  disabled: boolean;
  createdAt: string;
}

export interface PaginatedUsersDto {
  users: UserDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserStatsDto {
  totalUsers: number;
  totalParents: number;
  totalChildren: number;
  totalAdmins: number;
}

export interface DisableUserRequest {
  disabled: boolean;
}

export interface CreateStoryRequest {
  title: string;
  coverImageUrl: string;
  contentPayload: string;
  status: ContentStatus;
}

export interface UpdateStoryRequest {
  title?: string;
  coverImageUrl?: string;
  contentPayload?: string;
  status?: ContentStatus;
}

export interface CreateQuizRequest {
  storyId: string | null;
  title: string;
  questions: {
    questionText: string;
    options: string[];
    correctAnswer: number;
  }[];
  status: ContentStatus;
}

export interface UpdateQuizRequest {
  storyId?: string | null;
  title?: string;
  questions?: {
    questionText: string;
    options: string[];
    correctAnswer: number;
  }[];
  status?: ContentStatus;
}

export interface CreateStoreItemRequest {
  name: string;
  priceInCoins: number;
  assetUrl: string;
  metadata?: string;
}

export interface UpdateStoreItemRequest {
  name?: string;
  priceInCoins?: number;
  assetUrl?: string;
  metadata?: string;
}

export interface CreateMiniGameRequest {
  title: string;
  gameType: string;
  description: string;
  thumbnailUrl: string;
  gamePayload: string;
  assets: string;
  status: ContentStatus;
}

export interface UpdateMiniGameRequest {
  title?: string;
  gameType?: string;
  description?: string;
  thumbnailUrl?: string;
  gamePayload?: string;
  assets?: string;
  status?: ContentStatus;
}

export interface CreateStoryAudioRequest {
  storyId: string;
  audioUrl: string;
  mimeType: string;
  type: AudioType;
  startTime?: number;
  endTime?: number;
  language: string;
  durationSeconds: number;
}

export interface UpdateStoryAudioRequest {
  audioUrl?: string;
  mimeType?: string;
  type?: AudioType;
  startTime?: number;
  endTime?: number;
  language?: string;
  durationSeconds?: number;
}

export interface ErrorResponse {
  status: number;
  message: string;
  details?: string;
}