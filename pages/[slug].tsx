import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { getContentfulClient } from '@/lib/contentful';
import { getAllExperiences, getAllAudiences } from '@/lib/ninetailed';
import { Page, SiteSettings } from '@/types/contentful';
import TopBanner from '@/components/TopBanner';
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

// Helper to resolve a single link
async function resolveLink(client: any, link: any, include: number = 2): Promise<any> {
  if (!link?.sys?.id || link?.fields) return link;
  
  try {
    return await client.getEntry(link.sys.id, { include });
  } catch (e) {
    console.warn('Failed to resolve link:', link.sys.id);
    return link;
  }
}

// Helper to resolve nt_experiences and their nested variants
async function resolveExperiences(client: any, module: any): Promise<void> {
  const moduleFields = module.fields as any;
  
  if (!moduleFields.nt_experiences || !Array.isArray(moduleFields.nt_experiences)) {
    return;
  }

  // Resolve each experience
  const resolvedExperiences = await Promise.all(
    moduleFields.nt_experiences.map(async (exp: any) => {
      // Resolve the experience itself if it's a link
      let resolvedExp = exp;
      if (exp?.sys?.type === 'Link' && !exp?.fields) {
        resolvedExp = await resolveLink(client, exp, 3);
      }

      // Now resolve nested fields within the experience
      if (resolvedExp?.fields) {
        // Resolve nt_audience if it's a link
        if (resolvedExp.fields.nt_audience?.sys?.type === 'Link' && !resolvedExp.fields.nt_audience?.fields) {
          resolvedExp.fields.nt_audience = await resolveLink(client, resolvedExp.fields.nt_audience);
        }

        // Resolve nt_variants if they are links
        if (Array.isArray(resolvedExp.fields.nt_variants)) {
          resolvedExp.fields.nt_variants = await Promise.all(
            resolvedExp.fields.nt_variants.map(async (variant: any) => {
              if (variant?.sys?.type === 'Link' && !variant?.fields) {
                return await resolveLink(client, variant, 2);
              }
              return variant;
            })
          );
        }
      }

      return resolvedExp;
    })
  );

  moduleFields.nt_experiences = resolvedExperiences;
}

// Shared function to fetch page data
async function fetchPageData(slug: string, preview: boolean = false) {
  const client = getContentfulClient(preview);
  
  // Fetch page
  const pageEntries = await client.getEntries({
    content_type: 'page',
    'fields.slug': slug,
    include: 10,
  });

  if (pageEntries.items.length === 0) {
    return null;
  }

  const page = pageEntries.items[0] as unknown as Page;
  
  // Resolve nt_experiences and their variants for each module
  if (page.fields.modules) {
    await Promise.all(
      page.fields.modules.map(module => resolveExperiences(client, module))
    );
  }

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

export default function PageComponent({ page, siteSettings }: PageProps) {
  return (
    <>
      <Head>
        <title>{page.fields.title} - Ego Pharmaceuticals</title>
        <meta 
          name="description" 
          content={page.fields.title}
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
