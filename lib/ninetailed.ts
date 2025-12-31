import { ExperienceMapper } from '@ninetailed/experience.js-utils-contentful';
import { Module } from '@/types/contentful';

/**
 * Maps a Contentful entry with nt_experiences to the format expected by Ninetailed's Experience component
 */
export function mapExperience(entry: Module) {
  return ExperienceMapper.mapExperience(entry as any);
}

/**
 * Checks if an entry has personalization experiences attached
 */
export function hasExperiences(entry: Module): boolean {
  return Boolean(entry.fields && 'nt_experiences' in entry.fields && (entry.fields as any).nt_experiences?.length > 0);
}

