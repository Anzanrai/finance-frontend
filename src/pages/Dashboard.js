import React, { useEffect, useState } from 'react';
import { api, CATEGORIES, formatNPR, formatAUD, formatCurrency } from '../api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = Object.values(CATEGORIES).map(c => c.color);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [goals, setGoals] = useState([]);
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [incomeForm, setIncomeForm] = useState({ amount: '', month: new Date().toISOString().slice(0, 7) });
  const [editingIncomeId, setEditingIncomeId] = useState(null);
  const [editingIncomeVal, setEditingIncomeVal] = useState('');

  useEffect(() => {
    Promise.all([api.get('/summary'), api.get('/goals'), api.get('/income')])
      .then(([s, g, inc]) => {
        setSummary(s);
        setGoals(g);
        setIncome(inc);
        setLoading(false);
      });
  }, []);

  const saveIncome = async () => {
    await api.post('/income', { ...incomeForm, amount: parseFloat(incomeForm.amount), currency: 'AUD' });
    const [s, inc] = await Promise.all([api.get('/summary'), api.get('/income')]);
    setSummary(s);
    setIncome(inc);
    setShowIncomeModal(false);
  };

  const saveEditIncome = async (inc) => {
    const newAmt = parseFloat(editingIncomeVal);
    if (!newAmt || newAmt === inc.amount) { setEditingIncomeId(null); return; }
    await api.post('/income', { amount: newAmt, currency: inc.currency || 'AUD', month: inc.month });
    const [s, updated] = await Promise.all([api.get('/summary'), api.get('/income')]);
    setSummary(s);
    setIncome(updated);
    setEditingIncomeId(null);
  };

  if (loading) return <div className="loading">Loading your financial dashboard...</div>;

  const pieData = summary.categoryBreakdown
    .filter(c => c.total_allocated > 0)
    .map(c => ({ name: CATEGORIES[c.category]?.label || c.category, value: c.total_allocated }));

  const barData = goals
    .filter(g => g.target_amount && g.allocated_total >= 0)
    .map(g => ({
      name: g.name.length > 16 ? g.name.slice(0, 14) + '…' : g.name,
      allocated: g.allocated_total,
      target: g.target_amount,
      pct: Math.min(100, Math.round((g.allocated_total / g.target_amount) * 100)),
    }));

  const latestIncome = income[0];
  const totalTarget = goals.reduce((sum, g) => sum + (g.target_amount || 0), 0);
  const constructionGoal = goals.find(g => g.name === 'House Construction');
  const constructionPct = constructionGoal
    ? Math.min(100, Math.round((constructionGoal.allocated_total / constructionGoal.target_amount) * 100))
    : 0;

  return (
    <div>
      <div className="page-header">
        <h2>Financial Overview</h2>
        <p>Track your goals, allocations, and long-term plan at a glance.</p>
      </div>

      <div className="philosophy-card">
        <h3>📌 Core Principle</h3>
        <p>Long-term family stability matters more than short-term financial gains. Focus on: <strong>Stability &gt; Aggressive Growth</strong> · <strong>Productive Assets &gt; Liabilities</strong> · <strong>Consistency &gt; Speculation</strong></p>
      </div>

      <div className="grid-4">
        <div className="stat-card blue">
          <div className="stat-label">Monthly Income</div>
          <div className="stat-value" style={{ fontSize: 20 }}>{latestIncome ? formatAUD(latestIncome.amount) : 'AUD 4,000'}</div>
          <div className="stat-sub">{latestIncome ? latestIncome.month : 'Target estimate'}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Total Allocated</div>
          <div className="stat-value" style={{ fontSize: 20 }}>{formatNPR(summary.totalAllocated)}</div>
          <div className="stat-sub">Across all goals</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">House Construction</div>
          <div className="stat-value" style={{ fontSize: 20 }}>{constructionPct}%</div>
          <div className="stat-sub">{formatNPR(constructionGoal?.allocated_total)} of {formatNPR(1350000)}</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">Active Goals</div>
          <div className="stat-value">{goals.length}</div>
          <div className="stat-sub">Across 4 categories</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-title">Allocation by Category</div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatNPR(v)} contentStyle={{ background: '#111520', border: '1px solid #1e2535', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p>No allocations yet. Start adding funds to your goals.</p></div>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 12 }}>
            {summary.categoryBreakdown.map((c, i) => (
              <div key={c.category} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i] }} />
                <span style={{ color: 'var(--text2)' }}>{CATEGORIES[c.category]?.label}: </span>
                <span className="amount" style={{ color: 'var(--text)' }}>{formatNPR(c.total_allocated)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-title">Goal Progress</div>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text2)' }} tickFormatter={v => 'NPR ' + (v/1000).toFixed(0) + 'k'} />
                <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11, fill: 'var(--text2)' }} />
                <Tooltip formatter={(v) => formatNPR(v)} contentStyle={{ background: '#111520', border: '1px solid #1e2535', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="target" fill="var(--border2)" radius={2} name="Target" />
                <Bar dataKey="allocated" fill="var(--accent)" radius={2} name="Allocated" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p>Goals with targets will appear here.</p></div>
          )}
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="section-title" style={{ margin: 0 }}>Monthly Income</div>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowIncomeModal(true)}>+ Log Income</button>
          </div>
          {income.length > 0 ? (
            <table>
              <thead><tr><th>Month</th><th>Amount (AUD)</th><th></th></tr></thead>
              <tbody>
                {income.slice(0, 6).map(inc => (
                  <tr key={inc.id}>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>{inc.month}</td>
                    <td>
                      {editingIncomeId === inc.id ? (
                        <input
                          type="number"
                          className="form-input"
                          style={{ padding: '4px 8px', fontSize: 13, width: 120 }}
                          value={editingIncomeVal}
                          onChange={e => setEditingIncomeVal(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveEditIncome(inc);
                            if (e.key === 'Escape') setEditingIncomeId(null);
                          }}
                          autoFocus
                        />
                      ) : (
                        <span className="amount amount-green">{formatAUD(inc.amount)}</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {editingIncomeId === inc.id ? (
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                          <button className="btn btn-primary btn-sm" style={{ padding: '3px 10px' }} onClick={() => saveEditIncome(inc)}>✓</button>
                          <button className="btn btn-ghost btn-sm" style={{ padding: '3px 8px' }} onClick={() => setEditingIncomeId(null)}>✕</button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: 11, color: 'var(--text3)', padding: '3px 8px' }}
                          onClick={() => { setEditingIncomeId(inc.id); setEditingIncomeVal(inc.amount); }}
                        >✏️ Edit</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state"><div className="icon">💰</div><p>Log your monthly income to track cash flow.</p></div>
          )}
        </div>

        <div className="card">
          <div className="section-title">Recent Allocations</div>
          {summary.recentAllocations.length > 0 ? (
            <table>
              <thead><tr><th>Goal</th><th>Amount</th><th>Date</th></tr></thead>
              <tbody>
                {summary.recentAllocations.map(a => (
                  <tr key={a.id}>
                    <td>{a.goal_name}</td>
                    <td className="amount amount-blue">{formatNPR(a.amount)}</td>
                    <td style={{ color: 'var(--text2)', fontSize: 12 }}>{new Date(a.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state"><div className="icon">📋</div><p>Your recent allocations will appear here.</p></div>
          )}
        </div>
      </div>

      {showIncomeModal && (
        <div className="modal-overlay" onClick={() => setShowIncomeModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Log Monthly Income</h3>
              <button className="btn btn-ghost" onClick={() => setShowIncomeModal(false)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">Month</label>
              <input type="month" className="form-input" value={incomeForm.month}
                onChange={e => setIncomeForm({ ...incomeForm, month: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Amount (AUD)</label>
              <input type="number" className="form-input" placeholder="e.g. 4000"
                value={incomeForm.amount} onChange={e => setIncomeForm({ ...incomeForm, amount: e.target.value })} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowIncomeModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveIncome} disabled={!incomeForm.amount}>Save Income</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
