'use client';

import { useEffect } from 'react';
import { useNinetailed } from '@ninetailed/experience.js-react';

/**
 * Component that tracks page views for Ninetailed personalization
 * This triggers the initial profile fetch and tracks page events
 */
export default function NinetailedPageTracker() {
  const ninetailed = useNinetailed();

  useEffect(() => {
    // Track initial page view - this also triggers profile fetch
    console.log('NinetailedPageTracker: Calling page()');
    ninetailed.page();
  }, [ninetailed]);

  return null;
}
