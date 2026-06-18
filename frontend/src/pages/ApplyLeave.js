import { useState } from 'react';
import api from '../api';

export default function ApplyLeave() {
  const [form, setForm] = useState({ startDate: '', endDate: '', reason: '' });
  const [msg, setMsg]   = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(''); setError('');
    try {
      await api.post('/leaves/apply', form);
      setMsg('Leave request submitted successfully!');
      setForm({ startDate: '', endDate: '', reason: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit');
    }
  };

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <h2 style={s.title}>Apply for Leave</h2>
        {error && <p style={s.error}>{error}</p>}
        {msg   && <p style={s.success}>{msg}</p>}
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.row}>
            <div style={s.col}>
              <label style={s.label}>Start Date</label>
              <input style={s.input} type="date" value={form.startDate}
                onChange={e => setForm({ ...form, startDate: e.target.value })} required />
            </div>
            <div style={s.col}>
              <label style={s.label}>End Date</label>
              <input style={s.input} type="date" value={form.endDate}
                onChange={e => setForm({ ...form, endDate: e.target.value })} required />
            </div>
          </div>
          <label style={s.label}>Reason</label>
          <textarea style={s.textarea} rows={3} placeholder="Reason for leave..." value={form.reason}
            onChange={e => setForm({ ...form, reason: e.target.value })} />
          <button style={s.btn} type="submit">Submit Request</button>
        </form>
      </div>
    </div>
  );
}

const s = {
  wrapper:  { background: '#f0f4f8', minHeight: '85vh', padding: '30px 16px' },
  card:     { background: '#fff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', padding: '28px', maxWidth: '560px', margin: '0 auto' },
  title:    { color: '#1a73e8', marginBottom: '20px' },
  form:     { display: 'flex', flexDirection: 'column', gap: '12px' },
  row:      { display: 'flex', gap: '12px' },
  col:      { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
  label:    { fontSize: '0.85rem', fontWeight: 600, color: '#555' },
  input:    { padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '0.95rem' },
  textarea: { padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', resize: 'vertical' },
  btn:      { padding: '11px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 },
  error:    { background: '#fdecea', color: '#c62828', padding: '10px', borderRadius: '6px', fontSize: '0.9rem' },
  success:  { background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '6px', fontSize: '0.9rem' },
};
