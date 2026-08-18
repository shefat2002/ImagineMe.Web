import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import * as authService from '@/lib/api/auth';
import type { LoginRequest, RegisterRequest, ChildLoginRequest } from '@/types/api';

export function useAuth() {
  const { user, token, setAuth, clearAuth, loading, setLoading } = useAuthStore();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      setLoading(true);
      const response = await authService.login(credentials);
      return response;
    },
    onSuccess: (data) => {
      const userData = {
        id: data.userId || '',
        email: data.email || '',
        fullName: data.fullName || '',
        userType: data.userType || 1,
      };
      setAuth(userData, data.token, data.refreshToken);
    },
    onError: () => {
      setLoading(false);
    },
  });

  const childLoginMutation = useMutation({
    mutationFn: async (credentials: ChildLoginRequest) => {
      setLoading(true);
      const response = await authService.childLogin(credentials);
      return response;
    },
    onSuccess: (data) => {
      const userData = {
        id: data.childId,
        email: '',
        fullName: data.username,
        userType: 3,
      };
      setAuth(userData, data.token);
    },
    onError: () => {
      setLoading(false);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      setLoading(true);
      const response = await authService.register(data);
      return response;
    },
    onSuccess: (data) => {
      const userData = {
        id: data.userId || '',
        email: data.email || '',
        fullName: data.fullName || '',
        userType: data.userType || 1,
      };
      setAuth(userData, data.token, data.refreshToken);
    },
    onError: () => {
      setLoading(false);
    },
  });

  const logout = () => {
    clearAuth();
    queryClient.clear();
  };

  const isAuthenticated = !!token;
  const isParent = user?.userType === 1;
  const isAdmin = user?.userType === 2;
  const isChild = user?.userType === 3;

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isParent,
    isAdmin,
    isChild,
    login: loginMutation.mutateAsync,
    childLogin: childLoginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isPending: loginMutation.isPending || childLoginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || childLoginMutation.error || registerMutation.error,
  };
}
