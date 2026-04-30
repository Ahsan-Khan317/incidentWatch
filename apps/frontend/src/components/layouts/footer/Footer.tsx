import React from "react";

const FOOTER_CONFIG = {
  brand: {
    name: "IncidentWatch",
    description:
      "The mission-critical incident response platform for modern engineering teams. Built for speed, reliability, and collaboration.",
  },
  socials: [
    { label: "𝕏", href: "#" },
    { label: "GH", href: "#" },
    { label: "LI", href: "#" },
  ],
  sections: [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#" },
        { label: "Anomaly Engine", href: "#" },
        { label: "Integrations", href: "#" },
        { label: "Pricing", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
  ],
  bottomLinks: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export const Footer = () => {
  return (
    <footer className="py-20 px-6 border-t border-border-soft bg-surface-0/80 backdrop-blur-md">
      <div className="container-max">
        <div className="grid md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-sm" />
              </div>
              <span className="font-display font-bold text-xl uppercase tracking-tighter text-heading">
                {FOOTER_CONFIG.brand.name}
              </span>
            </div>
            <p className="text-body text-sm leading-relaxed max-w-xs font-body mb-8">
              {FOOTER_CONFIG.brand.description}
            </p>
            <div className="flex gap-4">
              {FOOTER_CONFIG.socials.map((social, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border border-border-soft flex items-center justify-center text-muted hover:text-primary hover:border-primary/30 transition-all cursor-pointer"
                >
                  <span className="text-xs font-bold">{social.label}</span>
                </div>
              ))}
            </div>
          </div>

          {FOOTER_CONFIG.sections.map((section, i) => (
            <div key={i} className="md:col-span-2">
              <h4 className="font-display font-bold uppercase tracking-widest text-[10px] text-muted mb-8">
                {section.title}
              </h4>
              <ul className="space-y-2 text-sm font-body">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <a
                      href={link.href}
                      className="text-body hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-4">
            <h4 className="font-display font-bold uppercase tracking-widest text-[10px] text-muted mb-8">
              Newsletter
            </h4>
            <p className="text-sm text-body font-body mb-6">
              Get the latest engineering best practices and uptime updates.
            </p>
            <div className="flex gap-2 p-1 border border-border-soft rounded-xl bg-surface-1 overflow-hidden">
              <input
                type="email"
                placeholder="name@email.com"
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm px-3 flex-1 text-heading"
              />
              <button className="btn btn-primary font-display px-6 py-3 rounded-lg tracking-tight">
                <span className="btn-slide">
                  <span>Join Now</span>
                  <span>Join Now</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-dashed border-border-soft flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-widest text-muted font-medium">
            © 2026 {FOOTER_CONFIG.brand.name}. All rights reserved.
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest text-muted font-medium">
            {FOOTER_CONFIG.bottomLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
