import React, { useState, useMemo } from 'react';
import {
  Search, Plus, Filter, Download, Edit3, Trash2, Eye,
  Mail, Phone, MapPin, Building, Calendar, ChevronUp, ChevronDown, X,
  User, Briefcase, DollarSign, Shield
} from 'lucide-react';
import { departments, statuses } from '../data/mockData';
import { useHRM } from '../context/HRMContext';
import { useToast } from '../context/ToastContext';
import { exportToCSV, EMPLOYEE_CSV_COLS } from '../utils/exportUtils';
import useDocumentTitle from '../hooks/useDocumentTitle';

const ITEMS_PER_PAGE = 8;
const avatarColors = ['#6366f1','#10b981','#f59e0b','#f43f5e','#38bdf8','#8b5cf6','#ec4899','#14b8a6'];
function getInitials(name) { return name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2); }

const EmployeeModal = ({ employee, onClose, onSave, mode }) => {
  const [form, setForm] = useState(employee || { name:'',email:'',phone:'',role:'',department:'Engineering',location:'',salary:'',status:'Active',type:'Full-time',manager:'' });
  const handle = (e) => setForm(f=>({...f,[e.target.name]:e.target.value}));
  const submit = (e) => {
    e.preventDefault();
    onSave({ ...form, id:employee?.id||`EMP${Date.now()}`, avatar:getInitials(form.name||'NA'), avatarColor:employee?.avatarColor||avatarColors[Math.floor(Math.random()*avatarColors.length)], joinDate:employee?.joinDate||new Date().toISOString().split('T')[0] });
    onClose();
  };
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal modal-lg slide-up">
        <div className="modal-header">
          <span className="modal-title">{mode==='add'?'➕ Add Employee':'✏️ Edit Employee'}</span>
          <button className="modal-close" onClick={onClose}><X size={16}/></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group"><label className="form-label">Full Name <span>*</span></label><input className="form-control" name="name" value={form.name} onChange={handle} required placeholder="John Doe"/></div>
              <div className="form-group"><label className="form-label">Email <span>*</span></label><input className="form-control" name="email" type="email" value={form.email} onChange={handle} required placeholder="john@nexushr.com"/></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Phone</label><input className="form-control" name="phone" value={form.phone} onChange={handle} placeholder="+1 (555) 000-0000"/></div>
              <div className="form-group"><label className="form-label">Location</label><input className="form-control" name="location" value={form.location} onChange={handle} placeholder="City, State"/></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Job Title <span>*</span></label><input className="form-control" name="role" value={form.role} onChange={handle} required placeholder="Software Engineer"/></div>
              <div className="form-group"><label className="form-label">Department <span>*</span></label>
                <select className="form-control" name="department" value={form.department} onChange={handle}>
                  {['Engineering','Sales','Marketing','HR','Finance'].map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Manager</label><input className="form-control" name="manager" value={form.manager} onChange={handle} placeholder="Manager name"/></div>
              <div className="form-group"><label className="form-label">Annual Salary ($)</label><input className="form-control" name="salary" type="number" value={form.salary} onChange={handle} placeholder="75000"/></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Employment Type</label>
                <select className="form-control" name="type" value={form.type} onChange={handle}>{['Full-time','Part-time','Contract'].map(t=><option key={t}>{t}</option>)}</select>
              </div>
              <div className="form-group"><label className="form-label">Status</label>
                <select className="form-control" name="status" value={form.status} onChange={handle}>{['Active','On Leave','Inactive'].map(s=><option key={s}>{s}</option>)}</select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{mode==='add'?'Add Employee':'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProfileDrawer = ({ employee, onClose }) => {
  if (!employee) return null;
  const info = [
    {icon:<Mail size={15}/>,label:'Email',value:employee.email},
    {icon:<Phone size={15}/>,label:'Phone',value:employee.phone},
    {icon:<MapPin size={15}/>,label:'Location',value:employee.location},
    {icon:<Building size={15}/>,label:'Department',value:employee.department},
    {icon:<Briefcase size={15}/>,label:'Manager',value:employee.manager},
    {icon:<Calendar size={15}/>,label:'Joined',value:employee.joinDate},
    {icon:<DollarSign size={15}/>,label:'Salary',value:`$${Number(employee.salary).toLocaleString()} / yr`},
    {icon:<Shield size={15}/>,label:'Type',value:employee.type},
  ];
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal slide-up" style={{maxWidth:'420px'}}>
        <div style={{background:'var(--grad-primary)',height:'100px',borderRadius:'var(--radius-xl) var(--radius-xl) 0 0',position:'relative'}}>
          <button className="modal-close" onClick={onClose} style={{position:'absolute',top:'12px',right:'12px'}}><X size={16}/></button>
        </div>
        <div style={{padding:'0 24px 24px',marginTop:'-36px'}}>
          <div style={{display:'flex',alignItems:'flex-end',gap:'12px',marginBottom:'16px'}}>
            <div className="avatar avatar-xl" style={{background:employee.avatarColor,color:'white',border:'4px solid var(--bg-card)'}}>{employee.avatar}</div>
            <div style={{paddingBottom:'4px'}}>
              <div style={{fontWeight:800,fontSize:'1.1rem'}}>{employee.name}</div>
              <div style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>{employee.role} · {employee.id}</div>
            </div>
          </div>
          <span className={`badge badge-${employee.status==='Active'?'success':employee.status==='On Leave'?'warning':'muted'}`} style={{marginBottom:'16px',display:'inline-flex'}}>
            <span className="badge-dot"></span> {employee.status}
          </span>
          <div className="info-list">
            {info.map(i=>(
              <div key={i.label} className="info-item">
                <span className="info-item-icon">{i.icon}</span>
                <span style={{color:'var(--text-muted)',minWidth:'80px',fontSize:'0.75rem'}}>{i.label}</span>
                <span style={{color:'var(--text-primary)',fontWeight:500,fontSize:'0.875rem'}}>{i.value||'—'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirm = ({name,onConfirm,onClose}) => (
  <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="modal modal-sm slide-up">
      <div className="modal-header"><span className="modal-title">Delete Employee</span><button className="modal-close" onClick={onClose}><X size={16}/></button></div>
      <div className="modal-body"><p style={{color:'var(--text-secondary)',lineHeight:1.7}}>Remove <strong style={{color:'var(--text-primary)'}}>{name}</strong>? This cannot be undone.</p></div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
);

const Employees = () => {
  useDocumentTitle('Employees');
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useHRM();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sort, setSort] = useState({key:'name',dir:'asc'});
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [viewEmp, setViewEmp] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    let list = employees.filter(e=>{
      const q=search.toLowerCase();
      return !q||e.name.toLowerCase().includes(q)||e.email.toLowerCase().includes(q)||e.role.toLowerCase().includes(q)||e.id.toLowerCase().includes(q);
    });
    if (deptFilter!=='All') list=list.filter(e=>e.department===deptFilter);
    if (statusFilter!=='All') list=list.filter(e=>e.status===statusFilter);
    return [...list].sort((a,b)=>sort.dir==='asc'?String(a[sort.key]).localeCompare(String(b[sort.key])):String(b[sort.key]).localeCompare(String(a[sort.key])));
  },[employees,search,deptFilter,statusFilter,sort]);

  const pages = Math.ceil(filtered.length/ITEMS_PER_PAGE);
  const paginated = filtered.slice((page-1)*ITEMS_PER_PAGE,page*ITEMS_PER_PAGE);
  const toggleSort = (key) => setSort(s=>({key,dir:s.key===key&&s.dir==='asc'?'desc':'asc'}));
  const SortIcon = ({col}) => sort.key===col?(sort.dir==='asc'?<ChevronUp size={14}/>:<ChevronDown size={14}/>):null;

  const handleSave = (emp) => {
    if (modal.mode==='add') { addEmployee(emp); toast(`${emp.name} added successfully.`,'success'); }
    else { updateEmployee(emp); toast(`${emp.name} updated.`,'info'); }
  };
  const handleDelete = () => {
    deleteEmployee(deleteTarget.id);
    toast(`${deleteTarget.name} removed.`,'error');
    setDeleteTarget(null);
  };

  const statusBadge = (s) => {
    if(s==='Active') return <span className="badge badge-success"><span className="badge-dot" style={{background:'var(--success)'}}></span>Active</span>;
    if(s==='On Leave') return <span className="badge badge-warning"><span className="badge-dot" style={{background:'var(--warning)'}}></span>On Leave</span>;
    return <span className="badge badge-muted"><span className="badge-dot"></span>{s}</span>;
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Employees</h1>
          <div className="page-subtitle">{filtered.length} employees · {[...new Set(employees.map(e=>e.department))].length} departments</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={()=>exportToCSV(employees,'employees',EMPLOYEE_CSV_COLS)}><Download size={16}/>Export CSV</button>
          <button className="btn btn-primary" onClick={()=>setModal({mode:'add',employee:null})}><Plus size={16}/>Add Employee</button>
        </div>
      </div>

      <div className="kpi-grid" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:'20px'}}>
        {[
          {label:'Total',value:employees.length,color:'var(--accent-primary)'},
          {label:'Active',value:employees.filter(e=>e.status==='Active').length,color:'var(--success)'},
          {label:'On Leave',value:employees.filter(e=>e.status==='On Leave').length,color:'var(--warning)'},
          {label:'Inactive',value:employees.filter(e=>e.status==='Inactive').length,color:'var(--danger)'},
        ].map(s=>(
          <div key={s.label} className="card" style={{padding:'16px',display:'flex',alignItems:'center',gap:'14px'}}>
            <div style={{fontSize:'1.8rem',fontWeight:800,color:s.color,lineHeight:1}}>{s.value}</div>
            <div style={{fontSize:'0.8rem',color:'var(--text-muted)',fontWeight:600}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={16} color="var(--text-muted)"/>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search name, email, role, ID..."/>
            {search&&<button onClick={()=>setSearch('')} style={{background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',display:'flex'}}><X size={14}/></button>}
          </div>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'center'}}>
            <Filter size={14} color="var(--text-muted)"/>
            <div className="filter-bar" style={{marginBottom:0}}>
              {departments.map(d=><button key={d} className={`filter-chip ${deptFilter===d?'active':''}`} onClick={()=>{setDeptFilter(d);setPage(1);}}>{d}</button>)}
            </div>
            <select className="form-control" style={{width:'auto',padding:'5px 12px',fontSize:'0.8rem'}} value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);setPage(1);}}>
              {statuses.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th style={{cursor:'pointer'}} onClick={()=>toggleSort('name')}>Employee <SortIcon col="name"/></th>
              <th style={{cursor:'pointer'}} onClick={()=>toggleSort('role')}>Role <SortIcon col="role"/></th>
              <th>Department</th>
              <th>Location</th>
              <th style={{cursor:'pointer'}} onClick={()=>toggleSort('salary')}>Salary <SortIcon col="salary"/></th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length===0?(
              <tr><td colSpan={8}><div className="empty-state"><User size={48} className="empty-state-icon"/><div className="empty-state-title">No employees found</div><div className="empty-state-text">Adjust your filters or add a new employee.</div></div></td></tr>
            ):paginated.map(emp=>(
              <tr key={emp.id}>
                <td><div style={{display:'flex',alignItems:'center',gap:'10px'}}><div className="avatar avatar-sm" style={{background:emp.avatarColor,color:'white'}}>{emp.avatar}</div><div><strong>{emp.name}</strong><div style={{fontSize:'0.72rem',color:'var(--text-muted)'}}>{emp.email}</div></div></div></td>
                <td>{emp.role}</td>
                <td><span className="badge badge-primary">{emp.department}</span></td>
                <td style={{color:'var(--text-muted)'}}>{emp.location}</td>
                <td><strong>${Number(emp.salary).toLocaleString()}</strong></td>
                <td><span className="badge badge-muted">{emp.type}</span></td>
                <td>{statusBadge(emp.status)}</td>
                <td>
                  <div style={{display:'flex',gap:'6px'}}>
                    <button className="icon-btn" style={{width:30,height:30}} title="View" onClick={()=>setViewEmp(emp)}><Eye size={14}/></button>
                    <button className="icon-btn" style={{width:30,height:30}} title="Edit" onClick={()=>setModal({mode:'edit',employee:emp})}><Edit3 size={14}/></button>
                    <button className="icon-btn" style={{width:30,height:30,borderColor:'var(--danger)',color:'var(--danger)'}} title="Delete" onClick={()=>setDeleteTarget(emp)}><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pages>1&&(
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px',borderTop:'1px solid var(--border)'}}>
            <span style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>Showing {(page-1)*ITEMS_PER_PAGE+1}–{Math.min(page*ITEMS_PER_PAGE,filtered.length)} of {filtered.length}</span>
            <div style={{display:'flex',gap:'4px'}}>
              <button className="btn btn-sm btn-ghost" disabled={page===1} onClick={()=>setPage(p=>p-1)}>Prev</button>
              {Array.from({length:pages},(_,i)=><button key={i} className={`btn btn-sm ${page===i+1?'btn-primary':'btn-ghost'}`} onClick={()=>setPage(i+1)}>{i+1}</button>)}
              <button className="btn btn-sm btn-ghost" disabled={page===pages} onClick={()=>setPage(p=>p+1)}>Next</button>
            </div>
          </div>
        )}
      </div>

      {modal&&<EmployeeModal employee={modal.employee} mode={modal.mode} onClose={()=>setModal(null)} onSave={handleSave}/>}
      {viewEmp&&<ProfileDrawer employee={viewEmp} onClose={()=>setViewEmp(null)}/>}
      {deleteTarget&&<DeleteConfirm name={deleteTarget.name} onConfirm={handleDelete} onClose={()=>setDeleteTarget(null)}/>}
    </div>
  );
};

export default Employees;
