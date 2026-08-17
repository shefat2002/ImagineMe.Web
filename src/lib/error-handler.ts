import { AxiosError } from 'axios';

// Error types for classification
export enum ErrorType {
  VALIDATION = 'validation',
  NETWORK = 'network',
  AUTH = 'auth',
  SERVER = 'server',
  NOT_FOUND = 'not_found',
  PERMISSION = 'permission',
  UNKNOWN = 'unknown',
}

// Error classification result
export interface ClassifiedError {
  type: ErrorType;
  message: string;
  details?: string;
  fieldErrors?: Record<string, string>;
  status?: number;
  originalError: Error;
}

// Network error detection
function isNetworkError(error: Error): boolean {
  if (error instanceof AxiosError) {
    return !error.response && !!error.request;
  }
  return error.message.includes('Network Error') ||
         error.message.includes('ECONNREFUSED') ||
         error.message.includes('fetch');
}

// Auth error detection
function isAuthError(error: Error): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 401 || error.response?.status === 403;
  }
  return false;
}

// Permission error detection
function isPermissionError(error: Error): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 403;
  }
  return false;
}

// Not found error detection
function isNotFoundError(error: Error): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 404;
  }
  return false;
}

// Validation error detection
function isValidationError(error: Error): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 400;
  }
  return false;
}

// Server error detection
function isServerError(error: Error): boolean {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    return status !== undefined && status >= 500 && status < 600;
  }
  return false;
}

// Extract field errors from various error response formats
function extractFieldErrors(error: AxiosError): Record<string, string> | undefined {
  const data = error.response?.data as any;
  if (!data) return undefined;

  // Handle ASP.NET Core validation errors
  if (data.errors && typeof data.errors === 'object') {
    return data.errors;
  }

  // Handle custom validation errors
  if (data.fieldErrors && typeof data.fieldErrors === 'object') {
    return data.fieldErrors;
  }

  // Handle array format of field errors
  if (Array.isArray(data)) {
    const fieldErrors: Record<string, string> = {};
    data.forEach((item: any) => {
      if (item.field && item.message) {
        fieldErrors[item.field] = item.message;
      }
    });
    if (Object.keys(fieldErrors).length > 0) {
      return fieldErrors;
    }
  }

  return undefined;
}

// Extract user-friendly message from error response
function extractErrorMessage(error: AxiosError): string {
  const data = error.response?.data as any;

  // Direct message
  if (data?.message) {
    return data.message;
  }

  // Title + description
  if (data?.title && data?.description) {
    return `${data.title}: ${data.description}`;
  }

  // Detail field
  if (data?.detail) {
    return data.detail;
  }

  // Status text
  if (error.response?.statusText) {
    return error.response.statusText;
  }

  // Default message based on status
  const status = error.response?.status;
  if (status === 400) return 'Invalid request. Please check your input.';
  if (status === 401) return 'Authentication required. Please log in.';
  if (status === 403) return 'Access denied. You do not have permission.';
  if (status === 404) return 'Resource not found.';
  if (status === 500) return 'Server error. Please try again later.';
  if (status === 503) return 'Service temporarily unavailable.';

  return 'An unexpected error occurred. Please try again.';
}

// Main error classification function
export function classifyError(error: Error): ClassifiedError {
  // Check network errors first
  if (isNetworkError(error)) {
    return {
      type: ErrorType.NETWORK,
      message: 'Network connection error. Please check your internet connection.',
      status: undefined,
      originalError: error,
    };
  }

  // Check Axios errors with response
  if (error instanceof AxiosError && error.response) {
    const status = error.response.status;

    // Auth errors
    if (isAuthError(error)) {
      return {
        type: ErrorType.AUTH,
        message: status === 401 ? 'Authentication required. Please log in.' : 'Access denied.',
        details: extractErrorMessage(error),
        status,
        originalError: error,
      };
    }

    // Permission errors
    if (isPermissionError(error)) {
      return {
        type: ErrorType.PERMISSION,
        message: 'You do not have permission to perform this action.',
        details: extractErrorMessage(error),
        status,
        originalError: error,
      };
    }

    // Not found errors
    if (isNotFoundError(error)) {
      return {
        type: ErrorType.NOT_FOUND,
        message: 'The requested resource was not found.',
        details: extractErrorMessage(error),
        status,
        originalError: error,
      };
    }

    // Validation errors
    if (isValidationError(error)) {
      return {
        type: ErrorType.VALIDATION,
        message: 'Please check your input and try again.',
        details: extractErrorMessage(error),
        fieldErrors: extractFieldErrors(error),
        status,
        originalError: error,
      };
    }

    // Server errors
    if (isServerError(error)) {
      return {
        type: ErrorType.SERVER,
        message: 'Server error. Please try again later.',
        details: extractErrorMessage(error),
        status,
        originalError: error,
      };
    }

    // Other HTTP errors
    return {
      type: ErrorType.UNKNOWN,
      message: extractErrorMessage(error),
      status,
      originalError: error,
    };
  }

  // Generic error fallback
  return {
    type: ErrorType.UNKNOWN,
    message: error.message || 'An unexpected error occurred.',
    originalError: error,
  };
}

// Handle errors with toast notifications (to be integrated with toast system)
export function handleApiError(error: Error, showToast?: (message: string, type: 'error' | 'warning' | 'info') => void): ClassifiedError {
  const classified = classifyError(error);

  // Show toast notification if toast function provided
  if (showToast) {
    let toastType: 'error' | 'warning' | 'info' = 'error';

    switch (classified.type) {
      case ErrorType.VALIDATION:
        toastType = 'warning';
        break;
      case ErrorType.NETWORK:
        toastType = 'error';
        break;
      case ErrorType.AUTH:
        toastType = 'warning';
        break;
      case ErrorType.PERMISSION:
        toastType = 'warning';
        break;
      case ErrorType.SERVER:
        toastType = 'error';
        break;
      default:
        toastType = 'error';
    }

    showToast(classified.message, toastType);
  }

  // Log error details in development
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', {
      type: classified.type,
      message: classified.message,
      status: classified.status,
      fieldErrors: classified.fieldErrors,
      original: error,
    });
  }

  return classified;
}

// Get retry strategy based on error type
export function shouldRetryError(error: Error, retryCount = 0): boolean {
  const classified = classifyError(error);

  // Don't retry auth, validation, or permission errors
  if ([ErrorType.AUTH, ErrorType.VALIDATION, ErrorType.PERMISSION].includes(classified.type)) {
    return false;
  }

  // Retry network errors up to 3 times
  if (classified.type === ErrorType.NETWORK && retryCount < 3) {
    return true;
  }

  // Retry server errors up to 2 times
  if (classified.type === ErrorType.SERVER && retryCount < 2) {
    return true;
  }

  return false;
}

// Format field errors for form display
export function formatFieldErrors(fieldErrors: Record<string, string> | undefined): Record<string, string> {
  if (!fieldErrors) return {};

  return Object.entries(fieldErrors).reduce((acc, [field, message]) => {
    // Convert field names to more readable format
    const readableField = field
      .split(/(?=[A-Z])/)
      .join('_')
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase());

    acc[readableField] = message;
    return acc;
  }, {} as Record<string, string>);
}

// Check if error should trigger logout
export function shouldTriggerLogout(error: Error): boolean {
  const classified = classifyError(error);
  return classified.type === ErrorType.AUTH && classified.status === 401;
}

// Export error types for use in components
export { ErrorType };