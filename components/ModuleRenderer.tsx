'use client';

import { useEffect, useState } from 'react';
import { Module } from '@/types/contentful';
import Hero from './Hero';
import Infoblock from './Infoblock';
import ImageTriplex from './ImageTriplex';
import FeaturedNews from './FeaturedNews';

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

// Get selected variant from edge-computed experiences
function getSelectedVariant(module: any, experiences: any[]): any | null {
  const moduleFields = module.fields as any;
  const moduleExperiences = moduleFields?.nt_experiences;
  
  if (!Array.isArray(moduleExperiences) || moduleExperiences.length === 0) {
    console.log('[ModuleRenderer] No module experiences');
    return null;
  }

  console.log('[ModuleRenderer] Checking', moduleExperiences.length, 'module experiences against', experiences.length, 'edge experiences');

  // Find matching experience from edge-computed results
  for (const exp of moduleExperiences) {
    if (!exp?.fields) {
      console.log('[ModuleRenderer] Experience missing fields');
      continue;
    }
    
    const experienceId = exp.fields.nt_experience_id || exp.sys.id;
    console.log('[ModuleRenderer] Looking for experience:', experienceId);
    
    const edgeExp = experiences.find((e: any) => e.experienceId === experienceId);
    
    if (edgeExp) {
      console.log('[ModuleRenderer] Found edge experience:', edgeExp);
      if (edgeExp.variantIndex > 0) {
        // variantIndex > 0 means a variant was selected (0 = baseline)
        const variants = exp.fields.nt_variants || [];
        console.log('[ModuleRenderer] variantIndex:', edgeExp.variantIndex, 'variants:', variants.length);
        const selectedVariant = variants[edgeExp.variantIndex - 1];
        
        if (selectedVariant?.fields) {
          console.log('[ModuleRenderer] Selected variant:', selectedVariant.fields.title);
          return selectedVariant;
        }
      } else {
        console.log('[ModuleRenderer] variantIndex is 0, showing baseline');
      }
    } else {
      console.log('[ModuleRenderer] No matching edge experience for:', experienceId);
    }
  }

  return null;
}

// Parse experiences cookie
function getExperiencesFromCookie(): any[] {
  if (typeof document === 'undefined') return [];
  
  try {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('ninetailed_experiences='));
    
    if (cookie) {
      const value = decodeURIComponent(cookie.split('=')[1]);
      const parsed = JSON.parse(value) || [];
      console.log('[ModuleRenderer] Experiences from cookie:', parsed);
      return parsed;
    } else {
      console.log('[ModuleRenderer] No ninetailed_experiences cookie found');
      console.log('[ModuleRenderer] All cookies:', document.cookie);
    }
  } catch (e) {
    console.warn('[ModuleRenderer] Failed to parse ninetailed_experiences cookie:', e);
  }
  
  return [];
}

export default function ModuleRenderer({ module }: ModuleRendererProps) {
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Read edge-computed experiences from cookie
    const experiences = getExperiencesFromCookie();
    
    if (experiences.length > 0) {
      const variant = getSelectedVariant(module, experiences);
      if (variant) {
        setSelectedVariant(variant);
      }
    }
    
    setIsReady(true);
  }, [module]);

  const contentTypeId = module.sys.contentType?.sys?.id as string;

  if (!contentTypeId) {
    return null;
  }

  const Component = componentMap[contentTypeId];
  const propName = propNameMap[contentTypeId];

  if (!Component || !propName) {
    return null;
  }

  // Check if module has experiences
  const moduleFields = module.fields as any;
  const hasExperiences = Array.isArray(moduleFields?.nt_experiences) && 
    moduleFields.nt_experiences.length > 0 &&
    moduleFields.nt_experiences.some((exp: any) => exp?.fields?.nt_variants?.length > 0);

  // If no experiences, render baseline directly
  if (!hasExperiences) {
    const props = { [propName]: module };
    return <Component {...props} />;
  }

  // If we have a selected variant from edge, use it
  if (selectedVariant) {
    const variantModule = {
      sys: selectedVariant.sys || module.sys,
      fields: selectedVariant.fields || selectedVariant,
    };
    const props = { [propName]: variantModule };
    return <Component {...props} />;
  }

  // Before edge result is processed, render baseline
  // This should be very quick since edge already computed the result
  const props = { [propName]: module };
  return <Component {...props} />;
}
