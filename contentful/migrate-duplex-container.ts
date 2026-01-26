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

const validSpaceId: string = spaceId;
const validManagementToken: string = managementToken;

async function runMigration() {
  const client = createClient({
    accessToken: validManagementToken,
  });

  const space = await client.getSpace(validSpaceId);
  const environment = await space.getEnvironment(environmentId);

  console.log('Starting Duplex Container migration...');

  // Create Duplex Container content type
  console.log('Creating DuplexContainer content type...');
  try {
    const duplexContainerContentType = await environment.createContentTypeWithId('duplexContainer', {
      name: 'Duplex Container',
      description: 'A two-column layout with image on one side and content on the other',
      displayField: 'title',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          required: true,
          localized: false,
          validations: [
            {
              size: {
                max: 100,
              },
              message: 'Title should be 100 characters or less',
            },
          ],
        },
        {
          id: 'subtitle',
          name: 'Subtitle',
          type: 'Text',
          required: false,
          localized: false,
          validations: [
            {
              size: {
                max: 500,
              },
              message: 'Subtitle should be 500 characters or less',
            },
          ],
        },
        {
          id: 'image',
          name: 'Image',
          type: 'Link',
          linkType: 'Asset',
          required: true,
          localized: false,
          validations: [
            {
              linkMimetypeGroup: ['image'],
              message: 'Must be an image file',
            },
          ],
        },
        {
          id: 'imagePosition',
          name: 'Image Position',
          type: 'Symbol',
          required: false,
          localized: false,
          validations: [
            {
              in: ['Left', 'Right'],
            },
          ],
        },
        {
          id: 'ctaText',
          name: 'CTA Button Text',
          type: 'Symbol',
          required: false,
          localized: false,
          validations: [
            {
              size: {
                max: 50,
              },
              message: 'CTA text should be 50 characters or less',
            },
          ],
        },
        {
          id: 'ctaUrl',
          name: 'CTA Destination URL',
          type: 'Symbol',
          required: false,
          localized: false,
          validations: [
            {
              regexp: {
                pattern: '^(https?:\\/\\/|\\/).*',
                flags: '',
              },
              message: 'Must be a valid URL starting with http://, https://, or /',
            },
          ],
        },
      ],
    });
    await duplexContainerContentType.publish();
    console.log('✓ DuplexContainer content type created');
  } catch (error: any) {
    if (error.name === 'Conflict') {
      console.log('DuplexContainer content type already exists, updating...');
      try {
        const existingContentType = await environment.getContentType('duplexContainer');
        existingContentType.fields = [
          {
            id: 'title',
            name: 'Title',
            type: 'Symbol',
            required: true,
            localized: false,
            validations: [
              {
                size: {
                  max: 100,
                },
                message: 'Title should be 100 characters or less',
              },
            ],
          },
          {
            id: 'subtitle',
            name: 'Subtitle',
            type: 'Text',
            required: false,
            localized: false,
            validations: [
              {
                size: {
                  max: 500,
                },
                message: 'Subtitle should be 500 characters or less',
              },
            ],
          },
          {
            id: 'image',
            name: 'Image',
            type: 'Link',
            linkType: 'Asset',
            required: true,
            localized: false,
            validations: [
              {
                linkMimetypeGroup: ['image'],
                message: 'Must be an image file',
              },
            ],
          },
          {
            id: 'imagePosition',
            name: 'Image Position',
            type: 'Symbol',
            required: false,
            localized: false,
            validations: [
              {
                in: ['Left', 'Right'],
              },
            ],
          },
          {
            id: 'ctaText',
            name: 'CTA Button Text',
            type: 'Symbol',
            required: false,
            localized: false,
            validations: [
              {
                size: {
                  max: 50,
                },
                message: 'CTA text should be 50 characters or less',
              },
            ],
          },
          {
            id: 'ctaUrl',
            name: 'CTA Destination URL',
            type: 'Symbol',
            required: false,
            localized: false,
            validations: [
              {
                regexp: {
                  pattern: '^(https?:\\/\\/|\\/).*',
                  flags: '',
                },
                message: 'Must be a valid URL starting with http://, https://, or /',
              },
            ],
          },
        ];
        const updatedContentType = await existingContentType.update();
        await updatedContentType.publish();
        console.log('✓ DuplexContainer content type updated');
      } catch (updateError: any) {
        console.error('Failed to update DuplexContainer:', updateError.message);
      }
    } else {
      throw error;
    }
  }

  // Update Page content type to include duplexContainer in modules
  console.log('Updating Page content type to include duplexContainer...');
  try {
    const pageContentType = await environment.getContentType('page');
    
    const modulesField = pageContentType.fields.find((f: any) => f.id === 'modules');
    if (modulesField && modulesField.items && modulesField.items.validations) {
      const linkValidation = modulesField.items.validations.find((v: any) => v.linkContentType);
      if (linkValidation && linkValidation.linkContentType && !linkValidation.linkContentType.includes('duplexContainer')) {
        linkValidation.linkContentType.push('duplexContainer');
        pageContentType.fields = pageContentType.fields.map((f: any) => 
          f.id === 'modules' ? modulesField : f
        );
        const updatedContentType = await pageContentType.update();
        await updatedContentType.publish();
        console.log('✓ Page content type updated to include duplexContainer');
      } else if (linkValidation && linkValidation.linkContentType) {
        console.log('Page content type already includes duplexContainer');
      } else {
        console.log('Could not find linkContentType validation on modules field');
      }
    }
  } catch (error: any) {
    console.error('Failed to update Page content type:', error.message);
  }

  console.log('\n✅ Duplex Container migration completed successfully!');
}

runMigration().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
