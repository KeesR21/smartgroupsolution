/**
 * Canonical website content from the Smart Group Solution growth deck.
 * Used by database seed and `npm run db:sync`.
 */

export const SITE_CONTENT = {
  heroWelcome: "",
  heroBadge1: "",
  heroBadge2: "",
  heroTitle: "Modernize. Protect. Scale.",
  heroSubtitle: "",
  heroTagline: "AI agents · secure networks · cybersecurity · compliance · cloud & data",
  heroDescription:
    "We help banking, insurance, healthcare, real estate, and marketing intelligence organizations modernize operations, protect revenue, and scale with AI agents, resilient infrastructure, Zero Trust security, and audit-ready governance.",

  stat1Value: 62,
  stat1Prefix: "",
  stat1Suffix: "%",
  stat1Label: "Organizations experimenting with AI agents",
  stat2Value: 3,
  stat2Prefix: "",
  stat2Suffix: "×",
  stat2Label: "Higher revenue-per-worker growth in AI-exposed industries",
  stat3Value: 4,
  stat3Prefix: "$",
  stat3Suffix: "M",
  stat3Label: "Average global cost of a data breach",

  aboutLabel: "What You Gain",
  aboutTitle: "Outcomes that matter to leadership",
  aboutSubtitle:
    "Every engagement is designed around measurable business results—not technology for its own sake.",
  aboutBody:
    "Smart Group Solution combines AI automation, secure networking, cybersecurity, compliance, and cloud data platforms into one accountable partner. We work with teams that need more throughput, stronger trust with customers and regulators, less downtime, and higher productivity from the systems they already own.",
  aboutHighlight1Title: "Growth",
  aboutHighlight1Desc:
    "Serve more customers, shorten service cycles, and turn better data into faster decisions.",
  aboutHighlight2Title: "Trust",
  aboutHighlight2Desc:
    "Safer data, fewer surprises, and controls your board and partners can stand behind.",
  aboutHighlight3Title: "Resilience",
  aboutHighlight3Desc:
    "Redundant networks, recovery readiness, and operations that keep running when something fails.",
  aboutHighlight4Title: "Productivity",
  aboutHighlight4Desc:
    "Teams accomplish more with workflow automation, training, and systems people actually adopt.",

  pillarsLabel: "Core Pillars",
  pillarsTitle: "Five engines of digital advantage",
  pillarsSubtitle:
    "Integrated capabilities that work together—AI with governance, networks with security, cloud with compliance.",

  servicesLabel: "Service Catalog",
  servicesTitle: "What we deliver — and what you gain",
  servicesSubtitle:
    "Focused offerings mapped to real workflows, with clear business outcomes for every line of service.",

  impactLabel: "Market Proof",
  impactTitle: "The opportunity — and the risk",
  impactSubtitle:
    "Industry research shows why disciplined modernization wins—and why ungoverned AI does not.",

  opportunityTitle: "The opportunity",
  opportunityBody:
    "Organizations using AI well redesign workflows, shorten service cycles, and convert better data into faster decisions. Extensive AI use in security can materially reduce breach impact when paired with governance and monitoring.",
  opportunityRisk:
    "AI without access control, privacy discipline, and data protection creates shadow-AI exposure, new breach paths, and regulatory risk. Advanced technology is no longer optional—but it must ship with security, compliance, training, and clear escalation paths.",
  leadershipMessage:
    "Advanced technology is no longer optional. Deploy it with security, compliance, training, and data discipline—or accept compounding risk to revenue and reputation.",

  industriesLabel: "Industries",
  industriesTitle: "Built for regulated, high-trust sectors",
  industriesSubtitle:
    "Tailored first offers by sector—starting with one visible win, then expanding the account with security and compliance depth.",

  risksLabel: "Cost of Inaction",
  risksTitle: "Why waiting is not neutral",
  risksSubtitle:
    "Inaction quietly compounds lost revenue, higher operating cost, downtime, incidents, and talent frustration.",

  missionLabel: "Our Commitment",
  missionTitle: "Technology with discipline",
  missionText:
    "To help African enterprises modernize, protect revenue, and scale through AI agents, secure infrastructure, cybersecurity, compliance, and cloud data solutions—always wrapped in governance, training, and measurable adoption.",
  visionText:
    "To be the trusted partner boards and executives rely on when growth, trust, resilience, and productivity must improve together—not in silos.",
  quote:
    "Cybersecurity is revenue protection. Compliance is a sales advantage. AI is the profit engine—when it is connected to real workflows and proper controls.",
  quoteAuthor: "— Smart Group Solution Leadership",

  teamLabel: "Leadership Team",
  teamTitle: "Experts behind your success",
  teamSubtitle:
    "Strategists and engineers who speak both boardroom outcomes and operational reality.",

  contactLabel: "Contact Us",
  contactTitle: "Start with a focused assessment",
  contactSubtitle:
    "Tell us your biggest bottleneck in time, money, trust, or service quality. We will propose one visible first win.",
  contactEmail: "hello@smartgroupsolution.com",
  contactPhone: "+1 (555) 123-4567",
  contactAddress: "100 Innovation Drive, Tech Park, San Francisco, CA 94105",
  footerTagline: "Modernize. Protect. Scale.",
} as const;

