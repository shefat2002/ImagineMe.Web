'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/content/stories', label: 'Stories', icon: '📖' },
    { href: '/admin/content/quizzes', label: 'Quizzes', icon: '❓' },
    { href: '/admin/users', label: 'Users', icon: '👥' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-slate-800 text-white transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {!collapsed && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-slate-700 rounded"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-slate-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
            <p className="text-sm text-gray-600">Welcome, {user?.fullName || 'Admin'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}