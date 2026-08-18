// Google Analytics initialization
declare global {
  interface Window {
    gtag: (arg1: string, arg2: string, arg3?: any) => void;
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

export const event = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Custom tracking events
export const trackAuthEvents = {
  login: (userType: string) => event('login', 'authentication', userType),
  register: (userType: string) => event('sign_up', 'authentication', userType),
  logout: () => event('logout', 'authentication'),
};

export const trackChildEvents = {
  storyCompleted: (storyId: string, coins: number) =>
    event('story_completed', 'child_activity', storyId, coins),
  quizCompleted: (quizId: string, score: number, coins: number) =>
    event('quiz_completed', 'child_activity', quizId, score),
  gamePlayed: (gameType: string, score: number, coins: number) =>
    event('game_played', 'child_activity', gameType, score),
  purchaseRequested: (itemId: string, price: number) =>
    event('purchase_requested', 'child_activity', itemId, price),
  dailyRewardClaimed: (coins: number) =>
    event('daily_reward', 'child_activity', 'daily_reward', coins),
};

export const trackParentEvents = {
  childCreated: () => event('child_created', 'parent_activity'),
  childUpdated: (childId: string) =>
    event('child_updated', 'parent_activity', childId),
  childDeleted: (childId: string) =>
    event('child_deleted', 'parent_activity', childId),
};

export const trackAdminEvents = {
  contentCreated: (contentType: string) =>
    event('content_created', 'admin_activity', contentType),
  contentUpdated: (contentType: string, contentId: string) =>
    event('content_updated', 'admin_activity', `${contentType}:${contentId}`),
  contentDeleted: (contentType: string, contentId: string) =>
    event('content_deleted', 'admin_activity', `${contentType}:${contentId}`),
  userStatusChanged: (userId: string, newStatus: string) =>
    event('user_status_changed', 'admin_activity', `${userId}:${newStatus}`),
};

export const trackErrors = {
  apiError: (endpoint: string, error: string) =>
    event('api_error', 'error', `${endpoint}:${error}`),
  validationError: (form: string, field: string) =>
    event('validation_error', 'error', `${form}:${field}`),
  networkError: (operation: string) =>
    event('network_error', 'error', operation),
};