import Image from 'next/image';
import { useContentfulLiveUpdates, useContentfulInspectorMode } from '@contentful/live-preview/react';
import { FeaturedNews as FeaturedNewsType } from '@/types/contentful';

interface FeaturedNewsProps {
  featuredNews: FeaturedNewsType;
}

export default function FeaturedNews({ featuredNews: initialFeaturedNews }: FeaturedNewsProps) {
  // Subscribe to live updates
  const featuredNews = useContentfulLiveUpdates(initialFeaturedNews);
  
  // Get inspector mode props for each field
  const inspectorProps = useContentfulInspectorMode({ entryId: featuredNews.sys.id });
  
  const { title, items } = featuredNews.fields;

  return (
    <section className="py-20 px-4 bg-quanata-slate/30">
      <div className="max-w-7xl mx-auto">
        {title && (
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-12 text-center"
            {...inspectorProps({ fieldId: 'title' })}
          >
            {title}
          </h2>
        )}
        <div className="grid md:grid-cols-3 gap-8" {...inspectorProps({ fieldId: 'items' })}>
          {items.map((item) => {
            const imageUrl = `https:${item.fields.image.fields.file.url}`;

            const content = (
              <div className="bg-quanata-navy rounded-lg overflow-hidden border border-quanata-slate/30 hover:border-quanata-accent/50 transition-colors h-full flex flex-col">
                <div className="relative h-48 flex-shrink-0">
                  <Image
                    src={imageUrl}
                    alt={item.fields.image.fields.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {item.fields.title}
                  </h3>
                  <p className="text-quanata-light/70 whitespace-pre-line flex-grow">
                    {item.fields.body}
                  </p>
                </div>
              </div>
            );

            if (item.fields.url) {
              return (
                <a
                  key={item.sys.id}
                  href={item.fields.url}
                  className="block hover:no-underline h-full"
                >
                  {content}
                </a>
              );
            }

            return <div key={item.sys.id} className="h-full">{content}</div>;
          })}
        </div>
        
        <div className="mt-12 text-center">
          <a
            href="/news"
            className="inline-block bg-quanata-accent hover:bg-quanata-accent-light text-quanata-dark px-8 py-4 rounded-md font-semibold transition-colors"
          >
            VIEW ALL NEWS
          </a>
        </div>
      </div>
    </section>
  );
}
