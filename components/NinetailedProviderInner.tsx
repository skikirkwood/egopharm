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

  return (
    <NinetailedProvider
      clientId={apiKey}
      environment={environment}
      plugins={[
        new NinetailedInsightsPlugin(),
      ]}
    >
      {children}
    </NinetailedProvider>
  );
}
