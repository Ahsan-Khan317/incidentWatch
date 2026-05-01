import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../auth/store/auth-store";
import { useRouter } from "next/navigation";
import { LogOut, User, Settings, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isDark, setIsDark] = useState(true); // FORCED DARK MODE BY DEFAULT
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
      {/* SideNavBar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen bg-surface-0 border-r border-border-soft flex flex-col justify-between py-6 z-40 shadow-soft overflow-hidden"
      >
        <div>
          {/* Brand Area */}
          <div
            className={`px-5 flex items-center h-8 ${isSidebarOpen ? "gap-3" : "justify-center"}`}
          >
            <div className="w-8 h-8 bg-primary rounded flex shrink-0 items-center justify-center shadow-primary">
              <span className="material-symbols-outlined text-white text-xl">
                security
              </span>
            </div>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap"
                >
                  <h1 className="text-primary font-display font-black text-lg leading-none">
                    IncidentWatch
                  </h1>
                  <p className="text-muted text-[12px] font-bold uppercase mt-1 tracking-widest">
                    Ops Control
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider + Toggle Row */}
          <div className="mt-5 mb-5 mx-4 border-t border-border-soft" />
          <div
            className={`px-3 mb-4 ${isSidebarOpen ? "" : "flex justify-center"}`}
          >
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`flex items-center gap-3 py-2 px-3 rounded-md text-muted hover:text-primary hover:bg-primary-soft transition-all w-full ${!isSidebarOpen ? "justify-center w-auto" : ""}`}
              title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <motion.span
                animate={{ rotate: isSidebarOpen ? 0 : 180 }}
                className="material-symbols-outlined text-[20px]"
              >
                menu_open
              </motion.span>
              {isSidebarOpen && (
                <span className="text-xs font-bold uppercase tracking-widest">
                  Collapse
                </span>
              )}
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-3">
            {navItems.map((item) => (
              <a
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`relative flex items-center py-2.5 rounded-md transition-all duration-200 cursor-pointer ${isSidebarOpen ? "gap-3 px-3" : "justify-center px-0"} ${
                  activeView === item.id
                    ? "text-primary font-bold"
                    : "text-muted hover:text-heading hover:bg-surface-1 font-medium"
                }`}
                title={!isSidebarOpen ? item.label : undefined}
              >
                {activeView === item.id && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 bg-primary-soft border border-primary/20 rounded-md shadow-inner"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="material-symbols-outlined relative z-10">
                  {item.icon}
                </span>
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm tracking-tight relative z-10 whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
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
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center flex-1 overflow-hidden"
                >
                  <div className="overflow-hidden flex-1 ml-3">
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
                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 10 }}
                          className="absolute bottom-[calc(100%+12px)] right-0 w-52 bg-surface-0 border border-border-soft rounded-xl shadow-2xl z-50 overflow-hidden origin-bottom-right"
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
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Main Wrapper */}
      <motion.div
        initial={false}
        animate={{ marginLeft: isSidebarOpen ? 256 : 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex flex-col min-h-screen"
      >
        {/* TopAppBar */}
        <header className="h-16 sticky top-0 bg-surface-0 border-b border-border-soft px-8 flex justify-between items-center z-30 transition-colors duration-300">
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
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {children}
        </main>
      </motion.div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-md shadow-lg flex items-center justify-center hover:scale-110 hover:bg-primary-hover active:scale-95 transition-all z-50 hover:shadow-primary"
      >
        <span className="material-symbols-outlined text-2xl">
          support_agent
        </span>
      </motion.button>
    </div>
  );
};
