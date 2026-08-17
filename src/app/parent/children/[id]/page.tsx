'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { parentService } from '@/lib/api/parent';
import { UpdateChildRequest, ActivityType } from '@/types/api';

export default function ChildDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const childId = params.id as string;

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editData, setEditData] = useState<UpdateChildRequest>({});

  const {
    data: child,
    isLoading: childLoading,
    error: childError,
  } = useQuery({
    queryKey: ['childDetail', childId],
    queryFn: () => parentService.getChildDetails(childId),
    enabled: !!childId,
  });

  const {
    data: activities = [],
    isLoading: activitiesLoading,
    error: activitiesError,
  } = useQuery({
    queryKey: ['childActivities', childId],
    queryFn: () => parentService.getChildActivities(childId),
    enabled: !!childId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateChildRequest) =>
      parentService.updateChild(childId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childDetail', childId] });
      queryClient.invalidateQueries({ queryKey: ['parentChildren'] });
      setShowEditModal(false);
      setEditData({});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => parentService.deleteChild(childId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parentChildren'] });
      router.push('/parent/children');
    },
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(editData).length > 0) {
      updateMutation.mutate(editData);
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  if (childLoading || activitiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-600">Loading child details...</div>
      </div>
    );
  }

  if (childError || activitiesError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-600">
          Failed to load child details:{' '}
          {(childError || activitiesError)?.message}
        </div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Child not found</div>
      </div>
    );
  }

  const getActivityTypeLabel = (type: ActivityType) => {
    switch (type) {
      case ActivityType.Story:
        return '📖 Story';
      case ActivityType.Quiz:
        return '❓ Quiz';
      case ActivityType.Game:
        return '🎮 Game';
      case ActivityType.DailyLogin:
        return '📅 Daily Login';
      default:
        return '❓ Unknown';
    }
  };

  return (
    <div className="p-6 sm:p-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        ← Back to Children
      </button>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-4xl">
            👶
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {child.username}
            </h1>
            <p className="mt-1 text-gray-600">Child Account</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Coins</p>
              <p className="mt-2 text-3xl font-bold text-indigo-600">
                💰 {child.coins}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="mt-2 text-3xl font-bold text-orange-600">
                🔥 {child.currentStreak}
              </p>
            </div>
            <div className="text-4xl">🔥</div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:col-span-2">
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Account Created
              </p>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {new Date(child.createdAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {child.lastLoginAt
                  ? `Last login: ${new Date(child.lastLoginAt).toLocaleString()}`
                  : 'Never logged in'}
              </p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>
      </div>

      {/* Activity History */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Activity History
          </h2>
        </div>

        {activities.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No activity yet
            </h3>
            <p className="text-gray-600">
              {child.username} hasn't completed any activities
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coins Earned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities.map((activity) => (
                  <tr key={activity.activityId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(activity.completedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getActivityTypeLabel(activity.activityType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      +{activity.coinsEarned} 💰
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.storyId && <span>Story: {activity.storyId}</span>}
                      {activity.quizId && <span>Quiz: {activity.quizId}</span>}
                      {!activity.storyId && !activity.quizId && '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Edit Child Account
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label
                  htmlFor="editUsername"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="editUsername"
                  defaultValue={child.username}
                  onChange={(e) =>
                    setEditData({ ...editData, username: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="editPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password (optional)
                </label>
                <input
                  type="password"
                  id="editPassword"
                  onChange={(e) =>
                    setEditData({ ...editData, password: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  minLength={8}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave blank to keep current password
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Delete {child.username}?
              </h2>
              <p className="text-gray-600">
                This action cannot be undone. All data including coins, streak,
                and activity history will be permanently deleted.
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}