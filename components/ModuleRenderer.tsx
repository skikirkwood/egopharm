'use client';

import { useState, useEffect } from 'react';
import { Module } from '@/types/contentful';
import Hero from './Hero';
import Infoblock from './Infoblock';
import ImageTriplex from './ImageTriplex';
import FeaturedNews from './FeaturedNews';

interface ModuleRendererProps {
  module: Module;
  audiences?: any[];
}

// Component mapping
const componentMap: Record<string, React.ComponentType<any>> = {
  hero: Hero,
  infoblock: Infoblock,
  imageTriplex: ImageTriplex,
  featuredNews: FeaturedNews,
  '6NbIn3MpiND4Hybq2U6NV8': FeaturedNews,
};

// Prop name mapping
const propNameMap: Record<string, string> = {
  hero: 'hero',
  infoblock: 'infoblock',
  imageTriplex: 'imageTriplex',
  featuredNews: 'featuredNews',
  '6NbIn3MpiND4Hybq2U6NV8': 'featuredNews',
};

// Check if personalization is enabled
const isPersonalizationEnabled = Boolean(process.env.NEXT_PUBLIC_NINETAILED_API_KEY);

// Simple audience evaluation
function evaluateAudience(audienceId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  // Get or initialize session data
  const sessionKey = 'nt_session_count';
  let sessionCount = parseInt(localStorage.getItem(sessionKey) || '0', 10);
  
  // Increment on first load (check if already incremented this session)
  const incrementedKey = 'nt_session_incremented';
  if (!sessionStorage.getItem(incrementedKey)) {
    sessionCount += 1;
    localStorage.setItem(sessionKey, sessionCount.toString());
    sessionStorage.setItem(incrementedKey, 'true');
  }

  // Evaluate based on audience ID
  switch (audienceId) {
    case 'first-time-visitors':
    case '1gzx0CkXGwAQ77hVz1xAxO':
      return sessionCount === 1;
    case 'returning-visitors':
    case '1xiuGtdSM2GJSQMPlJn3N5':
      return sessionCount > 1;
    default:
      return false;
  }
}

// Get the variant to show based on audience matching
function getPersonalizedVariant(module: any): any | null {
  const experiences = module.fields?.nt_experiences;
  if (!Array.isArray(experiences) || experiences.length === 0) {
    return null;
  }

  for (const experience of experiences) {
    // Skip unresolved links
    if (!experience.fields) continue;
    
    const audienceLink = experience.fields?.nt_audience;
    const audienceId = audienceLink?.sys?.id || audienceLink?.fields?.nt_audience_id;
    
    if (audienceId && evaluateAudience(audienceId)) {
      // Get the first variant
      const variants = experience.fields?.nt_variants;
      if (Array.isArray(variants) && variants.length > 0) {
        const variant = variants[0];
        // Return the variant if it has fields (resolved)
        if (variant.fields) {
          return variant;
        }
      }
    }
  }

  return null;
}

export default function ModuleRenderer({ module, audiences = [] }: ModuleRendererProps) {
  const [mounted, setMounted] = useState(false);
  const [variant, setVariant] = useState<any>(null);
  
  useEffect(() => {
    setMounted(true);
    
    if (isPersonalizationEnabled) {
      const personalizedVariant = getPersonalizedVariant(module);
      if (personalizedVariant) {
        setVariant(personalizedVariant);
        if (process.env.NODE_ENV === 'development') {
          console.log('Personalization: Showing variant', personalizedVariant.sys?.id);
        }
      }
    }
  }, [module]);

  const contentTypeId = module.sys.contentType?.sys?.id as string;

  if (!contentTypeId) {
    console.warn('Module has no content type ID:', module);
    return null;
  }

  const Component = componentMap[contentTypeId];
  const propName = propNameMap[contentTypeId];

  if (!Component || !propName) {
    console.warn(`Unknown content type: ${contentTypeId}`);
    return null;
  }

  // Use variant if available and mounted, otherwise use baseline
  const moduleToRender = (mounted && variant) ? variant : module;
  const props = { [propName]: moduleToRender };
  
  return <Component {...props} />;
}
