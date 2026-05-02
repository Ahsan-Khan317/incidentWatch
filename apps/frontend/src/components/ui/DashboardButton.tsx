"use client";

import React from "react";

interface DashboardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const DashboardButton = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: DashboardButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary: "bg-primary text-black hover:bg-primary-strong",
    secondary: "bg-surface-2 text-heading hover:bg-white/10",
    outline:
      "border border-border bg-transparent text-heading hover:bg-white/5",
    danger:
      "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
  };

  const sizes = {
    sm: "h-8 px-3 text-[10px]",
    md: "h-9 px-4 text-xs",
    lg: "h-10 px-6 text-sm",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default DashboardButton;
