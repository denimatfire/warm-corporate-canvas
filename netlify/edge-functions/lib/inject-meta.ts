// Pure HTML transform used by the article-meta edge function (kept separate so it
// can be tested without the Netlify runtime).

export interface ArticleMeta {
  title: string;
  excerpt?: string | null;
  cover_image?: string | null;
  author?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  tags?: string[] | null;
  slug?: string | null;
  read_time?: number | null;
}

const SITE_NAME = "Dhrubajyoti Das";
const DEFAULT_DESCRIPTION = "Read this article by Dhrubajyoti Das.";
const MAX_DESCRIPTION = 200;

const escapeAttr = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const truncate = (text: string, max: number) =>
  text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;

// Remove every <meta> whose name/property is `key`, whatever the attribute order
const removeMeta = (html: string, key: string) =>
  html.replace(new RegExp(`\\s*<meta\\b[^>]*\\b(?:name|property)="${escapeRegExp(key)}"[^>]*>`, "gi"), "");

export function injectArticleMeta(html: string, article: ArticleMeta, pageUrl: string): string {
  const url = new URL(pageUrl);
  const canonical = `${url.origin}/article/${article.slug || url.pathname.split("/").pop()}`;
  const title = `${article.title} | ${SITE_NAME}`;
  const description = truncate((article.excerpt || DEFAULT_DESCRIPTION).replace(/\s+/g, " ").trim(), MAX_DESCRIPTION);
  const image = article.cover_image || null;

  const meta: [string, string, string][] = [
    ["name", "title", title],
    ["name", "description", description],
    ["property", "og:type", "article"],
    ["property", "og:url", canonical],
    ["property", "og:title", title],
    ["property", "og:description", description],
    ["name", "twitter:card", "summary_large_image"],
    ["name", "twitter:title", title],
    ["name", "twitter:description", description],
  ];
  if (image) {
    meta.push(["property", "og:image", image], ["property", "og:image:alt", article.title], ["name", "twitter:image", image], ["name", "twitter:image:alt", article.title]);
  }
  if (article.author) meta.push(["name", "author", article.author], ["property", "article:author", article.author]);
  const published = article.published_at || article.created_at;
  if (published) meta.push(["property", "article:published_time", published]);
  if (article.updated_at) meta.push(["property", "article:modified_time", article.updated_at]);
  for (const tag of article.tags ?? []) meta.push(["property", "article:tag", tag]);

  let out = html;
  // Drop the home-page values these replace. The default image's size/type tags
  // only describe the home-page image, so they go too when a cover is used.
  const replaced = new Set(meta.map(([, key]) => key));
  if (image) ["og:image:width", "og:image:height", "og:image:type", "og:image:secure_url"].forEach((k) => replaced.add(k));
  replaced.forEach((key) => (out = removeMeta(out, key)));
  out = out.replace(/\s*<link\b[^>]*\brel="canonical"[^>]*>/gi, "");
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(title)}</title>`);

  const tags = [
    `<link rel="canonical" href="${escapeAttr(canonical)}" />`,
    ...meta.map(([attr, key, value]) => `<meta ${attr}="${key}" content="${escapeAttr(value)}" />`),
  ];
  return out.replace(/<\/head>/i, `    ${tags.join("\n    ")}\n  </head>`);
}
