'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { parentService } from '@/lib/api/parent';
import { CreateChildRequest } from '@/types/api';

export default function ChildrenListPage() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [newChild, setNewChild] = useState<CreateChildRequest>({
    username: '',
    password: '',
  });

  const {
    data: children = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['parentChildren'],
    queryFn: () => parentService.getChildren(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateChildRequest) => parentService.createChild(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parentChildren'] });
      queryClient.invalidateQueries({ queryKey: ['parentDashboard'] });
      setShowAddModal(false);
      setNewChild({ username: '', password: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => parentService.deleteChild(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parentChildren'] });
      queryClient.invalidateQueries({ queryKey: ['parentDashboard'] });
      setShowDeleteConfirm(null);
    },
  });

  const handleCreateChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChild.username && newChild.password) {
      createMutation.mutate(newChild);
    }
  };

  const handleDeleteChild = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-600">Loading children...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-600">
          Failed to load children: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Children</h1>
          <p className="mt-2 text-gray-600">
            Manage your children's accounts and activity
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          Add Child
        </button>
      </div>

      {/* Children Grid */}
      {children.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">👶</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No children yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first child account to get started
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Add Your First Child
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => (
            <div
              key={child.childId}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-3xl">
                  👶
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/parent/children/${child.childId}`}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label="View child details"
                  >
                    👁️
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(child.childId)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
                    aria-label="Delete child"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {child.username}
              </h3>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>
                  Last activity:{' '}
                  {child.lastActivityAt
                    ? new Date(child.lastActivityAt).toLocaleDateString()
                    : 'Never'}
                </p>
                <p>
                  Status:{' '}
                  {child.lastActivityAt &&
                  new Date(child.lastActivityAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ? '✅ Active'
                    : '⏸️ Inactive'}
                </p>
              </div>

              <Link
                href={`/parent/children/${child.childId}`}
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Add Child Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Add New Child
            </h2>

            <form onSubmit={handleCreateChild} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={newChild.username}
                  onChange={(e) =>
                    setNewChild({ ...newChild, username: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={newChild.password}
                  onChange={(e) =>
                    setNewChild({ ...newChild, password: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                  minLength={8}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Child'}
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
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Delete Child Account?
              </h2>
              <p className="text-gray-600">
                This action cannot be undone. All child data will be permanently
                deleted.
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteChild(showDeleteConfirm)}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}