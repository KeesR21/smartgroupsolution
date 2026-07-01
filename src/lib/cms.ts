import { getSiteData } from "@/lib/content-store";
import type { PublicSiteData, SiteContentRecord } from "@/types/cms";

export function serializeContent(
  c: SiteContentRecord | Record<string, unknown>
): SiteContentRecord {
  return c as SiteContentRecord;
}

function byOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

function publishedOnly<T extends { order: number; published: boolean }>(
  items: T[]
): T[] {
  return byOrder(items.filter((i) => i.published));
}

/**
 * Public site content, served from the file-based JSON content store.
 * Only published items are returned. No database is required.
 */
export async function getPublicSiteData(): Promise<PublicSiteData> {
  const data = await getSiteData();

  return {
    content: data.content,
    services: publishedOnly(data.services),
    pillars: publishedOnly(data.pillars),
    marketStats: publishedOnly(data.marketStats),
    industries: publishedOnly(data.industries),
    riskItems: publishedOnly(data.riskItems),
    successStories: publishedOnly(data.successStories),
    team: publishedOnly(data.team),
  };
}

export async function getDashboardStats() {
  const data = await getSiteData();
  return {
    servicesCount: data.services.length,
    pillarsCount: data.pillars.length,
    industriesCount: data.industries.length,
    teamCount: data.team.length,
    storiesCount: data.successStories.length,
    messagesCount: data.messages.length,
    unreadCount: data.messages.filter((m) => !m.read).length,
  };
}
