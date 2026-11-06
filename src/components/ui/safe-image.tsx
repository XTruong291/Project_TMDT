"use client";

import { useState } from "react";

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export const DEFAULT_FALLBACK_IMAGE = "/sites/raycon/images/earbuds-lifestyle.png";

export function SafeImage({
  src,
  alt = "",
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  className,
  ...props
}: SafeImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const srcString = typeof src === "string" ? src : undefined;
  const displaySrc =
    failedSrc && failedSrc === srcString ? fallbackSrc : srcString || fallbackSrc;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={displaySrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => {
        if (srcString) {
          setFailedSrc(srcString);
        }
      }}
      className={className}
      {...props}
    />
  );
}
