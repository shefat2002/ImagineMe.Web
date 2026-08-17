'use client';

import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/lib/api/admin';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminService.getStats(),
  });

  const { data: userStats, isLoading: userStatsLoading } = useQuery({
    queryKey: ['admin', 'userStats'],
    queryFn: () => adminService.getUserStats(),
  });

  if (statsLoading || userStatsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  const quickActions = [
    {
      href: '/admin/content/stories',
      label: 'Add Story',
      icon: '📖',
      color: 'bg-blue-500',
    },
    {
      href: '/admin/content/quizzes',
      label: 'Create Quiz',
      icon: '❓',
      color: 'bg-green-500',
    },
    {
      href: '/admin/users',
      label: 'Manage Users',
      icon: '👥',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-gray-800">{stats?.totalUsers || 0}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Children</p>
              <p className="text-3xl font-bold text-gray-800">{stats?.activeChildren || 0}</p>
            </div>
            <div className="text-4xl">👶</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Stories</p>
              <p className="text-3xl font-bold text-gray-800">{stats?.totalStories || 0}</p>
            </div>
            <div className="text-4xl">📖</div>
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">User Breakdown</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{userStats?.totalParents || 0}</p>
            <p className="text-sm text-gray-600">Parents</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{userStats?.totalChildren || 0}</p>
            <p className="text-sm text-gray-600">Children</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{userStats?.totalAdmins || 0}</p>
            <p className="text-sm text-gray-600">Admins</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`${action.color} text-white rounded-lg p-4 text-center hover:opacity-90 transition-opacity`}
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <div className="font-medium">{action.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}