-- Database functions for projects table
-- These functions handle view count and download count increments

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(project_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE projects 
    SET view_count = view_count + 1 
    WHERE id = project_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(project_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE projects 
    SET download_count = download_count + 1 
    WHERE id = project_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get project statistics
CREATE OR REPLACE FUNCTION get_project_stats()
RETURNS TABLE(
    total_projects BIGINT,
    published_projects BIGINT,
    draft_projects BIGINT,
    total_views BIGINT,
    total_downloads BIGINT,
    unique_categories BIGINT,
    unique_tags BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_projects,
        COUNT(*) FILTER (WHERE status = 'published') as published_projects,
        COUNT(*) FILTER (WHERE status = 'draft') as draft_projects,
        COALESCE(SUM(view_count), 0) as total_views,
        COALESCE(SUM(download_count), 0) as total_downloads,
        COUNT(DISTINCT category) as unique_categories,
        (
            SELECT COUNT(DISTINCT unnest(tags)) 
            FROM projects 
            WHERE tags IS NOT NULL AND array_length(tags, 1) > 0
        ) as unique_tags
    FROM projects;
END;
$$ LANGUAGE plpgsql;

-- Function to get popular projects (most viewed)
CREATE OR REPLACE FUNCTION get_popular_projects(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
    id UUID,
    title VARCHAR(255),
    slug VARCHAR(255),
    description TEXT,
    cover_image VARCHAR(500),
    view_count INTEGER,
    download_count INTEGER,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.slug,
        p.description,
        p.cover_image,
        p.view_count,
        p.download_count,
        p.category,
        p.created_at
    FROM projects p
    WHERE p.status = 'published'
    ORDER BY p.view_count DESC, p.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get recent projects
CREATE OR REPLACE FUNCTION get_recent_projects(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
    id UUID,
    title VARCHAR(255),
    slug VARCHAR(255),
    description TEXT,
    cover_image VARCHAR(500),
    view_count INTEGER,
    download_count INTEGER,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.slug,
        p.description,
        p.cover_image,
        p.view_count,
        p.download_count,
        p.category,
        p.created_at
    FROM projects p
    WHERE p.status = 'published'
    ORDER BY p.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get projects by category
CREATE OR REPLACE FUNCTION get_projects_by_category(category_name VARCHAR(100), limit_count INTEGER DEFAULT 20)
RETURNS TABLE(
    id UUID,
    title VARCHAR(255),
    slug VARCHAR(255),
    description TEXT,
    cover_image VARCHAR(500),
    view_count INTEGER,
    download_count INTEGER,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.slug,
        p.description,
        p.cover_image,
        p.view_count,
        p.download_count,
        p.category,
        p.created_at
    FROM projects p
    WHERE p.status = 'published' AND p.category = category_name
    ORDER BY p.view_count DESC, p.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to search projects
CREATE OR REPLACE FUNCTION search_projects(search_query TEXT, limit_count INTEGER DEFAULT 20)
RETURNS TABLE(
    id UUID,
    title VARCHAR(255),
    slug VARCHAR(255),
    description TEXT,
    cover_image VARCHAR(500),
    view_count INTEGER,
    download_count INTEGER,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE,
    relevance_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.slug,
        p.description,
        p.cover_image,
        p.view_count,
        p.download_count,
        p.category,
        p.created_at,
        (
            CASE 
                WHEN p.title ILIKE '%' || search_query || '%' THEN 3.0
                WHEN p.description ILIKE '%' || search_query || '%' THEN 2.0
                WHEN p.content ILIKE '%' || search_query || '%' THEN 1.0
                ELSE 0.0
            END
        ) as relevance_score
    FROM projects p
    WHERE p.status = 'published' 
    AND (
        p.title ILIKE '%' || search_query || '%' OR
        p.description ILIKE '%' || search_query || '%' OR
        p.content ILIKE '%' || search_query || '%' OR
        EXISTS (
            SELECT 1 FROM unnest(p.tags) as tag 
            WHERE tag ILIKE '%' || search_query || '%'
        )
    )
    ORDER BY relevance_score DESC, p.view_count DESC, p.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_download_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_project_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_popular_projects(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_projects(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_projects_by_category(VARCHAR, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION search_projects(TEXT, INTEGER) TO authenticated;
