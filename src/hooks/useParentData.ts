import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as parentService from '@/lib/api/parent';
import type { CreateChildRequest, UpdateChildRequest } from '@/types/api';

export function useParentDashboard() {
  const queryClient = useQueryClient();

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['parent', 'dashboard'],
    queryFn: parentService.getDashboard,
    staleTime: 2 * 60 * 1000,
  });

  const { data: children } = useQuery({
    queryKey: ['parent', 'children'],
    queryFn: parentService.getChildren,
    staleTime: 5 * 60 * 1000,
  });

  const createChildMutation = useMutation({
    mutationFn: (data: CreateChildRequest) => parentService.createChild(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['parent', 'children'] });
    },
  });

  const updateChildMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateChildRequest }) =>
      parentService.updateChild(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['parent', 'children'] });
      queryClient.invalidateQueries({ queryKey: ['parent', 'children', variables.id] });
    },
  });

  const deleteChildMutation = useMutation({
    mutationFn: (id: string) => parentService.deleteChild(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['parent', 'children'] });
    },
  });

  return {
    dashboard,
    children,
    isLoading,
    createChild: createChildMutation.mutateAsync,
    updateChild: updateChildMutation.mutateAsync,
    deleteChild: deleteChildMutation.mutateAsync,
    isMutating: createChildMutation.isPending || updateChildMutation.isPending || deleteChildMutation.isPending,
  };
}

export function useChildDetail(childId: string) {
  const queryClient = useQueryClient();

  const { data: child, isLoading } = useQuery({
    queryKey: ['parent', 'children', childId],
    queryFn: () => parentService.getChildDetail(childId),
    staleTime: 5 * 60 * 1000,
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['parent', 'children', childId, 'activities'],
    queryFn: () => parentService.getChildActivities(childId),
    staleTime: 2 * 60 * 1000,
  });

  const updateChildMutation = useMutation({
    mutationFn: (data: UpdateChildRequest) => parentService.updateChild(childId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent', 'children', childId] });
      queryClient.invalidateQueries({ queryKey: ['parent', 'children'] });
    },
  });

  const deleteChildMutation = useMutation({
    mutationFn: () => parentService.deleteChild(childId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['parent', 'children'] });
    },
  });

  return {
    child,
    activities,
    isLoading: isLoading || activitiesLoading,
    updateChild: updateChildMutation.mutateAsync,
    deleteChild: deleteChildMutation.mutateAsync,
    isMutating: updateChildMutation.isPending || deleteChildMutation.isPending,
  };
}
