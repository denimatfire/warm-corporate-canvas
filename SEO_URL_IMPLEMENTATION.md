# SEO-Friendly URL Implementation

This document describes the implementation of SEO-friendly URLs for articles, replacing random IDs with meaningful slugs based on article titles.

## Overview

Previously, article URLs used random database IDs (e.g., `/article/abc123`). Now, articles use SEO-friendly slugs based on their titles (e.g., `/article/my-article-title`).

## Changes Made

### 1. Database Schema Updates

- Added `slug` column to the `articles` table
- Created unique index on `slug` column for performance
- Generated slugs for existing articles from their titles

**Migration Script**: `ADD_SLUG_COLUMN.sql`

### 2. New Utility Functions

**File**: `src/lib/slug-utils.ts`

- `generateSlug(title)`: Converts titles to URL-friendly slugs
- `generateUniqueSlug(baseSlug, existingSlugs)`: Ensures slug uniqueness
- `isValidSlug(slug)`: Validates slug format
- `extractSlugFromPath(path)`: Extracts slug from URL paths

### 3. Updated Article Interface

**File**: `src/lib/articles-api.ts`

- Added `slug` field to `Article`, `CreateArticleData`, and `UpdateArticleData` interfaces
- Added slug-based lookup methods:
  - `getBySlug(slug)`: Get article by slug
  - `getBySlugOrId(identifier)`: Get article by slug or ID (backward compatibility)

### 4. Automatic Slug Generation

- **Article Creation**: Automatically generates unique slugs from titles
- **Article Updates**: Regenerates slugs when titles change
- **Uniqueness**: Ensures no duplicate slugs by appending numbers

### 5. Updated Routing

**File**: `src/App.tsx`
- Changed route from `/article/:id` to `/article/:slug`

### 6. Updated Components

**Files**: `src/components/Article_medium.tsx`, `src/components/Writing.tsx`
- Updated to use slugs instead of IDs for navigation
- Maintained backward compatibility for existing ID-based URLs

## Backward Compatibility

The implementation maintains full backward compatibility:

1. **URL Lookup**: `getBySlugOrId()` tries slug first, then falls back to ID
2. **Existing URLs**: Old ID-based URLs still work
3. **Database**: Existing articles get slugs generated from their titles

## SEO Benefits

1. **Readable URLs**: URLs now contain meaningful text from article titles
2. **Search Engine Friendly**: Better indexing and ranking potential
3. **User Experience**: Users can understand content from the URL
4. **Social Sharing**: More attractive URLs when shared on social media

## Example URL Transformation

**Before**: `/article/abc123def456`
**After**: `/article/getting-started-with-react-hooks`

## Usage

### Creating Articles

```typescript
const newArticle = await articlesApi.create({
  title: "My Amazing Article",
  // slug will be auto-generated as "my-amazing-article"
  content: "...",
  excerpt: "...",
  // ... other fields
});
```

### Updating Articles

```typescript
// When updating title, slug is automatically regenerated
await articlesApi.update(articleId, {
  title: "Updated Article Title"
  // slug becomes "updated-article-title"
});
```

### Fetching Articles

```typescript
// By slug (preferred)
const article = await articlesApi.getBySlug("my-article-slug");

// By slug or ID (backward compatible)
const article = await articlesApi.getBySlugOrId("my-article-slug");
```

## Database Migration

Run the migration script to add slugs to existing articles:

```sql
-- Execute ADD_SLUG_COLUMN.sql in your Supabase SQL editor
```

## Testing

1. **New Articles**: Create new articles and verify slugs are generated
2. **Existing Articles**: Check that existing articles have slugs
3. **URL Navigation**: Test both slug-based and ID-based URLs
4. **Uniqueness**: Verify duplicate titles get unique slugs

## Future Enhancements

1. **Custom Slugs**: Allow manual slug editing in the admin interface
2. **Slug History**: Track slug changes for redirects
3. **Redirects**: Automatically redirect old ID-based URLs to new slug-based URLs
4. **Validation**: Add client-side slug validation in forms

## Troubleshooting

### Common Issues

1. **Missing Slugs**: Run the migration script for existing articles
2. **Duplicate Slugs**: The system automatically handles this by appending numbers
3. **Invalid Characters**: Slugs are automatically cleaned of special characters
4. **Length Limits**: Slugs are truncated to 60 characters for SEO best practices

### Debugging

Check the browser console for slug generation logs and any errors during article creation/updates.
