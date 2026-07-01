export interface ServiceRecord {
  id: string;
  title: string;
  description: string;
  deliverable: string;
  businessResult: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  icon: string;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PillarRecord {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  published: boolean;
}

export interface MarketStatRecord {
  id: string;
  value: string;
  label: string;
  source: string;
  order: number;
  published: boolean;
}

export interface IndustryRecord {
  id: string;
  name: string;
  description: string;
  icon: string;
  projects: string[];
  order: number;
  published: boolean;
}

export interface RiskItemRecord {
  id: string;
  title: string;
  description: string;
  order: number;
  published: boolean;
}

export interface SuccessStoryRecord {
  id: string;
  title: string;
  client: string;
  description: string;
  metric: string;
  image: string;
  order: number;
  published: boolean;
}

export interface TeamMemberRecord {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  twitter: string | null;
  github: string | null;
  order: number;
  published: boolean;
}

export interface MessageRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface SiteContentRecord {
  id: string;

  // Hero / Home
  heroWelcome: string;
  heroBadge1: string;
  heroBadge2: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroTagline: string;
  heroCtaPrimaryLabel: string;
  heroCtaPrimaryHref: string;
  heroCtaSecondaryLabel: string;
  heroCtaSecondaryHref: string;
  heroBackgroundImage: string;

  // Hero statistics
  stat1Value: number;
  stat1Prefix: string;
  stat1Suffix: string;
  stat1Label: string;
  stat2Value: number;
  stat2Prefix: string;
  stat2Suffix: string;
  stat2Label: string;
  stat3Value: number;
  stat3Prefix: string;
  stat3Suffix: string;
  stat3Label: string;

  // About
  aboutLabel: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutBody: string;
  aboutStory: string;
  aboutImage: string;
  aboutHighlight1Title: string;
  aboutHighlight1Desc: string;
  aboutHighlight2Title: string;
  aboutHighlight2Desc: string;
  aboutHighlight3Title: string;
  aboutHighlight3Desc: string;
  aboutHighlight4Title: string;
  aboutHighlight4Desc: string;

  // Pillars
  pillarsLabel: string;
  pillarsTitle: string;
  pillarsSubtitle: string;

  // Services
  servicesLabel: string;
  servicesTitle: string;
  servicesSubtitle: string;

  // Impact
  impactLabel: string;
  impactTitle: string;
  impactSubtitle: string;
  opportunityTitle: string;
  opportunityBody: string;
  opportunityRisk: string;
  leadershipMessage: string;
  storiesLabel: string;
  storiesTitle: string;
  storiesSubtitle: string;

  // Industries
  industriesLabel: string;
  industriesTitle: string;
  industriesSubtitle: string;

  // Cost of inaction (risks)
  risksLabel: string;
  risksTitle: string;
  risksSubtitle: string;

  // Mission & vision
  missionLabel: string;
  missionTitle: string;
  missionText: string;
  visionText: string;
  quote: string;
  quoteAuthor: string;

  // Team
  teamLabel: string;
  teamTitle: string;
  teamSubtitle: string;

  // Contact
  contactLabel: string;
  contactTitle: string;
  contactSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  contactPhoneAlt: string;
  contactAddress: string;
  contactHours: string;
  contactMapEmbed: string;
  contactFormEnabled: boolean;

  // Social
  socialLinkedin: string;
  socialTwitter: string;
  socialGithub: string;
  socialFacebook: string;
  socialInstagram: string;

  footerTagline: string;
}

export interface PublicSiteData {
  content: SiteContentRecord;
  services: ServiceRecord[];
  pillars: PillarRecord[];
  marketStats: MarketStatRecord[];
  industries: IndustryRecord[];
  riskItems: RiskItemRecord[];
  successStories: SuccessStoryRecord[];
  team: TeamMemberRecord[];
}

export interface SiteData {
  content: SiteContentRecord;
  services: ServiceRecord[];
  pillars: PillarRecord[];
  marketStats: MarketStatRecord[];
  industries: IndustryRecord[];
  riskItems: RiskItemRecord[];
  successStories: SuccessStoryRecord[];
  team: TeamMemberRecord[];
  messages: MessageRecord[];
}

export type CollectionKey =
  | "services"
  | "pillars"
  | "marketStats"
  | "industries"
  | "riskItems"
  | "successStories"
  | "team";
