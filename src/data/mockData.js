// ===================================================
// MOCK DATA - Central data store for all HRM modules
// ===================================================

export const employees = [
  { id: 'EMP001', name: 'Jane Smith', email: 'jane.smith@nexushr.com', phone: '+1 (555) 201-4823', role: 'Senior Developer', department: 'Engineering', location: 'New York', salary: 95000, status: 'Active', joinDate: '2023-03-15', avatar: 'JS', avatarColor: '#6366f1', manager: 'David Chen', type: 'Full-time' },
  { id: 'EMP002', name: 'Michael Doe', email: 'michael.doe@nexushr.com', phone: '+1 (555) 394-2910', role: 'Account Executive', department: 'Sales', location: 'Los Angeles', salary: 72000, status: 'Active', joinDate: '2023-06-20', avatar: 'MD', avatarColor: '#f59e0b', manager: 'Lisa Ray', type: 'Full-time' },
  { id: 'EMP003', name: 'Sarah Jones', email: 'sarah.jones@nexushr.com', phone: '+1 (555) 482-3017', role: 'Marketing Manager', department: 'Marketing', location: 'Chicago', salary: 85000, status: 'Active', joinDate: '2022-11-01', avatar: 'SJ', avatarColor: '#38bdf8', manager: 'Mark Brown', type: 'Full-time' },
  { id: 'EMP004', name: 'David Chen', email: 'david.chen@nexushr.com', phone: '+1 (555) 573-8834', role: 'VP Engineering', department: 'Engineering', location: 'San Francisco', salary: 160000, status: 'Active', joinDate: '2020-01-10', avatar: 'DC', avatarColor: '#10b981', manager: 'CEO', type: 'Full-time' },
  { id: 'EMP005', name: 'Priya Patel', email: 'priya.patel@nexushr.com', phone: '+1 (555) 629-1045', role: 'HR Specialist', department: 'HR', location: 'Austin', salary: 65000, status: 'Active', joinDate: '2023-09-05', avatar: 'PP', avatarColor: '#f43f5e', manager: 'Laura White', type: 'Full-time' },
  { id: 'EMP006', name: 'Tom Wilson', email: 'tom.wilson@nexushr.com', phone: '+1 (555) 712-5539', role: 'Financial Analyst', department: 'Finance', location: 'Boston', salary: 78000, status: 'On Leave', joinDate: '2022-04-22', avatar: 'TW', avatarColor: '#8b5cf6', manager: 'Karen Mills', type: 'Full-time' },
  { id: 'EMP007', name: 'Emily Liu', email: 'emily.liu@nexushr.com', phone: '+1 (555) 831-6623', role: 'UX Designer', department: 'Engineering', location: 'Seattle', salary: 88000, status: 'Active', joinDate: '2023-01-18', avatar: 'EL', avatarColor: '#ec4899', manager: 'David Chen', type: 'Full-time' },
  { id: 'EMP008', name: 'James Carter', email: 'james.carter@nexushr.com', phone: '+1 (555) 920-4401', role: 'Sales Rep', department: 'Sales', location: 'Dallas', salary: 61000, status: 'Active', joinDate: '2024-02-10', avatar: 'JC', avatarColor: '#14b8a6', manager: 'Lisa Ray', type: 'Contract' },
  { id: 'EMP009', name: 'Anna Ross', email: 'anna.ross@nexushr.com', phone: '+1 (555) 046-2287', role: 'Content Writer', department: 'Marketing', location: 'Denver', salary: 55000, status: 'Active', joinDate: '2024-05-01', avatar: 'AR', avatarColor: '#a855f7', manager: 'Sarah Jones', type: 'Part-time' },
  { id: 'EMP010', name: 'Carlos Mendez', email: 'carlos.mendez@nexushr.com', phone: '+1 (555) 163-9920', role: 'DevOps Engineer', department: 'Engineering', location: 'Miami', salary: 99000, status: 'Active', joinDate: '2022-08-14', avatar: 'CM', avatarColor: '#0ea5e9', manager: 'David Chen', type: 'Full-time' },
  { id: 'EMP011', name: 'Lisa Ray', email: 'lisa.ray@nexushr.com', phone: '+1 (555) 284-7714', role: 'Sales Director', department: 'Sales', location: 'New York', salary: 130000, status: 'Active', joinDate: '2019-07-03', avatar: 'LR', avatarColor: '#f97316', manager: 'CEO', type: 'Full-time' },
  { id: 'EMP012', name: 'Ben Park', email: 'ben.park@nexushr.com', phone: '+1 (555) 375-4428', role: 'Backend Engineer', department: 'Engineering', location: 'Austin', salary: 105000, status: 'Inactive', joinDate: '2021-03-30', avatar: 'BP', avatarColor: '#6366f1', manager: 'David Chen', type: 'Full-time' },
];

