'use client';

import { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

interface NinetailedProviderProps {
  children: ReactNode;
}

// Dynamically import the Ninetailed provider to avoid SSR issues
const NinetailedProviderInner = dynamic(
  () => import('./NinetailedProviderInner'),
  { ssr: false }
);

export default function NinetailedProvider({ children }: NinetailedProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial hydration, render children without personalization
  if (!mounted) {
    return <>{children}</>;
  }

  const apiKey = process.env.NEXT_PUBLIC_NINETAILED_API_KEY;

  if (!apiKey) {
    // When no API key is configured, render children without personalization
    return <>{children}</>;
  }

  return <NinetailedProviderInner>{children}</NinetailedProviderInner>;
}
