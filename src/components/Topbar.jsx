import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, X, TrendingUp, Users, Calendar, DollarSign, Star, BarChart2 } from 'lucide-react';
import Fuse from 'fuse.js';
import { useAuth } from '../context/AuthContext';
import { useHRM } from '../context/HRMContext';

const pageMeta = {
  '/':            { title: 'Dashboard',           sub: 'Your workspace at a glance' },
  '/employees':   { title: 'Employees',           sub: 'Manage your workforce' },
  '/attendance':  { title: 'Attendance',          sub: 'Track daily presence & time' },
  '/payroll':     { title: 'Payroll',             sub: 'Salaries, payslips & payroll runs' },
  '/recruitment': { title: 'Recruitment',         sub: 'Hire and onboard great talent' },
  '/leaves':      { title: 'Leave Management',    sub: 'Approve, reject & track requests' },
  '/performance': { title: 'Performance',         sub: 'Goals, reviews & team ratings' },
  '/reports':     { title: 'Reports & Analytics', sub: 'Insights across your organisation' },
  '/org-chart':   { title: 'Org Chart',           sub: 'Visualise your team structure' },
  '/settings':    { title: 'Settings',            sub: 'Configure your preferences' },
};

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const meta     = pageMeta[location.pathname] || { title: 'PeopleCore', sub: 'Enterprise HR Suite' };
  const { user }   = useAuth();
  const { stats, employees }  = useHRM();

  const [showNotifs, setShowNotifs] = useState(false);
  const [notifRead,  setNotifRead]  = useState(false);
  const [search,     setSearch]     = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  const subtitle = location.pathname === '/'
    ? `Welcome back, ${user?.name?.split(' ')[0] || 'there'}! Here's what's happening.`
    : meta.sub;

  // ── Fuse.js search ──────────────────────────────────────────────────────
  const fuse = useMemo(() => new Fuse(employees, {
    keys: ['name', 'role', 'department', 'email', 'id', 'location'],
    threshold: 0.35,
    minMatchCharLength: 2,
    includeScore: true,
  }), [employees]);

  const searchResults = useMemo(() => {
    if (!search.trim() || search.length < 2) return [];
    return fuse.search(search).slice(0, 6);
  }, [search, fuse]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelectEmployee = (emp) => {
    navigate('/employees');
    setSearch('');
    setShowSearch(false);
  };

  // ── Notifications ───────────────────────────────────────────────────────
  const notifications = [
    { id: 1, text: 'Payroll processed successfully',                time: '5m ago',  icon: <DollarSign size={14}/>, color: 'var(--success)' },
    { id: 2, text: `${stats.pendingLeaves} leave requests pending`, time: '1h ago',  icon: <Calendar size={14}/>,   color: 'var(--warning)' },
    { id: 3, text: 'New recruitment applications received',         time: '2h ago',  icon: <Users size={14}/>,      color: 'var(--info)' },
    { id: 4, text: 'Q2 performance review scheduled',              time: '1d ago',  icon: <TrendingUp size={14}/>, color: 'var(--accent-primary)' },
    { id: 5, text: 'Monthly reports are ready to export',          time: '2d ago',  icon: <BarChart2 size={14}/>,  color: 'var(--accent-secondary)' },
  ];
  const unreadCount = notifRead ? 0 : notifications.length;


  return (
    <header className="topbar">
      {/* spacer so search/actions stay right-aligned */}
      <div style={{ flex: 1 }} />

      {/* Search with Fuse.js */}
      <div ref={searchRef} style={{ position: 'relative' }}>
        <div className="topbar-search" style={{ minWidth: 260 }}>
          <Search size={15} color="var(--text-muted)"/>
          <input
            id="topbar-search"
            type="text"
            placeholder="Search employees, roles..."
            value={search}
            onChange={e => { setSearch(e.target.value); setShowSearch(true); }}
            onFocus={() => setShowSearch(true)}
            aria-label="Global employee search"
            autoComplete="off"
          />
          {search && (
            <button
              onClick={() => { setSearch(''); setShowSearch(false); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '2px' }}
              aria-label="Clear search"
            >
              <X size={14}/>
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showSearch && search.length >= 2 && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
            background: 'var(--bg-card)', border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
            zIndex: 300, overflow: 'hidden',
            animation: 'slideUp 0.15s ease',
          }}>
            {searchResults.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No employees found for "{search}"
              </div>
            ) : (
              <>
                <div style={{ padding: '8px 14px 4px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </div>
                {searchResults.map(({ item: emp }) => (
                  <div
                    key={emp.id}
                    onClick={() => handleSelectEmployee(emp)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 14px', cursor: 'pointer', transition: 'var(--transition)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div className="avatar avatar-sm" style={{ background: emp.avatarColor, color: 'white', flexShrink: 0 }}>
                      {emp.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{emp.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1px' }}>{emp.role} · {emp.department}</div>
                    </div>
                    <span className={`badge badge-${emp.status === 'Active' ? 'success' : emp.status === 'On Leave' ? 'warning' : 'muted'}`} style={{ fontSize: '0.65rem' }}>
                      {emp.status}
                    </span>
                  </div>
                ))}
                <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)' }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem' }}
                    onClick={() => { navigate('/employees'); setSearch(''); setShowSearch(false); }}
                  >
                    View all employees →
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="topbar-actions">
        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            id="topbar-notifications"
            className="icon-btn"
            onClick={() => { setShowNotifs(p => !p); setNotifRead(true); }}
            aria-label={`Notifications — ${unreadCount} unread`}
          >
            <Bell size={18}/>
            {unreadCount > 0 && <span className="notif-dot"/>}
          </button>

          {showNotifs && (
            <>
              <div onClick={() => setShowNotifs(false)} style={{ position: 'fixed', inset: 0, zIndex: 200 }}/>
              <div style={{
                position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '320px',
                background: 'var(--bg-card)', border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
                zIndex: 201, overflow: 'hidden', animation: 'slideUp 0.18s ease',
              }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Notifications</span>
                  {unreadCount > 0
                    ? <span className="badge badge-primary">{unreadCount} new</span>
                    : <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>All caught up</span>
                  }
                </div>
                {notifications.map(n => (
                  <div key={n.id}
                    style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'var(--transition)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: `color-mix(in srgb, ${n.color} 15%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: n.color }}>
                      {n.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 500 }}>{n.text}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{n.time}</div>
                    </div>
                  </div>
                ))}
                <div style={{ padding: '10px 16px' }}>
                  <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowNotifs(false)}>
                    Dismiss all
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User avatar */}
        <div
          className="avatar avatar-sm"
          style={{ background: '#2a2a2a', border: '1px solid rgba(255,255,255,0.15)', color: '#f9fafb', cursor: 'pointer' }}
          title={user?.name || 'User'}
        >
          {user?.avatar || 'AD'}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
