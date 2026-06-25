"use client";

import { createPortal } from 'react-dom';

interface ImagePreloaderProps {
  imageUrls: string[];
}

export function ImagePreloader({ imageUrls }: ImagePreloaderProps) {
  if (typeof window === 'undefined') {
    return null;
  }

  return createPortal(
    imageUrls.map((url) => (
      <link key={url} rel="preload" as="image" href={url} />
    )),
    document.head,
  );
}
