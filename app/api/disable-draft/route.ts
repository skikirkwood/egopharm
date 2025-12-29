import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || '/';

  // Disable Draft Mode by removing the cookie
  const draft = await draftMode();
  draft.disable();

  // Redirect to the path
  redirect(slug);
}

