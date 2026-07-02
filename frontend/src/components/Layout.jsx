import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Upload, CreditCard, BarChart3,
  Lightbulb, LogOut, Settings, User, Zap, ChevronRight
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/app" },
  { icon: Upload, label: "Upload Statement", path: "/app/upload" },
  { icon: CreditCard, label: "Transactions", path: "/app/transactions" },
  { icon: BarChart3, label: "Analytics", path: "/app/analytics" },
  { icon: Lightbulb, label: "AI Insights", path: "/app/insights" },
];

const accountItems = [
  { icon: User, label: "Profile", path: "/app/profile" },
  { icon: Settings, label: "Settings", path: "/app/settings" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isRouteActive = (path) => {
    if (path === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex w-screen min-h-screen bg-[#FAFAFA] text-[#111111] antialiased overflow-hidden">

      {/* Sidebar */}
      <aside
        className="w-[270px] shrink-0 bg-white h-screen flex flex-col justify-between border-r border-gray-100 z-20"
        style={{ boxShadow: "6px 0 30px rgba(0,0,0,0.015)" }}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">

          {/* Logo */}
          <div className="px-7 pt-7 pb-5">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
              <div className="w-10 h-10 bg-[#FF7A00] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Zap size={20} className="text-white" />
              </div>
              <span className="font-extrabold text-[#111111] text-lg tracking-tight">
                LostMoney<span className="text-[#FF7A00]">.AI</span>
              </span>
            </div>
          </div>

          {/* Nav */}
          <div className="flex flex-col gap-6 px-4 mt-2">

            {/* Main Menu */}
            <div>
              <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Main Menu
              </p>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const active = isRouteActive(item.path);
                  return (
                    <motion.button
                      key={item.path}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all text-left group ${
                        active
                          ? "bg-[#FF7A00] text-white shadow-md shadow-orange-500/20 font-bold"
                          : "text-[#6B7280] hover:bg-gray-50 hover:text-[#111111] font-medium"
                      }`}
                    >
                      <item.icon size={17} className={`shrink-0 ${active ? "text-white" : "text-gray-400 group-hover:text-[#FF7A00]"}`} />
                      <span className="text-sm flex-1">{item.label}</span>
                      {active && <ChevronRight size={13} className="opacity-70" />}
                    </motion.button>
                  );
                })}
              </nav>
            </div>

            {/* Account */}
            <div>
              <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Account
              </p>
              <nav className="space-y-1">
                {accountItems.map((item) => {
                  const active = isRouteActive(item.path);
                  return (
                    <motion.button
                      key={item.path}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all text-left group ${
                        active
                          ? "bg-[#FF7A00] text-white shadow-md shadow-orange-500/20 font-bold"
                          : "text-[#6B7280] hover:bg-gray-50 hover:text-[#111111] font-medium"
                      }`}
                    >
                      <item.icon size={17} className={`shrink-0 ${active ? "text-white" : "text-gray-400 group-hover:text-[#FF7A00]"}`} />
                      <span className="text-sm flex-1">{item.label}</span>
                      {active && <ChevronRight size={13} className="opacity-70" />}
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-gray-50">
          <div className="p-3 bg-[#FAFAFA] rounded-2xl border border-gray-100 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#FF7A00] to-orange-400 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-black">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#111111] truncate">{user?.username || "User"}</p>
                <p className="text-xs text-[#9CA3AF] truncate">{user?.email || ""}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { logout(); navigate("/login"); }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-red-500 bg-red-50/50 hover:bg-red-50 transition-all text-sm font-bold"
            >
              <LogOut size={14} />
              Logout
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen bg-[#FAFAFA]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}