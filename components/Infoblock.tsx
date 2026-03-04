import Image from 'next/image';
import { useContentfulLiveUpdates, useContentfulInspectorMode } from '@contentful/live-preview/react';
import { Infoblock as InfoblockType } from '@/types/contentful';

interface InfoblockProps {
  infoblock: InfoblockType;
}

export default function Infoblock({ infoblock: initialInfoblock }: InfoblockProps) {
  // Subscribe to live updates
  const infoblock = useContentfulLiveUpdates(initialInfoblock);
  
  // Get inspector mode props for each field
  const inspectorProps = useContentfulInspectorMode({ entryId: infoblock.sys.id });
  
  const { title, body, ctaText, ctaLink, backgroundImage } = infoblock.fields;

  return (
    <section className="py-20 px-4 bg-quanata-dark">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              {...inspectorProps({ fieldId: 'title' })}
            >
              {title}
            </h2>
            <div 
              className="text-lg text-quanata-light/80 mb-8 whitespace-pre-line"
              {...inspectorProps({ fieldId: 'body' })}
            >
              {body}
            </div>
            {ctaText && ctaLink && (
              <a
                href={ctaLink}
                className="inline-block bg-quanata-accent hover:bg-quanata-accent-light text-quanata-dark px-8 py-4 rounded-md font-semibold transition-colors"
                {...inspectorProps({ fieldId: 'ctaText' })}
              >
                {ctaText}
              </a>
            )}
          </div>
          {backgroundImage && (
            <div 
              className="relative h-96 rounded-lg overflow-hidden"
              {...inspectorProps({ fieldId: 'backgroundImage' })}
            >
              <Image
                src={`https:${backgroundImage.fields.file.url}`}
                alt={backgroundImage.fields.title}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
