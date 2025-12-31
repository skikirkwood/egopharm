'use client';

import { useEffect, useState } from 'react';

/**
 * Component that tracks page views for Ninetailed personalization
 * This should be placed in the page layout to ensure page events are sent on route changes
 * 
 * Note: This component only works when the Ninetailed API key is configured.
 * It gracefully handles cases where personalization is disabled.
 */
export default function NinetailedPageTracker() {
  const [mounted, setMounted] = useState(false);

  // Only run on client after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Only track if Ninetailed is available and API key is configured
    if (!process.env.NEXT_PUBLIC_NINETAILED_API_KEY) return;

    // Use window.ninetailed if available (set by the SDK)
    const trackPage = () => {
      const nt = (window as any).ninetailed;
      if (nt && typeof nt.page === 'function') {
        nt.page();
      }
    };

    // Track initial page view
    trackPage();

    // Listen for route changes using popstate event
    const handleRouteChange = () => {
      trackPage();
    };

    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [mounted]);

  return null;
}
