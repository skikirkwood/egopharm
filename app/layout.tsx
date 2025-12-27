import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ego Pharmaceuticals - The Science of Healthy Skin',
  description: 'Proudly Australian owned, Ego Pharmaceuticals has led the way in the development, manufacture and marketing of innovative skincare products since 1953.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

