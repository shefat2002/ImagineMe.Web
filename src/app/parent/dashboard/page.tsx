'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { parentService } from '@/lib/api/parent';

export default function ParentDashboardPage() {
  const {
    data: dashboard,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['parentDashboard'],
    queryFn: () => parentService.getDashboard(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-600">
          Failed to load dashboard: {error.message}
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">No dashboard data available</div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's an overview of your children's activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Children</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {dashboard.totalChildren}
              </p>
            </div>
            <div className="text-4xl">👶</div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Today</p>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {dashboard.activeChildren}
              </p>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:col-span-2">
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-sm font-medium text-gray-600">Quick Actions</p>
              <div className="mt-3 flex gap-3">
                <Link
                  href="/parent/children"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  Add Child
                </Link>
                <Link
                  href="/parent/children"
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  View All Children
                </Link>
              </div>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
        </div>
      </div>

      {/* Children Activity List */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
        </div>

        {dashboard.children.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">👶</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No children yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by adding your first child account
            </p>
            <Link
              href="/parent/children"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Add Your First Child
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {dashboard.children.map((child) => (
              <Link
                key={child.childId}
                href={`/parent/children/${child.childId}`}
                className="block px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-2xl">
                      👶
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {child.username}
                      </p>
                      <p className="text-sm text-gray-500">
                        {child.lastActivityAt
                          ? `Last active: ${new Date(child.lastActivityAt).toLocaleDateString()}`
                          : 'No activity yet'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Coins</p>
                      <p className="text-lg font-semibold text-indigo-600">
                        💰 {child.coins}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Streak</p>
                      <p className="text-lg font-semibold text-orange-600">
                        🔥 {child.currentStreak}
                      </p>
                    </div>
                    <div className="text-gray-400">→</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}