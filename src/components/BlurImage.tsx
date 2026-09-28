import React, { useState } from 'react';

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatioClass?: string;
  priority?: boolean;
}

export const BlurImage: React.FC<BlurImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatioClass = '',
  priority = false,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-neutral-200/80 dark:bg-neutral-800/80 ${aspectRatioClass} ${containerClassName}`}
    >
      {/* Skeleton Shimmer Screen with Wave effect */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 overflow-hidden bg-neutral-200 dark:bg-neutral-800">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center opacity-30 text-neutral-400">
            <svg
              className="w-8 h-8 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Actual Image with Blur-Up Transition */}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setIsLoaded(true);
          setHasError(true);
        }}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${
          isLoaded && !hasError
            ? 'opacity-100 blur-0 scale-100'
            : 'opacity-0 blur-lg scale-105'
        } ${className}`}
        {...props}
      />

      {/* Fallback for Broken Images */}
      {hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-3 text-center bg-neutral-100 dark:bg-neutral-850 text-neutral-400">
          <svg
            className="w-6 h-6 mb-1 opacity-60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-[10px] tracking-wide uppercase font-medium">Image unavailable</span>
        </div>
      )}
    </div>
  );
};
