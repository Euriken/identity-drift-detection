import React, { useState } from 'react';
import Modal from './Modal.jsx';

// ── Team data ─────────────────────────────────────────────────────────────────
const TEAM = [
  {
    name: 'Devansh Goel',
    enrollment: '2302900100082',
    initials: 'DG',
    color: '#22d3ee',
    bg: 'rgba(34,211,238,0.15)',
    border: 'rgba(34,211,238,0.3)',
    projectRole: 'Backend API development, drift computation logic, and deployment',
    fullRole: 'Led the end-to-end system design — built the Flask API (/compare, /results), integrated ONNX Runtime for ArcFace inference, calibrated the 0.65 drift threshold from AgeDB-30 analysis, and deployed the full-stack application.',
    email: 'devanshgoel@abesit.edu.in',
    linkedin: 'https://linkedin.com/in/devansh-goel',
    github: 'https://github.com/Euriken',
    resume: '#',
  },
  {
    name: 'Harshinder Singh',
    enrollment: '2302900100095',
    initials: 'HS',
    color: '#60a5fa',
    bg: 'rgba(37,99,235,0.15)',
    border: 'rgba(37,99,235,0.3)',
    projectRole: 'Dataset preparation and annotation file parsing',
    fullRole: 'Prepared and validated all four benchmark datasets (LFW, CALFW, AgeDB-30, CPLFW), wrote annotation file parsers, handled image path resolution, and ensured data quality across 24,000+ face pairs.',
    email: 'harshinder@abesit.edu.in',
    linkedin: 'https://linkedin.com/in/harshinder-singh',
    github: 'https://github.com/harshinder',
    resume: '#',
  },
  {
    name: 'Gyan Sharma',
    enrollment: '2302900100090',
    initials: 'GS',
    color: '#818cf8',
    bg: 'rgba(99,102,241,0.15)',
    border: 'rgba(99,102,241,0.3)',
    projectRole: 'Model integration and ONNX inference pipeline',
    fullRole: 'Integrated the InsightFace buffalo_l model into the Python pipeline, implemented the embedding extraction workflow (preprocessing → inference → L2 normalisation), and optimised batch processing for all benchmark datasets.',
    email: 'gyansharma@abesit.edu.in',
    linkedin: 'https://linkedin.com/in/gyan-sharma',
    github: 'https://github.com/gyansharma',
    resume: '#',
  },
  {
    name: 'Siddhant Nirwal',
    enrollment: '2302900100229',
    initials: 'SN',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.15)',
    border: 'rgba(167,139,250,0.3)',
    projectRole: 'Frontend development and visualization',
    fullRole: 'Built the React + Vite frontend — designed the live demo interface, drift score visualisations, benchmark charts, and the How It Works pipeline. Implemented the Chart.js histogram and interactive slider components.',
    email: 'siddhant@abesit.edu.in',
    linkedin: 'https://linkedin.com/in/siddhant-nirwal',
    github: 'https://github.com/siddhant-nirwal',
    resume: '#',
  },
];

