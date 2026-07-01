import type { SettingsGroup } from "@/components/admin/SectionSettingsForm";

export const HOME_GROUPS: SettingsGroup[] = [
  {
    title: "Hero",
    description: "The first thing visitors see at the top of the page.",
    fields: [
      { key: "heroWelcome", label: "Welcome text", type: "text", max: 120, span: 2 },
      { key: "heroTitle", label: "Main title", type: "text", required: true, max: 120, span: 2 },
      { key: "heroSubtitle", label: "Subtitle", type: "text", max: 160, span: 2 },
      { key: "heroTagline", label: "Tagline", type: "text", max: 200, span: 2 },
      {
        key: "heroDescription",
        label: "Description",
        type: "textarea",
        rows: 3,
        max: 400,
        span: 2,
      },
      { key: "heroBadge1", label: "Badge 1", type: "text", max: 40 },
      { key: "heroBadge2", label: "Badge 2", type: "text", max: 40 },
    ],
  },
  {
    title: "Call-to-action buttons",
    fields: [
      { key: "heroCtaPrimaryLabel", label: "Primary button label", type: "text", max: 40 },
      { key: "heroCtaPrimaryHref", label: "Primary button link", type: "text", placeholder: "#contact" },
      { key: "heroCtaSecondaryLabel", label: "Secondary button label", type: "text", max: 40 },
      { key: "heroCtaSecondaryHref", label: "Secondary button link", type: "text", placeholder: "#services" },
    ],
  },
  {
    title: "Background",
    description: "Optional background image behind the hero (leave blank for the animated universe).",
    fields: [{ key: "heroBackgroundImage", label: "Background image", type: "image", span: 2 }],
  },
  {
    title: "Featured statistics",
    fields: [
      { key: "stat1Value", label: "Stat 1 value", type: "number" },
      { key: "stat1Prefix", label: "Stat 1 prefix", type: "text", max: 5 },
      { key: "stat1Suffix", label: "Stat 1 suffix", type: "text", max: 5 },
      { key: "stat1Label", label: "Stat 1 label", type: "textarea", rows: 2, max: 120, span: 2 },
      { key: "stat2Value", label: "Stat 2 value", type: "number" },
      { key: "stat2Prefix", label: "Stat 2 prefix", type: "text", max: 5 },
      { key: "stat2Suffix", label: "Stat 2 suffix", type: "text", max: 5 },
      { key: "stat2Label", label: "Stat 2 label", type: "textarea", rows: 2, max: 120, span: 2 },
      { key: "stat3Value", label: "Stat 3 value", type: "number" },
      { key: "stat3Prefix", label: "Stat 3 prefix", type: "text", max: 5 },
      { key: "stat3Suffix", label: "Stat 3 suffix", type: "text", max: 5 },
      { key: "stat3Label", label: "Stat 3 label", type: "textarea", rows: 2, max: 120, span: 2 },
    ],
  },
];

export const ABOUT_GROUPS: SettingsGroup[] = [
  {
    title: "About section",
    fields: [
      { key: "aboutLabel", label: "Section label", type: "text", max: 40 },
      { key: "aboutTitle", label: "Heading", type: "text", required: true, max: 120 },
      { key: "aboutSubtitle", label: "Subtitle", type: "textarea", rows: 2, max: 300, span: 2 },
      { key: "aboutBody", label: "Description", type: "textarea", rows: 4, max: 800, span: 2 },
      { key: "aboutStory", label: "Company story", type: "textarea", rows: 4, max: 1000, span: 2 },
      { key: "aboutImage", label: "About image", type: "image", span: 2 },
    ],
  },
  {
    title: "Highlights",
    description: "Four outcome cards shown under the description.",
    fields: [
      { key: "aboutHighlight1Title", label: "Highlight 1 title", type: "text", max: 40 },
      { key: "aboutHighlight1Desc", label: "Highlight 1 description", type: "textarea", rows: 2, max: 200 },
      { key: "aboutHighlight2Title", label: "Highlight 2 title", type: "text", max: 40 },
      { key: "aboutHighlight2Desc", label: "Highlight 2 description", type: "textarea", rows: 2, max: 200 },
      { key: "aboutHighlight3Title", label: "Highlight 3 title", type: "text", max: 40 },
      { key: "aboutHighlight3Desc", label: "Highlight 3 description", type: "textarea", rows: 2, max: 200 },
      { key: "aboutHighlight4Title", label: "Highlight 4 title", type: "text", max: 40 },
      { key: "aboutHighlight4Desc", label: "Highlight 4 description", type: "textarea", rows: 2, max: 200 },
    ],
  },
  {
    title: "Mission & vision",
    fields: [
      { key: "missionLabel", label: "Label", type: "text", max: 40 },
      { key: "missionTitle", label: "Title", type: "text", max: 120 },
      { key: "missionText", label: "Mission", type: "textarea", rows: 4, max: 600, span: 2 },
      { key: "visionText", label: "Vision", type: "textarea", rows: 4, max: 600, span: 2 },
      { key: "quote", label: "Quote", type: "textarea", rows: 2, max: 400, span: 2 },
      { key: "quoteAuthor", label: "Quote author", type: "text", max: 120, span: 2 },
    ],
  },
];

