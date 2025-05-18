import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  CheckCircle, 
  ChevronDown, 
  Clock, 
  ExternalLink, 
  Filter, 
  Inbox, 
  Loader2, 
  Mail, 
  RefreshCw, 
  Search,
  Tag,
  Phone,
  Building,
  ShoppingCart,
  User as UserIcon, 
  XCircle,
  MessageCircle,
  FileText
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

// Define the quote request status types
type QuoteRequestStatus = "new" | "in progress" | "quoted" | "completed" | "closed";

// Quote request interface
interface QuoteRequest {
  id: number;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  productId?: string;
  productName: string;
  quantity?: string;
  comment?: string;
  status: QuoteRequestStatus;
  createdAt: string;
}

export function QuoteRequests() {
  const [filterStatus, setFilterStatus] = useState<QuoteRequestStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewRequest, setViewRequest] = useState<QuoteRequest | null>(null);
  const { toast } = useToast();
  
  // Fetch quote requests
  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/quotes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/quotes");
      if (!res.ok) throw new Error("Failed to fetch quote requests");
      return res.json();
    }
  });
  
  // Update request status mutation
  const updateRequestStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: QuoteRequestStatus }) => {
      const res = await apiRequest("POST", `/api/admin/quotes/${id}/status`, { status });
      if (!res.ok) throw new Error("Failed to update request status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/quotes"] });
      toast({
        title: "Success",
        description: "Quote request status updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update request status: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Handle status change
  const handleStatusChange = async (id: number, status: QuoteRequestStatus) => {
    await updateRequestStatusMutation.mutateAsync({ id, status });
    
    // If currently viewing this request, update the status in the view
    if (viewRequest && viewRequest.id === id) {
      setViewRequest({ ...viewRequest, status });
    }
  };
  
  // Handle viewing a request (also mark as in progress if new)
  const handleViewRequest = async (request: QuoteRequest) => {
    setViewRequest(request);
    
    // If the request is new, automatically mark it as in progress
    if (request.status === "new") {
      await handleStatusChange(request.id, "in progress");
    }
  };
  
  // Filter and search requests
  const filteredRequests = requests ? requests.filter((request: QuoteRequest) => {
    // Apply status filter
    if (filterStatus !== "all" && request.status !== filterStatus) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm && !request.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !request.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !request.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(request.company && request.company.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    return true;
  }) : [];
  
  // Calculate counts
  const statusCounts = requests ? {
    all: requests.length,
    new: requests.filter((r: QuoteRequest) => r.status === "new").length,
    "in progress": requests.filter((r: QuoteRequest) => r.status === "in progress").length,
    quoted: requests.filter((r: QuoteRequest) => r.status === "quoted").length,
    completed: requests.filter((r: QuoteRequest) => r.status === "completed").length,
    closed: requests.filter((r: QuoteRequest) => r.status === "closed").length,
  } : { all: 0, new: 0, "in progress": 0, quoted: 0, completed: 0, closed: 0 };
  
  // Get status badge styling
  const getStatusBadge = (status: QuoteRequestStatus) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="default" className="bg-blue-500">
            <Clock className="h-3 w-3 mr-1" />
            New
          </Badge>
        );
      case "in progress":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            <RefreshCw className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case "quoted":
        return (
          <Badge variant="outline" className="text-purple-500 border-purple-500">
            <FileText className="h-3 w-3 mr-1" />
            Quoted
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="text-green-500 border-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="outline" className="text-slate-400 border-slate-400">
            <XCircle className="h-3 w-3 mr-1" />
            Closed
          </Badge>
        );
    }
  };
  
  // Format date and time
  const formatDateTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy h:mm a");
    } catch (error) {
      return dateString;
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <CardTitle className="flex items-center">
              <Tag className="h-5 w-5 mr-2 text-primary" />
              Quote Requests
            </CardTitle>
            <CardDescription className="mt-1.5">
              Manage quote requests from customers
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                className="pl-9 w-full sm:w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between">
                  <Filter className="h-4 w-4 mr-2" />
                  {filterStatus === "all" ? "All requests" : `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} requests`}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className={filterStatus === "all" ? "bg-muted font-medium" : ""}
                  onClick={() => setFilterStatus("all")}
                >
                  All Requests
                  <Badge variant="outline" className="ml-auto">{statusCounts.all}</Badge>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className={filterStatus === "new" ? "bg-muted font-medium" : ""}
                  onClick={() => setFilterStatus("new")}
                >
                  New
                  <Badge variant="default" className="ml-auto bg-blue-500">{statusCounts.new}</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={filterStatus === "in progress" ? "bg-muted font-medium" : ""}
                  onClick={() => setFilterStatus("in progress")}
                >
                  In Progress
                  <Badge variant="outline" className="ml-auto text-amber-500 border-amber-500">{statusCounts["in progress"]}</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={filterStatus === "quoted" ? "bg-muted font-medium" : ""}
                  onClick={() => setFilterStatus("quoted")}
                >
                  Quoted
                  <Badge variant="outline" className="ml-auto text-purple-500 border-purple-500">{statusCounts.quoted}</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={filterStatus === "completed" ? "bg-muted font-medium" : ""}
                  onClick={() => setFilterStatus("completed")}
                >
                  Completed
                  <Badge variant="outline" className="ml-auto text-green-500 border-green-500">{statusCounts.completed}</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={filterStatus === "closed" ? "bg-muted font-medium" : ""}
                  onClick={() => setFilterStatus("closed")}
                >
                  Closed
                  <Badge variant="outline" className="ml-auto text-slate-400 border-slate-400">{statusCounts.closed}</Badge>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {requests && requests.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request: QuoteRequest) => (
                    <TableRow key={request.id} className={request.status === "new" ? "bg-blue-50" : ""}>
                      <TableCell className="font-medium">
                        <div>{request.name}</div>
                        <div className="text-xs text-muted-foreground">{request.email}</div>
                      </TableCell>
                      <TableCell className="max-w-[250px] truncate">{request.productName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(request.createdAt)}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status as QuoteRequestStatus)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewRequest(request)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No matching quote requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-md border flex flex-col items-center justify-center py-12">
            <Tag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No quote requests yet</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              Quote requests from customers will appear here
            </p>
          </div>
        )}
      </CardContent>
      
      {/* Quote Request Detail Dialog */}
      <Dialog open={!!viewRequest} onOpenChange={(open) => !open && setViewRequest(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Quote Request</DialogTitle>
            <DialogDescription>
              Received on {viewRequest && formatDateTime(viewRequest.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
          {viewRequest && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{viewRequest.name}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a 
                      href={`mailto:${viewRequest.email}`} 
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      {viewRequest.email}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                  {viewRequest.phone && (
                    <div className="flex items-center mt-1">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a 
                        href={`tel:${viewRequest.phone}`} 
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        {viewRequest.phone}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}
                  {viewRequest.company && (
                    <div className="flex items-center mt-1">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{viewRequest.company}</span>
                    </div>
                  )}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {getStatusBadge(viewRequest.status as QuoteRequestStatus)}
                      <ChevronDown className="h-3 w-3 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Update status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleStatusChange(viewRequest.id, "new")}>
                      New
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(viewRequest.id, "in progress")}>
                      In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(viewRequest.id, "quoted")}>
                      Quoted
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(viewRequest.id, "completed")}>
                      Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(viewRequest.id, "closed")}>
                      Closed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="rounded-md border p-4 bg-muted/40">
                <div className="flex items-center mb-2">
                  <ShoppingCart className="h-4 w-4 mr-2 text-primary" />
                  <h3 className="font-medium">Product Information</h3>
                </div>
                <div className="space-y-2 pl-6">
                  <div>
                    <span className="font-medium">Product:</span> {viewRequest.productName}
                  </div>
                  {viewRequest.quantity && (
                    <div>
                      <span className="font-medium">Quantity:</span> {viewRequest.quantity}
                    </div>
                  )}
                </div>
              </div>
              
              {viewRequest.comment && (
                <div className="rounded-md border p-4 bg-muted/40">
                  <div className="flex items-center mb-2">
                    <MessageCircle className="h-4 w-4 mr-2 text-primary" />
                    <h3 className="font-medium">Additional Comments</h3>
                  </div>
                  <div className="pl-6 whitespace-pre-wrap text-sm">
                    {viewRequest.comment}
                  </div>
                </div>
              )}
              
              <DialogFooter className="flex sm:justify-between gap-3 mt-6">
                <div className="text-sm text-muted-foreground">
                  ID: {viewRequest.id}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setViewRequest(null)}
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={() => {
                      window.location.href = `mailto:${viewRequest.email}?subject=Your Quote Request - ${viewRequest.productName}`;
                    }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Customer
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}