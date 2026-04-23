import React, { useState } from 'react';
import { DollarSign, Download, X, Printer, CheckCircle, Clock } from 'lucide-react';
import { useHRM } from '../context/HRMContext';
import { useToast } from '../context/ToastContext';
import { exportToCSV, PAYROLL_CSV_COLS, printElement } from '../utils/exportUtils';
import useDocumentTitle from '../hooks/useDocumentTitle';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const chartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', callback: v => `$${(v/1000).toFixed(0)}k` } },
    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
  }
};

const buildPayroll = (employees) => employees.map(e => {
  const gross = Math.round(e.salary / 12);
  const tax = Math.round(gross * 0.22);
  const insurance = Math.round(gross * 0.04);
  return {
    empId: e.id, name: e.name, department: e.department,
    avatar: e.avatar, avatarColor: e.avatarColor, role: e.role,
    gross, tax, insurance,
    deductions: tax + insurance,
    net: gross - tax - insurance,
    status: e.status === 'Inactive' ? 'On Hold' : 'Processed',
    payPeriod: 'April 2026',
  };
});

const PayslipModal = ({ record, onClose }) => {
  if (!record) return null;
  const items = [
    { label:'Basic Salary', amount: Math.round(record.gross * 0.9), type:'earn' },
    { label:'House Allowance', amount: Math.round(record.gross * 0.06), type:'earn' },
    { label:'Transport Allowance', amount: Math.round(record.gross * 0.04), type:'earn' },
    { label:'Federal Tax (22%)', amount: record.tax, type:'deduct' },
    { label:'Health Insurance (4%)', amount: record.insurance, type:'deduct' },
  ];
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal modal-lg slide-up">
        <div className="modal-header">
          <span className="modal-title">Payslip — {record.payPeriod}</span>
          <div style={{display:'flex',gap:'8px'}}>
            <button className="btn btn-sm btn-secondary" onClick={()=>printElement('payslip-content')}><Printer size={14}/>Print</button>
            <button className="modal-close" onClick={onClose}><X size={16}/></button>
          </div>
        </div>
        <div className="modal-body" style={{padding:0}}>
          <div id="payslip-content" className="payslip">
            <div className="payslip-header">
              <div>
                <div className="payslip-company">PeopleCore</div>
                <div style={{fontSize:'0.8rem',color:'#6b7280',marginTop:'4px'}}>123 Enterprise Blvd, New York, NY 10001</div>
              </div>
              <div className="payslip-title">
                <div>PAYSLIP</div>
                <div style={{fontWeight:400,fontSize:'0.85rem',color:'#6b7280',marginTop:'4px'}}>Period: {record.payPeriod}</div>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'24px',padding:'16px',background:'#f9fafb',borderRadius:'8px'}}>
              {[{k:'Employee Name',v:record.name},{k:'Employee ID',v:record.empId},{k:'Job Title',v:record.role},{k:'Department',v:record.department}].map(r=>(
                <div key={r.k}><div style={{fontSize:'0.72rem',color:'#9ca3af',fontWeight:600,textTransform:'uppercase'}}>{r.k}</div><div style={{fontWeight:600,color:'#111827',marginTop:'2px'}}>{r.v}</div></div>
              ))}
            </div>
            <table>
              <thead><tr><th>Description</th><th style={{textAlign:'right'}}>Earnings</th><th style={{textAlign:'right'}}>Deductions</th></tr></thead>
              <tbody>
                {items.map(item=>(
                  <tr key={item.label}>
                    <td>{item.label}</td>
                    <td style={{textAlign:'right'}}>{item.type==='earn'?`$${item.amount.toLocaleString()}`:'—'}</td>
                    <td style={{textAlign:'right'}}>{item.type==='deduct'?`$${item.amount.toLocaleString()}`:'—'}</td>
                  </tr>
                ))}
                <tr className="payslip-total"><td>Net Pay</td><td style={{textAlign:'right'}} colSpan={2}>${record.net.toLocaleString()}</td></tr>
              </tbody>
            </table>
            <div style={{marginTop:'24px',padding:'16px',background:'#f0fdf4',borderRadius:'8px',border:'1px solid #bbf7d0',textAlign:'center'}}>
              <div style={{fontWeight:700,color:'#15803d',fontSize:'1.1rem'}}>Net Take-Home: ${record.net.toLocaleString()}</div>
              <div style={{color:'#6b7280',fontSize:'0.8rem',marginTop:'4px'}}>Credited to bank account on file</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Payroll = () => {
  useDocumentTitle('Payroll');
  const { employees } = useHRM();
  const { toast } = useToast();
  const [payslip, setPayslip] = useState(null);
  const [search, setSearch] = useState('');

  const payrollData = buildPayroll(employees);
  const filtered = payrollData.filter(e => {
    const q = search.toLowerCase();
    return !q || e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q) || e.empId.toLowerCase().includes(q);
  });

  const totalGross = payrollData.reduce((a,e)=>a+e.gross,0);
  const totalNet   = payrollData.reduce((a,e)=>a+e.net,0);
  const totalTax   = payrollData.reduce((a,e)=>a+e.tax,0);

  const handleRunPayroll = () => toast('Payroll processed successfully for April 2026! 🎉', 'success');

  const deptPayroll = ['Engineering','Sales','Marketing','HR','Finance'].map(dept=>({
    dept, total: payrollData.filter(e=>e.department===dept).reduce((a,e)=>a+e.gross,0)
  }));

  const barData = {
    labels: deptPayroll.map(d=>d.dept),
    datasets:[{label:'Total Payroll',data:deptPayroll.map(d=>d.total),backgroundColor:['rgba(99,102,241,0.8)','rgba(16,185,129,0.8)','rgba(245,158,11,0.8)','rgba(244,63,94,0.8)','rgba(56,189,248,0.8)'],borderRadius:4}]
  };
  const donutData = {
    labels:['Net Pay','Tax','Insurance'],
    datasets:[{data:[totalNet,totalTax,payrollData.reduce((a,e)=>a+e.insurance,0)],backgroundColor:['#6366f1','#f43f5e','#f59e0b'],borderWidth:0,hoverOffset:4}]
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Payroll</h1>
          <div className="page-subtitle">Manage salaries, deductions, and payslips — April 2026</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={()=>{exportToCSV(payrollData,'payroll',PAYROLL_CSV_COLS);toast('Payroll report exported.','info');}}><Download size={16}/>Export CSV</button>
          <button className="btn btn-primary" onClick={handleRunPayroll}><CheckCircle size={16}/>Run Payroll</button>
        </div>
      </div>

      <div className="kpi-grid">
        {[
          {label:'Total Gross',value:`$${(totalGross/1000).toFixed(1)}k`,sub:`${payrollData.length} employees`,color:'primary'},
          {label:'Total Net Pay',value:`$${(totalNet/1000).toFixed(1)}k`,sub:'after deductions',color:'success'},
          {label:'Tax Withheld',value:`$${(totalTax/1000).toFixed(1)}k`,sub:'federal + state',color:'danger'},
          {label:'Processed',value:`${payrollData.filter(e=>e.status==='Processed').length}/${payrollData.length}`,sub:'employees paid',color:'warning'},
        ].map(k=>(
          <div key={k.label} className={`kpi-card accent-${k.color}`}>
            <div className={`kpi-icon ${k.color}`}><DollarSign size={22}/></div>
            <div className="kpi-body">
              <div className="kpi-value">{k.value}</div>
              <div className="kpi-label">{k.label}</div>
              <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginTop:'4px'}}>{k.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{marginBottom:'20px'}}>
        <div className="card">
          <div className="card-header"><div><div className="card-title">Payroll by Department</div><div className="card-subtitle">Gross monthly cost</div></div></div>
          <div style={{height:'240px'}}><Bar data={barData} options={chartOptions}/></div>
        </div>
        <div className="card">
          <div className="card-header"><div><div className="card-title">Pay Breakdown</div><div className="card-subtitle">Net vs deductions</div></div></div>
          <div style={{height:'200px',display:'flex',justifyContent:'center'}}>
            <Doughnut data={donutData} options={{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{color:'#94a3b8',padding:12,font:{size:12}}}}}}/>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <div className="table-search">
            <DollarSign size={16} color="var(--text-muted)"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search employee, department..."/>
          </div>
          <span style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>Pay Period: <strong style={{color:'var(--text-primary)'}}>April 2026</strong></span>
        </div>
        <table>
          <thead>
            <tr><th>Employee</th><th>Department</th><th>Gross</th><th>Tax</th><th>Insurance</th><th>Net Pay</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filtered.map(e=>(
              <tr key={e.empId}>
                <td><div style={{display:'flex',alignItems:'center',gap:'10px'}}><div className="avatar avatar-sm" style={{background:e.avatarColor,color:'white'}}>{e.avatar}</div><div><strong>{e.name}</strong><div style={{fontSize:'0.72rem',color:'var(--text-muted)'}}>{e.empId}</div></div></div></td>
                <td><span className="badge badge-primary">{e.department}</span></td>
                <td><strong>${e.gross.toLocaleString()}</strong></td>
                <td style={{color:'var(--danger)'}}>-${e.tax.toLocaleString()}</td>
                <td style={{color:'var(--warning)'}}>-${e.insurance.toLocaleString()}</td>
                <td><strong style={{color:'var(--success)'}}>${e.net.toLocaleString()}</strong></td>
                <td>{e.status==='Processed'?<span className="badge badge-success"><CheckCircle size={12}/> Processed</span>:<span className="badge badge-warning"><Clock size={12}/> On Hold</span>}</td>
                <td><button className="btn btn-sm btn-ghost" onClick={()=>setPayslip(e)}><Download size={13}/>Payslip</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payslip&&<PayslipModal record={payslip} onClose={()=>setPayslip(null)}/>}
    </div>
  );
};

export default Payroll;
