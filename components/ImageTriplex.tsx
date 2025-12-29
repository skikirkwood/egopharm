'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useContentfulLiveUpdates } from '@contentful/live-preview/react';
import { ImageTriplex as ImageTriplexType } from '@/types/contentful';

interface ImageTriplexProps {
  imageTriplex: ImageTriplexType;
}

export default function ImageTriplex({ imageTriplex: initialImageTriplex }: ImageTriplexProps) {
  // Subscribe to live updates
  const imageTriplex = useContentfulLiveUpdates(initialImageTriplex);
  
  const { title, items } = imageTriplex.fields;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {title && (
          <h2 className="text-4xl md:text-5xl font-bold text-blue-500 mb-12 text-center">
            {title}
          </h2>
        )}
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, index) => {
            const imageUrl = `https:${item.fields.backgroundImage.fields.file.url}`;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.sys.id}
                className="relative h-96 rounded-lg overflow-hidden group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Image
                  src={imageUrl}
                  alt={item.fields.backgroundImage.fields.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div
                  className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                    isHovered ? 'opacity-70' : 'opacity-0'
                  }`}
                />
                <div
                  className={`absolute inset-0 flex flex-col justify-center items-center p-6 text-white transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <h3 className="text-2xl font-bold mb-4 text-center">
                    {item.fields.title}
                  </h3>
                  <p className="text-center mb-4">{item.fields.body}</p>
                  {item.fields.ctaText && item.fields.ctaLink && (
                    <a
                      href={item.fields.ctaLink}
                      className="inline-block bg-white text-gray-900 px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.fields.ctaText}
                    </a>
                  )}
                </div>
                {!isHovered && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-4">
                    <h3 className="text-xl font-bold text-white text-center">
                      {item.fields.title}
                    </h3>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
