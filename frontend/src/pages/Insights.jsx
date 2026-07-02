import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb, RefreshCw, TrendingDown, AlertCircle,
  CreditCard, Sparkles, Zap, Target, ArrowRight, Info
} from "lucide-react";
import API from "../utils/api";

const ACCENT = "#FF7A00";

const icons = {
  subscription: CreditCard,
  overspending: TrendingDown,
  recurring: AlertCircle,
  savings_goal: Lightbulb,
};

const suggestionStyles = {
  subscription: { border: "border-gray-200 hover:border-[#FF7A00]/40", icon: "bg-orange-50 text-[#FF7A00]", badge: "bg-orange-50 text-[#FF7A00] border border-orange-100", accent: "#FF7A00" },
  overspending: { border: "border-gray-200 hover:border-red-400/40", icon: "bg-red-50 text-red-600", badge: "bg-red-50 text-red-600 border border-red-100", accent: "#EF4444" },
  recurring: { border: "border-gray-200 hover:border-amber-400/40", icon: "bg-amber-50 text-amber-600", badge: "bg-amber-50 text-amber-600 border border-amber-100", accent: "#D97706" },
  savings_goal: { border: "border-gray-200 hover:border-green-400/40", icon: "bg-green-50 text-green-600", badge: "bg-green-50 text-green-600 border border-green-100", accent: "#10B981" },
};

const frequencyConfig = {
  weekly: { color: "bg-red-50 text-red-600 border border-red-100", bar: "#EF4444" },
  monthly: { color: "bg-orange-50 text-[#FF7A00] border border-orange-100", bar: "#FF7A00" },
  quarterly: { color: "bg-blue-50 text-blue-600 border border-blue-100", bar: "#3B82F6" },
  yearly: { color: "bg-green-50 text-green-600 border border-green-100", bar: "#10B981" },
  irregular: { color: "bg-gray-100 text-gray-600 border border-gray-200", bar: "#6B7280" },
};

