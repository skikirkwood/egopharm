'use client';

import { ReactNode } from 'react';
import { NinetailedProvider } from '@ninetailed/experience.js-next';
import { NinetailedInsightsPlugin } from '@ninetailed/experience.js-plugin-insights';

interface NinetailedProviderInnerProps {
  children: ReactNode;
}

export default function NinetailedProviderInner({ children }: NinetailedProviderInnerProps) {
  const clientId = process.env.NEXT_PUBLIC_NINETAILED_API_KEY ?? '';
  const environment = process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT ?? 'main';

  return (
    <NinetailedProvider
      clientId={clientId}
      environment={environment}
      plugins={[
        new NinetailedInsightsPlugin(),
      ]}
      componentViewTrackingThreshold={0}
    >
      {children}
    </NinetailedProvider>
  );
}
