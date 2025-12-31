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

// Manually build experience configuration from Contentful data
function buildExperienceConfig(module: any, experience: any): any {
  const baselineId = module.sys.id;
  const expFields = experience.fields;
  
  // Get audience info
  const audience = expFields.nt_audience?.fields ? {
    id: expFields.nt_audience.fields.nt_audience_id || expFields.nt_audience.sys.id,
    name: expFields.nt_audience.fields.nt_name,
  } : {
    id: expFields.nt_audience?.sys?.id,
  };

  // Get variants with their full data
  const variants = (expFields.nt_variants || [])
    .filter((v: any) => v?.fields)
    .map((v: any) => ({
      id: v.sys.id,
      ...v.fields,
    }));

  // Build the experience configuration that the SDK expects
  return {
    id: expFields.nt_experience_id || experience.sys.id,
    name: expFields.nt_name,
    type: expFields.nt_type || 'nt_personalization',
    audience,
    trafficAllocation: expFields.nt_config?.traffic ?? 1,
    distribution: expFields.nt_config?.distribution || [1],
    sticky: false,
    components: [
      {
        type: 'EntryReplacement',
        baseline: {
          id: baselineId,
        },
        variants: variants,
      },
    ],
  };
}

export default function ModuleRenderer({ module }: ModuleRendererProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const contentTypeId = module.sys.contentType?.sys?.id as string;

  if (!contentTypeId) {
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

  // During SSR, render baseline
  if (!mounted) {
    return renderBaseline();
  }

  // Build experience configurations manually
  const mappedExperiences = experiences
    .filter((exp: any) => exp?.fields)
    .map((exp: any) => buildExperienceConfig(module, exp))
    .filter((exp: any) => exp.components[0].variants.length > 0);

  console.log('Built experience config:', mappedExperiences);

  if (mappedExperiences.length === 0) {
    return renderBaseline();
  }

  // Use Ninetailed Experience component
  return (
    <Experience
      id={module.sys.id}
      component={(props: any) => {
        console.log('Experience rendering variant:', props.title || props.id);
        const componentProps = { [propName]: { sys: module.sys, fields: props } };
        return <Component {...componentProps} />;
      }}
      loadingComponent={() => renderBaseline()}
      experiences={mappedExperiences}
      {...module.fields}
    />
  );
}
