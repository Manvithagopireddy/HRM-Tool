import React, { useState } from 'react';
import {
  BarChart2, TrendingUp, Users, DollarSign, Download,
  Calendar, ArrowUpRight, ArrowDownRight, Activity, RefreshCw,
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
  plugins: {
    legend: { labels: { color: '#6b7280', font: { family: 'Inter', size: 12 } } },
    tooltip: {
      backgroundColor: '#1a1a1a',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      titleColor: '#f9fafb',
      bodyColor: '#9ca3af',
      padding: 12,
      cornerRadius: 10,
    },
  },
  scales: {
    x: {
      ticks: { color: '#4b5563', font: { size: 11 } },
      grid: { color: 'rgba(255,255,255,0.03)' },
      border: { color: 'rgba(255,255,255,0.06)' },
    },
    y: {
      ticks: { color: '#4b5563', font: { size: 11 } },
      grid: { color: 'rgba(255,255,255,0.03)' },
      border: { color: 'rgba(255,255,255,0.06)' },
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};

const doughnutDefaults = {
  plugins: {
    legend: {
      position: 'right',
      labels: { color: '#6b7280', padding: 18, font: { family: 'Inter', size: 12 }, usePointStyle: true, pointStyleWidth: 8 },
    },
    tooltip: chartDefaults.plugins.tooltip,
  },
  responsive: true,
  maintainAspectRatio: false,
  cutout: '72%',
};

/* ── Inline styles ── */
const S = {
  page: { display: 'flex', flexDirection: 'column', gap: 0 },

  header: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    marginBottom: '32px', gap: 16,
  },
  titleWrap: { display: 'flex', flexDirection: 'column', gap: 4 },
  titleRow: { display: 'flex', alignItems: 'center', gap: 12 },
  liveDot: {
    width: 8, height: 8, borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 0 3px rgba(74,222,128,0.2)',
    animation: 'pulse 2s infinite',
  },
  liveLabel: {
    fontSize: '0.7rem', fontWeight: 700, color: '#4ade80',
    background: 'rgba(74,222,128,0.1)', padding: '2px 8px',
    borderRadius: 100, border: '1px solid rgba(74,222,128,0.2)',
    letterSpacing: '0.5px', textTransform: 'uppercase',
  },
  headerActions: { display: 'flex', gap: 10, alignItems: 'center' },

  periodSelect: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, padding: '9px 14px',
    color: '#e5e7eb', fontSize: '0.875rem',
    fontFamily: 'Inter, sans-serif', cursor: 'pointer', outline: 'none',
    minWidth: 145,
  },

  /* KPI grid */
  kpiGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
    gap: 16, marginBottom: 28,
  },
  kpiCard: (accent) => ({
    background: 'linear-gradient(145deg, #1e1e1e 0%, #191919 100%)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, padding: '20px',
    display: 'flex', flexDirection: 'column', gap: 16,
    position: 'relative', overflow: 'hidden',
    boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
    transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
    borderTop: `2px solid ${accent}`,
    cursor: 'default',
  }),
  kpiTopRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  kpiIconBox: (accent) => ({
    width: 40, height: 40, borderRadius: 11,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: `${accent}1a`, color: accent, flexShrink: 0,
    border: `1px solid ${accent}28`,
  }),
  kpiValue: {
    fontSize: '2rem', fontWeight: 800,
    color: '#f9fafb', lineHeight: 1, letterSpacing: '-1.5px',
    marginTop: 2,
  },
  kpiLabel: { fontSize: '0.75rem', color: '#6b7280', marginTop: 5, fontWeight: 500, letterSpacing: '0.2px' },
  kpiChange: (up) => ({
    display: 'inline-flex', alignItems: 'center', gap: 3,
    fontSize: '0.7rem', fontWeight: 600,
    padding: '3px 8px', borderRadius: 100,
    background: up ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
    color: up ? '#4ade80' : '#f87171',
    border: up ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(248,113,113,0.2)',
  }),
  kpiOrb: (accent) => ({
    position: 'absolute', bottom: -20, right: -20,
    width: 90, height: 90, borderRadius: '50%',
    background: `radial-gradient(circle, ${accent}14 0%, transparent 70%)`,
    pointerEvents: 'none',
  }),

  /* Tabs */
  tabBar: {
    display: 'flex', gap: 2,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12, padding: 4,
    marginBottom: 24,
  },
  tabBtn: (active) => ({
    flex: 1,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
    padding: '9px 16px', borderRadius: 9,
    fontSize: '0.85rem', fontWeight: 600,
    border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
    transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
    background: active ? 'rgba(255,255,255,0.11)' : 'transparent',
    color: active ? '#f9fafb' : '#4b5563',
    boxShadow: active ? '0 2px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)' : 'none',
  }),

  /* Chart card */
  chartCard: {
    background: 'linear-gradient(145deg, #1e1e1e 0%, #191919 100%)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, padding: '22px 22px 20px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
    transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
    position: 'relative', overflow: 'hidden',
  },
  chartCardHdr: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 20,
  },
  chartTitle: { fontSize: '0.95rem', fontWeight: 700, color: '#f9fafb', letterSpacing: '-0.2px' },
  chartSub: { fontSize: '0.77rem', color: '#4b5563', marginTop: 4 },

  /* Progress bar */
  progressWrap: { display: 'flex', flexDirection: 'column', gap: 16, marginTop: 4 },
  progressRow: { display: 'flex', flexDirection: 'column', gap: 7 },
  progressMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { fontSize: '0.8rem', color: '#9ca3af', fontWeight: 500 },
  progressScore: (c) => ({ fontSize: '0.8rem', color: c, fontWeight: 700 }),
  progressTrack: {
    width: '100%', height: 6, background: 'rgba(255,255,255,0.05)',
    borderRadius: 100, overflow: 'hidden',
  },
  progressFill: (w, c) => ({
    height: '100%', width: `${w}%`, borderRadius: 100,
    background: `linear-gradient(90deg, ${c}bb, ${c})`,
    transition: 'width 0.7s cubic-bezier(0.4,0,0.2,1)',
    boxShadow: `0 0 10px ${c}44`,
  }),

  /* Dept dot */
  deptDot: (c) => ({
    width: 8, height: 8, borderRadius: '50%',
    background: c, display: 'inline-block',
    marginRight: 8, flexShrink: 0,
  }),
};

