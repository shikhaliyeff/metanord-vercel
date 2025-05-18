import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';
import { 
  Bell, 
  Check, 
  Trash2, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  Search
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

// Notification type (should match what's in the NotificationCenter component)
interface Notification {
  id: number;
  title: string;
  message: string; // DB field is 'message', we'll use this for description
  createdAt: Date; // DB field is 'createdAt', we'll use this for timestamp
  read: boolean;
  type: "info" | "warning" | "success" | "error";
  resourceType?: string; // Corresponds to link resource type
  resourceId?: string; // Can be used with resourceType to construct links
  actionText?: string; // Not in DB schema but useful for UI
}

export function NotificationsManager() {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<{
    type: string;
    read: string;
    search: string;
  }>({ type: "all", read: "all", search: "" });
  const itemsPerPage = 10;

  // Query for all notifications
  const { data: allNotifications = [], isLoading, refetch } = useQuery<Notification[]>({
    queryKey: ['/api/admin/notifications'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/notifications');
      return await response.json();
    }
  });

  // Delete notification mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/notifications/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications/unread'] });
      toast({
        title: "Notification deleted",
        description: "The notification has been permanently removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete notification. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('PATCH', `/api/admin/notifications/${id}/read`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications/unread'] });
      toast({
        title: "Marked as read",
        description: "The notification has been marked as read.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update notification. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Mark as unread mutation
  const markAsUnreadMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('PATCH', `/api/admin/notifications/${id}/unread`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications/unread'] });
      toast({
        title: "Marked as unread",
        description: "The notification has been marked as unread.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update notification. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('PATCH', '/api/admin/notifications/mark-all-read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications/unread'] });
      toast({
        title: "All marked as read",
        description: "All notifications have been marked as read.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update notifications. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Clear all notifications mutation
  const clearAllMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('DELETE', '/api/admin/notifications/clear-all');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications/unread'] });
      toast({
        title: "Notifications cleared",
        description: "All notifications have been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear notifications. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Apply filters to notifications
  const filteredNotifications = allNotifications.filter(notification => {
    const matchesType = filter.type === 'all' || notification.type === filter.type;
    const matchesRead = filter.read === 'all' 
      || (filter.read === 'read' && notification.read) 
      || (filter.read === 'unread' && !notification.read);
    const matchesSearch = !filter.search 
      || notification.title.toLowerCase().includes(filter.search.toLowerCase())
      || notification.message.toLowerCase().includes(filter.search.toLowerCase());
    
    return matchesType && matchesRead && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotifications = filteredNotifications.slice(startIndex, endIndex);

  // Handle pagination navigation
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // Generate pagination links
  const paginationLinks = () => {
    let links = [];
    
    // Add first page
    if (currentPage > 2) {
      links.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      
      if (currentPage > 3) {
        links.push(
          <PaginationItem key="ellipsis-1">
            <span className="px-4">...</span>
          </PaginationItem>
        );
      }
    }
    
    // Add previous page if not on first page
    if (currentPage > 1) {
      links.push(
        <PaginationItem key={currentPage - 1}>
          <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>
            {currentPage - 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add current page
    links.push(
      <PaginationItem key={currentPage}>
        <PaginationLink isActive onClick={() => handlePageChange(currentPage)}>
          {currentPage}
        </PaginationLink>
      </PaginationItem>
    );
    
    // Add next page if not on last page
    if (currentPage < totalPages) {
      links.push(
        <PaginationItem key={currentPage + 1}>
          <PaginationLink onClick={() => handlePageChange(currentPage + 1)}>
            {currentPage + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add ellipsis and last page if not close to last page
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        links.push(
          <PaginationItem key="ellipsis-2">
            <span className="px-4">...</span>
          </PaginationItem>
        );
      }
      
      links.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return links;
  };

  return (
    <div className="admin-content-container">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Notifications</h1>
        <p className="admin-page-description">
          Manage your system notifications and alerts.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Notifications</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
              >
                <Check className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
                    clearAllMutation.mutate();
                  }
                }}
                disabled={clearAllMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
          <CardDescription>
            You have {allNotifications.filter(n => !n.read).length} unread notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Search notifications..."
                  value={filter.search}
                  onChange={(e) => {
                    setFilter({ ...filter, search: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="w-full"
                  prefix={<Search className="h-4 w-4 mr-2 text-muted-foreground" />}
                />
              </div>
              <div className="w-[150px]">
                <Select
                  value={filter.type}
                  onValueChange={(value) => {
                    setFilter({ ...filter, type: value });
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[150px]">
                <Select
                  value={filter.read}
                  onValueChange={(value) => {
                    setFilter({ ...filter, read: value });
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notifications Table */}
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2">Loading notifications...</span>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-12 border rounded-md bg-muted/10">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-xl font-medium mb-2">No notifications</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {filter.search || filter.type !== 'all' || filter.read !== 'all'
                    ? "No notifications match your filters. Try adjusting your search criteria."
                    : "You don't have any notifications at the moment."}
                </p>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Notification</TableHead>
                      <TableHead className="w-32">Type</TableHead>
                      <TableHead className="w-48">Date</TableHead>
                      <TableHead className="w-32">Status</TableHead>
                      <TableHead className="w-32 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentNotifications.map((notification) => (
                      <TableRow 
                        key={notification.id}
                        className={notification.read ? "" : "bg-muted/10"}
                      >
                        <TableCell>
                          {getNotificationIcon(notification.type)}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{notification.title}</div>
                          <div className="text-sm text-muted-foreground">{notification.message}</div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            notification.type === 'info' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                            notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                            notification.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {format(new Date(notification.createdAt), 'PPp')}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            notification.read 
                              ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' 
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          }`}>
                            {notification.read ? 'Read' : 'Unread'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              {notification.read ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => markAsUnreadMutation.mutate(notification.id)}
                                      disabled={markAsUnreadMutation.isPending}
                                    >
                                      <Bell className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Mark as unread</p>
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => markAsReadMutation.mutate(notification.id)}
                                      disabled={markAsReadMutation.isPending}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Mark as read</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to delete this notification?')) {
                                        deleteMutation.mutate(notification.id);
                                      }
                                    }}
                                    disabled={deleteMutation.isPending}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete notification</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {/* Pagination */}
            {filteredNotifications.length > 0 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  />
                  
                  {paginationLinks()}
                  
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  />
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}