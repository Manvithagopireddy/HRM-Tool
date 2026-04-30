-- =============================================================
-- PeopleCore HRM — Seed Data (H2 / dev)
-- Runs automatically via spring.sql.init.mode=always
-- =============================================================

-- ── Departments ──────────────────────────────────────────────
INSERT INTO departments (id, name, budget, engagement_score, attrition_risk, avg_tenure_yrs) VALUES
  (1, 'Engineering', 620000, 84, 'LOW',    2.8),
  (2, 'Sales',       295000, 78, 'MEDIUM', 2.1),
  (3, 'Marketing',   175000, 80, 'LOW',    2.3),
  (4, 'HR',          68000,  88, 'LOW',    0.6),
  (5, 'Finance',     85000,  71, 'HIGH',   4.0);

-- ── Users / Employees ─────────────────────────────────────────
-- Passwords stored as BCrypt hash of the plain-text below:
--   admin@peoplecore.com → admin123
--   hr@peoplecore.com    → hr12345
INSERT INTO users (id, email, password_hash, full_name, role, avatar_initials, avatar_color) VALUES
  (1, 'admin@peoplecore.com', '$2a$12$jKz4bLrJ1KqJQb4GaXRguuY9hUJlm5QzXuRdgRp7V6tLmWNUw7H4a', 'Admin User', 'HR_MANAGER',   'AD', '#2a2a2a'),
  (2, 'hr@peoplecore.com',    '$2a$12$0pUC3BkHN9RJb7HCf7pOCewHZfDO6NHoG5SH4P5KpXPpxE.O5H1OC', 'HR Staff',   'HR_SPECIALIST', 'HS', '#10b981');

INSERT INTO employees (id, emp_code, full_name, email, phone, role, department_id, location, salary, status, join_date, avatar_initials, avatar_color, manager_name, employment_type, performance_score, gender, age) VALUES
  ('EMP001','EMP001','Jane Smith',    'jane.smith@peoplecore.com',    '+1 (555) 201-4823', 'Senior Developer',  1, 'New York',       95000,  'ACTIVE',    '2023-03-15', 'JS', '#6366f1', 'David Chen',  'FULL_TIME', 4.5, 'FEMALE', 29),
  ('EMP002','EMP002','Michael Doe',   'michael.doe@peoplecore.com',   '+1 (555) 394-2910', 'Account Executive', 2, 'Los Angeles',    72000,  'ACTIVE',    '2023-06-20', 'MD', '#f59e0b', 'Lisa Ray',    'FULL_TIME', 3.8, 'MALE',   32),
  ('EMP003','EMP003','Sarah Jones',   'sarah.jones@peoplecore.com',   '+1 (555) 482-3017', 'Marketing Manager', 3, 'Chicago',        85000,  'ACTIVE',    '2022-11-01', 'SJ', '#38bdf8', 'Mark Brown',  'FULL_TIME', 4.2, 'FEMALE', 35),
  ('EMP004','EMP004','David Chen',    'david.chen@peoplecore.com',    '+1 (555) 573-8834', 'VP Engineering',    1, 'San Francisco',  160000, 'ACTIVE',    '2020-01-10', 'DC', '#10b981', 'CEO',         'FULL_TIME', 4.9, 'MALE',   41),
  ('EMP005','EMP005','Priya Patel',   'priya.patel@peoplecore.com',   '+1 (555) 629-1045', 'HR Specialist',     4, 'Austin',         65000,  'ACTIVE',    '2023-09-05', 'PP', '#f43f5e', 'Laura White', 'FULL_TIME', 4.0, 'FEMALE', 27),
  ('EMP006','EMP006','Tom Wilson',    'tom.wilson@peoplecore.com',    '+1 (555) 712-5539', 'Financial Analyst', 5, 'Boston',         78000,  'ON_LEAVE',  '2022-04-22', 'TW', '#8b5cf6', 'Karen Mills', 'FULL_TIME', 3.6, 'MALE',   30),
  ('EMP007','EMP007','Emily Liu',     'emily.liu@peoplecore.com',     '+1 (555) 831-6623', 'UX Designer',       1, 'Seattle',        88000,  'ACTIVE',    '2023-01-18', 'EL', '#ec4899', 'David Chen',  'FULL_TIME', 4.6, 'FEMALE', 28),
  ('EMP008','EMP008','James Carter',  'james.carter@peoplecore.com',  '+1 (555) 920-4401', 'Sales Rep',         2, 'Dallas',         61000,  'ACTIVE',    '2024-02-10', 'JC', '#14b8a6', 'Lisa Ray',    'CONTRACT',  3.4, 'MALE',   26),
  ('EMP009','EMP009','Anna Ross',     'anna.ross@peoplecore.com',     '+1 (555) 046-2287', 'Content Writer',    3, 'Denver',         55000,  'ACTIVE',    '2024-05-01', 'AR', '#a855f7', 'Sarah Jones', 'PART_TIME', 3.9, 'FEMALE', 24),
  ('EMP010','EMP010','Carlos Mendez', 'carlos.mendez@peoplecore.com', '+1 (555) 163-9920', 'DevOps Engineer',   1, 'Miami',          99000,  'ACTIVE',    '2022-08-14', 'CM', '#0ea5e9', 'David Chen',  'FULL_TIME', 4.3, 'MALE',   33),
  ('EMP011','EMP011','Lisa Ray',      'lisa.ray@peoplecore.com',      '+1 (555) 284-7714', 'Sales Director',    2, 'New York',       130000, 'ACTIVE',    '2019-07-03', 'LR', '#f97316', 'CEO',         'FULL_TIME', 4.7, 'FEMALE', 38),
  ('EMP012','EMP012','Ben Park',      'ben.park@peoplecore.com',      '+1 (555) 375-4428', 'Backend Engineer',  1, 'Austin',         105000, 'INACTIVE',  '2021-03-30', 'BP', '#6366f1', 'David Chen',  'FULL_TIME', 3.2, 'MALE',   31);

