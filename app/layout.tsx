import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import './globals.css';
import ContentfulLivePreviewProvider from '@/components/ContentfulLivePreviewProvider';

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
        <ContentfulLivePreviewProvider isEnabled={isEnabled}>
          {children}
        </ContentfulLivePreviewProvider>
      </body>
    </html>
  );
}
