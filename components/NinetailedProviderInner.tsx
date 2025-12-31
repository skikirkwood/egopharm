'use client';

import { ReactNode, useEffect } from 'react';
import { NinetailedProvider } from '@ninetailed/experience.js-react';
import { NinetailedInsightsPlugin } from '@ninetailed/experience.js-plugin-insights';

interface NinetailedProviderInnerProps {
  children: ReactNode;
}

export default function NinetailedProviderInner({ children }: NinetailedProviderInnerProps) {
  const apiKey = process.env.NEXT_PUBLIC_NINETAILED_API_KEY!;
  const environment = process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT || 'main';

  // Debug logging
  useEffect(() => {
    console.log('Ninetailed Provider initialized:', {
      apiKey: apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT SET',
      environment,
    });
  }, [apiKey, environment]);

  return (
    <NinetailedProvider
      clientId={apiKey}
      environment={environment}
      plugins={[
        new NinetailedInsightsPlugin(),
      ]}
      requestTimeout={10000}
      onLog={(...args: any[]) => {
        console.log('[Ninetailed]', ...args);
      }}
      onError={(error: any) => {
        console.error('[Ninetailed Error]', error);
      }}
    >
      {children}
    </NinetailedProvider>
  );
}
