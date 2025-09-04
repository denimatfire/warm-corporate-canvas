-- Migration script to add slug column to articles table
-- This script adds SEO-friendly URL slugs to existing articles

-- Add slug column to articles table
ALTER TABLE articles ADD COLUMN slug VARCHAR(60) UNIQUE;

-- Create index for better performance on slug lookups
CREATE INDEX idx_articles_slug ON articles(slug);

-- Update existing articles with generated slugs
-- This will generate slugs from existing titles
UPDATE articles 
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'),
          '\s+', '-', 'g'
        ),
        '-+', '-', 'g'
      ),
      '^-+|-+$', '', 'g'
    ),
    '^(.{60}).*$', '\1', 'g'
  )
)
WHERE slug IS NULL;

-- Handle duplicate slugs by appending numbers
WITH numbered_slugs AS (
  SELECT 
    id,
    slug,
    ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at) as rn
  FROM articles
  WHERE slug IS NOT NULL
)
UPDATE articles 
SET slug = CASE 
  WHEN ns.rn > 1 THEN ns.slug || '-' || (ns.rn - 1)
  ELSE ns.slug
END
FROM numbered_slugs ns
WHERE articles.id = ns.id;

-- Make slug column NOT NULL after populating it
ALTER TABLE articles ALTER COLUMN slug SET NOT NULL;

-- Add comment to document the column
COMMENT ON COLUMN articles.slug IS 'SEO-friendly URL slug generated from article title';
