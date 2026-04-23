import React from 'react';
import {
  Users, UserCheck, Briefcase, TrendingUp, ArrowUpRight, ArrowDownRight,
  Calendar, DollarSign, Activity
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler, ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { attendanceSummary, jobs } from '../data/mockData';
import { useHRM } from '../context/HRMContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler, ArcElement);

const lineOpts = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
  }
};

const barOpts = { ...lineOpts };

const activityFeed = [
  { id:1, text:<><strong>Jane Smith</strong> joined Engineering team</>, time:'2 min ago', color:'var(--success)' },
  { id:2, text:<><strong>Payroll</strong> for April 2026 was processed</>, time:'1 hr ago', color:'var(--accent-primary)' },
  { id:3, text:<><strong>Tom Wilson</strong> applied for leave (3 days)</>, time:'3 hrs ago', color:'var(--warning)' },
  { id:4, text:<>New job posted: <strong>Full Stack Engineer</strong></>, time:'Yesterday', color:'var(--info)' },
  { id:5, text:<><strong>Olivia Brown</strong> moved to Offer stage</>, time:'Yesterday', color:'var(--success)' },
  { id:6, text:<><strong>Ben Park</strong> account deactivated</>, time:'2 days ago', color:'var(--danger)' },
];

const upcomingEvents = [
  { id:1, title:'Q2 Performance Reviews', date:'Apr 25, 2026', type:'review' },
  { id:2, title:'New Hire Orientation', date:'Apr 28, 2026', type:'hr' },
  { id:3, title:'May Payroll Processing', date:'May 01, 2026', type:'payroll' },
  { id:4, title:'Team Building Workshop', date:'May 10, 2026', type:'event' },
];

const eventColors = { review:'var(--warning)', hr:'var(--success)', payroll:'var(--accent-primary)', event:'var(--info)' };

