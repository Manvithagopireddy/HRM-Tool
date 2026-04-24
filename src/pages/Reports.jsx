import React, { useState } from 'react';
import {
  BarChart2, TrendingUp, Users, DollarSign, Download,
  Calendar, Filter, ChevronDown, ArrowUpRight, ArrowDownRight,
  PieChart, Activity, FileText
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { useHRM } from '../context/HRMContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { exportToCSV } from '../utils/exportUtils';
import { useToast } from '../context/ToastContext';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, Legend, Filler
);

const MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
const MONTHS_FULL = ['November', 'December', 'January', 'February', 'March', 'April'];

const chartDefaults = {
  plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } } } },
  scales: {
    x: { ticks: { color: '#475569' }, grid: { color: 'rgba(255,255,255,0.04)' } },
    y: { ticks: { color: '#475569' }, grid: { color: 'rgba(255,255,255,0.04)' } },
  },
  responsive: true,
  maintainAspectRatio: false,
};

const doughnutDefaults = {
  plugins: { legend: { position: 'right', labels: { color: '#94a3b8', padding: 16, font: { family: 'Inter', size: 12 } } } },
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
};

export default function Reports() {
  useDocumentTitle('Reports & Analytics');
  const { employees } = useHRM();
  const { toast } = useToast();
  const [period, setPeriod] = useState('6m');
  const [activeReport, setActiveReport] = useState('overview');

  const headcountData = {
    labels: MONTHS,
    datasets: [{
      label: 'Total Headcount',
      data: [employees.length - 4, employees.length - 3, employees.length - 2, employees.length - 1, employees.length, employees.length + 1],
      borderColor: '#e5e7eb',
      backgroundColor: 'rgba(255,255,255,0.06)',
      fill: true, tension: 0.4, pointBackgroundColor: '#ffffff', pointRadius: 5,
    }, {
      label: 'New Hires',
      data: [1, 2, 0, 1, 2, 1],
      borderColor: '#9ca3af',
      backgroundColor: 'rgba(156,163,175,0.08)',
      fill: true, tension: 0.4, pointBackgroundColor: '#9ca3af', pointRadius: 5,
    }],
  };

  // Department distribution
  const deptMap = {};
  employees.forEach(e => { deptMap[e.department] = (deptMap[e.department] || 0) + 1; });
  const deptColors = ['#f9fafb', '#d1d5db', '#9ca3af', '#6b7280', '#374151', '#1f2937'];
  const deptData = {
    labels: Object.keys(deptMap),
    datasets: [{
      data: Object.values(deptMap),
      backgroundColor: deptColors,
      borderColor: 'rgba(0,0,0,0)',
      hoverOffset: 8,
    }],
  };

  // Monthly payroll cost
  const monthlyPayroll = employees.reduce((a, e) => a + e.salary / 12, 0);
  const payrollTrend = {
    labels: MONTHS,
    datasets: [{
      label: 'Payroll Cost ($)',
      data: [monthlyPayroll * 0.94, monthlyPayroll * 0.96, monthlyPayroll * 0.97, monthlyPayroll * 0.98, monthlyPayroll * 0.99, monthlyPayroll],
      backgroundColor: MONTHS.map((_, i) => i === MONTHS.length - 1 ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.25)'),
      borderRadius: 6, borderSkipped: false,
    }],
  };

  const attendanceData = {
    labels: MONTHS,
    datasets: [
      { label: 'Present', data: [92, 88, 94, 91, 93, 95], backgroundColor: 'rgba(255,255,255,0.7)',  borderRadius: 4 },
      { label: 'Absent',  data: [4, 6, 3, 5, 4, 3],       backgroundColor: 'rgba(255,255,255,0.2)',  borderRadius: 4 },
      { label: 'Late',    data: [4, 6, 3, 4, 3, 2],        backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 4 },
    ],
  };

  // Salary breakdown by department
  const deptSalary = {};
  employees.forEach(e => { deptSalary[e.department] = (deptSalary[e.department] || 0) + e.salary / 12; });
  const salaryData = {
    labels: Object.keys(deptSalary),
    datasets: [{
      label: 'Monthly Payroll ($)',
      data: Object.values(deptSalary).map(v => Math.round(v)),
      backgroundColor: deptColors.map(c => c + 'bb'),
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const reports = [
    { id: 'overview', label: 'Overview', icon: <BarChart2 size={15}/> },
    { id: 'headcount', label: 'Headcount', icon: <Users size={15}/> },
    { id: 'payroll', label: 'Payroll', icon: <DollarSign size={15}/> },
    { id: 'attendance', label: 'Attendance', icon: <Calendar size={15}/> },
  ];

  const summaryCards = [
    {
      label: 'Total Headcount', value: employees.length, change: '+2 this month',
      up: true, icon: <Users size={20}/>, color: 'primary',
    },
    {
      label: 'Monthly Payroll', value: `$${Math.round(monthlyPayroll / 1000)}k`,
      change: '+1.2% vs last month', up: true, icon: <DollarSign size={20}/>, color: 'success',
    },
    {
      label: 'Avg Attendance', value: '93.4%', change: '+2.1% vs last month',
      up: true, icon: <Activity size={20}/>, color: 'info',
    },
    {
      label: 'Turnover Rate', value: '4.2%', change: '-0.8% vs last month',
      up: false, icon: <TrendingUp size={20}/>, color: 'warning',
    },
  ];

  const handleExport = () => {
    const data = employees.map(e => ({
      id: e.id, name: e.name, department: e.department, role: e.role,
      salary: e.salary, status: e.status, joinDate: e.joinDate, type: e.type,
    }));
    exportToCSV(data, 'nexushr_workforce_report', [
      { label: 'Employee ID', key: 'id' },
      { label: 'Name', key: 'name' },
      { label: 'Department', key: 'department' },
      { label: 'Role', key: 'role' },
      { label: 'Salary', key: 'salary' },
      { label: 'Status', key: 'status' },
      { label: 'Join Date', key: 'joinDate' },
      { label: 'Type', key: 'type' },
    ]);
    toast('Workforce report exported successfully!', 'success');
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Reports &amp; Analytics</h1>
          <p className="page-subtitle">Workforce insights, trends, and data-driven metrics</p>
        </div>
        <div className="page-header-actions">
          <div className="select-wrap">
            <select
              className="form-control"
              value={period}
              onChange={e => setPeriod(e.target.value)}
              style={{minWidth:'140px'}}
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
          <button className="btn btn-secondary" onClick={handleExport}>
            <Download size={15}/> Export CSV
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="kpi-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        {summaryCards.map(card => (
        <div key={card.label} className="kpi-card">
          <div className="kpi-icon" style={{background:'rgba(255,255,255,0.07)',color:'#e5e7eb'}}>{card.icon}</div>
          <div className="kpi-body">
            <div className="kpi-value">{card.value}</div>
            <div className="kpi-label">{card.label}</div>
            <div className={`kpi-change ${card.up ? 'up' : 'down'}`}>
              {card.up ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
              {card.change}
            </div>
          </div>
        </div>
      ))}
      </div>

      {/* Report Tabs */}
      <div className="tabs" style={{marginBottom:'24px'}}>
        {reports.map(r => (
          <button
            key={r.id}
            className={`tab-btn ${activeReport === r.id ? 'active' : ''}`}
            onClick={() => setActiveReport(r.id)}
          >
            {r.icon} {r.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeReport === 'overview' && (
        <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Headcount Trend</div>
                  <div className="card-subtitle">Monthly workforce growth</div>
                </div>
              </div>
              <div style={{height:'260px'}}>
                <Line data={headcountData} options={chartDefaults}/>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Workforce by Department</div>
                  <div className="card-subtitle">Current distribution</div>
                </div>
              </div>
              <div style={{height:'260px'}}>
                <Doughnut data={deptData} options={doughnutDefaults}/>
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Payroll Cost Trend</div>
                  <div className="card-subtitle">Monthly payroll expenditure</div>
                </div>
              </div>
              <div style={{height:'240px'}}>
                <Bar data={payrollTrend} options={{
                  ...chartDefaults,
                  plugins: { ...chartDefaults.plugins, legend: { display: false } },
                  scales: {
                    ...chartDefaults.scales,
                    y: { ...chartDefaults.scales.y, ticks: { ...chartDefaults.scales.y.ticks, callback: v => `$${(v/1000).toFixed(0)}k` } }
                  }
                }}/>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Attendance Overview</div>
                  <div className="card-subtitle">Presence vs absence rate (%)</div>
                </div>
              </div>
              <div style={{height:'240px'}}>
                <Bar data={attendanceData} options={{
                  ...chartDefaults,
                  scales: { x: chartDefaults.scales.x, y: { ...chartDefaults.scales.y, max: 100, ticks: { ...chartDefaults.scales.y.ticks, callback: v => `${v}%` } } },
                }}/>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Headcount */}
      {activeReport === 'headcount' && (
        <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Headcount by Month</div>
            </div>
            <div style={{height:'300px'}}>
              <Line data={headcountData} options={chartDefaults}/>
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="card-header"><div className="card-title">By Department</div></div>
              <div style={{height:'260px'}}>
                <Doughnut data={deptData} options={doughnutDefaults}/>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><div className="card-title">Employee Details</div></div>
              <div className="table-wrapper" style={{border:'none'}}>
                <table>
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Active</th>
                      <th>On Leave</th>
                      <th>Inactive</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(deptMap).map(([dept, total]) => {
                      const active = employees.filter(e => e.department === dept && e.status === 'Active').length;
                      const onLeave = employees.filter(e => e.department === dept && e.status === 'On Leave').length;
                      const inactive = employees.filter(e => e.department === dept && e.status === 'Inactive').length;
                      return (
                        <tr key={dept}>
                          <td><strong>{dept}</strong></td>
                          <td><span className="badge badge-success">{active}</span></td>
                          <td><span className="badge badge-warning">{onLeave}</span></td>
                          <td><span className="badge badge-muted">{inactive}</span></td>
                          <td><strong>{total}</strong></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payroll */}
      {activeReport === 'payroll' && (
        <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
          <div className="card">
            <div className="card-header"><div className="card-title">Monthly Payroll Trend</div></div>
            <div style={{height:'300px'}}>
              <Bar data={payrollTrend} options={{
                ...chartDefaults,
                plugins: { ...chartDefaults.plugins, legend: { display: false } },
                scales: { x: chartDefaults.scales.x, y: { ...chartDefaults.scales.y, ticks: { color: '#475569', callback: v => `$${(v/1000).toFixed(0)}k` } } }
              }}/>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Payroll by Department</div></div>
            <div style={{height:'280px'}}>
              <Bar data={salaryData} options={{
                ...chartDefaults,
                plugins: { ...chartDefaults.plugins, legend: { display: false } },
                scales: { x: chartDefaults.scales.x, y: { ...chartDefaults.scales.y, ticks: { color: '#475569', callback: v => `$${(v/1000).toFixed(0)}k` } } }
              }}/>
            </div>
          </div>
          <div className="table-wrapper">
            <div className="table-toolbar">
              <span className="card-title">Salary Breakdown</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Headcount</th>
                  <th>Avg Salary</th>
                  <th>Monthly Cost</th>
                  <th>Annual Cost</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(deptSalary).map(([dept, monthly]) => {
                  const count = deptMap[dept] || 1;
                  const avgSalary = employees.filter(e => e.department === dept).reduce((a, e) => a + e.salary, 0) / count;
                  return (
                    <tr key={dept}>
                      <td><strong>{dept}</strong></td>
                      <td>{count}</td>
                      <td>${avgSalary.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                      <td>${Math.round(monthly).toLocaleString()}</td>
                      <td>${Math.round(monthly * 12).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attendance */}
      {activeReport === 'attendance' && (
        <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
          <div className="card">
            <div className="card-header"><div className="card-title">Attendance Rate by Month</div></div>
            <div style={{height:'300px'}}>
              <Bar data={attendanceData} options={{
                ...chartDefaults,
                scales: {
                  x: chartDefaults.scales.x,
                  y: { ...chartDefaults.scales.y, max: 100, stacked: true, ticks: { color: '#475569', callback: v => `${v}%` } },
                  xAxis: { stacked: true },
                },
              }}/>
            </div>
          </div>
          <div className="grid-2">
            <div className="card">
              <div className="card-header"><div className="card-title">Monthly Summary</div></div>
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Present %</th>
                    <th>Absent %</th>
                    <th>Late %</th>
                  </tr>
                </thead>
                <tbody>
                  {MONTHS_FULL.map((m, i) => (
                    <tr key={m}>
                      <td><strong>{m}</strong></td>
                      <td><span className="badge badge-success">{[92, 88, 94, 91, 93, 95][i]}%</span></td>
                      <td><span className="badge badge-danger">{[4, 6, 3, 5, 4, 3][i]}%</span></td>
                      <td><span className="badge badge-warning">{[4, 6, 3, 4, 3, 2][i]}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card">
              <div className="card-header"><div className="card-title">Attendance Health Score</div></div>
              <div style={{display:'flex',flexDirection:'column',gap:'12px',marginTop:'8px'}}>
                {Object.entries(deptMap).map(([dept], i) => {
                  const score = [94, 91, 96, 90, 88][i] || 92;
                  const color = score >= 93 ? 'var(--success)' : score >= 88 ? 'var(--warning)' : 'var(--danger)';
                  return (
                    <div key={dept}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                        <span style={{fontSize:'0.85rem',color:'var(--text-secondary)'}}>{dept}</span>
                        <span style={{fontSize:'0.85rem',color,fontWeight:700}}>{score}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width:`${score}%`, background:color}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
