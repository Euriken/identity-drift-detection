import React, { useEffect, useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FALLBACK = [
  { dataset: 'LFW',      accuracy: 99.67, stability_index: 0.6718, avg_drift: 0.3282, reenrollment_pct: 0.2,  total_pairs: 6000  },
  { dataset: 'CALFW',    accuracy: 94.02, stability_index: 0.5212, avg_drift: 0.4788, reenrollment_pct: 3.1,  total_pairs: 6000  },
  { dataset: 'AgeDB-30', accuracy: 92.68, stability_index: 0.4552, avg_drift: 0.5448, reenrollment_pct: 11.4, total_pairs: 6000  },
  { dataset: 'CPLFW',    accuracy: 88.73, stability_index: 0.4463, avg_drift: 0.5537, reenrollment_pct: 13.2, total_pairs: 6000  },
];

function AccuracyBar({ value, max = 100 }) {
  const pct = (value / max) * 100;
  const color = value >= 98 ? '#34d399' : value >= 92 ? '#60a5fa' : value >= 88 ? '#818cf8' : '#fbbf24';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 8, background: 'rgba(30,58,110,0.5)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 1s ease' }} />
      </div>
      <span style={{ fontSize: '0.875rem', fontWeight: 700, color, minWidth: 52, fontFamily: 'JetBrains Mono, monospace', textAlign: 'right' }}>{value}%</span>
    </div>
  );
}

function StabilityDot({ value }) {
  const color = value >= 0.6 ? '#34d399' : value >= 0.5 ? '#60a5fa' : value >= 0.44 ? '#fbbf24' : '#f43f5e';
  return (
    <span style={{ color, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem' }}>
      {value?.toFixed(4) ?? '—'}
    </span>
  );
}

export default function BenchmarkResults() {
  const [data, setData] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(0.65);

  useEffect(() => {
    fetch('/results')
      .then(r => r.json())
      .then(j => {
        if (j.results && j.results.length > 0) {
          setData(j.results);
          setThreshold(j.threshold ?? 0.65);
        }
      })
      .catch(() => {/* use fallback */})
      .finally(() => setLoading(false));
  }, []);

  const labels = data.map(d => d.dataset);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Accuracy (%)',
        data: data.map(d => d.accuracy),
        backgroundColor: ['rgba(52,211,153,0.7)', 'rgba(96,165,250,0.7)', 'rgba(129,140,248,0.7)', 'rgba(251,191,36,0.7)'],
        borderColor:      ['#34d399', '#60a5fa', '#818cf8', '#fbbf24'],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Stability Index (×100)',
        data: data.map(d => (d.stability_index ?? 0) * 100),
        backgroundColor: 'rgba(99,102,241,0.3)',
        borderColor: '#818cf8',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 12 },
          boxWidth: 14,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(10,22,40,0.95)',
        borderColor: 'rgba(59,130,246,0.3)',
        borderWidth: 1,
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        padding: 12,
        callbacks: {
          label: ctx => {
            if (ctx.datasetIndex === 1) return ` Stability Index: ${(ctx.raw / 100).toFixed(4)}`;
            return ` Accuracy: ${ctx.raw}%`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { family: 'Inter', size: 12 } },
      },
      y: {
        min: 0,
        max: 105,
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 11 }, callback: v => `${v}` },
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
            Evaluated using the ArcFace w600k_r50 model with drift threshold = <strong style={{ color: '#fbbf24' }}>{threshold}</strong>. Results computed over face verification pairs.
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

        {/* Chart + Table layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, flexWrap: 'wrap' }}>

          {/* Bar chart */}
          <div className="glass-card" style={{ padding: 28 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#93c5fd', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Accuracy vs Stability</div>
            <div style={{ height: 260 }}>
              {!loading && <Bar data={chartData} options={chartOptions} />}
            </div>
          </div>

          {/* Detailed table */}
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
              <strong style={{ color: '#93c5fd' }}>Note:</strong> Re-enroll % = genuine pairs flagged with drift &gt; {threshold}. Stability Index = average cosine similarity of same-person pairs (1 = perfectly stable).
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
