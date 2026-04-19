import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM',
];

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { API, user } = useAuth();

  const { service, category, price } = location.state || {};

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!service) {
    navigate('/prices');
    return null;
  }

  // Fetch booked slots when date changes
  useEffect(() => {
    if (!selectedDate) return;
    setSlotsLoading(true);
    const dateStr = formatDate(selectedDate);
    axios.get(`${API}/bookings/slots?date=${dateStr}`)
      .then(res => setBookedSlots(res.data.bookedSlots))
      .catch(() => setBookedSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate]);

  const formatDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const formatDisplayDate = (d) => {
    if (!d) return '';
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Calendar helpers
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
    setSelectedDate(null); setSelectedSlot(null);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
    setSelectedDate(null); setSelectedSlot(null);
  };

  const isDisabled = (day) => {
    const d = new Date(currentYear, currentMonth, day);
    d.setHours(0,0,0,0);
    const t = new Date(); t.setHours(0,0,0,0);
    return d < t || d.getDay() === 0; // No Sundays
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear;
  };

  const handleDayClick = (day) => {
    if (isDisabled(day)) return;
    setSelectedDate(new Date(currentYear, currentMonth, day));
    setSelectedSlot(null);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedSlot) { setError('Please select a date and time slot'); return; }
    setLoading(true); setError('');
    try {
      await axios.post(`${API}/bookings`, {
        service, category, price,
        date: formatDate(selectedDate),
        timeSlot: selectedSlot,
        notes
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.bg} />
        <div style={{ ...styles.card, textAlign: 'center', maxWidth: 480 }} className="fade-up">
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={styles.heading}>Booking Confirmed!</h2>
          <div style={styles.summaryCard}>
            <div style={styles.summaryRow}><span style={styles.sLabel}>Service</span><span style={styles.sVal}>{service}</span></div>
            <div style={styles.summaryRow}><span style={styles.sLabel}>Date</span><span style={styles.sVal}>{formatDisplayDate(selectedDate)}</span></div>
            <div style={styles.summaryRow}><span style={styles.sLabel}>Time</span><span style={styles.sVal}>{selectedSlot}</span></div>
            <div style={{ ...styles.summaryRow, borderBottom: 'none' }}><span style={styles.sLabel}>Amount</span><span style={{ ...styles.sVal, color: 'var(--gold)', fontSize: 20, fontFamily: "'Cormorant Garamond', serif" }}>₹{price?.toLocaleString('en-IN')}</span></div>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>A confirmation email has been sent to {user?.email}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/bookings')} style={styles.submitBtn}>View My Bookings</button>
            <button onClick={() => navigate('/prices')} style={styles.ghostBtn}>Book Another</button>
          </div>
        </div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  return (
    <div style={styles.page}>
      <div style={styles.bg}><div style={styles.bgOrb} /></div>

      {/* Header */}
      <header style={styles.header}>
        <button onClick={() => navigate('/prices')} style={styles.backBtn}>← Back</button>
        <div style={styles.logo}>MANTHRA</div>
        <div style={{ width: 80 }} />
      </header>

      <div style={styles.content} className="fade-up">
        <div style={styles.heroText}>
          <div style={styles.badge}>Book Appointment</div>
          <h1 style={styles.heading}>{service}</h1>
          <p style={styles.subtext}>{category} · <span style={{ color: 'var(--gold)' }}>₹{price?.toLocaleString('en-IN')}</span></p>
        </div>

        <div style={styles.layout}>
          {/* Calendar */}
          <div style={styles.panel}>
            <div style={styles.panelTitle}>Select Date</div>
            <div style={styles.calendar}>
              <div style={styles.calHeader}>
                <button onClick={prevMonth} style={styles.navBtn}>‹</button>
                <span style={styles.monthLabel}>{MONTHS[currentMonth]} {currentYear}</span>
                <button onClick={nextMonth} style={styles.navBtn}>›</button>
              </div>
              <div style={styles.dayNames}>
                {DAYS.map(d => <div key={d} style={styles.dayName}>{d}</div>)}
              </div>
              <div style={styles.daysGrid}>
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const disabled = isDisabled(day);
                  const selected = isSelected(day);
                  const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                  return (
                    <button
                      key={day}
                      onClick={() => handleDayClick(day)}
                      disabled={disabled}
                      style={{
                        ...styles.dayBtn,
                        ...(disabled ? styles.dayDisabled : {}),
                        ...(selected ? styles.daySelected : {}),
                        ...(isToday && !selected ? styles.dayToday : {}),
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <div style={styles.calNote}>*Closed on Sundays</div>
            </div>
          </div>

          {/* Time Slots */}
          <div style={styles.panel}>
            <div style={styles.panelTitle}>
              {selectedDate ? `Time Slots — ${formatDisplayDate(selectedDate)}` : 'Select a Date First'}
            </div>
            {!selectedDate ? (
              <div style={styles.placeholder}>
                <div style={{ fontSize: 36 }}>📅</div>
                <p>Please pick a date from the calendar</p>
              </div>
            ) : slotsLoading ? (
              <div style={styles.placeholder}><div style={styles.spinner} /></div>
            ) : (
              <div style={styles.slotsGrid}>
                {TIME_SLOTS.map(slot => {
                  const isBooked = bookedSlots.includes(slot);
                  const isChosen = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      disabled={isBooked}
                      onClick={() => !isBooked && setSelectedSlot(slot)}
                      style={{
                        ...styles.slotBtn,
                        ...(isBooked ? styles.slotBooked : {}),
                        ...(isChosen ? styles.slotSelected : {}),
                      }}
                    >
                      {slot}
                      {isBooked && <span style={{ fontSize: 9, display: 'block', color: 'var(--muted)' }}>Booked</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Notes */}
            {selectedDate && (
              <div style={{ marginTop: 20 }}>
                <label style={styles.panelTitle}>Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Any special requests or skin concerns..."
                  rows={3}
                  style={{ marginTop: 8, resize: 'vertical', fontFamily: 'Outfit, sans-serif' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Summary & Book */}
        {selectedDate && selectedSlot && (
          <div style={styles.summaryBar} className="fade-up">
            <div style={styles.summaryInfo}>
              <div style={{ color: 'var(--muted)', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Your Selection</div>
              <div style={{ fontWeight: 600 }}>{service}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{formatDisplayDate(selectedDate)} · {selectedSlot}</div>
            </div>
            <div style={styles.summaryRight}>
              <div style={styles.totalPrice}>₹{price?.toLocaleString('en-IN')}</div>
              <button onClick={handleSubmit} disabled={loading} style={styles.submitBtn}>
                {loading ? <span style={styles.spinner} /> : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}

        {error && <div style={{ ...styles.errorBox, margin: '16px 0', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>{error}</div>}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', position: 'relative' },
  bg: { position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 0 },
  bgOrb: { position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)', top: 0, right: '-100px', pointerEvents: 'none' },
  header: { position: 'sticky', top: 0, zIndex: 100, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 20, padding: '7px 16px', fontSize: 12, cursor: 'pointer', width: 80 },
  logo: { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, letterSpacing: 8, color: 'var(--gold)', textTransform: 'uppercase' },
  content: { position: 'relative', zIndex: 1, padding: '40px 32px', maxWidth: 1100, margin: '0 auto' },
  heroText: { textAlign: 'center', marginBottom: 40 },
  badge: { display: 'inline-block', fontSize: 10, letterSpacing: 3, color: 'var(--gold)', textTransform: 'uppercase', border: '1px solid rgba(201,169,110,0.3)', borderRadius: 20, padding: '5px 16px', marginBottom: 12 },
  heading: { fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, color: 'var(--text)', marginBottom: 8 },
  subtext: { fontSize: 14, color: 'var(--muted)' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 },
  panel: { background: 'rgba(15,15,15,0.8)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 },
  panelTitle: { fontSize: 12, letterSpacing: 2, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 },
  // Calendar
  calendar: {},
  calHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  navBtn: { background: 'none', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 18, lineHeight: 1 },
  monthLabel: { fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: 'var(--text)' },
  dayNames: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 },
  dayName: { fontSize: 11, color: 'var(--muted)', textAlign: 'center', letterSpacing: 1, textTransform: 'uppercase' },
  daysGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 },
  dayBtn: { background: 'transparent', border: '1px solid transparent', color: 'var(--text)', borderRadius: 8, padding: '8px 4px', fontSize: 13, cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', minHeight: 36 },
  dayDisabled: { color: 'var(--border)', cursor: 'not-allowed', background: 'transparent' },
  daySelected: { background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: '#000', fontWeight: 700, border: '1px solid var(--gold)' },
  dayToday: { border: '1px solid rgba(201,169,110,0.4)', color: 'var(--gold)' },
  calNote: { fontSize: 11, color: 'var(--muted)', marginTop: 12, textAlign: 'center', letterSpacing: 0.5 },
  // Slots
  placeholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'var(--muted)', fontSize: 13, minHeight: 200 },
  slotsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 },
  slotBtn: { background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, padding: '10px 4px', fontSize: 12, cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', lineHeight: 1.3 },
  slotBooked: { background: 'rgba(224,92,92,0.07)', border: '1px solid rgba(224,92,92,0.2)', color: 'var(--border)', cursor: 'not-allowed' },
  slotSelected: { background: 'rgba(201,169,110,0.15)', border: '1px solid var(--gold)', color: 'var(--gold)', fontWeight: 600 },
  // Summary
  summaryBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(201,169,110,0.07)', border: '1px solid rgba(201,169,110,0.25)', borderRadius: 16, padding: '20px 28px', marginTop: 24, gap: 16, flexWrap: 'wrap' },
  summaryInfo: { flex: 1 },
  summaryRight: { display: 'flex', alignItems: 'center', gap: 20 },
  totalPrice: { fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: 'var(--gold)' },
  submitBtn: { background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: '#000', border: 'none', borderRadius: 50, padding: '14px 32px', fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 180, minHeight: 48 },
  ghostBtn: { background: 'none', border: '1px solid rgba(201,169,110,0.3)', color: 'var(--gold)', borderRadius: 50, padding: '12px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  errorBox: { background: 'rgba(224,92,92,0.1)', border: '1px solid rgba(224,92,92,0.3)', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#e05c5c', textAlign: 'center' },
  spinner: { width: 18, height: 18, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' },
  summaryCard: { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, margin: '20px 0', textAlign: 'left' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' },
  sLabel: { fontSize: 11, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase' },
  sVal: { fontSize: 14, fontWeight: 500, color: 'var(--text)' },
  card: { position: 'relative', zIndex: 1, background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(201,169,110,0.15)', borderRadius: 20, padding: '48px 40px', width: '100%', margin: 'auto', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' },
};
