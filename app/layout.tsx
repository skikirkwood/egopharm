import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import './globals.css';
import ContentfulLivePreviewProvider from '@/components/ContentfulLivePreviewProvider';
import NinetailedProvider from '@/components/NinetailedProvider';

export const metadata: Metadata = {
  title: 'Ego Pharmaceuticals - The Science of Healthy Skin',
  description: 'Proudly Australian owned, Ego Pharmaceuticals has led the way in the development, manufacture and marketing of innovative skincare products since 1953.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled } = await draftMode();

  return (
    <html lang="en">
      <body>
        <NinetailedProvider>
          <ContentfulLivePreviewProvider isEnabled={isEnabled}>
            {children}
          </ContentfulLivePreviewProvider>
        </NinetailedProvider>
      </body>
    </html>
  );
}
