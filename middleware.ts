import { NextRequest, NextResponse } from 'next/server';

// Cookie names
const NINETAILED_PROFILE_ID_COOKIE = 'ninetailed_id';
const NINETAILED_EXPERIENCES_COOKIE = 'ninetailed_experiences';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Only process page requests, skip API routes and static files
  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return response;
  }

  // Always set a test cookie to verify middleware is running
  response.cookies.set('middleware_test', new Date().toISOString(), {
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 5,
  });

  try {
    // Get or create profile ID from cookie
    let profileId = request.cookies.get(NINETAILED_PROFILE_ID_COOKIE)?.value;
    const isNewVisitor = !profileId;

    if (!profileId) {
      profileId = crypto.randomUUID();
    }

    // Store profile ID in cookie
    response.cookies.set(NINETAILED_PROFILE_ID_COOKIE, profileId, {
      httpOnly: false, // Changed to false so we can read it client-side
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    // Check if we have the API key
    const apiKey = process.env.NEXT_PUBLIC_NINETAILED_API_KEY;
    if (!apiKey) {
      console.error('[Ninetailed Middleware] No API key configured');
      return response;
    }

    // Call Ninetailed API directly using fetch
    const environment = process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT || 'main';
    const apiUrl = `https://experience.ninetailed.co/v2/organizations/${apiKey}/environments/${environment}/profiles/${profileId}`;
    
    const apiResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!apiResponse.ok) {
      // Profile doesn't exist, create it
      const createUrl = `https://experience.ninetailed.co/v2/organizations/${apiKey}/environments/${environment}/profiles`;
      const createResponse = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events: [],
        }),
      });

      if (createResponse.ok) {
        const data = await createResponse.json();
        
        if (data.profile?.id) {
          profileId = data.profile.id;
          response.cookies.set(NINETAILED_PROFILE_ID_COOKIE, profileId!, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365,
          });
        }

        if (data.experiences) {
          response.cookies.set(NINETAILED_EXPERIENCES_COOKIE, JSON.stringify(data.experiences), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 5,
          });
        }

        if (data.profile) {
          response.cookies.set('ninetailed_profile', JSON.stringify({
            id: data.profile.id,
            audiences: data.profile.audiences || [],
            session: { isReturningVisitor: false, count: 1 },
          }), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 5,
          });
        }
      }
    } else {
      const data = await apiResponse.json();

      if (data.experiences) {
        response.cookies.set(NINETAILED_EXPERIENCES_COOKIE, JSON.stringify(data.experiences), {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 5,
        });
      }

      if (data.profile) {
        response.cookies.set('ninetailed_profile', JSON.stringify({
          id: data.profile.id,
          audiences: data.profile.audiences || [],
          session: { isReturningVisitor: !isNewVisitor, count: data.profile.session?.count || 1 },
        }), {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 5,
        });
      }
    }

  } catch (error) {
    console.error('[Ninetailed Middleware] Error:', error);
    // Set an error cookie for debugging
    response.cookies.set('middleware_error', String(error), {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 5,
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
