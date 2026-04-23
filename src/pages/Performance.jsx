import React, { useState } from 'react';
import {
  Star, Target, TrendingUp, Award, ChevronDown, ChevronUp,
  Plus, Check, Clock, X, Edit3, BarChart2, Zap, Shield
} from 'lucide-react';
import { useHRM } from '../context/HRMContext';
import { useToast } from '../context/ToastContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS, RadialLinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RATING_LABELS = ['', 'Below Expectations', 'Needs Improvement', 'Meets Expectations', 'Exceeds Expectations', 'Outstanding'];
const RATING_COLORS = ['', '#f43f5e', '#f59e0b', '#38bdf8', '#10b981', '#6366f1'];

const initialReviews = [
  { id: 'REV001', empId: 'EMP001', empName: 'Jane Smith', department: 'Engineering', avatar: 'JS', avatarColor: '#6366f1', period: 'Q1 2026', overallRating: 5, technical: 5, communication: 4, leadership: 4, teamwork: 5, innovation: 5, status: 'Completed', reviewer: 'David Chen', comments: 'Outstanding performance. Delivered major features ahead of schedule.' },
  { id: 'REV002', empId: 'EMP004', empName: 'David Chen', department: 'Engineering', avatar: 'DC', avatarColor: '#10b981', period: 'Q1 2026', overallRating: 5, technical: 5, communication: 5, leadership: 5, teamwork: 4, innovation: 5, status: 'Completed', reviewer: 'CEO', comments: 'Exceptional VP. Team grew 40% under his leadership.' },
  { id: 'REV003', empId: 'EMP003', empName: 'Sarah Jones', department: 'Marketing', avatar: 'SJ', avatarColor: '#38bdf8', period: 'Q1 2026', overallRating: 4, technical: 3, communication: 5, leadership: 4, teamwork: 5, innovation: 4, status: 'Completed', reviewer: 'Mark Brown', comments: 'Great campaign results, strong communicator.' },
  { id: 'REV004', empId: 'EMP007', empName: 'Emily Liu', department: 'Engineering', avatar: 'EL', avatarColor: '#ec4899', period: 'Q1 2026', overallRating: 4, technical: 4, communication: 4, leadership: 3, teamwork: 5, innovation: 5, status: 'Completed', reviewer: 'David Chen', comments: 'Brilliant designer, pushes creative boundaries.' },
  { id: 'REV005', empId: 'EMP002', empName: 'Michael Doe', department: 'Sales', avatar: 'MD', avatarColor: '#f59e0b', period: 'Q1 2026', overallRating: 3, technical: 3, communication: 4, leadership: 3, teamwork: 4, innovation: 3, status: 'Completed', reviewer: 'Lisa Ray', comments: 'Meets targets consistently. Room to grow in strategic thinking.' },
  { id: 'REV006', empId: 'EMP010', empName: 'Carlos Mendez', department: 'Engineering', avatar: 'CM', avatarColor: '#0ea5e9', period: 'Q2 2026', overallRating: null, technical: null, communication: null, leadership: null, teamwork: null, innovation: null, status: 'Pending', reviewer: 'David Chen', comments: '' },
  { id: 'REV007', empId: 'EMP005', empName: 'Priya Patel', department: 'HR', avatar: 'PP', avatarColor: '#f43f5e', period: 'Q2 2026', overallRating: null, technical: null, communication: null, leadership: null, teamwork: null, innovation: null, status: 'In Progress', reviewer: 'Laura White', comments: '' },
];

