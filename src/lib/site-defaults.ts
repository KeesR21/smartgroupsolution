import {
  MAIN_INDUSTRIES,
  MAIN_PILLARS,
  MAIN_SERVICES,
  MAIN_TEAM,
  MARKET_STATS,
  RISK_ITEMS,
  SITE_CONTENT,
} from "@/lib/company-content";
import type { SiteContentRecord, SiteData } from "@/types/cms";

const STATIC_TIMESTAMP = "2024-01-01T00:00:00.000Z";

const DEFAULT_MAP_EMBED =
  "https://maps.google.com/maps?q=San+Francisco+CA&t=&z=13&ie=UTF8&iwloc=&output=embed";

export function defaultContent(): SiteContentRecord {
  return {
    id: "main",
    ...SITE_CONTENT,

    heroCtaPrimaryLabel: "Request Assessment",
    heroCtaPrimaryHref: "#contact",
    heroCtaSecondaryLabel: "View Solutions",
    heroCtaSecondaryHref: "#services",
    heroBackgroundImage: "",

    aboutStory:
      "Founded to close the gap between ambitious African enterprises and world-class technology, Smart Group Solution brings AI, security, and cloud engineering under one accountable roof.",
    aboutImage: "",

    storiesLabel: "Success Stories",
    storiesTitle: "Outcomes we are proud of",
    storiesSubtitle:
      "Real engagements where disciplined modernization produced measurable business results.",

    contactPhoneAlt: "",
    contactHours: "Monday – Friday, 9:00 AM – 5:00 PM",
    contactMapEmbed: DEFAULT_MAP_EMBED,
    contactFormEnabled: true,

    socialLinkedin: "",
    socialTwitter: "",
    socialGithub: "",
    socialFacebook: "",
    socialInstagram: "",
  };
}

const DEFAULT_STORIES = [
  {
    title: "Faster loan decisions for a regional bank",
    client: "Banking",
    description:
      "Deployed an AI intake and triage agent with human approval, cutting first-response time dramatically while keeping full audit trails.",
    metric: "60% faster response",
    image: "",
  },
  {
    title: "Zero-downtime network for a multi-branch insurer",
    client: "Insurance",
    description:
      "Rebuilt connectivity with redundant links, SD-WAN, and segmentation so claims and payments never stop.",
    metric: "99.98% uptime",
    image: "",
  },
  {
    title: "Ransomware-ready healthcare provider",
    client: "Healthcare",
    description:
      "Implemented Zero Trust, DLP, and tested recovery playbooks to protect patient data and continuity of care.",
    metric: "4x faster recovery",
    image: "",
  },
];

export function defaultSiteData(): SiteData {
  return {
    content: defaultContent(),
    services: MAIN_SERVICES.map((s, i) => ({
      id: `service-${i + 1}`,
      title: s.title,
      description: s.description,
      deliverable: s.deliverable,
      businessResult: s.businessResult,
      features: [],
      ctaLabel: "",
      ctaHref: "",
      icon: s.icon,
      order: i,
      published: true,
      createdAt: STATIC_TIMESTAMP,
      updatedAt: STATIC_TIMESTAMP,
    })),
    pillars: MAIN_PILLARS.map((p, i) => ({
      id: `pillar-${i + 1}`,
      title: p.title,
      description: p.description,
      icon: p.icon,
      order: i,
      published: true,
    })),
    marketStats: MARKET_STATS.map((s, i) => ({
      id: `stat-${i + 1}`,
      value: s.value,
      label: s.label,
      source: s.source,
      order: i,
      published: true,
    })),
    industries: MAIN_INDUSTRIES.map((ind, i) => ({
      id: `industry-${i + 1}`,
      name: ind.name,
      description: ind.description,
      icon: ind.icon,
      projects: [],
      order: i,
      published: true,
    })),
    riskItems: RISK_ITEMS.map((r, i) => ({
      id: `risk-${i + 1}`,
      title: r.title,
      description: r.description,
      order: i,
      published: true,
    })),
    successStories: DEFAULT_STORIES.map((s, i) => ({
      id: `story-${i + 1}`,
      title: s.title,
      client: s.client,
      description: s.description,
      metric: s.metric,
      image: s.image,
      order: i,
      published: true,
    })),
    team: MAIN_TEAM.map((t, i) => ({
      id: `team-${i + 1}`,
      name: t.name,
      role: t.role,
      bio: "",
      image: t.image,
      email: null,
      phone: null,
      linkedin: "linkedin" in t ? t.linkedin : null,
      twitter: "twitter" in t ? t.twitter : null,
      github: "github" in t ? t.github : null,
      order: i,
      published: true,
    })),
    messages: [],
  };
}
