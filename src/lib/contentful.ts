import { Webinar } from "@/types/webinar";
import { createClient } from "contentful";

const SPACE_ID = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const DELIVERY_TOKEN = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN;
const ENVIRONMENT = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || "master";
const CONTENT_TYPE = import.meta.env.VITE_CONTENTFUL_CONTENT_TYPE || "webinar";

function resolveAssetUrl(asset: any): string {
  if (!asset) return "";
  const file = asset.fields?.file;
  if (!file) return "";
  const url: string = file.url || "";
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("http")) return url;
  return `https:${url}`;
}

function findLinked(entryId: string, includes: any[], type: string) {
  if (!includes) return null;
  return (
    includes.find((inc) => inc.sys?.id === entryId && inc.sys?.type === type) || null
  );
}

export async function fetchContentfulWebinars(): Promise<Webinar[]> {
  if (!SPACE_ID || !DELIVERY_TOKEN) {
    throw new Error(
      "Missing Contentful configuration in env (VITE_CONTENTFUL_SPACE_ID / VITE_CONTENTFUL_DELIVERY_TOKEN)"
    );
  }

  const client = createClient({
    space: SPACE_ID,
    accessToken: DELIVERY_TOKEN,
    environment: ENVIRONMENT,
  });

  const res = await client.getEntries({ content_type: CONTENT_TYPE, include: 2, limit: 1000 });

  const items = res.items || [];
  const includes: any[] = [];
  if ((res as any).includes) {
    const assets = (res as any).includes?.Asset || [];
    const entries = (res as any).includes?.Entry || [];
    assets.forEach((a: any) => includes.push(a));
    entries.forEach((e: any) => includes.push(e));
  }

  // helper: normalize arrays that may contain linked entries or plain strings
  function normalizeToStrings(arr: any[]): string[] {
    if (!Array.isArray(arr)) return [];
    return arr
      .map((item) => {
        if (!item) return null;
        // if it's already a string
        if (typeof item === "string") return item;
        // if it's a linked reference with sys.id, resolve via includes
        if (item.sys?.id) {
          const linked = findLinked(item.sys.id, includes, item.sys.type === "Asset" ? "Asset" : "Entry");
          const fields = linked?.fields || item.fields || {};
          return fields?.name || fields?.title || fields?.value || null;
        }
        // if it has fields directly
        if (item.fields) {
          return item.fields.name || item.fields.title || item.fields.value || null;
        }
        // fallback to object with a 'name' property
        if (item.name) return item.name;
        return null;
      })
      .filter(Boolean) as string[];
  }

  const webinars: Webinar[] = items.map((item: any) => {
    const f = item.fields || {};

    const thumbnail = f.thumbnail
      ? f.thumbnail.fields
        ? resolveAssetUrl(f.thumbnail)
        : (findLinked(f.thumbnail.sys?.id, includes, "Asset") ? resolveAssetUrl(findLinked(f.thumbnail.sys.id, includes, "Asset")) : (f.thumbnailUrl || ""))
      : f.thumbnail_url || "";

    let authors: Webinar["authors"] = [];
    if (Array.isArray(f.authors)) {
      authors = f.authors.map((a: any) => {
        if (a?.sys?.id) {
          const linked = findLinked(a.sys.id, includes, "Entry");
          const name = linked?.fields?.name || linked?.fields?.title || 'Unknown';
          const avatar = linked?.fields?.avatar ? resolveAssetUrl(linked.fields.avatar) : (linked?.fields?.avatarUrl || '');
          return {
            name,
            avatar_url: avatar,
            role: linked?.fields?.role || linked?.fields?.position || a?.role || '',
          };
        }
        return {
          name: a?.name || a?.fields?.name || 'Unknown',
          avatar_url: a?.avatarUrl || '',
          role: a?.role || '',
        };
      });
    }

    const topics = normalizeToStrings(f.topics || f.topic || []);
    const integration_tags = normalizeToStrings(f.integrationTags || f.integrations || []);
    const whatBringsYouHere = normalizeToStrings(f.whatBringsYouHere || f.whatBringsYouHere || f.what_brings_you_here_raw || []);
    const learning_outcomes = normalizeToStrings(f.learningOutcomes || f.learningOutcomes || (f.learning_outcomes_raw ? [f.learning_outcomes_raw] : []));

    return {
      id: item.sys?.id || f.id || f.slug || "unknown",
      slug: (f.slug || f.fields?.slug || f.title || item.sys?.id || "").toString().replace(/\s+/g, "-").toLowerCase(),
      title: f.title || f.name || "Untitled",
      description: f.description || f.summary || f.ai_summary || "",
      ai_summary: f.aiSummary || f.summary || "",
      duration_minutes: f.durationMinutes || f.duration || 0,
      date_published: f.datePublished || f.publishedAt || f.date || new Date().toISOString(),
      topics,
      thumbnail_url: thumbnail || f.thumbnailUrl || "",
      video_url: f.videoUrl || f.video || "",
      authors,
      featured: !!f.featured,
      popularity_score: f.popularityScore || 0,
      is_new: !!f.isNew,
      type: f.type || "past",
      integration_tags,
      what_brings_you_here: whatBringsYouHere,
      learning_outcomes,
    } as Webinar;
  });

  return webinars;
}
