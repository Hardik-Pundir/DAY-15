import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ApplyLeave from './pages/ApplyLeave';
import LeaveHistory from './pages/LeaveHistory';
import PendingRequests from './pages/PendingRequests';

function RootRedirect() {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" />;
  return <Navigate to={auth.role === 'MANAGER' ? '/pending' : '/apply'} />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/apply"   element={<PrivateRoute allowedRole="EMPLOYEE"><ApplyLeave /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute allowedRole="EMPLOYEE"><LeaveHistory /></PrivateRoute>} />
          <Route path="/pending" element={<PrivateRoute allowedRole="MANAGER"><PendingRequests /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
