const BASE = process.env.REACT_APP_API_URL + '/api';

export const api = {
  get: (path) => fetch(`${BASE}${path}`).then(r => r.json()),
  post: (path, body) => fetch(`${BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json()),
  put: (path, body) => fetch(`${BASE}${path}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json()),
  del: (path) => fetch(`${BASE}${path}`, { method: 'DELETE' }).then(r => r.json()),
};

export const CATEGORIES = {
  family_security: { label: 'Family Security', color: '#10b981', icon: '🏠' },
  wealth_building: { label: 'Wealth Building', color: '#3d7eff', icon: '📈' },
  trading: { label: 'Trading', color: '#f59e0b', icon: '📊' },
  post_construction: { label: 'Post-Construction', color: '#8b5cf6', icon: '🎯' },
};

export const formatNPR = (n) => {
  if (!n && n !== 0) return '—';
  return 'NPR ' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

export const formatAUD = (n) => {
  if (!n && n !== 0) return '—';
  return 'AUD ' + Number(n).toLocaleString('en-AU', { maximumFractionDigits: 0 });
};

export const formatCurrency = (n, currency) => {
  if (currency === 'AUD') return formatAUD(n);
  return formatNPR(n);
};
