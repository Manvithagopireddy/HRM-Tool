import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Briefcase, CalendarDays, DollarSign,
  Settings, LogOut, Users2, CalendarClock, BarChart2, Star, GitBranch, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHRM } from '../context/HRMContext';
import { useToast } from '../context/ToastContext';

const NAV_SECTIONS = [
  {
    label: 'Core',
    items: [
      { to: '/',           label: 'Dashboard',   icon: <LayoutDashboard size={17}/>, end: true },
      { to: '/employees',  label: 'Employees',   icon: <Users size={17}/> },
      { to: '/attendance', label: 'Attendance',  icon: <CalendarDays size={17}/> },
      { to: '/payroll',    label: 'Payroll',     icon: <DollarSign size={17}/> },
    ],
  },
  {
    label: 'People',
    items: [
      { to: '/recruitment', label: 'Recruitment', icon: <Briefcase size={17}/>,    badgeKey: 'openJobs' },
      { to: '/leaves',      label: 'Leave Mgmt',  icon: <CalendarClock size={17}/>, badgeKey: 'pendingLeaves' },
      { to: '/performance', label: 'Performance', icon: <Star size={17}/> },
      { to: '/org-chart',   label: 'Org Chart',   icon: <GitBranch size={17}/> },
    ],
  },
  {
    label: 'Insights',
    items: [
      { to: '/reports', label: 'Reports', icon: <BarChart2 size={17}/> },
    ],
  },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { stats } = useHRM();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const badges = {
    openJobs: 5,
    pendingLeaves: stats.pendingLeaves || null,
  };

  const handleLogoutClick = () => {
    if (confirmLogout) {
      toast('Signed out successfully.', 'info');
      logout();
    } else {
      setConfirmLogout(true);
      // Auto-cancel after 3s if user doesn't confirm
      setTimeout(() => setConfirmLogout(false), 3000);
    }
  };

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Users2 color="white" size={21}/>
        </div>
        <div className="sidebar-brand-text">
          <div className="sidebar-brand-name">PeopleCore</div>
          <div className="sidebar-brand-sub">Enterprise Suite</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            <div className="sidebar-section">{section.label}</div>
            {section.items.map(item => {
              const badge = item.badgeKey ? badges[item.badgeKey] : null;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                >
                  <span className="nav-item-icon">{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {badge ? <span className="nav-badge">{badge}</span> : null}
                </NavLink>
              );
            })}
          </div>
        ))}

        <div className="sidebar-section" style={{ marginTop: '8px' }}>System</div>
        <NavLink to="/settings" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-item-icon"><Settings size={17}/></span>
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* User Footer — separated info from logout */}
      <div className="sidebar-footer">
        {/* User info row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 10px 6px',
        }}>
          <div
            className="avatar avatar-sm"
            style={{
              background: '#2a2a2a',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {user?.avatar || 'AD'}
          </div>
          <div className="sidebar-user-info" style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Admin User'}
            </div>
            <div className="sidebar-user-role">{user?.role || 'HR Manager'}</div>
          </div>
        </div>

        {/* Separate Logout button */}
        <button
          id="sidebar-logout"
          onClick={handleLogoutClick}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            width: '100%', padding: '8px 10px',
            background: confirmLogout ? 'var(--danger-soft)' : 'transparent',
            border: `1px solid ${confirmLogout ? 'rgba(244,63,94,0.3)' : 'transparent'}`,
            borderRadius: 'var(--radius-md)',
            color: confirmLogout ? 'var(--danger)' : 'var(--text-muted)',
            fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
            transition: 'var(--transition)', fontFamily: 'inherit',
            marginTop: '2px',
          }}
          onMouseEnter={e => {
            if (!confirmLogout) {
              e.currentTarget.style.background = 'var(--bg-hover)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }
          }}
          onMouseLeave={e => {
            if (!confirmLogout) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }
          }}
          title={confirmLogout ? 'Click again to confirm sign out' : 'Sign out'}
        >
          <LogOut size={14}/>
          {confirmLogout ? 'Click to confirm sign out' : 'Sign Out'}
          {confirmLogout && <ChevronRight size={13} style={{ marginLeft: 'auto' }}/>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
