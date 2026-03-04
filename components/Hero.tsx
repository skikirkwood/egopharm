import Image from 'next/image';
import { useContentfulLiveUpdates, useContentfulInspectorMode } from '@contentful/live-preview/react';
import { Hero as HeroType } from '@/types/contentful';

interface HeroProps {
  hero: HeroType;
}

function getYouTubeEmbedUrl(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
}

function getVimeoEmbedUrl(url: string): string | null {
  const regExp = /vimeo\.com\/(\d+)/;
  const match = url.match(regExp);
  return match ? `https://player.vimeo.com/video/${match[1]}` : null;
}

export default function Hero({ hero: initialHero }: HeroProps) {
  const hero = useContentfulLiveUpdates(initialHero);
  const inspectorProps = useContentfulInspectorMode({ entryId: hero.sys.id });
  
  const { 
    title, 
    subtitle, 
    backgroundImage, 
    ctaText, 
    ctaLink, 
    secondaryCtaText,
    secondaryCtaLink,
    video,
    videoUrl,
    layout,
    imageLocation 
  } = hero.fields;

  const imageUrl = backgroundImage?.fields?.file?.url ? `https:${backgroundImage.fields.file.url}` : null;
  const videoAssetUrl = video?.fields?.file?.url ? `https:${video.fields.file.url}` : null;
  
  let embedUrl: string | null = null;
  if (videoUrl) {
    embedUrl = getYouTubeEmbedUrl(videoUrl) || getVimeoEmbedUrl(videoUrl);
  }

  // Centered with video layout
  if (layout === 'Centered with video') {
    return (
      <section className="w-full bg-quanata-dark py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            {...inspectorProps({ fieldId: 'title' })}
          >
            {title}
          </h1>
          
          {subtitle && (
            <p 
              className="text-lg md:text-xl text-quanata-light/90 mb-8 max-w-2xl mx-auto whitespace-pre-line"
              {...inspectorProps({ fieldId: 'subtitle' })}
            >
              {subtitle}
            </p>
          )}
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            {ctaText && ctaLink && (
              <a
                href={ctaLink}
                className="inline-block bg-quanata-accent hover:bg-quanata-accent-light text-quanata-dark px-5 py-2 rounded-md text-sm font-semibold transition-colors"
                {...inspectorProps({ fieldId: 'ctaText' })}
              >
                {ctaText}
              </a>
            )}
            {secondaryCtaText && secondaryCtaLink && (
              <a
                href={secondaryCtaLink}
                className="inline-block border border-quanata-light/50 hover:border-quanata-accent text-quanata-light hover:text-quanata-accent px-5 py-2 rounded-md text-sm font-semibold transition-colors"
                {...inspectorProps({ fieldId: 'secondaryCtaText' })}
              >
                {secondaryCtaText}
              </a>
            )}
          </div>
          
          {/* Video Section */}
          {(embedUrl || videoAssetUrl) && (
            <div 
              className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl border border-quanata-slate/30"
              {...inspectorProps({ fieldId: videoUrl ? 'videoUrl' : 'video' })}
            >
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : videoAssetUrl && (
                <video
                  src={videoAssetUrl}
                  controls
                  className="absolute inset-0 w-full h-full object-cover"
                  poster={imageUrl || undefined}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  // Image overlay layout
  if (layout === 'Image overlay' || imageLocation === 'Right overlay') {
    return (
      <section className="relative w-full h-[500px] flex items-center bg-quanata-dark">
        {imageUrl && (
          <div className="absolute inset-0 z-0" {...inspectorProps({ fieldId: 'backgroundImage' })}>
            <Image
              src={imageUrl}
              alt={backgroundImage?.fields?.title || title}
              fill
              className="object-cover object-top"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-quanata-dark/80 via-quanata-dark/50 to-transparent" />
          </div>
        )}
        
        <div className="relative z-10 w-full flex justify-start px-8">
          <div className="max-w-xl p-8 md:p-12 ml-0 md:ml-12">
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
              {...inspectorProps({ fieldId: 'title' })}
            >
              {title}
            </h1>
            {subtitle && (
              <p 
                className="text-lg md:text-xl text-quanata-light/90 whitespace-pre-line"
                {...inspectorProps({ fieldId: 'subtitle' })}
              >
                {subtitle}
              </p>
            )}
            {ctaText && ctaLink && (
              <div className="mt-8">
                <a
                  href={ctaLink}
                  className="inline-block bg-quanata-accent hover:bg-quanata-accent-light text-quanata-dark px-8 py-4 rounded-md font-semibold transition-colors"
                  {...inspectorProps({ fieldId: 'ctaText' })}
                >
                  {ctaText}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Default "Image right" layout
  return (
    <section className="w-full min-h-[600px] flex flex-col md:flex-row bg-quanata-dark">
      {imageUrl && (
        <div 
          className="relative w-full md:w-1/2 h-[400px] md:h-auto"
          {...inspectorProps({ fieldId: 'backgroundImage' })}
        >
          <Image
            src={imageUrl}
            alt={backgroundImage?.fields?.title || title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      
      <div className={`w-full ${imageUrl ? 'md:w-1/2' : ''} flex items-center justify-center bg-quanata-navy px-8 py-12 md:py-20`}>
        <div className="max-w-2xl">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            {...inspectorProps({ fieldId: 'title' })}
          >
            {title}
          </h1>
          {subtitle && (
            <p 
              className="text-lg md:text-xl text-quanata-light/90 whitespace-pre-line"
              {...inspectorProps({ fieldId: 'subtitle' })}
            >
              {subtitle}
            </p>
          )}
          {ctaText && ctaLink && (
            <div className="mt-8">
              <a
                href={ctaLink}
                className="inline-block bg-quanata-accent hover:bg-quanata-accent-light text-quanata-dark px-8 py-4 rounded-md font-semibold transition-colors"
                {...inspectorProps({ fieldId: 'ctaText' })}
              >
                {ctaText}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
