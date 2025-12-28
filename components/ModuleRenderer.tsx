import { Module } from '@/types/contentful';
import Hero from './Hero';
import Infoblock from './Infoblock';
import ImageTriplex from './ImageTriplex';
import FeaturedNews from './FeaturedNews';

interface ModuleRendererProps {
  module: Module;
}

export default function ModuleRenderer({ module }: ModuleRendererProps) {
  const contentTypeId = module.sys.contentType.sys.id;

  switch (contentTypeId) {
    case 'hero':
      return <Hero hero={module as any} />;
    case 'infoblock':
      return <Infoblock infoblock={module as any} />;
    case 'imageTriplex':
      return <ImageTriplex imageTriplex={module as any} />;
    case 'featuredNews':
      return <FeaturedNews featuredNews={module as any} />;
    default:
      console.warn(`Unknown content type: ${contentTypeId}`);
      return null;
  }
}

