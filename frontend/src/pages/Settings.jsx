import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Shield, Trash2, Building2, ChevronRight,
  Globe, Moon, Download, AlertTriangle, Check,
  CreditCard, ToggleLeft, ToggleRight
} from "lucide-react";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Toggle({ enabled, onChange }) {
  return (
    <motion.button
      onClick={() => onChange(!enabled)}
      className={`w-12 h-6 rounded-full relative transition-colors ${
        enabled ? "bg-[#FF7A00]" : "bg-gray-200"
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 24 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
      />
    </motion.button>
  );
}

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [bankAccounts, setBankAccounts] = useState([]);
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingStatement, setDeletingStatement] = useState(null);
  const [notifications, setNotifications] = useState({
    email: true,
    spending: true,
    recurring: false,
    monthly: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accounts, stmts] = await Promise.all([
          API.get("/statements/accounts/"),
          API.get("/statements/"),
        ]);
        setBankAccounts(Array.isArray(accounts.data) ? accounts.data : []);
        setStatements(Array.isArray(stmts.data) ? stmts.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteStatement = async (id) => {
    setDeletingStatement(id);
    try {
      await API.delete(`/statements/${id}/`);
      setStatements((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingStatement(null);
    }
  };

  const bankColors = {
    sbi: "bg-blue-600",
    hdfc: "bg-red-600",
    icici: "bg-orange-500",
    axis: "bg-purple-600",
    kotak: "bg-red-700",
    pnb: "bg-indigo-600",
    other: "bg-gray-500",
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-black text-[#111111] tracking-tight mb-1">Settings</h1>
        <p className="text-[#6B7280] text-sm font-medium">Manage your preferences and data</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-6">

        {/* Left Column */}
        <div className="col-span-2 space-y-5">

          {/* Bank Accounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[28px] p-7 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <Building2 size={18} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-[#111111] text-base">Connected Banks</h3>
                  <p className="text-xs text-[#6B7280]">{bankAccounts.length} account{bankAccounts.length !== 1 ? "s" : ""} connected</p>
                </div>
              </div>
            </div>

            {loading ? (
              Array(2).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl animate-pulse mb-2">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-100 rounded-full w-32 mb-2" />
                    <div className="h-3 bg-gray-100 rounded-full w-20" />
                  </div>
                </div>
              ))
            ) : bankAccounts.length > 0 ? (
              <div className="space-y-2">
                {bankAccounts.map((account, i) => (
                  <motion.div
                    key={account.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-10 h-10 ${bankColors[account.bank_name] || "bg-gray-500"} rounded-xl flex items-center justify-center`}>
                      <span className="text-white text-xs font-black">
                        {account.bank_name?.toUpperCase().slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#111111]">
                        {account.bank_name?.toUpperCase()} Bank
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        {account.account_type} {account.account_last4 ? `•••• ${account.account_last4}` : ""}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      Connected
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-[#6B7280] text-sm">
                No bank accounts connected yet
              </div>
            )}
          </motion.div>

          {/* Statements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[28px] p-7 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center">
                <CreditCard size={18} className="text-[#FF7A00]" />
              </div>
              <div>
                <h3 className="font-bold text-[#111111] text-base">Uploaded Statements</h3>
                <p className="text-xs text-[#6B7280]">{statements.length} statement{statements.length !== 1 ? "s" : ""} uploaded</p>
              </div>
            </div>

            {statements.length > 0 ? (
              <div className="space-y-2">
                {statements.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl group hover:bg-red-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                      <span className="text-red-500 text-xs font-black">PDF</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#111111] truncate">{s.file_name}</p>
                      <p className="text-xs text-[#6B7280]">
                        {s.transaction_count} transactions • {s.status}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteStatement(s.id)}
                      disabled={deletingStatement === s.id}
                      className="w-8 h-8 bg-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-red-100"
                    >
                      {deletingStatement === s.id ? (
                        <svg className="animate-spin h-3 w-3 text-red-400" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                      ) : (
                        <Trash2 size={14} className="text-red-400" />
                      )}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-[#6B7280] text-sm">
                No statements uploaded yet
              </div>
            )}
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[28px] p-7 shadow-sm border border-red-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center">
                <AlertTriangle size={18} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-[#111111] text-base">Danger Zone</h3>
                <p className="text-xs text-[#6B7280]">Irreversible actions</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
              <div>
                <p className="text-sm font-bold text-red-600">Delete Account</p>
                <p className="text-xs text-red-400 mt-0.5">Permanently delete your account and all data</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Delete Account
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-[28px] p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center">
                <Bell size={18} className="text-purple-500" />
              </div>
              <div>
                <h3 className="font-bold text-[#111111] text-sm">Notifications</h3>
                <p className="text-xs text-[#6B7280]">Manage alerts</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: "email", label: "Email Alerts", desc: "Get notified via email" },
                { key: "spending", label: "Spending Alerts", desc: "When spending spikes" },
                { key: "recurring", label: "Recurring Detection", desc: "New recurring found" },
                { key: "monthly", label: "Monthly Reports", desc: "Monthly summaries" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">{item.label}</p>
                    <p className="text-xs text-[#6B7280]">{item.desc}</p>
                  </div>
                  <Toggle
                    enabled={notifications[item.key]}
                    onChange={(val) => setNotifications({ ...notifications, [item.key]: val })}
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[28px] p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center">
                <Globe size={18} className="text-gray-500" />
              </div>
              <div>
                <h3 className="font-bold text-[#111111] text-sm">Preferences</h3>
                <p className="text-xs text-[#6B7280]">App settings</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: "Currency", value: "INR (₹)" },
                { label: "Language", value: "English" },
                { label: "Date Format", value: "DD/MM/YYYY" },
                { label: "Theme", value: "Light" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-[#6B7280]">{item.label}</span>
                  <span className="text-xs font-bold text-[#111111]">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* App Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-gradient-to-br from-[#FF7A00] to-orange-500 rounded-[28px] p-6 text-white"
          >
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-4">
              <Shield size={18} className="text-white" />
            </div>
            <h3 className="font-bold text-base mb-1">LostMoney.AI</h3>
            <p className="text-orange-100 text-xs mb-4">Version 1.0.0 • Built by Nikhil</p>
            <div className="space-y-2 text-xs text-orange-100">
              <p>✓ Bank-grade security</p>
              <p>✓ Data encrypted at rest</p>
              <p>✓ No data sold to third parties</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[28px] p-8 max-w-sm w-full shadow-2xl"
            >
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
              <h3 className="text-xl font-black text-[#111111] text-center mb-2">Delete Account?</h3>
              <p className="text-sm text-[#6B7280] text-center mb-6">
                This will permanently delete your account, all statements, transactions and data. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 rounded-2xl bg-gray-100 text-[#111111] font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { logout(); navigate("/login"); }}
                  className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}