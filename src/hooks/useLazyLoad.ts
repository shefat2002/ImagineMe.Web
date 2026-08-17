import { useState, useEffect, useRef } from 'react';

interface LazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useLazyLoad(options: LazyLoadOptions = {}) {
  const { threshold = 0.1, rootMargin = '50px', triggerOnce = true } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || isLoaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setIsLoaded(true);

          if (triggerOnce) {
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, isLoaded]);

  return { elementRef, isIntersecting, isLoaded };
}

interface LazyImageOptions {
  src?: string;
  fallback?: string;
  threshold?: number;
}

export function useLazyImage({ src, fallback = '', threshold = 0.01 }: LazyImageOptions) {
  const [imageSrc, setImageSrc] = useState(fallback);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!src) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            setImageSrc(src);
            setIsLoaded(true);
          };
          img.onerror = () => {
            setImageSrc(fallback);
            setIsLoaded(true);
          };
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, fallback, threshold]);

  return { imgRef, imageSrc, isLoaded };
}

// Preload resources
export function usePreload(resources: string[]) {
  useEffect(() => {
    if (!resources.length) return;

    const links = resources.map((href) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = href.endsWith('.js') ? 'script' : 'style';
      link.href = href;
      document.head.appendChild(link);
      return link;
    });

    return () => {
      links.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, resources);
}

// Prefetch pages
export function usePrefetch(href: string, shouldPrefetch = true) {
  useEffect(() => {
    if (!shouldPrefetch || !href) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);

    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, [href, shouldPrefetch]);
}