// ── Tech stack data ───────────────────────────────────────────────────────────
const TECH_STACK = [
  {
    name: 'ArcFace',
    tag: 'Face Recognition Model',
    icon: '🧠',
    color: '#60a5fa',
    bg: 'rgba(37,99,235,0.12)',
    description: 'State-of-the-art face recognition model trained on 600k identities. Uses Additive Angular Margin Loss (ArcFace loss) to produce highly discriminative 512-dimensional facial embeddings. We use the w600k_r50.onnx variant — ResNet-50 backbone trained on the WebFace600K dataset.',
    role: 'Core recognition engine that converts every face image into a 512-dimensional embedding vector used for drift computation.',
    learnMore: 'https://arxiv.org/abs/1801.07698',
  },
  {
    name: 'InsightFace',
    tag: 'buffalo_l / w600k_r50',
    icon: '👁️',
    color: '#818cf8',
    bg: 'rgba(99,102,241,0.12)',
    description: 'Open-source 2D & 3D face analysis library providing pre-trained models including the buffalo_l model pack. Contains both the ArcFace recognition model (w600k_r50.onnx) and the SCRFD face detector (det_10g.onnx).',
    role: 'Provides the pre-trained model weights and the SCRFD face detector used for input validation before inference.',
    learnMore: 'https://github.com/deepinsight/insightface',
  },
  {
    name: 'ONNX Runtime',
    tag: 'CPU Inference Engine',
    icon: '⚙️',
    color: '#22d3ee',
    bg: 'rgba(34,211,238,0.12)',
    description: 'Open Neural Network Exchange runtime that allows running pre-trained models directly without needing the original training framework (PyTorch, TensorFlow, etc.). Enables fast CPU inference on Apple M1 Mac without any GPU dependency.',
    role: 'Runs both the ArcFace recognition model and the SCRFD face detector at runtime with CPUExecutionProvider.',
    learnMore: 'https://onnxruntime.ai/',
  },
  {
    name: 'Flask',
    tag: 'Python REST API',
    icon: '🐍',
    color: '#34d399',
    bg: 'rgba(52,211,153,0.12)',
    description: 'Lightweight Python web framework powering our backend API. Flask handles two core endpoints: /compare for real-time drift computation and /results for benchmark data. Also serves the built React frontend in production mode.',
    role: 'REST API server — exposes /compare (ONNX inference + drift score), /results (benchmark stats + histogram), and /health (status check).',
    learnMore: 'https://flask.palletsprojects.com/',
  },
  {
    name: 'React + Vite',
    tag: 'Frontend Framework',
    icon: '⚛️',
    color: '#60a5fa',
    bg: 'rgba(37,99,235,0.12)',
    description: 'React 19 for component-based UI development and Vite 8 for lightning-fast HMR builds. Vite proxies API calls to Flask during development, enabling seamless full-stack development without CORS configuration.',
    role: 'Handles all frontend interactions — image upload, live demo comparison, benchmark charts, interactive modals, and the threshold slider.',
    learnMore: 'https://vitejs.dev/',
  },
  {
    name: 'Tailwind CSS',
    tag: 'UI Styling',
    icon: '🎨',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.12)',
    description: 'Utility-first CSS framework (v4 via @tailwindcss/vite) used alongside custom CSS for all styling. Enables rapid UI development with a consistent navy/indigo design system throughout the app, including glassmorphism effects.',
    role: 'Provides the base styling layer; custom CSS classes in index.css build on Tailwind for glassmorphism cards, drift meter animations, and gradient text.',
    learnMore: 'https://tailwindcss.com/',
  },
  {
    name: 'Chart.js',
    tag: 'Data Visualization',
    icon: '📊',
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.12)',
    description: 'Used via react-chartjs-2 to render two visualizations: a grouped bar chart comparing accuracy vs stability index across datasets, and an area chart showing the genuine/impostor drift score distribution for AgeDB-30.',
    role: 'Powers the benchmark visualisations — accuracy/stability bar chart and the AgeDB-30 drift distribution histogram with a custom threshold line plugin.',
    learnMore: 'https://www.chartjs.org/',
  },
  {
    name: 'NumPy',
    tag: 'Numerical Computing',
    icon: '🔢',
    color: '#f43f5e',
    bg: 'rgba(244,63,94,0.12)',
    description: 'Used for all mathematical operations in the backend — L2 normalization of embedding vectors, cosine similarity computation via dot product of unit vectors, histogram binning for benchmark analysis, and loading precomputed .npy result files.',
    role: 'Mathematical backbone — every drift score computed in the app goes through NumPy: emb / np.linalg.norm(emb) → np.dot(e1, e2) → 1 − similarity.',
    learnMore: 'https://numpy.org/',
  },
];

