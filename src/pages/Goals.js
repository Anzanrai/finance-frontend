import React, { useEffect, useState } from 'react';
import { api, CATEGORIES, formatNPR, formatCurrency } from '../api';

function GoalModal({ goal, onClose, onSave }) {
  const [form, setForm] = useState(goal || {
    name: '', category: 'family_security', target_amount: '', currency: 'NPR', description: ''
  });

  const handleSave = async () => {
    const data = { ...form, target_amount: form.target_amount ? parseFloat(form.target_amount) : null };
    if (goal?.id) await api.put(`/goals/${goal.id}`, data);
    else await api.post('/goals', data);
    onSave();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{goal?.id ? 'Edit Goal' : 'Add New Goal'}</h3>
          <button className="btn btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div className="form-group">
          <label className="form-label">Goal Name *</label>
          <input className="form-input" placeholder="e.g. Emergency Fund" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Category *</label>
          <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Target Amount (optional)</label>
            <input type="number" className="form-input" placeholder="e.g. 500000" value={form.target_amount}
              onChange={e => setForm({ ...form, target_amount: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Currency</label>
            <select className="form-select" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
              <option value="NPR">NPR</option>
              <option value="AUD">AUD</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" placeholder="Purpose or notes..." value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!form.name}>
            {goal?.id ? 'Save Changes' : 'Create Goal'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AllocationModal({ goal, onClose, onSave }) {
  const [allocations, setAllocations] = useState([]);
  const [form, setForm] = useState({ amount: '', note: '', date: new Date().toISOString().slice(0, 10) });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/allocations?goal_id=${goal.id}`).then(data => { setAllocations(data); setLoading(false); });
  }, [goal.id]);

  const addAllocation = async () => {
    await api.post('/allocations', { goal_id: goal.id, amount: parseFloat(form.amount), note: form.note, date: form.date });
    const data = await api.get(`/allocations?goal_id=${goal.id}`);
    setAllocations(data);
    setForm({ amount: '', note: '', date: new Date().toISOString().slice(0, 10) });
    onSave();
  };

  const deleteAllocation = async (id) => {
    await api.del(`/allocations/${id}`);
    setAllocations(allocations.filter(a => a.id !== id));
    onSave();
  };

  const total = allocations.reduce((sum, a) => sum + a.amount, 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: 560 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{goal.name}</h3>
            <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>
              Total allocated: <span className="amount amount-green">{formatCurrency(total, goal.currency)}</span>
              {goal.target_amount && <> of <span className="amount">{formatCurrency(goal.target_amount, goal.currency)}</span></>}
            </p>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>✕</button>
        </div>

        <div className="card-sm" style={{ background: 'var(--bg)', borderRadius: 10, marginBottom: 20, border: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Amount ({goal.currency})</label>
              <input type="number" className="form-input" placeholder="0" value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Date</label>
              <input type="date" className="form-input" value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Note (optional)</label>
              <input className="form-input" placeholder="e.g. Monthly" value={form.note}
                onChange={e => setForm({ ...form, note: e.target.value })} />
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary btn-sm" onClick={addAllocation} disabled={!form.amount}>+ Add Allocation</button>
          </div>
        </div>

        {loading ? <div className="loading" style={{ height: 80 }}>Loading...</div> : (
          allocations.length > 0 ? (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Date</th><th>Amount</th><th>Note</th><th></th></tr></thead>
                <tbody>
                  {allocations.map(a => (
                    <tr key={a.id}>
                      <td style={{ color: 'var(--text2)', fontSize: 12 }}>{new Date(a.date).toLocaleDateString()}</td>
                      <td className="amount amount-blue">{formatCurrency(a.amount, goal.currency)}</td>
                      <td style={{ color: 'var(--text2)', fontSize: 12 }}>{a.note || '—'}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', padding: '2px 6px' }}
                          onClick={() => deleteAllocation(a.id)}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state"><p>No allocations yet. Add your first above.</p></div>
          )
        )}
      </div>
    </div>
  );
}

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editGoal, setEditGoal] = useState(null);
  const [allocGoal, setAllocGoal] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [filterCat, setFilterCat] = useState('all');

  const load = () => api.get('/goals').then(data => { setGoals(data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const deleteGoal = async (id) => {
    if (window.confirm('Delete this goal and all its allocations?')) {
      await api.del(`/goals/${id}`);
      load();
    }
  };

  const filtered = filterCat === 'all' ? goals : goals.filter(g => g.category === filterCat);

  if (loading) return <div className="loading">Loading goals...</div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Financial Goals</h2>
          <p>Manage your goals and track allocations for each.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ New Goal</button>
      </div>

      <div className="tabs">
        <button className={`tab ${filterCat === 'all' ? 'active' : ''}`} onClick={() => setFilterCat('all')}>All ({goals.length})</button>
        {Object.entries(CATEGORIES).map(([k, v]) => {
          const count = goals.filter(g => g.category === k).length;
          return <button key={k} className={`tab ${filterCat === k ? 'active' : ''}`} onClick={() => setFilterCat(k)}>{v.icon} {v.label} ({count})</button>;
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><div className="icon">🎯</div><p>No goals in this category yet.</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map(goal => {
            const pct = goal.target_amount ? Math.min(100, Math.round((goal.allocated_total / goal.target_amount) * 100)) : null;
            return (
              <div key={goal.id} className="goal-card">
                <div className="goal-card-header">
                  <div>
                    <div className="goal-name">{CATEGORIES[goal.category]?.icon} {goal.name}</div>
                  </div>
                  <span className={`goal-category-badge badge-${goal.category}`}>
                    {CATEGORIES[goal.category]?.label}
                  </span>
                </div>
                {goal.description && <div className="goal-desc">{goal.description}</div>}
                {pct !== null && (
                  <>
                    <div className="progress-bar-wrap">
                      <div className={`progress-bar progress-${goal.category}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="goal-amounts">
                      <span className="goal-allocated">{formatCurrency(goal.allocated_total, goal.currency)}</span>
                      <span className="goal-target">{pct}% of {formatCurrency(goal.target_amount, goal.currency)}</span>
                    </div>
                  </>
                )}
                {pct === null && (
                  <div className="goal-amounts">
                    <span className="goal-allocated">{formatCurrency(goal.allocated_total, goal.currency)} allocated</span>
                    <span className="goal-target">{goal.allocation_count} entries</span>
                  </div>
                )}
                <div className="goal-actions">
                  <button className="btn btn-primary btn-sm" onClick={() => setAllocGoal(goal)}>💰 Allocate</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditGoal(goal)}>✏️ Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteGoal(goal.id)}>🗑</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(showAdd || editGoal) && (
        <GoalModal
          goal={editGoal}
          onClose={() => { setShowAdd(false); setEditGoal(null); }}
          onSave={() => { load(); setShowAdd(false); setEditGoal(null); }}
        />
      )}
      {allocGoal && (
        <AllocationModal
          goal={allocGoal}
          onClose={() => setAllocGoal(null)}
          onSave={() => { load(); }}
        />
      )}
    </div>
  );
}
