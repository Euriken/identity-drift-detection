import React from 'react';

const TEAM = [
  {
    name: 'Devansh Goel',
    initials: 'DG',
    role: 'Full-Stack Development & System Design',
    color: '#22d3ee',
    bg: 'rgba(34,211,238,0.15)',
    border: 'rgba(34,211,238,0.3)',
  },
  {
    name: 'Harshinder Singh',
    initials: 'HS',
    role: 'Model Integration & ONNX Pipeline',
    color: '#60a5fa',
    bg: 'rgba(37,99,235,0.15)',
    border: 'rgba(37,99,235,0.3)',
  },
  {
    name: 'Gyan Sharma',
    initials: 'GS',
    role: 'Dataset Evaluation & Benchmarking',
    color: '#818cf8',
    bg: 'rgba(99,102,241,0.15)',
    border: 'rgba(99,102,241,0.3)',
  },
  {
    name: 'Siddhant Nirwal',
    initials: 'SN',
    role: 'Research, Embedding Analysis & Visualization',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.15)',
    border: 'rgba(167,139,250,0.3)',
  },
];

const TECH_STACK = [
  { name: 'ArcFace',      tag: 'Face Recognition Model',   icon: '🧠', color: '#60a5fa' },
  { name: 'InsightFace',  tag: 'buffalo_l / w600k_r50',    icon: '👁️',  color: '#818cf8' },
  { name: 'ONNX Runtime', tag: 'CPU Inference Engine',     icon: '⚙️',  color: '#22d3ee' },
  { name: 'Flask',        tag: 'Python REST API',          icon: '🐍',  color: '#34d399' },
  { name: 'React + Vite', tag: 'Frontend Framework',       icon: '⚛️',  color: '#60a5fa' },
  { name: 'Tailwind CSS', tag: 'UI Styling',               icon: '🎨',  color: '#a78bfa' },
  { name: 'Chart.js',     tag: 'Data Visualization',       icon: '📊',  color: '#fbbf24' },
  { name: 'NumPy',        tag: 'Numerical Computing',      icon: '🔢',  color: '#f43f5e' },
];

export default function AboutSection() {
  return (
    <section id="about" style={{ padding: '100px 0', background: 'rgba(10,22,40,0.4)' }}>
      <div className="orb" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)', top: '10%', right: '10%', pointerEvents: 'none' }} />

      <div className="section-wrapper">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'inline-block', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 999, padding: '5px 16px', fontSize: '0.75rem', fontWeight: 600, color: '#fbbf24', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
            About the Project
          </div>
          <h2 className="section-title gradient-text" style={{ marginBottom: 14 }}>Meet the Team</h2>
          <p className="section-subtitle" style={{ maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Built as a major project at <strong style={{ color: '#f1f5f9' }}>ABES Institute of Technology, Ghaziabad</strong> for the academic year 2025–26.
          </p>
        </div>

        {/* Team cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20, marginBottom: 64 }}>
          {TEAM.map((member, i) => (
            <div
              key={i}
              className="glass-card glass-card-hover animate-fadeInUp"
              style={{ padding: 28, textAlign: 'center', animationDelay: `${i * 0.1}s` }}
            >
              {/* Avatar */}
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: member.bg,
                border: `2px solid ${member.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '1.3rem', fontWeight: 800, color: member.color,
                fontFamily: 'Inter, sans-serif',
                boxShadow: `0 0 30px ${member.bg}`,
              }}>
                {member.initials}
              </div>

              {/* Name */}
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>{member.name}</div>

              {/* Role */}
              <div style={{ fontSize: '0.78rem', color: member.color, fontWeight: 500, lineHeight: 1.5 }}>{member.role}</div>
            </div>
          ))}
        </div>

        {/* Project info banner */}
        <div className="glass-card" style={{ padding: '32px 40px', marginBottom: 40, background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(99,102,241,0.08) 100%)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {[
              { label: 'Institution',    value: 'ABES Institute of Technology', sub: 'Ghaziabad, Uttar Pradesh' },
              { label: 'Academic Year',  value: '2025–2026',                    sub: 'B.Tech Major Project' },
              { label: 'Department',     value: 'Computer Science',             sub: 'Artificial Intelligence & ML' },
              { label: 'Project Type',   value: 'Research & Development',       sub: 'Face Biometric Security' },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ fontSize: '0.68rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 3 }}>{item.value}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20, textAlign: 'center' }}>Technology Stack</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {TECH_STACK.map((tech, i) => (
              <div
                key={i}
                className="animate-fadeInUp"
                style={{
                  background: 'rgba(15,34,64,0.5)',
                  border: '1px solid rgba(59,130,246,0.1)',
                  borderRadius: 10,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  animationDelay: `${i * 0.05}s`,
                  transition: 'border-color 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `rgba(${tech.color.slice(1).match(/.{2}/g).map(h => parseInt(h,16)).join(',')},0.4)`}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.1)'}
              >
                <span style={{ fontSize: '1.2rem' }}>{tech.icon}</span>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: tech.color }}>{tech.name}</div>
                  <div style={{ fontSize: '0.65rem', color: '#475569' }}>{tech.tag}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 80, paddingTop: 32, borderTop: '1px solid rgba(59,130,246,0.1)' }}>
          <div className="gradient-text" style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>
            Identity Drift Detection in Face Recognition Systems
          </div>
          <div style={{ color: '#475569', fontSize: '0.8rem' }}>
            ABES Institute of Technology, Ghaziabad · 2025–26 · Built with ArcFace + ONNX Runtime
          </div>
        </div>

      </div>
    </section>
  );
}
