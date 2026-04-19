import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const { API } = useAuth();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { setStatus('error'); setMessage('No verification token found.'); return; }

    axios.get(`${API}/auth/verify-email?token=${token}`)
      .then(res => { setStatus('success'); setMessage(res.data.message); })
      .catch(err => { setStatus('error'); setMessage(err.response?.data?.message || 'Verification failed.'); });
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.bg}><div style={styles.orb} /></div>
      <div style={styles.card} className="fade-up">
        <div style={styles.logo}>MANTHRA</div>
        <div style={{ fontSize: 56, margin: '16px 0' }}>
          {status === 'loading' ? '⏳' : status === 'success' ? '✅' : '❌'}
        </div>
        <h2 style={styles.heading}>
          {status === 'loading' ? 'Verifying...' : status === 'success' ? 'Email Verified!' : 'Verification Failed'}
        </h2>
        <p style={styles.subtext}>{message}</p>
        {status === 'success' && (
          <Link to="/login" style={styles.btn}>Go to Login →</Link>
        )}
        {status === 'error' && (
          <Link to="/signup" style={styles.btn}>Back to Sign Up</Link>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  bg: { position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 0 },
  orb: { position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' },
  card: { position: 'relative', zIndex: 1, background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(201,169,110,0.15)', borderRadius: 20, padding: '52px 40px', width: '100%', maxWidth: 420, textAlign: 'center', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' },
  logo: { fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, letterSpacing: 10, color: 'var(--gold)', textTransform: 'uppercase' },
  heading: { fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: 'var(--text)', marginBottom: 12 },
  subtext: { fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 28 },
  btn: { display: 'inline-block', background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: '#000', fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', padding: '14px 32px', borderRadius: 50, textDecoration: 'none' },
};
