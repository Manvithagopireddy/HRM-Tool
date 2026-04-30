import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { employeeApi, leaveApi, recruitmentApi, dashboardApi } from '../utils/api';
import { useAuth } from './AuthContext';

const HRMContext = createContext(null);

export const useHRM = () => {
  const ctx = useContext(HRMContext);
  if (!ctx) throw new Error('useHRM must be used inside HRMProvider');
  return ctx;
};

export const HRMProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [employees, setEmployees] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    onLeave: 0,
    pendingLeaves: 0,
    monthlyPayroll: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [emps, cands, leaves, dashboardStats] = await Promise.all([
        employeeApi.getAll(),
        recruitmentApi.getAllCandidates(),
        leaveApi.getAll(),
        dashboardApi.getStats()
      ]);
      setEmployees(emps || []);
      setCandidates(cands || []);
      setLeaveRequests(leaves || []);
      if (dashboardStats) {
        setStats({
          totalEmployees: dashboardStats.totalEmployees,
          activeEmployees: dashboardStats.activeEmployees,
          onLeave: dashboardStats.onLeave,
          pendingLeaves: dashboardStats.pendingLeaves,
          monthlyPayroll: dashboardStats.monthlyPayroll,
          avgPerformanceScore: dashboardStats.avgPerformanceScore,
          employeesByDepartment: dashboardStats.employeesByDepartment,
          candidatesByStage: dashboardStats.candidatesByStage,
          months: dashboardStats.months,
          payrollTrend: dashboardStats.payrollTrend,
        });
      }
    } catch (err) {
      console.error('Failed to load HRM data', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Employee CRUD ──────────────────────────────────
  const addEmployee = useCallback(async (emp) => {
    try {
      const created = await employeeApi.create(emp);
      setEmployees(prev => [...prev, created]);
      // Refresh dashboard stats
      loadData();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [loadData]);

  const updateEmployee = useCallback(async (updated) => {
    try {
      const res = await employeeApi.update(updated.id, updated);
      setEmployees(prev => prev.map(e => e.id === res.id ? res : e));
      loadData();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [loadData]);

  const deleteEmployee = useCallback(async (id) => {
    try {
      await employeeApi.remove(id);
      setEmployees(prev => prev.filter(e => e.id !== id));
      loadData();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [loadData]);

  // ── Leave Management ──────────────────────────────
  const submitLeave = useCallback(async (req) => {
    try {
      const res = await leaveApi.submit(req);
      setLeaveRequests(prev => [...prev, res]);
      loadData();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [loadData]);

  const updateLeaveStatus = useCallback(async (id, status) => {
    try {
      const res = await leaveApi.updateStatus(id, status);
      setLeaveRequests(prev => prev.map(r => r.id === id ? res : r));
      loadData();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [loadData]);

  // ── Candidate pipeline ────────────────────────────
  const moveCandidate = useCallback(async (id, stage) => {
    try {
      const res = await recruitmentApi.moveCandidate(id, stage);
      setCandidates(prev => prev.map(c => c.id === id ? res : c));
      loadData();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [loadData]);

  return (
    <HRMContext.Provider value={{
      employees, addEmployee, updateEmployee, deleteEmployee,
      candidates, moveCandidate,
      leaveRequests, submitLeave, updateLeaveStatus,
      stats, loading, refreshData: loadData
    }}>
      {children}
    </HRMContext.Provider>
  );
};
