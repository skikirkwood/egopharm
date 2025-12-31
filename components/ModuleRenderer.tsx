'use client';

import { useState, useEffect } from 'react';
import { Module } from '@/types/contentful';
import Hero from './Hero';
import Infoblock from './Infoblock';
import ImageTriplex from './ImageTriplex';
import FeaturedNews from './FeaturedNews';
import { Experience } from '@ninetailed/experience.js-react';

interface ModuleRendererProps {
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

// Check if personalization is enabled
const isPersonalizationEnabled = Boolean(process.env.NEXT_PUBLIC_NINETAILED_API_KEY);

// Transform Contentful experience data to Ninetailed SDK format
function transformExperiences(module: any): any[] {
  const experiences = module.fields?.nt_experiences;
  if (!Array.isArray(experiences) || experiences.length === 0) {
    return [];
  }

  return experiences
    .filter((exp: any) => exp?.fields) // Only resolved experiences
    .map((exp: any) => {
      const audienceId = exp.fields?.nt_audience?.fields?.nt_audience_id || 
                         exp.fields?.nt_audience?.sys?.id;
      
      const variants = exp.fields?.nt_variants || [];
      
      return {
        id: exp.fields?.nt_experience_id || exp.sys?.id,
        name: exp.fields?.nt_name,
        type: exp.fields?.nt_type === 'nt_personalization' ? 'nt_personalization' : 'nt_experiment',
        config: exp.fields?.nt_config || { traffic: 1, distribution: [1] },
        audience: audienceId ? { id: audienceId } : undefined,
        variants: variants
          .filter((v: any) => v?.fields)
          .map((v: any) => ({
            id: v.sys?.id,
            ...v.fields,
          })),
      };
    })
    .filter((exp: any) => exp.variants.length > 0); // Only experiences with resolved variants
}

export default function ModuleRenderer({ module }: ModuleRendererProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Check if module has experiences
  const hasExperiences = Boolean(
    (module.fields as any)?.nt_experiences?.length > 0
  );

  // Render baseline during SSR or if no personalization
  if (!mounted || !isPersonalizationEnabled || !hasExperiences) {
    const props = { [propName]: module };
    return <Component {...props} />;
  }

  // Transform experiences for Ninetailed SDK
  const experiences = transformExperiences(module);

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Ninetailed experiences for', contentTypeId, ':', experiences);
  }

  // If no valid experiences after transformation, render baseline
  if (experiences.length === 0) {
    const props = { [propName]: module };
    return <Component {...props} />;
  }

  // Render with Ninetailed Experience component
  return (
    <Experience
      id={module.sys.id}
      component={(props: any) => {
        const componentProps = { [propName]: { sys: module.sys, fields: props } };
        return <Component {...componentProps} />;
      }}
      experiences={experiences}
      {...module.fields}
    />
  );
}
