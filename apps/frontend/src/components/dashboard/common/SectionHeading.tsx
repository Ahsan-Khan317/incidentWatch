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
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="mb-1 text-3xl font-light tracking-tight text-heading sm:text-4xl">
          {href ? (
            <Link
              href={href}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              {title}
            </Link>
          ) : (
            title
          )}
        </h1>
        {description && <p className="text-xs text-body">{description}</p>}
      </div>

      {hasActions ? (
        <div className="flex items-center gap-3">{children}</div>
      ) : null}
    </div>
  );
};

export default SectionHeading;
