'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Component that tracks page views for Ninetailed personalization
 * This should be placed in the page layout to ensure page events are sent on route changes
 * 
 * Note: This component only works when the Ninetailed API key is configured.
 * It gracefully handles cases where personalization is disabled.
 */
export default function NinetailedPageTracker() {
  const pathname = usePathname();
  const [ninetailed, setNinetailed] = useState<any>(null);

  // Dynamically import useNinetailed to handle cases where provider is not available
  useEffect(() => {
    const loadNinetailed = async () => {
      try {
        // Only try to use Ninetailed if the API key is configured
        if (process.env.NEXT_PUBLIC_NINETAILED_API_KEY) {
          const { useNinetailed } = await import('@ninetailed/experience.js-next');
          // This will throw if not inside a provider context
          setNinetailed({ available: true });
        }
      } catch (error) {
        // Ninetailed not available, personalization is disabled
        setNinetailed({ available: false });
      }
    };
    loadNinetailed();
  }, []);

  useEffect(() => {
    // Track page view on route change if Ninetailed is available
    if (ninetailed?.available && typeof window !== 'undefined') {
      // Use window.ninetailed if available (set by the SDK)
      const nt = (window as any).ninetailed;
      if (nt && typeof nt.page === 'function') {
        nt.page();
      }
    }
  }, [pathname, ninetailed]);

  return null;
}
