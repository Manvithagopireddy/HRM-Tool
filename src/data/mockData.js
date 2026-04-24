// ===================================================
// MOCK DATA — PeopleCore HRM
// Enriched with 12-month historical statistical data
// ===================================================

export const employees = [
  { id: 'EMP001', name: 'Jane Smith',    email: 'jane.smith@peoplecore.com',    phone: '+1 (555) 201-4823', role: 'Senior Developer',  department: 'Engineering', location: 'New York',      salary: 95000,  status: 'Active',   joinDate: '2023-03-15', avatar: 'JS', avatarColor: '#6366f1', manager: 'David Chen',  type: 'Full-time', performanceScore: 4.5, gender: 'Female', age: 29 },
  { id: 'EMP002', name: 'Michael Doe',   email: 'michael.doe@peoplecore.com',   phone: '+1 (555) 394-2910', role: 'Account Executive', department: 'Sales',       location: 'Los Angeles', salary: 72000,  status: 'Active',   joinDate: '2023-06-20', avatar: 'MD', avatarColor: '#f59e0b', manager: 'Lisa Ray',    type: 'Full-time', performanceScore: 3.8, gender: 'Male',   age: 32 },
  { id: 'EMP003', name: 'Sarah Jones',   email: 'sarah.jones@peoplecore.com',   phone: '+1 (555) 482-3017', role: 'Marketing Manager', department: 'Marketing',   location: 'Chicago',     salary: 85000,  status: 'Active',   joinDate: '2022-11-01', avatar: 'SJ', avatarColor: '#38bdf8', manager: 'Mark Brown',  type: 'Full-time', performanceScore: 4.2, gender: 'Female', age: 35 },
  { id: 'EMP004', name: 'David Chen',    email: 'david.chen@peoplecore.com',    phone: '+1 (555) 573-8834', role: 'VP Engineering',    department: 'Engineering', location: 'San Francisco',salary: 160000, status: 'Active',   joinDate: '2020-01-10', avatar: 'DC', avatarColor: '#10b981', manager: 'CEO',          type: 'Full-time', performanceScore: 4.9, gender: 'Male',   age: 41 },
  { id: 'EMP005', name: 'Priya Patel',   email: 'priya.patel@peoplecore.com',   phone: '+1 (555) 629-1045', role: 'HR Specialist',     department: 'HR',          location: 'Austin',      salary: 65000,  status: 'Active',   joinDate: '2023-09-05', avatar: 'PP', avatarColor: '#f43f5e', manager: 'Laura White', type: 'Full-time', performanceScore: 4.0, gender: 'Female', age: 27 },
  { id: 'EMP006', name: 'Tom Wilson',    email: 'tom.wilson@peoplecore.com',    phone: '+1 (555) 712-5539', role: 'Financial Analyst', department: 'Finance',     location: 'Boston',      salary: 78000,  status: 'On Leave', joinDate: '2022-04-22', avatar: 'TW', avatarColor: '#8b5cf6', manager: 'Karen Mills', type: 'Full-time', performanceScore: 3.6, gender: 'Male',   age: 30 },
  { id: 'EMP007', name: 'Emily Liu',     email: 'emily.liu@peoplecore.com',     phone: '+1 (555) 831-6623', role: 'UX Designer',       department: 'Engineering', location: 'Seattle',     salary: 88000,  status: 'Active',   joinDate: '2023-01-18', avatar: 'EL', avatarColor: '#ec4899', manager: 'David Chen',  type: 'Full-time', performanceScore: 4.6, gender: 'Female', age: 28 },
  { id: 'EMP008', name: 'James Carter',  email: 'james.carter@peoplecore.com',  phone: '+1 (555) 920-4401', role: 'Sales Rep',          department: 'Sales',       location: 'Dallas',      salary: 61000,  status: 'Active',   joinDate: '2024-02-10', avatar: 'JC', avatarColor: '#14b8a6', manager: 'Lisa Ray',    type: 'Contract',  performanceScore: 3.4, gender: 'Male',   age: 26 },
  { id: 'EMP009', name: 'Anna Ross',     email: 'anna.ross@peoplecore.com',     phone: '+1 (555) 046-2287', role: 'Content Writer',    department: 'Marketing',   location: 'Denver',      salary: 55000,  status: 'Active',   joinDate: '2024-05-01', avatar: 'AR', avatarColor: '#a855f7', manager: 'Sarah Jones', type: 'Part-time', performanceScore: 3.9, gender: 'Female', age: 24 },
  { id: 'EMP010', name: 'Carlos Mendez', email: 'carlos.mendez@peoplecore.com', phone: '+1 (555) 163-9920', role: 'DevOps Engineer',   department: 'Engineering', location: 'Miami',       salary: 99000,  status: 'Active',   joinDate: '2022-08-14', avatar: 'CM', avatarColor: '#0ea5e9', manager: 'David Chen',  type: 'Full-time', performanceScore: 4.3, gender: 'Male',   age: 33 },
  { id: 'EMP011', name: 'Lisa Ray',      email: 'lisa.ray@peoplecore.com',      phone: '+1 (555) 284-7714', role: 'Sales Director',    department: 'Sales',       location: 'New York',    salary: 130000, status: 'Active',   joinDate: '2019-07-03', avatar: 'LR', avatarColor: '#f97316', manager: 'CEO',          type: 'Full-time', performanceScore: 4.7, gender: 'Female', age: 38 },
  { id: 'EMP012', name: 'Ben Park',      email: 'ben.park@peoplecore.com',      phone: '+1 (555) 375-4428', role: 'Backend Engineer',  department: 'Engineering', location: 'Austin',      salary: 105000, status: 'Inactive', joinDate: '2021-03-30', avatar: 'BP', avatarColor: '#6366f1', manager: 'David Chen',  type: 'Full-time', performanceScore: 3.2, gender: 'Male',   age: 31 },
];

