import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navigation } from '@/components/navigation';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Guitar Tool Station - Music Theory & Practice Tools',
  description: 'Comprehensive guitar tools including tuner, chord charts, scales, metronome, and music theory resources for guitarists.',
  keywords: 'guitar, tuner, chords, scales, metronome, music theory, practice, ear training',
  authors: [{ name: 'Guitar Tool Station' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#0f172a',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Guitar Tool Station',
    description: 'Professional guitar tools for practice and learning',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guitar Tool Station',
    description: 'Professional guitar tools for practice and learning',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ErrorBoundary>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <Navigation />
            <main className="pt-16">
              {children}
            </main>
            <Toaster />
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}