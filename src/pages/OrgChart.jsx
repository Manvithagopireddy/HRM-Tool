import React, { useState } from 'react';
import { Users, ChevronDown, ChevronUp, Mail, Phone, Building, MapPin, Briefcase } from 'lucide-react';
import { useHRM } from '../context/HRMContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

const DEPT_COLORS = {
  Engineering: '#e5e7eb',
  Sales:       '#9ca3af',
  Marketing:   '#6b7280',
  HR:          '#4b5563',
  Finance:     '#374151',
};

// Build tree: CEO > VP-level > rest
const buildTree = (employees) => {
  const vps = employees.filter(e => e.manager === 'CEO');
  return {
    id: 'CEO',
    name: 'Alexandra Pierce',
    role: 'Chief Executive Officer',
    department: 'Executive',
    avatar: 'AP',
    avatarColor: '#374151',
    email: 'ceo@peoplecore.com',
    location: 'New York',
    children: vps.map(vp => ({
      ...vp,
      children: employees
        .filter(e => e.manager === vp.name)
        .map(emp => ({ ...emp, children: [] })),
    })),
  };
};

const OrgCard = ({ node, depth = 0 }) => {
  const [expanded, setExpanded] = useState(true);
  const [hovered, setHovered] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const color = DEPT_COLORS[node.department] || '#6366f1';

  return (
    <div className="org-node-wrap">
      <div
        className="org-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ '--dept-color': color }}
      >
        <div className="org-card-accent" />
        <div className="org-card-body">
          <div className="avatar avatar-lg" style={{ background: node.avatarColor || color, color: 'white', margin: '0 auto 10px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {node.avatar}
          </div>
          <div className="org-card-name">{node.name}</div>
          <div className="org-card-role">{node.role}</div>
          {node.department !== 'Executive' && (
            <span className="badge" style={{ background: color + '20', color, marginTop: '6px', fontSize: '0.7rem' }}>
              {node.department}
            </span>
          )}
          {node.email && (
            <div className="org-card-email">
              <Mail size={11} />{node.email}
            </div>
          )}
          {node.location && (
            <div className="org-card-email">
              <MapPin size={11} />{node.location}
            </div>
          )}
        </div>
        {hasChildren && (
          <button
            className="org-expand-btn"
            onClick={() => setExpanded(e => !e)}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            <span>{node.children.length}</span>
          </button>
        )}
      </div>

      {hasChildren && expanded && (
        <div className="org-children">
          <div className="org-connector-vertical" />
          <div className="org-children-row">
            {node.children.map((child, i) => (
              <div key={child.id || child.name} className="org-child-wrap">
                {node.children.length > 1 && (
                  <div
                    className="org-connector-horizontal"
                    style={{
                      left: i === 0 ? '50%' : 0,
                      right: i === node.children.length - 1 ? '50%' : 0,
                      width: i === 0 ? '50%' : i === node.children.length - 1 ? '50%' : '100%',
                    }}
                  />
                )}
                <div className="org-connector-down" />
                <OrgCard node={child} depth={depth + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function OrgChart() {
  useDocumentTitle('Org Chart');
  const { employees } = useHRM();
  const [view, setView] = useState('chart');
  const tree = buildTree(employees);

  const deptGroups = employees.reduce((acc, e) => {
    if (!acc[e.department]) acc[e.department] = [];
    acc[e.department].push(e);
    return acc;
  }, {});

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Org Chart</h1>
          <p className="page-subtitle">Company hierarchy, team structures, and reporting lines</p>
        </div>
        <div className="page-header-actions">
          <div className="tabs" style={{ marginBottom: 0 }}>
            <button className={`tab-btn ${view === 'chart' ? 'active' : ''}`} onClick={() => setView('chart')}>
              <Users size={14} /> Tree View
            </button>
            <button className={`tab-btn ${view === 'dept' ? 'active' : ''}`} onClick={() => setView('dept')}>
              <Building size={14} /> By Department
            </button>
          </div>
        </div>
      </div>

      {view === 'chart' && (
        <div className="card" style={{ overflowX: 'auto', overflowY: 'auto', minHeight: '500px' }}>
          <div style={{ minWidth: '900px', padding: '32px 16px', display: 'flex', justifyContent: 'center' }}>
            <OrgCard node={tree} />
          </div>
        </div>
      )}

      {view === 'dept' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {Object.entries(deptGroups).map(([dept, emps]) => {
            const color = DEPT_COLORS[dept] || '#6366f1';
            return (
              <div key={dept} className="card">
                <div className="card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: color, flexShrink: 0,
                    }} />
                    <div className="card-title">{dept}</div>
                    <span className="badge" style={{ background: color + '20', color }}>{emps.length} members</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                  {emps.map(emp => (
                    <div key={emp.id} className="dept-emp-card" style={{ '--dept-color': color }}>
                      <div className="avatar avatar-md" style={{ background: emp.avatarColor, color: 'white', flexShrink: 0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {emp.avatar}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.role}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <span className={`badge badge-sm ${emp.status === 'Active' ? 'badge-success' : emp.status === 'On Leave' ? 'badge-warning' : 'badge-muted'}`} style={{ fontSize: '0.65rem' }}>
                            {emp.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
