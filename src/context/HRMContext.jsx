import React, { createContext, useContext, useState, useCallback } from 'react';
import { employees as initialEmployees, payrollData as initialPayroll, attendanceSummary, candidates as initialCandidates } from '../data/mockData';

const HRMContext = createContext(null);

export const useHRM = () => {
  const ctx = useContext(HRMContext);
  if (!ctx) throw new Error('useHRM must be used inside HRMProvider');
  return ctx;
};

export const HRMProvider = ({ children }) => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [candidates, setCandidates] = useState(initialCandidates);
  const [leaveRequests, setLeaveRequests] = useState([
    { id:'LV001', empId:'EMP006', name:'Tom Wilson', department:'Finance', avatar:'TW', avatarColor:'#8b5cf6', type:'Medical', from:'2026-04-20', to:'2026-04-23', days:3, reason:'Medical procedure recovery', status:'Approved', appliedOn:'2026-04-18' },
    { id:'LV002', empId:'EMP009', name:'Anna Ross', department:'Marketing', avatar:'AR', avatarColor:'#a855f7', type:'Annual', from:'2026-05-05', to:'2026-05-09', days:5, reason:'Family vacation', status:'Pending', appliedOn:'2026-04-20' },
    { id:'LV003', empId:'EMP003', name:'Sarah Jones', department:'Marketing', avatar:'SJ', avatarColor:'#38bdf8', type:'Personal', from:'2026-04-29', to:'2026-04-29', days:1, reason:'Personal appointment', status:'Pending', appliedOn:'2026-04-21' },
    { id:'LV004', empId:'EMP008', name:'James Carter', department:'Sales', avatar:'JC', avatarColor:'#14b8a6', type:'Annual', from:'2026-05-12', to:'2026-05-16', days:5, reason:'Holiday trip', status:'Rejected', appliedOn:'2026-04-15' },
    { id:'LV005', empId:'EMP005', name:'Priya Patel', department:'HR', avatar:'PP', avatarColor:'#f43f5e', type:'Sick', from:'2026-04-22', to:'2026-04-22', days:1, reason:'Feeling unwell', status:'Approved', appliedOn:'2026-04-22' },
  ]);

  // ── Employee CRUD ──────────────────────────────────
  const addEmployee = useCallback((emp) => {
    setEmployees(prev => [...prev, emp]);
  }, []);

  const updateEmployee = useCallback((updated) => {
    setEmployees(prev => prev.map(e => e.id === updated.id ? updated : e));
  }, []);

  const deleteEmployee = useCallback((id) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  }, []);

  // ── Leave Management ──────────────────────────────
  const submitLeave = useCallback((req) => {
    setLeaveRequests(prev => [...prev, { ...req, id: `LV${Date.now()}`, status: 'Pending', appliedOn: new Date().toISOString().split('T')[0] }]);
  }, []);

  const updateLeaveStatus = useCallback((id, status) => {
    setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }, []);

  // ── Candidate pipeline ────────────────────────────
  const moveCandidate = useCallback((id, stage) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, stage } : c));
  }, []);

  // ── Derived stats ─────────────────────────────────
  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'Active').length,
    onLeave: employees.filter(e => e.status === 'On Leave').length,
    pendingLeaves: leaveRequests.filter(r => r.status === 'Pending').length,
    monthlyPayroll: employees.reduce((a, e) => a + Math.round(e.salary / 12), 0),
  };

  return (
    <HRMContext.Provider value={{
      employees, addEmployee, updateEmployee, deleteEmployee,
      candidates, moveCandidate,
      leaveRequests, submitLeave, updateLeaveStatus,
      stats,
    }}>
      {children}
    </HRMContext.Provider>
  );
};
