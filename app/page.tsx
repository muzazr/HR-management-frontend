'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthHelper } from '../lib/auth';
import LoadingSpinner from '../components/auth/LoadingSpinner';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (AuthHelper.isAuthenticated()) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return <LoadingSpinner />;
}