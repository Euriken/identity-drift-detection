import React from 'react';

const STEPS = [
  {
    icon: '🖼️',
    title: 'Face Image',
    description: 'Two face images are uploaded — a reference (stored) image and a current image.',
    color: '#60a5fa',
    bg: 'rgba(37,99,235,0.12)',
    border: 'rgba(37,99,235,0.25)',
  },
  {
    icon: '🤖',
    title: 'ArcFace Model',
    description: 'InsightFace buffalo_l (w600k_r50.onnx) processes each image: BGR→RGB, resize 112×112, normalize to [−1,1], CHW format.',
    color: '#818cf8',
    bg: 'rgba(99,102,241,0.12)',
    border: 'rgba(99,102,241,0.25)',
  },
  {
    icon: '📐',
    title: '512-dim Embedding',
    description: 'The model outputs a 512-dimensional feature vector per face, then L2-normalized to unit length.',
    color: '#22d3ee',
    bg: 'rgba(34,211,238,0.12)',
    border: 'rgba(34,211,238,0.25)',
  },
  {
    icon: '📊',
    title: 'Cosine Similarity',
    description: 'Since vectors are L2-normalized, cosine similarity = dot product. Range: −1 (opposite) to +1 (identical).',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.12)',
    border: 'rgba(167,139,250,0.25)',
  },
  {
    icon: '📉',
    title: 'Drift Score',
    description: 'Drift = 1 − cosine similarity. Range: 0 (same person) to 2 (fully opposite). A score of 0 means identical faces.',
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.12)',
    border: 'rgba(251,191,36,0.25)',
  },
  {
    icon: '🚦',
    title: 'Decision',
    description: 'If drift > 0.65 (calibrated on AgeDB-30 distribution), the identity is flagged for re-enrollment.',
    color: '#f43f5e',
    bg: 'rgba(244,63,94,0.12)',
    border: 'rgba(244,63,94,0.25)',
  },
];

function StepCard({ step, index, total }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
      {/* Card */}
      <div
        className="animate-fadeInUp"
        style={{
          background: step.bg,
          border: `1px solid ${step.border}`,
          borderRadius: 16,
          padding: '24px 20px',
          width: 170,
          flexShrink: 0,
          animationDelay: `${index * 0.12}s`,
          textAlign: 'center',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'default',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 16px 40px ${step.bg}`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        {/* Step number */}
        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: step.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, opacity: 0.7 }}>
          Step {index + 1}
        </div>

        {/* Icon */}
        <div style={{ fontSize: '2.2rem', marginBottom: 12 }}>{step.icon}</div>

        {/* Title */}
        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: step.color, marginBottom: 10, lineHeight: 1.3 }}>
          {step.title}
        </div>

        {/* Description */}
        <div style={{ fontSize: '0.73rem', color: '#64748b', lineHeight: 1.6 }}>
          {step.description}
        </div>
      </div>

      {/* Connector arrow */}
      {index < total - 1 && (
        <div style={{ display: 'flex', alignItems: 'center', paddingTop: 60, flexShrink: 0 }}>
          <div style={{ width: 32, height: 2, background: `linear-gradient(90deg, ${step.color}, ${STEPS[index+1].color})` }} />
          <div style={{ width: 0, height: 0, borderLeft: `7px solid ${STEPS[index+1].color}`, borderTop: '5px solid transparent', borderBottom: '5px solid transparent' }} />
        </div>
      )}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: '100px 0', position: 'relative' }}>
      <div className="orb" style={{ width: 450, height: 450, background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)', top: '20%', left: '30%', pointerEvents: 'none' }} />

      <div className="section-wrapper">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'inline-block', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 999, padding: '5px 16px', fontSize: '0.75rem', fontWeight: 600, color: '#a78bfa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
            System Architecture
          </div>
          <h2 className="section-title gradient-text" style={{ marginBottom: 14 }}>How It Works</h2>
          <p className="section-subtitle" style={{ maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            A 6-stage pipeline from raw face images to an identity drift decision, powered by ArcFace deep learning embeddings.
          </p>
        </div>

        {/* Pipeline — horizontal scroll on small screens */}
        <div style={{ overflowX: 'auto', paddingBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, minWidth: 'max-content', padding: '0 4px' }}>
            {STEPS.map((step, i) => (
              <StepCard key={i} step={step} index={i} total={STEPS.length} />
            ))}
          </div>
        </div>

        {/* Formula card */}
        <div className="glass-card" style={{ marginTop: 56, padding: '32px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32, alignItems: 'center' }}>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Mathematical Foundation</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>Cosine Dissimilarity as Drift</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.8 }}>
                ArcFace embeddings are trained with additive angular margin loss, making cosine similarity the natural distance metric.
                After L2 normalization, the drift score is simply <code style={{ background: 'rgba(37,99,235,0.1)', padding: '2px 6px', borderRadius: 4, color: '#60a5fa' }}>1 − dot(e₁, e₂)</code>.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { formula: 'ê = e / ‖e‖₂', label: 'L2 Normalization' },
                { formula: 'sim(e₁, e₂) = ê₁ · ê₂', label: 'Cosine Similarity' },
                { formula: 'drift = 1 − sim', label: 'Drift Score' },
                { formula: 'flag ⟺ drift > 0.65', label: 'Re-enrollment Decision' },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', color: '#60a5fa', background: 'rgba(37,99,235,0.08)', padding: '8px 14px', borderRadius: 8, flex: 1, border: '1px solid rgba(37,99,235,0.15)' }}>
                    {f.formula}
                  </div>
                  <div style={{ fontSize: '0.73rem', color: '#475569', whiteSpace: 'nowrap' }}>← {f.label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Model info strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginTop: 24 }}>
          {[
            { label: 'Model', value: 'ArcFace R50' },
            { label: 'Training Set', value: 'WebFace600K' },
            { label: 'Embedding Dim', value: '512' },
            { label: 'Input Size', value: '112 × 112' },
            { label: 'Threshold', value: '0.65' },
            { label: 'Backend', value: 'ONNX Runtime' },
          ].map((item, i) => (
            <div key={i} style={{ background: 'rgba(15,34,64,0.4)', border: '1px solid rgba(59,130,246,0.08)', borderRadius: 10, padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#93c5fd', fontFamily: 'JetBrains Mono, monospace' }}>{item.value}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
