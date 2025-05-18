import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage, hashPassword } from "./storage";
import { generateSitemap, saveSitemapToFile, generateRobotsTxt, saveRobotsTxt } from "./sitemap";
import { 
  insertContactInquirySchema, 
  loginUserSchema, 
  insertSiteContentSchema,
  insertProductSchema,
  insertQuoteRequestSchema,
  insertCrmClientSchema,
  insertCrmActivityLogSchema,
  insertCrmEmailLogSchema,
  insertCrmEmailTemplateSchema,
  insertOfferSchema,
  insertAuditLogSchema,
  insertNotificationSchema,
  insertProjectSchema,
  insertPageComponentSchema,
  insertPageTemplateSchema,
  insertCustomPageSchema,
  insertDocumentSchema,
  User
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import session from "express-session";
import fileUpload from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import { UploadedFile } from "express-fileupload";

import {
  sendContactInquiryNotifications,
  sendQuoteRequestNotifications,
  sendContactInquiryStatusUpdate,
  sendQuoteRequestStatusUpdate,
  sendCrmClientEmail,
  sendNewClientNotification
} from "./email";

declare module 'express-session' {
  interface SessionData {
    userId: number;
    isAdmin: boolean;
    username: string;
    role?: string;
  }
}

// Enhanced authentication middleware with comprehensive debugging
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // Extended diagnostics for debugging all session-related issues
  console.log(`[Auth Check] URL Path: ${req.originalUrl}`);
  console.log(`[Auth Check] Method: ${req.method}`);
  console.log(`[Auth Check] Session exists: ${!!req.session}`);
  console.log(`[Auth Check] Session ID: ${req.session.id}`);
  console.log(`[Auth Check] User ID: ${req.session.userId}`);
  console.log(`[Auth Check] Is Admin: ${req.session.isAdmin}`);
  console.log(`[Auth Check] Username: ${req.session.username}`);
  console.log(`[Auth Check] Role: ${req.session.role || 'not set'}`);
  
  // Log important headers for cookie and CORS debugging
  const relevantHeaders = [
    'cookie', 
    'origin', 
    'host', 
    'referer', 
    'user-agent',
    'access-control-request-method',
    'access-control-request-headers'
  ];
  
  const debugHeaders = Object.entries(req.headers)
    .filter(([key]) => relevantHeaders.includes(key))
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {} as Record<string, any>);
    
  console.log(`[Auth Check] Important Headers:`, debugHeaders);
  
  // More detailed validation
  if (!req.session) {
    console.log(`[Auth Check] Authentication failed - no session found`);
    return res.status(401).json({ success: false, message: "Session not found" });
  }
  
  if (!req.session.userId) {
    console.log(`[Auth Check] Authentication failed - no userId in session`);
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  
  console.log(`[Auth Check] Authentication successful for user ${req.session.userId} (${req.session.username})`);
  next();
};

