/**
 * PeopleCore HRM — API Client
 * ===========================
 * Centralized Axios-style fetch wrapper that talks to the
 * Spring Boot backend at http://localhost:8080/api
 *
 * All methods return parsed JSON.
 * JWT token is automatically attached from localStorage.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// ── Token helpers ─────────────────────────────────────────────

const getToken = () => localStorage.getItem('hrm_jwt');

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ── Core fetch wrapper ────────────────────────────────────────

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const defaults = {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  };

  const response = await fetch(url, { ...defaults, ...options,
    headers: { ...defaults.headers, ...(options.headers || {}) },
  });

  if (!response.ok) {
    let errorBody;
    try { errorBody = await response.json(); } catch { errorBody = {}; }
    const message = errorBody.detail || errorBody.message || `HTTP ${response.status}`;
    throw Object.assign(new Error(message), { status: response.status, body: errorBody });
  }

  // 204 No Content
  if (response.status === 204) return null;
  return response.json();
}

const get  = (path, params) => {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return request(path + qs);
};
const post  = (path, body) => request(path, { method: 'POST',  body: JSON.stringify(body) });
const put   = (path, body) => request(path, { method: 'PUT',   body: JSON.stringify(body) });
const patch = (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) });
const del   = (path)       => request(path, { method: 'DELETE' });

// ── Auth ──────────────────────────────────────────────────────

export const authApi = {
  login: (email, password) => post('/auth/login', { email, password }),
};

// ── Dashboard ─────────────────────────────────────────────────

export const dashboardApi = {
  getStats: () => get('/dashboard/stats'),
};

// ── Employees ─────────────────────────────────────────────────

export const employeeApi = {
  getAll:     (params) => get('/employees', params),
  getById:    (id)     => get(`/employees/${id}`),
  create:     (data)   => post('/employees', data),
  update:     (id, data) => put(`/employees/${id}`, data),
  remove:     (id)     => del(`/employees/${id}`),
};

// ── Attendance ────────────────────────────────────────────────

export const attendanceApi = {
  getSummary:  (from, to) => get('/attendance/summary', { from, to }),
  getByEmployee: (empId)  => get(`/attendance/${empId}`),
  mark:        (data)     => post('/attendance', data),
};

// ── Payroll ───────────────────────────────────────────────────

export const payrollApi = {
  getReport: (period) => get('/payroll', period ? { period } : undefined),
  getTotal:  ()       => get('/payroll/total'),
};

// ── Leave ─────────────────────────────────────────────────────

export const leaveApi = {
  getAll:        (params)     => get('/leaves', params),
  getByEmployee: (empId)      => get(`/leaves/employee/${empId}`),
  submit:        (data)       => post('/leaves', data),
  updateStatus:  (id, status) => patch(`/leaves/${id}/status`, { status }),
};

// ── Recruitment ───────────────────────────────────────────────

export const recruitmentApi = {
  getAllJobs:     ()     => get('/recruitment/jobs'),
  getOpenJobs:   ()     => get('/recruitment/jobs/open'),
  createJob:     (data) => post('/recruitment/jobs', data),
  updateJobStatus: (id, status) => patch(`/recruitment/jobs/${id}/status`, { status }),

  getAllCandidates: ()      => get('/recruitment/candidates'),
  getCandidatesByJob: (id) => get(`/recruitment/candidates/job/${id}`),
  moveCandidate:  (id, stage) => patch(`/recruitment/candidates/${id}/stage`, { stage }),
  getStats:       ()       => get('/recruitment/stats'),
};
