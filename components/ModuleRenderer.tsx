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

  // Helper to render baseline
  const renderBaseline = () => {
    const props = { [propName]: module };
    return <Component {...props} />;
  };

  // Check if module has experiences
  const moduleFields = module.fields as any;
  const experiences = moduleFields?.nt_experiences;
  const hasExperiences = Array.isArray(experiences) && experiences.length > 0;

  // If no experiences, render baseline directly
  if (!hasExperiences) {
    return renderBaseline();
  }

  // During SSR, render baseline - Experience component requires provider context
  if (!mounted) {
    return renderBaseline();
  }

  // Map experiences using the Ninetailed Contentful utility
  const mappedExperiences: any[] = [];
  
  for (const exp of experiences) {
    console.log('Processing experience:', {
      id: exp?.sys?.id,
      hasFields: !!exp?.fields,
      isValidEntry: false,
    });
    
    try {
      const isValid = ExperienceMapper.isExperienceEntry(exp);
      console.log('isExperienceEntry result:', isValid, exp);
      
      if (isValid) {
        const mapped = ExperienceMapper.mapExperience(exp);
        console.log('Mapped experience:', mapped);
        mappedExperiences.push(mapped);
      } else {
        console.warn('Experience entry failed validation:', exp);
      }
    } catch (error) {
      console.error('Error mapping experience:', error);
    }
  }
  
  console.log('Final mapped experiences:', mappedExperiences);

  // If no valid experiences after mapping, render baseline
  if (mappedExperiences.length === 0) {
    return renderBaseline();
  }

  // Use Ninetailed Experience component with loadingComponent to prevent flicker
  return (
    <Experience
      id={module.sys.id}
      component={(props: any) => {
        // The Experience component passes the variant's fields as props
        const componentProps = { [propName]: { sys: module.sys, fields: props } };
        return <Component {...componentProps} />;
      }}
      loadingComponent={() => renderBaseline()}
      experiences={mappedExperiences}
      {...module.fields}
    />
  );
}
