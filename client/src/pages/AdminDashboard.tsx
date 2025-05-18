import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useTheme } from "@/components/theme/ThemeProvider";
import { 
  Home, 
  Settings, 
  Users, 
  Package, 
  Layout, 
  MessageSquare, 
  LogOut,
  Edit,
  Plus,
  ChevronDown,
  ChevronRight,
  Save,
  FolderDown,
  FolderUp,
  BarChart3,
  Bell,
  FileText,
  Globe,
  FileCode,
  Box,
  Inbox,
  Tag,
  FileSpreadsheet,
  UserPlus,
  Activity,
  ShieldAlert,
  LayoutDashboard,
  BookOpen,
  Database,
  FileInput,
  Users2,
  Contact,
  FolderKanban,
  PanelRight,
  ExternalLink,
  Search,
  LayoutTemplate
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { NotificationCenter } from "@/components/admin/NotificationCenter";
import { AdminProvider } from "@/contexts/AdminContext";

// UI components
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Admin components
import { NotificationsManager } from "@/components/admin/NotificationsManager";
import UserManagement from "@/components/admin/UserManagement";
import ProjectsManager from "@/components/admin/ProjectsManager";
import { ProductsEditor } from "@/components/admin/ProductsEditor";
import { HeroEditor } from "@/components/admin/HeroEditor";
import { SiteContentEditor } from "@/components/admin/SiteContentEditor";
import { ButtonsEditor } from "@/components/admin/ButtonsEditor";
import { PageEditor } from "@/components/admin/PageEditor";
import { PageBuilder } from "@/components/admin/PageBuilder";
import { Pages } from "@/components/admin/Pages";
import { QuoteRequests } from "@/components/admin/QuoteRequests";
import { ContactInquiries } from "@/components/admin/ContactInquiries";
import { OffersManager } from "@/components/admin/OffersManager";
import ComponentLibrary from "@/components/admin/page-builder/ComponentLibrary";
import { TemplateLibrary as PageTemplateLibrary } from "@/components/admin/page-builder/TemplateLibrary";
import { CRM } from "@/components/admin/CRM";
import AuditLogs from "@/components/admin/AuditLogs";
import { AnalyticsPanel } from "@/components/admin/AnalyticsPanel";
import { SeoManager } from "@/components/admin/SeoManager";
import { ThemeEditor } from "@/components/admin/ThemeEditor";
import TemplateLibrary from "@/components/admin/TemplateLibrary";
import PreviewManager from "@/components/admin/PreviewManager";
import MobileAdminNav from "@/components/admin/MobileAdminNav";
import { MobileFormLayout } from "@/components/admin/MobileFormLayout";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { setIsAdminMode } = useTheme();
  
  // Parse URL parameters
  const getURLParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return {
      tab: searchParams.get('tab') || 'dashboard',
      mode: searchParams.get('mode'),
      id: searchParams.get('id')
    };
  };
  
  // Sidebar and navigation state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(getURLParams().tab);
  
  // Advanced navigation function that handles both tab switching and additional params
  const navigateTo = (tab: string, additionalParams?: Record<string, string>) => {
    // Update the active tab state
    setActiveTab(tab);
    
    // Update URL without full page reload
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('tab', tab);
    
    // Preserve existing parameters
    const params = getURLParams();
    if (params.mode && !additionalParams?.mode) urlParams.set('mode', params.mode);
    if (params.id && !additionalParams?.id) urlParams.set('id', params.id);
    
    // Add any additional parameters
    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        if (value) {
          urlParams.set(key, value);
        } else {
          urlParams.delete(key);
        }
      });
    }
    
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState({}, '', newUrl);
  };
  
  // Listen for URL changes
  useEffect(() => {
    // Function to update active tab based on URL
    const handleURLChange = () => {
      const params = getURLParams();
      setActiveTab(params.tab);
    };
    
    // Set up event listeners for both history API changes and custom events
    window.addEventListener('popstate', handleURLChange);
    window.addEventListener('urlchange', handleURLChange);
    
    // Initial check
    handleURLChange();
    
    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleURLChange);
      window.removeEventListener('urlchange', handleURLChange);
    };
  }, []);
  
  // Collapsible groups in sidebar
  const [contentOpen, setContentOpen] = useState(true);
  const [crmOpen, setCrmOpen] = useState(true);
  const [systemOpen, setSystemOpen] = useState(true);
  
  // Set admin theme context when dashboard loads
  useEffect(() => {
    // Mark that we're in admin mode now
    setIsAdminMode(true);
    
    // Add event listener for custom setActiveTab event
    const handleSetActiveTab = (event: any) => {
      if (event.detail && event.detail.tab) {
        setActiveTab(event.detail.tab);
      }
    };
    
    document.querySelector('.admin-dashboard')?.addEventListener('setActiveTab', handleSetActiveTab);
    
    // Clean up when component unmounts
    return () => {
      setIsAdminMode(false);
      document.querySelector('.admin-dashboard')?.removeEventListener('setActiveTab', handleSetActiveTab);
    };
  }, [setIsAdminMode]);
  
  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };
  
  // Export data function
  const exportData = async () => {
    try {
      const response = await apiRequest("GET", "/api/admin/export-data");
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `metanord-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Your data has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    }
  };
  
  // Import data function
  const importData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);
        
        const response = await apiRequest("POST", "/api/admin/import-data", jsonData);
        const result = await response.json();
        
        if (result.success) {
          toast({
            title: "Import Successful",
            description: "Your data has been imported successfully.",
          });
        } else {
          throw new Error(result.message);
        }
      } catch (error: any) {
        toast({
          title: "Import Failed",
          description: error.message || "There was an error importing your data.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };
  
  // Render appropriate component based on active tab
  const renderActiveTab = () => {
    switch (activeTab) {
      case "seo":
        return <SeoManager />;
      case "preview":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Website Preview</h2>
                <p className="text-muted-foreground">Preview your website as it appears to visitors</p>
              </div>
              <Button variant="outline" onClick={() => window.open("/", "_blank")}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
            <div className="overflow-hidden rounded-lg border">
              <PreviewManager 
                url="/"
                title="MetaNord Website" 
                height={600}
                enableResponsiveControls={true}
              />
            </div>
          </div>
        );
      case "dashboard":
        return (
          <div>
            <div className="admin-page-title">
              <h1>Dashboard</h1>
              <div className="admin-actions">
                <Button onClick={() => navigateTo("content")} variant="outline" size="sm" className="mr-2">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Content
                </Button>
                <Button onClick={() => navigateTo("products")} variant="outline" size="sm">
                  <Package className="mr-2 h-4 w-4" />
                  Manage Products
                </Button>
              </div>
            </div>
            
            {/* StatisticsPanel is not implemented yet */}
            <div className="mb-6 p-4 bg-muted/20 rounded-lg text-center">
              <p>Statistics Panel (Coming Soon)</p>
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <Card className="cursor-pointer" onClick={() => navigateTo("content")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Edit Hero Section
                  </CardTitle>
                  <Edit className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Update the main banner content
                  </p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer" onClick={() => navigateTo("products")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Manage Products
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Add, edit, or delete products
                  </p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer" onClick={() => navigateTo("buttons")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    UI Elements
                  </CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Edit buttons, links, and UI text
                  </p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer" onClick={() => navigateTo("navigation")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Navigation
                  </CardTitle>
                  <Layout className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Edit navigation menus and links
                  </p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer" onClick={() => navigateTo("theme")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Theme Settings
                  </CardTitle>
                  <Inbox className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Update colors, fonts, and styles
                  </p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer" onClick={() => navigateTo("inquiries")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Contact Inquiries
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    View and manage customer inquiries
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="admin-page-title">
              <h2 className="text-lg font-semibold">Recent Inquiries</h2>
              <Button onClick={() => navigateTo("inquiries")} variant="link">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <div className="admin-data-table-wrapper">
                  <table className="admin-data-table">
                    <thead className="admin-data-table-header">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody className="admin-data-table-body">
                      <tr>
                        <td>John Smith</td>
                        <td>john@example.com</td>
                        <td className="truncate max-w-[200px]">I'm interested in your aluminum profiles...</td>
                        <td>{new Date().toLocaleDateString()}</td>
                        <td>
                          <span className="admin-badge admin-badge-success">New</span>
                        </td>
                      </tr>
                      <tr>
                        <td>Sarah Johnson</td>
                        <td>sarah@company.com</td>
                        <td className="truncate max-w-[200px]">Could you provide more information about your delivery options?</td>
                        <td>{new Date(Date.now() - 86400000).toLocaleDateString()}</td>
                        <td>
                          <span className="admin-badge admin-badge-info">In Progress</span>
                        </td>
                      </tr>
                      <tr>
                        <td>Michael Brown</td>
                        <td>michael@example.org</td>
                        <td className="truncate max-w-[200px]">We need a quote for a large order of T-profiles...</td>
                        <td>{new Date(Date.now() - 172800000).toLocaleDateString()}</td>
                        <td>
                          <span className="admin-badge admin-badge-primary">Replied</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "users":
        return <UserManagement />;
      case "projects":
        return <ProjectsManager />;
      case "notifications":
        return <NotificationsManager />;
      case "content":
        return <SiteContentEditor />;
      case "products":
        return <ProductsEditor />;
      case "buttons":
        return <ButtonsEditor />;
      case "banner":
      case "hero":
        return <HeroEditor />;
      case "pages":
        return <Pages onNavigate={navigateTo} />;
      case "page-builder": {
        const params = getURLParams();
        const pageId = params.id;
        // The mode is handled internally by PageBuilder by checking URL params
        return <PageBuilder 
          pageId={pageId || undefined} 
          onNavigateBack={() => navigateTo('pages')} 
        />;
      }
      case "quotes":
        return <QuoteRequests />;
      case "inquiries":
        return <ContactInquiries />;
      case "offers":
        return <OffersManager />;
      case "crm":
        return <CRM />;
      case "analytics":
        return <AnalyticsPanel />;
      case "audit":
        return <AuditLogs />;
      case "templates":
        return <PageTemplateLibrary />;
      case "components":
        return <ComponentLibrary />;
      case "preview":
        return <PreviewManager />;
      default:
        return <div>Select a tab from the sidebar</div>;
    }
  };
  
  return (
    <div className="admin-dashboard">
      <Helmet>
        <title>MetaNord Admin</title>
      </Helmet>
      
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'admin-sidebar-collapsed' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            {!sidebarCollapsed && <span className="font-medium">MetaNord Admin</span>}
            {sidebarCollapsed && <span className="font-bold">M</span>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="admin-sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="admin-sidebar-groups">
          <div className={`admin-sidebar-item ${activeTab === "dashboard" && "active"}`} onClick={() => navigateTo("dashboard")}>
            <LayoutDashboard className="admin-sidebar-item-icon" />
            <span className="admin-sidebar-item-text">Dashboard</span>
          </div>
          
          <div className={`admin-sidebar-item ${activeTab === "preview" && "active"}`} onClick={() => navigateTo("preview")}>
            <ExternalLink className="admin-sidebar-item-icon" />
            <span className="admin-sidebar-item-text">Website Preview</span>
          </div>
          
          <Collapsible
            open={contentOpen}
            onOpenChange={setContentOpen}
            className="admin-sidebar-group"
          >
            <CollapsibleTrigger className="admin-sidebar-group-header w-full">
              <span>Content</span>
              {!sidebarCollapsed && (contentOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
            </CollapsibleTrigger>
            <CollapsibleContent className="admin-sidebar-group-content">
              <div className={`admin-sidebar-item ${activeTab === "banner" && "active"}`} onClick={() => navigateTo("banner")}>
                <FileText className="admin-sidebar-item-icon" />
                <span className="admin-sidebar-item-text">Home Banner</span>
              </div>
              <div className={`admin-sidebar-item ${activeTab === "content" && "active"}`} onClick={() => navigateTo("content")}>
                <Edit className="admin-sidebar-item-icon" />
                <span className="admin-sidebar-item-text">Text Content</span>
              </div>
              <div className={`admin-sidebar-item ${activeTab === "products" && "active"}`} onClick={() => navigateTo("products")}>
                <Package className="admin-sidebar-item-icon" />
                <span className="admin-sidebar-item-text">Products</span>
              </div>

              <div className={`admin-sidebar-item ${activeTab === "projects" && "active"}`} onClick={() => navigateTo("projects")}>
                <FolderKanban className="admin-sidebar-item-icon" />
                <span className="admin-sidebar-item-text">Projects</span>
              </div>
              <div className={`admin-sidebar-item ${activeTab === "pages" && "active"}`} onClick={() => navigateTo("pages")}>
                <PanelRight className="admin-sidebar-item-icon" />
                <span className="admin-sidebar-item-text">Pages</span>
              </div>
              <div 
                className={`admin-sidebar-item ${activeTab === "page-builder" && "active"}`} 
                onClick={() => navigateTo("page-builder")}
                data-tab="page-builder"
              >
                <LayoutTemplate className="admin-sidebar-item-icon" />
                <span className="admin-sidebar-item-text">Page Builder</span>
              </div>
              <div className={`admin-sidebar-item ${activeTab === "components" && "active"}`} onClick={() => navigateTo("components")}>
                <Box className="admin-sidebar-item-icon" />
                <span className="admin-sidebar-item-text">Components</span>
              </div>
              <div className={`admin-sidebar-item ${activeTab === "templates" && "active"}`} onClick={() => navigateTo("templates")}>
                <FileCode className="admin-sidebar-item-icon" />
                <span className="admin-sidebar-item-text">Page Templates</span>
              </div>
              <div className={`admin-sidebar-item ${activeTab === "seo" && "active"}`} onClick={() => navigateTo("seo")}>
                <Search className="admin-sidebar-item-icon" />
                <span className="admin-sidebar-item-text">SEO</span>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible
            open={crmOpen}
            onOpenChange={setCrmOpen}
            className="admin-sidebar-group"
          >
            <CollapsibleTrigger className="admin-sidebar-group-header w-full">
              <span>Customer Relations</span>
              {!sidebarCollapsed && (crmOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
            </CollapsibleTrigger>
            <CollapsibleContent className="admin-sidebar-group-content">
              <div className={`admin-sidebar-item ${activeTab === "inquiries" && "active"}`} onClick={() => navigateTo("inquiries")}>
                <MessageSquare className="admin-sidebar-item-icon" />
                <span className="admin-sidebar-item-text">Inquiries</span>
              </div>
              <div className={`admin-sidebar-item ${activeTab === "quotes" && "active"}`} onClick={() => navigateTo("quotes")}>
                <Tag className="admin-sidebar-item-icon" />
                <span className="admin-sidebar-item-text">Quote Requests</span>
              </div>
              <div className={`admin-sidebar-item ${activeTab === "offers" && "active"}`} onClick={() => navigateTo("offers")}>
                <FileSpreadsheet className="admin-sidebar-item-icon" />
                <span className="admin-sidebar-item-text">Offers</span>
              </div>
              <div className={`admin-sidebar-item ${activeTab === "crm" && "active"}`} onClick={() => navigateTo("crm")}>
                <Users2 className="admin-sidebar-item-icon" />
                <span className="admin-sidebar-item-text">CRM</span>
              </div>
              <div className={`admin-sidebar-item ${activeTab === "documents" && "active"}`} onClick={() => navigateTo("documents")}>
                <FileText className="admin-sidebar-item-icon" />
                <span className="admin-sidebar-item-text">Documents</span>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible
            open={systemOpen}
            onOpenChange={setSystemOpen}
            className="admin-sidebar-group"
          >
            <CollapsibleTrigger className="admin-sidebar-group-header w-full">
              <span>System</span>
              {!sidebarCollapsed && (systemOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
            </CollapsibleTrigger>
            <CollapsibleContent className="admin-sidebar-group-content">
              <div className={`admin-sidebar-item ${activeTab === "users" && "active"}`} onClick={() => navigateTo("users")}>
                <Users className="admin-sidebar-item-icon" />
                <span className="admin-sidebar-item-text">Users</span>
              </div>
              <div className={`admin-sidebar-item ${activeTab === "templates" && "active"}`} onClick={() => navigateTo("templates")}>
                <Layout className="admin-sidebar-item-icon" />
                <span className="admin-sidebar-item-text">Templates</span>
              </div>
              <div className={`admin-sidebar-item ${activeTab === "buttons" && "active"}`} onClick={() => navigateTo("buttons")}>
                <Edit className="admin-sidebar-item-icon" />
                <span className="admin-sidebar-item-text">UI Elements</span>
              </div>

              <div className={`admin-sidebar-item ${activeTab === "notifications" && "active"}`} onClick={() => navigateTo("notifications")}>
                <Bell className="admin-sidebar-item-icon" />
                <span className="admin-sidebar-item-text">Notifications</span>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </aside>
      
      {/* Main content */}
      <main className={`admin-content-with-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header-content">
            <div className="admin-header-left">
              <h2 className="text-xl font-semibold">Dashboard</h2>
            </div>
            
            <div className="flex gap-2 items-center">
              <NotificationCenter />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={exportData}>
                    <FolderDown className="mr-2 h-4 w-4" />
                    <span>Export Data</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <label className="flex items-center cursor-pointer w-full">
                      <FolderUp className="mr-2 h-4 w-4" />
                      <span>Import Data</span>
                      <input 
                        type="file" 
                        accept=".json" 
                        className="sr-only" 
                        onChange={importData}
                      />
                    </label>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeToggle />
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <div className="admin-content overflow-auto">
          {renderActiveTab()}
        </div>
      </main>
      
      {/* Mobile Admin Navigation - only visible on small screens */}
      <MobileAdminNav />
    </div>
  );
}