'use client';

import { ContentfulLivePreviewProvider as Provider } from '@contentful/live-preview/react';

interface ContentfulLivePreviewProviderProps {
  children: React.ReactNode;
  isEnabled: boolean;
  locale?: string;
}

export default function ContentfulLivePreviewProvider({
  children,
  isEnabled,
  locale = 'en-US',
}: ContentfulLivePreviewProviderProps) {
  return (
    <Provider
      locale={locale}
      enableInspectorMode={isEnabled}
      enableLiveUpdates={isEnabled}
    >
      {children}
    </Provider>
  );
}

