"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Brain, Users, Zap, BarChart3, Shield, Bell } from "lucide-react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
gsap.registerPlugin(ScrollTrigger);

const CARD_Y_OFFSET = 5;
const CARD_SCALE_STEP = 0.075;

const features = [
  {
    title: "AI Root Cause Analysis",
    desc: "Claude-powered log analysis gives probable cause and fix recommendations in seconds.",
    icon: Brain,
    bullets: [
      "Faster Recovery",
      "Real-Time Insights",
      "Smart Routing",
      "Team Ready",
    ],
    stats: [
      { label: "Speed", value: "30s" },
      { label: "Accuracy", value: "94%" },
      { label: "Status", value: "Online", isHighlight: true },
    ],
  },
  {
    title: "Auto-Assign by Expertise",
    desc: "Smartly routes incidents to the right engineer using skill tags like DB, AWS, Frontend.",
    icon: Users,
    bullets: [
      "Skill Tagging",
      "Load Balancing",
      "Auto-Routing",
      "Expert Sourcing",
    ],
    stats: [
      { label: "Routing", value: "Instant" },
      { label: "Coverage", value: "100%" },
      { label: "Status", value: "Active", isHighlight: true },
    ],
  },
  {
    title: "3-Minute Auto-Escalation",
    desc: "If no acknowledgement happens, the next on-call engineer is notified automatically.",
    icon: Zap,
    bullets: [
      "Zero-Delay",
      "Smart Schedules",
      "Voice/SMS Support",
      "Failover Ready",
    ],
    stats: [
      { label: "SLA", value: "3m" },
      { label: "Drift", value: "<1s" },
      { label: "Status", value: "Enabled", isHighlight: true },
    ],
  },
  {
    title: "One-Click Postmortems",
    desc: "Generate clean professional postmortems from incident timelines instantly.",
    icon: BarChart3,
    bullets: [
      "Auto-Timeline",
      "Fix Verification",
      "PDF Export",
      "Knowledge Base",
    ],
    stats: [
      { label: "Format", value: "PDF/MD" },
      { label: "Effort", value: "-90%" },
      { label: "Status", value: "Ready", isHighlight: true },
    ],
  },
  {
    title: "Real-Time Status Page",
    desc: "Keep users informed with a public dashboard updated live.",
    icon: Shield,
    bullets: [
      "Public URLs",
      "Private/Internal",
      "Auto-Updates",
      "Custom Branding",
    ],
    stats: [
      { label: "Latency", value: "40ms" },
      { label: "Uptime", value: "99.99%" },
      { label: "Status", value: "Live", isHighlight: true },
    ],
  },
  {
    title: "Instant Notifications",
    desc: "Slack, Email and SMS alerts with custom severity rules.",
    icon: Bell,
    bullets: ["Slack/Teams", "Email/SMS", "PagerDuty Sync", "Custom Rules"],
    stats: [
      { label: "Channels", value: "8+" },
      { label: "Delivery", value: "100%" },
      { label: "Status", value: "Configed", isHighlight: true },
    ],
  },
];

