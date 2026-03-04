import React from 'react';
import Image from 'next/image';
import { useContentfulLiveUpdates } from '@contentful/live-preview/react';
import { useContentfulInspectorMode } from '@contentful/live-preview/react';
import { ValuePropositions as ValuePropositionsType } from '@/types/contentful';

interface ValuePropositionsProps {
  valuePropositions: ValuePropositionsType;
}

const defaultIcons = [
  <svg key="chart" className="w-6 h-6 text-quanata-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>,
  <svg key="globe" className="w-6 h-6 text-quanata-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>,
  <svg key="shield" className="w-6 h-6 text-quanata-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>,
];

export default function ValuePropositions({ valuePropositions: initialData }: ValuePropositionsProps) {
  const valuePropositions = useContentfulLiveUpdates(initialData);
  const inspectorProps = useContentfulInspectorMode({ entryId: valuePropositions.sys.id });

  const { title, subtitle, items, propositions } = valuePropositions.fields;

  return (
    <section className="py-12 md:py-16 bg-[#e8ede9]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="md:w-2/5">
            <h2 
              className="text-2xl md:text-3xl font-bold text-gray-900"
              {...inspectorProps({ fieldId: 'title' })}
            >
              {title}
            </h2>
            {subtitle && (
              <p 
                className="text-base text-gray-700 mt-2"
                {...inspectorProps({ fieldId: 'subtitle' })}
              >
                {subtitle}
              </p>
            )}
          </div>

          <div 
            className="md:w-3/5 flex flex-col gap-4"
            {...inspectorProps({ fieldId: items ? 'items' : 'propositions' })}
          >
            {items && items.length > 0 ? (
              items.map((item, index) => {
                const iconUrl = item.fields.icon?.fields?.file?.url;
                return (
                  <div 
                    key={item.sys.id}
                    className="flex items-center gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-quanata-dark/10 flex items-center justify-center overflow-hidden">
                      {iconUrl ? (
                        <Image
                          src={`https:${iconUrl}`}
                          alt={item.fields.icon?.fields?.title || ''}
                          width={24}
                          height={24}
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        defaultIcons[index % defaultIcons.length]
                      )}
                    </div>
                    <span className="text-gray-900 text-sm md:text-base">{item.fields.text}</span>
                  </div>
                );
              })
            ) : propositions?.map((proposition, index) => (
              <div 
                key={index}
                className="flex items-center gap-4"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-quanata-dark/10 flex items-center justify-center">
                  {defaultIcons[index % defaultIcons.length]}
                </div>
                <span className="text-gray-900 text-sm md:text-base">{proposition}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
