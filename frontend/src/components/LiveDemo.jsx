import React, { useState, useRef, useCallback } from 'react';

const API_BASE = '';  // proxied via vite → localhost:5000

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
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }}
        />
      </div>
    </div>
  );
}

function DriftMeter({ drift }) {
  const pct = Math.min(1, Math.max(0, drift)) * 100;
  let color, label;
  if (drift < 0.3) {
    color = 'linear-gradient(90deg, #059669, #34d399)';
    label = 'Low Drift';
  } else if (drift < 0.65) {
    color = 'linear-gradient(90deg, #d97706, #fbbf24)';
    label = 'Moderate Drift';
  } else {
    color = 'linear-gradient(90deg, #be123c, #f43f5e)';
    label = 'High Drift';
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Drift Score</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>{label}</span>
      </div>

      {/* Track */}
      <div className="drift-meter-track">
        <div className="drift-meter-fill" style={{ width: `${pct}%`, background: color }} />
      </div>

      {/* Tick marks */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, paddingLeft: 2, paddingRight: 2 }}>
        {['0', '0.2', '0.4', '0.65', '0.8', '1.0'].map((v, i) => (
          <span key={i} style={{ fontSize: '0.65rem', color: '#475569' }}>{v}</span>
        ))}
      </div>

      {/* Threshold marker */}
      <div style={{ position: 'relative', height: 16, marginTop: 4 }}>
        <div style={{ position: 'absolute', left: '65%', top: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translateX(-50%)' }}>
          <div style={{ width: 1, height: 8, background: '#f43f5e' }} />
          <span style={{ fontSize: '0.6rem', color: '#f43f5e', whiteSpace: 'nowrap', fontWeight: 600 }}>threshold</span>
        </div>
      </div>

      {/* Big number */}
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <span style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'JetBrains Mono, monospace', background: color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {drift.toFixed(4)}
        </span>
      </div>
    </div>
  );
}

export default function LiveDemo() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFile = (setter, previewSetter) => (file) => {
    setter(file);
    previewSetter(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleCompare = async () => {
    if (!file1 || !file2) { setError('Please upload both face images.'); return; }
    setLoading(true);
    setResult(null);
    setError(null);

    const form = new FormData();
    form.append('image1', file1);
    form.append('image2', file2);

    try {
      const res = await fetch(`${API_BASE}/compare`, { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const verdictClass = result
    ? result.drift_zone === 'stable' ? 'verdict-stable'
      : result.drift_zone === 'moderate' ? 'verdict-moderate'
      : 'verdict-critical'
    : '';

  const verdictEmoji = result
    ? result.drift_zone === 'stable' ? '✅'
      : result.drift_zone === 'moderate' ? '⚠️'
      : '🔴'
    : '';

  return (
    <section id="demo" style={{ padding: '100px 0', position: 'relative' }}>
      <div className="orb" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', top: '20%', right: '-5%', pointerEvents: 'none' }} />

      <div className="section-wrapper">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 999, padding: '5px 16px', fontSize: '0.75rem', fontWeight: 600, color: '#818cf8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
            Interactive Demo
          </div>
          <h2 className="section-title gradient-text" style={{ marginBottom: 14 }}>Live Face Comparison</h2>
          <p className="section-subtitle" style={{ maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Upload two face images to compute the drift score using the ArcFace model. A drift &gt; 0.65 triggers a re-enrollment recommendation.
          </p>
        </div>

        {/* Upload card */}
        <div className="glass-card" style={{ padding: 36, marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <UploadZone id="ref-upload" label="Reference Face" icon="🧑" preview={preview1} onFile={handleFile(setFile1, setPreview1)} />
            {/* VS divider */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0 8px' }}>
              <div style={{ width: 1, flex: 1, background: 'rgba(59,130,246,0.15)' }} />
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#60a5fa' }}>VS</div>
              <div style={{ width: 1, flex: 1, background: 'rgba(59,130,246,0.15)' }} />
            </div>
            <UploadZone id="cur-upload" label="Current Face" icon="🧑‍💼" preview={preview2} onFile={handleFile(setFile2, setPreview2)} />
          </div>

          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <button
              id="compare-btn"
              className="btn-primary"
              onClick={handleCompare}
              disabled={loading || !file1 || !file2}
              style={{ padding: '14px 48px', fontSize: '1rem' }}
            >
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

        {/* Results card */}
        {result && (
          <div className="glass-card animate-scaleIn" style={{ padding: 36 }}>
            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start' }}>

              {/* Left: Drift meter */}
              <div style={{ flex: 2, minWidth: 280 }}>
                <DriftMeter drift={result.drift} />

                {/* Verdict */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <span className={`verdict-badge ${verdictClass}`}>
                    {verdictEmoji} {result.verdict}
                  </span>
                </div>

                {/* Explanation */}
                <div style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(59,130,246,0.12)', borderRadius: 10, padding: '14px 18px', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.7 }}>
                  {result.drift_zone === 'stable'
                    ? '✅ The two faces are highly similar. The identity is stable — no re-enrollment needed.'
                    : result.drift_zone === 'moderate'
                    ? '⚠️ Moderate drift detected. This may be due to lighting, pose, or aging. Monitor over time.'
                    : '🔴 Significant identity drift detected. Drift exceeds the 0.65 threshold. Re-enrollment is recommended to maintain recognition accuracy.'}
                </div>
              </div>

              {/* Right: Metrics */}
              <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Cosine Similarity', value: result.similarity.toFixed(4), color: '#60a5fa', note: '(higher = more similar)' },
                  { label: 'Drift Score', value: result.drift.toFixed(4), color: result.drift_zone === 'stable' ? '#34d399' : result.drift_zone === 'moderate' ? '#fbbf24' : '#f43f5e', note: '(1 − similarity)' },
                  { label: 'Threshold', value: result.threshold, color: '#f43f5e', note: '(re-enroll if drift > this)' },
                  { label: 'Flagged', value: result.flagged ? 'YES' : 'NO', color: result.flagged ? '#f43f5e' : '#34d399', note: result.flagged ? 'Re-enrollment needed' : 'Identity verified' },
                ].map((m, i) => (
                  <div key={i} style={{ background: 'rgba(15,34,64,0.5)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{m.label}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', color: m.color }}>{m.value}</div>
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
