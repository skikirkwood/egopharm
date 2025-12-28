import { contentfulClient } from '@/lib/contentful';
import { Page, SiteSettings } from '@/types/contentful';
import Navigation from '@/components/Navigation';
import ModuleRenderer from '@/components/ModuleRenderer';
import Footer from '@/components/Footer';

// Revalidate every 60 seconds to fetch fresh content from Contentful
export const revalidate = 60;

async function getPage(slug: string = 'home'): Promise<Page | null> {
  try {
    const entries = await contentfulClient.getEntries({
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

async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const entries = await contentfulClient.getEntries({
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
  const page = await getPage('home');
  const siteSettings = await getSiteSettings();

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

  return (
    <main className="min-h-screen">
      <Navigation navigation={page.fields.navigation} siteSettings={siteSettings} />
      {page.fields.modules.map((module) => (
        <ModuleRenderer key={module.sys.id} module={module} />
      ))}
      <Footer />
    </main>
  );
}