export const MAIN_PILLARS = [
  {
    title: "AI Agents",
    description:
      "Workflow-connected agents for intake, triage, navigation, follow-up, reporting, and internal helpdesk— with human approval and audit trails.",
    icon: "Sparkles",
  },
  {
    title: "Secure Networks",
    description:
      "Redundant internet, SD-WAN, secure Wi-Fi, branch connectivity, segmentation, and firewall architecture that keeps revenue moving.",
    icon: "Network",
  },
  {
    title: "Cybersecurity",
    description:
      "Zero Trust, DLP, Microsoft Sentinel, Defender XDR, vulnerability management, pen testing, and ransomware readiness.",
    icon: "Shield",
  },
  {
    title: "Compliance",
    description:
      "ISO 27001 readiness, PCI-style controls, privacy reviews, policy packs, evidence collection, and audit-ready reporting.",
    icon: "FileText",
  },
  {
    title: "Cloud & Data",
    description:
      "Azure/AWS landing zones, data pipelines, Power BI dashboards, customer portals, APIs, and governed analytics.",
    icon: "Cloud",
  },
] as const;

export const MAIN_SERVICES = [
  {
    title: "AI Agents & Automation",
    description:
      "Intelligent agents connected to real business processes—not disconnected chat experiments.",
    deliverable:
      "Loan intake, claims triage, patient navigation, lead follow-up, reporting co-pilots, internal helpdesk agents.",
    businessResult: "More throughput, faster response, and consistently better service.",
    icon: "Sparkles",
  },
  {
    title: "Networking & Infrastructure",
    description:
      "Infrastructure that protects revenue every day when sales, care, claims, or payments cannot pause.",
    deliverable:
      "Redundant internet, SD-WAN, secure Wi-Fi, branch connectivity, VLANs, firewall architecture, backup links.",
    businessResult: "Less downtime, faster operations, and reliable growth across sites.",
    icon: "Network",
  },
  {
    title: "Cybersecurity",
    description:
      "Security programs framed as revenue protection—not fear-based selling.",
    deliverable:
      "Zero Trust, DLP, Microsoft Sentinel, Defender XDR, vulnerability assessment, pen testing, ransomware readiness.",
    businessResult: "Lower breach risk, fewer losses, and stronger customer trust.",
    icon: "Shield",
  },
  {
    title: "Compliance & Governance",
    description:
      "Turn trust into a commercial advantage with organized controls and evidence.",
    deliverable:
      "ISO 27001 readiness, PCI-style controls, privacy reviews, policy packs, evidence collection, audit support.",
    businessResult: "Easier audits, stronger credibility, and safer expansion.",
    icon: "FileText",
  },
  {
    title: "Cloud, Data & Apps",
    description:
      "Data becomes profit when it is organized, protected, and usable by decision-makers.",
    deliverable:
      "Azure/AWS, data pipelines, Power BI dashboards, customer portals, API integrations, secure landing zones.",
    businessResult: "Better decisions, digital services, and scalable operations.",
    icon: "Cloud",
  },
  {
    title: "Training & Adoption",
    description:
      "Systems only create value when people use them correctly and confidently.",
    deliverable:
      "Employee awareness, executive briefings, phishing simulations, admin runbooks, role-based training.",
    businessResult: "Higher adoption, fewer human errors, and sustained ROI.",
    icon: "Users",
  },
] as const;

export const MARKET_STATS = [
  {
    value: "3×",
    label: "Higher revenue-per-worker growth in AI-exposed industries",
    source: "PwC 2025 AI Jobs Barometer",
  },
  {
    value: "62%",
    label: "Organizations at least experimenting with AI agents",
    source: "McKinsey 2025 State of AI",
  },
  {
    value: "$4.4M",
    label: "Global average cost of a data breach",
    source: "IBM 2025 Cost of a Data Breach",
  },
  {
    value: "$1.9M",
    label: "Average savings from extensive AI use in security",
    source: "IBM 2025 Cost of a Data Breach",
  },
] as const;

export const MAIN_INDUSTRIES = [
  {
    name: "Banking",
    description:
      "AI loan intake, Zero Trust, DLP, Sentinel monitoring, and penetration testing as a strong first bundle.",
    icon: "Landmark",
  },
  {
    name: "Insurance",
    description:
      "AI claims triage, fraud analytics, secure broker access, and compliance reviews.",
    icon: "Shield",
  },
  {
    name: "Healthcare",
    description:
      "AI patient navigation, resilient networks, ransomware readiness, and privacy controls.",
    icon: "HeartPulse",
  },
  {
    name: "Real Estate",
    description:
      "AI lead follow-up, secure transactions, and reliable office or site connectivity.",
    icon: "Building2",
  },
  {
    name: "Marketing Intelligence",
    description:
      "AI reporting co-pilots, data mining, secure client workspaces, and cloud governance.",
    icon: "LineChart",
  },
] as const;

export const RISK_ITEMS = [
  {
    title: "Lost revenue",
    description:
      "Slow lead response, loan approvals, claims backlogs, and poor follow-up directly cap growth.",
  },
  {
    title: "Higher operating cost",
    description:
      "Teams spend hours on repeatable admin that automation and workflow tools can reduce.",
  },
  {
    title: "Downtime exposure",
    description:
      "Weak networks and untested recovery interrupt service, sales, and care delivery.",
  },
  {
    title: "Security incidents",
    description:
      "Poor access control and untested systems become expensive only after something breaks.",
  },
  {
    title: "Talent frustration",
    description:
      "Workarounds create errors, burnout, and inconsistent customer experiences.",
  },
] as const;

export const MAIN_TEAM = [
  {
    name: "Alexandra Chen",
    role: "Chief Executive Officer",
    image: "https://i.pravatar.cc/400?img=5",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Marcus Rivera",
    role: "Chief Technology Officer",
    image: "https://i.pravatar.cc/400?img=11",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Priya Sharma",
    role: "Head of Design & Product",
    image: "https://i.pravatar.cc/400?img=9",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "James Okonkwo",
    role: "Director of Cloud & Security",
    image: "https://i.pravatar.cc/400?img=12",
    linkedin: "#",
    github: "#",
  },
] as const;
