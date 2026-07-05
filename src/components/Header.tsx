import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/i/1-about-hcd", label: "About HCD" },
  { href: "/books", label: "Books", badge: "Buy" },
  { href: "/blogs", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "http://humanconsciousnessdecoded.org", label: "HCD.ORG", external: true },
];

export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo-link" aria-label="Human Consciousness Decoded home">
          <Image src="/img/logo.png" alt="HCD" width={190} height={56} priority />
        </Link>

        <input className="nav-toggle" id="nav-toggle" type="checkbox" aria-hidden="true" />
        <label className="nav-toggle-button" htmlFor="nav-toggle" aria-label="Open menu">
          <Menu size={22} />
          <span>Menu</span>
        </label>

        <nav className="site-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
            >
              {item.label}
              {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
