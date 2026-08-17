'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserType } from '@/types/api';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserType[];
  requireAuth?: boolean;
}

export function AuthGuard({ children, allowedRoles, requireAuth = true }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userType = localStorage.getItem('user_type') as UserType | null;

      // Check if authentication is required
      if (requireAuth && !token) {
        router.push('/auth/login');
        return;
      }

      // Check role-based access
      if (allowedRoles && userType && !allowedRoles.includes(userType)) {
        // Redirect to appropriate dashboard based on user type
        switch (userType) {
          case UserType.Parent:
            router.push('/parent/dashboard');
            break;
          case UserType.Child:
            router.push('/child/portal');
            break;
          case UserType.Admin:
            router.push('/admin/dashboard');
            break;
          default:
            router.push('/auth/login');
        }
        return;
      }
    };

    checkAuth();
  }, [router, pathname, allowedRoles, requireAuth]);

  // Render children while checking auth
  return <>{children}</>;
}

// Public route wrapper
export function PublicRoute({ children }: { children: React.ReactNode }) {
  return <AuthGuard requireAuth={false}>{children}</AuthGuard>;
}

// Role-specific route guards
export function ParentRoute({ children }: { children: React.ReactNode }) {
  return <AuthGuard allowedRoles={[UserType.Parent]}>{children}</AuthGuard>;
}

export function ChildRoute({ children }: { children: React.ReactNode }) {
  return <AuthGuard allowedRoles={[UserType.Child]}>{children}</AuthGuard>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return <AuthGuard allowedRoles={[UserType.Admin]}>{children}</AuthGuard>;
}