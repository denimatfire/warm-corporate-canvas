import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { Search, X, Download, ExternalLink, FileText, Eye, ArrowUpRight, Presentation } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { initializeSEO } from "@/lib/seo-utils";
import { getPublishedProjects, Project } from "@/lib/projects-api";
import { supabase } from "@/lib/articles-api";

type SortKey = "recent" | "popular" | "title";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "recent", label: "Newest first" },
  { value: "popular", label: "Most viewed" },
  { value: "title", label: "Title A–Z" },
];

const isPdf = (project: Project) =>
  project.presentation_type === "file" && project.presentation_file_type === "application/pdf";

// PDFs open in the PDF viewer, everything else in the presentation viewer
const viewerPath = (project: Project) => (isPdf(project) ? `/pdf/${project.slug}` : `/presentation/${project.slug}`);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const handleDownload = (project: Project) => {
  if (project.presentation_type === "file" && project.presentation_file_path) {
    const { data } = supabase.storage.from("Article_images").getPublicUrl(project.presentation_file_path);
    const link = document.createElement("a");
    link.href = data.publicUrl;
    link.download = project.presentation_file_name || `${project.slug}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (project.presentation_type === "external_url" && project.presentation_url) {
    window.open(project.presentation_url, "_blank", "noopener,noreferrer");
  }
};

const Projects = () => {
  // Filters live in the URL so refresh, back/forward and shared links keep them
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const tag = params.get("tag") ?? "";
  const sort = (params.get("sort") as SortKey) || "recent";

  const updateParam = (key: string, value: string) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: key === "q" }
    );
  };

  useEffect(() => {
    initializeSEO("projects");
  }, []);

  // One request; searching, filtering and sorting all happen in the browser
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ["published-projects"],
    queryFn: getPublishedProjects,
  });

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => p.category && counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [projects]);

  const visibleProjects = useMemo(() => {
    const term = query.trim().toLowerCase();
    const matches = projects.filter((p) => {
      if (category && p.category !== category) return false;
      if (tag && !p.tags.includes(tag)) return false;
      if (!term) return true;
      return [p.title, p.description, p.category ?? "", ...p.tags].some((field) =>
        field?.toLowerCase().includes(term)
      );
    });
    return matches.sort((a, b) => {
      if (sort === "popular") return (b.view_count || 0) - (a.view_count || 0);
      if (sort === "title") return a.title.localeCompare(b.title);
      return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime();
    });
  }, [projects, query, category, tag, sort]);

  const hasFilters = Boolean(query || category || tag);
  const clearFilters = () => setParams(sort === "recent" ? {} : { sort });

  const chipClass = (active: boolean) =>
    `shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
      active
        ? "border-transparent bg-foreground text-background"
        : "border-foreground/10 text-muted-foreground hover:border-foreground/25 hover:text-foreground"
    }`;

  return (
    <div className="theme-aurora min-h-screen overflow-x-clip">
      <Navigation />

      <main className="mx-auto max-w-4xl px-4 pb-24 pt-32 sm:px-6">
        <header className="mb-10">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary">Projects</p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Projects &amp; <span className="text-gradient">presentations</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Explore my portfolio of projects, presentations, and technical demonstrations.
            From academic research to professional case studies.
          </p>
        </header>

        {/* Search and sort */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search projects</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => updateParam("q", e.target.value)}
              placeholder="Search by title, topic or tag…"
              className="w-full rounded-full border border-foreground/10 bg-foreground/5 py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <label className="relative">
            <span className="sr-only">Sort projects</span>
            <select
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value === "recent" ? "" : e.target.value)}
              className="w-full appearance-none rounded-full border border-foreground/10 bg-foreground/5 py-3 pl-5 pr-10 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 sm:w-auto"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-[hsl(var(--card))]">
                  {option.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">▾</span>
          </label>
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <nav aria-label="Filter by category" className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            <button onClick={() => updateParam("category", "")} className={chipClass(!category)} aria-pressed={!category}>
              All <span className="ml-1 opacity-60">{projects.length}</span>
            </button>
            {categories.map(([name, count]) => (
              <button
                key={name}
                onClick={() => updateParam("category", category === name ? "" : name)}
                className={chipClass(category === name)}
                aria-pressed={category === name}
              >
                {name} <span className="ml-1 opacity-60">{count}</span>
              </button>
            ))}
          </nav>
        )}

        {/* Result summary */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-foreground/10 pb-4 text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2">
            <span aria-live="polite">
              {isLoading ? "Loading…" : `${visibleProjects.length} project${visibleProjects.length === 1 ? "" : "s"}`}
            </span>
            {tag && (
              <button
                onClick={() => updateParam("tag", "")}
                className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/25"
              >
                #{tag} <X className="h-3 w-3" />
                <span className="sr-only">Remove tag filter</span>
              </button>
            )}
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="text-sm font-medium text-foreground underline-offset-4 hover:underline">
              Clear filters
            </button>
          )}
        </div>

        {/* Project list */}
        {isLoading ? (
          <ul className="divide-y divide-foreground/10">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="flex animate-pulse gap-5 py-6">
                <div className="hidden h-24 w-36 shrink-0 rounded-2xl bg-foreground/5 sm:block" />
                <div className="flex-1 space-y-3">
                  <div className="h-3 w-32 rounded bg-foreground/10" />
                  <div className="h-5 w-2/3 rounded bg-foreground/10" />
                  <div className="h-3 w-full rounded bg-foreground/5" />
                </div>
              </li>
            ))}
          </ul>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-lg text-foreground">Couldn't load projects.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full border border-foreground/15 px-5 py-2 text-sm text-foreground hover:border-primary/50"
            >
              Try again
            </button>
          </div>
        ) : visibleProjects.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Presentation className="h-6 w-6" />
            </div>
            <p className="text-lg text-foreground">
              {hasFilters ? "No projects match these filters" : "No projects have been published yet"}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 rounded-full border border-foreground/15 px-5 py-2 text-sm text-foreground hover:border-primary/50"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-foreground/10">
            {visibleProjects.map((project) => (
              <li key={project.id} className="group relative flex gap-5 py-6">
                <div className="hidden h-24 w-36 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-transparent sm:block">
                  {project.cover_image ? (
                    <img
                      src={project.cover_image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Presentation className="h-8 w-8 text-primary/60" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    {project.category && <span className="font-medium uppercase tracking-wider text-primary">{project.category}</span>}
                    {project.category && <span aria-hidden>·</span>}
                    <span>{formatDate(project.published_at || project.created_at)}</span>
                    <span aria-hidden>·</span>
                    <span className="inline-flex items-center gap-1">
                      {project.presentation_type === "file" ? <FileText className="h-3 w-3" /> : <ExternalLink className="h-3 w-3" />}
                      {isPdf(project) ? "PDF" : project.presentation_type === "file" ? "File" : "Link"}
                      {project.presentation_file_size ? ` · ${formatFileSize(project.presentation_file_size)}` : ""}
                    </span>
                  </div>

                  <h2 className="font-display text-xl font-semibold leading-snug text-foreground">
                    {/* The stretched link makes the whole row clickable */}
                    <Link
                      to={viewerPath(project)}
                      className="after:absolute after:inset-0 after:content-[''] focus:outline-none group-hover:text-primary focus-visible:after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-primary/50"
                    >
                      {project.title}
                    </Link>
                  </h2>
                  {project.description && (
                    <p className="mt-2 line-clamp-2 leading-relaxed text-muted-foreground">{project.description}</p>
                  )}

                  <div className="relative z-10 mt-4 flex flex-wrap items-center gap-2">
                    {project.tags.slice(0, 4).map((t) => (
                      <button
                        key={t}
                        onClick={() => updateParam("tag", tag === t ? "" : t)}
                        className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                          tag === t ? "bg-primary/20 text-primary" : "bg-foreground/5 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        #{t}
                      </button>
                    ))}
                    <span className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1" title="Views">
                        <Eye className="h-3.5 w-3.5" /> {project.view_count || 0}
                      </span>
                      {(project.presentation_file_path || project.presentation_url) && (
                        <button
                          onClick={() => handleDownload(project)}
                          className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary"
                        >
                          {project.presentation_type === "file" ? (
                            <>
                              <Download className="h-3.5 w-3.5" /> Download
                            </>
                          ) : (
                            <>
                              <ExternalLink className="h-3.5 w-3.5" /> Open link
                            </>
                          )}
                        </button>
                      )}
                      <Link
                        to={viewerPath(project)}
                        className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary"
                      >
                        View <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Projects;
