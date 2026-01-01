import React from 'react';
import '@/styles/globals.css';
import { AppProps } from 'next/app';
import { NinetailedProvider } from '@ninetailed/experience.js-next';
import { NinetailedInsightsPlugin } from '@ninetailed/experience.js-plugin-insights';
import { ContentfulLivePreviewProvider } from '@contentful/live-preview/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NinetailedProvider
      clientId={process.env.NEXT_PUBLIC_NINETAILED_API_KEY ?? ''}
      environment={process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT ?? 'main'}
      plugins={[
        new NinetailedInsightsPlugin(),
      ]}
      componentViewTrackingThreshold={0}
    >
      <ContentfulLivePreviewProvider locale="en-US">
        <Component {...pageProps} />
      </ContentfulLivePreviewProvider>
    </NinetailedProvider>
  );
}

