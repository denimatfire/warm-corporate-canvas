import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-foreground/10 px-6 py-10">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
      <p>© {new Date().getFullYear()} Dhrubajyoti Das</p>
      <div className="flex items-center gap-6">
        <Link to="/writing" className="transition-colors hover:text-foreground">Writing</Link>
        <Link to="/photos" className="transition-colors hover:text-foreground">Photos</Link>
        <Link to="/login" className="transition-colors hover:text-foreground">Writer login</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
