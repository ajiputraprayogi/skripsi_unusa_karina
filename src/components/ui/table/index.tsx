import React, { ReactNode } from "react";

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
}

// ====================================================================
// PERBAIKAN DILAKUKAN DI SINI:
// Tambahkan atribut HTML <td> ke TableCellProps
// ====================================================================
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode; // Cell content
  isHeader?: boolean; // If true, renders as <th>, otherwise <td>
  // Atribut HTML standar seperti 'colSpan', 'rowSpan', dll. 
  // sekarang diwarisi dari React.TdHTMLAttributes<HTMLTableCellElement>
}

// Table Component (Tidak Berubah)
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full  ${className}`}>{children}</table>;
};

// TableHeader Component (Tidak Berubah)
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

// TableBody Component (Tidak Berubah)
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// TableRow Component (Tidak Berubah)
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={className}>{children}</tr>;
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
  // Ekstrak properti HTML standar seperti colSpan, dll.
  // agar dapat diteruskan ke elemen <td> atau <th>
  ...props 
}) => {
  // Tambahkan 'colSpan' ke elemen 'th' jika isHeader true
  // Di HTML, colSpan berlaku untuk <td> dan <th>
  const CellTag = isHeader ? "th" : "td";
  return <CellTag className={` ${className}`} {...props}>{children}</CellTag>;
};

export { Table, TableHeader, TableBody, TableRow, TableCell };