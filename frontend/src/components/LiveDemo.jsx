import React, { useState, useRef, useCallback } from 'react';

// ── Sample pairs ──────────────────────────────────────────────────────────────
const SAMPLE_PAIRS = [
  {
    id: 'age-drift',
    label: 'Same Person · Age Drift',
    emoji: '👴',
    tag: 'High Drift — Re-enrollment Expected',
    tagColor: '#f43f5e',
    description: 'Same person, 30-year age gap. Tests temporal drift from aging.',
    file1: 'same_young.jpg',
    file2: 'same_old.jpg',
    border: 'rgba(244,63,94,0.3)',
    bg: 'rgba(244,63,94,0.08)',
  },
  {
    id: 'different',
    label: 'Different People',
    emoji: '👥',
    tag: 'Very High Drift — Distinct Identities',
    tagColor: '#f43f5e',
    description: 'Two completely different people. Should produce maximum drift.',
    file1: 'different_1.jpg',
    file2: 'different_2.jpg',
    border: 'rgba(251,191,36,0.3)',
    bg: 'rgba(251,191,36,0.08)',
  },
  {
    id: 'stable',
    label: 'Same Person · Similar Photos',
    emoji: '✅',
    tag: 'Low Drift — Stable Identity',
    tagColor: '#34d399',
    description: 'Same person, different outfit. Should produce low drift score.',
    file1: 'same_similar.jpg',
    file2: 'same_similar2.jpg',
    border: 'rgba(52,211,153,0.3)',
    bg: 'rgba(52,211,153,0.08)',
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function UploadZone({ label, icon, preview, onFile, id }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) onFile(file);
  }, [onFile]);

  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#93c5fd', marginBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
      <div
        className={`upload-zone${dragging ? ' dragover' : ''}`}
        style={{ minHeight: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16, position: 'relative', overflow: 'hidden' }}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <>
            <img src={preview} alt="preview" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 10 }} />
            <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(37,99,235,0.9)', color: 'white', fontSize: '0.7rem', padding: '3px 10px', borderRadius: 999, fontWeight: 600 }}>
              Change
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500, textAlign: 'center' }}>
              Drop image here or <span style={{ color: '#60a5fa' }}>browse</span>
            </div>
            <div style={{ color: '#475569', fontSize: '0.73rem', marginTop: 6 }}>JPG, PNG, WEBP</div>
          </>
        )}
        <input ref={inputRef} id={id} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      </div>
    </div>
  );
}

