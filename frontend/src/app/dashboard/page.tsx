'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import FeedList from '@/components/FeedList';
import ArticleList from '@/components/ArticleList';
import ArticleReader from '@/components/ArticleReader';
import type { Article } from '@/types';
import { Newspaper, LogOut, Maximize2, Minimize2, BookMarked, FileText, Sun, Moon, Monitor, Menu, X, BookOpen } from 'lucide-react';
import { useTheme } from '@/lib/useTheme';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, logout, user, setHydrated } = useAuthStore();
  const [selectedFeedId, setSelectedFeedId] = useState<number | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [mounted, setMounted] = useState(false);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [showFeedList, setShowFeedList] = useState(false);
  const [showArticleList, setShowArticleList] = useState(false);
  const [mobileView, setMobileView] = useState<'feeds' | 'articles' | 'reader'>('feeds');
  const [mobileFeedDrawerOpen, setMobileFeedDrawerOpen] = useState(false);
  const [mobileArticleDrawerOpen, setMobileArticleDrawerOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('auto');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun size={16} />;
    if (theme === 'dark') return <Moon size={16} />;
    return <Monitor size={16} />;
  };

  const getThemeLabel = () => {
    if (theme === 'light') return 'Light';
    if (theme === 'dark') return 'Dark';
    return 'Auto';
  };

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
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileFeedDrawerOpen(true)}
              className="md:hidden apple-button-secondary flex items-center justify-center"
              style={{ padding: '8px', minWidth: '40px' }}
            >
              <Menu size={20} />
            </button>
            <Newspaper size={24} style={{ color: 'var(--apple-blue)' }} />
            <h1 className="text-xl font-semibold" style={{ color: 'var(--apple-text)' }}>
              RSS Reader
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={cycleTheme}
              className="apple-button-secondary flex items-center gap-2"
              style={{ padding: '8px 12px', fontSize: '14px' }}
              title={`Theme: ${getThemeLabel()}`}
            >
              {getThemeIcon()}
              <span className="hidden md:inline">{getThemeLabel()}</span>
            </button>
            <button
              onClick={() => setImmersiveMode(!immersiveMode)}
              className="hidden md:flex apple-button-secondary items-center gap-2"
              style={{ padding: '8px 16px', fontSize: '14px' }}
              title={immersiveMode ? 'Exit Immersive Mode' : 'Enter Immersive Mode'}
            >
              {immersiveMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              <span className="hidden md:inline">{immersiveMode ? 'Exit' : 'Focus'}</span>
            </button>
            <span style={{ color: 'var(--apple-text-secondary)', fontSize: '14px' }} className="hidden sm:inline">
              {user?.username || 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="apple-button-secondary flex items-center gap-2"
              style={{ padding: '8px 12px', fontSize: '14px' }}
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay md:hidden ${mobileFeedDrawerOpen || mobileArticleDrawerOpen ? 'active' : ''}`}
        onClick={() => {
          setMobileFeedDrawerOpen(false);
          setMobileArticleDrawerOpen(false);
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden gap-3 p-3 relative">
        {/* Mobile Feed Drawer */}
        <div className={`mobile-drawer md:hidden ${mobileFeedDrawerOpen ? 'active' : ''}`}>
          <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--apple-separator)' }}>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--apple-text)' }}>Feeds</h2>
            <button
              onClick={() => setMobileFeedDrawerOpen(false)}
              className="apple-button-secondary"
              style={{ padding: '8px', minWidth: '40px' }}
            >
              <X size={20} />
            </button>
          </div>
          <FeedList
            onSelectFeed={(feedId) => {
              setSelectedFeedId(feedId);
              setMobileFeedDrawerOpen(false);
              setMobileArticleDrawerOpen(true);
            }}
            selectedFeedId={selectedFeedId}
          />
        </div>

        {/* Mobile Article Drawer */}
        <div className={`mobile-drawer md:hidden ${mobileArticleDrawerOpen ? 'active' : ''}`}>
          <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--apple-separator)' }}>
            <button
              onClick={() => {
                setMobileArticleDrawerOpen(false);
                setMobileFeedDrawerOpen(true);
              }}
              className="apple-button-secondary flex items-center gap-2"
              style={{ padding: '8px 12px' }}
            >
              <BookMarked size={16} />
              <span>Feeds</span>
            </button>
            <button
              onClick={() => setMobileArticleDrawerOpen(false)}
              className="apple-button-secondary"
              style={{ padding: '8px', minWidth: '40px' }}
            >
              <X size={20} />
            </button>
          </div>
          <ArticleList
            feedId={selectedFeedId}
            onSelectArticle={(article) => {
              setSelectedArticle(article);
              setMobileArticleDrawerOpen(false);
            }}
            selectedArticleId={selectedArticle?.id || null}
          />
        </div>

        {/* Desktop Sidebar - Feed List */}
        <div
          className="hidden md:block apple-card overflow-hidden flex-shrink-0 transition-all duration-300 ease-in-out"
          style={{
            width: immersiveMode ? (showFeedList ? '288px' : '0px') : '288px',
            opacity: immersiveMode ? (showFeedList ? 1 : 0) : 1,
            transform: immersiveMode ? (showFeedList ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
            position: immersiveMode ? 'absolute' : 'relative',
            left: immersiveMode ? '12px' : 'auto',
            top: immersiveMode ? '12px' : 'auto',
            bottom: immersiveMode ? '12px' : 'auto',
            zIndex: immersiveMode ? 20 : 'auto',
            pointerEvents: immersiveMode && !showFeedList ? 'none' : 'auto',
          }}
          onMouseEnter={() => immersiveMode && setShowFeedList(true)}
          onMouseLeave={() => immersiveMode && setShowFeedList(false)}
        >
          <FeedList
            onSelectFeed={setSelectedFeedId}
            selectedFeedId={selectedFeedId}
          />
        </div>

        {/* Desktop Middle - Article List */}
        <div
          className="hidden md:block apple-card overflow-hidden flex-shrink-0 transition-all duration-300 ease-in-out"
          style={{
            width: immersiveMode ? (showArticleList ? '384px' : '0px') : '384px',
            opacity: immersiveMode ? (showArticleList ? 1 : 0) : 1,
            transform: immersiveMode ? (showArticleList ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
            position: immersiveMode ? 'absolute' : 'relative',
            left: immersiveMode ? '12px' : 'auto',
            top: immersiveMode ? '12px' : 'auto',
            bottom: immersiveMode ? '12px' : 'auto',
            zIndex: immersiveMode ? 19 : 'auto',
            pointerEvents: immersiveMode && !showArticleList ? 'none' : 'auto',
          }}
          onMouseEnter={() => immersiveMode && setShowArticleList(true)}
          onMouseLeave={() => immersiveMode && setShowArticleList(false)}
        >
          <ArticleList
            feedId={selectedFeedId}
            onSelectArticle={setSelectedArticle}
            selectedArticleId={selectedArticle?.id || null}
          />
        </div>

        {/* Floating Buttons in Immersive Mode */}
        {immersiveMode && (
          <>
            {/* Feed List Toggle */}
            <button
              onClick={() => setShowFeedList(!showFeedList)}
              onMouseEnter={() => setShowFeedList(true)}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all z-30 apple-card"
              style={{
                opacity: showFeedList ? 0 : 0.7,
                transform: showFeedList ? 'translateX(-100px)' : 'translateY(-50%)',
                pointerEvents: showFeedList ? 'none' : 'auto',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              onMouseOut={(e) => {
                if (!showFeedList) e.currentTarget.style.opacity = '0.7';
              }}
            >
              <BookMarked size={20} style={{ color: 'var(--apple-blue)' }} />
            </button>

            {/* Article List Toggle */}
            <button
              onClick={() => setShowArticleList(!showArticleList)}
              onMouseEnter={() => setShowArticleList(true)}
              className="absolute left-20 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all z-30 apple-card"
              style={{
                opacity: showArticleList ? 0 : 0.7,
                transform: showArticleList ? 'translateX(-100px)' : 'translateY(-50%)',
                pointerEvents: showArticleList ? 'none' : 'auto',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              onMouseOut={(e) => {
                if (!showArticleList) e.currentTarget.style.opacity = '0.7';
              }}
            >
              <FileText size={20} style={{ color: 'var(--apple-blue)' }} />
            </button>
          </>
        )}

        {/* Right - Article Reader */}
        <div
          className="flex-1 apple-card overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            marginLeft: immersiveMode ? '0' : '0',
          }}
        >
          <ArticleReader
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden apple-card" style={{
        borderRadius: 0,
        borderTop: '1px solid var(--apple-separator)',
        padding: '8px 0'
      }}>
        <div className="flex justify-around items-center">
          <button
            onClick={() => setMobileFeedDrawerOpen(true)}
            className="flex flex-col items-center gap-1 px-4 py-2"
            style={{ color: 'var(--apple-blue)' }}
          >
            <BookMarked size={24} />
            <span style={{ fontSize: '11px', fontWeight: 500 }}>Feeds</span>
          </button>
          <button
            onClick={() => setMobileArticleDrawerOpen(true)}
            className="flex flex-col items-center gap-1 px-4 py-2"
            style={{ color: 'var(--apple-blue)' }}
          >
            <FileText size={24} />
            <span style={{ fontSize: '11px', fontWeight: 500 }}>Articles</span>
          </button>
          {selectedArticle && (
            <button
              onClick={() => {
                setMobileFeedDrawerOpen(false);
                setMobileArticleDrawerOpen(false);
              }}
              className="flex flex-col items-center gap-1 px-4 py-2"
              style={{ color: 'var(--apple-blue)' }}
            >
              <BookOpen size={24} />
              <span style={{ fontSize: '11px', fontWeight: 500 }}>Reading</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
