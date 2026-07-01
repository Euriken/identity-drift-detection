import React, { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { id: 'hero',         label: 'Home'       },
  { id: 'demo',         label: 'Live Demo'  },
  { id: 'results',      label: 'Benchmarks' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'about',        label: 'About'      },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('hero');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Update active section based on scroll position
      const sections = NAV_ITEMS.map(n => document.getElementById(n.id));
      const current = sections.reduce((acc, sec) => {
        if (!sec) return acc;
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 120) return sec.id;
        return acc;
      }, 'hero');
      setActive(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(2,8,23,0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(59,130,246,0.12)' : 'none',
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => scrollTo('hero')}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #2563eb, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
            👁️
          </div>
          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#f1f5f9', letterSpacing: '-0.01em' }}>
            Identity<span className="gradient-text">Drift</span>
          </span>
        </div>

        {/* Desktop nav */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="desktop-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              style={{
                background: active === item.id ? 'rgba(37,99,235,0.12)' : 'none',
                border: active === item.id ? '1px solid rgba(37,99,235,0.25)' : '1px solid transparent',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: '0.83rem',
                fontWeight: 500,
                color: active === item.id ? '#60a5fa' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={e => { if (active !== item.id) e.currentTarget.style.color = '#f1f5f9'; }}
              onMouseLeave={e => { if (active !== item.id) e.currentTarget.style.color = '#94a3b8'; }}
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={() => scrollTo('demo')}
            className="btn-primary"
            style={{ padding: '7px 18px', fontSize: '0.83rem', marginLeft: 8 }}
          >
            Try Demo →
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.4rem', display: 'none' }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>

      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div style={{ background: 'rgba(2,8,23,0.95)', borderTop: '1px solid rgba(59,130,246,0.12)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              style={{ background: 'none', border: 'none', color: active === item.id ? '#60a5fa' : '#94a3b8', padding: '10px 0', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter, sans-serif' }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 720px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
