import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { useContentfulLiveUpdates } from '@contentful/live-preview/react';
import { getContentfulClient } from '@/lib/contentful';
import { getAllExperiences, getAllAudiences } from '@/lib/ninetailed';
import { Page, SiteSettings } from '@/types/contentful';
import Navigation from '@/components/Navigation';
import ModuleRenderer from '@/components/ModuleRenderer';
import Footer from '@/components/Footer';

interface PageProps {
  page: Page;
  siteSettings: SiteSettings | null;
  ninetailed?: {
    preview: {
      allExperiences: any[];
      allAudiences: any[];
    };
  };
}

// Shared function to fetch page data
async function fetchPageData(slug: string, preview: boolean = false) {
  const client = getContentfulClient(preview);
  
  // Fetch page with include: 10 to resolve all nested links
  // NOTE: Do NOT manually transform/resolve links - this breaks Live Preview
  // The SDK's include parameter handles link resolution while preserving
  // the data structure that useContentfulLiveUpdates needs to track updates
  const pageEntries = await client.getEntries({
    content_type: 'page',
    'fields.slug': slug,
    include: 10,
  });

  if (pageEntries.items.length === 0) {
    return null;
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
    page,
    siteSettings,
    ninetailed: {
      preview: {
        allExperiences,
        allAudiences,
      },
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getContentfulClient(false);
  
  // Fetch all published pages to generate static paths
  const pageEntries = await client.getEntries({
    content_type: 'page',
    select: ['fields.slug'],
  });

  const paths = pageEntries.items
    .map((item: any) => item.fields.slug)
    .filter((slug: string) => slug && slug !== 'home') // Exclude 'home' as it's handled by index.tsx
    .map((slug: string) => ({
      params: { slug },
    }));

  return {
    paths,
    fallback: 'blocking', // Enable ISR for new pages
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params, preview = false }) => {
  try {
    const slug = params?.slug as string;
    
    if (!slug) {
      return { notFound: true };
    }

    const data = await fetchPageData(slug, preview);

    if (!data) {
      return { notFound: true };
    }

    return {
      props: {
        page: data.page,
        siteSettings: data.siteSettings,
        ninetailed: data.ninetailed,
      },
      revalidate: 5,
    };
  } catch (error) {
    console.error('Error fetching page:', error);
    return { notFound: true };
  }
};

export default function PageComponent({ page: initialPage, siteSettings }: PageProps) {
  // Subscribe to page-level live updates (including module order changes)
  const page = useContentfulLiveUpdates(initialPage);
  
  return (
    <>
      <Head>
        <title>{page.fields.title} - Quanata</title>
        <meta 
          name="description" 
          content={page.fields.title}
        />
      </Head>
      <main className="min-h-screen">
        <Navigation navigation={page.fields.navigation} siteSettings={siteSettings} />
        {page.fields.modules.map((module) => (
          <ModuleRenderer key={module.sys.id} module={module} />
        ))}
        <Footer />
      </main>
    </>
  );
}
