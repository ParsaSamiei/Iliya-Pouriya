import { z } from "zod";

const shortText = z.string().trim().min(1).max(120);
const mediumText = z.string().trim().min(1).max(280);
const longText = z.string().trim().min(1).max(600);

export const landingCapabilitySchema = z.object({
  titleEn: shortText,
  titleFa: shortText,
  descEn: longText,
  descFa: longText,
});

export const landingCopySchema = z.object({
  heroNameAEn: shortText,
  heroNameAFa: shortText,
  heroNameBEn: shortText,
  heroNameBFa: shortText,
  heroTitleEn: mediumText,
  heroTitleFa: mediumText,
  heroSubtitleEn: longText,
  heroSubtitleFa: longText,
  ctaViewProjectsEn: shortText,
  ctaViewProjectsFa: shortText,
  ctaMeetTeamEn: shortText,
  ctaMeetTeamFa: shortText,

  teamEyebrowEn: shortText,
  teamEyebrowFa: shortText,
  meetTheTeamEn: shortText,
  meetTheTeamFa: shortText,
  meetTheTeamSubtitleEn: mediumText,
  meetTheTeamSubtitleFa: mediumText,

  projectsEyebrowEn: shortText,
  projectsEyebrowFa: shortText,
  featuredProjectsEn: shortText,
  featuredProjectsFa: shortText,
  featuredProjectsSubtitleEn: mediumText,
  featuredProjectsSubtitleFa: mediumText,
  viewAllProjectsEn: shortText,
  viewAllProjectsFa: shortText,

  statusBoardEyebrowEn: shortText,
  statusBoardEyebrowFa: shortText,
  statusBoardTitleEn: shortText,
  statusBoardTitleFa: shortText,
  statusBoardSubtitleEn: mediumText,
  statusBoardSubtitleFa: mediumText,
  statusBoardEmptyEn: mediumText,
  statusBoardEmptyFa: mediumText,
  statusBoardActiveCount: z.number().int().min(0).max(9999),
  statusBoardFieldCount: z.number().int().min(0).max(9999),
  statusBoardCompleteCount: z.number().int().min(0).max(9999),

  capabilitiesEyebrowEn: shortText,
  capabilitiesEyebrowFa: shortText,
  capabilitiesTitleEn: shortText,
  capabilitiesTitleFa: shortText,
  capabilitiesSubtitleEn: mediumText,
  capabilitiesSubtitleFa: mediumText,
  capabilities: z.array(landingCapabilitySchema).min(1).max(8),

  blogEyebrowEn: shortText,
  blogEyebrowFa: shortText,
  latestPostsEn: shortText,
  latestPostsFa: shortText,
  latestPostsSubtitleEn: mediumText,
  latestPostsSubtitleFa: mediumText,
  viewAllPostsEn: shortText,
  viewAllPostsFa: shortText,

  recommendationsEyebrowEn: shortText,
  recommendationsEyebrowFa: shortText,
  recommendationsTitleEn: shortText,
  recommendationsTitleFa: shortText,
  recommendationsSubtitleEn: mediumText,
  recommendationsSubtitleFa: mediumText,

  clientsEyebrowEn: shortText,
  clientsEyebrowFa: shortText,
  clientsTitleEn: shortText,
  clientsTitleFa: shortText,
  clientsSubtitleEn: mediumText,
  clientsSubtitleFa: mediumText,

  contactEyebrowEn: shortText,
  contactEyebrowFa: shortText,
  contactTitleEn: shortText,
  contactTitleFa: shortText,
  contactSubtitleEn: mediumText,
  contactSubtitleFa: mediumText,
  ctaContactEn: shortText,
  ctaContactFa: shortText,
});

export type LandingCapability = z.infer<typeof landingCapabilitySchema>;
export type LandingCopyData = z.infer<typeof landingCopySchema>;
