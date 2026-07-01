import React, { useEffect, useRef } from 'react';

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 5,
  duration: Math.random() * 10 + 8,
}));

export default function HeroSection() {
  return (
    <section
      id="hero"
      style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '100px 24px 60px' }}
    >
      {/* Background gradient orbs */}
      <div className="orb" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)', top: '-10%', left: '-15%', animationDuration: '12s' }} />
      <div className="orb" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)', bottom: '5%', right: '-10%', animationDuration: '10s', animationDelay: '-4s' }} />
      <div className="orb" style={{ width: 300, height: 300, background: 'radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 70%)', top: '40%', left: '60%', animationDuration: '9s', animationDelay: '-2s' }} />

      {/* Floating particles */}
      {PARTICLES.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: `rgba(${p.id % 2 === 0 ? '96,165,250' : '129,140,248'}, 0.5)`,
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 860 }}>
        {/* Badge */}
        <div className="animate-fadeInUp" style={{ animationDelay: '0s', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 999, padding: '6px 18px', marginBottom: 32, fontSize: '0.8rem', fontWeight: 600, color: '#93c5fd', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3ee', display: 'inline-block', animation: 'pulse-glow 1.5s ease-in-out infinite' }} />
          Major Project · ABES Institute of Technology · 2025–26
        </div>

        {/* Title */}
        <h1 className="animate-fadeInUp gradient-text" style={{ animationDelay: '0.1s', fontSize: 'clamp(2.2rem, 6vw, 4.2rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 28, letterSpacing: '-0.02em' }}>
          Identity Drift Detection
          <br />
          <span style={{ fontSize: '0.7em', fontWeight: 700, color: '#94a3b8', WebkitTextFillColor: '#94a3b8' }}>in Face Recognition Systems</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fadeInUp" style={{ animationDelay: '0.2s', fontSize: '1.15rem', color: '#94a3b8', lineHeight: 1.8, marginBottom: 48, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
          A research system that detects when a person's facial identity has drifted significantly from a stored reference — using <strong style={{ color: '#60a5fa' }}>ArcFace embeddings</strong>, <strong style={{ color: '#60a5fa' }}>cosine dissimilarity</strong>, and an empirically calibrated threshold of <strong style={{ color: '#fbbf24' }}>0.65</strong> to trigger re-enrollment.
        </p>

        {/* CTA buttons */}
        <div className="animate-fadeInUp" style={{ animationDelay: '0.3s', display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#demo" className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>
            Try Live Demo →
          </a>
          <a href="#results" style={{ padding: '14px 36px', fontSize: '1rem', fontWeight: 600, color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 10, textDecoration: 'none', transition: 'all 0.3s ease', display: 'inline-block', background: 'rgba(37,99,235,0.06)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)'; e.currentTarget.style.background = 'rgba(37,99,235,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; e.currentTarget.style.background = 'rgba(37,99,235,0.06)'; }}>
            View Benchmarks
          </a>
        </div>

        {/* Stats strip */}
        <div className="animate-fadeInUp stagger" style={{ animationDelay: '0.4s', marginTop: 72, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, maxWidth: 800, marginLeft: 'auto', marginRight: 'auto' }}>
          {[
            { label: 'LFW Accuracy',    value: '99.67%', color: '#34d399' },
            { label: 'CALFW Accuracy',  value: '94.02%', color: '#60a5fa' },
            { label: 'AgeDB-30',        value: '92.68%', color: '#818cf8' },
            { label: 'Drift Threshold', value: '0.65',   color: '#fbbf24' },
          ].map((s, i) => (
            <div key={i} className="animate-fadeInUp glass-card" style={{ padding: '20px 12px', textAlign: 'center', borderRadius: i === 0 ? '12px 0 0 12px' : i === 3 ? '0 12px 12px 0' : 0, borderRight: i < 3 ? '1px solid rgba(59,130,246,0.1)' : undefined }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: '#475569', fontSize: '0.75rem', fontWeight: 500 }}>
        <span>Scroll to explore</span>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, #2563eb, transparent)' }} />
      </div>
    </section>
  );
}
