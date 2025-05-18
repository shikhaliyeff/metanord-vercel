import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Globe, 
  Mail, 
  Lock, 
  Bell, 
  Database,
  Save,
  Undo,
  Shield,
  RefreshCw,
  UserCog,
  KeyRound,
  Loader2
} from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

// Site settings schema
const siteSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteUrl: z.string().url("Must be a valid URL"),
  siteDescription: z.string().optional(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  contactEmail: z.string().email("Must be a valid email"),
  supportEmail: z.string().email("Must be a valid email").optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  socialMedia: z.object({
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    youtube: z.string().optional(),
  }),
  googleAnalyticsId: z.string().optional(),
  metaPixelId: z.string().optional(),
});

// Email settings schema
const emailSettingsSchema = z.object({
  smtpHost: z.string().min(1, "SMTP host is required"),
  smtpPort: z.string().min(1, "SMTP port is required"),
  smtpUser: z.string().min(1, "SMTP username is required"),
  smtpPassword: z.string().min(1, "SMTP password is required"),
  senderName: z.string().min(1, "Sender name is required"),
  senderEmail: z.string().email("Must be a valid email"),
  replyToEmail: z.string().email("Must be a valid email").optional(),
  emailTemplatesEnabled: z.boolean().default(true),
  emailSignature: z.string().optional(),
});

// Security settings schema
const securitySettingsSchema = z.object({
  enableTwoFactor: z.boolean().default(false),
  passwordPolicy: z.object({
    minLength: z.number().min(8).max(32),
    requireUppercase: z.boolean().default(true),
    requireLowercase: z.boolean().default(true),
    requireNumbers: z.boolean().default(true),
    requireSpecialChars: z.boolean().default(true),
    passwordExpiryDays: z.number().min(0).max(365),
  }),
  sessionTimeoutMinutes: z.number().min(5).max(1440),
  maxLoginAttempts: z.number().min(1).max(10),
  ipWhitelist: z.array(z.string()).optional(),
  enableCaptcha: z.boolean().default(false),
  captchaSiteKey: z.string().optional(),
  captchaSecretKey: z.string().optional(),
});

// Notification settings schema
const notificationSettingsSchema = z.object({
  emailNotifications: z.object({
    newContactFormSubmission: z.boolean().default(true),
    newQuoteRequest: z.boolean().default(true),
    newCRMContact: z.boolean().default(true),
    statusUpdates: z.boolean().default(true),
  }),
  adminNotifications: z.object({
    newUsers: z.boolean().default(true),
    systemUpdates: z.boolean().default(true),
    securityAlerts: z.boolean().default(true),
    loginAttempts: z.boolean().default(true),
  }),
  notificationRecipients: z.array(z.string()).min(1, "At least one recipient email is required"),
});

// System settings schema
const systemSettingsSchema = z.object({
  debugMode: z.boolean().default(false),
  maintenanceMode: z.boolean().default(false),
  maintenanceMessage: z.string().optional(),
  loggingLevel: z.enum(["error", "warning", "info", "debug"]),
  backupEnabled: z.boolean().default(true),
  backupFrequency: z.enum(["daily", "weekly", "monthly"]),
  maxUploadSize: z.number().min(1).max(100),
  allowedFileTypes: z.array(z.string()).min(1, "At least one file type must be allowed"),
  cacheTimeout: z.number().min(0).max(1440),
  defaultLanguage: z.string().min(2).max(5),
});

// User management settings schema
const userManagementSchema = z.object({
  allowUserRegistration: z.boolean().default(false),
  requireEmailVerification: z.boolean().default(true),
  defaultUserRole: z.string(),
  userRoles: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      permissions: z.array(z.string()),
    })
  ),
});

// API settings schema
const apiSettingsSchema = z.object({
  enableApi: z.boolean().default(false),
  requireApiKey: z.boolean().default(true),
  allowedOrigins: z.array(z.string()).optional(),
  rateLimitRequests: z.number().min(10).max(1000),
  rateLimitTimeWindow: z.number().min(1).max(60),
});

