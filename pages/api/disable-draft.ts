import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Clear the preview mode cookies
  res.clearPreviewData();

  // Redirect to home
  res.redirect('/');
}

