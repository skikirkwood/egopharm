import { createClient, ContentfulClientApi } from 'contentful';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN!;
const previewToken = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN!;
const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';

if (!spaceId || !accessToken) {
  throw new Error('Contentful space ID and access token must be provided');
}

// Delivery API client (published content)
export const contentfulClient: ContentfulClientApi<undefined> = createClient({
  space: spaceId,
  accessToken: accessToken,
  environment: environment,
});

// Preview API client (draft content)
export const contentfulPreviewClient: ContentfulClientApi<undefined> = createClient({
  space: spaceId,
  accessToken: previewToken || accessToken,
  environment: environment,
  host: 'preview.contentful.com',
});

// Get the appropriate client based on preview mode
export function getContentfulClient(preview: boolean = false): ContentfulClientApi<undefined> {
  return preview ? contentfulPreviewClient : contentfulClient;
}