type SettingsTab = 
  | "site" 
  | "email" 
  | "security" 
  | "notifications" 
  | "system" 
  | "users" 
  | "api";

export function SettingsManager() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<SettingsTab>("site");
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  
  // Site settings form
  const siteSettingsForm = useForm<z.infer<typeof siteSettingsSchema>>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: "MetaNord OÜ",
      siteUrl: "https://meta-nord.trade",
      siteDescription: "Specialized in producing and distributing aluminum profiles for industrial applications",
      logoUrl: "/assets/logo.svg",
      faviconUrl: "/favicon.ico",
      contactEmail: "info@metanord.eu",
      supportEmail: "support@metanord.eu",
      phoneNumber: "+372 5551234",
      address: "Harju maakond, Tallinn, Kesklinna linnaosa, Tornimäe tn 5, 10145",
      socialMedia: {
        facebook: "https://facebook.com/metanord",
        twitter: "",
        instagram: "https://instagram.com/metanord",
        linkedin: "https://linkedin.com/company/metanord",
        youtube: "",
      },
      googleAnalyticsId: "",
      metaPixelId: "",
    },
  });
  
  // Email settings form
  const emailSettingsForm = useForm<z.infer<typeof emailSettingsSchema>>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpHost: "smtp.sendgrid.net",
      smtpPort: "587",
      smtpUser: "apikey",
      smtpPassword: "",
      senderName: "MetaNord Team",
      senderEmail: "info@metanord.eu",
      replyToEmail: "info@metanord.eu",
      emailTemplatesEnabled: true,
      emailSignature: "Best regards,\nMetaNord Team",
    },
  });
  
  // Security settings form
  const securitySettingsForm = useForm<z.infer<typeof securitySettingsSchema>>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      enableTwoFactor: false,
      passwordPolicy: {
        minLength: 10,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        passwordExpiryDays: 90,
      },
      sessionTimeoutMinutes: 60,
      maxLoginAttempts: 5,
      ipWhitelist: [],
      enableCaptcha: false,
      captchaSiteKey: "",
      captchaSecretKey: "",
    },
  });
  
  // Notification settings form
  const notificationSettingsForm = useForm<z.infer<typeof notificationSettingsSchema>>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotifications: {
        newContactFormSubmission: true,
        newQuoteRequest: true,
        newCRMContact: true,
        statusUpdates: true,
      },
      adminNotifications: {
        newUsers: true,
        systemUpdates: true,
        securityAlerts: true,
        loginAttempts: true,
      },
      notificationRecipients: ["info@metanord.eu"],
    },
  });
  
  // System settings form
  const systemSettingsForm = useForm<z.infer<typeof systemSettingsSchema>>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      debugMode: false,
      maintenanceMode: false,
      maintenanceMessage: "We're currently performing maintenance. Please check back soon.",
      loggingLevel: "error",
      backupEnabled: true,
      backupFrequency: "daily",
      maxUploadSize: 10,
      allowedFileTypes: ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx", "xls", "xlsx"],
      cacheTimeout: 60,
      defaultLanguage: "en",
    },
  });
  
  // User management form
  const userManagementForm = useForm<z.infer<typeof userManagementSchema>>({
    resolver: zodResolver(userManagementSchema),
    defaultValues: {
      allowUserRegistration: false,
      requireEmailVerification: true,
      defaultUserRole: "user",
      userRoles: [
        {
          id: "admin",
          name: "Administrator",
          permissions: ["all"],
        },
        {
          id: "user",
          name: "User",
          permissions: ["read"],
        },
        {
          id: "editor",
          name: "Editor",
          permissions: ["read", "write"],
        },
      ],
    },
  });
  
  // API settings form
  const apiSettingsForm = useForm<z.infer<typeof apiSettingsSchema>>({
    resolver: zodResolver(apiSettingsSchema),
    defaultValues: {
      enableApi: false,
      requireApiKey: true,
      allowedOrigins: ["https://meta-nord.trade"],
      rateLimitRequests: 100,
      rateLimitTimeWindow: 15,
    },
  });
  
  // Fetch settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/admin/settings"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/admin/settings");
        const data = await res.json();
        
        // Update form values with fetched settings
        if (data.site) siteSettingsForm.reset(data.site);
        if (data.email) emailSettingsForm.reset(data.email);
        if (data.security) securitySettingsForm.reset(data.security);
        if (data.notifications) notificationSettingsForm.reset(data.notifications);
        if (data.system) systemSettingsForm.reset(data.system);
        if (data.users) userManagementForm.reset(data.users);
        if (data.api) apiSettingsForm.reset(data.api);
        
        return data;
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast({
          title: "Failed to load settings",
          description: "Unable to retrieve settings. Using default values.",
          variant: "destructive",
        });
        return null;
      }
    },
  });
  
  // Update site settings mutation
  const updateSiteSettingsMutation = useMutation({
    mutationFn: async (values: z.infer<typeof siteSettingsSchema>) => {
      const res = await apiRequest("PUT", "/api/admin/settings/site", values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "Site settings updated",
        description: "Your site settings have been successfully saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update site settings: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Update email settings mutation
  const updateEmailSettingsMutation = useMutation({
    mutationFn: async (values: z.infer<typeof emailSettingsSchema>) => {
      const res = await apiRequest("PUT", "/api/admin/settings/email", values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "Email settings updated",
        description: "Your email settings have been successfully saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update email settings: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Test email connection mutation
  const testEmailConnectionMutation = useMutation({
    mutationFn: async () => {
      setIsTestingEmail(true);
      const res = await apiRequest("POST", "/api/admin/settings/email/test", emailSettingsForm.getValues());
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Email test successful",
        description: "A test email has been sent successfully.",
      });
      setIsTestingEmail(false);
    },
    onError: (error) => {
      toast({
        title: "Email test failed",
        description: `Failed to send test email: ${error.message}`,
        variant: "destructive",
      });
      setIsTestingEmail(false);
    },
  });
  
  // Update security settings mutation
  const updateSecuritySettingsMutation = useMutation({
    mutationFn: async (values: z.infer<typeof securitySettingsSchema>) => {
      const res = await apiRequest("PUT", "/api/admin/settings/security", values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "Security settings updated",
        description: "Your security settings have been successfully saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update security settings: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Update notification settings mutation
  const updateNotificationSettingsMutation = useMutation({
    mutationFn: async (values: z.infer<typeof notificationSettingsSchema>) => {
      const res = await apiRequest("PUT", "/api/admin/settings/notifications", values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "Notification settings updated",
        description: "Your notification settings have been successfully saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update notification settings: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Update system settings mutation
  const updateSystemSettingsMutation = useMutation({
    mutationFn: async (values: z.infer<typeof systemSettingsSchema>) => {
      const res = await apiRequest("PUT", "/api/admin/settings/system", values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "System settings updated",
        description: "Your system settings have been successfully saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update system settings: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Update user management settings mutation
  const updateUserManagementSettingsMutation = useMutation({
    mutationFn: async (values: z.infer<typeof userManagementSchema>) => {
      const res = await apiRequest("PUT", "/api/admin/settings/users", values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "User management settings updated",
        description: "Your user management settings have been successfully saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update user management settings: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Update API settings mutation
  const updateApiSettingsMutation = useMutation({
    mutationFn: async (values: z.infer<typeof apiSettingsSchema>) => {
      const res = await apiRequest("PUT", "/api/admin/settings/api", values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "API settings updated",
        description: "Your API settings have been successfully saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update API settings: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Generate new API key mutation
  const generateApiKeyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/settings/api/generate-key");
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "New API key generated",
        description: `Your new API key is: ${data.apiKey}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to generate API key: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Handle form submissions
  const handleSubmitSiteSettings = (values: z.infer<typeof siteSettingsSchema>) => {
    updateSiteSettingsMutation.mutate(values);
  };
  
  const handleSubmitEmailSettings = (values: z.infer<typeof emailSettingsSchema>) => {
    updateEmailSettingsMutation.mutate(values);
  };
  
  const handleSubmitSecuritySettings = (values: z.infer<typeof securitySettingsSchema>) => {
    updateSecuritySettingsMutation.mutate(values);
  };
  
  const handleSubmitNotificationSettings = (values: z.infer<typeof notificationSettingsSchema>) => {
    updateNotificationSettingsMutation.mutate(values);
  };
  
  const handleSubmitSystemSettings = (values: z.infer<typeof systemSettingsSchema>) => {
    updateSystemSettingsMutation.mutate(values);
  };
  
  const handleSubmitUserManagementSettings = (values: z.infer<typeof userManagementSchema>) => {
    updateUserManagementSettingsMutation.mutate(values);
  };
  
  const handleSubmitApiSettings = (values: z.infer<typeof apiSettingsSchema>) => {
    updateApiSettingsMutation.mutate(values);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>
          Configure site-wide settings and preferences
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SettingsTab)}>
          <TabsList className="grid grid-cols-7">
            <TabsTrigger value="site">
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Site</span>
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="system">
              <Database className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">System</span>
            </TabsTrigger>
            <TabsTrigger value="users">
              <UserCog className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="api">
              <KeyRound className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">API</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Site Settings */}
          <TabsContent value="site" className="space-y-4 mt-4">
            <Form {...siteSettingsForm}>
              <form onSubmit={siteSettingsForm.handleSubmit(handleSubmitSiteSettings)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={siteSettingsForm.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={siteSettingsForm.control}
                    name="siteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={siteSettingsForm.control}
                  name="siteDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of your site"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={siteSettingsForm.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Path to your logo image (e.g., /assets/logo.svg)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={siteSettingsForm.control}
                    name="faviconUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Favicon URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Path to your favicon (e.g., /favicon.ico)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator className="my-4" />
                <h3 className="text-lg font-medium">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={siteSettingsForm.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={siteSettingsForm.control}
                    name="supportEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Support Email (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={siteSettingsForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={siteSettingsForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Your business address"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator className="my-4" />
                <h3 className="text-lg font-medium">Social Media</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={siteSettingsForm.control}
                    name="socialMedia.facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={siteSettingsForm.control}
                    name="socialMedia.twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={siteSettingsForm.control}
                    name="socialMedia.instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={siteSettingsForm.control}
                    name="socialMedia.linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={siteSettingsForm.control}
                    name="socialMedia.youtube"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator className="my-4" />
                <h3 className="text-lg font-medium">Analytics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={siteSettingsForm.control}
                    name="googleAnalyticsId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Google Analytics ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="G-XXXXXXXXXX" />
                        </FormControl>
                        <FormDescription>
                          Your Google Analytics tracking ID
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={siteSettingsForm.control}
                    name="metaPixelId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Pixel ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="XXXXXXXXXX" />
                        </FormControl>
                        <FormDescription>
                          Your Meta Pixel ID for Facebook tracking
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => siteSettingsForm.reset()}
                  >
                    <Undo className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button type="submit" disabled={updateSiteSettingsMutation.isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    {updateSiteSettingsMutation.isPending ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          {/* Email Settings */}
          <TabsContent value="email" className="space-y-4 mt-4">
            <Form {...emailSettingsForm}>
              <form onSubmit={emailSettingsForm.handleSubmit(handleSubmitEmailSettings)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={emailSettingsForm.control}
                    name="smtpHost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Host</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={emailSettingsForm.control}
                    name="smtpPort"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Port</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={emailSettingsForm.control}
                    name="smtpUser"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={emailSettingsForm.control}
                    name="smtpPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          For SendGrid, use your API key
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={emailSettingsForm.control}
                    name="senderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sender Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={emailSettingsForm.control}
                    name="senderEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sender Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={emailSettingsForm.control}
                  name="replyToEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reply-To Email (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Email address to use for replies. Leave blank to use sender email.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={emailSettingsForm.control}
                  name="emailSignature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Signature</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Your email signature"
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={emailSettingsForm.control}
                  name="emailTemplatesEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Enable Email Templates</FormLabel>
                        <FormDescription>
                          Use HTML templates for all system emails
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => testEmailConnectionMutation.mutate()}
                    disabled={isTestingEmail || updateEmailSettingsMutation.isPending}
                  >
                    {isTestingEmail ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Test Email
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => emailSettingsForm.reset()}
                  >
                    <Undo className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={updateEmailSettingsMutation.isPending || isTestingEmail}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateEmailSettingsMutation.isPending ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security" className="space-y-4 mt-4">
            <Form {...securitySettingsForm}>
              <form onSubmit={securitySettingsForm.handleSubmit(handleSubmitSecuritySettings)} className="space-y-4">
                <FormField
                  control={securitySettingsForm.control}
                  name="enableTwoFactor"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Enable Two-Factor Authentication</FormLabel>
                        <FormDescription>
                          Require two-factor authentication for all admin users
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <Separator className="my-4" />
                <h3 className="text-lg font-medium">Password Policy</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={securitySettingsForm.control}
                    name="passwordPolicy.minLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Password Length</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={8} 
                            max={32} 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={securitySettingsForm.control}
                    name="passwordPolicy.passwordExpiryDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password Expiry (Days)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0} 
                            max={365} 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>Set to 0 for no expiry</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={securitySettingsForm.control}
                    name="passwordPolicy.requireUppercase"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Require Uppercase</FormLabel>
                          <FormDescription>
                            At least one uppercase letter
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={securitySettingsForm.control}
                    name="passwordPolicy.requireLowercase"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Require Lowercase</FormLabel>
                          <FormDescription>
                            At least one lowercase letter
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={securitySettingsForm.control}
                    name="passwordPolicy.requireNumbers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Require Numbers</FormLabel>
                          <FormDescription>
                            At least one number
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={securitySettingsForm.control}
                    name="passwordPolicy.requireSpecialChars"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Require Special Characters</FormLabel>
                          <FormDescription>
                            At least one special character
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator className="my-4" />
                <h3 className="text-lg font-medium">Session & Login</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={securitySettingsForm.control}
                    name="sessionTimeoutMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Timeout (Minutes)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={5} 
                            max={1440} 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Time in minutes until an inactive session expires
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={securitySettingsForm.control}
                    name="maxLoginAttempts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Login Attempts</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            max={10} 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Number of failed attempts before account is locked
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={securitySettingsForm.control}
                  name="enableCaptcha"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Enable CAPTCHA</FormLabel>
                        <FormDescription>
                          Require CAPTCHA verification on login and registration forms
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                {securitySettingsForm.watch("enableCaptcha") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={securitySettingsForm.control}
                      name="captchaSiteKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CAPTCHA Site Key</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={securitySettingsForm.control}
                      name="captchaSecretKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CAPTCHA Secret Key</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => securitySettingsForm.reset()}
                  >
                    <Undo className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  
                  <Button type="submit" disabled={updateSecuritySettingsMutation.isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    {updateSecuritySettingsMutation.isPending ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          {/* The rest of the tabs follow the same pattern */}
          <TabsContent value="notifications" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Configure email notifications for various system events.
            </p>
            
            <Form {...notificationSettingsForm}>
              <form onSubmit={notificationSettingsForm.handleSubmit(handleSubmitNotificationSettings)} className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={notificationSettingsForm.control}
                    name="emailNotifications.newContactFormSubmission"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>New Contact Form Submissions</FormLabel>
                          <FormDescription>
                            Send notification when new contact form is submitted
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationSettingsForm.control}
                    name="emailNotifications.newQuoteRequest"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>New Quote Requests</FormLabel>
                          <FormDescription>
                            Send notification when new quote is requested
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationSettingsForm.control}
                    name="emailNotifications.newCRMContact"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>New CRM Contacts</FormLabel>
                          <FormDescription>
                            Send notification when new contact is added to CRM
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationSettingsForm.control}
                    name="emailNotifications.statusUpdates"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Status Updates</FormLabel>
                          <FormDescription>
                            Send notification when inquiry/quote status changes
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator className="my-4" />
                <h3 className="text-lg font-medium">Admin Notifications</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={notificationSettingsForm.control}
                    name="adminNotifications.newUsers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>New User Registrations</FormLabel>
                          <FormDescription>
                            Send notification when new user registers
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationSettingsForm.control}
                    name="adminNotifications.systemUpdates"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>System Updates</FormLabel>
                          <FormDescription>
                            Send notification for important system changes
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationSettingsForm.control}
                    name="adminNotifications.securityAlerts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Security Alerts</FormLabel>
                          <FormDescription>
                            Send notification for security-related events
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationSettingsForm.control}
                    name="adminNotifications.loginAttempts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Failed Login Attempts</FormLabel>
                          <FormDescription>
                            Send notification for suspicious login attempts
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <h3 className="text-lg font-medium mt-6">Notification Recipients</h3>
                <p className="text-sm text-muted-foreground">
                  Enter email addresses that should receive the above notifications.
                </p>
                
                {/* This would be better with a dynamic field array but keeping it simple for now */}
                <FormField
                  control={notificationSettingsForm.control}
                  name="notificationRecipients.0"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Recipient</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => notificationSettingsForm.reset()}
                  >
                    <Undo className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  
                  <Button type="submit" disabled={updateNotificationSettingsMutation.isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    {updateNotificationSettingsMutation.isPending ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          {/* Additional tabs would follow the same pattern */}
          
          <TabsContent value="system" className="space-y-4 mt-4">
            <Form {...systemSettingsForm}>
              <form onSubmit={systemSettingsForm.handleSubmit(handleSubmitSystemSettings)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormField
                      control={systemSettingsForm.control}
                      name="debugMode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Debug Mode</FormLabel>
                            <FormDescription>
                              Enable detailed error reporting and debugging
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div>
                    <FormField
                      control={systemSettingsForm.control}
                      name="maintenanceMode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Maintenance Mode</FormLabel>
                            <FormDescription>
                              Put the website into maintenance mode
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {systemSettingsForm.watch("maintenanceMode") && (
                  <FormField
                    control={systemSettingsForm.control}
                    name="maintenanceMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maintenance Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Message to display during maintenance"
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={systemSettingsForm.control}
                    name="loggingLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logging Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select logging level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="error">Error</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="info">Info</SelectItem>
                            <SelectItem value="debug">Debug</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Determines what types of events are logged
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={systemSettingsForm.control}
                    name="defaultLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Language</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select default language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="et">Estonian</SelectItem>
                            <SelectItem value="ru">Russian</SelectItem>
                            <SelectItem value="lv">Latvian</SelectItem>
                            <SelectItem value="lt">Lithuanian</SelectItem>
                            <SelectItem value="pl">Polish</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Default language for the website
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator className="my-4" />
                <h3 className="text-lg font-medium">Backup & Storage</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormField
                      control={systemSettingsForm.control}
                      name="backupEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Enable Automated Backups</FormLabel>
                            <FormDescription>
                              Automatically backup the database and files
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {systemSettingsForm.watch("backupEnabled") && (
                    <FormField
                      control={systemSettingsForm.control}
                      name="backupFrequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Backup Frequency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select backup frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            How often backups should be created
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={systemSettingsForm.control}
                    name="maxUploadSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Upload Size (MB)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={100}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum file size for uploads in megabytes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={systemSettingsForm.control}
                    name="cacheTimeout"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cache Timeout (Minutes)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={1440}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Time in minutes before cached content expires (0 to disable)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => systemSettingsForm.reset()}
                  >
                    <Undo className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  
                  <Button type="submit" disabled={updateSystemSettingsMutation.isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    {updateSystemSettingsMutation.isPending ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          {/* Additional tabs would follow the same pattern */}
          <TabsContent value="users" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Configure user registration and role settings.
            </p>
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
              <p className="text-sm text-yellow-800">
                This section is available but all settings are for display purposes only. User management is handled by the system administrator.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Configure API access and settings.
            </p>
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
              <p className="text-sm text-yellow-800">
                This section is available but all settings are for display purposes only. API settings are managed directly by the system administrator.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default SettingsManager;