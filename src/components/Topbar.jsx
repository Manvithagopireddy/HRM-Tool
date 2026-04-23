import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, X, TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHRM } from '../context/HRMContext';

const pageMeta = {
  '/':            { title:'Dashboard',       sub:'Welcome back!' },
  '/employees':   { title:'Employees',       sub:'Manage your workforce' },
  '/attendance':  { title:'Attendance',      sub:'Track daily presence' },
  '/payroll':     { title:'Payroll',         sub:'Salaries & payslips' },
  '/recruitment': { title:'Recruitment',     sub:'Hire great talent' },
  '/leaves':      { title:'Leave Management',sub:'Approve or reject requests' },
  '/settings':    { title:'Settings',        sub:'Configure preferences' },
};

const Topbar = () => {
  const location = useLocation();
  const meta = pageMeta[location.pathname] || { title:'NexusHR', sub:'' };
  const { user } = useAuth();
  const { stats } = useHRM();
  const [showNotifs, setShowNotifs] = useState(false);
  const [search, setSearch] = useState('');

  const notifications = [
    { id:1, text:'Payroll processed successfully', time:'5m ago', icon:<DollarSign size={14}/>, color:'var(--success)' },
    { id:2, text:`${stats.pendingLeaves} leave requests pending`, time:'1h ago', icon:<Calendar size={14}/>, color:'var(--warning)' },
    { id:3, text:'New recruitment applications received', time:'2h ago', icon:<Users size={14}/>, color:'var(--info)' },
    { id:4, text:'Q2 performance review scheduled', time:'1d ago', icon:<TrendingUp size={14}/>, color:'var(--accent-primary)' },
  ];

  return (
    <header className="topbar">
      <div style={{flex:1}}>
        <div className="topbar-title">{meta.title}</div>
        <div className="topbar-sub">{meta.sub}{user ? `, ${user.name}` : ''}</div>
      </div>

      <div className="topbar-search">
        <Search size={16} color="var(--text-muted)"/>
        <input type="text" placeholder="Search employees, reports..." value={search} onChange={e=>setSearch(e.target.value)}/>
        {search&&<button onClick={()=>setSearch('')} style={{background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',display:'flex'}}><X size={14}/></button>}
      </div>

      <div className="topbar-actions">
        <div style={{position:'relative'}}>
          <button className="icon-btn" onClick={()=>setShowNotifs(p=>!p)}>
            <Bell size={18}/>
            <span className="notif-dot"/>
          </button>
          {showNotifs&&(
            <>
              <div onClick={()=>setShowNotifs(false)} style={{position:'fixed',inset:0,zIndex:200}}/>
              <div style={{position:'absolute',top:'calc(100% + 8px)',right:0,width:'300px',background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',boxShadow:'var(--shadow-lg)',zIndex:201,overflow:'hidden',animation:'slideUp 0.15s ease'}}>
                <div style={{padding:'14px 16px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontWeight:700,fontSize:'0.9rem'}}>Notifications</span>
                  <span className="badge badge-primary">{notifications.length} new</span>
                </div>
                {notifications.map(n=>(
                  <div key={n.id} style={{display:'flex',gap:'10px',alignItems:'flex-start',padding:'12px 16px',borderBottom:'1px solid var(--border)',cursor:'pointer',transition:'var(--transition)'}}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--bg-hover)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <div style={{width:30,height:30,borderRadius:'50%',background:`color-mix(in srgb, ${n.color} 15%, transparent)`,display:'flex',alignItems:'center',justifyContent:'center',color:n.color,flexShrink:0}}>{n.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'0.8rem',color:'var(--text-primary)',fontWeight:500}}>{n.text}</div>
                      <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginTop:'2px'}}>{n.time}</div>
                    </div>
                  </div>
                ))}
                <div style={{padding:'10px 16px',textAlign:'center'}}>
                  <button className="btn btn-ghost btn-sm" style={{width:'100%'}} onClick={()=>setShowNotifs(false)}>Dismiss all</button>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="avatar avatar-sm" style={{background:'var(--grad-primary)',color:'white',cursor:'pointer'}} title={user?.name}>
          {user?.avatar || 'AD'}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
