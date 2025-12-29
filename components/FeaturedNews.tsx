'use client';

import Image from 'next/image';
import { useContentfulLiveUpdates } from '@contentful/live-preview/react';
import { FeaturedNews as FeaturedNewsType } from '@/types/contentful';

interface FeaturedNewsProps {
  featuredNews: FeaturedNewsType;
}

export default function FeaturedNews({ featuredNews: initialFeaturedNews }: FeaturedNewsProps) {
  // Subscribe to live updates
  const featuredNews = useContentfulLiveUpdates(initialFeaturedNews);
  
  const { title, items } = featuredNews.fields;

  return (
    <section className="py-20 px-4 bg-blue-600">
      <div className="max-w-7xl mx-auto">
        {title && (
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
            {title}
          </h2>
        )}
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item) => {
            const imageUrl = `https:${item.fields.image.fields.file.url}`;

            const content = (
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="relative h-48 flex-shrink-0">
                  <Image
                    src={imageUrl}
                    alt={item.fields.image.fields.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.fields.title}
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line flex-grow">
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
            href="https://www.egopharm.com/content/egopharm/au/en/news"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-md font-semibold border-2 border-white hover:bg-blue-600 hover:text-white hover:border-white transition-colors"
          >
            VIEW ALL NEWS
          </a>
        </div>
      </div>
    </section>
  );
}
