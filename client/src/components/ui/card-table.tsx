import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface CardTableProps {
  data: any[];
  columns: {
    header: string;
    accessorKey: string;
    isMobileTitle?: boolean;
    isVisibleOnMobile?: boolean;
    labelInMobile?: string;
    className?: string;
    cell?: (row: any) => ReactNode;
  }[];
  loading?: boolean;
  emptyState?: ReactNode;
  onRowClick?: (row: any) => void;
}

export const CardTable = ({
  data,
  columns,
  loading = false,
  emptyState = <p>No data available</p>,
  onRowClick
}: CardTableProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (data.length === 0) {
    return <div className="text-center py-4">{emptyState}</div>;
  }
  
  return (
    <div className="space-y-4">
      {data.map((row, rowIndex) => (
        <Card 
          key={rowIndex} 
          className={`cursor-pointer hover:shadow-md transition-shadow ${onRowClick ? 'cursor-pointer' : ''}`}
          onClick={() => onRowClick && onRowClick(row)}
        >
          <CardContent className="p-4 lg:p-6">
            <div className="space-y-3">
              {/* Title row - always displayed */}
              {columns.map((column, colIndex) => {
                if (column.isMobileTitle) {
                  const value = column.cell ? 
                    column.cell(row) : 
                    row[column.accessorKey];
                  
                  return (
                    <div key={colIndex} className={`font-medium text-lg ${column.className || ''}`}>
                      {value}
                    </div>
                  );
                }
                return null;
              })}
              
              {/* Other rows that are visible on mobile */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {columns.map((column, colIndex) => {
                  if (!column.isMobileTitle && column.isVisibleOnMobile) {
                    const value = column.cell ? 
                      column.cell(row) : 
                      row[column.accessorKey];
                    
                    return (
                      <div key={colIndex} className="flex flex-col">
                        <span className="text-muted-foreground text-xs">
                          {column.labelInMobile || column.header}
                        </span>
                        <span className={column.className || ''}>
                          {value}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};