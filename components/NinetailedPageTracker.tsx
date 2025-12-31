'use client';

import { useEffect, useState } from 'react';

/**
 * Component that tracks page views for Ninetailed personalization
 * This should be placed in the page layout to ensure page events are sent on route changes
 */
export default function NinetailedPageTracker() {
  const [mounted, setMounted] = useState(false);

  // Only run on client after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Only track if Ninetailed API key is configured
    if (!process.env.NEXT_PUBLIC_NINETAILED_API_KEY) return;

    // Dynamically import to avoid SSR issues
    const trackPage = async () => {
      try {
        const { useNinetailed } = await import('@ninetailed/experience.js-react');
        // Note: We can't use hooks dynamically, so we'll use the global instance
        const nt = (window as any).__ninetailed__;
        if (nt && typeof nt.page === 'function') {
          nt.page();
          if (process.env.NODE_ENV === 'development') {
            console.log('Ninetailed page tracked via global instance');
          }
        }
      } catch (error) {
        console.error('Error tracking page:', error);
      }
    };

    trackPage();
  }, [mounted]);

  return null;
}
