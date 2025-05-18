import * as React from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ResponsiveTableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ResponsiveTable({ children, className, ...props }: ResponsiveTableProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <div className={cn("w-full overflow-auto", className)} {...props}>
      <table className={cn("w-full caption-bottom text-sm", isMobile ? "table-auto" : "")}>
        {children}
      </table>
    </div>
  );
}

interface ResponsiveTableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export function ResponsiveTableHeader({ children, className, ...props }: ResponsiveTableHeaderProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <thead className={cn("[&_tr]:border-b", isMobile ? "hidden md:table-header-group" : "", className)} {...props}>
      {children}
    </thead>
  );
}

interface ResponsiveTableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export function ResponsiveTableBody({ children, className, ...props }: ResponsiveTableBodyProps) {
  return (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props}>
      {children}
    </tbody>
  );
}

interface ResponsiveTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

export function ResponsiveTableRow({ children, className, ...props }: ResponsiveTableRowProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <tr 
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", 
        isMobile && "block border border-border rounded-lg mb-2 p-3 shadow-sm", 
        className
      )} 
      {...props}
    >
      {children}
    </tr>
  );
}

interface ResponsiveTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export function ResponsiveTableHead({ children, className, ...props }: ResponsiveTableHeadProps) {
  return (
    <th 
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className
      )} 
      {...props}
    >
      {children}
    </th>
  );
}

interface ResponsiveTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  label?: string;
  isVisibleOnMobile?: boolean;
}

export function ResponsiveTableCell({ 
  children, 
  className, 
  label,
  isVisibleOnMobile = true,
  ...props 
}: ResponsiveTableCellProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  if (isMobile && !isVisibleOnMobile) {
    return null;
  }
  
  return (
    <td 
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0",
        isMobile && "block border-b border-border last:border-0 py-3",
        className
      )} 
      {...props}
    >
      {isMobile && label && (
        <span className="font-medium text-xs uppercase text-muted-foreground block mb-1">
          {label}
        </span>
      )}
      {children}
    </td>
  );
}

interface ResponsiveTableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  children: React.ReactNode;
}

export function ResponsiveTableCaption({ children, className, ...props }: ResponsiveTableCaptionProps) {
  return (
    <caption 
      className={cn("mt-4 text-sm text-muted-foreground", className)} 
      {...props}
    >
      {children}
    </caption>
  );
}

// CardTable component for mobile-first table design
interface CardTableProps {
  data: any[];
  columns: {
    header: string;
    accessor: string;
    cell?: (item: any) => React.ReactNode;
    isVisibleOnMobile?: boolean;
    isMobileTitle?: boolean;
    labelInMobile?: string;
    className?: string;
  }[];
  keyField?: string;
  className?: string;
  onRowClick?: (item: any) => void;
  emptyMessage?: string;
  isLoading?: boolean;
  loadingState?: React.ReactNode;
  emptyState?: React.ReactNode;
}

export function CardTable({ 
  data,
  columns,
  keyField = "id",
  className,
  onRowClick,
  emptyMessage = "No data available",
  isLoading = false,
  loadingState,
  emptyState
}: CardTableProps) {
  const hasData = data && data.length > 0;
  
  if (isLoading) {
    return loadingState || (
      <div className="text-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading...</p>
      </div>
    );
  }
  
  if (!hasData) {
    return emptyState || (
      <div className="text-center p-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }
  
  return (
    <ResponsiveTable className={className}>
      <ResponsiveTableHeader>
        <tr>
          {columns.map((column) => (
            <ResponsiveTableHead 
              key={column.accessor} 
              className={column.className}
            >
              {column.header}
            </ResponsiveTableHead>
          ))}
        </tr>
      </ResponsiveTableHeader>
      <ResponsiveTableBody>
        {data.map((item) => (
          <ResponsiveTableRow 
            key={item[keyField]} 
            onClick={onRowClick ? () => onRowClick(item) : undefined}
            className={onRowClick ? "cursor-pointer" : ""}
          >
            {columns.map((column) => {
              // Find which column is the mobile title (if any)
              const isMobileTitle = column.isMobileTitle;
              const isVisibleOnMobile = column.isVisibleOnMobile !== false;
              const labelInMobile = column.labelInMobile || column.header;
              
              return (
                <ResponsiveTableCell
                  key={column.accessor}
                  label={labelInMobile}
                  isVisibleOnMobile={isVisibleOnMobile}
                  className={cn(
                    isMobileTitle && "font-medium md:font-normal text-base md:text-sm",
                    column.className
                  )}
                >
                  {column.cell ? column.cell(item) : item[column.accessor]}
                </ResponsiveTableCell>
              );
            })}
          </ResponsiveTableRow>
        ))}
      </ResponsiveTableBody>
    </ResponsiveTable>
  );
}