function DriftMeter({ drift }) {
  const pct = Math.min(1, Math.max(0, drift)) * 100;
  let color;
  if (drift < 0.3) color = 'linear-gradient(90deg, #059669, #34d399)';
  else if (drift < 0.65) color = 'linear-gradient(90deg, #d97706, #fbbf24)';
  else color = 'linear-gradient(90deg, #be123c, #f43f5e)';

  return (
    <div style={{ marginBottom: 20 }}>
      <div className="drift-meter-track">
        <div className="drift-meter-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, paddingLeft: 2, paddingRight: 2 }}>
        {['0', '0.2', '0.4', '0.65', '0.8', '1.0'].map((v, i) => (
          <span key={i} style={{ fontSize: '0.65rem', color: '#475569' }}>{v}</span>
        ))}
      </div>
      {/* threshold marker */}
      <div style={{ position: 'relative', height: 16 }}>
        <div style={{ position: 'absolute', left: '65%', top: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translateX(-50%)' }}>
          <div style={{ width: 1, height: 8, background: '#f43f5e' }} />
          <span style={{ fontSize: '0.6rem', color: '#f43f5e', whiteSpace: 'nowrap', fontWeight: 600 }}>threshold</span>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <span style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'JetBrains Mono, monospace', background: color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {drift.toFixed(4)}
        </span>
      </div>
    </div>
  );
}

// ── Compute verdict from drift + threshold ────────────────────────────────────
function computeVerdict(drift, threshold) {
  if (drift > threshold) return { zone: 'critical', verdict: 'Re-enrollment Recommended', emoji: '🔴', cls: 'verdict-critical' };
  if (drift > 0.3)       return { zone: 'moderate', verdict: 'Moderate Drift Detected',  emoji: '⚠️', cls: 'verdict-moderate' };
  return                        { zone: 'stable',   verdict: 'Identity Stable',           emoji: '✅', cls: 'verdict-stable'   };
}

// ── Main component ────────────────────────────────────────────────────────────
export default function LiveDemo() {
  const [file1,    setFile1]    = useState(null);
  const [file2,    setFile2]    = useState(null);
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState(null);
  const [loadingSample, setLoadingSample] = useState(null);

  // Threshold slider state — default 0.65
  const [threshold, setThreshold] = useState(0.65);

  const handleFile = (setter, previewSetter) => (file) => {
    setter(file);
    previewSetter(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  // ── Load a sample pair ──────────────────────────────────────────────────────
  const loadSample = async (pair) => {
    setLoadingSample(pair.id);
    setResult(null);
    setError(null);
    try {
      const [r1, r2] = await Promise.all([
        fetch(`/samples/${pair.file1}`),
        fetch(`/samples/${pair.file2}`),
      ]);
      const [b1, b2] = await Promise.all([r1.blob(), r2.blob()]);
      const f1 = new File([b1], pair.file1, { type: 'image/jpeg' });
      const f2 = new File([b2], pair.file2, { type: 'image/jpeg' });
      setFile1(f1);   setPreview1(URL.createObjectURL(b1));
      setFile2(f2);   setPreview2(URL.createObjectURL(b2));
    } catch {
      setError('Failed to load sample images.');
    } finally {
      setLoadingSample(null);
    }
  };

  // ── Compare ─────────────────────────────────────────────────────────────────
  const handleCompare = async () => {
    if (!file1 || !file2) { setError('Please upload both face images.'); return; }
    setLoading(true);
    setResult(null);
    setError(null);

    const form = new FormData();
    form.append('image1', file1);
    form.append('image2', file2);

    try {
      const res  = await fetch('/compare', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');
      setResult(data);
      setThreshold(data.threshold ?? 0.65); // sync slider to backend threshold
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Live verdict from slider ─────────────────────────────────────────────
  const live = result ? computeVerdict(result.drift, threshold) : null;

  return (
    <section id="demo" style={{ padding: '100px 0', position: 'relative' }}>
      <div className="orb" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', top: '20%', right: '-5%', pointerEvents: 'none' }} />

      <div className="section-wrapper">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 999, padding: '5px 16px', fontSize: '0.75rem', fontWeight: 600, color: '#818cf8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
            Interactive Demo
          </div>
          <h2 className="section-title gradient-text" style={{ marginBottom: 14 }}>Live Face Comparison</h2>
          <p className="section-subtitle" style={{ maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Upload two face images — or pick a sample pair below — to compute the drift score using ArcFace. Drift &gt; 0.65 triggers re-enrollment.
          </p>
        </div>

        {/* ── Sample pair buttons ─────────────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, textAlign: 'center' }}>
            Quick start with sample pairs
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {SAMPLE_PAIRS.map(pair => (
              <button
                key={pair.id}
                id={`sample-${pair.id}`}
                onClick={() => loadSample(pair)}
                disabled={!!loadingSample}
                style={{
                  background: pair.bg,
                  border: `1px solid ${pair.border}`,
                  borderRadius: 12,
                  padding: '14px 16px',
                  textAlign: 'left',
                  cursor: loadingSample ? 'wait' : 'pointer',
                  transition: 'all 0.25s ease',
                  fontFamily: 'Inter, sans-serif',
                  opacity: loadingSample && loadingSample !== pair.id ? 0.5 : 1,
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${pair.bg}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: '1.2rem' }}>{pair.emoji}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9' }}>
                    {loadingSample === pair.id ? 'Loading…' : pair.label}
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: 600, color: pair.tagColor, marginBottom: 4 }}>{pair.tag}</div>
                <div style={{ fontSize: '0.68rem', color: '#475569', lineHeight: 1.5 }}>{pair.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Upload card ─────────────────────────────────────────────────── */}
        <div className="glass-card" style={{ padding: 36, marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <UploadZone id="ref-upload" label="Reference Face" icon="🧑" preview={preview1} onFile={handleFile(setFile1, setPreview1)} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0 8px' }}>
              <div style={{ width: 1, flex: 1, background: 'rgba(59,130,246,0.15)' }} />
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#60a5fa' }}>VS</div>
              <div style={{ width: 1, flex: 1, background: 'rgba(59,130,246,0.15)' }} />
            </div>
            <UploadZone id="cur-upload" label="Current Face" icon="🧑‍💼" preview={preview2} onFile={handleFile(setFile2, setPreview2)} />
          </div>

          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <button id="compare-btn" className="btn-primary" onClick={handleCompare}
              disabled={loading || !file1 || !file2} style={{ padding: '14px 48px', fontSize: '1rem' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin-slow 0.8s linear infinite' }} />
                  Running Inference…
                </span>
              ) : 'Compare Faces'}
            </button>
          </div>

          {error && (
            <div style={{ marginTop: 20, padding: '12px 20px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 10, color: '#f43f5e', fontSize: '0.875rem', textAlign: 'center' }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* ── Results card ────────────────────────────────────────────────── */}
        {result && live && (
          <div className="glass-card animate-scaleIn" style={{ padding: 36 }}>
            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start' }}>

              {/* Left: Drift meter + verdict + explanation */}
              <div style={{ flex: 2, minWidth: 280 }}>
                <DriftMeter drift={result.drift} />

                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <span className={`verdict-badge ${live.cls}`}>
                    {live.emoji} {live.verdict}
                  </span>
                </div>

                {/* ── Threshold Slider ──────────────────────────────────── */}
                <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 20, background: 'rgba(10,22,40,0.4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Threshold Slider
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', color: '#fbbf24' }}>
                      {threshold.toFixed(2)}
                    </span>
                  </div>
                  <input
                    id="threshold-slider"
                    type="range"
                    min="0.30"
                    max="0.90"
                    step="0.01"
                    value={threshold}
                    onChange={e => setThreshold(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: '#fbbf24', cursor: 'pointer', height: 4 }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: '0.65rem', color: '#475569' }}>0.30 (strict)</span>
                    <span style={{ fontSize: '0.65rem', color: '#475569' }}>0.90 (lenient)</span>
                  </div>
                  <div style={{ marginTop: 10, fontSize: '0.75rem', color: '#64748b', lineHeight: 1.6 }}>
                    Drag to see how different threshold choices affect the verdict in real-time. The empirically calibrated value is <strong style={{ color: '#fbbf24' }}>0.65</strong>.
                  </div>
                </div>

                {/* Explanation */}
                <div style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(59,130,246,0.12)', borderRadius: 10, padding: '14px 18px', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.7 }}>
                  {live.zone === 'stable'
                    ? '✅ The two faces are highly similar. The identity is stable — no re-enrollment needed.'
                    : live.zone === 'moderate'
                    ? '⚠️ Moderate drift detected. This may be due to lighting, pose, or minor aging. Monitor over time.'
                    : '🔴 Significant identity drift detected. Drift exceeds the threshold. Re-enrollment is recommended.'}
                </div>
              </div>

              {/* Right: Metrics */}
              <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Cosine Similarity', value: result.similarity.toFixed(4), color: '#60a5fa', note: '(higher = more similar)' },
                  { label: 'Drift Score',        value: result.drift.toFixed(4),       color: live.zone === 'stable' ? '#34d399' : live.zone === 'moderate' ? '#fbbf24' : '#f43f5e', note: '(1 − similarity)' },
                  { label: 'Active Threshold',   value: threshold.toFixed(2),           color: '#fbbf24', note: '(drag slider to adjust)' },
                  { label: 'Decision',           value: result.drift > threshold ? 'FLAGGED' : 'CLEAR', color: result.drift > threshold ? '#f43f5e' : '#34d399', note: result.drift > threshold ? 'Re-enrollment needed' : 'Identity verified' },
                ].map((m, i) => (
                  <div key={i} style={{ background: 'rgba(15,34,64,0.5)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{m.label}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', color: m.color, transition: 'color 0.3s' }}>{m.value}</div>
                    <div style={{ fontSize: '0.68rem', color: '#475569', marginTop: 3 }}>{m.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