export const departments = ['All', 'Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
export const statuses     = ['All', 'Active', 'On Leave', 'Inactive'];
export const employeeTypes = ['Full-time', 'Part-time', 'Contract'];

// ─── 12-Month Historical Data (May 2025 → April 2026) ──────────────────────
export const MONTHS_12     = ['May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr'];
export const MONTHS_12_FULL = ['May 2025','Jun 2025','Jul 2025','Aug 2025','Sep 2025','Oct 2025','Nov 2025','Dec 2025','Jan 2026','Feb 2026','Mar 2026','Apr 2026'];

// Headcount growth — 12 months
export const headcountHistory = [8, 9, 9, 10, 10, 11, 11, 11, 12, 12, 12, 12];
export const newHiresHistory  = [1, 1, 0, 1, 0, 1,  0,  0,  1,  0,  0,  1 ];
export const terminationsHistory = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0];

// Monthly payroll cost ($)
export const payrollHistory = [
  61200, 68900, 68900, 75400, 75400, 82100,
  82100, 82100, 89800, 89800, 91500, 91500,
];

// Attendance % per month (Present / Absent / Late)
export const attendanceHistory = {
  present: [90, 88, 92, 91, 89, 93, 92, 88, 94, 91, 93, 95],
  absent:  [6,  8,  4,  5,  7,  4,  4,  6,  3,  5,  4,  3 ],
  late:    [4,  4,  4,  4,  4,  3,  4,  6,  3,  4,  3,  2 ],
};

// Recruitment funnel — applications received each month
export const recruitmentHistory = [12, 8, 15, 9, 11, 20, 17, 6, 22, 18, 14, 34];

// Turnover rate % per month
export const turnoverHistory = [0, 0, 0, 0, 8.3, 0, 0, 0, 0, 0, 0, 0];

// Average performance score per month (scale 1–5)
export const performanceHistory = [3.8, 3.9, 3.9, 4.0, 3.8, 4.1, 4.0, 3.9, 4.2, 4.1, 4.3, 4.2];

// Employee engagement score % (quarterly survey)
export const engagementHistory = [72, 72, 74, 74, 76, 76, 78, 78, 81, 81, 83, 83];