// ── Team Profile Modal ────────────────────────────────────────────────────────
function TeamModal({ member, onClose }) {
  if (!member) return null;
  return (
    <Modal isOpen={!!member} onClose={onClose} maxWidth={480}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: member.bg, border: `2px solid ${member.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.3rem', fontWeight: 800, color: member.color,
          flexShrink: 0, boxShadow: `0 0 24px ${member.bg}`,
        }}>
          {member.initials}
        </div>
        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f1f5f9' }}>{member.name}</div>
          <div style={{ fontSize: '0.75rem', color: '#475569', fontFamily: 'JetBrains Mono, monospace', marginTop: 3 }}>
            Enrollment: {member.enrollment}
          </div>
          <div style={{ fontSize: '0.75rem', color: member.color, fontWeight: 600, marginTop: 2 }}>
            ABES Institute of Technology · 2025–26
          </div>
        </div>
      </div>

      {/* Role */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Role in Project</div>
        <div style={{ background: `${member.bg}`, border: `1px solid ${member.border}`, borderRadius: 10, padding: '12px 16px', fontSize: '0.875rem', color: '#e2e8f0', lineHeight: 1.7 }}>
          {member.fullRole}
        </div>
      </div>

      {/* Contact icons row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          {
            label: 'Email',
            icon: '✉️',
            href: `mailto:${member.email}`,
            display: member.email,
            color: '#34d399',
            bg: 'rgba(52,211,153,0.1)',
            border: 'rgba(52,211,153,0.25)',
          },
          {
            label: 'LinkedIn',
            icon: '💼',
            href: member.linkedin,
            display: 'LinkedIn',
            color: '#60a5fa',
            bg: 'rgba(37,99,235,0.1)',
            border: 'rgba(37,99,235,0.25)',
          },
          {
            label: 'GitHub',
            icon: '🐙',
            href: `https://${member.github.replace('https://', '')}`,
            display: 'GitHub',
            color: '#818cf8',
            bg: 'rgba(99,102,241,0.1)',
            border: 'rgba(99,102,241,0.25)',
          },
        ].map((link, i) => (
          <a
            key={i}
            href={link.href}
            target={link.label !== 'Email' ? '_blank' : undefined}
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: link.bg, border: `1px solid ${link.border}`,
              borderRadius: 8, padding: '8px 14px',
              fontSize: '0.78rem', fontWeight: 600, color: link.color,
              textDecoration: 'none', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
          >
            <span>{link.icon}</span>
            <span>{link.display}</span>
          </a>
        ))}
      </div>

      {/* Resume button */}
      <a
        href={member.resume}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
        style={{ display: 'block', textAlign: 'center', padding: '11px 24px', fontSize: '0.875rem', textDecoration: 'none', borderRadius: 10 }}
      >
        📄 View Resume
      </a>
    </Modal>
  );
}

