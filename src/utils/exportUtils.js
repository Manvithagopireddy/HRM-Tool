/**
 * CSV Export Utility
 */
export const exportToCSV = (data, filename, columns) => {
  const header = columns.map(c => c.label).join(',');
  const rows = data.map(row =>
    columns.map(c => {
      const val = c.accessor ? c.accessor(row) : row[c.key];
      // Escape commas/quotes
      const str = String(val ?? '').replace(/"/g, '""');
      return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str}"` : str;
    }).join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Employee CSV columns
 */
export const EMPLOYEE_CSV_COLS = [
  { key: 'id',         label: 'Employee ID' },
  { key: 'name',       label: 'Full Name' },
  { key: 'email',      label: 'Email' },
  { key: 'phone',      label: 'Phone' },
  { key: 'role',       label: 'Job Title' },
  { key: 'department', label: 'Department' },
  { key: 'location',   label: 'Location' },
  { key: 'salary',     label: 'Annual Salary' },
  { key: 'type',       label: 'Employment Type' },
  { key: 'status',     label: 'Status' },
  { key: 'joinDate',   label: 'Join Date' },
  { key: 'manager',    label: 'Manager' },
];

/**
 * Payroll CSV columns
 */
export const PAYROLL_CSV_COLS = [
  { key: 'empId',       label: 'Employee ID' },
  { key: 'name',        label: 'Full Name' },
  { key: 'department',  label: 'Department' },
  { key: 'gross',       label: 'Gross Pay' },
  { key: 'tax',         label: 'Tax' },
  { key: 'insurance',   label: 'Insurance' },
  { key: 'deductions',  label: 'Total Deductions' },
  { key: 'net',         label: 'Net Pay' },
  { key: 'status',      label: 'Status' },
  { key: 'payPeriod',   label: 'Pay Period' },
];

/**
 * Trigger browser print with a specific element
 */
export const printElement = (elementId) => {
  const el = document.getElementById(elementId);
  if (!el) return;
  const w = window.open('', '_blank', 'width=800,height=700');
  w.document.write(`
    <html><head><title>Payslip</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 24px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: 10px 12px; text-align: left; font-size: 14px; }
      th { background: #f3f4f6; font-weight: 700; color: #374151; }
      td { border-bottom: 1px solid #e5e7eb; color: #4b5563; }
      .payslip-company { font-size: 1.2rem; font-weight: 800; color: #6366f1; }
    </style></head>
    <body onload="window.print();window.close()">
      ${el.innerHTML}
    </body></html>
  `);
  w.document.close();
};
