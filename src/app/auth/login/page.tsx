'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validations';
import { authService } from '@/lib/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const [showOtp, setShowOtp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_BASE_URL?.includes('dev-api')) {
      setIsDev(true);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    setLoading(true);

    try {
      const authData = await authService.login(data);

      // Store token
      localStorage.setItem('authToken', authData.token);
      localStorage.setItem('refreshToken', authData.refreshToken || '');

      // Redirect based on user type
      router.push('/parent/dashboard');
    } catch (err) {
      const { getErrorMessage } = await import('@/lib/api-client');
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);

      // Check if error is due to unverified email
      if (errorMessage.toLowerCase().includes('not verified') ||
          errorMessage.toLowerCase().includes('verify your email') ||
          errorMessage.toLowerCase().includes('email verification required')) {

        // Send OTP to the user's email
        try {
          await authService.sendVerification({ email: data.email });
          // Redirect to OTP page with email
          router.push(`/auth/verify?email=${encodeURIComponent(data.email)}`);
          return;
        } catch (otpError) {
          setError('Email not verified. Failed to send verification code.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email to receive a password reset OTP
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(async (data) => {
            setError(null);
            setLoading(true);

            try {
              await authService.sendResetOtp({ email: data.email });
              setShowOtp(true);
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Failed to send OTP');
            } finally {
              setLoading(false);
            }
          })} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>

            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-500"
            >
              Back to login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (showOtp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Enter OTP</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(async (data) => {
            setError(null);
            setLoading(true);

            try {
              // Note: This form needs proper OTP and new password inputs
              // Currently using placeholder values
              await authService.resetPassword({
                email: data.email,
                otp: '123456', // Would be collected from separate input
                newPassword: 'newPassword123', // Would be collected from separate input
              });
              router.push('/auth/login');
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Password reset failed');
            } finally {
              setLoading(false);
            }
          })} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                OTP Code
              </label>
              <input
                type="text"
                maxLength={6}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
          <p className="mt-2 text-sm text-gray-600">
            Parent or Admin account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              {...register('email')}
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          {isDev && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                Development Quick Login
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  setError(null);
                  setLoading(true);
                  try {
                    const authData = await authService.devMagicLogin('Parent');
                    localStorage.setItem('authToken', authData.token);
                    localStorage.setItem('refreshToken', (authData as any).refreshToken || '');
                    router.push('/parent/dashboard');
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Magic Login failed');
                    setLoading(false);
                  }
                }}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
              >
                🛠 Login as Parent
              </button>
              
              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  setError(null);
                  setLoading(true);
                  try {
                    const authData = await authService.devMagicLogin('Admin');
                    localStorage.setItem('authToken', authData.token);
                    localStorage.setItem('refreshToken', (authData as any).refreshToken || '');
                    router.push('/admin/dashboard');
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Magic Login failed');
                    setLoading(false);
                  }
                }}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-purple-800 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                🛠 Login as Admin
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  setError(null);
                  setLoading(true);
                  try {
                    const authData: any = await authService.devMagicLogin('Child');
                    localStorage.setItem('authToken', authData.token);
                    localStorage.setItem('childInfo', JSON.stringify({
                      childId: authData.childId,
                      username: authData.username,
                      coins: authData.coins,
                      currentStreak: authData.currentStreak,
                    }));
                    router.push('/child/portal');
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Magic Login failed');
                    setLoading(false);
                  }
                }}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-green-800 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                🛠 Login as Child
              </button>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
                Register
              </a>
            </p>
          </div>

          <div className="text-center">
            <a href="/auth/child-login" className="text-sm text-blue-600 hover:text-blue-500">
              Child Login
            </a>
          </div>

          <div className="text-center">
            <a href="/admin/login" className="text-sm text-gray-600 hover:text-gray-500">
              Admin Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}