// ── Tech Stack Modal ──────────────────────────────────────────────────────────
function TechModal({ tech, onClose }) {
  if (!tech) return null;
  return (
    <Modal isOpen={!!tech} onClose={onClose} maxWidth={480}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 52, height: 52, borderRadius: 12, background: tech.bg, border: `1px solid ${tech.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
          {tech.icon}
        </div>
        <div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: tech.color }}>{tech.name}</div>
          <div style={{ fontSize: '0.73rem', color: '#475569', fontWeight: 600, marginTop: 2 }}>{tech.tag}</div>
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>About</div>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.8 }}>{tech.description}</p>
      </div>

      {/* Role in project */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Role in This Project</div>
        <div style={{ background: tech.bg, border: `1px solid ${tech.color}33`, borderRadius: 10, padding: '12px 16px', fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.7 }}>
          {tech.role}
        </div>
      </div>

      {/* Learn more */}
      <a
        href={tech.learnMore}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: tech.bg, border: `1px solid ${tech.color}55`,
          borderRadius: 10, padding: '10px 20px',
          fontSize: '0.85rem', fontWeight: 700, color: tech.color,
          textDecoration: 'none', transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${tech.bg}`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        🔗 Learn More — Official Docs
      </a>
    </Modal>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AboutSection() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedTech,   setSelectedTech]   = useState(null);

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
            <br />
            <span style={{ fontSize: '0.82rem', color: '#475569' }}>Click any card for full profile →</span>
          </p>
        </div>

        {/* Team cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20, marginBottom: 64 }}>
          {TEAM.map((member, i) => (
            <div
              key={i}
              id={`team-${member.initials.toLowerCase()}`}
              className="glass-card glass-card-hover animate-fadeInUp"
              onClick={() => setSelectedMember(member)}
              style={{ padding: 28, textAlign: 'center', animationDelay: `${i * 0.1}s`, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
            >
              {/* "Click to view" hint */}
              <div style={{ position: 'absolute', top: 10, right: 10, fontSize: '0.6rem', color: '#334155', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                View Profile →
              </div>

              {/* Avatar */}
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: member.bg, border: `2px solid ${member.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.3rem', fontWeight: 800, color: member.color, boxShadow: `0 0 30px ${member.bg}` }}>
                {member.initials}
              </div>

              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{member.name}</div>
              <div style={{ fontSize: '0.68rem', color: '#475569', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>{member.enrollment}</div>
              <div style={{ fontSize: '0.78rem', color: member.color, fontWeight: 500, lineHeight: 1.5 }}>{member.projectRole}</div>

              {/* Quick icon links (stop propagation to not open modal) */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
                {[
                  { href: `mailto:${member.email}`, icon: '✉️', label: 'Email' },
                  { href: member.linkedin, icon: '💼', label: 'LinkedIn' },
                  { href: `https://${member.github.replace('https://', '')}`, icon: '🐙', label: 'GitHub' },
                ].map((link, j) => (
                  <a
                    key={j}
                    href={link.href}
                    target={link.label !== 'Email' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    title={link.label}
                    onClick={e => e.stopPropagation()}
                    style={{
                      width: 32, height: 32,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9rem', textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = member.bg; e.currentTarget.style.borderColor = member.border; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Project info banner */}
        <div className="glass-card" style={{ padding: '32px 40px', marginBottom: 40, background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(99,102,241,0.08) 100%)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {[
              { label: 'Institution',   value: 'ABES Institute of Technology', sub: 'Ghaziabad, Uttar Pradesh' },
              { label: 'Academic Year', value: '2025–2026',                    sub: 'B.Tech Major Project' },
              { label: 'Department',    value: 'Computer Science',             sub: 'Artificial Intelligence & ML' },
              { label: 'Project Type',  value: 'Research & Development',       sub: 'Face Biometric Security' },
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
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, textAlign: 'center' }}>Technology Stack</div>
          <div style={{ fontSize: '0.75rem', color: '#475569', textAlign: 'center', marginBottom: 20 }}>Click any technology for details</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12 }}>
            {TECH_STACK.map((tech, i) => (
              <div
                key={i}
                id={`tech-${tech.name.toLowerCase().replace(/[^a-z]/g, '-')}`}
                className="animate-fadeInUp"
                onClick={() => setSelectedTech(tech)}
                style={{
                  background: 'rgba(15,34,64,0.5)',
                  border: '1px solid rgba(59,130,246,0.1)',
                  borderRadius: 10,
                  padding: '12px 14px',
                  display: 'flex', alignItems: 'center', gap: 10,
                  animationDelay: `${i * 0.05}s`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${tech.color}66`;
                  e.currentTarget.style.background = tech.bg;
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${tech.bg}`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(59,130,246,0.1)';
                  e.currentTarget.style.background = 'rgba(15,34,64,0.5)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{tech.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: tech.color }}>{tech.name}</div>
                  <div style={{ fontSize: '0.62rem', color: '#475569' }}>{tech.tag}</div>
                </div>
                <span style={{ fontSize: '0.6rem', color: '#334155' }}>→</span>
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

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <TeamModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      <TechModal tech={selectedTech}     onClose={() => setSelectedTech(null)} />
    </section>
  );
}
