'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { articlesApi } from '@/lib/api';
import type { Article } from '@/types';
import { format } from 'date-fns';
import { BookOpen, ArrowLeft, ExternalLink, User, Calendar, FileText } from 'lucide-react';
import ImageViewer from './ImageViewer';

interface ArticleReaderProps {
  article: Article | null;
  onClose: () => void;
}

export default function ArticleReader({ article, onClose }: ArticleReaderProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<Array<{ src: string; alt?: string; caption?: string }>>([]);

  useEffect(() => {
    if (article && !article.is_read) {
      articlesApi.markRead(article.id, true).catch(console.error);
    }
  }, [article]);

  // Process content to handle callouts
  const processedContent = useMemo(() => {
    if (!article?.content) return '';

    let content = article.content;

    // Handle [!type] callouts
    const calloutRegex = /\[!(\w+)\]\s*([^\n]+)((?:\n(?!<p>|\[!)[^\n]*)*)/gi;
    content = content.replace(calloutRegex, (match, type, title, body) => {
      const typeMap: Record<string, string> = {
        'note': 'note',
        'info': 'info',
        'tip': 'tip',
        'success': 'success',
        'warning': 'warning',
        'danger': 'danger',
        'error': 'danger',
        'question': 'question',
        'quote': 'quote'
      };

      const calloutType = typeMap[type.toLowerCase()] || 'note';

      return `<div class="callout callout-${calloutType}">
        <div class="callout-title"><strong>${title.trim()}</strong></div>
        ${body ? `<div>${body.trim()}</div>` : ''}
      </div>`;
    });

    return content;
  }, [article?.content]);

  // Extract images and add click handlers
  useEffect(() => {
    if (!contentRef.current) return;

    const imgElements = contentRef.current.querySelectorAll('img');
    const imageList: Array<{ src: string; alt?: string; caption?: string }> = [];

    imgElements.forEach((img, index) => {
      const src = img.src;
      const alt = img.alt;

      // Get caption from figcaption if exists
      let caption = alt;
      const figure = img.closest('figure');
      if (figure) {
        const figcaption = figure.querySelector('figcaption');
        if (figcaption) {
          caption = figcaption.textContent || alt;
        }
      }

      imageList.push({ src, alt, caption });

      // Add click handler
      img.style.cursor = 'pointer';
      img.onclick = () => {
        setCurrentImageIndex(index);
        setImageViewerOpen(true);
      };
    });

    setImages(imageList);
  }, [processedContent]);

  if (!article) {
    return (
      <div className="h-full flex flex-col items-center justify-center" style={{ color: 'var(--apple-text-tertiary)' }}>
        <BookOpen size={64} className="mb-4" style={{ color: 'var(--apple-text-tertiary)' }} />
        <div style={{ fontSize: '16px', fontWeight: 500 }}>Select an article to read</div>
        <div style={{ fontSize: '14px', marginTop: '8px' }}>
          Choose from the list on the left
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--apple-separator)' }}>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 transition-colors flex items-center gap-1"
          style={{ color: 'var(--apple-blue)', borderRadius: '10px' }}
          title="Back to list"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-medium truncate" style={{ color: 'var(--apple-text-secondary)' }}>
            Reading
          </h2>
        </div>
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="apple-button-secondary flex items-center gap-2"
          style={{ fontSize: '14px', padding: '8px 16px', textDecoration: 'none' }}
        >
          <span>Open Original</span>
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <article className="max-w-3xl mx-auto p-8">
          {/* Title */}
          <h1
            className="text-3xl font-bold leading-tight mb-6"
            style={{ color: 'var(--apple-text)' }}
          >
            {article.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 mb-8 pb-6"
               style={{ borderBottom: '1px solid var(--apple-separator)' }}>
            {article.author && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                     style={{ background: 'var(--apple-gray-2)' }}>
                  <User size={16} style={{ color: 'var(--apple-text-tertiary)' }} />
                </div>
                <span style={{ color: 'var(--apple-text-secondary)', fontSize: '15px', fontWeight: 500 }}>
                  {article.author}
                </span>
              </div>
            )}
            {article.published_at && (
              <>
                {article.author && (
                  <span style={{ color: 'var(--apple-text-tertiary)' }}>•</span>
                )}
                <div className="flex items-center gap-2">
                  <Calendar size={16} style={{ color: 'var(--apple-text-tertiary)' }} />
                  <span style={{ color: 'var(--apple-text-tertiary)', fontSize: '15px' }}>
                    {format(new Date(article.published_at), 'MMMM d, yyyy')}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Article Content */}
          {processedContent ? (
            <div
              ref={contentRef}
              className="article-content"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          ) : (
            <div className="text-center py-12" style={{ color: 'var(--apple-text-tertiary)' }}>
              <FileText size={48} className="mx-auto mb-3" style={{ color: 'var(--apple-text-tertiary)' }} />
              <p style={{ fontSize: '15px' }}>No content available</p>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 apple-button"
                style={{ fontSize: '14px', padding: '10px 20px', textDecoration: 'none' }}
              >
                <span>Read on Original Site</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--apple-separator)' }}>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
              style={{ color: 'var(--apple-blue)' }}
            >
              <span>View original article</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </article>
      </div>

      {/* Image Viewer */}
      {imageViewerOpen && images.length > 0 && (
        <ImageViewer
          images={images}
          currentIndex={currentImageIndex}
          onClose={() => setImageViewerOpen(false)}
          onNavigate={setCurrentImageIndex}
        />
      )}
    </div>
  );
}
