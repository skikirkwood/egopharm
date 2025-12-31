'use client';

import { Module } from '@/types/contentful';
import Hero from './Hero';
import Infoblock from './Infoblock';
import ImageTriplex from './ImageTriplex';
import FeaturedNews from './FeaturedNews';

interface ModuleRendererProps {
  module: Module;
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

export default function ModuleRenderer({ module }: ModuleRendererProps) {
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
    (module.fields as any).nt_experiences?.length > 0
  );

  // If personalization is not enabled or no experiences, render the baseline component directly
  if (!isPersonalizationEnabled || !hasExperiences) {
    const props = { [propName]: module };
    return <Component {...props} />;
  }

  // Render with personalization - dynamically import to avoid context errors
  return <PersonalizedModule module={module} Component={Component} propName={propName} />;
}

// Separate component for personalized content to handle the Experience import
function PersonalizedModule({ 
  module, 
  Component, 
  propName 
}: { 
  module: Module; 
  Component: React.ComponentType<any>; 
  propName: string;
}) {
  // Use React SDK instead of Next.js SDK
  const { Experience } = require('@ninetailed/experience.js-react');
  const { ExperienceMapper } = require('@ninetailed/experience.js-utils-contentful');

  // Map experiences for personalization using the Ninetailed utility
  const mappedExperiences = ExperienceMapper.mapBaselineWithExperiences(module as any);

  // Render with Experience wrapper for personalization
  return (
    <Experience
      id={module.sys.id}
      component={Component}
      experiences={mappedExperiences}
      {...{ [propName]: module }}
    />
  );
}
