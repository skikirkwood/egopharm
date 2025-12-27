import { createClient } from 'contentful';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN!;
const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';

if (!spaceId || !accessToken) {
  throw new Error('Contentful space ID and access token must be provided');
}

export const contentfulClient = createClient({
  space: spaceId,
  accessToken: accessToken,
  environment: environment,
});

