'use client';

import useSWR from 'swr';
import { articlesApi } from '@/lib/api';
import type { Article } from '@/types';
import { format } from 'date-fns';
import { FileText, Inbox, Star, Circle, CheckCircle2 } from 'lucide-react';

interface ArticleListProps {
  feedId: number | null;
  onSelectArticle: (article: Article) => void;
  selectedArticleId: number | null;
}

export default function ArticleList({ feedId, onSelectArticle, selectedArticleId }: ArticleListProps) {
  const { data: articles, error, mutate } = useSWR(
    ['articles', feedId],
    () => articlesApi.getAll(feedId ? { feed_id: feedId } : {})
  );

  const handleMarkRead = async (article: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await articlesApi.markRead(article.id, !article.is_read);
      mutate();
    } catch (err) {
      console.error('Failed to mark article:', err);
    }
  };

  const handleMarkStarred = async (article: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await articlesApi.markStarred(article.id, !article.is_starred);
      mutate();
    } catch (err) {
      console.error('Failed to star article:', err);
    }
  };

  if (error) return (
    <div className="p-4" style={{ color: '#FF3B30' }}>
      Failed to load articles
    </div>
  );

  if (!articles) return (
    <div className="p-4" style={{ color: 'var(--apple-text-tertiary)' }}>
      Loading articles...
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4" style={{ borderBottom: '1px solid var(--apple-separator)' }}>
        <div className="flex items-center gap-2 mb-2">
          <FileText size={20} style={{ color: 'var(--apple-blue)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--apple-text)' }}>
            Articles
          </h2>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span style={{ color: 'var(--apple-text-tertiary)', fontSize: '13px' }}>
            {articles.length} {articles.length === 1 ? 'article' : 'articles'}
          </span>
          {articles.filter((a: Article) => !a.is_read).length > 0 && (
            <>
              <span style={{ color: 'var(--apple-text-tertiary)', fontSize: '13px' }}>•</span>
              <span style={{ color: 'var(--apple-blue)', fontSize: '13px', fontWeight: 500 }}>
                {articles.filter((a: Article) => !a.is_read).length} unread
              </span>
            </>
          )}
        </div>
      </div>

      {/* Article List */}
      <div className="flex-1 overflow-y-auto">
        {articles.length === 0 ? (
          <div className="p-8 text-center" style={{ color: 'var(--apple-text-tertiary)' }}>
            <Inbox size={48} className="mx-auto mb-3" style={{ color: 'var(--apple-text-tertiary)' }} />
            <div style={{ fontSize: '14px' }}>No articles found</div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>
              Add a feed to start reading
            </div>
          </div>
        ) : (
          articles.map((article: Article) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="apple-list-item group"
              style={{
                background: selectedArticleId === article.id ? 'rgba(0, 122, 255, 0.08)' : 'transparent',
                borderLeft: selectedArticleId === article.id ? '3px solid var(--apple-blue)' : '3px solid transparent',
                opacity: article.is_read ? 0.6 : 1
              }}
            >
              <div className="flex flex-col gap-2">
                {/* Title and Actions */}
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className="flex-1 leading-snug"
                    style={{
                      color: 'var(--apple-text)',
                      fontSize: '15px',
                      fontWeight: article.is_read ? 400 : 600
                    }}
                  >
                    {article.title}
                  </h3>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={(e) => handleMarkStarred(article, e)}
                      className="p-1 rounded transition-all"
                      title={article.is_starred ? 'Unstar' : 'Star'}
                    >
                      <Star
                        size={16}
                        fill={article.is_starred ? '#FFD700' : 'none'}
                        style={{ color: article.is_starred ? '#FFD700' : 'var(--apple-text-tertiary)' }}
                      />
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-2 flex-wrap">
                  {article.author && (
                    <span style={{ color: 'var(--apple-text-secondary)', fontSize: '13px' }}>
                      {article.author}
                    </span>
                  )}
                  {article.published_at && (
                    <>
                      {article.author && (
                        <span style={{ color: 'var(--apple-text-tertiary)', fontSize: '13px' }}>•</span>
                      )}
                      <span style={{ color: 'var(--apple-text-tertiary)', fontSize: '13px' }}>
                        {format(new Date(article.published_at), 'MMM d, h:mm a')}
                      </span>
                    </>
                  )}
                  <button
                    onClick={(e) => handleMarkRead(article, e)}
                    className="ml-auto px-2 py-0.5 rounded-full text-xs font-medium transition-all"
                    style={{
                      background: article.is_read ? 'var(--apple-gray-2)' : 'rgba(0, 122, 255, 0.1)',
                      color: article.is_read ? 'var(--apple-text-tertiary)' : 'var(--apple-blue)'
                    }}
                  >
                    {article.is_read ? 'Read' : 'Unread'}
                  </button>
                </div>

                {/* Preview */}
                {article.content && (
                  <p
                    className="line-clamp-2 leading-relaxed"
                    style={{
                      color: 'var(--apple-text-secondary)',
                      fontSize: '14px'
                    }}
                  >
                    {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
