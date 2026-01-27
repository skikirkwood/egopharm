import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useContentfulLiveUpdates } from '@contentful/live-preview/react';
import { getContentfulClient } from '@/lib/contentful';
import { getAllExperiences, getAllAudiences } from '@/lib/ninetailed';
import { Page, SiteSettings } from '@/types/contentful';
import TopBanner from '@/components/TopBanner';
import Navigation from '@/components/Navigation';
import ModuleRenderer from '@/components/ModuleRenderer';
import Footer from '@/components/Footer';

interface HomeProps {
  page: Page;
  siteSettings: SiteSettings | null;
  ninetailed?: {
    preview: {
      allExperiences: any[];
      allAudiences: any[];
    };
  };
}

export const getStaticProps: GetStaticProps<HomeProps> = async ({ preview = false }) => {
  try {
    const client = getContentfulClient(preview);
    
    // Fetch page with include: 10 to resolve all nested links
    // NOTE: Do NOT manually transform/resolve links - this breaks Live Preview
    // The SDK's include parameter handles link resolution while preserving
    // the data structure that useContentfulLiveUpdates needs to track updates
    const pageEntries = await client.getEntries({
      content_type: 'page',
      'fields.slug': 'home',
      include: 10,
    });

    if (pageEntries.items.length === 0) {
      return { notFound: true };
    }

    const page = pageEntries.items[0] as unknown as Page;

    // Fetch site settings
    const settingsEntries = await client.getEntries({
      content_type: '6b7cR8MAmg1gzxiibBMiG7',
      include: 2,
      limit: 1,
    });

    const siteSettings = settingsEntries.items.length > 0 
      ? (settingsEntries.items[0] as unknown as SiteSettings)
      : null;

    // Fetch experiences and audiences for the preview widget
    // Always fetch so the widget can show/hide based on preview mode
    const [allExperiences, allAudiences] = await Promise.all([
      getAllExperiences(preview),
      getAllAudiences(preview),
    ]);

    return {
      props: {
        page,
        siteSettings,
        ninetailed: {
          preview: {
            allExperiences,
            allAudiences,
          },
        },
      },
      revalidate: 5, // Match reference implementation
    };
  } catch (error) {
    console.error('Error fetching page:', error);
    return { notFound: true };
  }
};

export default function Home({ page: initialPage, siteSettings }: HomeProps) {
  // Subscribe to page-level live updates (including module order changes)
  const page = useContentfulLiveUpdates(initialPage);
  
  return (
    <>
      <Head>
        <title>Ego Pharmaceuticals - The Science of Healthy Skin</title>
        <meta 
          name="description" 
          content="Proudly Australian owned, Ego Pharmaceuticals has led the way in the development, manufacture and marketing of innovative skincare products since 1953." 
        />
      </Head>
      <main className="min-h-screen">
        <TopBanner />
        <Navigation navigation={page.fields.navigation} siteSettings={siteSettings} />
        {page.fields.modules.map((module) => (
          <ModuleRenderer key={module.sys.id} module={module} />
        ))}
        <Footer />
      </main>
    </>
  );
}

