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

  console.log('Adding Image Location field to Hero content type...');

  try {
    const heroContentType = await environment.getContentType('hero');
    
    // Check if field already exists
    const existingField = heroContentType.fields.find((f: any) => f.id === 'imageLocation');
    if (existingField) {
      console.log('imageLocation field already exists on Hero content type');
      return;
    }

    // Add the new field
    heroContentType.fields.push({
      id: 'imageLocation',
      name: 'Image Location',
      type: 'Symbol',
      required: false,
      localized: false,
      validations: [
        {
          in: ['Right side', 'Right overlay'],
        },
      ],
      defaultValue: {
        'en-US': 'Right side',
      },
    });

    const updatedContentType = await heroContentType.update();
    await updatedContentType.publish();
    console.log('✓ imageLocation field added to Hero content type');
  } catch (error: any) {
    console.error('Failed to update Hero content type:', error.message);
    throw error;
  }

  console.log('\n✅ Hero Image Location migration completed successfully!');
}

runMigration().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});

