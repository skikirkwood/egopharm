'use client';

import { useState, useEffect } from 'react';
import { Module } from '@/types/contentful';
import { NinetailedAudience } from '@/lib/ninetailed';
import Hero from './Hero';
import Infoblock from './Infoblock';
import ImageTriplex from './ImageTriplex';
import FeaturedNews from './FeaturedNews';

interface ModuleRendererProps {
  module: Module;
  audiences?: NinetailedAudience[];
}

// Component mapping for personalization
const componentMap: Record<string, React.ComponentType<any>> = {
  hero: Hero,
  infoblock: Infoblock,
  imageTriplex: ImageTriplex,
  featuredNews: FeaturedNews,
  '6NbIn3MpiND4Hybq2U6NV8': FeaturedNews, // Contentful system ID for Featured News
};

// Prop name mapping for each component type
const propNameMap: Record<string, string> = {
  hero: 'hero',
  infoblock: 'infoblock',
  imageTriplex: 'imageTriplex',
  featuredNews: 'featuredNews',
  '6NbIn3MpiND4Hybq2U6NV8': 'featuredNews',
};

// Check if personalization is enabled
const isPersonalizationEnabled = Boolean(process.env.NEXT_PUBLIC_NINETAILED_API_KEY);

export default function ModuleRenderer({ module, audiences = [] }: ModuleRendererProps) {
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

  // Check if the module has experiences attached
  const hasExperiences = Boolean(
    module.fields && 
    'nt_experiences' in module.fields && 
    Array.isArray((module.fields as any).nt_experiences) &&
    (module.fields as any).nt_experiences.length > 0
  );

  // Render baseline during SSR or if no personalization
  if (!mounted || !isPersonalizationEnabled || !hasExperiences) {
    const props = { [propName]: module };
    return <Component {...props} />;
  }

  // Only use Experience component on client after mount
  return <PersonalizedModule module={module} Component={Component} propName={propName} />;
}

// Separate component that uses the Ninetailed context (only rendered on client)
function PersonalizedModule({ 
  module, 
  Component, 
  propName 
}: { 
  module: Module; 
  Component: React.ComponentType<any>; 
  propName: string;
}) {
  const { Experience } = require('@ninetailed/experience.js-react');
  const { ExperienceMapper } = require('@ninetailed/experience.js-utils-contentful');

  try {
    const mapped = ExperienceMapper.mapExperience(module as any) as any;
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Mapped experience for', propName, ':', mapped);
    }

    // Create the baseline component renderer
    const BaselineComponent = (props: any) => {
      const componentProps = { [propName]: props };
      return <Component {...componentProps} />;
    };

    return (
      <Experience
        {...mapped}
        component={BaselineComponent}
      />
    );
  } catch (error) {
    console.error('Error mapping experience:', error);
    // Fallback to baseline if mapping fails
    const props = { [propName]: module };
    return <Component {...props} />;
  }
}
