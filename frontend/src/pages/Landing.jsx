import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Upload,
  Sparkles,
  ShieldCheck,
  Repeat,
  PiggyBank,
  BarChart3,
  FileStack,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  Wallet,
  Menu,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */
const C = {
  cream: "#FFF4EC",
  creamDeep: "#FBEADD",
  ink: "#111111",
  slate: "#6B7280",
  line: "#E8DDD0",
  accent: "#FF7A00",
  accentDim: "#FFE3C7",
  white: "#FFFFFF",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
`;

/* ------------------------------------------------------------------ */
/*  Small utilities                                                    */
/* ------------------------------------------------------------------ */
function Reveal({ children, delay = 0, y = 18, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CountUp({ to, prefix = "", suffix = "", duration = 1.4 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = null;
    let raf;
    const step = (t) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */
function Nav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how" },
    { label: "FAQ", href: "#faq" },
  ];

  const scrollTo = (href) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        padding: scrolled ? "14px 20px" : "22px 20px",
        transition: "padding 0.35s ease",
      }}
    >
      <nav
        style={{
          width: "100%",
          maxWidth: 1160,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px 10px 18px",
          borderRadius: 20,
          background: scrolled ? "rgba(255,244,236,0.78)" : "rgba(255,244,236,0)",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
          border: scrolled ? `1px solid ${C.line}` : "1px solid transparent",
          boxShadow: scrolled ? "0 8px 30px rgba(17,17,17,0.06)" : "none",
          transition: "all 0.35s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: C.ink,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Wallet size={16} color={C.accent} strokeWidth={2.4} />
          </div>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "-0.02em",
              color: C.ink,
            }}
          >
            lostmoney<span style={{ color: C.accent }}>.ai</span>
          </span>
        </div>

        <div
          className="nav-links"
          style={{ display: "flex", alignItems: "center", gap: 32 }}
        >
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14.5,
                fontWeight: 500,
                color: C.ink,
                opacity: 0.75,
                padding: 4,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.75)}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="nav-cta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link
            to="/login"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontSize: 14.5,
              fontWeight: 600,
              color: C.ink,
              padding: "10px 16px",
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
          <Link
            to="/register"
            style={{
              background: C.ink,
              color: C.cream,
              border: "none",
              borderRadius: 12,
              padding: "10px 18px",
              fontFamily: "'Inter', sans-serif",
              fontSize: 14.5,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "background 0.2s ease",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.ink)}
          >
            Get started free
          </Link>
        </div>

        <button
          className="nav-burger"
          onClick={() => setOpen(!open)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
          }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: "absolute",
              top: 70,
              left: 20,
              right: 20,
              background: C.white,
              borderRadius: 18,
              border: `1px solid ${C.line}`,
              boxShadow: "0 12px 40px rgba(17,17,17,0.1)",
              padding: 18,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                style={{
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  padding: "10px 6px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  fontWeight: 500,
                  color: C.ink,
                }}
              >
                {l.label}
              </button>
            ))}
            <div style={{ height: 1, background: C.line, margin: "6px 0" }} />
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              style={{
                textAlign: "left",
                padding: "10px 6px",
                fontFamily: "'Inter', sans-serif",
                fontSize: 15,
                fontWeight: 500,
                color: C.ink,
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              style={{
                background: C.ink,
                color: C.cream,
                border: "none",
                borderRadius: 12,
                padding: "12px 16px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Get started free
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */
function Hero() {
  const path =
    "M0,120 C40,110 60,130 90,100 C120,70 150,95 180,80 C210,65 230,90 260,60 C290,30 320,50 350,20";

  return (
    <section
      style={{
        padding: "150px 20px 90px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="hero-grid"
        style={{
          width: "100%",
          maxWidth: 1160,
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: 56,
          alignItems: "center",
        }}
      >
        {/* Left column */}
        <div>
          <Reveal>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 12px 6px 8px",
                borderRadius: 100,
                border: `1px solid ${C.line}`,
                background: C.white,
                marginBottom: 26,
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: C.accentDim,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={11} color={C.accent} strokeWidth={2.5} />
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.ink,
                }}
              >
                Reads every line of your statement, in seconds
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(38px, 4.6vw, 62px)",
                lineHeight: 1.04,
                letterSpacing: "-0.03em",
                color: C.ink,
                margin: 0,
              }}
            >
              Stop losing track
              <br />
              of your money.
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 18,
                lineHeight: 1.6,
                color: C.slate,
                maxWidth: 480,
                margin: "22px 0 34px",
              }}
            >
              Upload a bank statement and lostmoney.ai finds the subscriptions
              you forgot, the duplicate charges, and the categories quietly
              eating your paycheck — before your next one lands.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link
                to="/register"
                style={{
                  background: C.accent,
                  color: C.white,
                  border: "none",
                  borderRadius: 14,
                  padding: "15px 24px",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 15.5,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 10px 24px rgba(255,122,0,0.28)",
                  transition: "transform 0.15s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                Get started free <ArrowRight size={17} />
              </Link>
              <button
                style={{
                  background: "transparent",
                  color: C.ink,
                  border: `1.5px solid ${C.ink}`,
                  borderRadius: 14,
                  padding: "15px 24px",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 15.5,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Upload size={16} /> Upload a statement
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.22}>
            <div
              className="hero-metrics"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, auto)",
                gap: 36,
                marginTop: 54,
                paddingTop: 30,
                borderTop: `1px solid ${C.line}`,
              }}
            >
              {[
                { to: 214, prefix: "$", suffix: "", label: "avg. found per user / mo" },
                { to: 41000, prefix: "", suffix: "+", label: "statements processed" },
                { to: 96, prefix: "", suffix: "%", label: "categorization accuracy" },
              ].map((m) => (
                <div key={m.label}>
                  <div
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 26,
                      fontWeight: 500,
                      color: C.ink,
                    }}
                  >
                    <CountUp to={m.to} prefix={m.prefix} suffix={m.suffix} />
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12.5,
                      color: C.slate,
                      marginTop: 4,
                      maxWidth: 120,
                    }}
                  >
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right column — floating illustrative card */}
        <Reveal delay={0.15} y={26}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                background: C.ink,
                borderRadius: 26,
                padding: 26,
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 30px 70px rgba(17,17,17,0.28)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12.5,
                      color: "rgba(255,244,236,0.55)",
                      marginBottom: 8,
                    }}
                  >
                    Tracked balance
                  </div>
                  <div
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 34,
                      color: C.cream,
                      fontWeight: 500,
                    }}
                  >
                    $<CountUp to={12480} />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background: "rgba(255,122,0,0.16)",
                    color: C.accent,
                    borderRadius: 100,
                    padding: "6px 10px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 12.5,
                  }}
                >
                  <ArrowUpRight size={13} /> 12.4%
                </div>
              </div>

              <svg
                viewBox="0 0 350 150"
                style={{ width: "100%", height: 130, marginTop: 18 }}
              >
                <defs>
                  <linearGradient id="lm-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#FF7A00" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`${path} L350,150 L0,150 Z`} fill="url(#lm-fill)" />
                <motion.path
                  d={path}
                  fill="none"
                  stroke="#FF7A00"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }}
                />
                {[0, 90, 180, 270, 350].map((x, i) => (
                  <line
                    key={i}
                    x1={x}
                    y1="0"
                    x2={x}
                    y2="150"
                    stroke="rgba(255,244,236,0.06)"
                  />
                ))}
              </svg>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                {[
                  "3 duplicate charges found",
                  "Subscriptions ↓ $84/mo",
                  "Dining up 22% this month",
                ].map((t) => (
                  <span
                    key={t}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12,
                      fontWeight: 500,
                      color: "rgba(255,244,236,0.85)",
                      background: "rgba(255,244,236,0.08)",
                      border: "1px solid rgba(255,244,236,0.12)",
                      borderRadius: 100,
                      padding: "7px 12px",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              style={{
                position: "absolute",
                bottom: -22,
                left: -18,
                background: C.white,
                borderRadius: 16,
                border: `1px solid ${C.line}`,
                padding: "12px 16px",
                boxShadow: "0 16px 36px rgba(17,17,17,0.12)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: C.accentDim,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PiggyBank size={16} color={C.accent} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: 13.5,
                    color: C.ink,
                  }}
                >
                  $84/mo recoverable
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11.5,
                    color: C.slate,
                  }}
                >
                  found by AI scan
                </div>
              </div>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  How it works                                                       */
/* ------------------------------------------------------------------ */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Upload statement",
      icon: Upload,
      desc: "Drop a PDF or CSV from any bank. No manual entry, no connecting accounts if you'd rather not.",
    },
    {
      n: "02",
      title: "AI processes it",
      icon: Sparkles,
      desc: "Every line is read, categorized, and cross-checked for duplicates, fees, and recurring charges.",
    },
    {
      n: "03",
      title: "Get insights",
      icon: BarChart3,
      desc: "A clear breakdown of where your money went, and specific ways to keep more of it next month.",
    },
  ];

  return (
    <section id="how" style={{ padding: "100px 20px", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 1160 }}>
        <Reveal>
          <div style={{ maxWidth: 560, marginBottom: 56 }}>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 13,
                color: C.accent,
                letterSpacing: "0.04em",
              }}
            >
              THE PROCESS
            </span>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(28px, 3.2vw, 40px)",
                letterSpacing: "-0.02em",
                color: C.ink,
                margin: "10px 0 0",
              }}
            >
              Three steps, no spreadsheets.
            </h2>
          </div>
        </Reveal>

        <div
          className="steps-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            background: C.line,
            borderRadius: 24,
            overflow: "hidden",
            border: `1px solid ${C.line}`,
          }}
        >
          {steps.map((s, i) => (
            <Reveal delay={i * 0.08} key={s.n}>
              <div
                style={{
                  background: C.cream,
                  padding: "38px 30px",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 15,
                    color: C.slate,
                    marginBottom: 26,
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 13,
                    background: C.ink,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <s.icon size={20} color={C.accent} strokeWidth={2} />
                </div>
                <h3
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    fontSize: 19,
                    color: C.ink,
                    margin: "0 0 10px",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14.5,
                    lineHeight: 1.6,
                    color: C.slate,
                    margin: 0,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Features grid                                                      */
/* ------------------------------------------------------------------ */
function Features() {
  const features = [
    {
      icon: FileStack,
      title: "Any statement, any bank",
      desc: "PDF, CSV, or scanned image — upload however you have it and lostmoney.ai parses it cleanly.",
      tint: "#FFE3C7",
    },
    {
      icon: Sparkles,
      title: "AI categorization",
      desc: "Transactions sort themselves into groceries, subscriptions, bills, and more — automatically.",
      tint: "#E6E9FF",
    },
    {
      icon: BarChart3,
      title: "Analytics dashboard",
      desc: "See spending trends by category and month, without building a single spreadsheet.",
      tint: "#DFF3E3",
    },
    {
      icon: Repeat,
      title: "Recurring payment detection",
      desc: "Every subscription and recurring charge surfaced, including the ones you forgot you had.",
      tint: "#FDE3EC",
    },
    {
      icon: PiggyBank,
      title: "Smart savings suggestions",
      desc: "Specific, actionable ways to cut costs based on your actual spending — not generic tips.",
      tint: "#FFF3C4",
    },
    {
      icon: ShieldCheck,
      title: "Bank-grade security",
      desc: "Statements are encrypted in transit and at rest. Your data is never sold, ever.",
      tint: "#DCEEFB",
    },
  ];

  return (
    <section id="features" style={{ padding: "40px 20px 100px", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 1160 }}>
        <Reveal>
          <div style={{ maxWidth: 560, marginBottom: 50 }}>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 13,
                color: C.accent,
                letterSpacing: "0.04em",
              }}
            >
              WHAT YOU GET
            </span>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(28px, 3.2vw, 40px)",
                letterSpacing: "-0.02em",
                color: C.ink,
                margin: "10px 0 0",
              }}
            >
              Everything to find the leaks.
            </h2>
          </div>
        </Reveal>

        <div
          className="features-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 18,
          }}
        >
          {features.map((f, i) => (
            <Reveal delay={(i % 3) * 0.06} key={f.title}>
              <div
                style={{
                  background: C.white,
                  border: `1px solid ${C.line}`,
                  borderRadius: 22,
                  padding: 28,
                  height: "100%",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(17,17,17,0.07)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 13,
                    background: f.tint,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <f.icon size={20} color={C.ink} strokeWidth={1.8} />
                </div>
                <h3
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    fontSize: 17.5,
                    color: C.ink,
                    margin: "0 0 8px",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: C.slate,
                    margin: 0,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                 */
/* ------------------------------------------------------------------ */
function FAQItem({ q, a, isOpen, onClick }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.line}` }}>
      <button
        onClick={onClick}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 4px",
          textAlign: "left",
          gap: 20,
        }}
      >
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: 17,
            color: C.ink,
          }}
        >
          {q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            flexShrink: 0,
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: isOpen ? C.ink : C.creamDeep,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronDown size={16} color={isOpen ? C.accent : C.ink} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 15,
                lineHeight: 1.7,
                color: C.slate,
                margin: "0 0 24px",
                maxWidth: 640,
              }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  const items = [
    {
      q: "Which banks are supported?",
      a: "Any bank that gives you a PDF or CSV statement — which is nearly all of them. There's no need to connect your bank account directly if you'd rather just upload a file.",
    },
    {
      q: "Is my financial data safe?",
      a: "Statements are encrypted in transit and at rest, processed to generate your insights, and never sold or shared with third parties. You can delete your data at any time.",
    },
    {
      q: "How accurate is the categorization?",
      a: "The AI model categorizes transactions with roughly 96% accuracy out of the box, and gets sharper the more statements you upload as it learns your specific spending patterns.",
    },
    {
      q: "Can I upload more than one statement at once?",
      a: "Yes. Upload several months, or several accounts, in one batch — lostmoney.ai merges them into a single timeline so trends and duplicate charges are easy to spot across accounts.",
    },
    {
      q: "What happens after I sign up?",
      a: "You'll upload your first statement and see a full breakdown within a couple of minutes — no setup calls, no onboarding forms, just your data and your results.",
    },
  ];

  return (
    <section id="faq" style={{ padding: "100px 20px", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 720 }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 13,
                color: C.accent,
                letterSpacing: "0.04em",
              }}
            >
              QUESTIONS
            </span>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(28px, 3.2vw, 38px)",
                letterSpacing: "-0.02em",
                color: C.ink,
                margin: "10px 0 0",
              }}
            >
              Before you upload anything.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div>
            {items.map((it, i) => (
              <FAQItem
                key={it.q}
                q={it.q}
                a={it.a}
                isOpen={open === i}
                onClick={() => setOpen(open === i ? -1 : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA banner                                                         */
/* ------------------------------------------------------------------ */
function CTABanner() {
  return (
    <section style={{ padding: "0 20px 100px", display: "flex", justifyContent: "center" }}>
      <Reveal className="cta-wrap" style={{ width: "100%", maxWidth: 1160 }}>
        <div
          style={{
            background: `linear-gradient(135deg, #1a1a1a 0%, #111111 55%, #582500 100%)`,
            borderRadius: 28,
            padding: "64px 48px",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 260,
              height: 260,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,122,0,0.35), transparent 70%)",
            }}
          />
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(28px, 3.6vw, 44px)",
              letterSpacing: "-0.02em",
              color: C.cream,
              margin: "0 0 14px",
              maxWidth: 560,
              position: "relative",
            }}
          >
            Find out what your money's been doing.
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              color: "rgba(255,244,236,0.65)",
              maxWidth: 440,
              margin: "0 0 34px",
              position: "relative",
            }}
          >
            Your first statement is free to upload. See your results in under
            two minutes.
          </p>
          <Link
            to="/register"
            style={{
              background: C.accent,
              color: C.white,
              border: "none",
              borderRadius: 14,
              padding: "16px 30px",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              position: "relative",
              boxShadow: "0 14px 30px rgba(255,122,0,0.35)",
              textDecoration: "none",
            }}
          >
            Get started free <ArrowRight size={18} />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                              */
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer style={{ background: C.ink, padding: "48px 20px 32px", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 1160 }}>
        <div
          className="footer-top"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 32,
            borderBottom: "1px solid rgba(255,244,236,0.12)",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "rgba(255,244,236,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Wallet size={14} color={C.accent} strokeWidth={2.4} />
            </div>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: C.cream,
              }}
            >
              lostmoney<span style={{ color: C.accent }}>.ai</span>
            </span>
          </div>

          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13.5,
                  color: "rgba(255,244,236,0.55)",
                  textDecoration: "none",
                }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>

        <div
          style={{
            paddingTop: 22,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12,
            color: "rgba(255,244,236,0.35)",
          }}
        >
          © {new Date().getFullYear()} lostmoney.ai — All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                                */
/* ------------------------------------------------------------------ */
export default function LostMoneyLanding() {
  return (
    <div
      style={{
        background: C.cream,
        minHeight: "100vh",
        color: C.ink,
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; }
        body { margin: 0; }
        button:focus-visible, a:focus-visible {
          outline: 2px solid ${C.accent};
          outline-offset: 2px;
        }
        @media (max-width: 900px) {
          .nav-links, .nav-cta { display: none !important; }
          .nav-burger { display: flex !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-metrics { grid-template-columns: repeat(3, auto) !important; gap: 20px !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .features-grid { grid-template-columns: 1fr !important; }
          .footer-top { flex-direction: column; align-items: flex-start !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <Nav />
      <Hero />
      <HowItWorks />
      <Features />
      <FAQ />
      <CTABanner />
      <Footer />
    </div>
  );
}
