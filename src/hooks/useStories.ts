import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { childService } from '@/lib/api/child';
import {
  StoryDto,
  LogStoryActivityRequest,
  ActivityLoggedDto,
} from '@/types/api';

export const useStories = () => {
  const queryClient = useQueryClient();

  // List all stories
  const {
    data: stories = [],
    isLoading: storiesLoading,
    error: storiesError,
  } = useQuery<StoryDto[]>({
    queryKey: ['child', 'stories'],
    queryFn: () => childService.getStories(),
  });

  // Get single story
  const useStory = (storyId: string) => {
    return useQuery<StoryDto>({
      queryKey: ['child', 'stories', storyId],
      queryFn: () => childService.getStory(storyId),
      enabled: !!storyId,
    });
  };

  // Log story activity mutation
  const logStoryActivityMutation = useMutation<ActivityLoggedDto, Error, LogStoryActivityRequest>({
    mutationFn: (data) => childService.logStoryActivity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['child', 'stats'] });
    },
  });

  return {
    // Data
    stories,

    // Loading/error
    storiesLoading,
    storiesError,

    // Hooks
    useStory,

    // Mutations
    logStoryActivity: logStoryActivityMutation.mutateAsync,

    // Mutation states
    isLoggingActivity: logStoryActivityMutation.isPending,
  };
};