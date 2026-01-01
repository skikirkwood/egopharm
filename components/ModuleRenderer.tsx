'use client';

import React, { useState, useEffect } from 'react';
import { Experience } from '@ninetailed/experience.js-react';
import { ExperienceMapper } from '@ninetailed/experience.js-utils-contentful';

import { Module } from '@/types/contentful';
import Hero from './Hero';
import Infoblock from './Infoblock';
import ImageTriplex from './ImageTriplex';
import FeaturedNews from './FeaturedNews';

// Component mapping by content type ID
const ContentTypeMap: Record<string, React.ComponentType<any>> = {
  hero: Hero,
  infoblock: Infoblock,
  imageTriplex: ImageTriplex,
  featuredNews: FeaturedNews,
  '6NbIn3MpiND4Hybq2U6NV8': FeaturedNews,
};

// Prop name mapping for each component
const propNameMap: Record<string, string> = {
  hero: 'hero',
  infoblock: 'infoblock',
  imageTriplex: 'imageTriplex',
  featuredNews: 'featuredNews',
  '6NbIn3MpiND4Hybq2U6NV8': 'featuredNews',
};

// Component renderer that receives the full entry and renders the appropriate component
const ComponentRenderer = (props: any) => {
  const contentTypeId = props.sys?.contentType?.sys?.id;
  const Component = ContentTypeMap[contentTypeId];
  const propName = propNameMap[contentTypeId];

  if (!Component) {
    console.warn(`${contentTypeId} cannot be handled`);
    return null;
  }

  // Pass the full entry as the named prop
  return <Component {...{ [propName]: props }} />;
};

// Check if entry has experiences
const hasExperiences = (entry: any): boolean => {
  return entry?.fields?.nt_experiences !== undefined && 
         Array.isArray(entry.fields.nt_experiences) &&
         entry.fields.nt_experiences.length > 0;
};

// Parse experiences using ExperienceMapper
const parseExperiences = (entry: any) => {
  if (!hasExperiences(entry)) {
    return [];
  }

  return entry.fields.nt_experiences
    .filter((experience: any) => ExperienceMapper.isExperienceEntry(experience))
    .map((experience: any) => ExperienceMapper.mapExperience(experience));
};

interface ModuleRendererProps {
  module: Module;
}

export default function ModuleRenderer({ module }: ModuleRendererProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const contentTypeId = module.sys?.contentType?.sys?.id as string;
  const { id } = module.sys;

  if (!contentTypeId || !ContentTypeMap[contentTypeId]) {
    console.warn(`Unknown content type: ${contentTypeId}`);
    return null;
  }

  const propName = propNameMap[contentTypeId];
  const Component = ContentTypeMap[contentTypeId];

  // During SSR, render the baseline component directly
  if (!isClient) {
    return <Component {...{ [propName]: module }} />;
  }

  const parsedExperiences = parseExperiences(module);

  // If no experiences, just render the component
  if (parsedExperiences.length === 0) {
    return <Component {...{ [propName]: module }} />;
  }

  // On client, use Experience component for personalization
  return (
    <Experience
      key={`${contentTypeId}-${id}`}
      {...module}
      id={id}
      component={ComponentRenderer}
      experiences={parsedExperiences}
    />
  );
}
