'use client';

import { useState, useEffect } from 'react';
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

// Check if personalization is enabled
const isPersonalizationEnabled = Boolean(process.env.NEXT_PUBLIC_NINETAILED_API_KEY);

// Inner component that uses the Ninetailed hook
function PersonalizedModuleRenderer({ 
  module, 
  Component, 
  propName 
}: { 
  module: Module; 
  Component: React.ComponentType<any>; 
  propName: string;
}) {
  // Import useProfile dynamically to avoid SSR issues
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamically import and use the hook
    import('@ninetailed/experience.js-react').then(({ useProfile }) => {
      // This is a workaround - we'll access the profile through the window object
      // set by the SDK, since we can't call hooks inside useEffect
    });
    
    // Poll for profile from window.ninetailed
    const checkProfile = () => {
      const nt = (window as any).ninetailed;
      if (nt?.profileState?.profile) {
        setProfileData(nt.profileState.profile);
        setLoading(false);
      }
    };

    // Check immediately and then poll
    checkProfile();
    const interval = setInterval(checkProfile, 100);
    
    // Cleanup after 5 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setLoading(false);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Helper to render baseline
  const renderBaseline = () => {
    const props = { [propName]: module };
    return <Component {...props} />;
  };

  if (loading || !profileData) {
    return renderBaseline();
  }

  // Check if module has experiences
  const moduleFields = module.fields as any;
  const experiences = moduleFields?.nt_experiences;
  
  if (!Array.isArray(experiences) || experiences.length === 0) {
    return renderBaseline();
  }

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Ninetailed profile:', profileData);
    console.log('Module experiences:', experiences);
  }

  // Find matching experience based on profile audiences
  let variantToRender: any = null;
  const profileAudiences = profileData.audiences || [];

  for (const exp of experiences) {
    if (!exp?.fields) continue;

    // Get the audience ID for this experience
    const audienceId = exp.fields.nt_audience?.fields?.nt_audience_id || 
                       exp.fields.nt_audience?.sys?.id;

    if (!audienceId) continue;

    // Check if user is in this audience
    const isInAudience = profileAudiences.some(
      (aud: string) => aud === audienceId
    );

    if (isInAudience && exp.fields.nt_variants?.length > 0) {
      // User matches this audience - get the first variant
      const variant = exp.fields.nt_variants[0];
      if (variant?.fields) {
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
    if (process.env.NODE_ENV === 'development') {
      console.log('Rendering personalized variant:', variantToRender.fields?.title);
    }
    const props = { [propName]: variantToRender };
    return <Component {...props} />;
  }

  return renderBaseline();
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

  // Helper to render baseline
  const renderBaseline = () => {
    const props = { [propName]: module };
    return <Component {...props} />;
  };

  // Check if module has experiences
  const hasExperiences = Boolean(
    (module.fields as any)?.nt_experiences?.length > 0
  );

  // Render baseline during SSR or if no personalization or no experiences
  if (!mounted || !isPersonalizationEnabled || !hasExperiences) {
    return renderBaseline();
  }

  // Use personalized renderer for modules with experiences
  return (
    <PersonalizedModuleRenderer 
      module={module} 
      Component={Component} 
      propName={propName} 
    />
  );
}
