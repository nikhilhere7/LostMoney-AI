import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, Calendar, Shield,
  Edit3, Check, X, Camera, TrendingUp,
  Receipt, FileText, Award
} from "lucide-react";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, login, token } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ transactions: 0, statements: 0, income: 0, expenses: 0 });
  const [form, setForm] = useState({
    username: user?.username || "",
    phone: user?.phone || "",
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [summary, statements] = await Promise.all([
          API.get("/transactions/summary/"),
          API.get("/statements/"),
        ]);
        setStats({
          transactions: summary.data.total_transactions || 0,
          statements: Array.isArray(statements.data) ? statements.data.length : 0,
          income: parseFloat(summary.data.total_income) || 0,
          expenses: parseFloat(summary.data.total_expenses) || 0,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await API.patch("/users/profile/", form);
      login(res.data, token);
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Transactions", value: stats.transactions, icon: Receipt, color: "bg-purple-50 text-purple-500" },
    { label: "Statements Uploaded", value: stats.statements, icon: FileText, color: "bg-blue-50 text-blue-500" },
    { label: "Total Income", value: `₹${stats.income.toLocaleString("en-IN")}`, icon: TrendingUp, color: "bg-green-50 text-green-500" },
    { label: "Total Expenses", value: `₹${stats.expenses.toLocaleString("en-IN")}`, icon: Award, color: "bg-orange-50 text-[#FF7A00]" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-black text-[#111111] tracking-tight mb-1">Profile</h1>
        <p className="text-[#6B7280] text-sm font-medium">Manage your personal information</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-6">

        {/* Left — User Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1"
        >
          {/* Avatar Card */}
          <div className="bg-white rounded-[28px] p-8 shadow-sm text-center mb-5">
            <div className="relative inline-block mb-5">
              <div className="w-24 h-24 bg-gradient-to-br from-[#FF7A00] to-orange-400 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-200 mx-auto">
                <span className="text-white text-4xl font-black">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#FF7A00] rounded-xl flex items-center justify-center shadow-md">
                <Camera size={14} className="text-white" />
              </button>
            </div>

            <h2 className="text-xl font-black text-[#111111] mb-1">{user?.username}</h2>
            <p className="text-sm text-[#6B7280] mb-4">{user?.email}</p>

            <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs font-bold text-green-600">Active Account</span>
            </div>
          </div>

          {/* Member Since */}
          <div className="bg-white rounded-[28px] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center">
                <Shield size={18} className="text-[#FF7A00]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#111111]">Account Security</p>
                <p className="text-xs text-[#6B7280]">Your account is protected</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Email Verified", status: true },
                { label: "2FA Enabled", status: false },
                { label: "Strong Password", status: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-[#6B7280]">{item.label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    item.status ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                  }`}>
                    {item.status ? "✓ Yes" : "✗ No"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right — Details */}
        <div className="col-span-2 space-y-5">

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {statCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-[20px] p-5 shadow-sm flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.color}`}>
                  <card.icon size={20} />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] mb-0.5">{card.label}</p>
                  <p className="text-xl font-black text-[#111111]">{card.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Edit Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[28px] p-7 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-[#111111] text-base">Personal Information</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">Update your personal details</p>
              </div>
              {!editing ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 bg-orange-50 text-[#FF7A00] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-100 transition-colors"
                >
                  <Edit3 size={14} />
                  Edit Profile
                </motion.button>
              ) : (
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-2 bg-gray-100 text-gray-500 px-4 py-2 rounded-xl text-sm font-semibold"
                  >
                    <X size={14} />
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#FF7A00] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-orange-200 disabled:opacity-60"
                  >
                    <Check size={14} />
                    {loading ? "Saving..." : "Save Changes"}
                  </motion.button>
                </div>
              )}
            </div>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-5 text-sm font-semibold flex items-center gap-2"
              >
                <Check size={16} />
                Profile updated successfully!
              </motion.div>
            )}

            <div className="space-y-5">
              {/* Username */}
              <div>
                <label className="text-sm font-semibold text-[#111111] mb-2 block flex items-center gap-2">
                  <User size={14} className="text-[#6B7280]" />
                  Username
                </label>
                <input
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  disabled={!editing}
                  className={`w-full h-12 rounded-2xl border px-5 text-sm font-medium transition-all ${
                    editing
                      ? "border-[#FF7A00] bg-white focus:ring-4 focus:ring-orange-100 focus:outline-none"
                      : "border-gray-100 bg-gray-50 text-[#6B7280] cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Email (read only) */}
              <div>
                <label className="text-sm font-semibold text-[#111111] mb-2 block flex items-center gap-2">
                  <Mail size={14} className="text-[#6B7280]" />
                  Email Address
                </label>
                <input
                  value={user?.email || ""}
                  disabled
                  className="w-full h-12 rounded-2xl border border-gray-100 bg-gray-50 px-5 text-sm font-medium text-[#6B7280] cursor-not-allowed"
                />
                <p className="text-xs text-[#6B7280] mt-1.5">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-semibold text-[#111111] mb-2 block flex items-center gap-2">
                  <Phone size={14} className="text-[#6B7280]" />
                  Phone Number
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  disabled={!editing}
                  placeholder="Add phone number"
                  className={`w-full h-12 rounded-2xl border px-5 text-sm font-medium transition-all ${
                    editing
                      ? "border-[#FF7A00] bg-white focus:ring-4 focus:ring-orange-100 focus:outline-none"
                      : "border-gray-100 bg-gray-50 text-[#6B7280] cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Member Since */}
              <div>
                <label className="text-sm font-semibold text-[#111111] mb-2 block flex items-center gap-2">
                  <Calendar size={14} className="text-[#6B7280]" />
                  Member Since
                </label>
                <input
                  value={user?.created_at ? new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                  disabled
                  className="w-full h-12 rounded-2xl border border-gray-100 bg-gray-50 px-5 text-sm font-medium text-[#6B7280] cursor-not-allowed"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}