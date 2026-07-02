import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import API from "../utils/api";

const COLORS = ["#FF7A00", "#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function Analytics() {
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [r, c] = await Promise.all([
          API.get("/analytics/monthly-reports/"),
          API.get("/transactions/by-category/"),
        ]);
        setReports(r.data);
        setCategories(c.data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const generateReports = async () => {
    setGenerating(true);
    for (const month of [3, 4, 5]) {
      await API.post("/analytics/generate-report/", { year: 2026, month });
    }
    const r = await API.get("/analytics/monthly-reports/");
    setReports(r.data);
    setGenerating(false);
  };

  const barData = reports.map((r) => ({
    name: `${r.year}-${String(r.month).padStart(2, "0")}`,
    Income: parseFloat(r.total_income),
    Expenses: parseFloat(r.total_expenses),
    Savings: parseFloat(r.net_savings),
  }));

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#111111]">Analytics</h1>
            <p className="text-gray-500 text-sm mt-1">Your financial trends and insights</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateReports}
            disabled={generating}
            className="bg-[#FF7A00] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-orange-200 disabled:opacity-60"
          >
            {generating ? "Generating..." : "Generate Reports"}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income vs Expenses */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-[#111111] mb-4">Income vs Expenses</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `₹${parseFloat(v).toLocaleString("en-IN")}`} />
                <Bar dataKey="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Savings Trend */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-[#111111] mb-4">Savings Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={barData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `₹${parseFloat(v).toLocaleString("en-IN")}`} />
                <Line type="monotone" dataKey="Savings" stroke="#FF7A00" strokeWidth={2} dot={{ fill: "#FF7A00" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Pie */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-[#111111] mb-4">Expense Categories</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={categories} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="total">
                    {categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `₹${parseFloat(v).toLocaleString("en-IN")}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {categories.map((cat, i) => (
                  <div key={cat.category} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-gray-600 flex-1 truncate">{cat.display_name}</span>
                    <span className="text-xs font-semibold">₹{parseFloat(cat.total).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Summary Table */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-[#111111] mb-4">Monthly Summary</h3>
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={`${r.year}-${r.month}`} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm font-medium text-[#111111]">{r.year}-{String(r.month).padStart(2, "0")}</span>
                  <div className="flex gap-4 text-xs">
                    <span className="text-green-500 font-semibold">+₹{parseFloat(r.total_income).toLocaleString("en-IN")}</span>
                    <span className="text-red-500 font-semibold">-₹{parseFloat(r.total_expenses).toLocaleString("en-IN")}</span>
                    <span className="text-[#FF7A00] font-semibold">₹{parseFloat(r.net_savings).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ))}
              {reports.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">Generate reports to see summary</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}