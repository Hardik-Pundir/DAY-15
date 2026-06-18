import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const [form, setForm] = useState({ name: '', username: '', password: '', role: 'EMPLOYEE' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      await api.post('/auth/register', form);
      setMsg('Registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <h2 style={s.title}>Register</h2>
        {error && <p style={s.error}>{error}</p>}
        {msg   && <p style={s.success}>{msg}</p>}
        <form onSubmit={handleSubmit} style={s.form}>
          <input style={s.input} placeholder="Full Name"  value={form.name}     onChange={set('name')}     required />
          <input style={s.input} placeholder="Username"   value={form.username} onChange={set('username')} required />
          <input style={s.input} type="password" placeholder="Password" value={form.password} onChange={set('password')} required />
          <select style={s.input} value={form.role} onChange={set('role')}>
            <option value="EMPLOYEE">Employee</option>
            <option value="MANAGER">Manager</option>
          </select>
          <button style={s.btn} type="submit">Register</button>
        </form>
        <p style={s.footer}>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

const s = {
  wrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh', background: '#f0f4f8' },
  card:    { background: '#fff', padding: '36px', borderRadius: '10px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', width: '360px' },
  title:   { marginBottom: '20px', color: '#1a73e8', textAlign: 'center' },
  form:    { display: 'flex', flexDirection: 'column', gap: '12px' },
  input:   { padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '0.95rem' },
  btn:     { padding: '11px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 },
  error:   { background: '#fdecea', color: '#c62828', padding: '10px', borderRadius: '6px', marginBottom: '12px', fontSize: '0.9rem' },
  success: { background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '6px', marginBottom: '12px', fontSize: '0.9rem' },
  footer:  { textAlign: 'center', marginTop: '16px', fontSize: '0.9rem' },
};
