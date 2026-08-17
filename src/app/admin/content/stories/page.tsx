'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/lib/api/admin';
import { StoryDto, CreateStoryRequest, UpdateStoryRequest, ContentStatus } from '@/types/api';

export default function AdminStoriesPage() {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState<StoryDto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | undefined>();

  const { data: stories, isLoading } = useQuery({
    queryKey: ['admin', 'stories', statusFilter, searchTerm],
    queryFn: () => adminService.getStories(statusFilter, searchTerm),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateStoryRequest) => adminService.createStory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'stories'] });
      setShowCreateModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStoryRequest }) =>
      adminService.updateStory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'stories'] });
      setShowEditModal(false);
      setSelectedStory(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteStory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'stories'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContentStatus }) =>
      adminService.updateStory(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'stories'] });
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data: CreateStoryRequest = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      coverImageUrl: (form.elements.namedItem('coverImageUrl') as HTMLInputElement).value,
      contentPayload: (form.elements.namedItem('contentPayload') as HTMLTextAreaElement).value,
      status: parseInt((form.elements.namedItem('status') as HTMLSelectElement).value) as ContentStatus,
    };
    createMutation.mutate(data);
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedStory) return;

    const form = e.currentTarget;
    const data: UpdateStoryRequest = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      coverImageUrl: (form.elements.namedItem('coverImageUrl') as HTMLInputElement).value,
      contentPayload: (form.elements.namedItem('contentPayload') as HTMLTextAreaElement).value,
      status: parseInt((form.elements.namedItem('status') as HTMLSelectElement).value) as ContentStatus,
    };
    updateMutation.mutate({ id: selectedStory.id, data });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this story?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleStatus = (story: StoryDto) => {
    const newStatus = story.status === ContentStatus.Published ? ContentStatus.Draft : ContentStatus.Published;
    toggleStatusMutation.mutate({ id: story.id, status: newStatus });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading stories...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Stories Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add Story
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={statusFilter ?? ''}
          onChange={(e) => setStatusFilter(e.target.value ? parseInt(e.target.value) : undefined)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="0">Draft</option>
          <option value="1">Published</option>
        </select>
      </div>

      {/* Stories Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stories?.map((story) => (
              <tr key={story.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{story.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      story.status === ContentStatus.Published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {story.status === ContentStatus.Published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(story.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleToggleStatus(story)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    {story.status === ContentStatus.Published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStory(story);
                      setShowEditModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Create New Story</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  name="coverImageUrl"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  name="contentPayload"
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">Draft</option>
                  <option value="1">Published</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Edit Story</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={selectedStory.title}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  name="coverImageUrl"
                  defaultValue={selectedStory.coverImageUrl}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  name="contentPayload"
                  defaultValue={selectedStory.contentPayload}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  defaultValue={selectedStory.status}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">Draft</option>
                  <option value="1">Published</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedStory(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Updating...' : 'Update Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}