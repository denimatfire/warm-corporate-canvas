import { Link } from "react-router-dom";

const linkClass = "transition-colors hover:text-foreground";

const Footer = () => (
  <footer className="border-t border-foreground/10 px-6 py-10">
    <div className="mx-auto flex max-w-6xl flex-col gap-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
      <p>© {new Date().getFullYear()} Dhrubajyoti Das</p>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Link to="/projects" className={linkClass}>Projects</Link>
        <Link to="/writing" className={linkClass}>Writing</Link>
        <Link to="/photos" className={linkClass}>Photos</Link>
        <Link to="/career" className={linkClass}>My Journey</Link>
        <Link to="/cv" className={linkClass}>Interactive CV</Link>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
        <span className="text-muted-foreground/70">Page manager:</span>
        <Link to="/admin/articles" className={linkClass}>Articles</Link>
        <Link to="/admin/photos" className={linkClass}>Photos</Link>
        <Link to="/admin/projects" className={linkClass}>Projects</Link>
        <Link to="/admin/contacts" className={linkClass}>Contacts</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