export const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    const totalCards = cards.length;
    if (!totalCards) return;

    const ctx = gsap.context(() => {
      gsap.ticker.lagSmoothing(0);

      cards.forEach((card, index) => {
        gsap.set(card, {
          xPercent: -50,
          yPercent: -50 + index * CARD_Y_OFFSET,
          scale: 1 - index * CARD_SCALE_STEP,
          rotationX: 0,
          force3D: true,
        });
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${window.innerHeight * (totalCards - 1)}px`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const segmentSizeFixed = 1 / (totalCards - 1);
          const activeIndex = Math.min(
            Math.floor(progress / segmentSizeFixed),
            totalCards - 1,
          );
          const segProgress =
            (progress - activeIndex * segmentSizeFixed) / segmentSizeFixed;

          cards.forEach((card, index) => {
            if (index < activeIndex) {
              gsap.set(card, { yPercent: -250, rotationX: 35, scale: 1 });
            } else if (index === activeIndex) {
              if (index === totalCards - 1) {
                gsap.set(card, { yPercent: -50, rotationX: 0, scale: 1 });
              } else {
                gsap.set(card, {
                  yPercent: gsap.utils.interpolate(-50, -200, segProgress),
                  rotationX: gsap.utils.interpolate(0, 35, segProgress),
                  scale: 1,
                });
              }
            } else {
              const effectiveBehind = index - activeIndex - segProgress;
              gsap.set(card, {
                yPercent: -50 + effectiveBehind * CARD_Y_OFFSET,
                rotationX: 0,
                scale: 1 - effectiveBehind * CARD_SCALE_STEP,
              });
            }
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative h-svh overflow-hidden transition-colors duration-300"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      <div
        className="absolute inset-0 -z-10 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, var(--color-primary-soft) 0%, transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-display font-bold uppercase tracking-tight text-heading">
            Built for <span className="text-primary">Reliability</span>
          </h2>

          <p className="mt-4 text-lg text-body max-w-2xl mx-auto font-body">
            Manage the full incident lifecycle — detect faster, respond smarter,
            recover quicker.
          </p>
        </div>

        {/* Stack */}
        <div className="h-[70vh] flex items-center justify-center">
          <div className="relative w-full max-w-5xl h-[500px]">
            {features.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  ref={(el) => {
                    if (el) cardsRef.current[index] = el;
                  }}
                  style={{
                    zIndex: features.length - index,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    willChange: "transform",
                  }}
                  className="absolute top-1/2 left-1/2 w-full h-full origin-bottom"
                >
                  <div
                    className="
                    group relative h-full w-full overflow-hidden rounded-sm
                    border border-border-soft
                    bg-surface-1
                    p-8 md:p-12 flex flex-col justify-between
                    transition-all duration-300
                    hover:border-primary/20
                  "
                  >
                    {/* Glow */}
                    <div
                      className="
                      absolute inset-0 pointer-events-none rounded-sm opacity-10
                      bg-[radial-gradient(circle_at_top_right,var(--color-primary),transparent_40%)]
                    "
                    />

                    {/* Top */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-primary-soft flex items-center justify-center border border-primary/10">
                          <Icon className="h-7 w-7 text-primary" />
                        </div>

                        <div>
                          <span className="block text-xs uppercase tracking-[0.25em] font-medium text-muted">
                            Feature {index + 1}
                          </span>

                          <span className="text-sm text-body/80 font-body">
                            Smart Automation
                          </span>
                        </div>
                      </div>

                      <span className="text-6xl font-display font-bold text-heading/60 select-none">
                        0{index + 1}
                      </span>
                    </div>

                    {/* Middle */}
                    <div className="relative z-10">
                      <h3 className="text-3xl md:text-5xl font-display font-bold uppercase leading-tight mb-5 text-heading">
                        {item.title}
                      </h3>

                      <p className="text-lg leading-relaxed max-w-2xl mb-6 text-body font-body">
                        {item.desc}
                      </p>

                      <div className="grid grid-cols-2 gap-y-4 gap-x-3 max-w-xl font-body">
                        {item.bullets.map((bullet, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm"
                          >
                            <HugeiconsIcon
                              icon={CheckmarkCircle02Icon}
                              size={20}
                              color="green"
                              strokeWidth={1.5}
                            />
                            <span>{bullet}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="relative z-10 space-y-4">
                      <div className="h-1 w-36 rounded-full bg-primary" />

                      <div className="grid grid-cols-3 gap-4 font-body">
                        {item.stats.map((stat, idx) => (
                          <div
                            key={idx}
                            className="rounded-sm bg-surface-2 px-3 py-2 border border-border-soft"
                          >
                            <p className="text-[10px] uppercase tracking-wider">
                              {stat.label}
                            </p>
                            <p
                              className={`text-sm font-bold ${stat.isHighlight ? "text-primary" : "text-heading"}`}
                            >
                              {stat.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted/60 font-medium">
                        <span>Enterprise Grade</span>
                        <span>IncidentWatch AI</span>
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
