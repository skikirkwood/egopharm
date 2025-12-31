'use client';

import { useState, useEffect } from 'react';
import { Module } from '@/types/contentful';
import { useProfile } from '@ninetailed/experience.js-react';
import Hero from './Hero';
import Infoblock from './Infoblock';
import ImageTriplex from './ImageTriplex';
import FeaturedNews from './FeaturedNews';

interface PersonalizedModuleProps {
  module: Module;
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

export default function PersonalizedModule({ module }: PersonalizedModuleProps) {
  const { loading, status, profile, error } = useProfile();
  const [retryCount, setRetryCount] = useState(0);

  const contentTypeId = module.sys.contentType?.sys?.id as string;
  const Component = componentMap[contentTypeId];
  const propName = propNameMap[contentTypeId];

  // Helper to render baseline
  const renderBaseline = () => {
    const props = { [propName]: module };
    return <Component {...props} />;
  };

  // Debug logging
  console.log('PersonalizedModule - Profile state:', { loading, status, profile, error, retryCount });

  // Force re-render after a delay if still loading (to catch late profile updates)
  useEffect(() => {
    if (loading && retryCount < 10) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, retryCount]);

  // Render baseline while loading
  if (loading || status !== 'success' || !profile) {
    return renderBaseline();
  }

  // Check if module has experiences
  const moduleFields = module.fields as any;
  const experiences = moduleFields?.nt_experiences;
  
  if (!Array.isArray(experiences) || experiences.length === 0) {
    return renderBaseline();
  }

  console.log('Profile audiences:', profile.audiences);
  console.log('Module experiences:', experiences);

  // Find matching experience based on profile audiences
  let variantToRender: any = null;
  const profileAudiences = profile.audiences || [];

  for (const exp of experiences) {
    if (!exp?.fields) continue;

    // Get the audience ID for this experience
    const audienceId = exp.fields.nt_audience?.fields?.nt_audience_id || 
                       exp.fields.nt_audience?.sys?.id;

    console.log('Checking audience:', audienceId, 'against profile audiences:', profileAudiences);

    if (!audienceId) continue;

    // Check if user is in this audience
    const isInAudience = profileAudiences.includes(audienceId);

    if (isInAudience && exp.fields.nt_variants?.length > 0) {
      // User matches this audience - get the first variant
      const variant = exp.fields.nt_variants[0];
      if (variant?.fields) {
        console.log('Found matching variant:', variant.fields?.title);
        variantToRender = {
          sys: variant.sys,
          fields: variant.fields,
        };
        break;
      }
    }
  }

  // Render variant if found, otherwise baseline
  if (variantToRender) {
    const props = { [propName]: variantToRender };
    return <Component {...props} />;
  }

  return renderBaseline();
}

