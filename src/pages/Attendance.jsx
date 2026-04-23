import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, AlertCircle, Clock, Calendar } from 'lucide-react';
import { generateAttendance } from '../data/mockData';
import { useHRM } from '../context/HRMContext';
import { useToast } from '../context/ToastContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const statusConfig = {
  present: { label:'Present', color:'var(--success)',  cls:'badge-success' },
  absent:  { label:'Absent',  color:'var(--danger)',   cls:'badge-danger' },
  late:    { label:'Late',    color:'var(--warning)',  cls:'badge-warning' },
  leave:   { label:'Leave',   color:'var(--info)',     cls:'badge-info' },
  weekend: { label:'Weekend', color:'var(--text-muted)', cls:'badge-muted' },
};

const CalendarView = ({ records }) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const year = viewDate.getFullYear(), month = viewDate.getMonth();
  const firstDay = new Date(year,month,1).getDay();
  const daysInMonth = new Date(year,month+1,0).getDate();
  const recordMap = useMemo(() => { const m={}; records.forEach(r=>m[r.date]=r); return m; },[records]);
  const cells = [...Array(firstDay).fill(null), ...Array.from({length:daysInMonth},(_,i)=>i+1)];
  const ds = (d) => `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
        <button className="icon-btn" onClick={()=>setViewDate(new Date(year,month-1,1))}><ChevronLeft size={18}/></button>
        <span style={{fontWeight:700}}>{MONTHS[month]} {year}</span>
        <button className="icon-btn" onClick={()=>setViewDate(new Date(year,month+1,1))}><ChevronRight size={18}/></button>
      </div>
      <div className="calendar-grid" style={{marginBottom:'8px'}}>
        {DAYS.map(d=><div key={d} style={{textAlign:'center',fontSize:'0.72rem',fontWeight:700,color:'var(--text-muted)',padding:'4px 0'}}>{d}</div>)}
      </div>
      <div className="calendar-grid">
        {cells.map((d,i)=>{
          if(!d) return <div key={`e${i}`}/>;
          const rec=recordMap[ds(d)];
          const isToday=ds(d)===today.toISOString().split('T')[0];
          let cls='calendar-cell';
          if(isToday) cls+=' today';
          else if(rec?.status==='present') cls+=' present';
          else if(rec?.status==='absent')  cls+=' absent';
          else if(rec?.status==='late')    cls+=' present';
          else if(rec?.status==='leave')   cls+=' leave';
          else if(rec?.status==='weekend') cls+=' other-month';
          return (
            <div key={d} className={cls} title={rec?.status}>
              <span>{d}</span>
              {rec&&rec.status!=='weekend'&&<div style={{width:'4px',height:'4px',borderRadius:'50%',background:statusConfig[rec.status]?.color}}/>}
            </div>
          );
        })}
      </div>
      <div style={{display:'flex',gap:'12px',flexWrap:'wrap',marginTop:'16px',justifyContent:'center'}}>
        {Object.entries(statusConfig).filter(([k])=>k!=='weekend').map(([k,v])=>(
          <div key={k} style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'0.75rem',color:'var(--text-muted)'}}>
            <div style={{width:'10px',height:'10px',borderRadius:'2px',background:v.color}}/>
            {v.label}
          </div>
        ))}
      </div>
    </div>
  );
};

const Attendance = () => {
  useDocumentTitle('Attendance');
  const { employees } = useHRM();
  const { toast } = useToast();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const attendanceSummary = useMemo(() => employees.map(e => ({
    empId:e.id, name:e.name, department:e.department, avatar:e.avatar, avatarColor:e.avatarColor,
    present: Math.floor(Math.random()*4)+18,
    absent:  Math.floor(Math.random()*2),
    late:    Math.floor(Math.random()*3),
    leave:   Math.floor(Math.random()*2),
    totalDays: 22,
  })),[employees]);

  const selectedEmp = attendanceSummary[selectedIdx] || attendanceSummary[0];
  const records = useMemo(() => generateAttendance(selectedEmp?.empId), [selectedIdx]);

  const overall = attendanceSummary.reduce((a,e)=>({present:a.present+e.present,absent:a.absent+e.absent,late:a.late+e.late,leave:a.leave+e.leave}),{present:0,absent:0,late:0,leave:0});

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Attendance</h1>
          <div className="page-subtitle">Track employee attendance and punctuality — April 2026</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><Calendar size={16}/>Export Report</button>
          <button className="btn btn-primary" onClick={()=>toast('Attendance marked for today!','success')}><Clock size={16}/>Mark Attendance</button>
        </div>
      </div>

      <div className="kpi-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        {[
          {label:'Avg. Present',value:`${Math.round(overall.present/attendanceSummary.length)}d`,color:'success',icon:<CheckCircle size={22}/>},
          {label:'Total Absences',value:overall.absent,color:'danger',icon:<XCircle size={22}/>},
          {label:'Late Arrivals',value:overall.late,color:'warning',icon:<AlertCircle size={22}/>},
          {label:'Leave Days',value:overall.leave,color:'info',icon:<Clock size={22}/>},
        ].map(k=>(
          <div key={k.label} className={`kpi-card accent-${k.color}`}>
            <div className={`kpi-icon ${k.color}`}>{k.icon}</div>
            <div className="kpi-body"><div className="kpi-value">{k.value}</div><div className="kpi-label">{k.label}</div></div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card" style={{padding:0}}>
          <div style={{padding:'20px 20px 0'}} className="card-header">
            <div><div className="card-title">Monthly Overview</div><div className="card-subtitle">Click a row to view calendar</div></div>
          </div>
          <div style={{maxHeight:'520px',overflowY:'auto'}}>
            <table>
              <thead><tr><th>Employee</th><th>Present</th><th>Absent</th><th>Late</th><th>Rate</th></tr></thead>
              <tbody>
                {attendanceSummary.map((e,idx)=>{
                  const rate=Math.round((e.present/e.totalDays)*100);
                  return (
                    <tr key={e.empId} style={{cursor:'pointer',background:selectedIdx===idx?'var(--bg-active)':undefined}} onClick={()=>setSelectedIdx(idx)}>
                      <td><div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <div className="avatar avatar-sm" style={{background:e.avatarColor,color:'white'}}>{e.avatar}</div>
                        <div><strong style={{fontSize:'0.8rem'}}>{e.name}</strong><div style={{fontSize:'0.7rem',color:'var(--text-muted)'}}>{e.department}</div></div>
                      </div></td>
                      <td><span className="badge badge-success">{e.present}</span></td>
                      <td><span className="badge badge-danger">{e.absent}</span></td>
                      <td><span className="badge badge-warning">{e.late}</span></td>
                      <td><div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                        <div className="progress-bar" style={{width:'60px'}}><div className="progress-fill" style={{width:`${rate}%`,background:rate>90?'var(--success)':rate>75?'var(--warning)':'var(--danger)'}}/></div>
                        <span style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{rate}%</span>
                      </div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          {selectedEmp && <>
            <div className="card-header">
              <div><div className="card-title"><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div className="avatar avatar-sm" style={{background:selectedEmp.avatarColor,color:'white'}}>{selectedEmp.avatar}</div>{selectedEmp.name}</div></div><div className="card-subtitle">{selectedEmp.department}</div></div>
              <div style={{textAlign:'right'}}><div style={{fontWeight:800,fontSize:'1.4rem',color:'var(--success)'}}>{Math.round((selectedEmp.present/selectedEmp.totalDays)*100)}%</div><div style={{fontSize:'0.72rem',color:'var(--text-muted)'}}>attendance rate</div></div>
            </div>
            <div style={{display:'flex',gap:'8px',marginBottom:'16px',flexWrap:'wrap'}}>
              {[{l:`${selectedEmp.present} Present`,c:'badge-success'},{l:`${selectedEmp.absent} Absent`,c:'badge-danger'},{l:`${selectedEmp.late} Late`,c:'badge-warning'},{l:`${selectedEmp.leave} Leave`,c:'badge-info'}].map(b=><span key={b.l} className={`badge ${b.c}`}>{b.l}</span>)}
            </div>
            <CalendarView records={records}/>
          </>}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
