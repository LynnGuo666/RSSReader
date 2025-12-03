'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Newspaper } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, setHydrated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHydrated();
    setMounted(true);
  }, [setHydrated]);

  useEffect(() => {
    if (!mounted) return;

    if (isAuthenticated()) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--apple-gray)' }}>
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
             style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Newspaper size={48} color="white" />
        </div>
        <h1 className="text-4xl font-semibold mb-3" style={{ color: 'var(--apple-text)' }}>
          RSS Reader
        </h1>
        <p style={{ color: 'var(--apple-text-tertiary)', fontSize: '15px' }}>
          Loading...
        </p>
      </div>
    </div>
  );
}
