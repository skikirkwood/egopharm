import { draftMode } from 'next/headers';
import { getContentfulClient } from '@/lib/contentful';
import { getAudiences } from '@/lib/ninetailed';
import { Page, SiteSettings } from '@/types/contentful';
import TopBanner from '@/components/TopBanner';
import Navigation from '@/components/Navigation';
import ModuleRenderer from '@/components/ModuleRenderer';
import Footer from '@/components/Footer';

// Revalidate every 60 seconds to fetch fresh content from Contentful
export const revalidate = 60;

async function getPage(slug: string = 'home', preview: boolean = false): Promise<Page | null> {
  try {
    const client = getContentfulClient(preview);
    const entries = await client.getEntries({
      content_type: 'page',
      'fields.slug': slug,
      include: 10, // Include linked entries and assets
    });

    if (entries.items.length === 0) {
      return null;
    }

    return entries.items[0] as unknown as Page;
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
      include: 2, // Include linked assets
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
  const [page, siteSettings, audiences] = await Promise.all([
    getPage('home', isPreview),
    getSiteSettings(isPreview),
    getAudiences(isPreview),
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

  // Log for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('Fetched audiences:', audiences.length);
    console.log('Modules with experiences:', page.fields.modules.filter((m: any) => m.fields?.nt_experiences?.length > 0).length);
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
        <ModuleRenderer key={module.sys.id} module={module} audiences={audiences} />
      ))}
      <Footer />
    </main>
  );
}
