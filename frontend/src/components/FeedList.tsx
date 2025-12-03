'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { feedsApi } from '@/lib/api';
import type { Feed } from '@/types';
import { BookMarked, Plus, X, RefreshCw, Trash2, Inbox, Rss } from 'lucide-react';

interface FeedListProps {
  onSelectFeed: (feedId: number | null) => void;
  selectedFeedId: number | null;
}

export default function FeedList({ onSelectFeed, selectedFeedId }: FeedListProps) {
  const { data: feeds, error, mutate } = useSWR('feeds', feedsApi.getAll);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFeed, setNewFeed] = useState({ title: '', url: '', category: '' });
  const [loading, setLoading] = useState(false);

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await feedsApi.create(newFeed);
      setNewFeed({ title: '', url: '', category: '' });
      setShowAddForm(false);
      mutate();
    } catch (err) {
      console.error('Failed to add feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeed = async (id: number) => {
    if (!confirm('Are you sure you want to delete this feed?')) return;
    try {
      await feedsApi.delete(id);
      mutate();
      if (selectedFeedId === id) {
        onSelectFeed(null);
      }
    } catch (err) {
      console.error('Failed to delete feed:', err);
    }
  };

  const handleRefreshFeed = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await feedsApi.refresh(id);
      mutate();
    } catch (err) {
      console.error('Failed to refresh feed:', err);
    }
  };

  if (error) return (
    <div className="p-4" style={{ color: '#FF3B30' }}>
      Failed to load feeds
    </div>
  );

  if (!feeds) return (
    <div className="p-4" style={{ color: 'var(--apple-text-tertiary)' }}>
      Loading feeds...
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4" style={{ borderBottom: '1px solid var(--apple-separator)' }}>
        <div className="flex items-center gap-2 mb-3">
          <BookMarked size={20} style={{ color: 'var(--apple-blue)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--apple-text)' }}>
            Feeds
          </h2>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={showAddForm ? 'apple-button-secondary w-full flex items-center justify-center gap-2' : 'apple-button w-full flex items-center justify-center gap-2'}
          style={{ fontSize: '14px', padding: '10px' }}
        >
          {showAddForm ? (
            <>
              <X size={16} />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus size={16} />
              <span>Add Feed</span>
            </>
          )}
        </button>
      </div>

      {/* Add Feed Form */}
      {showAddForm && (
        <div className="p-4" style={{
          borderBottom: '1px solid var(--apple-separator)',
          background: 'var(--apple-gray)'
        }}>
          <form onSubmit={handleAddFeed} className="space-y-3">
            <input
              type="text"
              placeholder="Feed Title"
              value={newFeed.title}
              onChange={(e) => setNewFeed({ ...newFeed, title: e.target.value })}
              className="apple-input"
              style={{ fontSize: '14px', padding: '10px 12px' }}
              required
            />
            <input
              type="url"
              placeholder="Feed URL"
              value={newFeed.url}
              onChange={(e) => setNewFeed({ ...newFeed, url: e.target.value })}
              className="apple-input"
              style={{ fontSize: '14px', padding: '10px 12px' }}
              required
            />
            <input
              type="text"
              placeholder="Category (optional)"
              value={newFeed.category}
              onChange={(e) => setNewFeed({ ...newFeed, category: e.target.value })}
              className="apple-input"
              style={{ fontSize: '14px', padding: '10px 12px' }}
            />
            <button
              type="submit"
              disabled={loading}
              className="apple-button w-full"
              style={{ fontSize: '14px', padding: '10px' }}
            >
              {loading ? 'Adding...' : 'Add Feed'}
            </button>
          </form>
        </div>
      )}

      {/* Feed List */}
      <div className="flex-1 overflow-y-auto">
        {/* All Articles */}
        <div
          onClick={() => onSelectFeed(null)}
          className="apple-list-item"
          style={{
            background: selectedFeedId === null ? 'rgba(0, 122, 255, 0.08)' : 'transparent',
            borderLeft: selectedFeedId === null ? '3px solid var(--apple-blue)' : '3px solid transparent'
          }}
        >
          <div className="flex items-center gap-3">
            <Rss size={18} style={{ color: 'var(--apple-blue)' }} />
            <div>
              <div className="font-medium" style={{ color: 'var(--apple-text)', fontSize: '15px' }}>
                All Articles
              </div>
            </div>
          </div>
        </div>

        {/* Individual Feeds */}
        {feeds.map((feed: Feed) => (
          <div
            key={feed.id}
            onClick={() => onSelectFeed(feed.id)}
            className="apple-list-item group"
            style={{
              background: selectedFeedId === feed.id ? 'rgba(0, 122, 255, 0.08)' : 'transparent',
              borderLeft: selectedFeedId === feed.id ? '3px solid var(--apple-blue)' : '3px solid transparent'
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate" style={{ color: 'var(--apple-text)', fontSize: '15px' }}>
                  {feed.title}
                </div>
                {feed.category && (
                  <div className="text-xs mt-1 inline-block px-2 py-0.5 rounded-full"
                       style={{
                         background: 'var(--apple-gray-2)',
                         color: 'var(--apple-text-tertiary)'
                       }}>
                    {feed.category}
                  </div>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleRefreshFeed(feed.id, e)}
                  className="p-1.5 hover:bg-gray-200"
                  style={{ borderRadius: '8px' }}
                  title="Refresh"
                >
                  <RefreshCw size={14} style={{ color: 'var(--apple-blue)' }} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFeed(feed.id);
                  }}
                  className="p-1.5 hover:bg-red-100"
                  style={{ borderRadius: '8px' }}
                  title="Delete"
                >
                  <Trash2 size={14} style={{ color: '#FF3B30' }} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {feeds.length === 0 && (
          <div className="p-8 text-center" style={{ color: 'var(--apple-text-tertiary)' }}>
            <Inbox size={48} className="mx-auto mb-3" style={{ color: 'var(--apple-text-tertiary)' }} />
            <div style={{ fontSize: '14px' }}>No feeds yet</div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>Click "Add Feed" to get started</div>
          </div>
        )}
      </div>
    </div>
  );
}
