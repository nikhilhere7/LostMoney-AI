import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, Building2, ShieldCheck, IndianRupee, ArrowUpRight } from "lucide-react";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
  setLoading(true);
  setError("");

  try {
    const res = await API.post("/users/login/", data);

    console.log("LOGIN RESPONSE:", res.data);

    login(res.data.user, res.data.tokens.access);

    console.log("TOKEN:", res.data.tokens.access);

    navigate("/app");

  } catch (err) {
    console.log(err.response);
    setError(err.response?.data?.error || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#FFF4EC] relative overflow-hidden flex flex-col">

      {/* Blobs */}
      <motion.div animate={{ x: [0,120,-80,60,0], y: [0,-80,120,-40,0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", repeatType: "mirror" }} className="absolute rounded-full blur-3xl" style={{ background: "#FFAA60", opacity: 0.55, width: 500, height: 500, top: "-10%", left: "-10%" }} />
      <motion.div animate={{ x: [0,-100,80,-60,0], y: [0,100,-80,60,0] }} transition={{ repeat: Infinity, duration: 9, ease: "easeInOut", repeatType: "mirror" }} className="absolute rounded-full blur-3xl" style={{ background: "#FF7A00", opacity: 0.4, width: 450, height: 450, bottom: "-10%", right: "-10%" }} />
      <motion.div animate={{ x: [0,80,-60,40,0], y: [0,-60,80,-30,0] }} transition={{ repeat: Infinity, duration: 11, ease: "easeInOut", repeatType: "mirror" }} className="absolute rounded-full blur-3xl" style={{ background: "#FFD080", opacity: 0.45, width: 350, height: 350, top: "40%", left: "35%" }} />
      <motion.div animate={{ x: [0,-70,50,0], y: [0,70,-50,0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", repeatType: "mirror" }} className="absolute rounded-full blur-3xl" style={{ background: "#FF5500", opacity: 0.3, width: 300, height: 300, top: "10%", right: "20%" }} />

      {/* Wave lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.15 }} xmlns="http://www.w3.org/2000/svg">
        <motion.path stroke="#FF7A00" strokeWidth="2" fill="none" animate={{ d: ["M0,150 Q400,50 800,150 T1600,150","M0,180 Q400,280 800,130 T1600,180","M0,150 Q400,50 800,150 T1600,150"] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} />
        <motion.path stroke="#FF7A00" strokeWidth="1.5" fill="none" animate={{ d: ["M0,350 Q350,250 700,350 T1400,350","M0,370 Q350,470 700,320 T1400,370","M0,350 Q350,250 700,350 T1400,350"] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }} />
        <motion.path stroke="#FF7A00" strokeWidth="1" fill="none" animate={{ d: ["M0,550 Q450,450 900,550 T1800,550","M0,580 Q450,680 900,520 T1800,580","M0,550 Q450,450 900,550 T1800,550"] }} transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }} />
      </svg>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-8 left-10 z-20 flex items-center gap-3"
      >
        <div className="w-12 h-12 rounded-2xl bg-[#FF7A00] flex items-center justify-center shadow-lg">
          <Zap size={24} className="text-white" />
        </div>
        <span className="text-2xl font-black tracking-tight text-[#111111]">
          LostMoney.AI
        </span>
      </motion.div>

      {/* Main layout */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-6 gap-10">

        {/* Left branding */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden lg:flex flex-col max-w-lg"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
          <h1 className="text-6xl font-black text-[#111111] leading-tight mb-6 tracking-tight">
            YOUR FINANCES,{" "}
            <span className="text-[#FF7A00]">INTELLIGENTLY<br />MANAGED</span>
          </h1>
          <p className="text-gray-500 text-lg font-semibold mb-10 leading-relaxed">
            Upload your bank statements and get instant AI-powered insights, spending analysis, and savings suggestions.
          </p>
          <div className="flex gap-4">
            {[
              { label: "Banks Supported", value: "40+", icon: Building2 },
              { label: "Accuracy", value: "98%", icon: ShieldCheck },
              { label: "Avg Savings", value: "₹4,200", icon: IndianRupee },
            ].map(({ label, value, icon: Icon }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} whileHover={{ scale: 1.06 }} className="bg-white bg-opacity-80 backdrop-blur rounded-2xl px-5 py-5 shadow-lg flex-1 text-center">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Icon size={18} className="text-[#FF7A00]" />
                </div>
                <p className="text-2xl font-black text-[#FF7A00]">{value}</p>
                <p className="text-xs font-bold text-gray-500 mt-0.5">{label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Arrow */}
        <div className="hidden lg:flex items-center">
          <motion.div animate={{ x: [0, 14, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
            <ArrowRight size={28} className="text-[#FF7A00]" />
          </motion.div>
        </div>

        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white/95 backdrop-blur-xl rounded-[40px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] w-full max-w-[620px] px-16 py-16 flex flex-col"
        >

          {/* Heading */}
          <p className="text-xl text-black-600 mb-12 text-center">
          Sign in to your account to continue
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-semibold"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-xl font-semibold text-[#111111] mb-3 block">Email</label>
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                placeholder="you@example.com"
                className="w-full h-16 rounded-2xl border border-gray-200 bg-white px-6 shadow-sm text-lg text-[#111111] placeholder-gray-300 focus:outline-none focus:border-[#FF7A00] focus:ring-4 focus:ring-orange-100 transition-all"
              />
              {errors.email && <p className="text-red-500 text-xs font-semibold mt-2">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-xl font-semibold text-[#111111] mb-3 block">Password</label>
              <div className="relative">
                <input
                  {...register("password", { required: "Password is required" })}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="w-full h-16 rounded-2xl border border-gray-200 bg-white px-6 pr-14 shadow-sm text-lg text-[#111111] placeholder-gray-300 focus:outline-none focus:border-[#FF7A00] focus:ring-4 focus:ring-orange-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF7A00] transition-colors"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs font-semibold mt-2">{errors.password.message}</p>}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <span className="text-sm font-bold text-[#FF7A00] cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#FF7A00] via-[#FF6A00] to-[#FF4500] text-white text-2xl font-bold shadow-[0_20px_40px_rgba(255,122,0,0.35)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>Sign In <ArrowRight size={20} /></>
              )}
            </motion.button>

            {/* Bottom text */}
            <p className="text-center text-lg text-gray-500 pt-2">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-black text-[#FF7A00] hover:text-[#FF5C00] transition-colors inline-flex items-center gap-1"
              >
                Create one <ArrowUpRight size={16} className="inline" />
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}