function headerGroup(prefix: string, title: string): SettingsGroup {
  return {
    title,
    description: "Heading shown above this section on the site.",
    fields: [
      { key: `${prefix}Label`, label: "Label", type: "text", max: 40 },
      { key: `${prefix}Title`, label: "Title", type: "text", required: true, max: 120 },
      { key: `${prefix}Subtitle`, label: "Subtitle", type: "textarea", rows: 2, max: 300, span: 2 },
    ],
  };
}

export const PILLARS_HEADER: SettingsGroup[] = [headerGroup("pillars", "Pillars heading")];
export const SERVICES_HEADER: SettingsGroup[] = [headerGroup("services", "Services heading")];
export const INDUSTRIES_HEADER: SettingsGroup[] = [headerGroup("industries", "Industries heading")];
export const TEAM_HEADER: SettingsGroup[] = [headerGroup("team", "Team heading")];

export const IMPACT_GROUPS: SettingsGroup[] = [
  headerGroup("impact", "Impact heading"),
  {
    title: "Opportunity & risk",
    fields: [
      { key: "opportunityTitle", label: "Opportunity title", type: "text", max: 120 },
      { key: "opportunityBody", label: "Opportunity body", type: "textarea", rows: 4, max: 800, span: 2 },
      { key: "opportunityRisk", label: "Risk body", type: "textarea", rows: 4, max: 800, span: 2 },
      { key: "leadershipMessage", label: "Leadership message", type: "textarea", rows: 3, max: 500, span: 2 },
    ],
  },
  headerGroup("risks", "Cost of inaction heading"),
  headerGroup("stories", "Success stories heading"),
];

export const CONTACT_GROUPS: SettingsGroup[] = [
  {
    title: "Contact heading",
    fields: [
      { key: "contactLabel", label: "Label", type: "text", max: 40 },
      { key: "contactTitle", label: "Title", type: "text", required: true, max: 120 },
      { key: "contactSubtitle", label: "Subtitle", type: "textarea", rows: 2, max: 300, span: 2 },
    ],
  },
  {
    title: "Contact details",
    fields: [
      { key: "contactEmail", label: "Email", type: "text", max: 254 },
      { key: "contactPhone", label: "Phone", type: "text", max: 40 },
      { key: "contactPhoneAlt", label: "Alternate phone", type: "text", max: 40 },
      { key: "contactHours", label: "Business hours", type: "text", max: 120 },
      { key: "contactAddress", label: "Office address", type: "textarea", rows: 2, max: 300, span: 2 },
    ],
  },
  {
    title: "Map & form",
    fields: [
      {
        key: "contactMapEmbed",
        label: "Google Maps embed URL",
        type: "text",
        span: 2,
        help: "Paste the 'src' URL from a Google Maps embed.",
      },
      {
        key: "contactFormEnabled",
        label: "Enable contact form",
        type: "toggle",
        help: "Turn the public contact form on or off.",
        span: 2,
      },
    ],
  },
  {
    title: "Social links",
    description: "Leave blank to hide an icon.",
    fields: [
      { key: "socialLinkedin", label: "LinkedIn", type: "text", max: 500 },
      { key: "socialTwitter", label: "Twitter / X", type: "text", max: 500 },
      { key: "socialGithub", label: "GitHub", type: "text", max: 500 },
      { key: "socialFacebook", label: "Facebook", type: "text", max: 500 },
      { key: "socialInstagram", label: "Instagram", type: "text", max: 500 },
    ],
  },
  {
    title: "Footer",
    fields: [{ key: "footerTagline", label: "Footer tagline", type: "text", max: 120, span: 2 }],
  },
];
