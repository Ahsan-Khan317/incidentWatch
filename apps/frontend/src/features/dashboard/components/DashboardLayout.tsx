import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../auth/store/auth-store";
import { useRouter } from "next/navigation";
import { LogOut, User, Settings, MoreVertical } from "lucide-react";

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
  user: initialUser,
}) => {
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user: storeUser, logout } = useAuthStore();
  const router = useRouter();

  const user = storeUser || initialUser;

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await logout();
      router.push("/login");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showUserMenu]);

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
      <aside
        className={`fixed left-0 top-0 h-screen bg-surface-0 border-r border-border-soft flex flex-col justify-between py-6 z-40 shadow-soft transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"}`}
      >
        {/* Floating Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-surface-1 border border-border-soft rounded-md flex items-center justify-center text-muted hover:text-primary hover:border-primary shadow-sm transition-all z-50"
          title="Toggle Sidebar"
        >
          <span className="material-symbols-outlined text-[14px]">
            {isSidebarOpen ? "chevron_left" : "chevron_right"}
          </span>
        </button>

        <div>
          <div
            className={`px-6 mb-8 flex items-center ${isSidebarOpen ? "gap-3" : "justify-center flex-col gap-4"}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded flex shrink-0 items-center justify-center shadow-primary">
                <span className="material-symbols-outlined text-white text-xl">
                  security
                </span>
              </div>
              {isSidebarOpen && (
                <div>
                  <h1 className="text-primary font-display font-black text-lg leading-none">
                    IncidentWatch
                  </h1>
                  <p className="text-muted text-[12px] font-bold uppercase mt-1 tracking-widest">
                    Ops Control
                  </p>
                </div>
              )}
            </div>
          </div>
          <nav className="flex flex-col gap-1 px-3">
            {navItems.map((item) => (
              <a
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center py-2.5 rounded-md transition-all cursor-pointer ${isSidebarOpen ? "gap-3 px-3" : "justify-center px-0"} ${
                  activeView === item.id
                    ? "text-primary font-bold bg-primary-soft shadow-inner"
                    : "text-muted hover:text-heading hover:bg-surface-1 font-medium"
                }`}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {isSidebarOpen && (
                  <span className="text-sm tracking-tight">{item.label}</span>
                )}
              </a>
            ))}
          </nav>
        </div>
        <div className="px-4">
          <div
            className={`p-3 rounded-md border border-border-soft bg-surface-1 flex items-center transition-colors hover:border-border ${isSidebarOpen ? "gap-3" : "justify-center"}`}
          >
            <div className="w-10 h-10 shrink-0 rounded-md bg-primary-soft flex items-center justify-center text-primary font-bold border border-primary-muted">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            {isSidebarOpen && (
              <>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-heading truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted truncate font-medium">
                    {user.role}
                  </p>
                </div>
                <div className="relative ml-auto user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`w-9 h-9 flex items-center justify-center transition-all rounded-lg border ${
                      showUserMenu
                        ? "text-primary bg-primary-soft border-primary/20 shadow-inner scale-95"
                        : "text-muted border-transparent hover:text-heading hover:bg-surface-2 hover:border-border-soft"
                    }`}
                  >
                    <MoreVertical size={20} />
                  </button>

                  {/* Tooltip-style Menu */}
                  <div
                    className={`absolute bottom-[calc(100%+12px)] right-0 w-52 bg-surface-0 border border-border-soft rounded-xl shadow-2xl transition-all duration-300 z-50 overflow-hidden ${
                      showUserMenu
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-4 pointer-events-none"
                    }`}
                  >
                    <div className="bg-surface-1/80 backdrop-blur-md px-4 py-3 border-b border-border-soft flex items-center justify-between">
                      <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">
                        Management
                      </p>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    </div>

                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => {
                          setActiveView("settings");
                          setShowUserMenu(false);
                        }}
                        className="w-full px-3 py-3 text-left text-[11px] font-bold text-muted hover:text-primary hover:bg-primary-soft rounded-lg flex items-center gap-4 transition-all group/item"
                      >
                        <div className="w-8 h-8 rounded-md bg-surface-2 flex items-center justify-center group-hover/item:bg-primary/10 transition-colors border border-border-soft group-hover/item:border-primary/20">
                          <Settings
                            size={14}
                            className="group-hover/item:text-primary transition-colors"
                          />
                        </div>
                        SETTINGS
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowUserMenu(false);
                        }}
                        className="w-full px-3 py-3 text-left text-[11px] font-bold text-danger hover:bg-danger-soft rounded-lg flex items-center gap-4 transition-all group/item"
                      >
                        <div className="w-8 h-8 rounded-md bg-danger-soft flex items-center justify-center group-hover/item:bg-danger/20 transition-colors border border-danger/10 group-hover/item:border-danger/30">
                          <LogOut size={14} />
                        </div>
                        LOGOUT
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}
      >
        {/* TopAppBar */}
        <header className="h-16 sticky top-0 bg-surface-0/80 backdrop-blur-md border-b border-border-soft px-8 flex justify-between items-center z-30 transition-colors duration-300">
          <div className="flex items-center gap-4">
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
