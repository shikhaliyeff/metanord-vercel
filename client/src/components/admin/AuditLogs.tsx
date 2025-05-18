import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuditLog } from "@shared/schema";
import { format, subDays } from "date-fns";
import { 
  Activity, 
  Filter, 
  Clock, 
  User, 
  File, 
  AlertCircle,
  Calendar, 
  RotateCcw 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Activity icon based on action type
const ActionIcon = ({ action }: { action: string }) => {
  if (action.includes("create")) return <File className="h-4 w-4 text-green-500" />;
  if (action.includes("update") || action.includes("edit")) return <Activity className="h-4 w-4 text-blue-500" />;
  if (action.includes("delete")) return <AlertCircle className="h-4 w-4 text-red-500" />;
  if (action.includes("archive")) return <RotateCcw className="h-4 w-4 text-amber-500" />;
  return <Activity className="h-4 w-4 text-slate-500" />;
};

// Badge color based on resource type
const ResourceBadge = ({ resourceType }: { resourceType: string }) => {
  let variant: "default" | "secondary" | "outline" | "destructive" = "default";
  
  switch (resourceType) {
    case "product":
      variant = "default"; // Blue
      break;
    case "client":
      variant = "secondary"; // Gray
      break;
    case "offer":
      variant = "outline"; // White outline
      break;
    case "quote_request":
    case "contact_inquiry":
      variant = "destructive"; // Red
      break;
    default:
      variant = "default";
  }
  
  return (
    <Badge variant={variant} className="capitalize">
      {resourceType.replace("_", " ")}
    </Badge>
  );
};

// Format the action text for display
const formatAction = (action: string): string => {
  return action
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function AuditLogs() {
  // Filter state
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterResourceType, setFilterResourceType] = useState<string>("all");
  const [filterFromDate, setFilterFromDate] = useState<Date | undefined>(subDays(new Date(), 7));
  const [filterToDate, setFilterToDate] = useState<Date | undefined>(new Date());
  
  // Format dates for API request
  const fromDateParam = filterFromDate ? format(filterFromDate, "yyyy-MM-dd") : undefined;
  const toDateParam = filterToDate ? format(filterToDate, "yyyy-MM-dd") : undefined;
  
  // Fetch audit logs with filters
  const { 
    data: logs, 
    isLoading,
    error
  } = useQuery<AuditLog[]>({
    queryKey: [
      "/api/admin/audit-logs", 
      { 
        action: filterAction !== "all" ? filterAction : undefined,
        resourceType: filterResourceType !== "all" ? filterResourceType : undefined,
        fromDate: fromDateParam,
        toDate: toDateParam,
      }
    ]
  });
  
  // Reset filters
  const resetFilters = () => {
    setFilterAction("all");
    setFilterResourceType("all");
    setFilterFromDate(subDays(new Date(), 7));
    setFilterToDate(new Date());
  };
  
  // Get unique actions for filter dropdown
  const getUniqueActions = () => {
    if (!logs) return [];
    const uniqueActions = new Set(logs.map(log => log.action));
    return Array.from(uniqueActions).sort();
  };
  
  // Get unique resource types for filter dropdown
  const getUniqueResourceTypes = () => {
    if (!logs) return [];
    const uniqueTypes = new Set(logs.map(log => log.resourceType));
    return Array.from(uniqueTypes).sort();
  };
  
  // If loading, show skeleton UI
  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // If error, show error message
  if (error) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <AlertCircle className="h-8 w-8 text-red-500 mr-2" />
            <p>Failed to load audit logs</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          Audit Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Select
            value={filterAction}
            onValueChange={setFilterAction}
          >
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {getUniqueActions().map(action => (
                <SelectItem key={action} value={action}>
                  {formatAction(action)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={filterResourceType}
            onValueChange={setFilterResourceType}
          >
            <SelectTrigger className="w-[150px]">
              <File className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by resource" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Resources</SelectItem>
              {getUniqueResourceTypes().map(type => (
                <SelectItem key={type} value={type}>
                  {type.replace("_", " ").charAt(0).toUpperCase() + type.replace("_", " ").slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                {filterFromDate ? format(filterFromDate, "PPP") : "From date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={filterFromDate}
                onSelect={setFilterFromDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                {filterToDate ? format(filterToDate, "PPP") : "To date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={filterToDate}
                onSelect={setFilterToDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="ghost" onClick={resetFilters}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
        </div>
        
        {/* Logs table */}
        {logs && logs.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <ActionIcon action={log.action} />
                        {formatAction(log.action)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <ResourceBadge resourceType={log.resourceType} />
                        {log.resourceId && (
                          <span className="text-xs text-slate-500">
                            ID: {log.resourceId}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.userId ? (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>User {log.userId}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500">System</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {format(new Date(log.timestamp), "MMM d, yyyy HH:mm")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[300px] truncate text-sm">
                        {log.details ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="link" className="p-0 h-auto">
                                View Details
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <pre className="text-xs overflow-auto p-2 bg-slate-50 rounded max-h-[200px]">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <span className="text-slate-500">No details available</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Activity className="h-12 w-12 text-slate-300 mb-2" />
            <p className="text-slate-500 mb-1">No audit logs found</p>
            <p className="text-sm text-slate-400">
              {filterAction !== "all" || filterResourceType !== "all" ? 
                "Try adjusting your filters" : 
                "System activity will be recorded here"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}