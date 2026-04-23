import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Briefcase, CalendarDays, DollarSign,
  Settings, LogOut, Target, CalendarClock, BarChart2, Star, GitBranch
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHRM } from '../context/HRMContext';
import { useToast } from '../context/ToastContext';

const NAV_SECTIONS = [
  {
    label: 'Core',
    items: [
      { to: '/', label: 'Dashboard',    icon: <LayoutDashboard size={17}/>, end: true },
      { to: '/employees',  label: 'Employees',   icon: <Users size={17}/> },
      { to: '/attendance', label: 'Attendance',  icon: <CalendarDays size={17}/> },
      { to: '/payroll',    label: 'Payroll',     icon: <DollarSign size={17}/> },
    ],
  },
  {
    label: 'People',
    items: [
      { to: '/recruitment',  label: 'Recruitment',  icon: <Briefcase size={17}/>, badgeKey: 'openJobs' },
      { to: '/leaves',       label: 'Leave Mgmt',   icon: <CalendarClock size={17}/>, badgeKey: 'pendingLeaves' },
      { to: '/performance',  label: 'Performance',  icon: <Star size={17}/> },
      { to: '/org-chart',    label: 'Org Chart',    icon: <GitBranch size={17}/> },
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

  const badges = {
    openJobs: 5,
    pendingLeaves: stats.pendingLeaves || null,
  };

  const handleLogout = () => {
    toast('Signed out successfully.', 'info');
    logout();
  };

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Target color="white" size={21}/>
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

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user" onClick={handleLogout} title="Sign out">
          <div className="avatar avatar-sm" style={{ background: 'var(--grad-primary)', color: 'white', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {user?.avatar || 'AD'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'Admin User'}</div>
            <div className="sidebar-user-role">{user?.role || 'HR Manager'}</div>
          </div>
          <LogOut size={14} color="var(--text-muted)"/>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
