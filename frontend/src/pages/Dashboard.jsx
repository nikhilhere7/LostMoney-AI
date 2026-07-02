import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp, TrendingDown, Wallet, Receipt,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Search, Bell,
  Trash2, ChevronRight, ChevronLeft, FileText,
  User, Settings, LogOut, Sparkles
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

/* ------------------------------------------------------------------ */
/*  Brand tokens — shared with the marketing site & auth screens       */
/* ------------------------------------------------------------------ */
const INK = "#111111";
const SLATE = "#6B7280";
const CREAM = "#FFF4EC";
const ACCENT = "#FF7A00";
const LINE = "rgba(17,17,17,0.06)";

const COLORS = ["#FF7A00", "#111111", "#2F9E6E", "#6C63FF", "#E4572E", "#0EA5A4", "#C9A15C"];

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');`;

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */
function AnimatedNumber({ value, prefix = "", decimals = 0 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(value) || 0;
    if (start === end) return;
    const duration = 1200;
    const step = (end - start) / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { clearInterval(timer); start = end; }
      setDisplay(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      {prefix}{display.toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}
    </span>
  );
}

const CardSkeleton = () => (
  <div className="bg-white rounded-[28px] p-6 border border-black/[0.05] animate-pulse">
    <div className="w-11 h-11 bg-gray-100 rounded-2xl mb-6" />
    <div className="h-3 bg-gray-100 rounded-full w-20 mb-3" />
    <div className="h-7 bg-gray-100 rounded-full w-28" />
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111111] shadow-xl rounded-2xl px-4 py-3">
        <p className="text-[11px] text-white/50 mb-1.5 font-medium">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-semibold" style={{ color: p.color, fontFamily: "'IBM Plex Mono', monospace" }}>
            {p.name} · ₹{parseFloat(p.value).toLocaleString("en-IN")}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ------------------------------------------------------------------ */
/*  Profile dropdown                                                    */
/* ------------------------------------------------------------------ */
function ProfileDropdown({ user, navigate, logout }) {
  const [open, setOpen] = useState(false);
  const [statements, setStatements] = useState([]);
  const [showStatements, setShowStatements] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setShowStatements(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchStatements = async () => {
    try {
      const res = await API.get("/statements/");
      setStatements(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await API.delete(`/statements/${id}/`);
      setStatements((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { setOpen(!open); if (!open) fetchStatements(); }}
        className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm cursor-pointer ring-2 ring-white"
        style={{ background: `linear-gradient(135deg, ${ACCENT}, #FF9A3D)` }}
      >
        <span className="text-white text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {user?.username?.[0]?.toUpperCase() || "U"}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-13 mt-2 w-72 bg-white rounded-[22px] shadow-[0_20px_50px_rgba(17,17,17,0.14)] border border-black/[0.05] z-50 overflow-hidden"
          >
            {!showStatements ? (
              <>
                <div className="px-5 py-4 border-b border-black/[0.05]" style={{ background: "linear-gradient(135deg, #FFF4EC, #FFE8D6)" }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${ACCENT}, #FF9A3D)` }}
                    >
                      <span className="text-white font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {user?.username?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#111111] text-sm truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{user?.username}</p>
                      <p className="text-xs text-[#6B7280] truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  {[
                    { icon: User, label: "Profile", action: () => { setOpen(false); navigate("/profile"); } },
                    { icon: Settings, label: "Settings", action: () => { setOpen(false); navigate("/settings"); } },
                  ].map((item) => (
                    <button key={item.label} onClick={item.action}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#FFF7F0] transition-colors text-left">
                      <item.icon size={16} className="text-[#6B7280]" />
                      <span className="text-sm font-medium text-[#111111]">{item.label}</span>
                    </button>
                  ))}
                  <button onClick={() => { setShowStatements(true); fetchStatements(); }}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-colors text-left">
                    <Trash2 size={16} className="text-red-400" />
                    <span className="text-sm font-medium text-red-400">Delete statement</span>
                    <ChevronRight size={14} className="text-red-300 ml-auto" />
                  </button>
                </div>
                <div className="border-t border-black/[0.05] py-2">
                  <button onClick={() => { logout(); navigate("/login"); }}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-colors text-left">
                    <LogOut size={16} className="text-red-400" />
                    <span className="text-sm font-medium text-red-400">Log out</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="px-5 py-4 border-b border-black/[0.05] flex items-center gap-3">
                  <button onClick={() => setShowStatements(false)}
                    className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <ChevronLeft size={14} className="text-gray-500" />
                  </button>
                  <p className="font-semibold text-[#111111] text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Delete statement</p>
                </div>
                <div className="max-h-64 overflow-y-auto py-2">
                  {statements.length > 0 ? statements.map((s) => (
                    <div key={s.id} className="flex items-center justify-between px-5 py-3 hover:bg-[#FFF7F0] transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                          <FileText size={14} className="text-red-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#111111] truncate max-w-[140px]">{s.file_name}</p>
                          <p className="text-[10px] text-[#6B7280] mt-0.5">{s.status} · {s.transaction_count} txns</p>
                        </div>
                      </div>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(s.id)} disabled={deleting === s.id}
                        className="w-7 h-7 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors ml-2 shrink-0">
                        {deleting === s.id ? (
                          <svg className="animate-spin h-3 w-3 text-red-400" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                          </svg>
                        ) : (
                          <Trash2 size={13} className="text-red-400" />
                        )}
                      </motion.button>
                    </div>
                  )) : (
                    <div className="py-8 text-center">
                      <p className="text-sm text-[#6B7280]">No statements found</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard                                                           */
/* ------------------------------------------------------------------ */
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [reports, setReports] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, c, r, t] = await Promise.all([
          API.get("/transactions/summary/"),
          API.get("/transactions/by-category/"),
          API.get("/analytics/monthly-reports/"),
          API.get("/transactions/"),
        ]);
        setSummary(s.data);
        setCategories(Array.isArray(c.data) ? c.data : []);
        setReports(Array.isArray(r.data) ? r.data : []);
        setTransactions(Array.isArray(t.data) ? t.data.slice(0, 6) : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cards = [
    {
      label: "Total income",
      value: summary?.total_income || 0,
      icon: TrendingUp,
      tint: "#E8F7EE",
      iconColor: "#1E9E5B",
      badge: "+12.5%",
      badgeColor: "text-[#1E9E5B] bg-[#E8F7EE]",
      glow: "rgba(30,158,91,0.16)",
    },
    {
      label: "Total expenses",
      value: summary?.total_expenses || 0,
      icon: TrendingDown,
      tint: "#FDEBEA",
      iconColor: "#E24C43",
      badge: "-3.2%",
      badgeColor: "text-[#E24C43] bg-[#FDEBEA]",
      glow: "rgba(226,76,67,0.14)",
    },
    {
      label: "Net savings",
      value: summary?.net_savings || 0,
      icon: Wallet,
      tint: "#FFEEDD",
      iconColor: ACCENT,
      badge: "+8.1%",
      badgeColor: "text-[#FF7A00] bg-[#FFEEDD]",
      glow: "rgba(255,122,0,0.18)",
    },
    {
      label: "Transactions",
      value: summary?.total_transactions || 0,
      icon: Receipt,
      tint: "#EFEDFF",
      iconColor: "#6C63FF",
      badge: `${summary?.total_transactions || 0} total`,
      badgeColor: "text-[#6C63FF] bg-[#EFEDFF]",
      isCount: true,
      glow: "rgba(108,99,255,0.16)",
    },
  ];

  const barData = reports.map((r) => ({
    name: `${r.year}-${String(r.month).padStart(2, "0")}`,
    Income: parseFloat(r.total_income),
    Expenses: parseFloat(r.total_expenses),
  }));

  const totalSpend = categories.reduce((sum, c) => sum + parseFloat(c.total || 0), 0);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div
      className="min-h-screen p-5 lg:p-7 overflow-x-hidden w-full"
      style={{
        background: "linear-gradient(180deg, #FAF6F1 0%, #F3EFE9 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        ${FONT_IMPORT}
        .lm-heading { font-family: 'Space Grotesk', sans-serif; }
        .lm-mono { font-family: 'IBM Plex Mono', monospace; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(17,17,17,0.15); border-radius: 10px; }
      `}</style>

      {/* ── TOP BAR ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between mb-7 gap-4"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: INK }}
            >
              <Sparkles size={13} color={ACCENT} strokeWidth={2.4} />
            </span>
            <p className="text-[13px] font-medium text-[#6B7280] tracking-tight">lostmoney<span style={{ color: ACCENT }}>.ai</span></p>
          </div>
          <h1 className="lm-heading text-[26px] leading-tight font-semibold text-[#111111] tracking-tight truncate">
            {greeting()}, {user?.username || "there"}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <motion.div
            animate={{
              boxShadow: searchFocused
                ? "0 0 0 3px rgba(255,122,0,0.14), 0 6px 20px rgba(255,122,0,0.10)"
                : "0 1px 2px rgba(17,17,17,0.04)",
              borderColor: searchFocused ? ACCENT : "rgba(17,17,17,0.08)",
              width: searchFocused ? 200 : 160,
            }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="hidden sm:flex items-center gap-2 bg-white border rounded-2xl px-3.5 py-2.5"
          >
            <Search size={14} className={searchFocused ? "text-[#FF7A00]" : "text-gray-400"} />
            <input
              placeholder="Search..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="bg-transparent text-sm text-[#111111] placeholder-gray-400 focus:outline-none w-full"
            />
          </motion.div>

          <button className="w-10 h-10 bg-white border border-black/[0.06] rounded-2xl flex items-center justify-center shadow-[0_1px_2px_rgba(17,17,17,0.04)] hover:border-[#FF7A00]/40 transition-colors relative flex-shrink-0">
            <Bell size={16} className="text-gray-500" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#FF7A00] rounded-full ring-2 ring-white" />
          </button>

          <ProfileDropdown user={user} navigate={navigate} logout={logout} />
        </div>
      </motion.div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        {loading
          ? Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)
          : cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, boxShadow: `0 20px 40px ${card.glow}`, transition: { duration: 0.2 } }}
              className="bg-white rounded-[26px] p-5 border border-black/[0.05] cursor-default"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: card.tint }}>
                  <card.icon size={18} style={{ color: card.iconColor }} strokeWidth={2} />
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>
              <p className="text-[#6B7280] text-xs font-medium mb-1.5">{card.label}</p>
              <p className="lm-mono text-[22px] font-medium text-[#111111] tracking-tight">
                {card.isCount
                  ? <AnimatedNumber value={card.value} />
                  : <AnimatedNumber value={card.value} prefix="₹" decimals={0} />
                }
              </p>
            </motion.div>
          ))}
      </div>

      {/* ── CHARTS ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-5">
        {/* Spending by Category */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ boxShadow: "0 20px 48px rgba(17,17,17,0.06)", transition: { duration: 0.2 } }}
          className="bg-white rounded-[28px] p-6 border border-black/[0.05]"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="lm-heading text-[15px] font-semibold text-[#111111]">Spending by category</h3>
              <p className="text-xs text-[#6B7280] mt-0.5">Breakdown of expenses</p>
            </div>
            <button className="w-8 h-8 rounded-xl bg-[#F7F3EE] flex items-center justify-center hover:bg-[#F0EAE2] transition-colors">
              <MoreHorizontal size={16} className="text-gray-400" />
            </button>
          </div>

          {categories.length > 0 ? (
            <div className="flex items-center gap-5">
              <div className="relative shrink-0" style={{ width: "45%" }}>
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie data={categories} cx="50%" cy="50%" innerRadius={50} outerRadius={74} dataKey="total" paddingAngle={3} stroke="none">
                      {categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={({ active, payload }) =>
                      active && payload?.length ? (
                        <div className="bg-[#111111] shadow-xl rounded-2xl px-3 py-2 text-xs">
                          <p className="font-semibold text-white">{payload[0].name}</p>
                          <p className="lm-mono" style={{ color: ACCENT }}>₹{parseFloat(payload[0].value).toLocaleString("en-IN")}</p>
                        </div>
                      ) : null
                    } />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-[9px] font-medium text-[#6B7280] uppercase tracking-wide">Total</p>
                  <p className="lm-mono text-[13px] font-medium text-[#111111]">₹{(totalSpend / 1000).toFixed(1)}k</p>
                </div>
              </div>
              <div className="flex-1 space-y-2.5 min-w-0">
                {categories.slice(0, 5).map((cat, i) => (
                  <div key={cat.category} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-[#6B7280] flex-1 truncate">{cat.display_name}</span>
                    <span className="lm-mono text-xs font-medium text-[#111111] shrink-0">
                      ₹{parseFloat(cat.total).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: "#FFEEDD" }}>
                <TrendingUp size={20} color={ACCENT} />
              </div>
              <p className="text-sm font-medium text-[#6B7280]">No data yet</p>
              <p className="text-xs text-gray-400 mt-1">Upload a statement to see insights</p>
            </div>
          )}
        </motion.div>

        {/* Income vs Expenses */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.36, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ boxShadow: "0 20px 48px rgba(17,17,17,0.06)", transition: { duration: 0.2 } }}
          className="bg-white rounded-[28px] p-6 border border-black/[0.05]"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="lm-heading text-[15px] font-semibold text-[#111111]">Income vs expenses</h3>
              <p className="text-xs text-[#6B7280] mt-0.5">Monthly comparison</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#6B7280]">
                <span className="w-2 h-2 rounded-full" style={{ background: "#1E9E5B" }} /> Income
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#6B7280]">
                <span className="w-2 h-2 rounded-full" style={{ background: "#E24C43" }} /> Expenses
              </span>
            </div>
          </div>

          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={barData} barGap={4} barCategoryGap="32%">
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: SLATE }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: SLATE }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(17,17,17,0.03)" }} />
                <Bar dataKey="Income" fill="#1E9E5B" radius={[6, 6, 0, 0]} maxBarSize={22} />
                <Bar dataKey="Expenses" fill="#E24C43" radius={[6, 6, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: "#FFEEDD" }}>
                <MoreHorizontal size={20} color={ACCENT} />
              </div>
              <p className="text-sm font-medium text-[#6B7280]">No reports yet</p>
              <p className="text-xs text-gray-400 mt-1">Generate monthly reports to see trends</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── RECENT TRANSACTIONS ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-[28px] p-6 border border-black/[0.05]"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="lm-heading text-[15px] font-semibold text-[#111111]">Recent transactions</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">{transactions.length} latest entries</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/app/transactions")}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#FF7A00] bg-[#FFEEDD] px-4 py-2 rounded-xl hover:bg-[#FFE1C2] transition-colors flex-shrink-0"
          >
            View all <ArrowUpRight size={13} />
          </motion.button>
        </div>

        {transactions.length > 0 ? (
          <div className="divide-y divide-black/[0.04]">
            {transactions.map((txn, i) => (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.44 + i * 0.04 }}
                whileHover={{
                  backgroundColor: "#FFF7F0",
                  transition: { duration: 0.15 }
                }}
                className="flex items-center px-3 py-3.5 rounded-2xl cursor-default -mx-3"
              >
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                  txn.transaction_type === "credit" ? "bg-[#E8F7EE]" : "bg-[#FDEBEA]"
                }`}>
                  {txn.transaction_type === "credit"
                    ? <ArrowUpRight size={15} color="#1E9E5B" strokeWidth={2.4} />
                    : <ArrowDownRight size={15} color="#E24C43" strokeWidth={2.4} />}
                </div>

                <div className="flex-1 min-w-0 mx-3">
                  <p className="text-sm font-medium text-[#111111] truncate">{txn.description}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{txn.date}</p>
                </div>

                {txn.category && (
                  <span className="hidden xl:block text-[11px] font-medium text-[#6B7280] bg-[#F7F3EE] px-3 py-1 rounded-lg shrink-0 mr-3">
                    {txn.category.display_name}
                  </span>
                )}

                <p className={`lm-mono text-sm font-medium shrink-0 whitespace-nowrap ${
                  txn.transaction_type === "credit" ? "text-[#1E9E5B]" : "text-[#E24C43]"
                }`}>
                  {txn.transaction_type === "credit" ? "+" : "-"}₹{parseFloat(txn.amount).toLocaleString("en-IN")}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="w-14 h-14 rounded-3xl flex items-center justify-center mx-auto mb-4" style={{ background: "#FFEEDD" }}>
              <Receipt size={22} color={ACCENT} />
            </div>
            <p className="text-sm font-medium text-[#6B7280]">No transactions yet</p>
            <p className="text-xs text-gray-400 mt-1">Upload a bank statement to get started</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}