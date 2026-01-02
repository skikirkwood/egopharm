import React from 'react';
import '@/styles/globals.css';
import { AppProps as NextAppProps } from 'next/app';
import {
  ExperienceConfiguration,
  NinetailedProvider,
} from '@ninetailed/experience.js-next';
import { NinetailedPreviewPlugin } from '@ninetailed/experience.js-plugin-preview';
import { NinetailedInsightsPlugin } from '@ninetailed/experience.js-plugin-insights';
import { ContentfulLivePreviewProvider } from '@contentful/live-preview/react';

type AppProps<P = unknown> = {
  pageProps: P;
} & Omit<NextAppProps<P>, 'pageProps'>;

// Type for audience (from Ninetailed utils)
type Audience = {
  name: string;
  description?: string | undefined;
  id: string;
};

interface CustomPageProps {
  ninetailed?: {
    preview: {
      allExperiences: ExperienceConfiguration[];
      allAudiences: Audience[];
    };
  };
  [key: string]: any;
}

const App = ({ Component, pageProps }: AppProps<CustomPageProps>) => {
  return (
    <NinetailedProvider
      plugins={[
        new NinetailedInsightsPlugin(),
        ...(pageProps.ninetailed?.preview
          ? [
              new NinetailedPreviewPlugin({
                experiences: pageProps.ninetailed?.preview.allExperiences || [],
                audiences: pageProps.ninetailed?.preview.allAudiences || [],
                onOpenExperienceEditor: (experience) => {
                  if (process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID) {
                    window.open(
                      `https://app.contentful.com/spaces/${
                        process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
                      }/environments/${
                        process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master'
                      }/entries/${experience.id}`,
                      '_blank'
                    );
                  }
                },
                onOpenAudienceEditor: (audience) => {
                  if (process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID) {
                    window.open(
                      `https://app.contentful.com/spaces/${
                        process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
                      }/environments/${
                        process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master'
                      }/entries/${audience.id}`,
                      '_blank'
                    );
                  }
                },
              }),
            ]
          : []),
      ]}
      clientId={process.env.NEXT_PUBLIC_NINETAILED_API_KEY ?? ''}
      environment={process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT ?? 'main'}
      componentViewTrackingThreshold={0}
    >
      <ContentfulLivePreviewProvider locale="en-US">
        <Component {...pageProps} />
      </ContentfulLivePreviewProvider>
    </NinetailedProvider>
  );
};

export default App;
