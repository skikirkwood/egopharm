'use client';

import { useState, useEffect } from 'react';
import { Module } from '@/types/contentful';
import Hero from './Hero';
import Infoblock from './Infoblock';
import ImageTriplex from './ImageTriplex';
import FeaturedNews from './FeaturedNews';
import { Experience } from '@ninetailed/experience.js-react';
import { ExperienceMapper } from '@ninetailed/experience.js-utils-contentful';

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

export default function ModuleRenderer({ module }: ModuleRendererProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('ModuleRenderer useEffect - setting mounted to true');
    setMounted(true);
  }, []);

  // Log every render
  console.log('ModuleRenderer RENDER:', {
    contentType: module.sys.contentType?.sys?.id,
    moduleId: module.sys.id,
    mounted,
  });

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

  // Helper to render baseline
  const renderBaseline = () => {
    const props = { [propName]: module };
    return <Component {...props} />;
  };

  // Check if module has experiences
  const moduleFields = module.fields as any;
  const experiences = moduleFields?.nt_experiences;
  const hasExperiences = Array.isArray(experiences) && experiences.length > 0;

  console.log('ModuleRenderer for', contentTypeId, ':', {
    hasExperiences,
    experiencesLength: experiences?.length,
    experiencesRaw: experiences,
    mounted,
  });

  // If no experiences, render baseline directly
  if (!hasExperiences) {
    console.log('No experiences found, rendering baseline');
    return renderBaseline();
  }

  // During SSR, render baseline - Experience component requires provider context
  if (!mounted) {
    console.log('Not mounted yet, rendering baseline');
    return renderBaseline();
  }

  // Use mapBaselineWithExperiences to properly create the experience configuration
  // This method takes the baseline entry (module) and returns mapped experiences
  try {
    const mappedExperiences = ExperienceMapper.mapBaselineWithExperiences(module as any);
    
    console.log('Mapped experiences from baseline:', mappedExperiences);

    if (!mappedExperiences || mappedExperiences.length === 0) {
      console.log('No valid mapped experiences, rendering baseline');
      return renderBaseline();
    }

    // Use Ninetailed Experience component
    return (
      <Experience
        id={module.sys.id}
        component={(props: any) => {
          console.log('Experience component rendering with props:', props);
          const componentProps = { [propName]: { sys: module.sys, fields: props } };
          return <Component {...componentProps} />;
        }}
        loadingComponent={() => {
          console.log('Experience loading component');
          return renderBaseline();
        }}
        experiences={mappedExperiences}
        {...module.fields}
      />
    );
  } catch (error) {
    console.error('Error mapping experiences:', error);
    return renderBaseline();
  }
}
