'use client';

import { ReactNode, useEffect } from 'react';
import { NinetailedProvider, useNinetailed } from '@ninetailed/experience.js-react';
import { NinetailedInsightsPlugin } from '@ninetailed/experience.js-plugin-insights';

interface NinetailedProviderInnerProps {
  children: ReactNode;
}

// Inner component to trigger page tracking after provider is ready
function PageTracker() {
  const ninetailed = useNinetailed();

  useEffect(() => {
    // Trigger page call to fetch/update profile
    ninetailed.page();
  }, [ninetailed]);

  return null;
}

export default function NinetailedProviderInner({ children }: NinetailedProviderInnerProps) {
  const apiKey = process.env.NEXT_PUBLIC_NINETAILED_API_KEY!;
  const environment = process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT || 'main';

  return (
    <NinetailedProvider
      clientId={apiKey}
      environment={environment}
      plugins={[
        new NinetailedInsightsPlugin(),
      ]}
      requestTimeout={10000}
    >
      <PageTracker />
      {children}
    </NinetailedProvider>
  );
}