export const departments = ['All', 'Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
export const statuses = ['All', 'Active', 'On Leave', 'Inactive'];
export const employeeTypes = ['Full-time', 'Part-time', 'Contract'];

// Attendance data - last 30 days
export const generateAttendance = (empId) => {
  const records = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      records.push({ date: date.toISOString().split('T')[0], status: 'weekend' });
      continue;
    }
    const rand = Math.random();
    let status = 'present';
    if (rand < 0.05) status = 'absent';
    else if (rand < 0.12) status = 'late';
    else if (rand < 0.16) status = 'leave';
    const checkIn = status === 'present' ? '09:00 AM' : status === 'late' ? `09:${Math.floor(Math.random()*30)+15} AM` : '-';
    const checkOut = (status === 'present' || status === 'late') ? '06:00 PM' : '-';
    records.push({ date: date.toISOString().split('T')[0], status, checkIn, checkOut, empId });
  }
  return records;
};

export const attendanceSummary = employees.map(e => ({
  empId: e.id,
  name: e.name,
  department: e.department,
  avatar: e.avatar,
  avatarColor: e.avatarColor,
  present: Math.floor(Math.random() * 5) + 18,
  absent: Math.floor(Math.random() * 2),
  late: Math.floor(Math.random() * 3),
  leave: Math.floor(Math.random() * 2),
  totalDays: 22,
}));

// Payroll data
export const payrollData = employees.map(e => {
  const gross = e.salary / 12;
  const tax = gross * 0.22;
  const insurance = gross * 0.04;
  const deductions = tax + insurance;
  const net = gross - deductions;
  return {
    empId: e.id,
    name: e.name,
    department: e.department,
    avatar: e.avatar,
    avatarColor: e.avatarColor,
    role: e.role,
    gross: Math.round(gross),
    tax: Math.round(tax),
    insurance: Math.round(insurance),
    deductions: Math.round(deductions),
    net: Math.round(net),
    status: e.status === 'Inactive' ? 'On Hold' : 'Processed',
    payPeriod: 'April 2026',
  };
});

// Recruitment data
export const jobs = [
  { id: 'JOB001', title: 'Full Stack Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time', openedDate: '2026-03-15', status: 'Open', applications: 34, postedBy: 'David Chen', priority: 'High' },
  { id: 'JOB002', title: 'Sales Manager', department: 'Sales', location: 'New York', type: 'Full-time', openedDate: '2026-04-02', status: 'Open', applications: 21, postedBy: 'Lisa Ray', priority: 'Medium' },
  { id: 'JOB003', title: 'UI/UX Designer', department: 'Engineering', location: 'Seattle', type: 'Full-time', openedDate: '2026-04-10', status: 'Open', applications: 18, postedBy: 'Emily Liu', priority: 'Medium' },
  { id: 'JOB004', title: 'Marketing Analyst', department: 'Marketing', location: 'Chicago', type: 'Part-time', openedDate: '2026-04-18', status: 'Open', applications: 9, postedBy: 'Sarah Jones', priority: 'Low' },
  { id: 'JOB005', title: 'Finance Controller', department: 'Finance', location: 'Boston', type: 'Full-time', openedDate: '2026-03-01', status: 'Closed', applications: 44, postedBy: 'Karen Mills', priority: 'High' },
];

export const candidates = [
  { id: 'CND001', name: 'Alex Turner', email: 'alex@email.com', jobId: 'JOB001', stage: 'Screening', rating: 4, appliedDate: '2026-04-05', avatar: 'AT', avatarColor: '#6366f1' },
  { id: 'CND002', name: 'Maria Garcia', email: 'maria@email.com', jobId: 'JOB001', stage: 'Interview', rating: 5, appliedDate: '2026-04-07', avatar: 'MG', avatarColor: '#10b981' },
  { id: 'CND003', name: 'Noah Kim', email: 'noah@email.com', jobId: 'JOB002', stage: 'Applied', rating: 3, appliedDate: '2026-04-12', avatar: 'NK', avatarColor: '#f59e0b' },
  { id: 'CND004', name: 'Olivia Brown', email: 'olivia@email.com', jobId: 'JOB001', stage: 'Offer', rating: 5, appliedDate: '2026-04-01', avatar: 'OB', avatarColor: '#f43f5e' },
  { id: 'CND005', name: 'Ethan Davis', email: 'ethan@email.com', jobId: 'JOB003', stage: 'Applied', rating: 3, appliedDate: '2026-04-18', avatar: 'ED', avatarColor: '#8b5cf6' },
  { id: 'CND006', name: 'Sofia Martinez', email: 'sofia@email.com', jobId: 'JOB002', stage: 'Screening', rating: 4, appliedDate: '2026-04-10', avatar: 'SM', avatarColor: '#38bdf8' },
  { id: 'CND007', name: 'Liam Johnson', email: 'liam@email.com', jobId: 'JOB003', stage: 'Interview', rating: 4, appliedDate: '2026-04-14', avatar: 'LJ', avatarColor: '#ec4899' },
  { id: 'CND008', name: 'Isabella White', email: 'isabella@email.com', jobId: 'JOB004', stage: 'Applied', rating: 3, appliedDate: '2026-04-20', avatar: 'IW', avatarColor: '#14b8a6' },
  { id: 'CND009', name: 'James Lee', email: 'james@email.com', jobId: 'JOB001', stage: 'Hired', rating: 5, appliedDate: '2026-03-28', avatar: 'JL', avatarColor: '#0ea5e9' },
];

export const KANBAN_STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];
