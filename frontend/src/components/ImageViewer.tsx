'use client';

import { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface ImageViewerProps {
  images: Array<{ src: string; alt?: string; caption?: string }>;
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function ImageViewer({ images, currentIndex, onClose, onNavigate }: ImageViewerProps) {
  const currentImage = images[currentIndex];

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  }, [currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
    }
  }, [currentIndex, images.length, onNavigate]);

  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = currentImage.src;
    link.download = currentImage.alt || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [currentImage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handlePrevious, handleNext]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(20px)',
      }}
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-3 rounded-full transition-all z-10"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        }}
      >
        <X size={24} />
      </button>

      {/* Download Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDownload();
        }}
        className="absolute top-4 right-20 p-3 rounded-full transition-all z-10"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        }}
      >
        <Download size={24} />
      </button>

      {/* Previous Button */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
          className="absolute left-4 p-3 rounded-full transition-all z-10"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {/* Next Button */}
      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 p-3 rounded-full transition-all z-10"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <ChevronRight size={32} />
        </button>
      )}

      {/* Image Container */}
      <div
        className="flex flex-col items-center justify-center max-w-7xl max-h-screen p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <img
          src={currentImage.src}
          alt={currentImage.alt || ''}
          className="max-w-full max-h-[80vh] object-contain"
          style={{
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          }}
        />

        {/* Caption and Counter */}
        <div className="mt-6 text-center max-w-2xl">
          {/* Image Counter */}
          <div
            className="text-sm mb-2"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            {currentIndex + 1} / {images.length}
          </div>

          {/* Caption */}
          {(currentImage.caption || currentImage.alt) && (
            <div
              className="text-base"
              style={{ color: 'rgba(255, 255, 255, 0.9)' }}
            >
              {currentImage.caption || currentImage.alt}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto max-w-full px-4">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => onNavigate(index)}
                className="flex-shrink-0 transition-all"
                style={{
                  opacity: index === currentIndex ? 1 : 0.5,
                  transform: index === currentIndex ? 'scale(1.1)' : 'scale(1)',
                  border: index === currentIndex ? '2px solid white' : '2px solid transparent',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt || ''}
                  className="w-16 h-16 object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