// ─── Department Statistics ──────────────────────────────────────────────────
export const departmentStats = {
  Engineering: { budget: 620000, headcount: 5, avgSalary: 109400, attritionRisk: 'Low',   engagementScore: 84, avgTenureYrs: 2.8 },
  Sales:       { budget: 295000, headcount: 3, avgSalary:  87667, attritionRisk: 'Medium', engagementScore: 78, avgTenureYrs: 2.1 },
  Marketing:   { budget: 175000, headcount: 2, avgSalary:  70000, attritionRisk: 'Low',   engagementScore: 80, avgTenureYrs: 2.3 },
  HR:          { budget: 68000,  headcount: 1, avgSalary:  65000, attritionRisk: 'Low',   engagementScore: 88, avgTenureYrs: 0.6 },
  Finance:     { budget: 85000,  headcount: 1, avgSalary:  78000, attritionRisk: 'High',  engagementScore: 71, avgTenureYrs: 4.0 },
};

// ─── Salary Distribution (bands) ───────────────────────────────────────────
export const salaryBands = [
  { range: '$40k–$60k',  count: 1, employees: ['EMP009'] },
  { range: '$60k–$80k',  count: 3, employees: ['EMP002','EMP005','EMP008'] },
  { range: '$80k–$100k', count: 4, employees: ['EMP001','EMP003','EMP007','EMP010'] },
  { range: '$100k–$120k',count: 2, employees: ['EMP006','EMP012'] },
  { range: '$120k+',     count: 2, employees: ['EMP004','EMP011'] },
];

// ─── Gender Distribution ───────────────────────────────────────────────────
export const genderStats = {
  Male:   employees.filter(e => e.gender === 'Male').length,
  Female: employees.filter(e => e.gender === 'Female').length,
};

// ─── Age Distribution ──────────────────────────────────────────────────────
export const ageBands = [
  { range: '20–25', count: employees.filter(e => e.age >= 20 && e.age <= 25).length },
  { range: '26–30', count: employees.filter(e => e.age >= 26 && e.age <= 30).length },
  { range: '31–35', count: employees.filter(e => e.age >= 31 && e.age <= 35).length },
  { range: '36–40', count: employees.filter(e => e.age >= 36 && e.age <= 40).length },
  { range: '41+',   count: employees.filter(e => e.age >= 41).length },
];

// ─── Cost Per Hire ($) ─────────────────────────────────────────────────────
export const costPerHireHistory = [3200, 2800, 3500, 2900, 4100, 3300, 3100, 2700, 3800, 3200, 2900, 3400];

// ─── Time to Fill (days) ───────────────────────────────────────────────────
export const timeToFillHistory = [28, 24, 32, 26, 35, 29, 27, 22, 31, 25, 23, 27];

// ─── Attendance Records ─────────────────────────────────────────────────────
export const generateAttendance = (empId) => {
  const records = [];
  const today   = new Date();
  for (let i = 29; i >= 0; i--) {
    const date     = new Date(today);
    date.setDate(today.getDate() - i);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      records.push({ date: date.toISOString().split('T')[0], status: 'weekend' });
      continue;
    }
    const rand   = Math.random();
    let status   = 'present';
    if (rand < 0.05) status = 'absent';
    else if (rand < 0.12) status = 'late';
    else if (rand < 0.16) status = 'leave';
    const checkIn  = status === 'present' ? '09:00 AM' : status === 'late' ? `09:${Math.floor(Math.random() * 30) + 15} AM` : '-';
    const checkOut = (status === 'present' || status === 'late') ? '06:00 PM' : '-';
    records.push({ date: date.toISOString().split('T')[0], status, checkIn, checkOut, empId });
  }
  return records;
};

export const attendanceSummary = employees.map(e => ({
  empId: e.id, name: e.name, department: e.department,
  avatar: e.avatar, avatarColor: e.avatarColor,
  present: Math.floor(Math.random() * 4) + 18,
  absent:  Math.floor(Math.random() * 2),
  late:    Math.floor(Math.random() * 3),
  leave:   Math.floor(Math.random() * 2),
  totalDays: 22,
}));

// ─── Payroll ────────────────────────────────────────────────────────────────
export const payrollData = employees.map(e => {
  const gross      = Math.round(e.salary / 12);
  const tax        = Math.round(gross * 0.22);
  const insurance  = Math.round(gross * 0.04);
  const retirement = Math.round(gross * 0.03);
  const deductions = tax + insurance + retirement;
  const net        = gross - deductions;
  return {
    empId: e.id, name: e.name, department: e.department,
    avatar: e.avatar, avatarColor: e.avatarColor, role: e.role,
    gross, tax, insurance, retirement,
    deductions, net,
    status: e.status === 'Inactive' ? 'On Hold' : 'Processed',
    payPeriod: 'April 2026',
  };
});

