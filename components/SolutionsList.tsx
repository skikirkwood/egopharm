import React from 'react';
import { useContentfulLiveUpdates } from '@contentful/live-preview/react';
import { useContentfulInspectorMode } from '@contentful/live-preview/react';
import { SolutionsList as SolutionsListType } from '@/types/contentful';

interface SolutionsListProps {
  solutionsList: SolutionsListType;
}

export default function SolutionsList({ solutionsList: initialData }: SolutionsListProps) {
  const solutionsList = useContentfulLiveUpdates(initialData);
  const inspectorProps = useContentfulInspectorMode({ entryId: solutionsList.sys.id });

  const { title, subtitle, items } = solutionsList.fields;

  return (
    <section className="py-16 md:py-24 bg-quanata-navy">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12" {...inspectorProps({ fieldId: 'title' })}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          {subtitle && (
            <p 
              className="text-lg text-quanata-light/80 max-w-3xl mx-auto"
              {...inspectorProps({ fieldId: 'subtitle' })}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          {...inspectorProps({ fieldId: 'items' })}
        >
          {items?.map((item, index) => (
            <div 
              key={item.sys.id}
              className="bg-quanata-dark/50 border border-quanata-slate/30 rounded-lg p-6 hover:border-quanata-accent/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                {item.fields.number && (
                  <span className="text-4xl font-bold text-quanata-accent/60">
                    {item.fields.number}
                  </span>
                )}
                <div className="flex-1">
                  {item.fields.icon?.fields?.file?.url && (
                    <img
                      src={`https:${item.fields.icon.fields.file.url}`}
                      alt={item.fields.icon.fields.title || ''}
                      className="w-12 h-12 mb-4 object-contain"
                    />
                  )}
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.fields.title}
                  </h3>
                  {item.fields.description && (
                    <p className="text-quanata-light/70">
                      {item.fields.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