function SkeletonCard({ tall }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-5 animate-pulse ${tall ? "h-36" : "h-24"}`}>
      <div className="h-2.5 bg-gray-100 rounded-full w-1/3 mb-4" />
      <div className="h-2 bg-gray-100 rounded-full w-full mb-2" />
      <div className="h-2 bg-gray-100 rounded-full w-1/2" />
    </div>
  );
}

/* Ring-icon used on summary cards, echoing the circular progress motif */
function RingIcon({ color, Icon, pct = 70 }) {
  const r = 19, c = 2 * Math.PI * r;
  return (
    <div className="relative w-11 h-11 shrink-0">
      <svg viewBox="0 0 44 44" className="w-11 h-11 -rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke={color + "1A"} strokeWidth="3" />
        <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon size={16} style={{ color }} />
      </div>
    </div>
  );
}

/* Hover tooltip used on the first two metric cards */
function InfoTooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <Info size={13} className="text-gray-300 hover:text-[#FF7A00] transition-colors cursor-help" />
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.14 }}
            className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-[#111111] text-white text-[11px] leading-relaxed rounded-xl px-3 py-2.5 shadow-xl pointer-events-none"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111111] rotate-45 -mt-1" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Insights() {
  const [suggestions, setSuggestions] = useState([]);
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, r] = await Promise.all([
          API.get("/analytics/suggestions/"),
          API.get("/transactions/recurring/"),
        ]);
        setSuggestions(Array.isArray(s.data) ? s.data : []);
        setRecurring(Array.isArray(r.data) ? r.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const detectRecurring = async () => {
    setDetecting(true);
    try {
      await API.post("/transactions/detect-recurring/");
      setTimeout(async () => {
        const r = await API.get("/transactions/recurring/");
        setRecurring(Array.isArray(r.data) ? r.data : []);
        setDetecting(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setDetecting(false);
    }
  };

  const generateSuggestions = async () => {
    setGeneratingSuggestions(true);
    try {
      await API.post("/analytics/generate-report/", { year: 2026, month: 5 });
      const s = await API.get("/analytics/suggestions/");
      setSuggestions(Array.isArray(s.data) ? s.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingSuggestions(false);
    }
  };

  const totalPotentialSavings = suggestions.reduce((acc, s) => acc + (parseFloat(s.potential_savings) || 0), 0);
  const totalRecurring = recurring.reduce((acc, r) => acc + (parseFloat(r.average_amount) || 0), 0);

  const summaryCards = [
    {
      label: "Potential Savings", value: `₹${totalPotentialSavings.toLocaleString("en-IN")}`, sub: "projected per annum",
      icon: Target, color: ACCENT, pct: 72,
      badge: `${suggestions.length} insights`, badgeColor: "text-[#FF7A00] bg-orange-50 border border-orange-100",
      tip: "Estimated yearly amount you could save if you act on every AI suggestion below.",
    },
    {
      label: "Recurring Accumulation", value: `₹${totalRecurring.toLocaleString("en-IN")}`, sub: "avg expected monthly cycle",
      icon: RefreshCw, color: "#EF4444", pct: 55,
      badge: `${recurring.length} channels`, badgeColor: "text-red-600 bg-red-50 border border-red-100",
      tip: "Total average monthly cost across all subscriptions and recurring charges detected on your account.",
    },
    {
      label: "Active Subscriptions", value: suggestions.filter(s => s.suggestion_type === "subscription").length, sub: "distinct triggers detected",
      icon: CreditCard, color: ACCENT, pct: 40,
      badge: "requires review", badgeColor: "text-[#FF7A00] bg-orange-50 border border-orange-100",
    },
    {
      label: "Overspending Runaway", value: suggestions.filter(s => s.suggestion_type === "overspending").length, sub: "critical target categories",
      icon: TrendingDown, color: "#EF4444", pct: 30,
      badge: "attention priority", badgeColor: "text-red-600 bg-red-50 border border-red-100",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6 lg:p-10 overflow-x-hidden w-full text-[#111827] font-sans antialiased relative">

      {/* ── AMBIENT YELLOW/ORANGE GLOW ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        <motion.div animate={{ x: [0, 60, -30, 0], y: [0, -40, 30, 0] }} transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
          className="absolute rounded-full blur-3xl" style={{ background: "#FFD24D", opacity: 0.28, width: 480, height: 480, top: "-12%", left: "-8%" }} />
        <motion.div animate={{ x: [0, -50, 40, 0], y: [0, 40, -30, 0] }} transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
          className="absolute rounded-full blur-3xl" style={{ background: "#FF7A00", opacity: 0.16, width: 420, height: 420, top: "10%", right: "-6%" }} />
        <motion.div animate={{ x: [0, 30, -30, 0], y: [0, -20, 20, 0] }} transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
          className="absolute rounded-full blur-3xl" style={{ background: "#FFE08A", opacity: 0.3, width: 380, height: 380, bottom: "0%", left: "30%" }} />
      </div>

      <div className="relative z-10">
        {/* ── HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-[#111827] tracking-tight mb-1 flex items-center gap-2">
              AI Insights <Sparkles size={22} className="text-[#FF7A00]" />
            </h1>
            <p className="text-gray-500 text-sm font-medium">Smart financial forecasts and pattern scanning layers.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={generateSuggestions} disabled={generatingSuggestions}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:border-[#FF7A00]/40 transition-all disabled:opacity-50 cursor-pointer shadow-sm">
              <Sparkles size={13} className="text-[#FF7A00]" />
              {generatingSuggestions ? "Compiling..." : "Generate Insights"}
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={detectRecurring} disabled={detecting}
              className="flex items-center gap-2 bg-[#FF7A00] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#E06B00] transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-orange-500/20">
              <RefreshCw size={13} className={detecting ? "animate-spin" : ""} />
              {detecting ? "Scanning Pattern..." : "Re-detect Stream"}
            </motion.button>
          </div>
        </motion.div>

        {/* ── SUMMARY GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}
              whileHover={{ y: -3, boxShadow: `0 12px 30px ${card.color}22` }}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm cursor-default">
              <div className="flex items-center justify-between mb-4">
                <RingIcon color={card.color} Icon={card.icon} pct={card.pct} />
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${card.badgeColor}`}>{card.badge}</span>
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{card.label}</p>
                {card.tip && <InfoTooltip text={card.tip} />}
              </div>
              <p className="text-2xl font-black text-[#111827] tracking-tight">{card.value}</p>
              <p className="text-[11px] text-gray-400 mt-1 font-medium">{card.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* ── HERO BANNER ── */}
        <AnimatePresence>
          {totalPotentialSavings > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.99 }}
              className="bg-gradient-to-r from-[#FFB236] to-[#FF7A00] rounded-2xl p-6 mb-8 text-white relative overflow-hidden shadow-lg shadow-orange-500/20">
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
                    <Zap size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-orange-50 text-[10px] font-bold uppercase tracking-widest mb-0.5">Optimized Potential Run-Rate</p>
                    <h2 className="text-3xl font-black tracking-tight">
                      ₹{totalPotentialSavings.toLocaleString("en-IN")}
                      <span className="text-xs font-bold uppercase text-orange-50/90 ml-2 tracking-wider">reclaimable / year</span>
                    </h2>
                  </div>
                </div>
                <p className="text-xs text-orange-50/95 font-medium max-w-sm md:text-right leading-relaxed">
                  AI scanned your accounts and surfaced savings hiding in subscriptions and recurring charges.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── DUAL TRACK GRID ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center"><Lightbulb size={16} className="text-[#FF7A00]" /></div>
                <div>
                  <h2 className="font-bold text-[#111827] text-sm uppercase tracking-wider">Strategic Savings Feed</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{suggestions.length} runtime suggestions streaming</p>
                </div>
              </div>
              <button onClick={generateSuggestions} disabled={generatingSuggestions}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FF7A00] bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-all disabled:opacity-40 cursor-pointer self-start sm:self-center">
                <Sparkles size={11} />{generatingSuggestions ? "Syncing..." : "Refresh Stream"}
              </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {loading ? Array(3).fill(0).map((_, i) => <SkeletonCard key={i} tall />)
                : suggestions.length > 0 ? suggestions.map((s, i) => {
                  const Icon = icons[s.suggestion_type] || Lightbulb;
                  const style = suggestionStyles[s.suggestion_type] || suggestionStyles.savings_goal;
                  return (
                    <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className={`bg-white border ${style.border} rounded-xl p-4 transition-all`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${style.icon}`}><Icon size={16} /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <p className="font-bold text-sm text-[#111827] leading-snug tracking-tight">{s.title}</p>
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded shrink-0 uppercase tracking-wider ${style.badge}`}>{s.suggestion_type.replace("_", " ")}</span>
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed mb-4 font-medium">{s.description}</p>
                          {s.potential_savings && (
                            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                              <p className="text-xs font-bold text-[#111827] tracking-tight uppercase">
                                ₹{parseFloat(s.potential_savings).toLocaleString("en-IN")}
                                <span className="text-gray-400 font-medium tracking-normal normal-case ml-1">saved/yr</span>
                              </p>
                              <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider hover:opacity-80 cursor-pointer" style={{ color: style.accent }}>
                                Resolve <ArrowRight size={11} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                }) : (
                  <div className="py-16 text-center border border-dashed border-gray-200 rounded-xl bg-orange-50/20">
                    <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3"><Lightbulb size={16} className="text-gray-400" /></div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#111827] mb-0.5">Operational targets clear</p>
                    <p className="text-xs text-gray-400 mb-4">No recommendations yet. Run a scan to generate some.</p>
                    <button onClick={generateSuggestions} className="text-[10px] font-bold uppercase tracking-wider bg-[#FF7A00] text-white px-4 py-2 rounded-md shadow-sm cursor-pointer hover:bg-[#E06B00]">Generate Map</button>
                  </div>
                )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center"><RefreshCw size={15} className="text-[#FF7A00]" /></div>
                <div>
                  <h2 className="font-bold text-[#111827] text-sm uppercase tracking-wider">Recurring Stream Map</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{recurring.length} automated loops isolated</p>
                </div>
              </div>
              <button onClick={detectRecurring} disabled={detecting}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FF7A00] bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-all disabled:opacity-40 cursor-pointer self-start sm:self-center">
                <RefreshCw size={11} className={detecting ? "animate-spin" : ""} />{detecting ? "Analyzing..." : "Re-detect Vectors"}
              </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {loading ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
                : recurring.length > 0 ? recurring.map((r, i) => {
                  const freq = frequencyConfig[r.frequency] || frequencyConfig.irregular;
                  return (
                    <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className="bg-white border border-gray-200 rounded-xl p-4 transition-all hover:border-gray-300">
                      <div className="flex items-center justify-between mb-3.5">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: freq.bar + "12" }}><RefreshCw size={12} style={{ color: freq.bar }} /></div>
                          <p className="font-bold text-sm text-[#111827] capitalize truncate tracking-tight">{r.merchant_pattern}</p>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold tracking-wider shrink-0 ml-2 uppercase ${freq.color}`}>{r.frequency}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-2 text-center">
                          <p className="text-[9px] text-gray-400 mb-0.5 font-bold uppercase tracking-wider">Avg Cycle</p>
                          <p className="text-sm font-black text-[#111827]">₹{parseFloat(r.average_amount).toLocaleString("en-IN")}</p>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-2 text-center">
                          <p className="text-[9px] text-gray-400 mb-0.5 font-bold uppercase tracking-wider">Count</p>
                          <p className="text-sm font-black text-[#111827]">{r.transaction_count}×</p>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-2 text-center min-w-0">
                          <p className="text-[9px] text-gray-400 mb-0.5 font-bold uppercase tracking-wider">Category</p>
                          <p className="text-xs font-bold text-gray-600 truncate mt-0.5">{r.category?.display_name || "Uncategorized"}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                }) : (
                  <div className="py-16 text-center border border-dashed border-gray-200 rounded-xl bg-orange-50/20">
                    <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3"><RefreshCw size={16} className="text-gray-400" /></div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#111827] mb-0.5">No continuous loops</p>
                    <p className="text-xs text-gray-400 mb-4">Pattern recognizer has not crawled standard parameters yet.</p>
                    <button onClick={detectRecurring} className="text-[10px] font-bold uppercase tracking-wider bg-[#FF7A00] text-white px-4 py-2 rounded-md shadow-sm cursor-pointer hover:bg-[#E06B00]">Initialize Scan</button>
                  </div>
                )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}