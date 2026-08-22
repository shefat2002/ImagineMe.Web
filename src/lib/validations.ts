import { z } from 'zod';

// Login schema (Parent/Admin)
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Child login schema
export const childLoginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  parentId: z.string().optional(),
});

// Register schema
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  userType: z.union([z.number().int().refine(val => val === 1 || val === 2, 'User type must be Parent (1) or Admin (2)'), z.string().transform(val => val === '1' ? 1 : val === '2' ? 2 : NaN)]).refine(val => val === 1 || val === 2, 'User type must be Parent (1) or Admin (2)'),
});

// OTP schema
export const otpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
});

// Send OTP schema
export const sendOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ChildLoginInput = z.infer<typeof childLoginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// Child creation schema
export const createChildSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must not exceed 20 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Child update schema
export const updateChildSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must not exceed 20 characters').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
}).refine(data => data.username || data.password, {
  message: 'At least one field must be provided',
});

// Story creation/editing schema
export const storySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must not exceed 200 characters'),
  coverImageUrl: z.string().url('Invalid image URL'),
  contentPayload: z.string().min(1, 'Content is required'),
  status: z.number().int().refine(val => val === 0 || val === 1, 'Status must be Draft (0) or Published (1)'),
});

// Quiz creation/editing schema
export const quizSchema = z.object({
  storyId: z.string().uuid('Invalid story ID').nullable().optional(),
  title: z.string().min(1, 'Title is required').max(200, 'Title must not exceed 200 characters'),
  questions: z.array(z.object({
    questionText: z.string().min(1, 'Question text is required'),
    options: z.array(z.string()).min(2, 'At least 2 options required').max(6, 'Maximum 6 options allowed'),
    correctAnswer: z.number().int().min(0).max(5, 'Correct answer must be between 0-5'),
  })).min(1, 'At least one question required'),
  status: z.number().int().refine(val => val === 0 || val === 1, 'Status must be Draft (0) or Published (1)'),
});

// Store item creation/editing schema
export const storeItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must not exceed 100 characters'),
  priceInCoins: z.number().int().min(0, 'Price must be non-negative').max(10000, 'Price must not exceed 10000 coins'),
  assetUrl: z.string().url('Invalid asset URL'),
  metadata: z.string().optional(),
});

// Mini-game creation/editing schema
export const miniGameSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must not exceed 100 characters'),
  gameType: z.string().min(1, 'Game type is required'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must not exceed 500 characters'),
  thumbnailUrl: z.string().url('Invalid thumbnail URL'),
  gamePayload: z.string().min(1, 'Game payload is required'),
  assets: z.string().optional(),
  status: z.number().int().refine(val => val === 0 || val === 1, 'Status must be Draft (0) or Published (1)'),
});

// Avatar update schema
export const avatarUpdateSchema = z.object({
  avatarState: z.string().min(1, 'Avatar state is required'),
});

export type CreateChildInput = z.infer<typeof createChildSchema>;
export type UpdateChildInput = z.infer<typeof updateChildSchema>;
export type StoryInput = z.infer<typeof storySchema>;
export type QuizInput = z.infer<typeof quizSchema>;
export type StoreItemInput = z.infer<typeof storeItemSchema>;
export type MiniGameInput = z.infer<typeof miniGameSchema>;
export type AvatarUpdateInput = z.infer<typeof avatarUpdateSchema>;