import React from "react";

interface SectionHeadingProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const SectionHeading = ({
  title,
  description,
  children,
}: SectionHeadingProps) => {
  const hasActions = Boolean(children);

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="mb-1 text-3xl font-light tracking-tight text-heading sm:text-4xl">
          {title}
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
