import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type NavItem =
  | { label: string; section: string }
  | { label: string; path: string };

const navItems: NavItem[] = [
  { label: "Projects", path: "/projects" },
  { label: "Writing", path: "/writing" },
  { label: "Photos", path: "/photos" },
  { label: "Journey", path: "/career" },
  { label: "CV", path: "/cv" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Tighten the bar once the page is scrolled, and close the mobile menu
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
      setIsOpen(false);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const scroll = () => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scroll, 100);
    } else {
      scroll();
    }
  };

  const go = (item: NavItem) => {
    setIsOpen(false);
    if ("path" in item) {
      navigate(item.path);
    } else {
      scrollToSection(item.section);
    }
  };

  const isActive = (item: NavItem) => "path" in item && location.pathname === item.path;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <div
        className={`glass w-full max-w-5xl rounded-2xl px-3 transition-all duration-300 md:rounded-full ${
          scrolled ? "py-2 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.6)]" : "py-3"
        } ${isOpen ? "bg-[hsl(var(--card)/0.95)]" : ""}`}
      >
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3 rounded-full pl-1 pr-3 text-left"
            aria-label="Go to top"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-accent font-display text-sm font-bold text-[hsl(240_24%_6%)]">
              DD
            </span>
            <span className="hidden font-display text-base font-semibold tracking-tight text-foreground sm:block">
              Dhrubajyoti Das
            </span>
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => go(item)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(item)
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollToSection("contact")}
              className="hidden items-center gap-1 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-transform hover:scale-[1.03] sm:inline-flex"
            >
              Let's talk <ArrowUpRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-foreground/10 md:hidden"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div
          className={`grid transition-all duration-300 ease-out md:hidden ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-1 border-t border-foreground/10 pb-2 pt-3 mt-3">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => go(item)}
                  className="rounded-xl px-4 py-3 text-left text-base font-medium text-foreground hover:bg-foreground/5"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => go({ label: "Contact", section: "contact" })}
                className="mt-1 rounded-xl bg-foreground px-4 py-3 text-left text-base font-semibold text-background"
              >
                Let's talk
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
