import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SERVICES = {
  'Threading & Waxing': [
    { name: 'Threading', price: 50 },
    { name: 'Upper Lip', price: 30 },
    { name: 'Chin', price: 20 },
    { name: 'Full Face', price: 150 },
    { name: 'Waxing — Half Leg', price: 800 },
    { name: 'Hand Wax', price: 600 },
    { name: 'Face Wax', price: 200 },
  ],
  'Facials': [
    { name: 'Normal Facial', price: 500 },
    { name: 'Fruit Facial', price: 850 },
    { name: 'Vitamin C Facial', price: 2000 },
    { name: 'Skin Tightening Facial', price: 1000 },
    { name: 'Anti Ageing Facial 30+', price: 1200 },
    { name: 'Silver Facial', price: 1000 },
    { name: 'Pearl Facial', price: 1800 },
    { name: 'Gold Facial', price: 2000 },
    { name: 'Pimple Facial', price: 900 },
    { name: 'Adv Anti Acne Pimple Treatment', price: 1300 },
    { name: 'O3+ Treatment', price: 3000 },
    { name: 'Hydra Advances', price: 3000 },
    { name: 'Hydra Facial', price: 2500 },
  ],
  'Cleanup & De-Tan': [
    { name: 'De Tan', price: 200 },
    { name: 'Clean Up (Starting)', price: 300 },
    { name: 'Cleanup + De-Tan', price: 400 },
    { name: 'Warts Removing', price: 50 },
  ],
  'Mani / Pedi / Spa': [
    { name: 'Pedicure Normal', price: 600 },
    { name: 'Spa Pedicure', price: 900 },
    { name: 'Deluxe Pedicure', price: 1100 },
    { name: 'Manicure Normal', price: 600 },
    { name: 'Spa Manicure', price: 900 },
    { name: 'Deluxe Manicure', price: 1100 },
    { name: 'Heel Peel Treatment', price: 900 },
  ],
  'Hair Services': [
    { name: 'Shampoo Wash & Conditioning', price: 250 },
    { name: 'Hot Oil Treatment', price: 300 },
    { name: 'Henna', price: 550 },
    { name: 'Black Henna', price: 550 },
    { name: 'Grey Coverage (Starts)', price: 500 },
    { name: 'Hair Spa (Normal)', price: 650 },
    { name: 'Schwarzkopf Keratin Spa', price: 900 },
    { name: 'Keratin Spa', price: 700 },
    { name: 'Matrix', price: 1000 },
  ],
};

const CATEGORY_ICONS = {
  'Threading & Waxing': '✂️',
  'Facials': '✨',
  'Cleanup & De-Tan': '🌿',
  'Mani / Pedi / Spa': '💅',
  'Hair Services': '💆',
};

export default function Prices() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(Object.keys(SERVICES)[0]);
  const [selectedService, setSelectedService] = useState(null);

  const handleBook = (service) => {
    setSelectedService(service);
    navigate('/book', { state: { service: service.name, category: activeCategory, price: service.price } });
  };

  return (
    <div style={styles.page}>
      {/* Background */}
      <div style={styles.bg}>
        <div style={styles.bgOrb} />
      </div>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>MANTHRA</div>
        <div style={styles.headerRight}>
          <span style={styles.welcome}>👋 {user?.fullName?.split(' ')[0]}</span>
          <button onClick={() => navigate('/bookings')} style={styles.headerBtn}>My Bookings</button>
          <button onClick={logout} style={styles.logoutBtn}>Sign Out</button>
        </div>
      </header>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroBadge}>Services & Pricing</div>
        <h1 style={styles.heroTitle}>Our Price List</h1>
        <p style={styles.heroSub}>Select any service below to book your appointment</p>
      </div>

      {/* Category Tabs */}
      <div style={styles.tabs}>
        <div style={styles.tabsInner}>
          {Object.keys(SERVICES).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                ...styles.tab,
                ...(activeCategory === cat ? styles.tabActive : {})
              }}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div style={styles.grid}>
        {SERVICES[activeCategory].map((svc, i) => (
          <div
            key={svc.name}
            style={{ ...styles.serviceCard, animationDelay: `${i * 0.04}s` }}
            className="fade-up"
          >
            <div style={styles.serviceName}>{svc.name}</div>
            <div style={styles.serviceBottom}>
              <div style={styles.servicePrice}>₹{svc.price.toLocaleString('en-IN')}</div>
              <button onClick={() => handleBook(svc)} style={styles.bookBtn}>Book Now</button>
            </div>
          </div>
        ))}
      </div>

      <footer style={styles.footer}>
        <div style={styles.footerLogo}>MANTHRA</div>
        <p style={styles.footerText}>Beauty Lounge & Makeover Studio</p>
      </footer>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', position: 'relative', paddingBottom: 60 },
  bg: { position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 0 },
  bgOrb: { position: 'absolute', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)', top: 0, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' },
  header: { position: 'sticky', top: 0, zIndex: 100, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, letterSpacing: 8, color: 'var(--gold)', textTransform: 'uppercase' },
  headerRight: { display: 'flex', alignItems: 'center', gap: 12 },
  welcome: { fontSize: 13, color: 'var(--muted)', marginRight: 4 },
  headerBtn: { background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)', color: 'var(--gold)', borderRadius: 20, padding: '7px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', letterSpacing: 0.5 },
  logoutBtn: { background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 20, padding: '7px 16px', fontSize: 12, cursor: 'pointer' },
  hero: { position: 'relative', zIndex: 1, textAlign: 'center', padding: '60px 24px 40px' },
  heroBadge: { display: 'inline-block', fontSize: 10, letterSpacing: 3, color: 'var(--gold)', textTransform: 'uppercase', border: '1px solid rgba(201,169,110,0.3)', borderRadius: 20, padding: '5px 16px', marginBottom: 16 },
  heroTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fontWeight: 300, color: 'var(--text)', lineHeight: 1, marginBottom: 12 },
  heroSub: { fontSize: 14, color: 'var(--muted)', letterSpacing: 0.5 },
  tabs: { position: 'sticky', top: 64, zIndex: 99, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '0 32px', overflowX: 'auto' },
  tabsInner: { display: 'flex', gap: 4, minWidth: 'max-content', padding: '12px 0' },
  tab: { background: 'none', border: '1px solid transparent', color: 'var(--muted)', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center', whiteSpace: 'nowrap', transition: 'all 0.2s' },
  tabActive: { background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.4)', color: 'var(--gold)' },
  grid: { position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, padding: '24px 32px', maxWidth: 1200, margin: '0 auto' },
  serviceCard: { background: 'rgba(22,22,22,0.8)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, transition: 'border-color 0.2s', cursor: 'default' },
  serviceName: { fontSize: 15, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4 },
  serviceBottom: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  servicePrice: { fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: 'var(--gold)' },
  bookBtn: { background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: '#000', border: 'none', borderRadius: 20, padding: '8px 18px', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer' },
  footer: { position: 'relative', zIndex: 1, textAlign: 'center', paddingTop: 40, borderTop: '1px solid var(--border)', marginTop: 40 },
  footerLogo: { fontFamily: "'Cormorant Garamond', serif", fontSize: 20, letterSpacing: 8, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 6 },
  footerText: { fontSize: 11, color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase' },
};
