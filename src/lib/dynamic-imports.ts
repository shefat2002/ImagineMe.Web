// Dynamic imports for code splitting and lazy loading
import dynamic from 'next/dynamic';

// Auth pages
export const Login = dynamic(() => import('@/app/auth/login/page').then(mod => ({ default: mod.default })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded" />,
  ssr: false,
});

export const Register = dynamic(() => import('@/app/auth/register/page').then(mod => ({ default: mod.default })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded" />,
  ssr: false,
});

export const ChildLogin = dynamic(() => import('@/app/auth/child-login/page').then(mod => ({ default: mod.default })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded" />,
  ssr: false,
});

// Parent pages
export const ParentDashboard = dynamic(() => import('@/app/parent/dashboard/page').then(mod => ({ default: mod.default })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded" />,
});

export const ChildrenList = dynamic(() => import('@/app/parent/children/page').then(mod => ({ default: mod.default })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded" />,
});

export const ChildDetail = dynamic(() => import('@/app/parent/children/[id]/page').then(mod => ({ default: mod.default })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded" />,
});

// Child portal pages
export const ChildProfile = dynamic(() => import('@/app/child/portal/profile/page').then(mod => ({ default: mod.default })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded" />,
});

export const Stories = dynamic(() => import('@/app/child/portal/stories/page').then(mod => ({ default: mod.default })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded" />,
});

export const Quizzes = dynamic(() => import('@/app/child/portal/quizzes/page').then(mod => ({ default: mod.default })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded" />,
});

export const Games = dynamic(() => import('@/app/child/portal/games/page').then(mod => ({ default: mod.default })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded" />,
});

export const Store = dynamic(() => import('@/app/child/portal/store/page').then(mod => ({ default: mod.default })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded" />,
});

// Admin pages
export const AdminDashboard = dynamic(() => import('@/app/admin/dashboard/page').then(mod => ({ default: mod.default })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded" />,
});

export const AdminStories = dynamic(() => import('@/app/admin/content/stories/page').then(mod => ({ default: mod.default })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded" />,
});

export const AdminQuizzes = dynamic(() => import('@/app/admin/content/quizzes/page').then(mod => ({ default: mod.default })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded" />,
});

export const AdminUsers = dynamic(() => import('@/app/admin/users/page').then(mod => ({ default: mod.default })), {
  loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded" />,
});