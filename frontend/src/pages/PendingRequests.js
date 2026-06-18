import { useEffect, useState } from 'react';
import api from '../api';

export default function PendingRequests() {
  const [leaves, setLeaves]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null); // { id, name }
  const [comment, setComment] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/leaves/pending').then(r => setLeaves(r.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleAction = async (status) => {
    await api.put(`/leaves/${modal.id}/action`, { status, managerComment: comment });
    setModal(null);
    setComment('');
    load();
  };

  const fmt = (d) => new Date(d).toLocaleDateString();

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <h2 style={s.title}>Pending Leave Requests</h2>
        {loading ? <p>Loading...</p> : (
          <table style={s.table}>
            <thead>
              <tr>{['Employee','Start','End','Reason','Action'].map(h =>
                <th key={h} style={s.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0
                ? <tr><td colSpan={5} style={s.empty}>No pending requests</td></tr>
                : leaves.map(l => (
                  <tr key={l._id}>
                    <td style={s.td}>{l.employee?.name}</td>
                    <td style={s.td}>{fmt(l.startDate)}</td>
                    <td style={s.td}>{fmt(l.endDate)}</td>
                    <td style={s.td}>{l.reason || '-'}</td>
                    <td style={s.td}>
                      <button style={s.reviewBtn} onClick={() => setModal({ id: l._id, name: l.employee?.name })}>
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h3 style={{ color: '#1a73e8', marginBottom: '16px' }}>Review leave for {modal.name}</h3>
            <label style={s.label}>Comment (optional)</label>
            <input style={s.input} placeholder="Add a comment..." value={comment}
              onChange={e => setComment(e.target.value)} />
            <div style={s.modalActions}>
              <button style={{ ...s.btn, background: '#43a047' }} onClick={() => handleAction('APPROVED')}>Approve</button>
              <button style={{ ...s.btn, background: '#e53935' }} onClick={() => handleAction('REJECTED')}>Reject</button>
              <button style={{ ...s.btn, background: '#888' }}    onClick={() => { setModal(null); setComment(''); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  wrapper:      { background: '#f0f4f8', minHeight: '85vh', padding: '30px 16px' },
  card:         { background: '#fff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', padding: '28px', maxWidth: '900px', margin: '0 auto' },
  title:        { color: '#1a73e8', marginBottom: '20px' },
  table:        { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' },
  th:           { background: '#f5f7fa', padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#555' },
  td:           { padding: '10px 12px', borderTop: '1px solid #eee' },
  empty:        { padding: '20px', textAlign: 'center', color: '#999' },
  reviewBtn:    { padding: '6px 14px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 },
  overlay:      { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal:        { background: '#fff', borderRadius: '10px', padding: '28px', width: '380px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' },
  label:        { fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' },
  input:        { width: '100%', padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', boxSizing: 'border-box' },
  modalActions: { display: 'flex', gap: '10px', marginTop: '16px' },
  btn:          { flex: 1, padding: '10px', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' },
};
