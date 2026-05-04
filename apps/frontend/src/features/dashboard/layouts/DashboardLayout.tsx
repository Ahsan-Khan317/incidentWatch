import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuthStore } from "../../auth/store/auth-store";
import DashboardNavbar from "../components/DashboardNavbar";
import { useViewStore } from "../store/view-store";
import DashboardSidebar from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    name: string;
    role: string;
  };
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  user: initialUser,
}) => {
  const { activeView } = useViewStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user: storeUser, logout } = useAuthStore();
  const router = useRouter();

  const user = storeUser || initialUser;

  // Auto-manage sidebar based on screen size
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-page text-body font-body antialiased h-screen transition-colors duration-500 flex flex-col overflow-hidden">
      {/* TopAppBar */}
      <DashboardNavbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1 h-[calc(100vh-64px)] overflow-hidden">
        {/* Sidebar - Below Header */}
        <DashboardSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-surface-0/30">
          {children}
        </main>
      </div>

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
