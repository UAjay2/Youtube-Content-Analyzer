import { useState } from "react";
import { siteConfig } from "../config/siteConfig.js";

const LINKS = [
  { href: "#analyze", label: "Analyze" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#about", label: "About" },
];

const STATUS_TEXT = {
  checking: "Checking server",
  online: "Server online",
  offline: "Server offline",
};

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
      <circle
        cx="16"
        cy="16"
        r="13"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path d="M13 10.5v11l9-5.5z" fill="currentColor" />
    </svg>
  );
}

function Navbar({ status, onRecheck }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a className="brand" href="#top">
          <BrandMark />
          <span>{siteConfig.shortName}</span>
        </a>

        <nav
          id="site-nav"
          className="nav-links"
          data-open={open}
          aria-label="Main"
        >
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="server-status"
          data-state={status}
          onClick={onRecheck}
          title="Click to check the server again"
        >
          <span className="status-dot" aria-hidden="true" />
          <span className="status-label" aria-live="polite">
            {STATUS_TEXT[status]}
          </span>
        </button>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Menu</span>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path
              d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
