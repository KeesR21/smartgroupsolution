import { randomUUID } from "crypto";
import { existsSync } from "fs";
import { mkdir, readFile, rename, stat, writeFile } from "fs/promises";
import path from "path";
import { defaultContent, defaultSiteData } from "@/lib/site-defaults";
import { logServer } from "@/lib/logger";
import type {
  CollectionKey,
  MessageRecord,
  SiteContentRecord,
  SiteData,
} from "@/types/cms";

const CONTENT_FILE =
  process.env.CONTENT_FILE || path.join(process.cwd(), "data", "content.json");

type BaseItem = { id: string; order: number; published: boolean } & Record<
  string,
  unknown
>;

let cache: { data: SiteData; mtimeMs: number } | null = null;
let writeLock: Promise<void> = Promise.resolve();

function normalize(raw: Partial<SiteData> | null): SiteData {
  const defaults = defaultSiteData();
  if (!raw || typeof raw !== "object") return defaults;

  const content: SiteContentRecord = {
    ...defaultContent(),
    ...(raw.content ?? {}),
    id: "main",
  };

  const collection = <K extends keyof SiteData>(
    key: K,
    fallback: SiteData[K]
  ): SiteData[K] => {
    const value = raw[key];
    return Array.isArray(value) ? (value as SiteData[K]) : fallback;
  };

  return {
    content,
    services: collection("services", defaults.services),
    pillars: collection("pillars", defaults.pillars),
    marketStats: collection("marketStats", defaults.marketStats),
    industries: collection("industries", defaults.industries),
    riskItems: collection("riskItems", defaults.riskItems),
    successStories: collection("successStories", defaults.successStories),
    team: collection("team", defaults.team),
    messages: Array.isArray(raw.messages) ? (raw.messages as MessageRecord[]) : [],
  };
}

async function ensureSeeded(): Promise<void> {
  if (existsSync(CONTENT_FILE)) return;
  const seeded = defaultSiteData();
  await persist(seeded);
  logServer("info", "[content-store] Seeded content store", CONTENT_FILE);
}

