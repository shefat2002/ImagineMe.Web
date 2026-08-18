'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { childService } from '@/lib/api/child';

export default function ChildPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await childService.getProfile();
        setCoins(profile.coins);
        setStreak(profile.currentStreak);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userType === 3) {
      loadProfile();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/child-login');
  };

  const navItems = [
    { href: '/child/portal/profile', label: '🏠 Profile', emoji: '🏠' },
    { href: '/child/portal/stories', label: '📚 Stories', emoji: '📚' },
    { href: '/child/portal/quizzes', label: '🧠 Quizzes', emoji: '🧠' },
    { href: '/child/portal/games', label: '🎮 Games', emoji: '🎮' },
    { href: '/child/portal/store', label: '🛒 Store', emoji: '🛒' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl">✨</span>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Imagine Me
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md scale-105'
                      : 'text-gray-700 hover:bg-purple-100 hover:scale-105'
                  }`}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="ml-2 font-medium">{item.label.split(' ')[1]}</span>
                </Link>
              ))}
            </div>

            {/* Stats and Actions */}
            <div className="flex items-center space-x-4">
              {/* Coins Counter */}
              <div className="flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-full shadow-md">
                <span className="text-2xl animate-bounce">🪙</span>
                <span className="font-bold text-yellow-700 text-lg">
                  {loading ? '...' : coins}
                </span>
              </div>

              {/* Streak Counter */}
              <div className="flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full shadow-md">
                <span className="text-2xl animate-pulse">🔥</span>
                <span className="font-bold text-orange-700 text-lg">
                  {loading ? '...' : streak}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex justify-around space-x-1 pb-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105'
                    : 'text-gray-700 hover:bg-purple-100'
                }`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-xs mt-1">{item.label.split(' ')[1]}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 min-h-[calc(100vh-200px)]">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm mt-8 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 font-medium">
            Made with ❤️ for curious minds • Imagine Me Learning Platform
          </p>
        </div>
      </footer>
    </div>
  );
}