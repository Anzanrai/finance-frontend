import React, { useEffect, useState } from 'react';
import { api, CATEGORIES, formatCurrency } from '../api';

export default function Allocations() {
  const [allocations, setAllocations] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGoal, setFilterGoal] = useState('all');

  const load = () => {
    Promise.all([api.get('/allocations'), api.get('/goals')]).then(([a, g]) => {
      setAllocations(a);
      setGoals(g);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const del = async (id) => {
    await api.del(`/allocations/${id}`);
    load();
  };

  const filtered = filterGoal === 'all' ? allocations : allocations.filter(a => String(a.goal_id) === filterGoal);
  const total = filtered.reduce((sum, a) => sum + a.amount, 0);

  if (loading) return <div className="loading">Loading allocations...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Allocation History</h2>
        <p>All your financial allocations in one place.</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <select className="form-select" style={{ width: 240 }} value={filterGoal}
          onChange={e => setFilterGoal(e.target.value)}>
          <option value="all">All Goals</option>
          {goals.map(g => <option key={g.id} value={String(g.id)}>{g.name}</option>)}
        </select>
        <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text2)' }}>
          {filtered.length} entries · <span className="amount amount-green">NPR {Number(total).toLocaleString()}</span> total
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><div className="icon">📋</div><p>No allocations yet.</p></div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Goal</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Note</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td style={{ color: 'var(--text2)', fontSize: 12, fontFamily: 'var(--mono)' }}>
                      {new Date(a.date).toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td style={{ fontWeight: 500 }}>{a.goal_name}</td>
                    <td>
                      <span className={`goal-category-badge badge-${a.category}`}>
                        {CATEGORIES[a.category]?.label}
                      </span>
                    </td>
                    <td className="amount amount-blue">{formatCurrency(a.amount, a.currency)}</td>
                    <td style={{ color: 'var(--text2)', fontSize: 12 }}>{a.note || '—'}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => del(a.id)}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
