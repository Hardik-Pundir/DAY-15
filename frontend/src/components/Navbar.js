import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>🏢 Leave Approval System</span>
      {auth && (
        <div style={styles.links}>
          {auth.role === 'EMPLOYEE' && <>
            <Link to="/apply" style={styles.link}>Apply Leave</Link>
            <Link to="/history" style={styles.link}>My History</Link>
          </>}
          {auth.role === 'MANAGER' && (
            <Link to="/pending" style={styles.link}>Pending Requests</Link>
          )}
          <span style={styles.user}>{auth.name} ({auth.role})</span>
          <button onClick={handleLogout} style={styles.btn}>Logout</button>
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav:   { background: '#1a73e8', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: '#fff', fontWeight: 700, fontSize: '1.1rem' },
  links: { display: 'flex', alignItems: 'center', gap: '20px' },
  link:  { color: '#fff', textDecoration: 'none', fontWeight: 500 },
  user:  { color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' },
  btn:   { background: '#fff', color: '#1a73e8', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 },
};