// ─── Recruitment ────────────────────────────────────────────────────────────
export const jobs = [
  { id: 'JOB001', title: 'Full Stack Engineer',  department: 'Engineering', location: 'Remote',    type: 'Full-time', openedDate: '2026-03-15', status: 'Open',   applications: 34, postedBy: 'David Chen',  priority: 'High',   daysOpen: 40, avgTimeToFill: 32 },
  { id: 'JOB002', title: 'Sales Manager',        department: 'Sales',       location: 'New York',  type: 'Full-time', openedDate: '2026-04-02', status: 'Open',   applications: 21, postedBy: 'Lisa Ray',    priority: 'Medium', daysOpen: 22, avgTimeToFill: 28 },
  { id: 'JOB003', title: 'UI/UX Designer',       department: 'Engineering', location: 'Seattle',   type: 'Full-time', openedDate: '2026-04-10', status: 'Open',   applications: 18, postedBy: 'Emily Liu',   priority: 'Medium', daysOpen: 14, avgTimeToFill: 26 },
  { id: 'JOB004', title: 'Marketing Analyst',    department: 'Marketing',   location: 'Chicago',   type: 'Part-time', openedDate: '2026-04-18', status: 'Open',   applications: 9,  postedBy: 'Sarah Jones', priority: 'Low',    daysOpen: 6,  avgTimeToFill: 21 },
  { id: 'JOB005', title: 'Finance Controller',   department: 'Finance',     location: 'Boston',    type: 'Full-time', openedDate: '2026-03-01', status: 'Closed', applications: 44, postedBy: 'Karen Mills', priority: 'High',   daysOpen: 0,  avgTimeToFill: 38 },
];

export const candidates = [
  { id: 'CND001', name: 'Alex Turner',     email: 'alex@email.com',     jobId: 'JOB001', stage: 'Screening', rating: 4, appliedDate: '2026-04-05', avatar: 'AT', avatarColor: '#6366f1' },
  { id: 'CND002', name: 'Maria Garcia',    email: 'maria@email.com',    jobId: 'JOB001', stage: 'Interview', rating: 5, appliedDate: '2026-04-07', avatar: 'MG', avatarColor: '#10b981' },
  { id: 'CND003', name: 'Noah Kim',        email: 'noah@email.com',     jobId: 'JOB002', stage: 'Applied',   rating: 3, appliedDate: '2026-04-12', avatar: 'NK', avatarColor: '#f59e0b' },
  { id: 'CND004', name: 'Olivia Brown',    email: 'olivia@email.com',   jobId: 'JOB001', stage: 'Offer',     rating: 5, appliedDate: '2026-04-01', avatar: 'OB', avatarColor: '#f43f5e' },
  { id: 'CND005', name: 'Ethan Davis',     email: 'ethan@email.com',    jobId: 'JOB003', stage: 'Applied',   rating: 3, appliedDate: '2026-04-18', avatar: 'ED', avatarColor: '#8b5cf6' },
  { id: 'CND006', name: 'Sofia Martinez',  email: 'sofia@email.com',    jobId: 'JOB002', stage: 'Screening', rating: 4, appliedDate: '2026-04-10', avatar: 'SM', avatarColor: '#38bdf8' },
  { id: 'CND007', name: 'Liam Johnson',    email: 'liam@email.com',     jobId: 'JOB003', stage: 'Interview', rating: 4, appliedDate: '2026-04-14', avatar: 'LJ', avatarColor: '#ec4899' },
  { id: 'CND008', name: 'Isabella White',  email: 'isabella@email.com', jobId: 'JOB004', stage: 'Applied',   rating: 3, appliedDate: '2026-04-20', avatar: 'IW', avatarColor: '#14b8a6' },
  { id: 'CND009', name: 'James Lee',       email: 'james@email.com',    jobId: 'JOB001', stage: 'Hired',     rating: 5, appliedDate: '2026-03-28', avatar: 'JL', avatarColor: '#0ea5e9' },
];

export const KANBAN_STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];
