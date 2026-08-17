import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Debounce function for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Memoization helper
export function memoize<T extends (...args: any[]) => any>(func: T): T {
  const cache = new Map();

  return function (...args: Parameters<T>) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  } as T;
}

// Format bytes for file sizes
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Format time duration
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

// Lazy load component wrapper
export function lazyLoad<T>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): React.ComponentType<T> {
  return React.lazy(importFunc);
}

// Request animation frame throttle
export function rafThrottle<T extends (...args: any[]) => any>(callback: T): T {
  let requestId: number | null = null;

  return function (...args: Parameters<T>) {
    if (requestId !== null) {
      cancelAnimationFrame(requestId);
    }

    requestId = requestAnimationFrame(() => {
      callback(...args);
      requestId = null;
    });
  } as T;
}

// Idle callback for non-critical tasks
export function scheduleIdle(callback: () => void, timeout = 2000): void {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(
      () => callback(),
      { timeout }
    );
  } else {
    setTimeout(callback, 0);
  }
}

// Batch state updates
export function batchUpdates(updates: Array<() => void>) {
  updates.forEach(update => update());
}

// Image optimization helpers
export function getOptimalImageSizes(
  containerWidth: number,
  containerHeight: number,
  devicePixelRatio: number = window.devicePixelRatio || 1
) {
  return {
    width: Math.ceil(containerWidth * devicePixelRatio),
    height: Math.ceil(containerHeight * devicePixelRatio),
  };
}

// Check if element is in viewport
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Get viewport dimensions
export function getViewportSize() {
  return {
    width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
  };
}