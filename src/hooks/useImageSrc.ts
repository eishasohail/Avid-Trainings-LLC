"use client";

import { useState, useEffect } from 'react';
import { getImageUrl } from '@/lib/utils/imageStorage';

/**
 * Hook to resolve image source. Handles IndexedDB keys (starting with img-),
 * regular URLs, and base64 strings. Manages object URL lifecycle.
 */
export function useImageSrc(value: string | undefined): string | undefined {
  const [src, setSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    let currentObjectUrl = '';
    let isMounted = true;

    async function resolveSrc() {
      if (!value) {
        if (isMounted) setSrc(undefined);
        return;
      }

      if (value.startsWith('img-')) {
        try {
          const url = await getImageUrl(value);
          if (isMounted) {
            currentObjectUrl = url;
            setSrc(url);
          }
        } catch (error) {
          console.error('Failed to resolve IndexedDB image:', error);
          if (isMounted) setSrc(undefined);
        }
      } else {
        // Regular URL or base64
        if (isMounted) setSrc(value);
      }
    }

    resolveSrc();

    return () => {
      isMounted = false;
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [value]);

  return src;
}
