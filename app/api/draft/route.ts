import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug') || '/';

  // Check the secret and next parameters
  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  // Enable Draft Mode by setting the cookie
  const draft = await draftMode();
  draft.enable();

  // Map slug to actual route path
  // "home" slug maps to root path "/"
  let redirectPath = slug;
  if (slug === 'home' || slug === '/home') {
    redirectPath = '/';
  } else if (!slug.startsWith('/')) {
    redirectPath = `/${slug}`;
  }

  // Redirect to the path
  redirect(redirectPath);
}
