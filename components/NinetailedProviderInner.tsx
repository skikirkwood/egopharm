'use client';

import { ReactNode, useEffect, useState } from 'react';
import { NinetailedProvider } from '@ninetailed/experience.js-react';
import { NinetailedInsightsPlugin } from '@ninetailed/experience.js-plugin-insights';

interface NinetailedProviderInnerProps {
  children: ReactNode;
}

// Get profile from edge-computed cookie
function getProfileFromCookie(): any | null {
  if (typeof document === 'undefined') return null;
  
  try {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('ninetailed_profile='));
    
    if (cookie) {
      const value = decodeURIComponent(cookie.split('=')[1]);
      return JSON.parse(value);
    }
  } catch (e) {
    console.warn('Failed to parse ninetailed_profile cookie:', e);
  }
  
  return null;
}

export default function NinetailedProviderInner({ children }: NinetailedProviderInnerProps) {
  const apiKey = process.env.NEXT_PUBLIC_NINETAILED_API_KEY!;
  const environment = process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT || 'main';
  const [edgeProfile, setEdgeProfile] = useState<any>(null);

  useEffect(() => {
    // Get the profile computed by edge middleware
    const profile = getProfileFromCookie();
    if (profile) {
      setEdgeProfile(profile);
      console.log('Ninetailed: Hydrated from edge profile:', profile);
    }
  }, []);

  return (
    <NinetailedProvider
      clientId={apiKey}
      environment={environment}
      plugins={[
        new NinetailedInsightsPlugin(),
      ]}
      requestTimeout={10000}
      onLog={(...args: any[]) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Ninetailed]', ...args);
        }
      }}
      onError={(error: any) => {
        console.error('[Ninetailed Error]', error);
      }}
    >
      {children}
    </NinetailedProvider>
  );
}
