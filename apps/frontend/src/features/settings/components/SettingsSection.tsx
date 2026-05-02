import React from "react";

interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="md:pr-8">
        <h2 className="text-xl font-bold text-primary">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      </div>
      <div className="md:col-span-2">{children}</div>
    </section>
  );
};

export default SettingsSection;
