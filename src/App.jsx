import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HRMProvider } from './context/HRMContext';
import { ToastProvider } from './context/ToastContext';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Payroll from './pages/Payroll';
import Recruitment from './pages/Recruitment';
import LeaveManagement from './pages/LeaveManagement';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import Performance from './pages/Performance';
import OrgChart from './pages/OrgChart';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index              element={<Dashboard />} />
        <Route path="employees"  element={<Employees />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="payroll"    element={<Payroll />} />
        <Route path="recruitment" element={<Recruitment />} />
        <Route path="leaves"     element={<LeaveManagement />} />
        <Route path="performance" element={<Performance />} />
        <Route path="reports"    element={<Reports />} />
        <Route path="org-chart"  element={<OrgChart />} />
        <Route path="settings"   element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <HRMProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </HRMProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
