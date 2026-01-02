import { getContentfulClient } from './contentful';
import {
  ExperienceMapper,
  AudienceMapper,
  ExperienceEntryLike,
  AudienceEntryLike,
} from '@ninetailed/experience.js-utils-contentful';

export { ExperienceMapper } from '@ninetailed/experience.js-utils-contentful';

/**
 * Fetch all Ninetailed experiences from Contentful (for preview widget)
 */
export async function getAllExperiences(preview: boolean = false) {
  const client = getContentfulClient(preview);

  const entries = await client.getEntries({
    content_type: 'nt_experience',
    include: 1,
  });

  const experiences = entries.items as ExperienceEntryLike[];

  const mappedExperiences = (experiences || [])
    .filter((entry) => ExperienceMapper.isExperienceEntry(entry))
    .map((entry) => ExperienceMapper.mapExperience(entry));

  return mappedExperiences;
}

/**
 * Fetch all Ninetailed audiences from Contentful (for preview widget)
 */
export async function getAllAudiences(preview: boolean = false) {
  const client = getContentfulClient(preview);

  const entries = await client.getEntries({
    content_type: 'nt_audience',
    include: 0,
  });

  const audiences = entries.items as AudienceEntryLike[];

  const mappedAudiences = (audiences || [])
    .filter((entry) => AudienceMapper.isAudienceEntry(entry))
    .map((entry) => AudienceMapper.mapAudience(entry));

  return mappedAudiences;
}
