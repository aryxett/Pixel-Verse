import React from "react";
import { Gamepad2 as GamepadIcon } from "lucide-react";
import "./Footer.css";

// Simplified SocialIcon placeholder since we don't have specific logos defined
function SocialIcon({ name, size }: { name: string; size: number }) {
  // Can be replaced with actual Lucide icons like Twitter, Github, etc.
  return <span style={{ fontSize: size - 4, fontWeight: 'bold' }}>{name[0]}</span>;
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <div className="navbar__logo">
            <GamepadIcon size={22} color="var(--text-primary)" />
            <span className="navbar__logo-name">PixelVerse</span>
          </div>
          <p className="site-footer__tagline">
            AI-powered game discovery, built by gamers, for gamers.
          </p>
          <div className="site-footer__socials">
            {["Twitter", "Discord", "Github", "Youtube"].map((s) => (
              <a key={s} href="#" className="site-footer__social-icon" aria-label={s}>
                <SocialIcon name={s} size={18} />
              </a>
            ))}
          </div>
        </div>
        <FooterColumn
          title="Platform"
          links={["Explore", "Trending", "AI Advisor", "Decision Engine"]}
        />
        <FooterColumn
          title="Resources"
          links={["Documentation", "API", "Changelog", "Status"]}
        />
        <FooterColumn
          title="Legal"
          links={["Privacy Policy", "Terms of Service", "Cookie Settings"]}
        />
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} PixelVerse AI. All rights reserved.</span>
        <span className="site-footer__badge">
          <span className="site-footer__badge-pulse" /> Built with PixelVerse AI
        </span>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="site-footer__column">
      <h4>{title}</h4>
      <ul>
        {links.map((l) => (
          <li key={l}>
            <a href="#">{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
