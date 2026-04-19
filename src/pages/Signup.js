import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState("form"); // 'form' | 'success'

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await signup(form);
      setSuccess(res.message);
      setStep("success");
    } catch (err) {
      setError(err.response?.data?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^a-zA-Z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthColor = [
    "",
    "#e05c5c",
    "#e09a5c",
    "#e0c75c",
    "#5ce08a",
    "#5ce08a",
  ][strength];
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Strong"][
    strength
  ];

  if (step === "success") {
    return (
      <div style={styles.page}>
        <div style={styles.bg}>
          <div style={styles.bgOrb1} />
          <div style={styles.bgOrb2} />
        </div>
        <div
          style={{ ...styles.card, textAlign: "center" }}
          className="fade-up"
        >
          <div style={styles.logoWrap}>
            <div style={styles.logoLine} />
            <div style={styles.logo}>MANTHRA</div>
            <div style={styles.logoLine} />
          </div>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✉️</div>
          <h2 style={styles.heading}>Check Your Inbox</h2>
          <p style={styles.subtext}>
            We've sent a verification link to
            <br />
            <strong style={{ color: "var(--gold)" }}>{form.email}</strong>
          </p>
          <p style={{ ...styles.subtext, marginTop: 12 }}>
            Click the link to verify your email, then you can log in and start
            booking.
          </p>
          <div
            style={{
              marginTop: 8,
              padding: "16px",
              background: "rgba(201,169,110,0.08)",
              borderRadius: 12,
              border: "1px solid rgba(201,169,110,0.2)",
              fontSize: 12,
              color: "var(--muted)",
              lineHeight: 1.7,
            }}
          >
            ⚠️ Check your spam folder if you don't see it within a minute.
          </div>
          <Link
            to="/login"
            style={{
              ...styles.submitBtn,
              display: "block",
              textAlign: "center",
              textDecoration: "none",
              marginTop: 28,
              lineHeight: "48px",
              padding: "0",
            }}
          >
            Go to Login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.bg}>
        <div style={styles.bgOrb1} />
        <div style={styles.bgOrb2} />
      </div>

      <div style={styles.card} className="fade-up">
        <div style={styles.logoWrap}>
          <div style={styles.logoLine} />
          <div style={styles.logo}>MANTHRA</div>
          <div style={styles.tagline}>Beauty Lounge & Makeover Studio</div>
          <div style={styles.logoLine} />
        </div>

        <h2 style={styles.heading}>Create Account</h2>
        <p style={styles.subtext}>Join us for exclusive beauty experiences</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              autoComplete="username"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Phone Number</label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              autoComplete="tel"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                autoComplete="new-password"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {form.password && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 6,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 3,
                    background: "var(--border)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(strength / 5) * 100}%`,
                      height: "100%",
                      background: strengthColor,
                      transition: "all 0.3s",
                      borderRadius: 2,
                    }}
                  />
                </div>
                <span
                  style={{ fontSize: 11, color: strengthColor, minWidth: 40 }}
                >
                  {strengthLabel}
                </span>
              </div>
            )}
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? <span style={styles.spinner} /> : "Create Account"}
          </button>
        </form>

        <div style={styles.divider}>
          <span>Already have an account?</span>
        </div>
        <Link to="/login" style={styles.createLink}>
          Sign In →
        </Link>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
  },
  bg: { position: "fixed", inset: 0, background: "var(--bg)", zIndex: 0 },
  bgOrb1: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)",
    top: "-100px",
    right: "-100px",
    pointerEvents: "none",
  },
  bgOrb2: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)",
    bottom: "-50px",
    left: "-50px",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    zIndex: 1,
    background: "rgba(15,15,15,0.95)",
    border: "1px solid rgba(201,169,110,0.15)",
    borderRadius: 20,
    padding: "48px 40px",
    width: "100%",
    maxWidth: 440,
    backdropFilter: "blur(20px)",
    boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
  },
  logoWrap: { textAlign: "center", marginBottom: 36 },
  logoLine: {
    height: 1,
    background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
    margin: "10px 0",
  },
  logo: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 32,
    fontWeight: 600,
    letterSpacing: 12,
    color: "var(--gold)",
    textTransform: "uppercase",
    margin: "8px 0 4px",
  },
  tagline: {
    fontSize: 10,
    letterSpacing: 3,
    color: "var(--muted)",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  heading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 28,
    fontWeight: 400,
    color: "var(--text)",
    marginBottom: 8,
    textAlign: "center",
  },
  subtext: {
    fontSize: 13,
    color: "var(--muted)",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 1.6,
  },
  errorBox: {
    background: "rgba(224,92,92,0.1)",
    border: "1px solid rgba(224,92,92,0.3)",
    borderRadius: 8,
    padding: "12px 16px",
    fontSize: 13,
    color: "#e05c5c",
    marginBottom: 20,
    textAlign: "center",
  },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: {
    fontSize: 12,
    letterSpacing: 1.5,
    color: "var(--muted)",
    textTransform: "uppercase",
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    padding: 4,
  },
  submitBtn: {
    marginTop: 8,
    background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
    color: "#000",
    border: "none",
    borderRadius: 50,
    padding: "14px",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  spinner: {
    width: 18,
    height: 18,
    border: "2px solid rgba(0,0,0,0.2)",
    borderTopColor: "#000",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    display: "inline-block",
  },
  divider: {
    textAlign: "center",
    color: "var(--muted)",
    fontSize: 12,
    margin: "24px 0 12px",
  },
  createLink: {
    display: "block",
    textAlign: "center",
    color: "var(--gold)",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 1,
    textDecoration: "none",
    padding: "12px",
    border: "1px solid rgba(201,169,110,0.3)",
    borderRadius: 50,
  },
};