const initialGoals = [
  { id: 'GL001', empId: 'EMP001', title: 'Launch v2.0 Platform', category: 'Product', deadline: '2026-06-30', progress: 75, status: 'On Track' },
  { id: 'GL002', empId: 'EMP001', title: 'Mentor 2 junior devs', category: 'Leadership', deadline: '2026-12-31', progress: 50, status: 'On Track' },
  { id: 'GL003', empId: 'EMP003', title: 'Increase brand awareness 30%', category: 'Marketing', deadline: '2026-09-30', progress: 60, status: 'On Track' },
  { id: 'GL004', empId: 'EMP004', title: 'Expand engineering team to 20', category: 'Growth', deadline: '2026-12-31', progress: 45, status: 'At Risk' },
  { id: 'GL005', empId: 'EMP002', title: 'Achieve $2M quota', category: 'Sales', deadline: '2026-12-31', progress: 38, status: 'At Risk' },
  { id: 'GL006', empId: 'EMP005', title: 'Complete HRMS implementation', category: 'Operations', deadline: '2026-07-31', progress: 90, status: 'On Track' },
];

const StarRating = ({ rating, max = 5, size = 16 }) => (
  <div style={{ display: 'flex', gap: '3px' }}>
    {Array.from({ length: max }, (_, i) => (
      <Star
        key={i}
        size={size}
        fill={i < rating ? RATING_COLORS[rating] : 'transparent'}
        color={i < rating ? RATING_COLORS[rating] : 'var(--text-muted)'}
      />
    ))}
  </div>
);

