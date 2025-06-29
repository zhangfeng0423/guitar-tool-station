'use client';

import { LoadingSpinner } from '@/components/loading-spinner';
import { Guitar } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Guitar className="w-12 h-12 text-amber-500 animate-pulse" />
        </div>
        <LoadingSpinner size="lg" />
        <p className="text-slate-400">Loading Guitar Tool Station...</p>
      </div>
    </div>
  );
}