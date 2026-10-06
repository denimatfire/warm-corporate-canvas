import { useState, useEffect, useMemo } from "react";
import { Search, ArrowRight, ArrowUpRight, Clock, PenLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { articlesApi, Article } from "@/lib/articles-api";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

interface WritingProps {
  // Show only the newest N articles (used on the home page); omit to show all with search
  limit?: number;
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const Writing = ({ limit }: WritingProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const isPreview = limit !== undefined;

  // Load only published articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const publishedArticles = await articlesApi.getPublished();
        setArticles(publishedArticles.filter((article) => article.status === "published"));
      } catch (error) {
        console.error("Error fetching articles:", error);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const visibleArticles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const matches = term
      ? articles.filter(
          (article) =>
            article.title.toLowerCase().includes(term) ||
            article.excerpt?.toLowerCase().includes(term) ||
            article.author?.toLowerCase().includes(term)
        )
      : articles;
    return isPreview ? matches.slice(0, limit) : matches;
  }, [articles, searchTerm, isPreview, limit]);

  const viewAll = (
    <button
      onClick={() => navigate("/writing")}
      className="group inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
    >
      All articles
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );

  return (
    <section id="writing" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Writing"
          title={
            <>
              Latest <span className="text-gradient">thoughts</span>
            </>
          }
          description="Sharing insights, experiences, and lessons learned throughout my professional journey. Thoughts on technology, leadership, and personal growth."
          action={isPreview ? viewAll : undefined}
        />

        {!isPreview && (
          <div className="relative mb-10 max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search articles…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass w-full rounded-full py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: limit ?? 3 }).map((_, i) => (
              <div key={i} className="glass animate-pulse overflow-hidden rounded-3xl">
                <div className="h-48 bg-foreground/5" />
                <div className="space-y-3 p-6">
                  <div className="h-3 w-24 rounded bg-foreground/10" />
                  <div className="h-5 w-3/4 rounded bg-foreground/10" />
                  <div className="h-3 w-full rounded bg-foreground/5" />
                  <div className="h-3 w-2/3 rounded bg-foreground/5" />
                </div>
              </div>
            ))}
          </div>
        ) : visibleArticles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleArticles.map((article, index) => (
              <Reveal key={article.id} delay={index * 0.06}>
                <article
                  onClick={() => navigate(`/article/${article.id}`)}
                  className="glass glow-card group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl"
                >
                  <div className="relative isolate h-48 overflow-hidden">
                    {article.cover_image ? (
                      <img
                        src={article.cover_image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 -z-10 bg-gradient-accent opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--card))] via-transparent to-transparent" />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(article.published_at || article.created_at)}</span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {article.read_time} min read
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-6">
                      <div className="flex flex-wrap gap-1.5">
                        {article.tags?.slice(0, 2).map((tag) => (
                          <span key={tag} className="rounded-full bg-foreground/5 px-2.5 py-1 text-xs text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 text-foreground transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="glass flex flex-col items-center rounded-3xl px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <PenLine className="h-6 w-6" />
            </div>
            {searchTerm ? (
              <>
                <p className="text-lg text-foreground">No articles match "{searchTerm}"</p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 rounded-full border border-foreground/15 px-5 py-2 text-sm text-foreground hover:border-primary/50"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <p className="text-lg text-foreground">New articles are on the way</p>
                <p className="mt-2 text-sm text-muted-foreground">Check back soon for fresh writing.</p>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Writing;
