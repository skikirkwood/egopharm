import { draftMode } from 'next/headers';
import { getContentfulClient } from '@/lib/contentful';
import { Page, SiteSettings } from '@/types/contentful';
import TopBanner from '@/components/TopBanner';
import Navigation from '@/components/Navigation';
import ModuleRenderer from '@/components/ModuleRenderer';
import Footer from '@/components/Footer';

// Revalidate every 60 seconds to fetch fresh content from Contentful
export const revalidate = 60;

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

async function getPage(slug: string = 'home', preview: boolean = false): Promise<Page | null> {
  try {
    const client = getContentfulClient(preview);
    const entries = await client.getEntries({
      content_type: 'page',
      'fields.slug': slug,
      include: 10,
    });

    if (entries.items.length === 0) {
      return null;
    }

    const page = entries.items[0] as unknown as Page;
    
    // Resolve nt_experiences and their variants for each module
    if (page.fields.modules) {
      await Promise.all(
        page.fields.modules.map(module => resolveExperiences(client, module))
      );
    }

    return page;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

async function getSiteSettings(preview: boolean = false): Promise<SiteSettings | null> {
  try {
    const client = getContentfulClient(preview);
    const entries = await client.getEntries({
      content_type: '6b7cR8MAmg1gzxiibBMiG7',
      include: 2,
      limit: 1,
    });

    if (entries.items.length === 0) {
      return null;
    }

    return entries.items[0] as unknown as SiteSettings;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

export default async function Home() {
  const { isEnabled: isPreview } = await draftMode();
  const [page, siteSettings] = await Promise.all([
    getPage('home', isPreview),
    getSiteSettings(isPreview),
  ]);

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Page not found</h1>
          <p className="text-gray-600">
            Please create a page with slug &quot;home&quot; in Contentful.
          </p>
        </div>
      </div>
    );
  }

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    const modulesWithExp = page.fields.modules.filter((m: any) => m.fields?.nt_experiences?.length > 0);
    console.log('Modules with experiences:', modulesWithExp.length);
    if (modulesWithExp.length > 0) {
      const exp = (modulesWithExp[0].fields as any).nt_experiences?.[0];
      console.log('Experience data:', {
        hasFields: Boolean(exp?.fields),
        name: exp?.fields?.nt_name,
        type: exp?.fields?.nt_type,
        audienceId: exp?.fields?.nt_audience?.fields?.nt_audience_id || exp?.fields?.nt_audience?.sys?.id,
        variantCount: exp?.fields?.nt_variants?.length,
        variantResolved: Boolean(exp?.fields?.nt_variants?.[0]?.fields),
      });
    }
  }

  return (
    <main className="min-h-screen">
      {isPreview && (
        <div className="bg-yellow-400 text-black text-center py-2 text-sm font-medium">
          Preview Mode - <a href="/api/disable-draft" className="underline">Exit Preview</a>
        </div>
      )}
      <TopBanner />
      <Navigation navigation={page.fields.navigation} siteSettings={siteSettings} />
      {page.fields.modules.map((module) => (
        <ModuleRenderer key={module.sys.id} module={module} />
      ))}
      <Footer />
    </main>
  );
}
