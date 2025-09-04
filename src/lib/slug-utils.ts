/**
 * Utility functions for generating SEO-friendly slugs from article titles
 */

/**
 * Generates a URL-friendly slug from a title
 * @param title - The article title
 * @returns A URL-friendly slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace multiple spaces with single hyphen
    .replace(/\s+/g, '-')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length to 60 characters for SEO
    .substring(0, 60)
    // Remove trailing hyphen if it exists after truncation
    .replace(/-+$/, '');
}

/**
 * Generates a unique slug by appending a number if the slug already exists
 * @param baseSlug - The base slug
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

/**
 * Validates if a slug is properly formatted
 * @param slug - The slug to validate
 * @returns True if the slug is valid
 */
export function isValidSlug(slug: string): boolean {
  // Check if slug matches the expected pattern
  const slugPattern = /^[a-z0-9-]+$/;
  return slugPattern.test(slug) && slug.length > 0 && slug.length <= 60;
}

/**
 * Extracts a slug from a URL path
 * @param path - The URL path (e.g., "/article/my-article-title")
 * @returns The slug part or null if not found
 */
export function extractSlugFromPath(path: string): string | null {
  const match = path.match(/^\/article\/(.+)$/);
  return match ? match[1] : null;
}
