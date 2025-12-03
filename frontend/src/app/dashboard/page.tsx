'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import FeedList from '@/components/FeedList';
import ArticleList from '@/components/ArticleList';
import ArticleReader from '@/components/ArticleReader';
import type { Article } from '@/types';
import { Newspaper, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, logout, user, setHydrated } = useAuthStore();
  const [selectedFeedId, setSelectedFeedId] = useState<number | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHydrated();
    setMounted(true);
  }, [setHydrated]);

  useEffect(() => {
    if (mounted && !isAuthenticated()) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!mounted) {
    return null;
  }

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--apple-gray)' }}>
      {/* Header */}
      <header className="apple-card" style={{
        borderRadius: 0,
        borderBottom: '1px solid var(--apple-separator)',
        padding: '12px 20px'
      }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Newspaper size={24} style={{ color: 'var(--apple-blue)' }} />
            <h1 className="text-xl font-semibold" style={{ color: 'var(--apple-text)' }}>
              RSS Reader
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span style={{ color: 'var(--apple-text-secondary)', fontSize: '14px' }}>
              {user?.username || 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="apple-button-secondary flex items-center gap-2"
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden gap-3 p-3">
        {/* Sidebar - Feed List */}
        <div className="w-72 apple-card overflow-hidden flex-shrink-0">
          <FeedList
            onSelectFeed={setSelectedFeedId}
            selectedFeedId={selectedFeedId}
          />
        </div>

        {/* Middle - Article List */}
        <div className="w-96 apple-card overflow-hidden flex-shrink-0">
          <ArticleList
            feedId={selectedFeedId}
            onSelectArticle={setSelectedArticle}
            selectedArticleId={selectedArticle?.id || null}
          />
        </div>

        {/* Right - Article Reader */}
        <div className="flex-1 apple-card overflow-hidden">
          <ArticleReader
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        </div>
      </div>
    </div>
  );
}
