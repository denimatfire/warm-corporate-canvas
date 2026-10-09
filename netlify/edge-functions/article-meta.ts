// Netlify Edge Function: puts each article's title, description and cover image
// into the page's <head> before it is sent. Link-preview bots (WhatsApp,
// LinkedIn, X, Facebook, Slack…) don't run JavaScript, so without this they only
// ever see the home page's tags from index.html.
//
// Needs VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Netlify site's
// environment variables. On any problem it returns the normal page unchanged.

import type { Config, Context } from "@netlify/edge-functions";
import { injectArticleMeta, type ArticleMeta } from "./lib/inject-meta.ts";

const SUPABASE_TIMEOUT_MS = 2500;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FIELDS = "title,excerpt,cover_image,author,published_at,created_at,updated_at,tags,slug,read_time";

async function fetchArticle(identifier: string): Promise<ArticleMeta | null> {
  const supabaseUrl = Netlify.env.get("VITE_SUPABASE_URL");
  const anonKey = Netlify.env.get("VITE_SUPABASE_ANON_KEY");
  if (!supabaseUrl || !anonKey) return null;

  // Articles are addressed by slug; old links may still use the id
  const column = UUID_PATTERN.test(identifier) ? "id" : "slug";
  const url =
    `${supabaseUrl}/rest/v1/articles?select=${FIELDS}` +
    `&${column}=eq.${encodeURIComponent(identifier)}&status=eq.published&limit=1`;

  const response = await fetch(url, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    signal: AbortSignal.timeout(SUPABASE_TIMEOUT_MS),
  });
  if (!response.ok) return null;

  const rows = (await response.json()) as ArticleMeta[];
  return rows[0] ?? null;
}

export default async (request: Request, context: Context) => {
  const page = await context.next();

  const isHtml = page.headers.get("content-type")?.includes("text/html");
  if (page.status !== 200 || !isHtml) return page;

  const identifier = decodeURIComponent(new URL(request.url).pathname.replace(/^\/article\//, "").replace(/\/$/, ""));
  if (!identifier || identifier.includes("/")) return page;

  try {
    const article = await fetchArticle(identifier);
    if (!article) return page;

    const html = await page.text();
    const headers = new Headers(page.headers);
    headers.delete("content-length");
    return new Response(injectArticleMeta(html, article, request.url), { status: 200, headers });
  } catch (error) {
    console.error("article-meta: falling back to default page", error);
    return page;
  }
};

export const config: Config = {
  path: "/article/*",
};
