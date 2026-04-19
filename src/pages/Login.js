import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Login() {
  const { login, API } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [resendMsg, setResendMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/prices');
    } catch (err) {
      const data = err.response?.data;
      if (data?.needsVerification) {
        setNeedsVerification(true);
        setResendEmail(data.email);
      } else {
        setError(data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await axios.post(`${API}/auth/resend-verification`, { email: resendEmail });
      setResendMsg(res.data.message);
    } catch (err) {
      setResendMsg(err.response?.data?.message || 'Failed to resend');
    }
  };

  return (
    <div style={styles.page}>
      {/* Background */}
      <div style={styles.bg}>
        <div style={styles.bgOrb1} />
        <div style={styles.bgOrb2} />
        <div style={styles.grain} />
      </div>

      <div style={styles.card} className="fade-up">
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoLine} />
          <div style={styles.logo}>MANTHRA</div>
          <div style={styles.tagline}>Beauty Lounge & Makeover Studio</div>
          <div style={styles.logoLine} />
        </div>

        {needsVerification ? (
          <div style={styles.verifyBox}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📧</div>
            <h2 style={styles.heading}>Verify Your Email</h2>
            <p style={styles.subtext}>
              A verification link was sent to <strong style={{ color: 'var(--gold)' }}>{resendEmail}</strong>.<br />
              Please check your inbox and verify before logging in.
            </p>
            {resendMsg && <div style={styles.successMsg}>{resendMsg}</div>}
            <button onClick={handleResend} style={styles.ghostBtn}>Resend Verification Email</button>
            <button onClick={() => setNeedsVerification(false)} style={styles.linkBtn}>← Back to Login</button>
          </div>
        ) : (
          <>
            <h2 style={styles.heading}>Welcome Back</h2>
            <p style={styles.subtext}>Sign in to book your luxury treatment</p>

            {error && <div style={styles.errorBox}>{error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Username or Email</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter your username or email"
                  required
                  autoComplete="username"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? <span style={styles.spinner} /> : 'Sign In'}
              </button>
            </form>

            <div style={styles.divider}><span>Don't have an account?</span></div>
            <Link to="/signup" style={styles.createLink}>Create Account →</Link>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  bg: {
    position: 'fixed',
    inset: 0,
    background: 'var(--bg)',
    zIndex: 0,
  },
  bgOrb1: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)',
    top: '-100px',
    left: '-100px',
    pointerEvents: 'none',
  },
  bgOrb2: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)',
    bottom: '-50px',
    right: '-50px',
    pointerEvents: 'none',
  },
  grain: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
    opacity: 0.5,
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    zIndex: 1,
    background: 'rgba(15,15,15,0.95)',
    border: '1px solid rgba(201,169,110,0.15)',
    borderRadius: 20,
    padding: '48px 40px',
    width: '100%',
    maxWidth: 440,
    backdropFilter: 'blur(20px)',
    boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
  },
  logoWrap: {
    textAlign: 'center',
    marginBottom: 36,
  },
  logoLine: {
    height: 1,
    background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
    margin: '10px 0',
  },
  logo: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 32,
    fontWeight: 600,
    letterSpacing: 12,
    color: 'var(--gold)',
    textTransform: 'uppercase',
    margin: '8px 0 4px',
  },
  tagline: {
    fontSize: 10,
    letterSpacing: 3,
    color: 'var(--muted)',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 28,
    fontWeight: 400,
    color: 'var(--text)',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 13,
    color: 'var(--muted)',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 1.6,
  },
  errorBox: {
    background: 'rgba(224,92,92,0.1)',
    border: '1px solid rgba(224,92,92,0.3)',
    borderRadius: 8,
    padding: '12px 16px',
    fontSize: 13,
    color: '#e05c5c',
    marginBottom: 20,
    textAlign: 'center',
  },
  successMsg: {
    background: 'rgba(92,224,138,0.1)',
    border: '1px solid rgba(92,224,138,0.3)',
    borderRadius: 8,
    padding: '12px 16px',
    fontSize: 13,
    color: 'var(--success)',
    marginBottom: 16,
    textAlign: 'center',
  },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, letterSpacing: 1.5, color: 'var(--muted)', textTransform: 'uppercase' },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 16,
    padding: 4,
  },
  submitBtn: {
    marginTop: 8,
    background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
    color: '#000',
    border: 'none',
    borderRadius: 50,
    padding: '14px',
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.1s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  spinner: {
    width: 18,
    height: 18,
    border: '2px solid rgba(0,0,0,0.2)',
    borderTopColor: '#000',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    display: 'inline-block',
  },
  divider: {
    textAlign: 'center',
    color: 'var(--muted)',
    fontSize: 12,
    margin: '24px 0 12px',
    position: 'relative',
  },
  createLink: {
    display: 'block',
    textAlign: 'center',
    color: 'var(--gold)',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 1,
    textDecoration: 'none',
    padding: '12px',
    border: '1px solid rgba(201,169,110,0.3)',
    borderRadius: 50,
    transition: 'all 0.2s',
  },
  verifyBox: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  ghostBtn: {
    background: 'rgba(201,169,110,0.1)',
    border: '1px solid rgba(201,169,110,0.4)',
    color: 'var(--gold)',
    borderRadius: 50,
    padding: '12px 24px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 8,
    letterSpacing: 1,
    width: '100%',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--muted)',
    fontSize: 13,
    cursor: 'pointer',
    textDecoration: 'underline',
    marginTop: 4,
  },
};
