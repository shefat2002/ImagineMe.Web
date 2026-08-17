// Performance monitoring utilities
export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();

  // Mark a performance timestamp
  mark(name: string) {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(name);
    }
  }

  // Measure time between two marks
  measure(name: string, startMark: string, endMark: string) {
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0] as PerformanceMeasure;
        this.metrics.set(name, measure.duration);
        return measure.duration;
      } catch (e) {
        console.warn(`Failed to measure ${name}:`, e);
      }
    }
    return 0;
  }

  // Get Core Web Vitals
  getCoreWebVitals() {
    if (typeof window === 'undefined') return null;

    return {
      // LCP (Largest Contentful Paint) - measuring loading performance
      getLCP: () => {
        return new Promise((resolve) => {
          if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1] as any;
              resolve(lastEntry?.renderTime || lastEntry?.loadTime || 0);
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
          } else {
            resolve(0);
          }
        });
      },

      // FID (First Input Delay) - measuring interactivity
      getFID: () => {
        return new Promise((resolve) => {
          if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const firstEntry = entries[0] as any;
              resolve(firstEntry?.processingStart - firstEntry?.startTime || 0);
            });
            observer.observe({ entryTypes: ['first-input'] });
          } else {
            resolve(0);
          }
        });
      },

      // CLS (Cumulative Layout Shift) - measuring visual stability
      getCLS: () => {
        return new Promise((resolve) => {
          let clsValue = 0;
          if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
              for (const entry of list.getEntries() as any[]) {
                if (!entry.hadRecentInput) {
                  clsValue += entry.value;
                }
              }
            });
            observer.observe({ entryTypes: ['layout-shift'] });
          }
          setTimeout(() => resolve(clsValue), 5000);
        });
      },
    };
  }

  // Log page load times
  logPageLoadTimes() {
    if (typeof window === 'undefined') return;

    if ('performance' in window && 'timing' in window.performance) {
      const timing = window.performance.timing;
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      const domReadyTime = timing.domComplete - timing.navigationStart;
      const ttfb = timing.responseStart - timing.navigationStart;

      console.group('🚀 Performance Metrics');
      console.log(`Page Load Time: ${pageLoadTime}ms`);
      console.log(`DOM Ready: ${domReadyTime}ms`);
      console.log(`Time to First Byte: ${ttfb}ms`);
      console.groupEnd();
    }
  }

  // Monitor memory usage (if available)
  logMemoryUsage() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const memory = (performance as any).memory;
      if (memory) {
        console.group('💾 Memory Usage');
        console.log(`Used: ${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`);
        console.log(`Total: ${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`);
        console.log(`Limit: ${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`);
        console.groupEnd();
      }
    }
  }

  // Get navigation timing data
  getNavigationTiming() {
    if (typeof window === 'undefined' || !('performance' in window)) return null;

    const timing = window.performance.timing;
    return {
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      tcp: timing.connectEnd - timing.connectStart,
      ttfb: timing.responseStart - timing.navigationStart,
      download: timing.responseEnd - timing.responseStart,
      domProcessing: timing.domComplete - timing.domLoading,
      totalLoad: timing.loadEventEnd - timing.navigationStart,
    };
  }

  // Get resource timing data
  getResourceTiming() {
    if (typeof window === 'undefined' || !('performance' in window)) return [];

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    return resources
      .filter((resource) => resource.initiatorType !== 'xmlhttprequest')
      .map((resource) => ({
        name: resource.name,
        duration: resource.duration,
        size: resource.transferSize,
        type: resource.initiatorType,
      }))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);
  }

  // Log slow resources (>1 second)
  logSlowResources(threshold = 1000) {
    const resources = this.getResourceTiming();
    const slowResources = resources.filter((r) => r.duration > threshold);

    if (slowResources.length > 0) {
      console.group('⚠️ Slow Resources');
      slowResources.forEach((resource) => {
        console.log(`${resource.name}: ${resource.duration.toFixed(2)}ms (${(resource.size / 1024).toFixed(2)} KB)`);
      });
      console.groupEnd();
    }
  }
}

// Singleton instance
export const perfMonitor = new PerformanceMonitor();

// Auto-monitor on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      perfMonitor.logPageLoadTimes();
      perfMonitor.logSlowResources();

      // Monitor Core Web Vitals
      const vitals = perfMonitor.getCoreWebVitals();
      if (vitals) {
        Promise.all([vitals.getLCP(), vitals.getFID(), vitals.getCLS()]).then(([lcp, fid, cls]) => {
          console.group('📊 Core Web Vitals');
          console.log(`LCP (Largest Contentful Paint): ${lcp.toFixed(0)}ms`);
          console.log(`FID (First Input Delay): ${fid.toFixed(0)}ms`);
          console.log(`CLS (Cumulative Layout Shift): ${cls.toFixed(3)}`);
          console.groupEnd();
        });
      }
    }, 1000);
  });
}