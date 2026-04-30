"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Brain, Users, Zap, BarChart3, Shield, Bell } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "AI Root Cause Analysis",
    desc: "Claude-powered log analysis gives probable cause and fix recommendations in seconds.",
    icon: Brain,
  },
  {
    title: "Auto-Assign by Expertise",
    desc: "Smartly routes incidents to the right engineer using skill tags like DB, AWS, Frontend.",
    icon: Users,
  },
  {
    title: "3-Minute Auto-Escalation",
    desc: "If no acknowledgement happens, the next on-call engineer is notified automatically.",
    icon: Zap,
  },
  {
    title: "One-Click Postmortems",
    desc: "Generate clean professional postmortems from incident timelines instantly.",
    icon: BarChart3,
  },
  {
    title: "Real-Time Status Page",
    desc: "Keep users informed with a public dashboard updated live.",
    icon: Shield,
  },
  {
    title: "Instant Notifications",
    desc: "Slack, Email and SMS alerts with custom severity rules.",
    icon: Bell,
  },
];

export const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        gsap.set(card, {
          y: i * 14,
          scale: 1 - i * 0.025,
          opacity: i === 0 ? 1 : 0.9,
          zIndex: cards.length - i,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${cards.length * 650}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      for (let i = 0; i < cards.length - 1; i++) {
        tl.to(
          cards[i],
          {
            y: -180,
            opacity: 0,
            scale: 0.92,
            duration: 1,
            ease: "power3.out",
          },
          i,
        );

        for (let j = i + 1; j < cards.length; j++) {
          const depth = j - i - 1;

          tl.to(
            cards[j],
            {
              y: depth * 14,
              scale: 1 - depth * 0.025,
              opacity: depth === 0 ? 1 : 0.88,
              duration: 1,
              ease: "power3.out",
            },
            i,
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative bg-white dark:bg-neutral-950 py-10 transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
            Built for{" "}
            <span className="text-green-600 dark:text-green-400">
              Reliability
            </span>
          </h2>

          <p className="mt-4 text-lg text-slate-600 dark:text-white/60 max-w-2xl mx-auto">
            Manage the full incident lifecycle — detect faster, respond smarter,
            recover quicker.
          </p>
        </div>

        {/* Stack */}
        <div className="h-[70vh] flex items-center justify-center">
          <div className="relative w-full max-w-5xl h-[460px]">
            {features.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  ref={(el) => {
                    if (el) cardsRef.current[index] = el;
                  }}
                  className="absolute inset-0"
                >
                  <div
                    className="
                    group relative h-full w-full overflow-hidden rounded-3xl
                    border border-slate-200 dark:border-white/10
                    bg-white dark:bg-neutral-900
                    shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                    dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]
                    p-8 md:p-12 flex flex-col justify-between
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_30px_80px_rgba(16,185,129,0.10)]
                    dark:hover:shadow-[0_30px_80px_rgba(34,197,94,0.14)]
                  "
                  >
                    {/* Glow */}
                    <div
                      className="
                      absolute inset-0 pointer-events-none rounded-3xl
                      bg-[radial-gradient(circle_at_top_right,rgba(22,163,74,0.06),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.04),transparent_28%)]
                      dark:bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.10),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_28%)]
                    "
                    />

                    {/* Top */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                          <Icon className="h-7 w-7 text-green-600 dark:text-green-400" />
                        </div>

                        <div>
                          <span className="block text-xs uppercase tracking-[0.25em] font-medium text-slate-400 dark:text-white/40">
                            Feature {index + 1}
                          </span>

                          <span className="text-sm text-slate-500 dark:text-white/55">
                            Smart Automation
                          </span>
                        </div>
                      </div>

                      <span className="text-6xl font-bold text-slate-100 dark:text-white/5">
                        0{index + 1}
                      </span>
                    </div>

                    {/* Middle */}
                    <div className="relative z-10">
                      <h3 className="text-3xl md:text-5xl font-bold leading-tight mb-5 text-slate-900 dark:text-white">
                        {item.title}
                      </h3>

                      <p className="text-lg leading-relaxed max-w-2xl mb-6 text-slate-600 dark:text-white/65">
                        {item.desc}
                      </p>

                      <div className="grid grid-cols-2 gap-3 max-w-xl">
                        <div className="text-sm text-slate-500 dark:text-white/50">
                          ✓ Faster Recovery
                        </div>
                        <div className="text-sm text-slate-500 dark:text-white/50">
                          ✓ Real-Time Insights
                        </div>
                        <div className="text-sm text-slate-500 dark:text-white/50">
                          ✓ Smart Routing
                        </div>
                        <div className="text-sm text-slate-500 dark:text-white/50">
                          ✓ Team Ready
                        </div>
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="relative z-10 space-y-4">
                      <div className="h-1.5 w-36 rounded-full bg-green-600 dark:bg-green-500" />

                      <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-xl bg-slate-50 dark:bg-white/5 px-3 py-2">
                          <p className="text-xs text-slate-400 dark:text-white/35">
                            Speed
                          </p>
                          <p className="text-sm font-semibold text-slate-800 dark:text-white">
                            30s
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 dark:bg-white/5 px-3 py-2">
                          <p className="text-xs text-slate-400 dark:text-white/35">
                            Accuracy
                          </p>
                          <p className="text-sm font-semibold text-slate-800 dark:text-white">
                            94%
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 dark:bg-white/5 px-3 py-2">
                          <p className="text-xs text-slate-400 dark:text-white/35">
                            Status
                          </p>
                          <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                            Online
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-slate-400 dark:text-white/35">
                        <span>Enterprise Grade</span>
                        <span>DevDynasty</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
