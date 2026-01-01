import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { secret, slug } = req.query;

  // Check the secret
  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Enable Preview Mode by setting cookies
  res.setPreviewData({});

  // Redirect to the path from slug or default to home
  const redirectPath = slug === 'home' || !slug ? '/' : `/${slug}`;
  res.redirect(redirectPath);
}

