import apiClient from '../api-client';
import {
  ChildProfileDto,
  ChildStatsDto,
  UpdateAvatarRequest,
  DailyRewardResultDto,
  StoryDto,
  QuizDto,
  LogStoryActivityRequest,
  LogQuizActivityRequest,
  LogGameActivityRequest,
  ActivityLoggedDto,
  StoreItemDto,
  PurchaseRequest,
  PurchaseDto,
  MiniGameContentDto,
  MiniGameContentDetailDto,
} from '@/types/api';

export const childService = {
  async getProfile(): Promise<ChildProfileDto> {
    const response = await apiClient.get<ChildProfileDto>('/api/child/profile');
    return response.data;
  },

  async getStats(): Promise<ChildStatsDto> {
    const response = await apiClient.get<ChildStatsDto>('/api/child/stats');
    return response.data;
  },

  async updateAvatar(data: UpdateAvatarRequest): Promise<boolean> {
    const response = await apiClient.put<boolean>('/api/child/avatar', data);
    return response.data;
  },

  async claimDailyReward(): Promise<DailyRewardResultDto> {
    const response = await apiClient.post<DailyRewardResultDto>('/api/child/daily-reward');
    return response.data;
  },

  async getStories(): Promise<StoryDto[]> {
    const response = await apiClient.get<StoryDto[]>('/api/child/stories');
    return response.data;
  },

  async getStory(id: string): Promise<StoryDto> {
    const response = await apiClient.get<StoryDto>(`/api/child/stories/${id}`);
    return response.data;
  },

  async getQuizzes(storyId?: string): Promise<QuizDto[]> {
    const params = storyId ? { storyId } : {};
    const response = await apiClient.get<QuizDto[]>('/api/child/quizzes', { params });
    return response.data;
  },

  async getQuiz(id: string): Promise<QuizDto> {
    const response = await apiClient.get<QuizDto>(`/api/child/quizzes/${id}`);
    return response.data;
  },

  async logStoryActivity(data: LogStoryActivityRequest): Promise<ActivityLoggedDto> {
    const response = await apiClient.post<ActivityLoggedDto>('/api/child/activities/story', data);
    return response.data;
  },

  async logQuizActivity(data: LogQuizActivityRequest): Promise<ActivityLoggedDto> {
    const response = await apiClient.post<ActivityLoggedDto>('/api/child/activities/quiz', data);
    return response.data;
  },

  async logGameActivity(data: LogGameActivityRequest): Promise<ActivityLoggedDto> {
    const response = await apiClient.post<ActivityLoggedDto>('/api/child/activities/game', data);
    return response.data;
  },

  async getStoreItems(): Promise<StoreItemDto[]> {
    const response = await apiClient.get<StoreItemDto[]>('/api/child/store/items');
    return response.data;
  },

  async requestPurchase(data: PurchaseRequest): Promise<PurchaseDto> {
    const response = await apiClient.post<PurchaseDto>('/api/child/store/purchase', data);
    return response.data;
  },

  async getMyPurchases(): Promise<PurchaseDto[]> {
    const response = await apiClient.get<PurchaseDto[]>('/api/child/store/my-items');
    return response.data;
  },

  async getMiniGames(gameType?: string): Promise<MiniGameContentDto[]> {
    const params = gameType ? { gameType } : {};
    const response = await apiClient.get<MiniGameContentDto[]>('/api/child/minigames', { params });
    return response.data;
  },

  async getMiniGame(id: string): Promise<MiniGameContentDetailDto> {
    const response = await apiClient.get<MiniGameContentDetailDto>(`/api/child/minigames/${id}`);
    return response.data;
  },
};