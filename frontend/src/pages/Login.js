import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate(data.role === 'MANAGER' ? '/pending' : '/apply');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <h2 style={s.title}>Login</h2>
        {error && <p style={s.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={s.form}>
          <input style={s.input} placeholder="Username" value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })} required />
          <input style={s.input} type="password" placeholder="Password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button style={s.btn} type="submit">Login</button>
        </form>
        <p style={s.footer}>Don't have an account? <Link to="/register">Register</Link></p>
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
  footer:  { textAlign: 'center', marginTop: '16px', fontSize: '0.9rem' },
};