const GoalProgress = ({ goal }) => {
  const color = goal.status === 'On Track' ? 'var(--success)' : goal.status === 'At Risk' ? 'var(--warning)' : 'var(--danger)';
  return (
    <div className="perf-goal-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '3px' }}>{goal.title}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span className={`badge badge-${goal.category === 'Sales' ? 'warning' : goal.category === 'Leadership' ? 'primary' : 'info'}`} style={{ marginRight: '6px' }}>{goal.category}</span>
            Due {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color }}>{goal.progress}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${goal.progress}%`, background: color }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
        <span className={`badge ${goal.status === 'On Track' ? 'badge-success' : 'badge-warning'}`}>{goal.status}</span>
      </div>
    </div>
  );
};

export default function Performance() {
  useDocumentTitle('Performance');
  const { employees } = useHRM();
  const { toast } = useToast();
  const [reviews, setReviews] = useState(initialReviews);
  const [goals, setGoals] = useState(initialGoals);
  const [activeTab, setActiveTab] = useState('reviews');
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ technical: 3, communication: 3, leadership: 3, teamwork: 3, innovation: 3, comments: '' });

  const completed = reviews.filter(r => r.status === 'Completed');
  const pending = reviews.filter(r => r.status !== 'Completed');
  const avgRating = completed.reduce((a, r) => a + r.overallRating, 0) / (completed.length || 1);

  const topPerformers = [...completed].sort((a, b) => b.overallRating - a.overallRating).slice(0, 3);

  const openReview = (rev) => {
    setSelectedEmp(rev);
    if (rev.status !== 'Completed') {
      setShowReviewModal(true);
    }
  };

  const submitReview = () => {
    const overall = Math.round(
      (reviewForm.technical + reviewForm.communication + reviewForm.leadership + reviewForm.teamwork + reviewForm.innovation) / 5
    );
    setReviews(prev => prev.map(r =>
      r.id === selectedEmp.id
        ? { ...r, ...reviewForm, overallRating: overall, status: 'Completed' }
        : r
    ));
    setShowReviewModal(false);
    toast(`Review submitted for ${selectedEmp.empName}`, 'success');
  };

  const radarData = selectedEmp && selectedEmp.status === 'Completed' ? {
    labels: ['Technical', 'Communication', 'Leadership', 'Teamwork', 'Innovation'],
    datasets: [{
      label: selectedEmp.empName,
      data: [selectedEmp.technical, selectedEmp.communication, selectedEmp.leadership, selectedEmp.teamwork, selectedEmp.innovation],
      backgroundColor: 'rgba(99,102,241,0.15)',
      borderColor: '#6366f1',
      pointBackgroundColor: '#6366f1',
      pointRadius: 5,
    }],
  } : null;

  const radarOptions = {
    scales: {
      r: {
        min: 0, max: 5,
        ticks: { stepSize: 1, color: '#475569', backdropColor: 'transparent' },
        grid: { color: 'rgba(255,255,255,0.06)' },
        pointLabels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } },
        angleLines: { color: 'rgba(255,255,255,0.06)' },
      },
    },
    plugins: { legend: { display: false } },
    responsive: true, maintainAspectRatio: false,
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Performance Management</h1>
          <p className="page-subtitle">Review cycles, goal tracking, and employee scorecards</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => toast('New review cycle started!', 'success')}>
            <Plus size={15} /> Start Review Cycle
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '24px' }}>
        <div className="kpi-card accent-primary">
          <div className="kpi-icon primary"><Star size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{avgRating.toFixed(1)}</div>
            <div className="kpi-label">Avg Performance Rating</div>
            <StarRating rating={Math.round(avgRating)} size={13} />
          </div>
        </div>
        <div className="kpi-card accent-success">
          <div className="kpi-icon success"><Check size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{completed.length}</div>
            <div className="kpi-label">Reviews Completed</div>
            <div className="kpi-change up"><TrendingUp size={12} /> This quarter</div>
          </div>
        </div>
        <div className="kpi-card accent-warning">
          <div className="kpi-icon warning"><Clock size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{pending.length}</div>
            <div className="kpi-label">Reviews Pending</div>
            <div className="kpi-change down"><Clock size={12} /> Needs action</div>
          </div>
        </div>
        <div className="kpi-card accent-info">
          <div className="kpi-icon info"><Target size={20} /></div>
          <div className="kpi-body">
            <div className="kpi-value">{Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length)}%</div>
            <div className="kpi-label">Avg Goal Progress</div>
            <div className="kpi-change up"><TrendingUp size={12} /> On track</div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div className="card-title"><Award size={16} style={{ display: 'inline', marginRight: '6px', color: 'var(--warning)' }} />Top Performers — Q1 2026</div>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {topPerformers.map((rev, i) => (
            <div key={rev.id} className="perf-top-card">
              <div className="perf-top-rank">{['🥇', '🥈', '🥉'][i]}</div>
              <div className="avatar avatar-lg" style={{ background: rev.avatarColor, color: 'white', margin: '0 auto 8px' }}>
                {rev.avatar}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', textAlign: 'center' }}>{rev.empName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '8px' }}>{rev.department}</div>
              <StarRating rating={rev.overallRating} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'center' }}>{RATING_LABELS[rev.overallRating]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
          <BarChart2 size={15} /> Review Cycle
        </button>
        <button className={`tab-btn ${activeTab === 'goals' ? 'active' : ''}`} onClick={() => setActiveTab('goals')}>
          <Target size={15} /> Goal Tracking
        </button>
        <button className={`tab-btn ${activeTab === 'scorecard' ? 'active' : ''}`} onClick={() => setActiveTab('scorecard')}>
          <Zap size={15} /> Scorecard
        </button>
      </div>

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Period</th>
                <th>Reviewer</th>
                <th>Overall Rating</th>
                <th>Technical</th>
                <th>Communication</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(rev => (
                <tr key={rev.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="avatar avatar-sm" style={{ background: rev.avatarColor, color: 'white' }}>{rev.avatar}</div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{rev.empName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rev.department}</div>
                      </div>
                    </div>
                  </td>
                  <td>{rev.period}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{rev.reviewer}</td>
                  <td>
                    {rev.overallRating
                      ? <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <StarRating rating={rev.overallRating} size={14} />
                          <span style={{ fontSize: '0.8rem', color: RATING_COLORS[rev.overallRating], fontWeight: 700 }}>{rev.overallRating}/5</span>
                        </div>
                      : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Not rated</span>
                    }
                  </td>
                  <td>{rev.technical ? `${rev.technical}/5` : '—'}</td>
                  <td>{rev.communication ? `${rev.communication}/5` : '—'}</td>
                  <td>
                    <span className={`badge ${rev.status === 'Completed' ? 'badge-success' : rev.status === 'In Progress' ? 'badge-warning' : 'badge-muted'}`}>
                      {rev.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${rev.status === 'Completed' ? 'btn-ghost' : 'btn-primary'}`}
                      onClick={() => openReview(rev)}
                    >
                      {rev.status === 'Completed' ? <><Edit3 size={13} /> View</> : <><Plus size={13} /> Submit</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {goals.map(goal => <GoalProgress key={goal.id} goal={goal} />)}
          </div>
        </div>
      )}

      {/* Scorecard Tab */}
      {activeTab === 'scorecard' && (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div className="card">
            <div className="card-header"><div className="card-title">Select Employee</div></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {completed.map(rev => (
                <div
                  key={rev.id}
                  onClick={() => setSelectedEmp(rev)}
                  className="perf-emp-row"
                  style={{ background: selectedEmp?.id === rev.id ? 'var(--accent-primary-soft)' : 'transparent', borderColor: selectedEmp?.id === rev.id ? 'var(--accent-primary)' : 'var(--border)' }}
                >
                  <div className="avatar avatar-sm" style={{ background: rev.avatarColor, color: 'white' }}>{rev.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{rev.empName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rev.department}</div>
                  </div>
                  <StarRating rating={rev.overallRating} size={13} />
                </div>
              ))}
            </div>
          </div>
          {selectedEmp && selectedEmp.status === 'Completed' ? (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">{selectedEmp.empName}'s Scorecard</div>
                  <div className="card-subtitle">{selectedEmp.period} · Reviewed by {selectedEmp.reviewer}</div>
                </div>
                <div className="badge badge-success" style={{ fontSize: '1rem', padding: '6px 14px' }}>
                  {selectedEmp.overallRating}/5 ⭐
                </div>
              </div>
              <div style={{ height: '240px', marginBottom: '16px' }}>
                <Radar data={radarData} options={radarOptions} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                {['technical', 'communication', 'leadership', 'teamwork', 'innovation'].map(key => (
                  <div key={key} style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize', marginBottom: '4px' }}>{key}</div>
                    <StarRating rating={selectedEmp[key]} size={14} />
                  </div>
                ))}
              </div>
              {selectedEmp.comments && (
                <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '14px', borderLeft: '3px solid var(--accent-primary)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Reviewer Comments</div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{selectedEmp.comments}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <Shield size={48} style={{ marginBottom: '12px', opacity: 0.3 }} />
                <p>Select an employee to view their scorecard</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Review Submit Modal */}
      {showReviewModal && selectedEmp && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Submit Review — {selectedEmp.empName}</div>
              <button className="modal-close" onClick={() => setShowReviewModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Rate performance in each category from 1 (Below Expectations) to 5 (Outstanding).
              </p>
              {['technical', 'communication', 'leadership', 'teamwork', 'innovation'].map(key => (
                <div className="form-group" key={key}>
                  <label className="form-label" style={{ textTransform: 'capitalize' }}>{key}</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map(v => (
                      <button
                        key={v}
                        onClick={() => setReviewForm(f => ({ ...f, [key]: v }))}
                        style={{
                          flex: 1, padding: '10px', border: '1px solid',
                          borderColor: reviewForm[key] >= v ? RATING_COLORS[reviewForm[key]] : 'var(--border)',
                          background: reviewForm[key] >= v ? RATING_COLORS[reviewForm[key]] + '20' : 'var(--bg-surface)',
                          borderRadius: 'var(--radius-md)', cursor: 'pointer',
                          color: reviewForm[key] >= v ? RATING_COLORS[reviewForm[key]] : 'var(--text-muted)',
                          fontWeight: 700, fontSize: '0.875rem', transition: 'var(--transition)',
                        }}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: RATING_COLORS[reviewForm[key]], marginTop: '4px' }}>
                    {RATING_LABELS[reviewForm[key]]}
                  </div>
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Comments</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Write your performance comments..."
                  value={reviewForm.comments}
                  onChange={e => setReviewForm(f => ({ ...f, comments: e.target.value }))}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowReviewModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submitReview}><Check size={15} /> Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
