import { useEffect, useState } from "react";

interface SiteImageProps {
  src: string | null | undefined;
  alt: string;
  fallbackInitial: string;
  className?: string;
  fallbackClassName?: string;
}

const MAX_RETRIES = 2;

export function SiteImage({
  src,
  alt,
  fallbackInitial,
  className,
  fallbackClassName,
}: SiteImageProps) {
  const [retryCount, setRetryCount] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setRetryCount(0);
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={
          fallbackClassName ??
          "w-full h-full flex items-center justify-center bg-secondary/10 text-secondary"
        }
      >
        <span className="font-serif italic text-2xl opacity-50">
          {fallbackInitial}
        </span>
      </div>
    );
  }

  const cacheBustedSrc =
    retryCount > 0 ? `${src}${src.includes("?") ? "&" : "?"}cb=${retryCount}` : src;

  return (
    <img
      src={cacheBustedSrc}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      className={className}
      onError={() => {
        if (retryCount < MAX_RETRIES) {
          setRetryCount((c) => c + 1);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
