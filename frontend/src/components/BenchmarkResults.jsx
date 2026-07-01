import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, Tooltip, Legend, Filler,
);

// ── Fallback data ─────────────────────────────────────────────────────────────
const FALLBACK = [
  { dataset: 'LFW',      accuracy: 99.67, stability_index: 0.6718, avg_drift: 0.3282, reenrollment_pct: 0.2,  total_pairs: 6000 },
  { dataset: 'CALFW',    accuracy: 94.02, stability_index: 0.5212, avg_drift: 0.4788, reenrollment_pct: 3.1,  total_pairs: 6000 },
  { dataset: 'AgeDB-30', accuracy: 92.68, stability_index: 0.4552, avg_drift: 0.5448, reenrollment_pct: 11.4, total_pairs: 6000 },
  { dataset: 'CPLFW',    accuracy: 88.73, stability_index: 0.4463, avg_drift: 0.5537, reenrollment_pct: 13.2, total_pairs: 6000 },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function AccuracyBar({ value }) {
  const color = value >= 98 ? '#34d399' : value >= 92 ? '#60a5fa' : value >= 88 ? '#818cf8' : '#fbbf24';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 8, background: 'rgba(30,58,110,0.5)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 1s ease' }} />
      </div>
      <span style={{ fontSize: '0.875rem', fontWeight: 700, color, minWidth: 52, fontFamily: 'JetBrains Mono, monospace', textAlign: 'right' }}>{value}%</span>
    </div>
  );
}