const ACCENTS = ['#a78bfa', '#34d399', '#60a5fa', '#fbbf24'];
const TAB_ICONS = {
  overview:   <BarChart2 size={14} />,
  headcount:  <Users size={14} />,
  payroll:    <DollarSign size={14} />,
  attendance: <Calendar size={14} />,
};

function ChartCard({ title, subtitle, height = 260, children, badge }) {
  return (
    <div style={S.chartCard}>
      <div style={S.chartCardHdr}>
        <div>
          <div style={S.chartTitle}>{title}</div>
          {subtitle && <div style={S.chartSub}>{subtitle}</div>}
        </div>
        {badge && (
          <span style={{
            fontSize: '0.7rem', fontWeight: 700, padding: '3px 9px',
            borderRadius: 100, background: 'rgba(255,255,255,0.06)',
            color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)',
          }}>{badge}</span>
        )}
      </div>
      <div style={{ height }}>{children}</div>
    </div>
  );
}

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
      borderColor: '#a78bfa', backgroundColor: 'rgba(167,139,250,0.08)',
      fill: true, tension: 0.4, pointBackgroundColor: '#a78bfa',
      pointBorderColor: '#191919', pointBorderWidth: 2, pointRadius: 5,
    }, {
      label: 'New Hires',
      data: [1, 2, 0, 1, 2, 1],
      borderColor: '#6b7280', backgroundColor: 'rgba(107,114,128,0.06)',
      fill: true, tension: 0.4, pointBackgroundColor: '#6b7280',
      pointBorderColor: '#191919', pointBorderWidth: 2, pointRadius: 5,
    }],
  };

  const deptMap = {};
  employees.forEach(e => { deptMap[e.department] = (deptMap[e.department] || 0) + 1; });
  const deptColors = ['#a78bfa', '#34d399', '#60a5fa', '#fbbf24', '#f87171', '#6b7280'];
  const deptData = {
    labels: Object.keys(deptMap),
    datasets: [{
      data: Object.values(deptMap),
      backgroundColor: deptColors,
      borderColor: '#191919',
      borderWidth: 3,
      hoverOffset: 10,
    }],
  };

  const monthlyPayroll = employees.reduce((a, e) => a + e.salary / 12, 0);
  const payrollTrend = {
    labels: MONTHS,
    datasets: [{
      label: 'Payroll Cost ($)',
      data: [monthlyPayroll * 0.94, monthlyPayroll * 0.96, monthlyPayroll * 0.97, monthlyPayroll * 0.98, monthlyPayroll * 0.99, monthlyPayroll],
      backgroundColor: MONTHS.map((_, i) =>
        i === MONTHS.length - 1 ? 'rgba(167,139,250,0.75)' : 'rgba(167,139,250,0.3)'
      ),
      borderRadius: 8, borderSkipped: false,
    }],
  };

  const attendanceData = {
    labels: MONTHS,
    datasets: [
      { label: 'Present', data: [92, 88, 94, 91, 93, 95], backgroundColor: 'rgba(52,211,153,0.7)', borderRadius: 5 },
      { label: 'Absent',  data: [4, 6, 3, 5, 4, 3],      backgroundColor: 'rgba(248,113,113,0.6)', borderRadius: 5 },
      { label: 'Late',    data: [4, 6, 3, 4, 3, 2],       backgroundColor: 'rgba(251,191,36,0.5)',  borderRadius: 5 },
    ],
  };

  const deptSalary = {};
  employees.forEach(e => { deptSalary[e.department] = (deptSalary[e.department] || 0) + e.salary / 12; });
  const salaryData = {
    labels: Object.keys(deptSalary),
    datasets: [{
      label: 'Monthly Payroll ($)',
      data: Object.values(deptSalary).map(v => Math.round(v)),
      backgroundColor: deptColors.map(c => c + 'aa'),
      borderRadius: 8, borderSkipped: false,
    }],
  };

  const TABS = ['overview', 'headcount', 'payroll', 'attendance'];
  const TAB_LABELS = { overview: 'Overview', headcount: 'Headcount', payroll: 'Payroll', attendance: 'Attendance' };

  const summaryCards = [
    { label: 'Total Headcount', value: employees.length, change: '+2 this month', up: true, icon: <Users size={18}/> },
    { label: 'Monthly Payroll', value: `$${Math.round(monthlyPayroll / 1000)}k`, change: '+1.2% vs last month', up: true, icon: <DollarSign size={18}/> },
    { label: 'Avg Attendance', value: '93.4%', change: '+2.1% vs last month', up: true, icon: <Activity size={18}/> },
    { label: 'Turnover Rate', value: '4.2%', change: '-0.8% vs last month', up: false, icon: <TrendingUp size={18}/> },
  ];

  const handleExport = () => {
    const data = employees.map(e => ({
      id: e.id, name: e.name, department: e.department, role: e.role,
      salary: e.salary, status: e.status, joinDate: e.joinDate, type: e.type,
    }));
    exportToCSV(data, 'hr_workforce_report', [
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

  const payrollOpts = {
    ...chartDefaults,
    plugins: { ...chartDefaults.plugins, legend: { display: false } },
    scales: {
      x: chartDefaults.scales.x,
      y: { ...chartDefaults.scales.y, ticks: { color: '#4b5563', callback: v => `$${(v/1000).toFixed(0)}k` } },
    },
  };
  const attendOpts = {
    ...chartDefaults,
    scales: {
      x: chartDefaults.scales.x,
      y: { ...chartDefaults.scales.y, max: 100, ticks: { color: '#4b5563', callback: v => `${v}%` } },
    },
  };

  return (
    <div className="fade-in" style={S.page}>

      {/* ── Header ── */}
      <div style={S.header}>
        <div style={S.titleWrap}>
          <div style={S.titleRow}>
            <h1 className="page-title">Reports & Analytics</h1>
            <span style={S.liveLabel}>Live</span>
            <span style={S.liveDot} />
          </div>
          <p className="page-subtitle">Workforce insights, trends, and data-driven metrics across all departments</p>
        </div>
        <div style={S.headerActions}>
          <select
            style={S.periodSelect}
            value={period}
            onChange={e => setPeriod(e.target.value)}
          >
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
          </select>
          <button className="btn btn-primary" onClick={handleExport} style={{ gap: 8 }}>
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div style={S.kpiGrid}>
        {summaryCards.map((card, i) => (
          <div
            key={card.label}
            style={S.kpiCard(ACCENTS[i])}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 12px 36px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)`;
              e.currentTarget.style.borderColor = `${ACCENTS[i]}44`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
            }}
          >
            <div style={S.kpiOrb(ACCENTS[i])} />
            <div style={S.kpiTopRow}>
              <div style={S.kpiIconBox(ACCENTS[i])}>{card.icon}</div>
              <span style={S.kpiChange(card.up)}>
                {card.up ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>}
                {card.change}
              </span>
            </div>
            <div>
              <div style={S.kpiValue}>{card.value}</div>
              <div style={S.kpiLabel}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tab Bar ── */}
      <div style={{ ...S.tabBar, width: '100%', marginBottom: 28 }}>
        {TABS.map(id => (
          <button
            key={id}
            style={S.tabBtn(activeReport === id)}
            onClick={() => setActiveReport(id)}
          >
            {TAB_ICONS[id]}
            {TAB_LABELS[id]}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeReport === 'overview' && (
        <div className="tab-fade" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="grid-2">
            <ChartCard title="Headcount Trend" subtitle="Monthly workforce growth" badge="6 months">
              <Line data={headcountData} options={chartDefaults} />
            </ChartCard>
            <ChartCard title="Workforce by Department" subtitle="Current headcount distribution">
              <Doughnut data={deptData} options={doughnutDefaults} />
            </ChartCard>
          </div>
          <div className="grid-2">
            <ChartCard title="Payroll Cost Trend" subtitle="Monthly payroll expenditure" height={240} badge="↑ 1.2%">
              <Bar data={payrollTrend} options={payrollOpts} />
            </ChartCard>
            <ChartCard title="Attendance Overview" subtitle="Present vs absent rate (%)" height={240}>
              <Bar data={attendanceData} options={attendOpts} />
            </ChartCard>
          </div>
        </div>
      )}

      {/* ── Headcount ── */}
      {activeReport === 'headcount' && (
        <div className="tab-fade" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ChartCard title="Headcount by Month" subtitle="Total employees & new hires trend" height={300}>
            <Line data={headcountData} options={chartDefaults} />
          </ChartCard>
          <div className="grid-2">
            <ChartCard title="By Department" subtitle="Current distribution" height={260}>
              <Doughnut data={deptData} options={doughnutDefaults} />
            </ChartCard>
            <div style={S.chartCard}>
              <div style={S.chartCardHdr}>
                <div>
                  <div style={S.chartTitle}>Employee Details</div>
                  <div style={S.chartSub}>Status breakdown per department</div>
                </div>
              </div>
              <div className="table-wrapper" style={{ border: 'none', background: 'transparent' }}>
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
                      const active   = employees.filter(e => e.department === dept && e.status === 'Active').length;
                      const onLeave  = employees.filter(e => e.department === dept && e.status === 'On Leave').length;
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

      {/* ── Payroll ── */}
      {activeReport === 'payroll' && (
        <div className="tab-fade" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ChartCard title="Monthly Payroll Trend" subtitle="Total payroll cost over last 6 months" height={300} badge="↑ 1.2%">
            <Bar data={payrollTrend} options={payrollOpts} />
          </ChartCard>
          <ChartCard title="Payroll by Department" subtitle="Monthly cost breakdown per team" height={280}>
            <Bar data={salaryData} options={payrollOpts} />
          </ChartCard>
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
                {Object.entries(deptSalary).map(([dept, monthly], di) => {
                  const count = deptMap[dept] || 1;
                  const avgSalary = employees.filter(e => e.department === dept).reduce((a, e) => a + e.salary, 0) / count;
                  return (
                    <tr key={dept}>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                          <span style={S.deptDot(deptColors[di % deptColors.length])} />
                          <strong>{dept}</strong>
                        </span>
                      </td>
                      <td>{count}</td>
                      <td>${avgSalary.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                      <td>${Math.round(monthly).toLocaleString()}</td>
                      <td><strong>${Math.round(monthly * 12).toLocaleString()}</strong></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Attendance ── */}
      {activeReport === 'attendance' && (
        <div className="tab-fade" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ChartCard title="Attendance Rate by Month" subtitle="Present, absent & late breakdown (%)" height={300}>
            <Bar data={attendanceData} options={{
              ...attendOpts,
              scales: {
                x: { ...chartDefaults.scales.x, stacked: true },
                y: { ...chartDefaults.scales.y, stacked: true, max: 100, ticks: { color: '#4b5563', callback: v => `${v}%` } },
              },
            }} />
          </ChartCard>
          <div className="grid-2">
            <div style={S.chartCard}>
              <div style={S.chartCardHdr}>
                <div>
                  <div style={S.chartTitle}>Monthly Summary</div>
                  <div style={S.chartSub}>6-month attendance breakdown</div>
                </div>
              </div>
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
                      <td><span className="badge badge-success">{[92,88,94,91,93,95][i]}%</span></td>
                      <td><span className="badge badge-danger">{[4,6,3,5,4,3][i]}%</span></td>
                      <td><span className="badge badge-warning">{[4,6,3,4,3,2][i]}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={S.chartCard}>
              <div style={S.chartCardHdr}>
                <div>
                  <div style={S.chartTitle}>Attendance Health Score</div>
                  <div style={S.chartSub}>Presence rate by department</div>
                </div>
              </div>
              <div style={S.progressWrap}>
                {Object.entries(deptMap).map(([dept], i) => {
                  const score = [94, 91, 96, 90, 88][i] ?? 92;
                  const color = score >= 93 ? '#4ade80' : score >= 88 ? '#fbbf24' : '#f87171';
                  return (
                    <div key={dept} style={S.progressRow}>
                      <div style={S.progressMeta}>
                        <span style={S.progressLabel}>{dept}</span>
                        <span style={S.progressScore(color)}>{score}%</span>
                      </div>
                      <div style={S.progressTrack}>
                        <div style={S.progressFill(score, color)} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 3px rgba(74,222,128,0.2); }
          50% { opacity: 0.5; box-shadow: 0 0 0 6px rgba(74,222,128,0.05); }
        }
        .tab-fade {
          animation: tabFadeIn 0.2s ease;
        }
        @keyframes tabFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rpt-chart-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.12);
        }
      `}</style>
    </div>
  );
}
