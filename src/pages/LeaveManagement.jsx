import React, { useState } from 'react';
import { Plus, Check, X, Clock, CalendarDays, ChevronDown } from 'lucide-react';
import { useHRM } from '../context/HRMContext';
import { useToast } from '../context/ToastContext';

const LEAVE_TYPES = ['Annual', 'Sick', 'Medical', 'Personal', 'Maternity', 'Paternity', 'Unpaid'];

const statusConfig = {
  Pending:  { cls: 'badge-warning', icon: <Clock size={12}/> },
  Approved: { cls: 'badge-success', icon: <Check size={12}/> },
  Rejected: { cls: 'badge-danger',  icon: <X size={12}/> },
};

const NewLeaveModal = ({ onClose, onSubmit, employees }) => {
  const [form, setForm] = useState({
    empId: employees[0]?.id || '',
    type: 'Annual',
    from: '',
    to: '',
    reason: '',
  });

  const calcDays = () => {
    if (!form.from || !form.to) return 0;
    const diff = (new Date(form.to) - new Date(form.from)) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.round(diff) + 1);
  };

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === form.empId);
    onSubmit({
      empId: form.empId,
      name: emp?.name,
      department: emp?.department,
      avatar: emp?.avatar,
      avatarColor: emp?.avatarColor,
      type: form.type,
      from: form.from,
      to: form.to,
      days: calcDays(),
      reason: form.reason,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal slide-up">
        <div className="modal-header">
          <span className="modal-title">📅 New Leave Request</span>
          <button className="modal-close" onClick={onClose}><X size={16}/></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Employee <span>*</span></label>
              <select className="form-control" name="empId" value={form.empId} onChange={handle} required>
                {employees.filter(e => e.status !== 'Inactive').map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.department})</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Leave Type <span>*</span></label>
                <select className="form-control" name="type" value={form.type} onChange={handle}>
                  {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Duration</label>
                <div className="form-control" style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
                  {calcDays()} day{calcDays() !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">From Date <span>*</span></label>
                <input className="form-control" type="date" name="from" value={form.from} onChange={handle} required/>
              </div>
              <div className="form-group">
                <label className="form-label">To Date <span>*</span></label>
                <input className="form-control" type="date" name="to" value={form.to} min={form.from} onChange={handle} required/>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Reason</label>
              <textarea className="form-control" name="reason" value={form.reason} onChange={handle} placeholder="Briefly describe the reason for leave..." style={{ minHeight: '80px' }}/>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Submit Request</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LeaveManagement = () => {
  const { leaveRequests, submitLeave, updateLeaveStatus, employees } = useHRM();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');

  const filtered = leaveRequests.filter(r => {
    if (filterStatus !== 'All' && r.status !== filterStatus) return false;
    if (filterType !== 'All' && r.type !== filterType) return false;
    return true;
  });

  const handleSubmit = (req) => {
    submitLeave(req);
    toast('Leave request submitted successfully!', 'success');
  };

  const handleApprove = (id) => {
    updateLeaveStatus(id, 'Approved');
    toast('Leave request approved.', 'success');
  };

  const handleReject = (id) => {
    updateLeaveStatus(id, 'Rejected');
    toast('Leave request rejected.', 'error');
  };

  const pending = leaveRequests.filter(r => r.status === 'Pending').length;
  const approved = leaveRequests.filter(r => r.status === 'Approved').length;
  const totalDays = leaveRequests.filter(r => r.status === 'Approved').reduce((a, r) => a + r.days, 0);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Leave Management</h1>
          <div className="page-subtitle">Review and approve employee leave requests</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16}/> New Request
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Pending Requests', value: pending, color: 'warning', icon: <Clock size={22}/> },
          { label: 'Approved This Month', value: approved, color: 'success', icon: <Check size={22}/> },
          { label: 'Days on Leave', value: totalDays, color: 'info', icon: <CalendarDays size={22}/> },
          { label: 'Total Requests', value: leaveRequests.length, color: 'primary', icon: <CalendarDays size={22}/> },
        ].map(k => (
          <div key={k.label} className={`kpi-card accent-${k.color}`}>
            <div className={`kpi-icon ${k.color}`}>{k.icon}</div>
            <div className="kpi-body">
              <div className="kpi-value">{k.value}</div>
              <div className="kpi-label">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="filter-bar" style={{ marginBottom: 0 }}>
          {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
            <button key={s} className={`filter-chip ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
          ))}
        </div>
        <select className="form-control" style={{ width: 'auto', padding: '5px 12px', fontSize: '0.8rem' }} value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="All">All Types</option>
          {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Applied On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9}>
                <div className="empty-state">
                  <CalendarDays size={44} className="empty-state-icon"/>
                  <div className="empty-state-title">No leave requests found</div>
                  <div className="empty-state-text">Try adjusting your filters.</div>
                </div>
              </td></tr>
            ) : filtered.map(req => {
              const sc = statusConfig[req.status];
              return (
                <tr key={req.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="avatar avatar-sm" style={{ background: req.avatarColor, color: 'white' }}>{req.avatar}</div>
                      <div>
                        <strong>{req.name}</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{req.department}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-primary">{req.type}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{req.from}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{req.to}</td>
                  <td><strong>{req.days}</strong></td>
                  <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{req.reason || '—'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{req.appliedOn}</td>
                  <td>
                    <span className={`badge ${sc.cls}`}>{sc.icon} {req.status}</span>
                  </td>
                  <td>
                    {req.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-sm btn-success" onClick={() => handleApprove(req.id)}>
                          <Check size={13}/> Approve
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleReject(req.id)}>
                          <X size={13}/> Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && <NewLeaveModal onClose={() => setShowModal(false)} onSubmit={handleSubmit} employees={employees}/>}
    </div>
  );
};

export default LeaveManagement;
