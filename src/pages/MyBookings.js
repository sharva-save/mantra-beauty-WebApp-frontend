import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = {
  pending: { bg: 'rgba(201,169,110,0.1)', border: 'rgba(201,169,110,0.3)', text: '#c9a96e' },
  confirmed: { bg: 'rgba(92,224,138,0.1)', border: 'rgba(92,224,138,0.3)', text: '#5ce08a' },
  cancelled: { bg: 'rgba(224,92,92,0.1)', border: 'rgba(224,92,92,0.3)', text: '#e05c5c' },
  completed: { bg: 'rgba(120,120,120,0.1)', border: 'rgba(120,120,120,0.3)', text: '#888' },
};

export default function MyBookings() {
  const { API, user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API}/bookings/my`)
      .then(res => setBookings(res.data.bookings))
      .catch(() => setError('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(id);
    try {
      await axios.delete(`${API}/bookings/${id}`);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  const upcoming = bookings.filter(b => b.status !== 'cancelled' && new Date(b.date) >= new Date());
  const past = bookings.filter(b => b.status === 'cancelled' || new Date(b.date) < new Date());

  return (
    <div style={styles.page}>
      <div style={styles.bg}><div style={styles.bgOrb} /></div>

      <header style={styles.header}>
        <button onClick={() => navigate('/prices')} style={styles.backBtn}>← Back</button>
        <div style={styles.logo}>MANTHRA</div>
        <button onClick={logout} style={styles.logoutBtn}>Sign Out</button>
      </header>

      <div style={styles.content} className="fade-up">
        <div style={styles.heroText}>
          <div style={styles.badge}>My Appointments</div>
          <h1 style={styles.heading}>Your Bookings</h1>
          <p style={styles.subtext}>Hi {user?.fullName}, here are all your appointments</p>
        </div>

        {loading && (
          <div style={styles.centerBox}>
            <div style={styles.spinner} />
            <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 12 }}>Loading bookings...</p>
          </div>
        )}

        {error && <div style={styles.errorBox}>{error}</div>}

        {!loading && bookings.length === 0 && (
          <div style={styles.emptyBox}>
            <div style={{ fontSize: 56 }}>🗓️</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: 'var(--text)', margin: '12px 0 8px' }}>No bookings yet</h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>Book your first luxury treatment today</p>
            <button onClick={() => navigate('/prices')} style={styles.bookNowBtn}>Explore Services →</button>
          </div>
        )}

        {upcoming.length > 0 && (
          <section style={styles.section}>
            <div style={styles.sectionTitle}>Upcoming Appointments</div>
            <div style={styles.bookingsList}>
              {upcoming.map(b => (
                <BookingCard key={b._id} booking={b} onCancel={handleCancel} cancelling={cancelling} formatDate={formatDate} />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section style={styles.section}>
            <div style={styles.sectionTitle}>Past & Cancelled</div>
            <div style={styles.bookingsList}>
              {past.map(b => (
                <BookingCard key={b._id} booking={b} onCancel={null} cancelling={cancelling} formatDate={formatDate} isPast />
              ))}
            </div>
          </section>
        )}

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button onClick={() => navigate('/prices')} style={styles.bookNowBtn}>Book Another Service →</button>
        </div>
      </div>
    </div>
  );
}

function BookingCard({ booking, onCancel, cancelling, formatDate, isPast }) {
  const sc = STATUS_COLORS[booking.status] || STATUS_COLORS.pending;
  const canCancel = onCancel && booking.status !== 'cancelled' && booking.status !== 'completed';

  return (
    <div style={{ ...styles.card, opacity: isPast ? 0.7 : 1 }}>
      <div style={styles.cardLeft}>
        <div style={styles.cardService}>{booking.service}</div>
        <div style={styles.cardCategory}>{booking.category}</div>
        <div style={styles.cardMeta}>
          <span>📅 {formatDate(booking.date)}</span>
          <span>🕐 {booking.timeSlot}</span>
        </div>
        {booking.notes && <div style={styles.cardNotes}>📝 {booking.notes}</div>}
      </div>
      <div style={styles.cardRight}>
        <div style={styles.cardPrice}>₹{booking.price?.toLocaleString('en-IN')}</div>
        <div style={{ ...styles.statusBadge, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </div>
        {canCancel && (
          <button
            onClick={() => onCancel(booking._id)}
            disabled={cancelling === booking._id}
            style={styles.cancelBtn}
          >
            {cancelling === booking._id ? '...' : 'Cancel'}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', position: 'relative' },
  bg: { position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 0 },
  bgOrb: { position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)', top: 0, left: '50%', transform: 'translateX(-50%)' },
  header: { position: 'sticky', top: 0, zIndex: 100, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 20, padding: '7px 16px', fontSize: 12, cursor: 'pointer', width: 80 },
  logo: { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, letterSpacing: 8, color: 'var(--gold)', textTransform: 'uppercase' },
  logoutBtn: { background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 20, padding: '7px 16px', fontSize: 12, cursor: 'pointer' },
  content: { position: 'relative', zIndex: 1, padding: '40px 32px', maxWidth: 900, margin: '0 auto' },
  heroText: { textAlign: 'center', marginBottom: 48 },
  badge: { display: 'inline-block', fontSize: 10, letterSpacing: 3, color: 'var(--gold)', textTransform: 'uppercase', border: '1px solid rgba(201,169,110,0.3)', borderRadius: 20, padding: '5px 16px', marginBottom: 12 },
  heading: { fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: 'var(--text)', marginBottom: 8 },
  subtext: { fontSize: 14, color: 'var(--muted)' },
  centerBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0' },
  emptyBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' },
  errorBox: { background: 'rgba(224,92,92,0.1)', border: '1px solid rgba(224,92,92,0.3)', borderRadius: 8, padding: '14px', fontSize: 13, color: '#e05c5c', textAlign: 'center', marginBottom: 24 },
  section: { marginBottom: 40 },
  sectionTitle: { fontSize: 11, letterSpacing: 3, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)' },
  bookingsList: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: { background: 'rgba(15,15,15,0.8)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 },
  cardLeft: { flex: 1 },
  cardService: { fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 4 },
  cardCategory: { fontSize: 12, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },
  cardMeta: { display: 'flex', gap: 16, fontSize: 13, color: 'var(--muted)', flexWrap: 'wrap' },
  cardNotes: { fontSize: 12, color: 'var(--muted)', marginTop: 8, fontStyle: 'italic' },
  cardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, minWidth: 120 },
  cardPrice: { fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: 'var(--gold)' },
  statusBadge: { fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', padding: '4px 12px', borderRadius: 20, fontWeight: 600 },
  cancelBtn: { background: 'none', border: '1px solid rgba(224,92,92,0.4)', color: '#e05c5c', borderRadius: 20, padding: '6px 14px', fontSize: 11, cursor: 'pointer', letterSpacing: 0.5 },
  bookNowBtn: { background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: '#000', border: 'none', borderRadius: 50, padding: '14px 32px', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer' },
  spinner: { width: 32, height: 32, border: '2px solid var(--border)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
};
