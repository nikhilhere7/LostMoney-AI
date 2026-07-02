import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload as UploadIcon, CheckCircle, FileText,
  ChevronDown, X, Sparkles, Shield, Zap
} from "lucide-react";
import API from "../utils/api";

const BANKS = [
  { label: "SBI", value: "sbi" },
  { label: "HDFC Bank", value: "hdfc" },
  { label: "ICICI Bank", value: "icici" },
  { label: "Axis Bank", value: "axis" },
  { label: "Kotak Bank", value: "kotak" },
  { label: "PNB", value: "pnb" },
  { label: "Other", value: "other" },
];

const ACCOUNT_TYPES = [
  { label: "Savings", value: "savings" },
  { label: "Current", value: "current" },
  { label: "Salary", value: "salary" },
];

export default function Upload() {
  const [file, setFile] = useState(null);
  const [bank, setBank] = useState("hdfc");
  const [accountType, setAccountType] = useState("savings");
  const [last4, setLast4] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bank_name", bank);
      formData.append("account_type", accountType);
      formData.append("account_last4", last4);
      await API.post("/statements/upload/", formData);
      setSuccess(true);
      setFile(null);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6 overflow-x-hidden">

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-black text-[#111111] tracking-tight mb-0.5">Upload Statement</h1>
        <p className="text-[#6B7280] text-sm font-medium">Upload your bank statement to analyze your finances</p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">

          {/* ── SUCCESS STATE ── */}
          {success ? (
            <motion.div
              key="success"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 140 }}
              className="bg-white rounded-3xl shadow-md p-14 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 160 }}
                className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle size={40} className="text-green-500" />
              </motion.div>
              <h3 className="text-2xl font-black text-[#111111] mb-2">Upload Successful! 🎉</h3>
              <p className="text-[#6B7280] text-sm mb-8">
                Your statement is being processed in the background.<br />
                We'll analyze your spending and surface insights shortly.
              </p>
              <div className="flex items-center justify-center gap-6 mb-10">
                {[
                  { icon: Zap, label: "AI Processing", color: "text-[#FF7A00]", bg: "bg-orange-50" },
                  { icon: Shield, label: "Bank-grade Security", color: "text-blue-500", bg: "bg-blue-50" },
                  { icon: Sparkles, label: "Insights Ready Soon", color: "text-purple-500", bg: "bg-purple-50" },
                ].map(({ icon: Icon, label, color, bg }) => (
                  <div key={label} className="flex flex-col items-center gap-2">
                    <div className={`w-11 h-11 ${bg} rounded-2xl flex items-center justify-center`}>
                      <Icon size={20} className={color} />
                    </div>
                    <p className="text-xs font-semibold text-[#6B7280]">{label}</p>
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSuccess(false)}
                className="bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white px-10 py-3.5 rounded-2xl text-sm font-black shadow-[0_12px_32px_rgba(255,122,0,0.3)]"
              >
                Upload Another
              </motion.button>
            </motion.div>

          ) : (

            /* ── UPLOAD FORM ── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >

              {/* Drop Zone card */}
              <div className="bg-white rounded-3xl shadow-md p-6">
                <p className="text-xs font-black text-[#111111] uppercase tracking-widest mb-4">Statement File</p>

                <motion.div
                  onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={handleDrop}
                  animate={{
                    borderColor: drag ? "#FF7A00" : file ? "#22c55e" : "#E5E7EB",
                    backgroundColor: drag ? "#FFF7F0" : "#FAFAFA",
                  }}
                  transition={{ duration: 0.2 }}
                  className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all relative"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <input
                    id="fileInput"
                    type="file"
                    accept=".pdf,.csv,.xlsx"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                  />

                  <AnimatePresence mode="wait">
                    {file ? (
                      <motion.div
                        key="file"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center justify-center gap-4"
                      >
                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
                          <FileText size={22} className="text-[#FF7A00]" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-[#111111] text-sm">{file.name}</p>
                          <p className="text-xs text-[#6B7280] mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setFile(null); }}
                          className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors ml-2"
                        >
                          <X size={14} className="text-red-400" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <UploadIcon size={28} className="text-gray-400" />
                        </div>
                        <p className="font-black text-[#111111] mb-1">Drop your file here</p>
                        <p className="text-sm text-[#6B7280]">or <span className="text-[#FF7A00] font-bold">browse to upload</span></p>
                        <p className="text-xs text-gray-400 mt-2">PDF, CSV, or Excel · Max 10MB</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Bank details card */}
              <div className="bg-white rounded-3xl shadow-md p-6">
                <p className="text-xs font-black text-[#111111] uppercase tracking-widest mb-5">Bank Details</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Select Bank */}
                  <div>
                    <label className="text-xs font-bold text-[#6B7280] mb-2 block uppercase tracking-wider">Bank</label>
                    <div className="relative">
                      <select
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        className="w-full appearance-none px-4 py-3.5 bg-[#FAFAFA] border border-gray-200 rounded-2xl text-sm font-semibold text-[#111111] focus:outline-none focus:border-[#FF7A00] focus:ring-4 focus:ring-orange-100 transition-all pr-10 cursor-pointer"
                      >
                        {BANKS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                      </select>
                      <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Account Type */}
                  <div>
                    <label className="text-xs font-bold text-[#6B7280] mb-2 block uppercase tracking-wider">Account Type</label>
                    <div className="relative">
                      <select
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        className="w-full appearance-none px-4 py-3.5 bg-[#FAFAFA] border border-gray-200 rounded-2xl text-sm font-semibold text-[#111111] focus:outline-none focus:border-[#FF7A00] focus:ring-4 focus:ring-orange-100 transition-all pr-10 cursor-pointer"
                      >
                        {ACCOUNT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                      <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Last 4 digits */}
                <div>
                  <label className="text-xs font-bold text-[#6B7280] mb-2 block uppercase tracking-wider">
                    Last 4 Digits <span className="normal-case text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    value={last4}
                    onChange={(e) => setLast4(e.target.value.replace(/\D/, ""))}
                    maxLength={4}
                    placeholder="e.g. 1234"
                    className="w-full px-4 py-3.5 bg-[#FAFAFA] border border-gray-200 rounded-2xl text-sm font-semibold text-[#111111] placeholder-gray-300 focus:outline-none focus:border-[#FF7A00] focus:ring-4 focus:ring-orange-100 transition-all"
                  />
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-red-50 border border-red-200 text-red-600 px-5 py-3.5 rounded-2xl text-sm font-semibold"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: file ? 1.01 : 1 }}
                whileTap={{ scale: file ? 0.98 : 1 }}
                onClick={handleUpload}
                disabled={!file || loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF7A00] via-[#FF6A00] to-[#FF4500] text-white text-base font-black shadow-[0_16px_40px_rgba(255,122,0,0.30)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Uploading & Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />
                    Upload & Analyze
                  </>
                )}
              </motion.button>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-6 pt-1 pb-2">
                {[
                  { icon: Shield, label: "Bank-grade encryption" },
                  { icon: Zap, label: "AI-powered analysis" },
                  { icon: FileText, label: "PDF, CSV, Excel" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-xs text-[#6B7280] font-medium">
                    <Icon size={13} className="text-[#FF7A00]" />
                    {label}
                  </div>
                ))}
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}