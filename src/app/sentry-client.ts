import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    new Sentry.BrowserTracing({
      tracingOrigins: ['localhost', 'imaginemebylovie.com', /^\//],
    }),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  beforeSend(event, hint) {
    // Filter out sensitive data
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers;
    }

    // Filter out development errors
    if (process.env.NODE_ENV === 'development') {
      return null;
    }

    return event;
  },

  beforeSendTransaction(event) {
    // Filter out performance monitoring in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }

    return event;
  },
});

// Export user feedback function
export function showUserFeedback(error: Error) {
  Sentry.captureException(error);
}

// Export performance monitoring
export function trackPerformance(transactionName: string) {
  return Sentry.startTransaction({ name: transactionName });
}