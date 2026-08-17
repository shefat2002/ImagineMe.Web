'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { childLoginSchema, type ChildLoginInput } from '@/lib/validations';

export default function ChildLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChildLoginInput>({
    resolver: zodResolver(childLoginSchema),
  });

  const onSubmit = async (data: ChildLoginInput) => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/child/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Child login failed');
      }

      const authData = await response.json();

      // Store token and child info
      localStorage.setItem('token', authData.token);
      localStorage.setItem('childInfo', JSON.stringify({
        childId: authData.childId,
        username: authData.username,
        coins: authData.coins,
        currentStreak: authData.currentStreak,
      }));

      // Redirect to child portal
      router.push('/child/portal');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Child login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
            <span className="text-4xl mr-2">🚀</span>
            Kid Portal Login
          </h2>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Enter your username and password to continue learning!
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              <span className="text-lg">👤</span> Username
            </label>
            <input
              {...register('username')}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-lg"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              <span className="text-lg">🔒</span> Password
            </label>
            <input
              {...register('password')}
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-lg"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              <span className="flex items-center">
                🎮 Start Learning!
              </span>
            )}
          </button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Are you a parent?{' '}
              <a href="/auth/login" className="font-medium text-purple-600 hover:text-purple-500">
                Parent/Admin Login
              </a>
            </p>
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/auth/register" className="font-medium text-purple-600 hover:text-purple-500">
                Register
              </a>
            </p>
          </div>
        </form>

        <div className="mt-6 text-center">
          <div className="flex justify-center space-x-4 text-3xl">
            <span>📚</span>
            <span>🎯</span>
            <span>🏆</span>
            <span>⭐</span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Read stories, play games, and earn coins!
          </p>
        </div>
      </div>
    </div>
  );
}