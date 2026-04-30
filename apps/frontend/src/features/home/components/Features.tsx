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
      // Initial stack
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
    <section id="features" ref={sectionRef} className="relative bg-white py-10">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
            Built for <span className="text-green-600">Reliability</span>
          </h2>

          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Manage the full incident lifecycle — detect faster, respond smarter,
            recover quicker.
          </p>
        </div>

        {/* Stack Centered */}
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
                  <div className="h-full w-full rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 md:p-12 flex flex-col justify-between">
                    {/* Top */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center">
                          <Icon className="h-7 w-7 text-green-600" />
                        </div>

                        <span className="text-xs tracking-[0.25em] uppercase text-slate-400 font-medium">
                          Feature {index + 1}
                        </span>
                      </div>

                      <span className="text-6xl font-bold text-slate-100">
                        0{index + 1}
                      </span>
                    </div>

                    {/* Middle */}
                    <div>
                      <h3 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-5">
                        {item.title}
                      </h3>

                      <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
                        {item.desc}
                      </p>
                    </div>

                    {/* Bottom */}
                    <div className="h-1 w-28 rounded-full bg-green-600" />
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