async function persist(data: SiteData): Promise<void> {
  await mkdir(path.dirname(CONTENT_FILE), { recursive: true });
  const tmp = `${CONTENT_FILE}.${randomUUID()}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await rename(tmp, CONTENT_FILE);
  const info = await stat(CONTENT_FILE);
  cache = { data, mtimeMs: info.mtimeMs };
}

export async function getSiteData(): Promise<SiteData> {
  await ensureSeeded();
  try {
    const info = await stat(CONTENT_FILE);
    if (cache && cache.mtimeMs === info.mtimeMs) return cache.data;
    const raw = await readFile(CONTENT_FILE, "utf8");
    const data = normalize(JSON.parse(raw));
    cache = { data, mtimeMs: info.mtimeMs };
    return data;
  } catch (err) {
    logServer("error", "[content-store] Failed to read store", String(err));
    return defaultSiteData();
  }
}

/** Mutate the whole store atomically via an updater callback. */
async function mutate<T>(fn: (data: SiteData) => { data: SiteData; result: T }): Promise<T> {
  let result!: T;
  writeLock = writeLock.then(async () => {
    const current = await getSiteData();
    // Deep clone so the updater can freely mutate without touching the cache.
    const draft: SiteData = JSON.parse(JSON.stringify(current));
    const outcome = fn(draft);
    await persist(outcome.data);
    result = outcome.result;
  });
  await writeLock;
  return result;
}

export async function updateContent(
  patch: Partial<SiteContentRecord>
): Promise<SiteContentRecord> {
  return mutate((data) => {
    // Never allow the id to be overwritten.
    const { id: _ignore, ...rest } = patch;
    void _ignore;
    data.content = { ...data.content, ...rest, id: "main" };
    return { data, result: data.content };
  });
}

// ---------------------------------------------------------------------------
// Generic collection helpers
// ---------------------------------------------------------------------------

export async function listCollection<T = BaseItem>(key: CollectionKey): Promise<T[]> {
  const data = await getSiteData();
  const items = [...(data[key] as unknown as BaseItem[])];
  items.sort((a, b) => a.order - b.order);
  return items as unknown as T[];
}

function withTimestamps(key: CollectionKey, item: BaseItem): BaseItem {
  if (key === "services") {
    const now = new Date().toISOString();
    return {
      createdAt: now,
      updatedAt: now,
      ...item,
    };
  }
  return item;
}

export async function createItem(
  key: CollectionKey,
  values: Record<string, unknown>
): Promise<BaseItem> {
  return mutate((data) => {
    const list = data[key] as unknown as BaseItem[];
    const maxOrder = list.reduce((m, i) => Math.max(m, i.order ?? 0), -1);
    const now = new Date().toISOString();
    const item: BaseItem = withTimestamps(key, {
      published: true,
      ...values,
      id: randomUUID(),
      order: maxOrder + 1,
    } as BaseItem);
    if (key === "services") {
      item.createdAt = now;
      item.updatedAt = now;
    }
    list.push(item);
    return { data, result: item };
  });
}

export async function updateItem(
  key: CollectionKey,
  id: string,
  values: Record<string, unknown>
): Promise<BaseItem | null> {
  return mutate((data) => {
    const list = data[key] as unknown as BaseItem[];
    const idx = list.findIndex((i) => i.id === id);
    if (idx === -1) return { data, result: null };
    const { id: _omitId, order: _omitOrder, createdAt: _omitCreated, ...rest } = values;
    void _omitId;
    void _omitOrder;
    void _omitCreated;
    list[idx] = { ...list[idx], ...rest };
    if (key === "services") list[idx].updatedAt = new Date().toISOString();
    return { data, result: list[idx] };
  });
}

export async function deleteItem(key: CollectionKey, id: string): Promise<boolean> {
  return mutate((data) => {
    const list = data[key] as unknown as BaseItem[];
    const next = list.filter((i) => i.id !== id);
    const removed = next.length !== list.length;
    (data[key] as unknown as BaseItem[]) = next;
    return { data, result: removed };
  });
}

export async function deleteManyItems(
  key: CollectionKey,
  ids: string[]
): Promise<number> {
  return mutate((data) => {
    const set = new Set(ids);
    const list = data[key] as unknown as BaseItem[];
    const next = list.filter((i) => !set.has(i.id));
    const removed = list.length - next.length;
    (data[key] as unknown as BaseItem[]) = next;
    return { data, result: removed };
  });
}

export async function setPublishedMany(
  key: CollectionKey,
  ids: string[],
  published: boolean
): Promise<number> {
  return mutate((data) => {
    const set = new Set(ids);
    const list = data[key] as unknown as BaseItem[];
    let count = 0;
    for (const item of list) {
      if (set.has(item.id)) {
        item.published = published;
        count++;
      }
    }
    return { data, result: count };
  });
}

export async function reorderCollection(
  key: CollectionKey,
  orderedIds: string[]
): Promise<BaseItem[]> {
  return mutate((data) => {
    const list = data[key] as unknown as BaseItem[];
    const position = new Map(orderedIds.map((id, index) => [id, index]));
    for (const item of list) {
      const next = position.get(item.id);
      if (next !== undefined) item.order = next;
    }
    list.sort((a, b) => a.order - b.order);
    return { data, result: list };
  });
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export async function listMessages(): Promise<MessageRecord[]> {
  const data = await getSiteData();
  return [...data.messages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createMessage(values: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<MessageRecord> {
  return mutate((data) => {
    const record: MessageRecord = {
      id: randomUUID(),
      ...values,
      read: false,
      createdAt: new Date().toISOString(),
    };
    data.messages.push(record);
    return { data, result: record };
  });
}

export async function updateMessage(
  id: string,
  patch: Partial<Pick<MessageRecord, "read">>
): Promise<MessageRecord | null> {
  return mutate((data) => {
    const idx = data.messages.findIndex((m) => m.id === id);
    if (idx === -1) return { data, result: null };
    data.messages[idx] = { ...data.messages[idx], ...patch };
    return { data, result: data.messages[idx] };
  });
}

export async function deleteMessage(id: string): Promise<boolean> {
  return mutate((data) => {
    const next = data.messages.filter((m) => m.id !== id);
    const removed = next.length !== data.messages.length;
    data.messages = next;
    return { data, result: removed };
  });
}

export async function deleteManyMessages(ids: string[]): Promise<number> {
  return mutate((data) => {
    const set = new Set(ids);
    const before = data.messages.length;
    data.messages = data.messages.filter((m) => !set.has(m.id));
    return { data, result: before - data.messages.length };
  });
}

export async function setMessagesRead(ids: string[], read: boolean): Promise<number> {
  return mutate((data) => {
    const set = new Set(ids);
    let count = 0;
    for (const m of data.messages) {
      if (set.has(m.id)) {
        m.read = read;
        count++;
      }
    }
    return { data, result: count };
  });
}
