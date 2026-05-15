import React from 'react';

const books = [
  { cat: 'Personal Finance', items: ['The Psychology of Money — Morgan Housel', 'Rich Dad Poor Dad — Robert Kiyosaki', 'The Millionaire Next Door — Thomas J. Stanley'] },
  { cat: 'Investing & Analysis', items: ['The Intelligent Investor — Benjamin Graham', 'One Up On Wall Street — Peter Lynch', 'Common Stocks and Uncommon Profits — Philip Fisher'] },
  { cat: 'Financial Statements', items: ['Financial Statements — Thomas Ittelson', 'Warren Buffett and the Interpretation of Financial Statements — Mary Buffett'] },
  { cat: 'Trading Psychology', items: ['Trading in the Zone — Mark Douglas', 'Market Wizards — Jack D. Schwager'] },
];

const pillars = [
  { icon: '🏠', label: 'Family Security', color: '#10b981', items: ['House construction completion', 'Parents & wife insurance maintained', 'Essential family needs covered', 'Long-term family safety'] },
  { icon: '📈', label: 'Wealth Building', color: '#3d7eff', items: ['NPR 15,000/month long-term investment', 'NPR 5,000/month child education fund', 'Mutual funds & index investing', 'Stable asset accumulation'] },
  { icon: '📊', label: 'Trading', color: '#f59e0b', items: ['Swing trading opportunities', 'Small % of overall finances only', 'Never compromise family security', 'Controlled risk exposure'] },
];

const timeline = [
  { phase: 'Now → 7 months', label: 'Construction Phase', color: '#ef4444', items: ['Complete house construction', 'Preserve monthly cash flow', 'Avoid financial stress', 'Continue insurance & investments'] },
  { phase: '7–12 months', label: 'Stabilization', color: '#f59e0b', items: ['House complete & move in', 'Begin rental income stream', 'Build emergency reserves', 'Increase investment rate'] },
  { phase: '1–3 years', label: 'Growth Phase', color: '#3d7eff', items: ['Expand long-term wealth', 'Use rental income strategically', 'Reduce active income dependence', 'Increase trading capital'] },
  { phase: '3–5 years', label: 'Financial Freedom', color: '#10b981', items: ['Investments growing consistently', 'Debt manageable or cleared', 'Child fund well-established', 'Family fully financially protected'] },
];

export default function Planning() {
  return (
    <div>
      <div className="page-header">
        <h2>Financial Plan & Strategy</h2>
        <p>Your long-term roadmap based on your financial planning summary.</p>
      </div>

      <div className="philosophy-card" style={{ marginBottom: 28 }}>
        <h3>🎯 The Core Objective</h3>
        <p>Protect the family financially · Complete the house construction safely · Generate future rental income · Maintain long-term investments · Avoid unnecessary financial stress · Build long-term financial stability for wife, son, and parents.</p>
      </div>

      <div className="section-title" style={{ marginBottom: 16 }}>Three Money Buckets</div>
      <div className="grid-3" style={{ marginBottom: 28 }}>
        {pillars.map(p => (
          <div key={p.label} className="card" style={{ borderTop: `2px solid ${p.color}` }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{p.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>{p.label}</div>
            <ul style={{ paddingLeft: 16 }}>
              {p.items.map(item => (
                <li key={item} style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="section-title" style={{ marginBottom: 16 }}>5-Year Roadmap</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {timeline.map((t, i) => (
          <div key={t.phase} className="card" style={{ position: 'relative', paddingTop: 20 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: t.color, borderRadius: '12px 12px 0 0' }} />
            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: t.color, marginBottom: 6, fontWeight: 600 }}>PHASE {i + 1} · {t.phase}</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{t.label}</div>
            {t.items.map(item => (
              <div key={item} style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 7, display: 'flex', gap: 6 }}>
                <span style={{ color: t.color }}>→</span> {item}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="section-title" style={{ marginBottom: 16 }}>Financial Philosophy</div>
      <div className="grid-2" style={{ marginBottom: 28 }}>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 14 }}>✅ Do This</div>
          {['Stability over aggressive growth', 'Productive assets over liabilities', 'Consistency over speculation', 'Long-term planning over short-term profits', 'Complete functional construction first', 'Maintain positive cash flow always'].map(item => (
            <div key={item} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 13 }}>
              <span style={{ color: 'var(--green)', fontWeight: 700 }}>✓</span>
              <span style={{ color: 'var(--text2)' }}>{item}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 14 }}>🚫 Avoid This</div>
          {['Excessive speculative trading', 'Unnecessary borrowing', 'Lifestyle inflation', 'Financial overextension', 'Absorbing rental income into lifestyle', 'Compromising family security for trading'].map(item => (
            <div key={item} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 13 }}>
              <span style={{ color: 'var(--red)', fontWeight: 700 }}>✗</span>
              <span style={{ color: 'var(--text2)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section-title" style={{ marginBottom: 16 }}>Recommended Reading</div>
      <div className="grid-2">
        {books.map(b => (
          <div key={b.cat} className="card">
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--accent)', marginBottom: 12 }}>{b.cat}</div>
            {b.items.map(item => (
              <div key={item} style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8, display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--amber)' }}>📖</span> {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