const Dashboard = () => {
  useDocumentTitle('Dashboard');
  const { employees, stats } = useHRM();
  const totalSalary = employees.reduce((a,e)=>a+Math.round(e.salary/12),0);
  const activeEmps = stats.activeEmployees;
  const avgAttendance = Math.round(attendanceSummary.reduce((a,e)=>a+(e.present/e.totalDays*100),0)/attendanceSummary.length);
  const openJobs = jobs.filter(j=>j.status==='Open').length;

  const headcountData = {
    labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    datasets:[{
      label:'Headcount',
      data:[82,84,87,88,91,93,94,97,99,102,103,105],
      borderColor:'#6366f1',
      backgroundColor:'rgba(99,102,241,0.1)',
      borderWidth:2, fill:true, tension:0.4,
    }]
  };

  const salaryTrendData = {
    labels:['Oct','Nov','Dec','Jan','Feb','Mar','Apr'],
    datasets:[{
      label:'Monthly Payroll ($k)',
      data:[198,205,210,220,225,232,240],
      borderColor:'#10b981',
      backgroundColor:'rgba(16,185,129,0.1)',
      borderWidth:2, fill:true, tension:0.4,
    }]
  };

  const deptData = {
    labels:['Engineering','Sales','Marketing','HR','Finance'],
    datasets:[{
      data:[45,25,15,8,12],
      backgroundColor:['#6366f1','#10b981','#f59e0b','#f43f5e','#38bdf8'],
      borderWidth:0, hoverOffset:4,
    }]
  };

  const attendanceBar = {
    labels:['Mon','Tue','Wed','Thu','Fri'],
    datasets:[
      { label:'Present', data:[98,96,94,99,91], backgroundColor:'rgba(16,185,129,0.8)', borderRadius:4 },
      { label:'Absent', data:[2,3,5,1,7], backgroundColor:'rgba(244,63,94,0.6)', borderRadius:4 },
    ]
  };

  const stackedOpts = {
    ...barOpts, plugins:{...barOpts.plugins, legend:{display:true,labels:{color:'#94a3b8'}}},
    scales:{...barOpts.scales, x:{...barOpts.scales.x,stacked:true}, y:{...barOpts.scales.y,stacked:true}}
  };

  const recentEmps = [...employees].sort((a,b)=>new Date(b.joinDate)-new Date(a.joinDate)).slice(0,5);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Dashboard Overview</h1>
          <div className="page-subtitle">Welcome back, Admin! Here's what's happening today.</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><Calendar size={16}/>Apr 2026</button>
          <button className="btn btn-primary"><DollarSign size={16}/>Run Payroll</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card accent-primary">
          <div className="kpi-icon primary"><Users size={22}/></div>
          <div className="kpi-body">
            <div className="kpi-value">{employees.length}</div>
            <div className="kpi-label">Total Employees</div>
            <div className="kpi-change up"><ArrowUpRight size={14}/>+3 this month</div>
          </div>
        </div>
        <div className="kpi-card accent-success">
          <div className="kpi-icon success"><UserCheck size={22}/></div>
          <div className="kpi-body">
            <div className="kpi-value">{avgAttendance}%</div>
            <div className="kpi-label">Attendance Rate</div>
            <div className="kpi-change up"><ArrowUpRight size={14}/>+2.1% vs last week</div>
          </div>
        </div>
        <div className="kpi-card accent-warning">
          <div className="kpi-icon warning"><Briefcase size={22}/></div>
          <div className="kpi-body">
            <div className="kpi-value">{openJobs}</div>
            <div className="kpi-label">Open Positions</div>
            <div className="kpi-change down"><ArrowDownRight size={14}/>3 filled last week</div>
          </div>
        </div>
        <div className="kpi-card accent-info">
          <div className="kpi-icon info"><TrendingUp size={22}/></div>
          <div className="kpi-body">
            <div className="kpi-value">${(totalSalary/1000).toFixed(0)}k</div>
            <div className="kpi-label">Monthly Payroll</div>
            <div className="kpi-change up"><ArrowUpRight size={14}/>+3.5% salary inc.</div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid-2" style={{marginBottom:'20px'}}>
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Headcount Growth</div><div className="card-subtitle">Total employees over 12 months</div></div>
            <span className="badge badge-success"><ArrowUpRight size={12}/>+28%</span>
          </div>
          <div style={{height:'220px'}}><Line data={headcountData} options={lineOpts}/></div>
        </div>
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Payroll Trend</div><div className="card-subtitle">Monthly payroll cost (USD)</div></div>
          </div>
          <div style={{height:'220px'}}><Line data={salaryTrendData} options={lineOpts}/></div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1.6fr',gap:'20px',marginBottom:'20px'}}>
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">By Department</div><div className="card-subtitle">Headcount distribution</div></div>
          </div>
          <div style={{height:'200px',display:'flex',justifyContent:'center'}}>
            <Doughnut data={deptData} options={{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{color:'#94a3b8',padding:10,font:{size:11}}}}}}/>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Weekly Attendance</div><div className="card-subtitle">Present vs Absent (this week)</div></div>
          </div>
          <div style={{height:'200px'}}><Bar data={attendanceBar} options={stackedOpts}/></div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid-2">
        {/* Recent Hires */}
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Recent Hires</div><div className="card-subtitle">Latest employees to join</div></div>
            <button className="btn btn-sm btn-ghost">View All</button>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'0'}}>
            {recentEmps.map(emp=>(
              <div key={emp.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
                <div className="avatar avatar-sm" style={{background:emp.avatarColor,color:'white'}}>{emp.avatar}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:'0.875rem'}}>{emp.name}</div>
                  <div style={{fontSize:'0.72rem',color:'var(--text-muted)'}}>{emp.role} · {emp.department}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:'0.72rem',color:'var(--text-muted)'}}>{emp.joinDate}</div>
                  <span className={`badge badge-${emp.status==='Active'?'success':emp.status==='On Leave'?'warning':'muted'}`} style={{fontSize:'0.65rem'}}>{emp.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Activity + Upcoming */}
        <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
          <div className="card">
            <div className="card-header">
              <div><div className="card-title"><Activity size={16} style={{display:'inline',marginRight:'6px'}}/>Activity Feed</div></div>
            </div>
            <div>
              {activityFeed.slice(0,4).map(a=>(
                <div key={a.id} className="activity-item">
                  <div className="activity-dot" style={{background:a.color}}/>
                  <div className="activity-text">{a.text}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div><div className="card-title"><Calendar size={16} style={{display:'inline',marginRight:'6px'}}/>Upcoming Events</div></div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {upcomingEvents.map(ev=>(
                <div key={ev.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px',background:'var(--bg-surface)',borderRadius:'var(--radius-md)',border:'1px solid var(--border)'}}>
                  <div style={{width:'4px',height:'36px',borderRadius:'4px',background:eventColors[ev.type],flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:'0.85rem'}}>{ev.title}</div>
                    <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginTop:'2px'}}>{ev.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
