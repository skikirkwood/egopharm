'use client';

import { ReactNode } from 'react';
import { NinetailedProvider as Provider } from '@ninetailed/experience.js-next';
import { NinetailedInsightsPlugin } from '@ninetailed/experience.js-plugin-insights';

interface NinetailedProviderProps {
  children: ReactNode;
}

export default function NinetailedProvider({ children }: NinetailedProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_NINETAILED_API_KEY;
  const environment = process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT || 'main';

  if (!apiKey) {
    // When no API key is configured, render children without personalization
    // This allows the app to work without personalization features
    console.warn('Ninetailed API key not configured. Personalization will be disabled.');
    return <>{children}</>;
  }

  return (
    <Provider
      clientId={apiKey}
      environment={environment}
      plugins={[
        new NinetailedInsightsPlugin(),
      ]}
    >
      {children}
    </Provider>
  );
}
