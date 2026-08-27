'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { LoginInput } from '@/lib/validations';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FormLabel from '@/components/ui/FormLabel';

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin, devMagicLogin } = useAuth();
  const [error, setError] = useState<string>('');
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_BASE_URL?.includes('dev-api')) {
      setIsDev(true);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setError('');
      await adminLogin(data.email, data.password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Admin login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in with your admin credentials
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <FormLabel htmlFor="email">Email address</FormLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              error={errors.email?.message}
            />
          </div>

          <div>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              error={errors.password?.message}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                Back to parent login
              </a>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>

          {isDev && (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300"
              onClick={async () => {
                try {
                  setError('');
                  await devMagicLogin('Admin');
                  router.push('/admin/dashboard');
                } catch (err: any) {
                  setError(err.message || 'Magic login failed');
                }
              }}
            >
              🛠 1-Click Magic Login (Dev Mode)
            </Button>
          )}

          <div className="text-center text-sm">
            <a href="/auth/login" className="text-blue-600 hover:text-blue-500">
              ← Back to parent login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}