-- ── Leave Requests ────────────────────────────────────────────
INSERT INTO leave_requests (id, emp_id, leave_type, from_date, to_date, days, reason, status, applied_on) VALUES
  ('LV001', 'EMP006', 'MEDICAL',  '2026-04-20', '2026-04-23', 3, 'Medical procedure recovery', 'APPROVED', '2026-04-18'),
  ('LV002', 'EMP009', 'ANNUAL',   '2026-05-05', '2026-05-09', 5, 'Family vacation',            'PENDING',  '2026-04-20'),
  ('LV003', 'EMP003', 'PERSONAL', '2026-04-29', '2026-04-29', 1, 'Personal appointment',       'PENDING',  '2026-04-21'),
  ('LV004', 'EMP008', 'ANNUAL',   '2026-05-12', '2026-05-16', 5, 'Holiday trip',               'REJECTED', '2026-04-15'),
  ('LV005', 'EMP005', 'SICK',     '2026-04-22', '2026-04-22', 1, 'Feeling unwell',             'APPROVED', '2026-04-22');

-- ── Jobs ─────────────────────────────────────────────────────
INSERT INTO jobs (id, title, department_id, location, job_type, opened_date, status, applications, posted_by, priority, days_open, avg_time_to_fill) VALUES
  ('JOB001', 'Full Stack Engineer', 1, 'Remote',    'FULL_TIME', '2026-03-15', 'OPEN',   34, 'David Chen',  'HIGH',   40, 32),
  ('JOB002', 'Sales Manager',       2, 'New York',  'FULL_TIME', '2026-04-02', 'OPEN',   21, 'Lisa Ray',    'MEDIUM', 22, 28),
  ('JOB003', 'UI/UX Designer',      1, 'Seattle',   'FULL_TIME', '2026-04-10', 'OPEN',   18, 'Emily Liu',   'MEDIUM', 14, 26),
  ('JOB004', 'Marketing Analyst',   3, 'Chicago',   'PART_TIME', '2026-04-18', 'OPEN',   9,  'Sarah Jones', 'LOW',    6,  21),
  ('JOB005', 'Finance Controller',  5, 'Boston',    'FULL_TIME', '2026-03-01', 'CLOSED', 44, 'Karen Mills', 'HIGH',   0,  38);

-- ── Candidates ───────────────────────────────────────────────
INSERT INTO candidates (id, full_name, email, job_id, stage, rating, applied_date, avatar_initials, avatar_color) VALUES
  ('CND001', 'Alex Turner',    'alex@email.com',     'JOB001', 'SCREENING', 4, '2026-04-05', 'AT', '#6366f1'),
  ('CND002', 'Maria Garcia',   'maria@email.com',    'JOB001', 'INTERVIEW', 5, '2026-04-07', 'MG', '#10b981'),
  ('CND003', 'Noah Kim',       'noah@email.com',     'JOB002', 'APPLIED',   3, '2026-04-12', 'NK', '#f59e0b'),
  ('CND004', 'Olivia Brown',   'olivia@email.com',   'JOB001', 'OFFER',     5, '2026-04-01', 'OB', '#f43f5e'),
  ('CND005', 'Ethan Davis',    'ethan@email.com',    'JOB003', 'APPLIED',   3, '2026-04-18', 'ED', '#8b5cf6'),
  ('CND006', 'Sofia Martinez', 'sofia@email.com',    'JOB002', 'SCREENING', 4, '2026-04-10', 'SM', '#38bdf8'),
  ('CND007', 'Liam Johnson',   'liam@email.com',     'JOB003', 'INTERVIEW', 4, '2026-04-14', 'LJ', '#ec4899'),
  ('CND008', 'Isabella White', 'isabella@email.com', 'JOB004', 'APPLIED',   3, '2026-04-20', 'IW', '#14b8a6'),
  ('CND009', 'James Lee',      'james@email.com',    'JOB001', 'HIRED',     5, '2026-03-28', 'JL', '#0ea5e9');
