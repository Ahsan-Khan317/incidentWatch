"use client";
import React, { useState, useEffect } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
  user: {
    name: string;
    role: string;
  };
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeView,
  setActiveView,
  user,
}) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const navItems = [
    { id: "dashboard", label: "Overview", icon: "dashboard" },
    { id: "incidents", label: "Incidents", icon: "error_med" },
    { id: "logs", label: "Logs", icon: "monitoring" },
    { id: "team", label: "Team", icon: "lan" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  const getHeaderTitle = () => {
    switch (activeView) {
      case "dashboard":
        return "Operations Overview";
      case "incidents":
        return "Incidents Management";
      case "logs":
        return "Live Logs";
      case "team":
        return "Engineering Team";
      case "settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="bg-page text-body font-body antialiased min-h-screen transition-colors duration-300">
      {/* Include Material Symbols */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `,
        }}
      />

      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-0 border-r border-border-soft flex flex-col justify-between py-6 z-40 shadow-soft transition-colors duration-300">
        <div>
          <div className="px-6 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center shadow-primary">
              <span className="material-symbols-outlined text-white text-xl">
                security
              </span>
            </div>
            <div>
              <h1 className="text-primary font-display font-black text-lg leading-none">
                IncidentWatch
              </h1>
              <p className="text-muted text-[12px] font-bold uppercase mt-1 tracking-widest">
                Ops Control
              </p>
            </div>
          </div>
          <nav className="flex flex-col gap-1 px-3">
            {navItems.map((item) => (
              <a
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all cursor-pointer ${
                  activeView === item.id
                    ? "text-primary font-bold bg-primary-soft shadow-inner"
                    : "text-muted hover:text-heading hover:bg-surface-1 font-medium"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-sm tracking-tight">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
        <div className="px-4">
          <div className="p-3 rounded-md border border-border-soft bg-surface-1 flex items-center gap-3 hover:border-border transition-colors">
            <div className="w-10 h-10 rounded-md bg-primary-soft flex items-center justify-center text-primary font-bold border border-primary-muted">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-heading truncate">
                {user.name}
              </p>
              <p className="text-xs text-muted truncate font-medium">
                {user.role}
              </p>
            </div>
            <span className="material-symbols-outlined text-muted ml-auto text-sm cursor-pointer hover:text-heading transition-colors">
              more_vert
            </span>
          </div>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* TopAppBar */}
        <header className="h-16 sticky top-0 bg-surface-0/80 backdrop-blur-md border-b border-border-soft px-8 flex justify-between items-center z-30 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button className="p-2 text-muted hover:text-heading hover:bg-surface-1 rounded-md transition-colors">
              <span className="material-symbols-outlined">menu_open</span>
            </button>
            <h2 className="font-display text-xl font-bold tracking-tight text-heading">
              {getHeaderTitle()}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-muted hover:text-heading hover:bg-surface-1 rounded-md transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-muted hover:text-heading hover:bg-surface-1 rounded-md transition-colors"
            >
              <span className="material-symbols-outlined">
                {isDark ? "light_mode" : "dark_mode"}
              </span>
            </button>
            <div className="h-6 w-px bg-border mx-2"></div>
            <button className="px-4 py-2 bg-primary text-on-primary text-[12px] font-bold tracking-widest rounded-md flex items-center gap-2 hover:bg-primary-hover hover:shadow-primary transition-all uppercase">
              <span className="material-symbols-outlined text-sm">
                add_alert
              </span>
              New Incident
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8 flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Floating Action Button */}
      {activeView === "dashboard" && (
        <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-md shadow-lg flex items-center justify-center hover:scale-105 hover:bg-primary-hover active:scale-95 transition-all z-50">
          <span className="material-symbols-outlined text-2xl">
            support_agent
          </span>
        </button>
      )}
    </div>
  );
};
