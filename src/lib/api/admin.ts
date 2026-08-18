import apiClient from '../api-client';
import {
  AdminStatsDto,
  PaginatedUsersDto,
  UserStatsDto,
  DisableUserRequest,
  CreateStoryRequest,
  UpdateStoryRequest,
  CreateQuizRequest,
  UpdateQuizRequest,
  CreateStoreItemRequest,
  UpdateStoreItemRequest,
  CreateMiniGameRequest,
  UpdateMiniGameRequest,
  CreateStoryAudioRequest,
  UpdateStoryAudioRequest,
} from '@/types/api';
import { StoryDto, QuizDto, StoreItemDto, MiniGameContentDetailDto } from '@/types/api';

export const adminService = {
  async getStats(): Promise<AdminStatsDto> {
    const response = await apiClient.get<AdminStatsDto>('/api/admin/stats');
    return response.data;
  },

  async getUsers(page = 1, pageSize = 10): Promise<PaginatedUsersDto> {
    const response = await apiClient.get<PaginatedUsersDto>('/api/admin/users', {
      params: { page, pageSize },
    });
    return response.data;
  },

  async getUserStats(): Promise<UserStatsDto> {
    const response = await apiClient.get<UserStatsDto>('/api/admin/users/stats');
    return response.data;
  },

  async disableUser(id: string, data: DisableUserRequest): Promise<void> {
    await apiClient.patch(`/api/admin/users/${id}/disable`, data);
  },

  // Stories
  async getStories(status?: number, titleSearch?: string): Promise<StoryDto[]> {
    const params: Record<string, string | number> = {};
    if (status !== undefined) params.status = status;
    if (titleSearch) params.titleSearch = titleSearch;

    const response = await apiClient.get<StoryDto[]>('/api/admin/stories', { params });
    return response.data;
  },

  async getStory(id: string): Promise<StoryDto> {
    const response = await apiClient.get<StoryDto>(`/api/admin/stories/${id}`);
    return response.data;
  },

  async createStory(data: CreateStoryRequest): Promise<string> {
    const response = await apiClient.post<string>('/api/admin/stories', data);
    return response.data;
  },

  async updateStory(id: string, data: UpdateStoryRequest): Promise<void> {
    await apiClient.put(`/api/admin/stories/${id}`, data);
  },

  async deleteStory(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/stories/${id}`);
  },

  // Quizzes
  async getQuizzes(status?: number, storyId?: string, searchTitle?: string): Promise<QuizDto[]> {
    const params: Record<string, string | number | undefined> = {};
    if (status !== undefined) params.status = status;
    if (storyId) params.storyId = storyId;
    if (searchTitle) params.searchTitle = searchTitle;

    const response = await apiClient.get<QuizDto[]>('/api/admin/quizzes', { params });
    return response.data;
  },

  async getQuiz(id: string): Promise<QuizDto> {
    const response = await apiClient.get<QuizDto>(`/api/admin/quizzes/${id}`);
    return response.data;
  },

  async createQuiz(data: CreateQuizRequest): Promise<string> {
    const response = await apiClient.post<string>('/api/admin/quizzes', data);
    return response.data;
  },

  async updateQuiz(id: string, data: UpdateQuizRequest): Promise<void> {
    await apiClient.put(`/api/admin/quizzes/${id}`, data);
  },

  async deleteQuiz(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/quizzes/${id}`);
  },

  // Store Items
  async getStoreItems(minPrice?: number, maxPrice?: number, nameSearch?: string): Promise<StoreItemDto[]> {
    const params: Record<string, string | number | undefined> = {};
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;
    if (nameSearch) params.nameSearch = nameSearch;

    const response = await apiClient.get<StoreItemDto[]>('/api/admin/store-items', { params });
    return response.data;
  },

  async getStoreItem(id: string): Promise<StoreItemDto> {
    const response = await apiClient.get<StoreItemDto>(`/api/admin/store-items/${id}`);
    return response.data;
  },

  async createStoreItem(data: CreateStoreItemRequest): Promise<string> {
    const response = await apiClient.post<string>('/api/admin/store-items', data);
    return response.data;
  },

  async updateStoreItem(id: string, data: UpdateStoreItemRequest): Promise<void> {
    await apiClient.put(`/api/admin/store-items/${id}`, data);
  },

  async deleteStoreItem(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/store-items/${id}`);
  },

  // Mini-Games
  async getMiniGames(gameType?: string, status?: number): Promise<MiniGameContentDetailDto[]> {
    const params: Record<string, string | number | undefined> = {};
    if (gameType) params.gameType = gameType;
    if (status !== undefined) params.status = status;

    const response = await apiClient.get<MiniGameContentDetailDto[]>('/api/admin/minigames', { params });
    return response.data;
  },

  async getMiniGame(id: string): Promise<MiniGameContentDetailDto> {
    const response = await apiClient.get<MiniGameContentDetailDto>(`/api/admin/minigames/${id}`);
    return response.data;
  },

  async createMiniGame(data: CreateMiniGameRequest): Promise<string> {
    const response = await apiClient.post<string>('/api/admin/minigames', data);
    return response.data;
  },

  async updateMiniGame(id: string, data: UpdateMiniGameRequest): Promise<void> {
    await apiClient.put(`/api/admin/minigames/${id}`, data);
  },

  async deleteMiniGame(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/minigames/${id}`);
  },

  // Story Audio
  async getStoryAudio(storyId: string): Promise<unknown> {
    const response = await apiClient.get(`/api/admin/storyaudio/story/${storyId}`);
    return response.data;
  },

  async getStoryAudioByPage(storyId: string, pageNumber: number): Promise<unknown> {
    const response = await apiClient.get(`/api/admin/storyaudio/story/${storyId}/page/${pageNumber}`);
    return response.data;
  },

  async getStoryAudioByLanguage(storyId: string, language: string): Promise<unknown> {
    const response = await apiClient.get(`/api/admin/storyaudio/story/${storyId}/language/${language}`);
    return response.data;
  },

  async createStoryAudio(data: CreateStoryAudioRequest): Promise<string> {
    const response = await apiClient.post<string>('/api/admin/storyaudio', data);
    return response.data;
  },

  async updateStoryAudio(id: string, data: UpdateStoryAudioRequest): Promise<void> {
    await apiClient.put(`/api/admin/storyaudio/${id}`, data);
  },

  async deleteStoryAudio(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/storyaudio/${id}`);
  },
};