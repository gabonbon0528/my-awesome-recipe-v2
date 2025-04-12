import React from 'react';
import dynamic from 'next/dynamic';

// 使用動態導入避免 SSR 問題
const ErrorDashboard = dynamic(
  () => import('@/components/ErrorDashboard/ErrorDashboard'),
  { ssr: false }
);

export default function ErrorsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              錯誤追蹤
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <ErrorDashboard />
          </div>
        </main>
      </div>
    </div>
  );
} 