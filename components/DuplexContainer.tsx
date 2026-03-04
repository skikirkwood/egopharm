import Image from 'next/image';
import { useContentfulLiveUpdates, useContentfulInspectorMode } from '@contentful/live-preview/react';
import { DuplexContainer as DuplexContainerType } from '@/types/contentful';

interface DuplexContainerProps {
  duplexContainer: DuplexContainerType;
}

export default function DuplexContainer({ duplexContainer: initialDuplexContainer }: DuplexContainerProps) {
  // Subscribe to live updates for real-time editing
  const duplexContainer = useContentfulLiveUpdates(initialDuplexContainer);
  
  // Enable inspector mode for click-to-edit in Contentful
  const inspectorProps = useContentfulInspectorMode({ entryId: duplexContainer.sys.id });
  
  const { 
    title, 
    subtitle, 
    image, 
    imagePosition = 'Left',
    ctaText, 
    ctaUrl 
  } = duplexContainer.fields;

  const imageUrl = image?.fields?.file?.url ? `https:${image.fields.file.url}` : null;
  const isImageLeft = imagePosition === 'Left';

  // Image component
  const ImageSection = (
    <div 
      className="relative w-full md:w-1/2 h-[300px] md:h-[500px]"
      {...inspectorProps({ fieldId: 'image' })}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={image?.fields?.title || title}
          fill
          className="object-cover"
        />
      )}
    </div>
  );

  // Content component
  const ContentSection = (
    <div className="w-full md:w-1/2 flex items-center justify-center bg-quanata-navy px-8 py-12 md:py-0">
      <div className="max-w-lg">
        <h2 
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          {...inspectorProps({ fieldId: 'title' })}
        >
          {title}
        </h2>
        
        {subtitle && (
          <p 
            className="text-lg text-quanata-light/80 mb-6 whitespace-pre-line"
            {...inspectorProps({ fieldId: 'subtitle' })}
          >
            {subtitle}
          </p>
        )}
        
        {ctaText && ctaUrl && (
          <a
            href={ctaUrl}
            className="inline-block bg-quanata-accent hover:bg-quanata-accent-light text-quanata-dark px-6 py-3 rounded-md font-semibold transition-colors"
            {...inspectorProps({ fieldId: 'ctaText' })}
          >
            {ctaText}
          </a>
        )}
      </div>
    </div>
  );

  return (
    <section className="w-full min-h-[400px] md:min-h-[500px] flex flex-col md:flex-row bg-quanata-dark">
      {isImageLeft ? (
        <>
          {ImageSection}
          {ContentSection}
        </>
      ) : (
        <>
          {ContentSection}
          {ImageSection}
        </>
      )}
    </section>
  );
}
