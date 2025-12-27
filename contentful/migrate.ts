import { createClient } from 'contentful-management';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Try loading .env.local first, then .env
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const environmentId = process.env.CONTENTFUL_ENVIRONMENT || 'master';

if (!spaceId || !managementToken) {
  throw new Error('CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN must be set');
}

// Type assertion after the check
const validSpaceId: string = spaceId;
const validManagementToken: string = managementToken;

async function runMigration() {
  const client = createClient({
    accessToken: validManagementToken,
  });

  const space = await client.getSpace(validSpaceId);
  const environment = await space.getEnvironment(environmentId);

  console.log('Starting Contentful migration...');

  // Create Navigation content type
  console.log('Creating Navigation content type...');
  let navigationContentType;
  try {
    navigationContentType = await environment.createContentTypeWithId('navigation', {
      name: 'Navigation',
      displayField: 'title',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          required: true,
          localized: false,
        },
        {
          id: 'items',
          name: 'Navigation Items',
          type: 'Array',
          required: false,
          localized: false,
          items: {
            type: 'Link',
            linkType: 'Entry',
            validations: [
              {
                linkContentType: ['navigationItem'],
              },
            ],
          },
        },
      ],
    });
    await navigationContentType.publish();
    console.log('✓ Navigation content type created');
  } catch (error: any) {
    if (error.name === 'Conflict') {
      console.log('Navigation content type already exists, updating...');
      navigationContentType = await environment.getContentType('navigation');
      navigationContentType.fields = [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          required: true,
          localized: false,
        },
        {
          id: 'items',
          name: 'Navigation Items',
          type: 'Array',
          required: false,
          localized: false,
          items: {
            type: 'Link',
            linkType: 'Entry',
            validations: [
              {
                linkContentType: ['navigationItem'],
              },
            ],
          },
        },
      ];
      navigationContentType = await navigationContentType.update();
      await navigationContentType.publish();
      console.log('✓ Navigation content type updated');
    } else {
      throw error;
    }
  }

  // Create NavigationItem content type
  console.log('Creating NavigationItem content type...');
  try {
    const navigationItemContentType = await environment.createContentTypeWithId('navigationItem', {
      name: 'Navigation Item',
      displayField: 'label',
      fields: [
        {
          id: 'label',
          name: 'Label',
          type: 'Symbol',
          required: true,
          localized: false,
        },
        {
          id: 'url',
          name: 'URL',
          type: 'Symbol',
          required: true,
          localized: false,
        },
        {
          id: 'children',
          name: 'Children',
          type: 'Array',
          required: false,
          localized: false,
          items: {
            type: 'Link',
            linkType: 'Entry',
            validations: [
              {
                linkContentType: ['navigationItem'],
              },
            ],
          },
        },
      ],
    });
    await navigationItemContentType.publish();
    console.log('✓ NavigationItem content type created');
  } catch (error: any) {
    if (error.name === 'Conflict') {
      console.log('NavigationItem content type already exists');
    } else {
      throw error;
    }
  }

  // Create Hero content type
  console.log('Creating Hero content type...');
  try {
    const heroContentType = await environment.createContentTypeWithId('hero', {
      name: 'Hero',
      displayField: 'title',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          required: true,
          localized: false,
        },
        {
          id: 'subtitle',
          name: 'Subtitle',
          type: 'Text',
          required: false,
          localized: false,
        },
        {
          id: 'backgroundImage',
          name: 'Background Image',
          type: 'Link',
          linkType: 'Asset',
          required: true,
          localized: false,
        },
        {
          id: 'ctaText',
          name: 'CTA Text',
          type: 'Symbol',
          required: false,
          localized: false,
        },
        {
          id: 'ctaLink',
          name: 'CTA Link',
          type: 'Symbol',
          required: false,
          localized: false,
        },
      ],
    });
    await heroContentType.publish();
    console.log('✓ Hero content type created');
  } catch (error: any) {
    if (error.name === 'Conflict') {
      console.log('Hero content type already exists');
    } else {
      throw error;
    }
  }

  // Create Infoblock content type
  console.log('Creating Infoblock content type...');
  try {
    const infoblockContentType = await environment.createContentTypeWithId('infoblock', {
      name: 'Infoblock',
      displayField: 'title',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          required: true,
          localized: false,
        },
        {
          id: 'body',
          name: 'Body',
          type: 'Text',
          required: true,
          localized: false,
        },
        {
          id: 'ctaText',
          name: 'CTA Text',
          type: 'Symbol',
          required: false,
          localized: false,
        },
        {
          id: 'ctaLink',
          name: 'CTA Link',
          type: 'Symbol',
          required: false,
          localized: false,
        },
        {
          id: 'backgroundImage',
          name: 'Background Image',
          type: 'Link',
          linkType: 'Asset',
          required: false,
          localized: false,
        },
      ],
    });
    await infoblockContentType.publish();
    console.log('✓ Infoblock content type created');
  } catch (error: any) {
    if (error.name === 'Conflict') {
      console.log('Infoblock content type already exists');
    } else {
      throw error;
    }
  }

  // Create ImageTriplex content type
  console.log('Creating ImageTriplex content type...');
  try {
    const imageTriplexContentType = await environment.createContentTypeWithId('imageTriplex', {
      name: 'Image Triplex',
      displayField: 'title',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          required: true,
          localized: false,
        },
        {
          id: 'items',
          name: 'Items',
          type: 'Array',
          required: true,
          localized: false,
          items: {
            type: 'Link',
            linkType: 'Entry',
            validations: [
              {
                linkContentType: ['imageTriplexItem'],
              },
            ],
          },
        },
      ],
    });
    await imageTriplexContentType.publish();
    console.log('✓ ImageTriplex content type created');
  } catch (error: any) {
    if (error.name === 'Conflict') {
      console.log('ImageTriplex content type already exists');
    } else {
      throw error;
    }
  }

  // Create ImageTriplexItem content type
  console.log('Creating ImageTriplexItem content type...');
  try {
    const imageTriplexItemContentType = await environment.createContentTypeWithId('imageTriplexItem', {
      name: 'Image Triplex Item',
      displayField: 'title',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          required: true,
          localized: false,
        },
        {
          id: 'backgroundImage',
          name: 'Background Image',
          type: 'Link',
          linkType: 'Asset',
          required: true,
          localized: false,
        },
        {
          id: 'body',
          name: 'Body',
          type: 'Text',
          required: true,
          localized: false,
        },
        {
          id: 'ctaText',
          name: 'CTA Text',
          type: 'Symbol',
          required: false,
          localized: false,
        },
        {
          id: 'ctaLink',
          name: 'CTA Link',
          type: 'Symbol',
          required: false,
          localized: false,
        },
      ],
    });
    await imageTriplexItemContentType.publish();
    console.log('✓ ImageTriplexItem content type created');
  } catch (error: any) {
    if (error.name === 'Conflict') {
      console.log('ImageTriplexItem content type already exists');
    } else {
      throw error;
    }
  }

  // Create Page content type
  console.log('Creating Page content type...');
  try {
    const pageContentType = await environment.createContentTypeWithId('page', {
      name: 'Page',
      displayField: 'title',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          required: true,
          localized: false,
        },
        {
          id: 'slug',
          name: 'Slug',
          type: 'Symbol',
          required: true,
          localized: false,
          validations: [
            {
              unique: true,
            },
          ],
        },
        {
          id: 'navigation',
          name: 'Navigation',
          type: 'Link',
          linkType: 'Entry',
          required: false,
          localized: false,
          validations: [
            {
              linkContentType: ['navigation'],
            },
          ],
        },
        {
          id: 'modules',
          name: 'Modules',
          type: 'Array',
          required: true,
          localized: false,
          items: {
            type: 'Link',
            linkType: 'Entry',
            validations: [
              {
                linkContentType: ['hero', 'infoblock', 'imageTriplex'],
              },
            ],
          },
        },
      ],
    });
    await pageContentType.publish();
    console.log('✓ Page content type created');
  } catch (error: any) {
    if (error.name === 'Conflict') {
      console.log('Page content type already exists');
    } else {
      throw error;
    }
  }

  console.log('\n✅ Migration completed successfully!');
}

runMigration().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
