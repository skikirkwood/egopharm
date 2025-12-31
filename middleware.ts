import { NextRequest, NextResponse } from 'next/server';
import { NinetailedApiClient } from '@ninetailed/experience.js-shared';

// Initialize the Ninetailed API client for edge
const ninetailedApiClient = new NinetailedApiClient({
  clientId: process.env.NEXT_PUBLIC_NINETAILED_API_KEY!,
  environment: process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT || 'main',
});

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

  try {
    // Get or create profile ID from cookie
    let profileId = request.cookies.get(NINETAILED_PROFILE_ID_COOKIE)?.value;
    const isNewVisitor = !profileId;

    let profileResponse;

    if (profileId) {
      // Returning visitor - get existing profile
      try {
        profileResponse = await ninetailedApiClient.getProfile(profileId);
      } catch (e) {
        // Profile might not exist, create a new one
        profileId = undefined;
      }
    }

    if (!profileId) {
      // New visitor - create profile
      profileId = crypto.randomUUID();
      profileResponse = await ninetailedApiClient.createProfile({
        events: [],
      });
      // Use the ID from the created profile
      if (profileResponse?.profile?.id) {
        profileId = profileResponse.profile.id;
      }
    }

    // Store profile ID in cookie
    response.cookies.set(NINETAILED_PROFILE_ID_COOKIE, profileId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    // Store experiences data for the page to use
    if (profileResponse?.experiences) {
      const experiencesData = JSON.stringify(profileResponse.experiences);
      response.cookies.set(NINETAILED_EXPERIENCES_COOKIE, experiencesData, {
        httpOnly: false, // Needs to be readable by client
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 5, // 5 minutes - short lived as it may change
      });
    }

    // Also set the profile data for debugging/client SDK
    if (profileResponse?.profile) {
      response.cookies.set('ninetailed_profile', JSON.stringify({
        id: profileResponse.profile.id,
        audiences: profileResponse.profile.audiences,
        traits: profileResponse.profile.traits,
        session: {
          isReturningVisitor: !isNewVisitor,
          count: profileResponse.profile.session?.count || 1,
        },
      }), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 5,
      });
    }

  } catch (error) {
    console.error('[Ninetailed Middleware] Error:', error);
    // Continue without personalization on error
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
