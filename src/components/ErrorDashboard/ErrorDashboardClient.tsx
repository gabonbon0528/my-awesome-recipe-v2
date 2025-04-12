'use client';

import dynamic from 'next/dynamic';

const ErrorDashboard = dynamic(
  () => import('./ErrorDashboard'),
  { ssr: false }
);

export default function ErrorDashboardClient() {
  return <ErrorDashboard />;
} 