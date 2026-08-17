import apiClient from '../api-client';
import {
  ParentDashboardDto,
  ChildSummaryDto,
  ChildDetailDto,
  CreateChildRequest,
  UpdateChildRequest,
  ChildActivityDto,
} from '@/types/api';

export const parentService = {
  async getDashboard(): Promise<ParentDashboardDto> {
    const response = await apiClient.get<ParentDashboardDto>('/api/parent/dashboard');
    return response.data;
  },

  async getChildren(): Promise<ChildSummaryDto[]> {
    const response = await apiClient.get<ChildSummaryDto[]>('/api/parent/children');
    return response.data;
  },

  async getChildDetails(id: string): Promise<ChildDetailDto> {
    const response = await apiClient.get<ChildDetailDto>(`/api/parent/children/${id}`);
    return response.data;
  },

  async createChild(data: CreateChildRequest): Promise<string> {
    const response = await apiClient.post<string>('/api/parent/children', data);
    return response.data;
  },

  async updateChild(id: string, data: UpdateChildRequest): Promise<boolean> {
    const response = await apiClient.put<boolean>(`/api/parent/children/${id}`, data);
    return response.data;
  },

  async deleteChild(id: string): Promise<boolean> {
    const response = await apiClient.delete<boolean>(`/api/parent/children/${id}`);
    return response.data;
  },

  async getChildActivities(id: string): Promise<ChildActivityDto[]> {
    const response = await apiClient.get<ChildActivityDto[]>(`/api/parent/children/${id}/activities`);
    return response.data;
  },
};