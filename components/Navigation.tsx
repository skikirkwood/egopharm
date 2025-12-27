import Image from 'next/image';
import { Navigation as NavigationType, SiteSettings } from '@/types/contentful';

interface NavigationProps {
  navigation?: NavigationType;
  siteSettings?: SiteSettings | null;
}

export default function Navigation({ navigation, siteSettings }: NavigationProps) {
  const logo = siteSettings?.fields.logo;
  const siteName = siteSettings?.fields.siteName || 'Ego Pharmaceuticals';

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              {logo ? (
                <Image
                  src={`https:${logo.fields.file.url}`}
                  alt={logo.fields.title || siteName}
                  width={200}
                  height={60}
                  className="h-12 w-auto object-contain"
                  priority
                />
              ) : (
                <span className="text-2xl font-bold text-blue-500">
                  {siteName}
                </span>
              )}
            </a>
          </div>
          {navigation?.fields.items && navigation.fields.items.length > 0 && (
            <div className="hidden md:flex space-x-8">
              {navigation.fields.items.map((item) => (
                <a
                  key={item.sys.id}
                  href={item.fields.url}
                  className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                >
                  {item.fields.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

