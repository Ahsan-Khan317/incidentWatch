import React from "react";
import Link from "next/link";

interface SectionHeadingProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  href?: string;
}

const SectionHeading = ({
  title,
  description,
  children,
  href,
}: SectionHeadingProps) => {
  const hasActions = Boolean(children);

  return (
    <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="flex-1">
        <h1 className="mb-2 text-3xl font-black tracking-tighter text-heading sm:text-5xl uppercase italic">
          {href ? (
            <Link
              href={href}
              className="hover:text-primary transition-all cursor-pointer decoration-primary decoration-4 underline-offset-8 hover:underline"
            >
              {title}
            </Link>
          ) : (
            title
          )}
        </h1>
        {description && (
          <p className="text-[10px] text-body uppercase tracking-[0.2em] font-medium opacity-60 max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {hasActions ? (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default SectionHeading;
