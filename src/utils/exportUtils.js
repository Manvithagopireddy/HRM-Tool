/**
 * Export Utilities — PeopleCore HRM
 * CSV, Excel (XLSX), and PDF payslip generation
 */
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

// ─── CSV Export ─────────────────────────────────────────────────────────────
export const exportToCSV = (data, filename, columns) => {
  const header = columns.map(c => c.label).join(',');
  const rows   = data.map(row =>
    columns.map(c => {
      const val = c.accessor ? c.accessor(row) : row[c.key];
      const str = String(val ?? '').replace(/"/g, '""');
      return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str}"` : str;
    }).join(',')
  );
  const csv  = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href  = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ─── Excel (XLSX) Export ─────────────────────────────────────────────────────
export const exportToExcel = (sheets, filename) => {
  /**
   * sheets: Array<{ name: string, data: any[], columns?: {label, key}[] }>
   * If columns provided, data is mapped. Otherwise raw data is used.
   */
  const wb = XLSX.utils.book_new();
  sheets.forEach(({ name, data, columns }) => {
    let rows;
    if (columns) {
      const header = columns.map(c => c.label);
      const body   = data.map(row => columns.map(c => c.accessor ? c.accessor(row) : (row[c.key] ?? '')));
      rows = [header, ...body];
    } else {
      rows = data;
    }
    const ws = XLSX.utils.aoa_to_sheet(rows);

    // Auto column widths
    if (columns) {
      ws['!cols'] = columns.map(c => ({ wch: Math.max(c.label.length + 4, 14) }));
    }

    XLSX.utils.book_append_sheet(wb, ws, name);
  });
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// ─── PDF Payslip ─────────────────────────────────────────────────────────────
export const exportPayslipPDF = (record) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W   = doc.internal.pageSize.getWidth();
  const pad = 20;

  // ── Header band ──
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, W, 38, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('PeopleCore', pad, 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Enterprise HR Suite', pad, 22);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYSLIP', W - pad, 15, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Period: ${record.payPeriod}`, W - pad, 22, { align: 'right' });
  doc.text(`Issued: ${new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}`, W - pad, 28, { align: 'right' });

  // ── Employee info block ──
  let y = 50;
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(pad, y, W - pad * 2, 30, 3, 3, 'F');

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('EMPLOYEE NAME',  pad + 6, y + 8);
  doc.text('EMPLOYEE ID',    pad + 70, y + 8);
  doc.text('JOB TITLE',      pad + 115, y + 8);
  doc.text('DEPARTMENT',     pad + 148, y + 8);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(record.name,        pad + 6,   y + 18);
  doc.text(record.empId,       pad + 70,  y + 18);
  doc.text(record.role || '-', pad + 115, y + 18, { maxWidth: 30 });
  doc.text(record.department,  pad + 148, y + 18);

  // ── Earnings / Deductions table ──
  y += 40;
  const colX    = [pad, pad + 90, pad + 130];
  const rowH    = 9;
  const items   = [
    { label: 'Basic Salary',           earn: Math.round(record.gross * 0.9), deduct: 0 },
    { label: 'House Allowance',        earn: Math.round(record.gross * 0.06), deduct: 0 },
    { label: 'Transport Allowance',    earn: Math.round(record.gross * 0.04), deduct: 0 },
    { label: 'Federal Tax (22%)',      earn: 0, deduct: record.tax },
    { label: 'Health Insurance (4%)',  earn: 0, deduct: record.insurance },
    { label: 'Retirement Fund (3%)',   earn: 0, deduct: record.retirement || Math.round(record.gross * 0.03) },
  ];

  // Table header
  doc.setFillColor(99, 102, 241);
  doc.rect(pad, y, W - pad * 2, 8, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Description', colX[0] + 3, y + 5.5);
  doc.text('Earnings ($)',   colX[1],   y + 5.5);
  doc.text('Deductions ($)', colX[2],   y + 5.5);
  y += 9;

  // Table rows
  items.forEach((item, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(pad, y, W - pad * 2, rowH, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    doc.text(item.label, colX[0] + 3, y + 6);
    doc.text(item.earn   > 0 ? `$${item.earn.toLocaleString()}`   : '—', colX[1], y + 6);
    doc.text(item.deduct > 0 ? `$${item.deduct.toLocaleString()}` : '—', colX[2], y + 6);
    y += rowH;
  });

  // Totals
  y += 2;
  doc.setFillColor(240, 253, 244);
  doc.rect(pad, y, W - pad * 2, 14, 'F');
  doc.setDrawColor(34, 197, 94);
  doc.rect(pad, y, W - pad * 2, 14, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(21, 128, 61);
  doc.text('NET TAKE-HOME PAY', colX[0] + 3, y + 9);
  doc.text(`$${record.net.toLocaleString()}`, W - pad - 3, y + 9, { align: 'right' });

  // ── Footer ──
  y += 24;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('This is a computer-generated payslip and does not require a signature.', W / 2, y, { align: 'center' });
  doc.text('PeopleCore Enterprise Suite  ·  hr@peoplecore.com  ·  www.peoplecore.com', W / 2, y + 6, { align: 'center' });

  doc.save(`payslip_${record.name.replace(/\s/g, '_')}_${record.payPeriod.replace(/\s/g, '_')}.pdf`);
};

// ─── Print Element (browser fallback) ────────────────────────────────────────
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

// ─── Column Definitions ───────────────────────────────────────────────────────
export const EMPLOYEE_CSV_COLS = [
  { key: 'id',               label: 'Employee ID' },
  { key: 'name',             label: 'Full Name' },
  { key: 'email',            label: 'Email' },
  { key: 'phone',            label: 'Phone' },
  { key: 'role',             label: 'Job Title' },
  { key: 'department',       label: 'Department' },
  { key: 'location',         label: 'Location' },
  { key: 'salary',           label: 'Annual Salary' },
  { key: 'type',             label: 'Employment Type' },
  { key: 'status',           label: 'Status' },
  { key: 'joinDate',         label: 'Join Date' },
  { key: 'manager',          label: 'Manager' },
  { key: 'performanceScore', label: 'Performance Score' },
  { key: 'gender',           label: 'Gender' },
  { key: 'age',              label: 'Age' },
];

export const PAYROLL_EXCEL_COLS = [
  { key: 'empId',      label: 'Employee ID' },
  { key: 'name',       label: 'Full Name' },
  { key: 'department', label: 'Department' },
  { key: 'role',       label: 'Role' },
  { key: 'gross',      label: 'Gross Pay ($)' },
  { key: 'tax',        label: 'Federal Tax ($)' },
  { key: 'insurance',  label: 'Health Insurance ($)' },
  { key: 'retirement', label: 'Retirement ($)' },
  { key: 'deductions', label: 'Total Deductions ($)' },
  { key: 'net',        label: 'Net Pay ($)' },
  { key: 'status',     label: 'Status' },
  { key: 'payPeriod',  label: 'Pay Period' },
];
