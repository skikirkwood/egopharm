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

  console.log('Starting Featured News migration...');

  // Create Featured News Item content type
  console.log('Creating FeaturedNewsItem content type...');
  try {
    const featuredNewsItemContentType = await environment.createContentTypeWithId('featuredNewsItem', {
      name: 'Featured News Item',
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
          id: 'image',
          name: 'Image',
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
          id: 'url',
          name: 'URL',
          type: 'Symbol',
          required: false,
          localized: false,
        },
      ],
    });
    await featuredNewsItemContentType.publish();
    console.log('✓ FeaturedNewsItem content type created');
  } catch (error: any) {
    if (error.name === 'Conflict') {
      console.log('FeaturedNewsItem content type already exists');
    } else {
      throw error;
    }
  }

  // Create Featured News content type
  console.log('Creating FeaturedNews content type...');
  try {
    const featuredNewsContentType = await environment.createContentTypeWithId('featuredNews', {
      name: 'Featured News',
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
                linkContentType: ['featuredNewsItem'],
              },
            ],
          },
        },
      ],
    });
    await featuredNewsContentType.publish();
    console.log('✓ FeaturedNews content type created');
  } catch (error: any) {
    if (error.name === 'Conflict') {
      console.log('FeaturedNews content type already exists');
    } else {
      throw error;
    }
  }

  // Update Page content type to include featuredNews in modules
  console.log('Updating Page content type to include featuredNews...');
  try {
    const pageContentType = await environment.getContentType('page');
    
    // Find the modules field and update its validations
    const modulesField = pageContentType.fields.find((f: any) => f.id === 'modules');
    if (modulesField && modulesField.items && modulesField.items.validations) {
      const linkValidation = modulesField.items.validations.find((v: any) => v.linkContentType);
      if (linkValidation && linkValidation.linkContentType && !linkValidation.linkContentType.includes('featuredNews')) {
        linkValidation.linkContentType.push('featuredNews');
        pageContentType.fields = pageContentType.fields.map((f: any) => 
          f.id === 'modules' ? modulesField : f
        );
        const updatedContentType = await pageContentType.update();
        await updatedContentType.publish();
        console.log('✓ Page content type updated to include featuredNews');
      } else if (linkValidation && linkValidation.linkContentType) {
        console.log('Page content type already includes featuredNews');
      } else {
        console.log('Could not find linkContentType validation on modules field');
      }
    }
  } catch (error: any) {
    console.error('Failed to update Page content type:', error.message);
  }

  console.log('\n✅ Featured News migration completed successfully!');
}

runMigration().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});

