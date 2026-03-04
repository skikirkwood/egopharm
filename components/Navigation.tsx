import Image from 'next/image';
import { Navigation as NavigationType, SiteSettings } from '@/types/contentful';

interface NavigationProps {
  navigation?: NavigationType;
  siteSettings?: SiteSettings | null;
}

export default function Navigation({ navigation, siteSettings }: NavigationProps) {
  const logo = siteSettings?.fields.logo;
  const siteName = siteSettings?.fields.siteName || 'Quanata';

  return (
    <nav className="bg-quanata-dark sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              {logo ? (
                <Image
                  src={`https:${logo.fields.file.url}`}
                  alt={logo.fields.title || siteName}
                  width={200}
                  height={60}
                  className="h-10 w-auto object-contain"
                  priority
                />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {siteName}
                </span>
              )}
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/solutions"
              className="text-quanata-light hover:text-white font-medium transition-colors"
            >
              Solutions
            </a>
            <a
              href="/about"
              className="text-quanata-light hover:text-white font-medium transition-colors"
            >
              About
            </a>
            <a
              href="/blog"
              className="text-quanata-light hover:text-white font-medium transition-colors"
            >
              Blog
            </a>
            
            {/* Contact Button */}
            <a 
              href="/contact" 
              className="bg-quanata-magenta hover:bg-quanata-magenta-light text-white px-5 py-2 rounded-full font-semibold transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
