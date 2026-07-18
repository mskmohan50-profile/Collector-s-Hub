import { useState, type ImgHTMLAttributes } from 'react';
import { ImageOff } from 'lucide-react';

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackLabel?: string;
}
export function SafeImage({ src, alt, fallbackLabel, className, ...rest }: SafeImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 ${className ?? ''}`}
        aria-label={alt}
      >
        <ImageOff className="h-8 w-8" strokeWidth={1.5} />
        {fallbackLabel && <span className="mt-1 text-xs">{fallbackLabel}</span>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className={className}
      {...rest}
    />
  );
}
