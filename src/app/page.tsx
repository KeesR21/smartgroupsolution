import { HomePage } from "@/components/HomePage";
import { getPublicSiteData } from "@/lib/cms";

// Content is served from the file store and can change at runtime via the
// admin CMS, so render on each request rather than prerendering statically.
export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getPublicSiteData();
  return <HomePage data={data} />;
}
