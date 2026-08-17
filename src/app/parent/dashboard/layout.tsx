'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ParentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/parent/dashboard', icon: '📊' },
    { name: 'Children', href: '/parent/children', icon: '👶' },
    { name: 'Activity', href: '/parent/activity', icon: '⏱️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-gray-900 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 md:w-64`}
        role="navigation"
        aria-label="Sidebar navigation"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-gray-800">
            <span className="text-2xl font-bold text-white">Imagine Me</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User menu */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{user?.fullName}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-gray-800 p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Logout"
              >
                🚪
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
          <button
            type="button"
            className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            ☰
          </button>

          {/* Breadcrumb */}
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link
                  href="/parent/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Parent
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li className="text-sm font-medium text-gray-500">
                {navigation.find((item) => item.href === pathname)?.name ||
                  'Dashboard'}
              </li>
            </ol>
          </nav>
        </div>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}