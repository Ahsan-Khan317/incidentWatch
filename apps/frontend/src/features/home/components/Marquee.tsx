import React from "react";
import { Zap } from "lucide-react";

const partners = [
  "Stripe",
  "Vercel",
  "GitHub",
  "Supabase",
  "Linear",
  "Railway",
  "Cloudflare",
  "PostHog",
  "Resend",
  "Bun",
];

export default function Marquee() {
  const marqueeItems = [...partners, ...partners];

  return (
    <section className="group border-b border-t my-8 border-dashed  border-border-soft  relative overflow-hidden transition-colors duration-500">
      <div className="mx-auto max-w-screen-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Label Section */}
          <div className="relative z-10 col-span-12 flex items-center border-b border-dashed border-border-soft bg-surface px-6 py-8 md:col-span-2 md:border-b-0 md:border-r md:px-10 shadow-[20px_0_40px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted whitespace-nowrap">
                Trusted Teams
              </span>
            </div>
          </div>

          {/* Marquee Section */}
          <div
            className="col-span-12 flex h-24 items-center overflow-hidden md:col-span-9"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div className="marquee-track">
              {marqueeItems.map((partner, index) => (
                <div
                  key={`${partner}-${index}`}
                  className="flex h-24 w-64 shrink-0 items-center justify-center border-r border-dashed border-border-soft px-10 transition-all duration-300 group/item"
                >
                  <div className="flex items-center gap-3 opacity-40 grayscale group-hover/item:opacity-100 group-hover/item:grayscale-0 transition-all duration-500">
                    <span className="text-xl font-display font-bold uppercase tracking-tighter text-heading whitespace-nowrap">
                      {partner}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </section>
  );
}
