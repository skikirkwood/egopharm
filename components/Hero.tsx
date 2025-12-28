import Image from 'next/image';
import { Hero as HeroType } from '@/types/contentful';

interface HeroProps {
  hero: HeroType;
}

export default function Hero({ hero }: HeroProps) {
  const { title, subtitle, backgroundImage, ctaText, ctaLink } = hero.fields;
  const imageUrl = `https:${backgroundImage.fields.file.url}`;

  return (
    <section className="w-full min-h-[600px] flex flex-col md:flex-row">
      {/* Image on the left */}
      <div className="relative w-full md:w-1/2 h-[400px] md:h-auto">
        <Image
          src={imageUrl}
          alt={backgroundImage.fields.title}
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Content on the right */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-8 py-12 md:py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-500 mb-6">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-gray-700 mb-8 whitespace-pre-line">
              {subtitle}
            </p>
          )}
          {ctaText && ctaLink && (
            <a
              href={ctaLink}
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-md font-semibold border-2 border-transparent hover:bg-white hover:text-blue-500 hover:border-blue-500 transition-colors"
            >
              {ctaText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

