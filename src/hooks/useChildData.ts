import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as childService from '@/lib/api/child';
import type { UpdateAvatarRequest } from '@/types/api';

export function useChildProfile() {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['child', 'profile'],
    queryFn: childService.getProfile,
    staleTime: 5 * 60 * 1000,
  });

  const { data: stats } = useQuery({
    queryKey: ['child', 'stats'],
    queryFn: childService.getStats,
    staleTime: 5 * 60 * 1000,
  });

  const updateAvatarMutation = useMutation({
    mutationFn: (data: UpdateAvatarRequest) => childService.updateAvatar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['child', 'profile'] });
    },
  });

  const claimDailyRewardMutation = useMutation({
    mutationFn: () => childService.claimDailyReward(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['child', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['child', 'stats'] });
    },
  });

  return {
    profile,
    stats,
    isLoading,
    updateAvatar: updateAvatarMutation.mutateAsync,
    claimDailyReward: claimDailyRewardMutation.mutateAsync,
    isUpdating: updateAvatarMutation.isPending || claimDailyRewardMutation.isPending,
  };
}

export function useStories() {
  const queryClient = useQueryClient();

  const { data: stories, isLoading } = useQuery({
    queryKey: ['child', 'stories'],
    queryFn: childService.getStories,
    staleTime: 5 * 60 * 1000,
  });

  const logStoryMutation = useMutation({
    mutationFn: ({ storyId, coinsEarned }: { storyId: string; coinsEarned?: number }) =>
      childService.logStoryActivity(storyId, coinsEarned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['child', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['child', 'stats'] });
    },
  });

  return {
    stories,
    isLoading,
    logStory: logStoryMutation.mutateAsync,
    isLogging: logStoryMutation.isPending,
  };
}

export function useStore() {
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ['child', 'store', 'items'],
    queryFn: childService.getStoreItems,
    staleTime: 5 * 60 * 1000,
  });

  const { data: myPurchases } = useQuery({
    queryKey: ['child', 'store', 'my-items'],
    queryFn: childService.getMyPurchases,
    staleTime: 5 * 60 * 1000,
  });

  const purchaseMutation = useMutation({
    mutationFn: (storeItemId: string) => childService.requestPurchase(storeItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['child', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['child', 'store', 'my-items'] });
    },
  });

  return {
    items,
    myPurchases,
    isLoading,
    purchase: purchaseMutation.mutateAsync,
    isPurchasing: purchaseMutation.isPending,
  };
}