function StabilityDot({ value }) {
  const color = value >= 0.6 ? '#34d399' : value >= 0.5 ? '#60a5fa' : value >= 0.44 ? '#fbbf24' : '#f43f5e';
  return <span style={{ color, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem' }}>{value?.toFixed(4) ?? '—'}</span>;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BenchmarkResults() {
  const [data,      setData]      = useState(FALLBACK);
  const [loading,   setLoading]   = useState(true);
  const [threshold, setThreshold] = useState(0.65);
  const [histogram, setHistogram] = useState(null);

  useEffect(() => {
    fetch('/results')
      .then(r => r.json())
      .then(j => {
        if (j.results?.length > 0) setData(j.results);
        if (j.threshold)           setThreshold(j.threshold);
        if (j.histogram)           setHistogram(j.histogram);
      })
      .catch(() => {/* use fallback */})
      .finally(() => setLoading(false));
  }, []);

  // ── Accuracy / Stability bar chart ────────────────────────────────────────
  const accChartData = {
    labels: data.map(d => d.dataset),
    datasets: [
      {
        label: 'Accuracy (%)',
        data: data.map(d => d.accuracy),
        backgroundColor: ['rgba(52,211,153,0.7)', 'rgba(96,165,250,0.7)', 'rgba(129,140,248,0.7)', 'rgba(251,191,36,0.7)'],
        borderColor:      ['#34d399', '#60a5fa', '#818cf8', '#fbbf24'],
        borderWidth: 2, borderRadius: 8, borderSkipped: false,
      },
      {
        label: 'Stability Index (×100)',
        data: data.map(d => (d.stability_index ?? 0) * 100),
        backgroundColor: 'rgba(99,102,241,0.3)',
        borderColor: '#818cf8',
        borderWidth: 2, borderRadius: 8, borderSkipped: false,
      },
    ],
  };

  const accChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 }, boxWidth: 14, padding: 20 } },
      tooltip: {
        backgroundColor: 'rgba(10,22,40,0.95)', borderColor: 'rgba(59,130,246,0.3)', borderWidth: 1,
        titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 12,
        callbacks: {
          label: ctx => ctx.datasetIndex === 1
            ? ` Stability: ${(ctx.raw / 100).toFixed(4)}`
            : ` Accuracy: ${ctx.raw}%`,
        },
      },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { family: 'Inter', size: 12 } } },
      y: { min: 0, max: 105, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 11 } } },
    },
  };

  // ── Drift distribution histogram (AgeDB-30) ────────────────────────────────
  const histChartData = histogram ? {
    labels: histogram.bin_centers.map(v => v.toFixed(2)),
    datasets: [
      {
        label: 'Same Person (Genuine)',
        data: histogram.same_counts,
        backgroundColor: 'rgba(96,165,250,0.5)',
        borderColor: '#60a5fa',
        borderWidth: 1.5,
        fill: true,
        tension: 0.3,
        pointRadius: 0,
      },
      {
        label: 'Different Person (Impostor)',
        data: histogram.diff_counts,
        backgroundColor: 'rgba(244,63,94,0.35)',
        borderColor: '#f43f5e',
        borderWidth: 1.5,
        fill: true,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  } : null;

  // Plugin: draw vertical threshold line
  const thresholdLinePlugin = {
    id: 'thresholdLine',
    afterDraw(chart) {
      const { ctx, chartArea, scales } = chart;
      if (!chartArea) return;
      // Find x-pixel for the threshold (0.65) label
      const labels   = chart.data.labels;
      const closest  = labels.reduce((best, l, i) => {
        const diff = Math.abs(parseFloat(l) - threshold);
        return diff < best.diff ? { i, diff } : best;
      }, { i: 0, diff: Infinity });
      const x = scales.x.getPixelForValue(closest.i);
      ctx.save();
      ctx.strokeStyle  = '#fbbf24';
      ctx.lineWidth    = 2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(x, chartArea.top);
      ctx.lineTo(x, chartArea.bottom);
      ctx.stroke();
      ctx.fillStyle  = '#fbbf24';
      ctx.font       = 'bold 11px JetBrains Mono';
      ctx.fillText(`threshold=${threshold}`, x + 6, chartArea.top + 14);
      ctx.restore();
    },
  };

  const histChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 }, boxWidth: 14, padding: 20 } },
      tooltip: {
        backgroundColor: 'rgba(10,22,40,0.95)', borderColor: 'rgba(59,130,246,0.3)', borderWidth: 1,
        titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 12,
        callbacks: { title: items => `Drift ≈ ${items[0].label}` },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 }, maxTicksLimit: 12 },
        title: { display: true, text: 'Drift Score (1 − cosine similarity)', color: '#475569', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 11 } },
        title: { display: true, text: 'Number of Pairs', color: '#475569', font: { size: 11 } },
      },
    },
  };

  return (
    <section id="results" style={{ padding: '100px 0', background: 'rgba(10,22,40,0.4)' }}>
      <div className="orb" style={{ width: 350, height: 350, background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)', bottom: '10%', left: '-5%', pointerEvents: 'none' }} />

      <div className="section-wrapper">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-block', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 999, padding: '5px 16px', fontSize: '0.75rem', fontWeight: 600, color: '#34d399', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
            Benchmark Results
          </div>
          <h2 className="section-title gradient-text" style={{ marginBottom: 14 }}>Performance on 4 Datasets</h2>
          <p className="section-subtitle" style={{ maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Evaluated using ArcFace w600k_r50 with drift threshold = <strong style={{ color: '#fbbf24' }}>{threshold}</strong>.
          </p>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          {data.map((d, i) => {
            const colors = ['#34d399', '#60a5fa', '#818cf8', '#fbbf24'];
            return (
              <div key={i} className="glass-card glass-card-hover animate-fadeInUp" style={{ padding: 24, animationDelay: `${i * 0.1}s` }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: colors[i], textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{d.dataset}</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: colors[i], fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>{d.accuracy}%</div>
                <div style={{ fontSize: '0.75rem', color: '#475569' }}>Accuracy</div>
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: 2 }}>Stability Index</div>
                  <StabilityDot value={d.stability_index} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Accuracy chart + table */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <div className="glass-card" style={{ padding: 28 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#93c5fd', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Accuracy vs Stability</div>
            <div style={{ height: 250 }}>
              {!loading && <Bar data={accChartData} options={accChartOptions} />}
            </div>
          </div>

          <div className="glass-card" style={{ padding: 28, overflowX: 'auto' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#93c5fd', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Detailed Metrics</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Dataset</th>
                  <th>Accuracy</th>
                  <th>Stability</th>
                  <th>Re-enroll %</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{d.dataset}</td>
                    <td><AccuracyBar value={d.accuracy} /></td>
                    <td><StabilityDot value={d.stability_index} /></td>
                    <td>
                      <span style={{ color: (d.reenrollment_pct ?? 0) > 10 ? '#f43f5e' : (d.reenrollment_pct ?? 0) > 3 ? '#fbbf24' : '#34d399', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem' }}>
                        {d.reenrollment_pct != null ? `${d.reenrollment_pct}%` : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 20, padding: '10px 14px', background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(59,130,246,0.12)', borderRadius: 8, fontSize: '0.75rem', color: '#64748b', lineHeight: 1.6 }}>
              <strong style={{ color: '#93c5fd' }}>Note:</strong> Re-enroll % = genuine pairs with drift &gt; {threshold}. Stability Index = avg similarity of same-person pairs.
            </div>
          </div>
        </div>

        {/* ── Drift Distribution Histogram ───────────────────────────────── */}
        <div className="glass-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                Drift Score Distribution — AgeDB-30
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.6, maxWidth: 520 }}>
                Histogram of drift scores for genuine (same-person, blue) and impostor (different-person, red) pairs.
                The dashed <span style={{ color: '#fbbf24', fontWeight: 600 }}>amber line</span> marks the decision threshold at <strong style={{ color: '#fbbf24' }}>{threshold}</strong>.
                Ideal separation: blue peak left of threshold, red peak right.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              {[
                { label: 'Genuine pairs',  color: '#60a5fa', bg: 'rgba(96,165,250,0.15)'  },
                { label: 'Impostor pairs', color: '#f43f5e', bg: 'rgba(244,63,94,0.15)'   },
                { label: 'Threshold',      color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', dashed: true },
              ].map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.73rem', color: l.color, fontWeight: 600 }}>
                  <div style={{ width: 20, height: 3, background: l.dashed ? 'none' : l.color, borderTop: l.dashed ? `2px dashed ${l.color}` : 'none', borderRadius: 1 }}
                    {...(!l.dashed && { style: { width: 20, height: 10, background: l.bg, border: `1.5px solid ${l.color}`, borderRadius: 3 } })} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 300 }}>
            {!loading && histChartData ? (
              <Line data={histChartData} options={histChartOptions} plugins={[thresholdLinePlugin]} />
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: '0.875rem' }}>
                {loading ? 'Loading histogram data…' : 'Histogram data not available (start Flask backend)'}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
