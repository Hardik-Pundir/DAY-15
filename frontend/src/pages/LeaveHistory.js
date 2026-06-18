import { useEffect, useState } from 'react';
import api from '../api';

const badgeStyle = { PENDING: { bg: '#fff3e0', color: '#e65100' }, APPROVED: { bg: '#e8f5e9', color: '#2e7d32' }, REJECTED: { bg: '#fdecea', color: '#c62828' } };

export default function LeaveHistory() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/leaves/my-history')
      .then(r => setLeaves(r.data))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (d) => new Date(d).toLocaleDateString();

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <h2 style={s.title}>My Leave History</h2>
        {loading ? <p>Loading...</p> : (
          <table style={s.table}>
            <thead>
              <tr>{['Start','End','Reason','Status','Manager Comment'].map(h =>
                <th key={h} style={s.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0
                ? <tr><td colSpan={5} style={s.empty}>No leave requests yet</td></tr>
                : leaves.map(l => (
                  <tr key={l._id}>
                    <td style={s.td}>{fmt(l.startDate)}</td>
                    <td style={s.td}>{fmt(l.endDate)}</td>
                    <td style={s.td}>{l.reason || '-'}</td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, background: badgeStyle[l.status].bg, color: badgeStyle[l.status].color }}>
                        {l.status}
                      </span>
                    </td>
                    <td style={s.td}>{l.managerComment || '-'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const s = {
  wrapper: { background: '#f0f4f8', minHeight: '85vh', padding: '30px 16px' },
  card:    { background: '#fff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', padding: '28px', maxWidth: '900px', margin: '0 auto' },
  title:   { color: '#1a73e8', marginBottom: '20px' },
  table:   { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' },
  th:      { background: '#f5f7fa', padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#555' },
  td:      { padding: '10px 12px', borderTop: '1px solid #eee' },
  badge:   { padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 },
  empty:   { padding: '20px', textAlign: 'center', color: '#999' },
};