// Middleware to check if user has required role permissions
const hasRolePermission = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    
    // Legacy support for isAdmin flag
    if (req.session.isAdmin && allowedRoles.includes('admin')) {
      return next();
    }
    
    // If user has the admin role, allow access
    if (req.session.role && allowedRoles.includes(req.session.role)) {
      return next();
    }
    
    return res.status(403).json({ 
      success: false, 
      message: "Insufficient permissions" 
    });
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Advanced CORS configuration for better cookie handling
  app.use((req, res, next) => {
    // Get the origin from the request or set as null if not provided
    const origin = req.headers.origin || null;
    
    // Only set specific Origin for credential requests, null for others
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    next();
  });
  
  // Final revision of session configuration for maximum Replit compatibility
  console.log('[Session] Setting up with environment:', process.env.NODE_ENV);
  
  // Use the original connect.sid name for maximum compatibility
  app.use(session({
    secret: process.env.SESSION_SECRET || 'metanord-admin-secret-key',
    name: 'connect.sid', // Using default session name for maximum compatibility
    resave: true,
    rolling: true,
    saveUninitialized: true, // Changed to true to ensure sessions are always created
    cookie: { 
      secure: false, // Must be false in Replit environment
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      sameSite: 'lax', // Most compatible setting
      path: '/'
    }
  }));
  
  // Session debugging middleware
  app.use((req, res, next) => {
    // Log only for specific routes to avoid console spam
    if (req.path.startsWith('/api/admin')) {
      console.log(`[Session Debug] ${req.method} ${req.path} - Session ID: ${req.session.id}`);
      console.log(`[Session Debug] User info: ${req.session.userId ? req.session.username : 'Not logged in'}`);
    }
    next();
  });
  
  // Enable file uploads
  app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: '/tmp/'
  }));
  
  // Completely simplified login route for maximum reliability
  app.post("/api/admin/login", async (req, res) => {
    console.log('[Login] Login attempt received for:', req.body.username);
    try {
      const data = loginUserSchema.parse(req.body);
      const user = await storage.verifyUser(data.username, data.password);
      
      if (!user) {
        console.log('[Login] Invalid credentials provided for:', data.username);
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
      
      console.log(`[Login] User verified successfully: ${user.username} (ID: ${user.id})`);
      
      // Store required session data
      req.session.userId = user.id;
      req.session.isAdmin = !!user.isAdmin;
      req.session.username = user.username;
      req.session.role = user.role || (user.isAdmin ? 'admin' : 'viewer');
      
      // Save session synchronously - this is the most reliable approach
      req.session.save((err) => {
        if (err) {
          console.error('[Login] Session save error:', err);
          return res.status(500).json({ success: false, message: "Session error" });
        }
        
        console.log('[Login] Session saved successfully:', req.session.id);
        
        // Return user data (excluding password)
        const { password, ...userWithoutPassword } = user;
        res.status(200).json({ success: true, user: userWithoutPassword });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('[Login] Validation error:', error.errors);
        const validationError = fromZodError(error);
        res.status(400).json({ success: false, message: validationError.message });
      } else {
        console.error("[Login] Server error:", error);
        res.status(500).json({ success: false, message: "Server error occurred" });
      }
    }
  });
  
  // Logout route
  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ success: false, message: "Failed to logout" });
      } else {
        res.status(200).json({ success: true, message: "Logged out successfully" });
      }
    });
  });
  
  /* 
   * NOTE: This route is commented out to avoid duplication.
   * There is another implementation of /api/admin/me later in the file
   * that uses the isAuthenticated middleware.
   */
  // app.get("/api/admin/me", (req, res) => {
  //   console.log('[Auth Check] Session query:', {
  //     exists: !!req.session,
  //     id: req.session?.id,
  //     userId: req.session?.userId,
  //     username: req.session?.username
  //   });
  //   
  //   if (req.session.userId) {
  //     console.log(`[Auth Check] User authenticated: ${req.session.username} (${req.session.userId})`);
  //     res.status(200).json({ 
  //       success: true, 
  //       user: { 
  //         id: req.session.userId, 
  //         username: req.session.username, 
  //         isAdmin: req.session.isAdmin,
  //         role: req.session.role || (req.session.isAdmin ? 'admin' : 'viewer')
  //       } 
  //     });
  //   } else {
  //     console.log('[Auth Check] No userId in session, authentication failed');
  //     res.status(401).json({ success: false, message: "Not authenticated" });
  //   }
  // });

  // Contact form submission route - enhanced with comprehensive logging and error handling
  app.post("/api/contact", async (req, res) => {
    console.log("[ContactForm] New inquiry submission received:", {
      name: req.body.name,
      email: req.body.email,
      company: req.body.company,
      subject: req.body.subject || "(No subject)",
    });
    
    try {
      // Add default values for fields that might be missing
      if (!req.body.status) req.body.status = "new";
      if (req.body.archived === undefined) req.body.archived = false;
      
      // Validate the incoming data
      const data = insertContactInquirySchema.parse(req.body);
      console.log("[ContactForm] Data validated successfully");
      
      // Create the inquiry in storage
      const inquiry = await storage.createContactInquiry(data);
      console.log(`[ContactForm] Inquiry created successfully with ID: ${inquiry.id}`);
      
      // Verify the inquiry was saved by retrieving all inquiries
      const allInquiries = await storage.getAllContactInquiries({});
      console.log(`[ContactForm] Total inquiries after saving: ${allInquiries.length}`);
      
      // Send email notifications
      try {
        await sendContactInquiryNotifications(inquiry);
        console.log("[ContactForm] Notification emails sent successfully");
      } catch (emailError) {
        console.error("[ContactForm] Email notification error:", emailError);
        // Continue processing even if email fails
      }
      
      // Force save data to ensure persistence
      (storage as any).saveData();
      
      // Return success response
      res.status(201).json({ 
        success: true, 
        message: "Inquiry submitted successfully",
        inquiry 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("[ContactForm] Validation error:", error.errors);
        const validationError = fromZodError(error);
        res.status(400).json({ success: false, message: validationError.message });
      } else {
        console.error("[ContactForm] Server error:", error);
        res.status(500).json({ success: false, message: "Server error occurred" });
      }
    }
  });

  // Get all inquiries - with advanced diagnostic info and data integrity verification
  app.get("/api/admin/contact", isAuthenticated, async (req, res) => {
    try {
      console.log('[ContactAPI] Fetching contact inquiries, session:', {
        userId: req.session.userId,
        username: req.session.username,
        sessionId: req.session.id
      });
      
      // Create a test inquiry if none exist
      let inquiries = await storage.getAllContactInquiries({});
      console.log(`[ContactAPI] Initial check: Found ${inquiries.length} inquiries in storage`);
      
      if (inquiries.length === 0) {
        console.log('[ContactAPI] WARNING: No inquiries found in storage. Loading from file...');
        
        // Check if inquiries.json exists
        const fs = require('fs');
        const path = require('path');
        const inquiriesPath = path.join('./data', 'inquiries.json');
        
        if (fs.existsSync(inquiriesPath)) {
          // Try to load data directly from file as a fallback
          try {
            const inquiryData = JSON.parse(fs.readFileSync(inquiriesPath, 'utf8'));
            console.log(`[ContactAPI] Loaded ${inquiryData.length} inquiries directly from file`);
            
            // Add each inquiry to storage
            for (const inquiry of inquiryData) {
              await storage.createContactInquiry({
                name: inquiry.name,
                email: inquiry.email,
                company: inquiry.company,
                subject: inquiry.subject,
                inquiryType: inquiry.inquiryType,
                message: inquiry.message,
                status: inquiry.status || 'new',
                archived: inquiry.archived || false
              });
            }
            (storage as any).saveData();
            console.log('[ContactAPI] Inquiries restored to storage');
          } catch (fileError) {
            console.error('[ContactAPI] Failed to load inquiries from file:', fileError);
          }
        } else {
          console.log('[ContactAPI] No inquiries.json file found');
          // Create a real inquiry for demonstration purposes if no inquiries exist
          await storage.createContactInquiry({
            name: "System Test",
            email: "admin@metanord.eu",
            company: "MetaNord OÜ",
            subject: "Test Inquiry",
            inquiryType: "system",
            message: "This is an automatically created test inquiry because no inquiries were found in the system.",
            status: "new",
            archived: false
          });
          (storage as any).saveData();
          console.log('[ContactAPI] Created a test inquiry');
        }
      }
      
      // Apply filters
      const { status, archived } = req.query;
      const filters: { status?: string; archived?: boolean } = {};
      
      if (status) {
        filters.status = status as string;
        console.log(`[ContactAPI] Filtering by status: ${status}`);
      }
      
      if (archived !== undefined) {
        filters.archived = archived === 'true';
        console.log(`[ContactAPI] Filtering by archived: ${archived}`);
      }
      
      console.log('[ContactAPI] Requesting inquiries with filters:', filters);
      
      // Get all inquiries with applied filters
      inquiries = await storage.getAllContactInquiries(filters);
      console.log(`[ContactAPI] Found ${inquiries.length} inquiries after applying filters`);
      
      // Log some details about the first few inquiries for debugging
      if (inquiries.length > 0) {
        console.log('[ContactAPI] First inquiry:', {
          id: inquiries[0].id,
          name: inquiries[0].name,
          email: inquiries[0].email,
          status: inquiries[0].status,
          created: inquiries[0].createdAt
        });
      }
      
      res.status(200).json(inquiries);
    } catch (error) {
      console.error("[ContactAPI] Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Get archived contact inquiries
  app.get("/api/admin/contact/archived", isAuthenticated, async (req, res) => {
    try {
      const inquiries = await storage.getArchivedContactInquiries();
      res.status(200).json(inquiries);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Export contact inquiries
  app.get("/api/admin/contact/export/:format", isAuthenticated, async (req, res) => {
    try {
      const format = (req.params.format as 'json' | 'csv') || 'json';
      const { status, archived } = req.query;
      const filters: { status?: string; archived?: boolean } = {};
      
      if (status) {
        filters.status = status as string;
      }
      
      if (archived !== undefined) {
        filters.archived = archived === 'true';
      }
      
      const data = await storage.exportContactInquiries(format, filters);
      
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=contact-inquiries.csv');
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=contact-inquiries.json');
      }
      
      res.status(200).send(data);
    } catch (error) {
      console.error("Export error:", error);
      res.status(500).json({ success: false, message: "Failed to export data" });
    }
  });
  
  // Quote request submission
  app.post("/api/quote", async (req, res) => {
    try {
      const data = insertQuoteRequestSchema.parse(req.body);
      const quoteRequest = await storage.createQuoteRequest(data);
      
      // Send email notifications
      try {
        await sendQuoteRequestNotifications(quoteRequest);
      } catch (emailError) {
        console.error("Email notification error:", emailError);
        // Continue processing even if email fails
      }
      
      res.status(201).json({ success: true, quoteRequest });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ success: false, message: validationError.message });
      } else {
        console.error("Server error:", error);
        res.status(500).json({ success: false, message: "Server error occurred" });
      }
    }
  });
  
  // Get all quote requests - for admin purposes (with filtering)
  app.get("/api/admin/quotes", isAuthenticated, async (req, res) => {
    try {
      const { status, archived } = req.query;
      const filters: { status?: string; archived?: boolean } = {};
      
      if (status) {
        filters.status = status as string;
      }
      
      if (archived !== undefined) {
        filters.archived = archived === 'true';
      }
      
      const quoteRequests = await storage.getAllQuoteRequests(filters);
      res.status(200).json(quoteRequests);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Get archived quote requests
  app.get("/api/admin/quotes/archived", isAuthenticated, async (req, res) => {
    try {
      const quoteRequests = await storage.getArchivedQuoteRequests();
      res.status(200).json(quoteRequests);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Export quote requests
  app.get("/api/admin/quotes/export/:format", isAuthenticated, async (req, res) => {
    try {
      const format = (req.params.format as 'json' | 'csv') || 'json';
      const { status, archived } = req.query;
      const filters: { status?: string; archived?: boolean } = {};
      
      if (status) {
        filters.status = status as string;
      }
      
      if (archived !== undefined) {
        filters.archived = archived === 'true';
      }
      
      const data = await storage.exportQuoteRequests(format, filters);
      
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=quote-requests.csv');
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=quote-requests.json');
      }
      
      res.status(200).send(data);
    } catch (error) {
      console.error("Export error:", error);
      res.status(500).json({ success: false, message: "Failed to export data" });
    }
  });
  
  // Archive/unarchive quote request
  app.post("/api/admin/quotes/:id/archive", isAuthenticated, async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const { archived } = req.body;
      
      let updatedRequest;
      if (archived === true) {
        updatedRequest = await storage.archiveQuoteRequest(requestId);
      } else if (archived === false) {
        updatedRequest = await storage.unarchiveQuoteRequest(requestId);
      } else {
        return res.status(400).json({ success: false, message: "Invalid archived value" });
      }
      
      if (!updatedRequest) {
        return res.status(404).json({ success: false, message: "Quote request not found" });
      }
      
      // Log the action in the audit logs
      await storage.createAuditLog({
        action: archived ? "archive" : "unarchive",
        entityType: "quote_request",
        entityId: requestId.toString(),
        details: `Quote request ${requestId} was ${archived ? 'archived' : 'unarchived'}`,
        userId: (req.user as User).id
      });
      
      res.status(200).json(updatedRequest);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Update quote request status
  app.post("/api/admin/quotes/:id/status", isAuthenticated, async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["new", "in progress", "quoted", "completed", "closed", "archived"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
      }
      
      // Use the dedicated method to update status
      const updatedRequest = await storage.updateQuoteRequestStatus(requestId, status);
      
      if (!updatedRequest) {
        return res.status(404).json({ success: false, message: "Quote request not found" });
      }
      
      // If status is 'archived', also set the archived flag to true
      if (status === 'archived') {
        await storage.archiveQuoteRequest(requestId);
      }
      
      // Send email notification for status update
      // Only send notifications for these customer-facing statuses
      if (["in progress", "quoted", "completed", "closed"].includes(status)) {
        try {
          await sendQuoteRequestStatusUpdate(updatedRequest, status);
        } catch (emailError) {
          console.error("Email notification error:", emailError);
          // Continue processing even if email fails
        }
      }
      
      res.status(200).json(updatedRequest);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Archive/unarchive contact inquiry
  app.post("/api/admin/contact/:id/archive", isAuthenticated, async (req, res) => {
    try {
      const inquiryId = parseInt(req.params.id);
      const { archived } = req.body;
      
      if (archived !== true && archived !== false) {
        return res.status(400).json({ success: false, message: "Invalid archived value" });
      }
      
      // Use the correct method name from the storage interface
      const updatedInquiry = await storage.archiveInquiry(inquiryId, archived);
      
      if (!updatedInquiry) {
        return res.status(404).json({ success: false, message: "Contact inquiry not found" });
      }
      
      // Log the action in the audit logs
      await storage.createAuditLog({
        action: archived ? "archive" : "unarchive",
        resourceType: "contact-inquiry", 
        resourceId: inquiryId.toString(),
        userId: req.session.userId,
        details: { inquiryId, status: archived ? 'archived' : 'unarchived' }
      });
      
      res.status(200).json(updatedInquiry);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Update inquiry status
  app.post("/api/admin/contact/:id/status", isAuthenticated, async (req, res) => {
    try {
      const inquiryId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["new", "read", "replied", "archived", "in progress", "completed", "pending", "closed"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
      }
      
      // Use the dedicated method to update status
      const updatedInquiry = await storage.updateInquiryStatus(inquiryId, status);
      
      if (!updatedInquiry) {
        return res.status(404).json({ success: false, message: "Inquiry not found" });
      }
      
      // If status is 'archived', also set the archived flag to true
      if (status === 'archived') {
        await storage.archiveInquiry(inquiryId, true);
      }
      
      // Send email notification for status update
      // Only send notifications for these customer-facing statuses
      if (["in progress", "completed", "closed"].includes(status)) {
        try {
          await sendContactInquiryStatusUpdate(updatedInquiry, status);
        } catch (emailError) {
          console.error("Email notification error:", emailError);
          // Continue processing even if email fails
        }
      }
      
      res.status(200).json(updatedInquiry);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Site content routes
  app.get("/api/content/section/:section", async (req, res) => {
    try {
      const section = req.params.section;
      const language = (req.query.language as string) || 'en';
      
      const content = await storage.getAllSiteContent(section, language);
      res.status(200).json(content);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  app.get("/api/content", async (req, res) => {
    try {
      const language = (req.query.language as string) || 'en';
      const content = await storage.getAllSiteContent(undefined, language);
      res.status(200).json(content);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  app.get("/api/content/key/:section/:key", async (req, res) => {
    try {
      const { section, key } = req.params;
      const language = (req.query.language as string) || 'en';
      
      const content = await storage.getSiteContent(section, key, language);
      
      if (content) {
        res.status(200).json(content);
      } else {
        res.status(404).json({ success: false, message: "Content not found" });
      }
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Get site content for admin
  app.get("/api/admin/content", isAuthenticated, async (req, res) => {
    try {
      const section = req.query.section as string;
      const language = (req.query.language as string) || 'en';
      
      const content = await storage.getAllSiteContent(section, language);
      res.status(200).json(content);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  app.post("/api/admin/content", isAuthenticated, async (req, res) => {
    try {
      const data = insertSiteContentSchema.parse(req.body);
      const content = await storage.updateSiteContent(data);
      res.status(201).json({ success: true, content });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ success: false, message: validationError.message });
      } else {
        console.error("Server error:", error);
        res.status(500).json({ success: false, message: "Server error occurred" });
      }
    }
  });
  
  // Product routes
  app.get("/api/products/:productId?", async (req, res) => {
    try {
      const productId = req.params.productId;
      const category = req.query.category as string;
      const language = (req.query.language as string) || 'en';
      
      if (productId) {
        const product = await storage.getProduct(productId, language);
        if (product) {
          res.status(200).json(product);
        } else {
          res.status(404).json({ success: false, message: "Product not found" });
        }
      } else {
        const products = await storage.getAllProducts(category, language);
        res.status(200).json(products);
      }
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  app.post("/api/admin/products", isAuthenticated, async (req, res) => {
    try {
      let productData = req.body;
      
      // Parse arrays and objects from form data
      if (productData.features && typeof productData.features === 'string') {
        try {
          productData.features = JSON.parse(productData.features);
        } catch (e) {
          productData.features = [];
        }
      }
      
      if (productData.applications && typeof productData.applications === 'string') {
        try {
          productData.applications = JSON.parse(productData.applications);
        } catch (e) {
          productData.applications = [];
        }
      }
      
      if (productData.specifications && typeof productData.specifications === 'string') {
        try {
          productData.specifications = JSON.parse(productData.specifications);
        } catch (e) {
          productData.specifications = {};
        }
      }
      
      // Add default status if missing
      if (!productData.status) {
        productData.status = "in stock";
      }
      
      // Handle file upload if there's an image
      if (req.files && req.files.image) {
        const imageFile = Array.isArray(req.files.image) 
          ? req.files.image[0] 
          : req.files.image as UploadedFile;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        // Generate a unique filename
        const filename = `${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`;
        const uploadPath = path.join(uploadDir, filename);
        
        // Move the file to the upload directory
        await imageFile.mv(uploadPath);
        
        // Update the product data with the image path
        productData.image = `/uploads/${filename}`;
      }
      
      const data = insertProductSchema.parse(productData);
      const product = await storage.createProduct(data);
      res.status(201).json({ success: true, product });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ success: false, message: validationError.message });
      } else {
        console.error("Server error:", error);
        res.status(500).json({ success: false, message: "Server error occurred" });
      }
    }
  });
  
  app.put("/api/admin/products/:productId", isAuthenticated, async (req, res) => {
    try {
      const productId = req.params.productId;
      let productData = req.body;
      
      // Parse arrays and objects from form data
      if (productData.features && typeof productData.features === 'string') {
        try {
          productData.features = JSON.parse(productData.features);
        } catch (e) {
          productData.features = [];
        }
      }
      
      if (productData.applications && typeof productData.applications === 'string') {
        try {
          productData.applications = JSON.parse(productData.applications);
        } catch (e) {
          productData.applications = [];
        }
      }
      
      if (productData.specifications && typeof productData.specifications === 'string') {
        try {
          productData.specifications = JSON.parse(productData.specifications);
        } catch (e) {
          productData.specifications = {};
        }
      }
      
      // Handle file upload if there's an image
      if (req.files && req.files.image) {
        const imageFile = Array.isArray(req.files.image) 
          ? req.files.image[0] 
          : req.files.image as UploadedFile;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        // Generate a unique filename
        const filename = `${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`;
        const uploadPath = path.join(uploadDir, filename);
        
        // Move the file to the upload directory
        await imageFile.mv(uploadPath);
        
        // Update the product data with the image path
        productData.image = `/uploads/${filename}`;
      }
      
      const product = await storage.updateProduct(productId, productData);
      
      if (product) {
        res.status(200).json({ success: true, product });
      } else {
        res.status(404).json({ success: false, message: "Product not found" });
      }
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  app.delete("/api/admin/products/:productId", isAuthenticated, async (req, res) => {
    try {
      const productId = req.params.productId;
      const deleted = await storage.deleteProduct(productId);
      
      if (deleted) {
        res.status(200).json({ success: true, message: "Product deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Product not found" });
      }
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Product-Document relationship routes
  
  // Get documents for a specific product
  app.get("/api/products/:productId/documents", async (req, res) => {
    try {
      const productId = req.params.productId;
      const documents = await storage.getProductDocuments(productId);
      
      res.status(200).json(documents);
    } catch (error) {
      console.error("Error fetching product documents:", error);
      res.status(500).json({ success: false, message: "Error fetching product documents" });
    }
  });
  
  // Add document to product (admin only)
  app.post("/api/admin/products/:productId/documents", isAuthenticated, async (req, res) => {
    try {
      const productId = req.params.productId;
      const { documentId } = req.body;
      
      if (!documentId) {
        return res.status(400).json({ success: false, message: "Document ID is required" });
      }
      
      const relation = await storage.addDocumentToProduct(productId, documentId);
      
      // Log the action
      await storage.createAuditLog({
        userId: req.session.userId,
        action: "document_added",
        resourceType: "product",
        resourceId: productId,
        details: { documentId }
      });
      
      res.status(201).json({ success: true, data: relation });
    } catch (error) {
      console.error("Error adding document to product:", error);
      res.status(500).json({ success: false, message: "Error adding document to product" });
    }
  });
  
  // Remove document from product (admin only)
  app.delete("/api/admin/products/:productId/documents/:documentId", isAuthenticated, async (req, res) => {
    try {
      const productId = req.params.productId;
      const documentId = parseInt(req.params.documentId);
      
      if (isNaN(documentId)) {
        return res.status(400).json({ success: false, message: "Invalid document ID" });
      }
      
      const removed = await storage.removeDocumentFromProduct(productId, documentId);
      
      if (removed) {
        // Log the action
        await storage.createAuditLog({
          userId: req.session.userId,
          action: "document_removed",
          resourceType: "product",
          resourceId: productId,
          details: { documentId }
        });
        
        res.status(200).json({ success: true, message: "Document removed from product" });
      } else {
        res.status(404).json({ success: false, message: "Document-product association not found" });
      }
    } catch (error) {
      console.error("Error removing document from product:", error);
      res.status(500).json({ success: false, message: "Error removing document from product" });
    }
  });
  
  // Content versioning endpoints
  app.post("/api/admin/content/version", isAuthenticated, async (req, res) => {
    try {
      const data = req.body;
      
      // Create a new content version
      const contentVersion = await storage.createContentVersion({
        contentType: data.contentType,
        contentId: data.contentId || null,
        data: data.data,
        version: data.version || 1,
        createdBy: req.session.userId || null
      });
      
      res.status(201).json({ success: true, contentVersion });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  app.get("/api/admin/content/versions/:type", isAuthenticated, async (req, res) => {
    try {
      const contentType = req.params.type;
      const contentId = req.query.contentId as string | undefined;
      
      const versions = await storage.getContentVersions(contentType, contentId);
      res.status(200).json(versions);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  app.get("/api/admin/content/version/latest/:type", isAuthenticated, async (req, res) => {
    try {
      const contentType = req.params.type;
      const contentId = req.query.contentId as string | undefined;
      
      const version = await storage.getLatestContentVersion(contentType, contentId);
      if (!version) {
        return res.status(404).json({ success: false, message: "No version found" });
      }
      
      res.status(200).json(version);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Preview endpoints for live content editing
  app.post("/api/admin/preview", isAuthenticated, async (req, res) => {
    try {
      const { contentType, content, language = 'en' } = req.body;
      
      if (!contentType || !content) {
        return res.status(400).json({ 
          success: false, 
          message: "Content type and content are required" 
        });
      }
      
      // Add a special timestamp hash to identify this as preview content
      const previewId = `preview-${Date.now()}`;
      
      // Store the preview content temporarily in-memory (no persistence needed)
      // We'll use content versioning with a special preview flag
      await storage.createContentVersion({
        contentType,
        contentId: previewId,
        data: content,
        version: 0, // Version 0 indicates preview content
        createdBy: req.session.userId || null
      });
      
      res.status(200).json({ 
        success: true, 
        previewId,
        previewUrl: `/preview/${contentType}/${previewId}?lang=${language}`
      });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Public preview endpoint to view previewed content
  app.get("/api/preview/:type/:id", async (req, res) => {
    try {
      const contentType = req.params.type;
      const previewId = req.params.id;
      
      if (!previewId.startsWith('preview-')) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid preview ID" 
        });
      }
      
      // Find the preview content in content versions
      const previewContent = await storage.getContentVersions(contentType, previewId);
      
      if (!previewContent || previewContent.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: "Preview content not found or expired" 
        });
      }
      
      // Return the most recent preview content (should be only one for a given ID)
      res.status(200).json({ 
        success: true, 
        preview: true,
        content: previewContent[0].data,
        timestamp: previewContent[0].createdAt
      });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // SEO Settings endpoints
  app.get("/api/admin/seo/:path", isAuthenticated, async (req, res) => {
    try {
      const pagePath = req.params.path;
      const language = req.query.language as string || 'en';
      
      const seoSettings = await storage.getSeoSettings(pagePath, language);
      res.status(200).json(seoSettings || null);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  app.get("/api/admin/seo", isAuthenticated, async (req, res) => {
    try {
      const language = req.query.language as string || 'en';
      
      const allSeoSettings = await storage.getAllSeoSettings(language);
      res.status(200).json(allSeoSettings);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  app.post("/api/admin/seo", isAuthenticated, async (req, res) => {
    try {
      const data = req.body;
      
      const seoSettings = await storage.updateSeoSettings({
        pagePath: data.pagePath,
        language: data.language || 'en',
        title: data.title || null,
        metaDescription: data.metaDescription || null,
        ogTitle: data.ogTitle || null,
        ogDescription: data.ogDescription || null,
        ogImage: data.ogImage || null
      });
      
      res.status(200).json({ success: true, seoSettings });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Export/Import data
  app.get("/api/admin/export", isAuthenticated, async (req, res) => {
    try {
      const jsonData = await storage.exportToJson();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=metanord-export-${Date.now()}.json`);
      res.status(200).send(jsonData);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  app.post("/api/admin/import", isAuthenticated, async (req, res) => {
    try {
      if (!req.files || !req.files.jsonFile) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }
      
      const jsonFile = req.files.jsonFile as UploadedFile;
      const jsonData = jsonFile.data.toString();
      
      const success = await storage.importFromJson(jsonData);
      
      if (success) {
        res.status(200).json({ success: true, message: "Data imported successfully" });
      } else {
        res.status(400).json({ success: false, message: "Failed to import data" });
      }
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Simple ping endpoint for uptime monitoring
  app.get("/ping", (req, res) => {
    res.status(200).send("OK");
  });
  
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "OK", 
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0"
    });
  });

  // CRM Routes
  // Get all CRM clients
  app.get("/api/admin/crm/clients", isAuthenticated, async (req, res) => {
    try {
      const filters = {
        name: req.query.name as string,
        company: req.query.company as string,
        country: req.query.country as string,
        productRef: req.query.productRef as string,
        leadStatus: req.query.leadStatus as string
      };
      
      // Remove undefined filters
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters] === undefined) {
          delete filters[key as keyof typeof filters];
        }
      });
      
      const clients = await storage.getAllCrmClients(Object.keys(filters).length ? filters : undefined);
      res.status(200).json(clients);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  // Get single CRM client
  app.get("/api/admin/crm/clients/:id", isAuthenticated, async (req, res) => {
    try {
      const clientId = parseInt(req.params.id);
      const client = await storage.getCrmClient(clientId);
      
      if (!client) {
        return res.status(404).json({ success: false, message: "Client not found" });
      }
      
      res.status(200).json(client);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  // Create new CRM client
  app.post("/api/admin/crm/clients", isAuthenticated, async (req, res) => {
    try {
      const client = await storage.createCrmClient(req.body);
      
      // Send notification email to team about new client
      await sendNewClientNotification(
        client.name, 
        client.email, 
        client.company
      );
      
      // Log client creation activity
      await storage.createCrmActivityLog({
        clientId: client.id,
        activityType: 'client_created',
        description: 'Client was added to the CRM',
        performedBy: req.session.userId,
        data: { client }
      });
      
      res.status(201).json(client);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  // Update CRM client
  app.put("/api/admin/crm/clients/:id", isAuthenticated, async (req, res) => {
    try {
      const clientId = parseInt(req.params.id);
      const client = await storage.updateCrmClient(clientId, req.body);
      
      if (!client) {
        return res.status(404).json({ success: false, message: "Client not found" });
      }
      
      res.status(200).json(client);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  // Delete CRM client
  app.delete("/api/admin/crm/clients/:id", isAuthenticated, async (req, res) => {
    try {
      const clientId = parseInt(req.params.id);
      const success = await storage.deleteCrmClient(clientId);
      
      if (!success) {
        return res.status(404).json({ success: false, message: "Client not found" });
      }
      
      res.status(200).json({ success: true, message: "Client deleted successfully" });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  // Get activity logs for a client
  app.get("/api/admin/crm/clients/:id/activities", isAuthenticated, async (req, res) => {
    try {
      const clientId = parseInt(req.params.id);
      const logs = await storage.getCrmActivityLogs(clientId);
      res.status(200).json(logs);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  // Create activity log for a client
  app.post("/api/admin/crm/clients/:id/activities", isAuthenticated, async (req, res) => {
    try {
      const clientId = parseInt(req.params.id);
      const client = await storage.getCrmClient(clientId);
      
      if (!client) {
        return res.status(404).json({ success: false, message: "Client not found" });
      }
      
      const activityLog = await storage.createCrmActivityLog({
        ...req.body,
        clientId,
        createdBy: req.session.userId
      });
      
      res.status(201).json(activityLog);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  // Get email logs for a client
  app.get("/api/admin/crm/clients/:id/emails", isAuthenticated, async (req, res) => {
    try {
      const clientId = parseInt(req.params.id);
      const logs = await storage.getCrmEmailLogs(clientId);
      res.status(200).json(logs);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  // Send email to a client
  app.post("/api/admin/crm/clients/:id/emails", isAuthenticated, async (req, res) => {
    try {
      const clientId = parseInt(req.params.id);
      const client = await storage.getCrmClient(clientId);
      
      if (!client) {
        return res.status(404).json({ success: false, message: "Client not found" });
      }
      
      // Send email using SendGrid
      const { subject, content } = req.body;
      const emailSent = await sendCrmClientEmail(client.email, subject, content);
      
      if (!emailSent) {
        console.warn(`Failed to send email to ${client.email}`);
      } else {
        console.log(`Email sent to ${client.email}: ${subject}`);
      }
      
      // Record the email in logs
      const emailLog = await storage.createCrmEmailLog({
        ...req.body,
        clientId,
        sentBy: req.session.userId
      });
      
      res.status(201).json({ success: true, emailLog });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  // Get all email templates
  app.get("/api/admin/crm/email-templates", isAuthenticated, async (req, res) => {
    try {
      const templates = await storage.getAllCrmEmailTemplates();
      res.status(200).json(templates);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  // Get single email template
  app.get("/api/admin/crm/email-templates/:id", isAuthenticated, async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      const template = await storage.getCrmEmailTemplate(templateId);
      
      if (!template) {
        return res.status(404).json({ success: false, message: "Email template not found" });
      }
      
      res.status(200).json(template);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  // Create new email template
  app.post("/api/admin/crm/email-templates", isAuthenticated, async (req, res) => {
    try {
      const template = await storage.createCrmEmailTemplate(req.body);
      res.status(201).json(template);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  // Update email template
  app.put("/api/admin/crm/email-templates/:id", isAuthenticated, async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      const template = await storage.updateCrmEmailTemplate(templateId, req.body);
      
      if (!template) {
        return res.status(404).json({ success: false, message: "Email template not found" });
      }
      
      res.status(200).json(template);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  // Delete email template
  app.delete("/api/admin/crm/email-templates/:id", isAuthenticated, async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      const success = await storage.deleteCrmEmailTemplate(templateId);
      
      if (!success) {
        return res.status(404).json({ success: false, message: "Email template not found" });
      }
      
      res.status(200).json({ success: true, message: "Email template deleted successfully" });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  // ==========================================================================
  // Offer Management API Routes
  // ==========================================================================
  
  // Get all offers with optional filtering
  app.get("/api/admin/offers", isAuthenticated, async (req, res) => {
    try {
      const { status, fromDate, toDate, minAmount, maxAmount } = req.query;
      
      // Build filter object
      const filters: {
        status?: string;
        fromDate?: Date;
        toDate?: Date;
        minAmount?: number;
        maxAmount?: number;
      } = {};
      
      if (status) filters.status = status as string;
      
      if (fromDate) {
        filters.fromDate = new Date(fromDate as string);
      }
      
      if (toDate) {
        filters.toDate = new Date(toDate as string);
      }
      
      if (minAmount) {
        filters.minAmount = parseFloat(minAmount as string);
      }
      
      if (maxAmount) {
        filters.maxAmount = parseFloat(maxAmount as string);
      }
      
      const offers = await storage.getAllOffers(
        Object.keys(filters).length > 0 ? filters : undefined
      );
      
      res.status(200).json(offers);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Get a specific offer by ID
  app.get("/api/admin/offers/:id", isAuthenticated, async (req, res) => {
    try {
      const offerId = parseInt(req.params.id);
      const offer = await storage.getOffer(offerId);
      
      if (!offer) {
        return res.status(404).json({ success: false, message: "Offer not found" });
      }
      
      res.status(200).json(offer);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Get offers for a specific client
  app.get("/api/admin/clients/:clientId/offers", isAuthenticated, async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const offers = await storage.getClientOffers(clientId);
      
      res.status(200).json(offers);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Create a new offer
  app.post("/api/admin/offers", isAuthenticated, async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertOfferSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ success: false, message: errorMessage });
      }
      
      // Add the current user as the creator
      const data = {
        ...validatedData.data,
        createdBy: req.session.userId
      };
      
      // Create the offer
      const offer = await storage.createOffer(data);
      
      // Log the action
      await storage.createAuditLog({
        userId: req.session.userId,
        action: 'create',
        resourceType: 'offer',
        resourceId: offer.id.toString(),
        details: { offer }
      });
      
      // Create notification for the client
      await storage.createNotification({
        userId: req.session.userId,
        title: 'New Offer Created',
        message: `Offer #${offer.offerNumber} has been created`,
        type: 'info',
        resourceType: 'offer',
        resourceId: offer.id.toString()
      });
      
      res.status(201).json(offer);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Update an offer
  app.put("/api/admin/offers/:id", isAuthenticated, async (req, res) => {
    try {
      const offerId = parseInt(req.params.id);
      
      // Check if offer exists
      const existingOffer = await storage.getOffer(offerId);
      if (!existingOffer) {
        return res.status(404).json({ success: false, message: "Offer not found" });
      }
      
      // Update the offer
      const updatedOffer = await storage.updateOffer(offerId, req.body);
      
      // Log the action
      await storage.createAuditLog({
        userId: req.session.userId,
        action: 'update',
        resourceType: 'offer',
        resourceId: offerId.toString(),
        details: { 
          before: existingOffer,
          after: updatedOffer 
        }
      });
      
      res.status(200).json(updatedOffer);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Delete an offer
  app.delete("/api/admin/offers/:id", isAuthenticated, async (req, res) => {
    try {
      const offerId = parseInt(req.params.id);
      
      // Check if offer exists
      const existingOffer = await storage.getOffer(offerId);
      if (!existingOffer) {
        return res.status(404).json({ success: false, message: "Offer not found" });
      }
      
      const success = await storage.deleteOffer(offerId);
      
      if (success) {
        // Log the action
        await storage.createAuditLog({
          userId: req.session.userId,
          action: 'delete',
          resourceType: 'offer',
          resourceId: offerId.toString(),
          details: { offer: existingOffer }
        });
        
        res.status(200).json({ success: true, message: "Offer deleted successfully" });
      } else {
        res.status(500).json({ success: false, message: "Failed to delete offer" });
      }
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // ==========================================================================
  // Notification API Routes
  // ==========================================================================
  
  // Get notifications for current user
  app.get("/api/admin/notifications", isAuthenticated, async (req, res) => {
    try {
      // Get notifications from storage
      // This would typically come from a database, but for now we'll return mock data
      const currentUser = req.session.userId;
      
      // Get audit logs that involve this user or are system-wide
      const auditLogs = await storage.getAuditLogs({
        limit: 10, 
        offset: 0
      });
      
      // Convert audit logs to notifications
      const notifications = auditLogs.map((log) => {
        // Create notification from audit log
        const timestamp = log.timestamp || new Date();
        let title = "";
        let description = "";
        let type: "info" | "warning" | "success" | "error" = "info";
        let read = false;
        
        // Format based on action type
        switch(log.action) {
          case "create":
            title = `New ${log.resourceType} created`;
            description = `A new ${log.resourceType} was created`;
            type = "success";
            break;
          case "update":
            title = `${log.resourceType} updated`;
            description = `A ${log.resourceType} was updated`;
            type = "info";
            break;
          case "delete":
            title = `${log.resourceType} deleted`;
            description = `A ${log.resourceType} was deleted`;
            type = "warning";
            break;
          case "archive":
            title = `${log.resourceType} archived`;
            description = `A ${log.resourceType} was archived`;
            type = "info";
            break;
          case "restore":
            title = `${log.resourceType} restored`;
            description = `A ${log.resourceType} was restored from archive`;
            type = "success";
            break;
          default:
            title = `${log.action} on ${log.resourceType}`;
            description = `Action performed on a ${log.resourceType}`;
        }
        
        // Add more details if available
        if (log.details) {
          const details = log.details as any;
          
          if (details.name || details.title) {
            description += `: ${details.name || details.title}`;
          }
          
          if (details.status) {
            description += ` (${details.status})`;
          }
        }
        
        return {
          id: log.id,
          title,
          message: description, // Use message instead of description to match our schema
          createdAt: timestamp, // Use createdAt instead of timestamp to match our schema
          read,
          type,
          resourceType: log.resourceType, // Using proper schema field
          resourceId: log.resourceId,     // Using proper schema field
          actionText: `View ${log.resourceType}`
        };
      });
      
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ success: false, message: "Server error fetching notifications" });
    }
  });
  
  // Note: We have better implementations of these endpoints later in the file
  // The PATCH variants below should be used instead
  
  // Audit Log API Routes
  // ==========================================================================
  
  // Get audit logs with optional filtering
  app.get("/api/admin/audit-logs", isAuthenticated, async (req, res) => {
    try {
      const { userId, action, resourceType, resourceId, fromDate, toDate } = req.query;
      
      // Build filter object
      const filters: {
        userId?: number;
        action?: string;
        resourceType?: string;
        resourceId?: string;
        fromDate?: Date;
        toDate?: Date;
      } = {};
      
      if (userId) filters.userId = parseInt(userId as string);
      if (action) filters.action = action as string;
      if (resourceType) filters.resourceType = resourceType as string;
      if (resourceId) filters.resourceId = resourceId as string;
      
      if (fromDate) {
        filters.fromDate = new Date(fromDate as string);
      }
      
      if (toDate) {
        filters.toDate = new Date(toDate as string);
      }
      
      const logs = await storage.getAuditLogs(
        Object.keys(filters).length > 0 ? filters : undefined
      );
      
      res.status(200).json(logs);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Create an audit log entry (typically called internally, but exposed for completeness)
  app.post("/api/admin/audit-logs", isAuthenticated, async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertAuditLogSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ success: false, message: errorMessage });
      }
      
      // Add the current user if not specified
      const data = {
        ...validatedData.data,
        userId: validatedData.data.userId || req.session.userId
      };
      
      const log = await storage.createAuditLog(data);
      res.status(201).json(log);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // ==========================================================================
  // Notification API Routes
  // ==========================================================================
  
  // Get all notifications for the current user
  app.get("/api/admin/notifications", isAuthenticated, async (req, res) => {
    try {
      const includeRead = req.query.includeRead === 'true';
      const userId = req.session.userId;
      
      const notifications = await storage.getUserNotifications(userId, includeRead);
      res.status(200).json(notifications);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Mark a notification as read
  app.patch("/api/admin/notifications/:id/read", isAuthenticated, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const success = await storage.markNotificationAsRead(notificationId);
      
      if (!success) {
        return res.status(404).json({ success: false, message: "Notification not found" });
      }
      
      res.status(200).json({ success: true, message: "Notification marked as read" });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Mark all notifications as read
  app.patch("/api/admin/notifications/read-all", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const success = await storage.markAllNotificationsAsRead(userId);
      
      res.status(200).json({ success, message: success ? "All notifications marked as read" : "Failed to mark notifications as read" });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Create a notification (typically called internally, but exposed for completeness)
  app.post("/api/admin/notifications", isAuthenticated, async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertNotificationSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ success: false, message: errorMessage });
      }
      
      const notification = await storage.createNotification(validatedData.data);
      res.status(201).json(notification);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Delete a notification
  app.delete("/api/admin/notifications/:id", isAuthenticated, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const success = await storage.deleteNotification(notificationId);
      
      if (!success) {
        return res.status(404).json({ success: false, message: "Notification not found" });
      }
      
      res.status(200).json({ success: true, message: "Notification deleted successfully" });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Featured Projects (Case Studies) API Routes
  
  // Get all projects with optional filters
  app.get("/api/projects", async (req, res) => {
    try {
      // Extract query parameters
      const filters: {
        published?: boolean;
        language?: string;
        productTag?: string;
        year?: number;
        category?: string;
      } = {};
      
      if (req.query.published !== undefined) {
        filters.published = req.query.published === 'true';
      }
      
      if (req.query.language) {
        filters.language = req.query.language as string;
      }
      
      if (req.query.productTag) {
        filters.productTag = req.query.productTag as string;
      }
      
      if (req.query.year && !isNaN(Number(req.query.year))) {
        filters.year = Number(req.query.year);
      }
      
      if (req.query.category) {
        filters.category = req.query.category as string;
      }
      
      const projects = await storage.getAllProjects(filters);
      res.status(200).json(projects);
    } catch (error) {
      console.error("Server error fetching projects:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Get a specific project by slug and language - MUST COME BEFORE :id ROUTE
  app.get("/api/projects/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const language = req.query.language as string || 'en';
      
      const project = await storage.getProjectBySlug(slug, language);
      
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
      
      res.status(200).json(project);
    } catch (error) {
      console.error("Server error fetching project by slug:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Get a specific project by ID
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
      
      res.status(200).json(project);
    } catch (error) {
      console.error("Server error fetching project:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Admin routes for projects - all require authentication
  
  // Create a new project
  app.post("/api/admin/projects", isAuthenticated, hasRolePermission(['admin', 'editor']), async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertProjectSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ success: false, message: errorMessage });
      }
      
      const project = await storage.createProject(validatedData.data);
      
      // Create audit log
      await storage.createAuditLog({
        userId: req.session.userId,
        action: "create",
        resourceType: "project",
        resourceId: project.id.toString(),
        details: { projectTitle: project.title, language: project.language }
      });
      
      res.status(201).json(project);
    } catch (error) {
      console.error("Server error creating project:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Update a project
  app.patch("/api/admin/projects/:id", isAuthenticated, hasRolePermission(['admin', 'editor']), async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      
      // First check if the project exists
      const existingProject = await storage.getProject(projectId);
      if (!existingProject) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
      
      // Update the project
      const updatedProject = await storage.updateProject(projectId, req.body);
      
      // Create audit log
      await storage.createAuditLog({
        userId: req.session.userId,
        action: "update",
        resourceType: "project",
        resourceId: projectId.toString(),
        details: { projectTitle: updatedProject?.title, language: updatedProject?.language }
      });
      
      res.status(200).json(updatedProject);
    } catch (error) {
      console.error("Server error updating project:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Delete a project
  app.delete("/api/admin/projects/:id", isAuthenticated, hasRolePermission(['admin']), async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      
      // First get the project details for the audit log
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
      
      // Delete the project
      const success = await storage.deleteProject(projectId);
      
      if (!success) {
        return res.status(404).json({ success: false, message: "Project not found or already deleted" });
      }
      
      // Create audit log
      await storage.createAuditLog({
        userId: req.session.userId,
        action: "delete",
        resourceType: "project",
        resourceId: projectId.toString(),
        details: { projectTitle: project.title, language: project.language }
      });
      
      res.status(200).json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
      console.error("Server error deleting project:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  // User Management API Routes
  
  // Check if the user is an admin - with extra debugging
  const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    console.log('[isAdmin Check] Session data:', { 
      sessionId: req.session?.id,
      userId: req.session?.userId,
      isAdmin: req.session?.isAdmin,
      username: req.session?.username
    });
    
    if (!req.session.userId) {
      console.log('[isAdmin Check] No user ID in session');
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    
    // We have a session but need to check admin permissions
    if (!req.session.isAdmin) {
      console.log('[isAdmin Check] User is not admin:', req.session.username);
      return res.status(403).json({ 
        success: false, 
        message: "Insufficient permissions. Admin access required." 
      });
    }
    
    console.log('[isAdmin Check] Admin check passed for user:', req.session.username);
    next();
  };
  
  // Get current user info - enhanced with session validation
  // No authentication middleware to get a clean authentication check
  app.get("/api/admin/me", async (req, res) => {
    console.log('[AdminMe] Session info:', { 
      userId: req.session.userId,
      username: req.session.username,
      sessionId: req.session.id,
      cookies: req.headers.cookie
    });
    
    if (!req.session.userId) {
      console.log('[AdminMe] No user ID in session');
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    
    try {
      // Get full user data from storage
      const user = await storage.getUser(req.session.userId);
      
      if (!user) {
        console.log('[AdminMe] User not found in storage:', req.session.userId);
        return res.status(401).json({ success: false, message: "User not found" });
      }
      
      console.log('[AdminMe] User successfully retrieved:', user.username);
      
      // Return user without sensitive data
      const { password, ...userWithoutPassword } = user;
      res.json({
        success: true,
        user: {
          ...userWithoutPassword,
          role: user.role || (user.isAdmin ? "admin" : "viewer") // Default role based on admin status
        }
      });
    } catch (error) {
      console.error('[AdminMe] Error retrieving user:', error);
      res.status(500).json({ success: false, message: "Error retrieving user data" });
    }
  });
  
  // Get all users (admin only)
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Create a new user (admin only)
  app.post("/api/admin/users", isAdmin, async (req, res) => {
    try {
      // Create the schema from IUser
      const userSchema = z.object({
        username: z.string().min(3),
        password: z.string().min(6),
        fullName: z.string().optional(),
        email: z.string().email().optional(),
        role: z.enum(["admin", "editor", "viewer"]).default("viewer"),
        isAdmin: z.boolean().optional()
      });
      
      // Validate request body
      const validatedData = userSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ success: false, message: errorMessage });
      }
      
      // Hash the password
      const hashedPassword = await hashPassword(validatedData.data.password);
      
      // Create the user with hashed password
      const user = await storage.createUser({
        ...validatedData.data,
        password: hashedPassword,
        // If role is admin, ensure isAdmin is true
        isAdmin: validatedData.data.role === "admin" ? true : validatedData.data.isAdmin
      });
      
      // Log the action
      await storage.createAuditLog({
        userId: req.session.userId,
        action: 'create_user',
        resourceType: 'user',
        resourceId: user.id.toString(),
        details: { 
          username: user.username,
          role: user.role
        }
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("already exists")) {
          return res.status(400).json({ success: false, message: error.message });
        }
      }
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Update a user (admin only)
  app.patch("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Protect the main admin account from role changes
      const userToUpdate = await storage.getUser(userId);
      if (!userToUpdate) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      if (userToUpdate.username === "admin" && req.body.role && req.body.role !== "admin") {
        return res.status(403).json({ 
          success: false, 
          message: "Cannot change role of the main administrator account" 
        });
      }
      
      // Create update schema
      const updateSchema = z.object({
        username: z.string().min(3).optional(),
        password: z.string().min(6).optional(),
        fullName: z.string().optional(),
        email: z.string().email().optional(),
        role: z.enum(["admin", "editor", "viewer"]).optional(),
        isAdmin: z.boolean().optional()
      });
      
      // Validate request body
      const validatedData = updateSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ success: false, message: errorMessage });
      }
      
      const updateData: any = { ...validatedData.data };
      
      // Hash the password if provided
      if (updateData.password) {
        updateData.password = await hashPassword(updateData.password);
      }
      
      // Update isAdmin based on role if role is provided
      if (updateData.role === "admin") {
        updateData.isAdmin = true;
      } else if (updateData.role === "editor" || updateData.role === "viewer") {
        updateData.isAdmin = false;
      }
      
      // Update the user
      const updatedUser = await storage.updateUser(userId, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      // Log the action
      await storage.createAuditLog({
        userId: req.session.userId,
        action: 'update_user',
        resourceType: 'user',
        resourceId: userId.toString(),
        details: { 
          username: updatedUser.username,
          role: updatedUser.role,
          fieldsUpdated: Object.keys(updateData)
        }
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("already exists")) {
          return res.status(400).json({ success: false, message: error.message });
        }
      }
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Delete a user (admin only)
  app.delete("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Prevent deleting the main admin account
      const userToDelete = await storage.getUser(userId);
      if (!userToDelete) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      if (userToDelete.username === "admin") {
        return res.status(403).json({ 
          success: false, 
          message: "Cannot delete the main administrator account" 
        });
      }
      
      const success = await storage.deleteUser(userId);
      
      if (!success) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      // Log the action
      await storage.createAuditLog({
        userId: req.session.userId,
        action: 'delete_user',
        resourceType: 'user',
        resourceId: userId.toString(),
        details: { deletedUsername: userToDelete.username }
      });
      
      res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Get audit logs (admin only)
  app.get("/api/admin/audit-logs", isAdmin, async (req, res) => {
    try {
      const { 
        userId, 
        action, 
        resourceType, 
        resourceId, 
        fromDate, 
        toDate 
      } = req.query;
      
      const filters: {
        userId?: number;
        action?: string;
        resourceType?: string;
        resourceId?: string;
        fromDate?: Date;
        toDate?: Date;
      } = {};
      
      if (userId) filters.userId = parseInt(userId as string);
      if (action) filters.action = action as string;
      if (resourceType) filters.resourceType = resourceType as string;
      if (resourceId) filters.resourceId = resourceId as string;
      if (fromDate) filters.fromDate = new Date(fromDate as string);
      if (toDate) filters.toDate = new Date(toDate as string);
      
      const logs = await storage.getAuditLogs(filters);
      res.status(200).json(logs);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  // SEO Related Endpoints
  
  // Generate and serve sitemap.xml
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const sitemapXml = await generateSitemap();
      
      res.header("Content-Type", "application/xml");
      res.send(sitemapXml);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });
  
  // Generate and serve robots.txt
  app.get("/robots.txt", (_req, res) => {
    try {
      const baseUrl = process.env.BASE_URL || "https://metanord.eu";
      const robotsTxt = generateRobotsTxt(`${baseUrl}/sitemap.xml`);
      
      res.header("Content-Type", "text/plain");
      res.send(robotsTxt);
    } catch (error) {
      console.error("Error generating robots.txt:", error);
      res.status(500).send("Error generating robots.txt");
    }
  });
  
  // Get SEO settings
  app.get("/api/admin/seo", isAdmin, async (req, res) => {
    try {
      const language = req.query.language as string || 'en';
      const seoSettings = await storage.getAllSeoSettings(language);
      res.status(200).json(seoSettings);
    } catch (error) {
      console.error("Error fetching SEO settings:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error fetching SEO settings" 
      });
    }
  });
  
  // Update SEO settings
  app.post("/api/admin/seo", isAdmin, async (req, res) => {
    try {
      const { 
        pagePath, 
        language, 
        title, 
        metaDescription, 
        ogTitle, 
        ogDescription, 
        ogImage 
      } = req.body;
      
      if (!pagePath || !language) {
        return res.status(400).json({ 
          success: false, 
          message: "Page path and language are required" 
        });
      }
      
      // Save SEO settings
      const updated = await storage.updateSeoSettings({
        pagePath,
        language,
        title,
        metaDescription,
        ogTitle,
        ogDescription,
        ogImage,
      });
      
      // Log the action
      await storage.createAuditLog({
        userId: req.session.userId,
        action: 'update_seo_settings',
        resourceType: 'seo',
        resourceId: pagePath,
        details: { 
          pagePath,
          language,
          timestamp: new Date().toISOString() 
        }
      });
      
      if (updated) {
        res.status(200).json({ 
          success: true, 
          message: `SEO settings for ${pagePath} updated successfully` 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Error updating SEO settings" 
        });
      }
    } catch (error) {
      console.error("Error updating SEO settings:", error);
      res.status(500).json({ 
        success: false, 
        message: "Server error occurred while updating SEO settings" 
      });
    }
  });
  
  // Admin endpoint to regenerate sitemap and robots.txt files
  app.post("/api/admin/seo/sitemap-generate", isAdmin, async (req, res) => {
    try {
      // Generate and save sitemap.xml
      const sitemapSuccess = await saveSitemapToFile("public/sitemap.xml");
      
      // Generate and save robots.txt
      const baseUrl = process.env.BASE_URL || "https://metanord.eu";
      const robotsSuccess = saveRobotsTxt(`${baseUrl}/sitemap.xml`, "public/robots.txt");
      
      // Log the action
      await storage.createAuditLog({
        userId: req.session.userId,
        action: 'generate_sitemap',
        resourceType: 'seo',
        details: { 
          sitemapSuccess, 
          robotsSuccess,
          timestamp: new Date().toISOString()
        }
      });
      
      if (sitemapSuccess && robotsSuccess) {
        res.status(200).json({ 
          success: true, 
          message: "Sitemap and robots.txt files generated successfully" 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Error generating sitemap or robots.txt",
          sitemapSuccess,
          robotsSuccess
        });
      }
    } catch (error) {
      console.error("Server error generating SEO files:", error);
      res.status(500).json({ 
        success: false, 
        message: "Server error occurred while generating SEO files" 
      });
    }
  });

  // Page Builder API endpoints
  // Page Templates
  app.get("/api/page-builder/templates", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const templates = await storage.getAllPageTemplates(category);
      res.status(200).json(templates);
    } catch (error) {
      console.error("Server error fetching page templates:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  app.get("/api/page-builder/templates/:id", async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      const template = await storage.getPageTemplate(templateId);
      
      if (!template) {
        return res.status(404).json({ success: false, message: "Template not found" });
      }
      
      res.status(200).json(template);
    } catch (error) {
      console.error("Server error fetching page template:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  app.get("/api/page-builder/templates/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const template = await storage.getPageTemplateBySlug(slug);
      
      if (!template) {
        return res.status(404).json({ success: false, message: "Template not found" });
      }
      
      res.status(200).json(template);
    } catch (error) {
      console.error("Server error fetching page template by slug:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  app.post("/api/admin/page-builder/templates", isAdmin, async (req, res) => {
    try {
      const { name, description, category, slug, structure, thumbnail, isArchived } = req.body;
      
      const newTemplate = await storage.createPageTemplate({
        name,
        description, 
        category,
        slug,
        structure: structure || {},
        thumbnail,
        isArchived: isArchived || false
      });
      
      // Create audit log
      await storage.createAuditLog({
        userId: req.session.userId,
        action: "create",
        resourceType: "page_template",
        resourceId: newTemplate.id.toString(),
        details: { templateName: newTemplate.name }
      });
      
      res.status(201).json(newTemplate);
    } catch (error) {
      console.error("Server error creating page template:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  app.put("/api/admin/page-builder/templates/:id", isAdmin, async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      const { name, description, category, slug, structure, thumbnail, isArchived } = req.body;
      
      const updatedTemplate = await storage.updatePageTemplate(templateId, {
        name,
        description,
        category,
        slug,
        structure,
        thumbnail,
        isArchived
      });
      
      if (!updatedTemplate) {
        return res.status(404).json({ success: false, message: "Template not found" });
      }
      
      // Create audit log
      await storage.createAuditLog({
        userId: req.session.userId,
        action: "update",
        resourceType: "page_template",
        resourceId: templateId.toString(),
        details: { templateName: updatedTemplate.name }
      });
      
      res.status(200).json(updatedTemplate);
    } catch (error) {
      console.error("Server error updating page template:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  app.delete("/api/admin/page-builder/templates/:id", isAdmin, async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      
      // First get the template details for the audit log
      const template = await storage.getPageTemplate(templateId);
      if (!template) {
        return res.status(404).json({ success: false, message: "Template not found" });
      }
      
      // Delete the template
      const success = await storage.deletePageTemplate(templateId);
      
      if (!success) {
        return res.status(404).json({ success: false, message: "Template not found or already deleted" });
      }
      
      // Create audit log
      await storage.createAuditLog({
        userId: req.session.userId,
        action: "delete",
        resourceType: "page_template",
        resourceId: templateId.toString(),
        details: { templateName: template.name }
      });
      
      res.status(200).json({ success: true, message: "Template deleted successfully" });
    } catch (error) {
      console.error("Server error deleting page template:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  // Page Components
  app.get("/api/page-builder/components", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const components = await storage.getAllPageComponents(category);
      res.status(200).json(components);
    } catch (error) {
      console.error("Server error fetching page components:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  app.get("/api/page-builder/components/:id", async (req, res) => {
    try {
      const componentId = parseInt(req.params.id);
      const component = await storage.getPageComponent(componentId);
      
      if (!component) {
        return res.status(404).json({ success: false, message: "Component not found" });
      }
      
      res.status(200).json(component);
    } catch (error) {
      console.error("Server error fetching page component:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  app.post("/api/admin/page-builder/components", isAdmin, async (req, res) => {
    try {
      const { name, description, category, structure, thumbnail, isSystem, isArchived } = req.body;
      
      const newComponent = await storage.createPageComponent({
        name,
        description,
        category,
        structure: structure || {},
        thumbnail,
        isSystem: isSystem || false,
        isArchived: isArchived || false
      });
      
      // Create audit log
      await storage.createAuditLog({
        userId: req.session.userId,
        action: "create",
        resourceType: "page_component",
        resourceId: newComponent.id.toString(),
        details: { componentName: newComponent.name }
      });
      
      res.status(201).json(newComponent);
    } catch (error) {
      console.error("Server error creating page component:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  app.put("/api/admin/page-builder/components/:id", isAdmin, async (req, res) => {
    try {
      const componentId = parseInt(req.params.id);
      const { name, description, category, structure, thumbnail, isSystem, isArchived } = req.body;
      
      const updatedComponent = await storage.updatePageComponent(componentId, {
        name, 
        description,
        category,
        structure,
        thumbnail,
        isSystem,
        isArchived
      });
      
      if (!updatedComponent) {
        return res.status(404).json({ success: false, message: "Component not found" });
      }
      
      // Create audit log
      await storage.createAuditLog({
        userId: req.session.userId,
        action: "update",
        resourceType: "page_component",
        resourceId: componentId.toString(),
        details: { componentName: updatedComponent.name }
      });
      
      res.status(200).json(updatedComponent);
    } catch (error) {
      console.error("Server error updating page component:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  app.delete("/api/admin/page-builder/components/:id", isAdmin, async (req, res) => {
    try {
      const componentId = parseInt(req.params.id);
      
      // First get the component details for the audit log
      const component = await storage.getPageComponent(componentId);
      if (!component) {
        return res.status(404).json({ success: false, message: "Component not found" });
      }
      
      // Check if this is a system component that shouldn't be deleted
      if (component.isSystem) {
        return res.status(403).json({ 
          success: false, 
          message: "System components cannot be deleted" 
        });
      }
      
      // Delete the component
      const success = await storage.deletePageComponent(componentId);
      
      if (!success) {
        return res.status(404).json({ success: false, message: "Component not found or already deleted" });
      }
      
      // Create audit log
      await storage.createAuditLog({
        userId: req.session.userId,
        action: "delete",
        resourceType: "page_component",
        resourceId: componentId.toString(),
        details: { componentName: component.name }
      });
      
      res.status(200).json({ success: true, message: "Component deleted successfully" });
    } catch (error) {
      console.error("Server error deleting page component:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  // Custom Pages
  app.get("/api/pages", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const language = req.query.language as string | undefined;
      
      // For public access, only return published pages
      const pages = await storage.getAllCustomPages(status || 'published', language);
      res.status(200).json(pages);
    } catch (error) {
      console.error("Server error fetching custom pages:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  app.get("/api/pages/:id", async (req, res) => {
    try {
      const pageId = parseInt(req.params.id);
      const page = await storage.getCustomPage(pageId);
      
      if (!page) {
        return res.status(404).json({ success: false, message: "Page not found" });
      }
      
      // Only allow admin users to fetch unpublished pages
      if (page.status !== 'published' && !req.session.isAdmin) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
      
      res.status(200).json(page);
    } catch (error) {
      console.error("Server error fetching custom page:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  app.get("/api/pages/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const language = req.query.language as string | undefined;
      
      const page = await storage.getCustomPageBySlug(slug, language);
      
      if (!page) {
        return res.status(404).json({ success: false, message: "Page not found" });
      }
      
      res.status(200).json(page);
    } catch (error) {
      console.error("Server error fetching custom page by slug:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Page Components API
  app.get("/api/admin/page-components", isAuthenticated, async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const components = await storage.getAllPageComponents(category);
      res.status(200).json(components);
    } catch (error) {
      console.error("Error fetching page components:", error);
      res.status(500).json({ success: false, message: "Failed to fetch page components" });
    }
  });
  
  app.get("/api/admin/page-components/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const component = await storage.getPageComponent(id);
      
      if (!component) {
        return res.status(404).json({ success: false, message: "Component not found" });
      }
      
      res.status(200).json(component);
    } catch (error) {
      console.error("Error fetching page component:", error);
      res.status(500).json({ success: false, message: "Failed to fetch page component" });
    }
  });
  
  app.post("/api/admin/page-components", hasRolePermission(['admin', 'editor']), async (req, res) => {
    try {
      const component = await storage.createPageComponent({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category || "general",
        structure: req.body.structure,
        thumbnail: req.body.thumbnail,
        isSystem: req.body.isSystem || false,
        isArchived: req.body.isArchived || false
      });
      
      // Log audit trail
      await storage.createAuditLog({
        action: "create",
        resourceType: "pageComponent",
        resourceId: component.id.toString(),
        userId: req.session.userId,
        details: { name: component.name }
      });
      
      res.status(201).json(component);
    } catch (error) {
      console.error("Error creating page component:", error);
      res.status(500).json({ success: false, message: "Failed to create page component" });
    }
  });
  
  app.put("/api/admin/page-components/:id", hasRolePermission(['admin', 'editor']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const component = await storage.getPageComponent(id);
      
      if (!component) {
        return res.status(404).json({ success: false, message: "Component not found" });
      }
      
      const updatedComponent = await storage.updatePageComponent(id, {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        structure: req.body.structure,
        thumbnail: req.body.thumbnail,
        isSystem: req.body.isSystem,
        isArchived: req.body.isArchived
      });
      
      // Log audit trail
      await storage.createAuditLog({
        action: "update",
        resourceType: "pageComponent",
        resourceId: id.toString(),
        userId: req.session.userId,
        details: { name: updatedComponent?.name }
      });
      
      res.status(200).json(updatedComponent);
    } catch (error) {
      console.error("Error updating page component:", error);
      res.status(500).json({ success: false, message: "Failed to update page component" });
    }
  });
  
  app.delete("/api/admin/page-components/:id", hasRolePermission(['admin']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const component = await storage.getPageComponent(id);
      
      if (!component) {
        return res.status(404).json({ success: false, message: "Component not found" });
      }
      
      if (component.isSystem) {
        return res.status(403).json({ 
          success: false, 
          message: "System components cannot be deleted" 
        });
      }
      
      const success = await storage.deletePageComponent(id);
      
      if (success) {
        // Log audit trail
        await storage.createAuditLog({
          action: "delete",
          resourceType: "pageComponent",
          resourceId: id.toString(),
          userId: req.session.userId,
          details: { name: component.name }
        });
        
        res.status(200).json({ success: true });
      } else {
        res.status(404).json({ success: false, message: "Component not found" });
      }
    } catch (error) {
      console.error("Error deleting page component:", error);
      res.status(500).json({ success: false, message: "Failed to delete page component" });
    }
  });
  
  // Archive/unarchive a page component
  app.put("/api/admin/page-components/:id/archive", hasRolePermission(['admin', 'editor']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID format"
        });
      }
      
      const { archive } = req.body;
      if (typeof archive !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: "Archive status must be a boolean"
        });
      }
      
      const component = await storage.getPageComponent(id);
      if (!component) {
        return res.status(404).json({
          success: false,
          message: "Page component not found"
        });
      }
      
      if (component.isSystem) {
        return res.status(400).json({
          success: false,
          message: "System components cannot be archived"
        });
      }
      
      const updated = await storage.updatePageComponent(id, { isArchived: archive });
      
      if (updated) {
        // Log audit trail
        await storage.createAuditLog({
          userId: req.session.userId,
          action: archive ? 'archive' : 'unarchive',
          resourceType: 'page_component',
          resourceId: id.toString(),
          details: `${archive ? 'Archived' : 'Unarchived'} page component "${component.name}"`
        });
        
        res.status(200).json({
          success: true,
          message: `Page component ${archive ? 'archived' : 'unarchived'} successfully`,
          component: updated
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to update page component"
        });
      }
    } catch (error) {
      console.error(`Error ${req.body.archive ? 'archiving' : 'unarchiving'} page component:`, error);
      res.status(500).json({
        success: false,
        message: `Failed to ${req.body.archive ? 'archive' : 'unarchive'} page component`
      });
    }
  });
  
  // Page Templates API
  app.get("/api/admin/page-templates", isAuthenticated, async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const templates = await storage.getAllPageTemplates(category);
      res.status(200).json(templates);
    } catch (error) {
      console.error("Error fetching page templates:", error);
      res.status(500).json({ success: false, message: "Failed to fetch page templates" });
    }
  });
  
  app.get("/api/admin/page-templates/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getPageTemplate(id);
      
      if (!template) {
        return res.status(404).json({ success: false, message: "Template not found" });
      }
      
      res.status(200).json(template);
    } catch (error) {
      console.error("Error fetching page template:", error);
      res.status(500).json({ success: false, message: "Failed to fetch page template" });
    }
  });
  
  app.post("/api/admin/page-templates", hasRolePermission(['admin', 'editor']), async (req, res) => {
    try {
      const template = await storage.createPageTemplate({
        name: req.body.name,
        description: req.body.description || null,
        category: req.body.category || "general",
        slug: req.body.slug,
        thumbnail: req.body.thumbnail || null,
        structure: req.body.structure,
        isSystem: req.body.isSystem || false
      });
      
      // Log audit trail
      await storage.createAuditLog({
        action: "create",
        resourceType: "pageTemplate",
        resourceId: template.id.toString(),
        userId: req.session.userId,
        details: { name: template.name }
      });
      
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating page template:", error);
      res.status(500).json({ success: false, message: "Failed to create page template" });
    }
  });
  
  app.put("/api/admin/page-templates/:id", hasRolePermission(['admin', 'editor']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getPageTemplate(id);
      
      if (!template) {
        return res.status(404).json({ success: false, message: "Template not found" });
      }
      
      const updatedTemplate = await storage.updatePageTemplate(id, {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        slug: req.body.slug,
        thumbnail: req.body.thumbnail,
        structure: req.body.structure,
        isSystem: req.body.isSystem
      });
      
      // Log audit trail
      await storage.createAuditLog({
        action: "update",
        resourceType: "pageTemplate",
        resourceId: id.toString(),
        userId: req.session.userId,
        details: { name: updatedTemplate?.name }
      });
      
      res.status(200).json(updatedTemplate);
    } catch (error) {
      console.error("Error updating page template:", error);
      res.status(500).json({ success: false, message: "Failed to update page template" });
    }
  });
  
  app.delete("/api/admin/page-templates/:id", hasRolePermission(['admin']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getPageTemplate(id);
      
      if (!template) {
        return res.status(404).json({ success: false, message: "Template not found" });
      }
      
      // Check if it's a system template
      if (template.isSystem) {
        return res.status(403).json({ 
          success: false, 
          message: "System templates cannot be deleted" 
        });
      }
      
      const success = await storage.deletePageTemplate(id);
      
      if (success) {
        // Log audit trail
        await storage.createAuditLog({
          action: "delete",
          resourceType: "pageTemplate",
          resourceId: id.toString(),
          userId: req.session.userId,
          details: { name: template.name }
        });
        
        res.status(200).json({ success: true });
      } else {
        res.status(404).json({ success: false, message: "Template not found" });
      }
    } catch (error) {
      console.error("Error deleting page template:", error);
      res.status(500).json({ success: false, message: "Failed to delete page template" });
    }
  });
  
  // Archive/unarchive a page template
  app.put("/api/admin/page-templates/:id/archive", hasRolePermission(['admin', 'editor']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID format"
        });
      }
      
      const { archive } = req.body;
      if (typeof archive !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: "Archive status must be a boolean"
        });
      }
      
      const template = await storage.getPageTemplate(id);
      if (!template) {
        return res.status(404).json({
          success: false,
          message: "Page template not found"
        });
      }
      
      if (template.isSystem) {
        return res.status(400).json({
          success: false,
          message: "System templates cannot be archived"
        });
      }
      
      const updated = await storage.updatePageTemplate(id, { isArchived: archive });
      
      if (updated) {
        // Log audit trail
        await storage.createAuditLog({
          userId: req.session.userId,
          action: archive ? 'archive' : 'unarchive',
          resourceType: 'page_template',
          resourceId: id.toString(),
          details: `${archive ? 'Archived' : 'Unarchived'} page template "${template.name}"`
        });
        
        res.status(200).json({
          success: true,
          message: `Page template ${archive ? 'archived' : 'unarchived'} successfully`,
          template: updated
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to update page template"
        });
      }
    } catch (error) {
      console.error(`Error ${req.body.archive ? 'archiving' : 'unarchiving'} page template:`, error);
      res.status(500).json({
        success: false,
        message: `Failed to ${req.body.archive ? 'archive' : 'unarchive'} page template`
      });
    }
  });

  app.get("/api/admin/pages", isAuthenticated, async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const language = req.query.language as string | undefined;
      
      // Admin API can fetch all pages including drafts
      const pages = await storage.getAllCustomPages(status, language);
      res.status(200).json(pages);
    } catch (error) {
      console.error("Server error fetching custom pages:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });
  
  // Get a specific page by ID
  app.get("/api/admin/pages/:id", isAuthenticated, async (req, res) => {
    try {
      const pageId = parseInt(req.params.id);
      const page = await storage.getCustomPage(pageId);
      
      if (!page) {
        return res.status(404).json({ success: false, message: "Page not found" });
      }
      
      res.status(200).json(page);
    } catch (error) {
      console.error("Server error fetching custom page:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  app.post("/api/admin/pages", isAdmin, async (req, res) => {
    try {
      const { title, description, slug, language, content, metaTitle, metaDescription, ogImage, status, templateId, author } = req.body;
      
      const newPage = await storage.createCustomPage({
        title,
        description,
        slug,
        language: language || 'en',
        content: content || {},
        metaTitle,
        metaDescription,
        ogImage,
        status: status || 'draft',
        templateId,
        author: author || req.session.userId
      });
      
      // Create audit log
      await storage.createAuditLog({
        userId: req.session.userId,
        action: "create",
        resourceType: "custom_page",
        resourceId: newPage.id.toString(),
        details: { pageTitle: newPage.title, language: newPage.language }
      });
      
      res.status(201).json(newPage);
    } catch (error) {
      console.error("Server error creating custom page:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  app.put("/api/admin/pages/:id", isAdmin, async (req, res) => {
    try {
      const pageId = parseInt(req.params.id);
      const { title, description, slug, language, content, metaTitle, metaDescription, ogImage, status, templateId, author } = req.body;
      
      const updatedPage = await storage.updateCustomPage(pageId, {
        title,
        description,
        slug,
        language,
        content,
        metaTitle,
        metaDescription,
        ogImage,
        status,
        templateId,
        author
      });
      
      if (!updatedPage) {
        return res.status(404).json({ success: false, message: "Page not found" });
      }
      
      // Create audit log
      await storage.createAuditLog({
        userId: req.session.userId,
        action: "update",
        resourceType: "custom_page",
        resourceId: pageId.toString(),
        details: { pageTitle: updatedPage.title, language: updatedPage.language }
      });
      
      res.status(200).json(updatedPage);
    } catch (error) {
      console.error("Server error updating custom page:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  app.post("/api/admin/pages/:id/publish", isAdmin, async (req, res) => {
    try {
      const pageId = parseInt(req.params.id);
      
      const publishedPage = await storage.publishCustomPage(pageId);
      
      if (!publishedPage) {
        return res.status(404).json({ success: false, message: "Page not found" });
      }
      
      // Create audit log
      await storage.createAuditLog({
        userId: req.session.userId,
        action: "publish",
        resourceType: "custom_page",
        resourceId: pageId.toString(),
        details: { pageTitle: publishedPage.title, language: publishedPage.language }
      });
      
      res.status(200).json(publishedPage);
    } catch (error) {
      console.error("Server error publishing custom page:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  app.post("/api/admin/pages/:id/unpublish", isAdmin, async (req, res) => {
    try {
      const pageId = parseInt(req.params.id);
      
      const unpublishedPage = await storage.unpublishCustomPage(pageId);
      
      if (!unpublishedPage) {
        return res.status(404).json({ success: false, message: "Page not found" });
      }
      
      // Create audit log
      await storage.createAuditLog({
        userId: req.session.userId,
        action: "unpublish",
        resourceType: "custom_page",
        resourceId: pageId.toString(),
        details: { pageTitle: unpublishedPage.title, language: unpublishedPage.language }
      });
      
      res.status(200).json(unpublishedPage);
    } catch (error) {
      console.error("Server error unpublishing custom page:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  app.delete("/api/admin/pages/:id", isAdmin, async (req, res) => {
    try {
      const pageId = parseInt(req.params.id);
      
      // First get the page details for the audit log
      const page = await storage.getCustomPage(pageId);
      if (!page) {
        return res.status(404).json({ success: false, message: "Page not found" });
      }
      
      // Delete the page
      const success = await storage.deleteCustomPage(pageId);
      
      if (!success) {
        return res.status(404).json({ success: false, message: "Page not found or already deleted" });
      }
      
      // Create audit log
      await storage.createAuditLog({
        userId: req.session.userId,
        action: "delete",
        resourceType: "custom_page",
        resourceId: pageId.toString(),
        details: { pageTitle: page.title, language: page.language }
      });
      
      res.status(200).json({ success: true, message: "Page deleted successfully" });
    } catch (error) {
      console.error("Server error deleting custom page:", error);
      res.status(500).json({ success: false, message: "Server error occurred" });
    }
  });

  // Document Management API Routes
  app.get('/api/documents', async (req, res) => {
    try {
      const { language, documentType, productCategory, categoryId } = req.query;
      
      const documents = await storage.getAllDocuments(
        language as string, 
        documentType as string, 
        productCategory as string,
        categoryId ? parseInt(categoryId as string) : undefined
      );
      
      res.json({ success: true, documents });
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch documents' });
    }
  });
  
  // Public Document Categories API Route
  app.get('/api/documents/categories', async (req, res) => {
    try {
      const categories = await storage.getAllDocumentCategories();
      res.json({ success: true, categories });
    } catch (error) {
      console.error('Error fetching document categories:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch document categories' });
    }
  });

  // Document Categories API Routes (Admin)
  app.get('/api/admin/documents/categories', isAuthenticated, async (req, res) => {
    try {
      const categories = await storage.getAllDocumentCategories();
      res.json({ success: true, categories });
    } catch (error) {
      console.error('Error fetching document categories:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch document categories' });
    }
  });
  
  app.get('/api/admin/documents/categories/:id', isAuthenticated, async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
        return res.status(400).json({ success: false, message: 'Invalid category ID' });
      }
      
      const category = await storage.getDocumentCategory(categoryId);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      
      res.json({ success: true, category });
    } catch (error) {
      console.error('Error fetching document category:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch document category' });
    }
  });
  
  app.post('/api/admin/documents/categories', isAuthenticated, async (req, res) => {
    try {
      const { name, description, documentType, slug, icon, color, isDefault } = req.body;
      
      if (!name || !documentType) {
        return res.status(400).json({ success: false, message: 'Name and document type are required' });
      }
      
      // Generate slug if not provided
      const slugToUse = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const newCategory = await storage.createDocumentCategory({
        name,
        description,
        documentType,
        slug: slugToUse,
        icon: icon || 'file-text',
        color: color || '#4f46e5',
        isDefault: isDefault || false
      });
      
      res.status(201).json({ success: true, category: newCategory });
    } catch (error) {
      console.error('Error creating document category:', error);
      res.status(500).json({ success: false, message: 'Failed to create document category' });
    }
  });
  
  app.put('/api/admin/documents/categories/:id', isAuthenticated, async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
        return res.status(400).json({ success: false, message: 'Invalid category ID' });
      }
      
      const { name, description, documentType, slug, icon, color, isDefault } = req.body;
      
      const existingCategory = await storage.getDocumentCategory(categoryId);
      if (!existingCategory) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      
      const updatedCategory = await storage.updateDocumentCategory(categoryId, {
        name,
        description,
        documentType,
        slug,
        icon,
        color,
        isDefault
      });
      
      res.json({ success: true, category: updatedCategory });
    } catch (error) {
      console.error('Error updating document category:', error);
      res.status(500).json({ success: false, message: 'Failed to update document category' });
    }
  });
  
  app.delete('/api/admin/documents/categories/:id', isAuthenticated, async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
        return res.status(400).json({ success: false, message: 'Invalid category ID' });
      }
      
      // Check if the category exists
      const existingCategory = await storage.getDocumentCategory(categoryId);
      if (!existingCategory) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      
      // Delete the category
      await storage.deleteDocumentCategory(categoryId);
      
      res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting document category:', error);
      res.status(500).json({ success: false, message: 'Failed to delete document category' });
    }
  });
  
  app.get('/api/documents/:id', async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      if (isNaN(documentId)) {
        return res.status(400).json({ success: false, message: 'Invalid document ID' });
      }
      
      const document = await storage.getDocument(documentId);
      if (!document) {
        return res.status(404).json({ success: false, message: 'Document not found' });
      }
      
      res.json({ success: true, document });
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch document' });
    }
  });
  
  app.post('/api/documents', isAuthenticated, async (req, res) => {
    try {
      if (!req.files || !req.files.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
      
      const fileData = req.files.file as UploadedFile;
      
      // Create the documents directory if it doesn't exist
      const documentsDir = path.join('public', 'documents');
      if (!fs.existsSync(documentsDir)) {
        fs.mkdirSync(documentsDir, { recursive: true });
      }
      
      // Save the file
      const fileName = `${Date.now()}-${fileData.name}`;
      const filePath = path.join(documentsDir, fileName);
      await fileData.mv(filePath);
      
      // Parse JSON arrays if they're strings
      let productCategories = req.body.productCategories;
      let tags = req.body.tags;
      
      if (typeof productCategories === 'string') {
        try {
          productCategories = JSON.parse(productCategories);
        } catch (e) {
          productCategories = null;
        }
      }
      
      if (typeof tags === 'string') {
        try {
          tags = JSON.parse(tags);
        } catch (e) {
          tags = [];
        }
      }
      
      // Prepare document data
      const documentData = {
        title: req.body.title,
        description: req.body.description || null,
        filePath: `/documents/${fileName}`,
        fileType: fileData.mimetype,
        fileSize: fileData.size,
        documentType: req.body.documentType,
        language: req.body.language || 'en',
        productCategories,
        tags,
        isPublic: req.body.isPublic === 'true' || req.body.isPublic === true,
        createdBy: req.session.userId
      };
      
      // Validate the document data
      const validationResult = insertDocumentSchema.safeParse(documentData);
      if (!validationResult.success) {
        console.error('Validation error:', validationResult.error);
        // Delete the uploaded file if validation fails
        fs.unlinkSync(filePath);
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid document data', 
          errors: fromZodError(validationResult.error).message 
        });
      }
      
      const newDocument = await storage.createDocument(validationResult.data);
      
      // Log the document creation
      await storage.createAuditLog({
        action: 'create',
        resourceType: 'document',
        resourceId: String(newDocument.id),
        userId: req.session.userId,
        details: { title: newDocument.title }
      });
      
      res.status(201).json({ success: true, document: newDocument });
    } catch (error) {
      console.error('Error creating document:', error);
      res.status(500).json({ success: false, message: 'Failed to create document' });
    }
  });
  
  app.patch('/api/documents/:id', isAuthenticated, async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      if (isNaN(documentId)) {
        return res.status(400).json({ success: false, message: 'Invalid document ID' });
      }
      
      const existingDocument = await storage.getDocument(documentId);
      if (!existingDocument) {
        return res.status(404).json({ success: false, message: 'Document not found' });
      }
      
      // Build update data
      const updateData: Partial<InsertDocument> = {};
      
      // If a new file was uploaded, update file-related fields
      if (req.files && req.files.file) {
        const fileData = req.files.file as UploadedFile;
        
        // Create the documents directory if it doesn't exist
        const documentsDir = path.join('public', 'documents');
        if (!fs.existsSync(documentsDir)) {
          fs.mkdirSync(documentsDir, { recursive: true });
        }
        
        // Save the file
        const fileName = `${Date.now()}-${fileData.name}`;
        const filePath = path.join(documentsDir, fileName);
        await fileData.mv(filePath);
        
        // Delete old file if it exists and is in the documents directory
        if (existingDocument.filePath && existingDocument.filePath.startsWith('/documents/')) {
          const oldFilePath = path.join('public', existingDocument.filePath);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        
        updateData.filePath = `/documents/${fileName}`;
        updateData.fileType = fileData.mimetype;
        updateData.fileSize = fileData.size;
      }
      
      // Parse JSON arrays if they're strings
      if (req.body.productCategories) {
        try {
          updateData.productCategories = typeof req.body.productCategories === 'string' 
            ? JSON.parse(req.body.productCategories) 
            : req.body.productCategories;
        } catch (e) {
          // Ignore parsing error
        }
      }
      
      if (req.body.tags) {
        try {
          updateData.tags = typeof req.body.tags === 'string'
            ? JSON.parse(req.body.tags)
            : req.body.tags;
        } catch (e) {
          // Ignore parsing error
        }
      }
      
      // Update other fields if provided
      if (req.body.title) updateData.title = req.body.title;
      if (req.body.description !== undefined) updateData.description = req.body.description;
      if (req.body.documentType) updateData.documentType = req.body.documentType;
      if (req.body.language) updateData.language = req.body.language;
      if (req.body.isPublic !== undefined) {
        updateData.isPublic = req.body.isPublic === 'true' || req.body.isPublic === true;
      }
      if (req.body.thumbnail !== undefined) updateData.thumbnail = req.body.thumbnail;
      
      const updatedDocument = await storage.updateDocument(documentId, updateData);
      
      // Log the document update
      await storage.createAuditLog({
        action: 'update',
        resourceType: 'document',
        resourceId: String(documentId),
        userId: req.session.userId,
        details: { title: updatedDocument?.title }
      });
      
      res.json({ success: true, document: updatedDocument });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({ success: false, message: 'Failed to update document' });
    }
  });
  
  app.delete('/api/documents/:id', isAuthenticated, async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      if (isNaN(documentId)) {
        return res.status(400).json({ success: false, message: 'Invalid document ID' });
      }
      
      const document = await storage.getDocument(documentId);
      if (!document) {
        return res.status(404).json({ success: false, message: 'Document not found' });
      }
      
      // Delete the document file from the file system if it exists and is in the documents directory
      if (document.filePath && document.filePath.startsWith('/documents/')) {
        const filePath = path.join('public', document.filePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      const success = await storage.deleteDocument(documentId);
      
      if (success) {
        // Log the document deletion
        await storage.createAuditLog({
          action: 'delete',
          resourceType: 'document',
          resourceId: String(documentId),
          userId: req.session.userId,
          details: { title: document.title }
        });
        
        res.json({ success: true });
      } else {
        res.status(500).json({ success: false, message: 'Failed to delete document' });
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      res.status(500).json({ success: false, message: 'Failed to delete document' });
    }
  });
  
  app.get('/api/documents/:id/download', async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      if (isNaN(documentId)) {
        return res.status(400).json({ success: false, message: 'Invalid document ID' });
      }
      
      const document = await storage.getDocument(documentId);
      if (!document) {
        return res.status(404).json({ success: false, message: 'Document not found' });
      }
      
      // Check if document is public or user is authenticated
      if (!document.isPublic && !req.isAuthenticated()) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      
      // Increment download count
      await storage.incrementDownloadCount(documentId);
      
      // Send the file
      if (document.filePath.startsWith('/documents/')) {
        const filePath = path.join('public', document.filePath);
        if (fs.existsSync(filePath)) {
          return res.download(filePath, document.title + path.extname(document.filePath));
        }
      }
      
      res.status(404).json({ success: false, message: 'Document file not found' });
    } catch (error) {
      console.error('Error downloading document:', error);
      res.status(500).json({ success: false, message: 'Failed to download document' });
    }
  });

  // Document Category Routes
  app.get('/api/document-categories', async (req, res) => {
    try {
      const categories = await storage.getAllDocumentCategories();
      res.json({ success: true, data: categories });
    } catch (error) {
      console.error('Error fetching document categories:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch document categories' });
    }
  });

  app.get('/api/document-categories/:id', async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
        return res.status(400).json({ success: false, message: 'Invalid category ID' });
      }
      
      const category = await storage.getDocumentCategory(categoryId);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      
      res.json({ success: true, data: category });
    } catch (error) {
      console.error('Error fetching document category:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch document category' });
    }
  });

  app.post('/api/document-categories', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const categoryData = insertDocumentCategorySchema.parse(req.body);
      const newCategory = await storage.createDocumentCategory(categoryData);
      
      await createAuditLog({
        action: 'create',
        resourceType: 'documentCategory',
        resourceId: String(newCategory.id),
        userId: req.session.userId,
        details: { name: newCategory.name }
      });
      
      res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
      console.error('Error creating document category:', error);
      if (error.errors) {
        return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ success: false, message: 'Failed to create document category' });
    }
  });

  app.patch('/api/document-categories/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
        return res.status(400).json({ success: false, message: 'Invalid category ID' });
      }
      
      const category = await storage.getDocumentCategory(categoryId);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      
      const updateData = req.body;
      const updatedCategory = await storage.updateDocumentCategory(categoryId, updateData);
      
      await createAuditLog({
        action: 'update',
        resourceType: 'documentCategory',
        resourceId: String(categoryId),
        userId: req.session.userId,
        details: { name: updatedCategory.name }
      });
      
      res.json({ success: true, data: updatedCategory });
    } catch (error) {
      console.error('Error updating document category:', error);
      if (error.errors) {
        return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ success: false, message: 'Failed to update document category' });
    }
  });

  app.delete('/api/document-categories/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
        return res.status(400).json({ success: false, message: 'Invalid category ID' });
      }
      
      const category = await storage.getDocumentCategory(categoryId);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      
      const result = await storage.deleteDocumentCategory(categoryId);
      
      if (result) {
        await createAuditLog({
          action: 'delete',
          resourceType: 'documentCategory',
          resourceId: String(categoryId),
          userId: req.session.userId,
          details: { name: category.name }
        });
        
        res.json({ success: true, message: 'Document category deleted successfully' });
      } else {
        res.status(500).json({ success: false, message: 'Failed to delete document category' });
      }
    } catch (error) {
      console.error('Error deleting document category:', error);
      res.status(500).json({ success: false, message: 'Failed to delete document category' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}