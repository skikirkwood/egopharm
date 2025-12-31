import { getContentfulClient } from './contentful';

export { ExperienceMapper } from '@ninetailed/experience.js-utils-contentful';

export interface NinetailedAudience {
  sys: {
    id: string;
  };
  fields: {
    nt_name: string;
    nt_audience_id: string;
    nt_description?: string;
    nt_rules: any;
  };
}

/**
 * Fetch all published audiences from Contentful
 */
export async function getAudiences(preview: boolean = false): Promise<NinetailedAudience[]> {
  try {
    const client = getContentfulClient(preview);
    const entries = await client.getEntries({
      content_type: 'nt_audience',
      include: 2,
      limit: 100,
    });

    return entries.items.map((item: any) => ({
      sys: { id: item.sys.id },
      fields: {
        nt_name: item.fields.nt_name,
        nt_audience_id: item.fields.nt_audience_id,
        nt_description: item.fields.nt_description,
        nt_rules: item.fields.nt_rules,
      },
    }));
  } catch (error) {
    console.error('Error fetching Ninetailed audiences:', error);
    return [];
  }
}

/**
 * Map audience data for Ninetailed SDK format
 */
export function mapAudiencesForSDK(audiences: NinetailedAudience[]) {
  return audiences.map((audience) => ({
    id: audience.fields.nt_audience_id,
    name: audience.fields.nt_name,
    description: audience.fields.nt_description || '',
    ...audience.fields.nt_rules,
  }));
}
