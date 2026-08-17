import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Imagine Me - Interactive Learning Platform",
  description: "Educational platform with stories, quizzes, and games for children",
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" }
  ],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}

        {/* Service Worker Registration */}
        <Script id="service-worker-registration" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then((registration) => {
                    console.log('SW registered: ', registration);
                  })
                  .catch((registrationError) => {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `}
        </Script>

        {/* Performance Monitoring */}
        <Script id="performance-monitor" strategy="afterInteractive">
          {`
            // Enable performance monitoring in development
            if (process.env.NODE_ENV === 'development') {
              window.addEventListener('load', () => {
                setTimeout(() => {
                  if ('performance' in window) {
                    const timing = window.performance.timing;
                    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
                    console.log('⚡ Page Load Time:', pageLoadTime + 'ms');
                  }
                }, 0);
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
