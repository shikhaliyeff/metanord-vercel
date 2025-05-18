import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
  role: text("role").default("viewer"), // 'admin', 'editor', or 'viewer'
  fullName: text("full_name"),
  email: text("email"),
  lastLogin: timestamp("last_login"),
});

export const contactInquiries = pgTable("contact_inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  subject: text("subject"),
  inquiryType: text("inquiry_type"),
  message: text("message").notNull(),
  status: text("status").default("new"), // new, in progress, resolved, archived
  archived: boolean("archived").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quoteRequests = pgTable("quote_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  phone: text("phone"),
  productId: text("product_id"),
  productName: text("product_name").notNull(),
  quantity: text("quantity"),
  comment: text("comment"),
  status: text("status").default("new"), // new, in progress, quoted, completed, closed
  archived: boolean("archived").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contentVersions = pgTable("content_versions", {
  id: serial("id").primaryKey(),
  contentType: text("content_type").notNull(), // e.g. 'hero', 'product', 'site_content'
  contentId: text("content_id"), // Optional reference to specific content item
  version: integer("version").notNull(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by"), // user id who made the change
});

export const seoSettings = pgTable("seo_settings", {
  id: serial("id").primaryKey(),
  pagePath: text("page_path").notNull(), // e.g. '/about', '/products'
  title: text("title"),
  metaDescription: text("meta_description"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImage: text("og_image"),
  language: text("language").notNull().default("en"),
});

export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  section: text("section").notNull(),
  key: text("key").notNull(),
  value: text("value").notNull(),
  language: text("language").notNull().default("en"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  productId: text("product_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  features: text("features").array(),
  applications: text("applications").array(),
  specifications: jsonb("specifications"),
  status: text("status").default("in stock"),
  language: text("language").notNull().default("en"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
  role: true,
  fullName: true,
  email: true,
});

export const loginUserSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
});

export const insertContactInquirySchema = createInsertSchema(contactInquiries).pick({
  name: true,
  email: true,
  company: true,
  subject: true,
  inquiryType: true,
  message: true,
  status: true,
  archived: true,
});

export const insertQuoteRequestSchema = createInsertSchema(quoteRequests).pick({
  name: true,
  email: true,
  company: true,
  phone: true,
  productId: true,
  productName: true,
  quantity: true,
  comment: true,
  status: true,
  archived: true,
});

export const insertContentVersionSchema = createInsertSchema(contentVersions).pick({
  contentType: true,
  contentId: true,
  version: true,
  data: true,
  createdBy: true,
});

export const insertSeoSettingSchema = createInsertSchema(seoSettings).pick({
  pagePath: true,
  title: true,
  metaDescription: true,
  ogTitle: true,
  ogDescription: true,
  ogImage: true,
  language: true,
});

export const insertSiteContentSchema = createInsertSchema(siteContent).pick({
  section: true,
  key: true,
  value: true,
  language: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  productId: true,
  title: true,
  description: true,
  image: true,
  category: true,
  features: true,
  applications: true,
  specifications: true,
  status: true,
  language: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginUser = z.infer<typeof loginUserSchema>;

export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type ContactInquiry = typeof contactInquiries.$inferSelect;

export type InsertQuoteRequest = z.infer<typeof insertQuoteRequestSchema>;
export type QuoteRequest = typeof quoteRequests.$inferSelect;

export type InsertContentVersion = z.infer<typeof insertContentVersionSchema>;
export type ContentVersion = typeof contentVersions.$inferSelect;

export type InsertSeoSetting = z.infer<typeof insertSeoSettingSchema>;
export type SeoSetting = typeof seoSettings.$inferSelect;

export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type SiteContent = typeof siteContent.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// CRM Module
export const crmClients = pgTable("crm_clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  country: text("country"),
  inquiryType: text("inquiry_type").notNull(), // 'contact' or 'quote'
  originalInquiryId: integer("original_inquiry_id"), // ID of original contact or quote request
  productRefs: text("product_refs").array(), // Array of referenced product IDs
  leadStatus: text("lead_status").notNull().default("New"),
  nextFollowup: timestamp("next_followup"),
  nextAction: text("next_action"),
  internalNotes: text("internal_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const crmActivityLogs = pgTable("crm_activity_logs", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  activityType: text("activity_type").notNull(), // e.g., 'status_change', 'note_added', 'email_sent'
  description: text("description").notNull(),
  data: jsonb("data"), // Additional data related to the activity
  performedBy: integer("performed_by"), // User ID who performed the action
  createdAt: timestamp("created_at").defaultNow(),
});

export const crmEmailLogs = pgTable("crm_email_logs", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
  status: text("status").notNull(), // 'sent', 'failed', 'pending'
  sentBy: integer("sent_by"), // User ID who sent the email
});

export const crmEmailTemplates = pgTable("crm_email_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCrmClientSchema = createInsertSchema(crmClients).pick({
  name: true,
  email: true,
  phone: true,
  company: true,
  country: true,
  inquiryType: true,
  originalInquiryId: true,
  productRefs: true,
  leadStatus: true,
  nextFollowup: true,
  nextAction: true,
  internalNotes: true,
});

export const insertCrmActivityLogSchema = createInsertSchema(crmActivityLogs).pick({
  clientId: true,
  activityType: true,
  description: true,
  data: true,
  performedBy: true,
});

export const insertCrmEmailLogSchema = createInsertSchema(crmEmailLogs).pick({
  clientId: true,
  subject: true,
  content: true,
  status: true,
  sentBy: true,
});

export const insertCrmEmailTemplateSchema = createInsertSchema(crmEmailTemplates).pick({
  name: true,
  subject: true,
  content: true,
  createdBy: true,
});

export type InsertCrmClient = z.infer<typeof insertCrmClientSchema>;
export type CrmClient = typeof crmClients.$inferSelect;

export type InsertCrmActivityLog = z.infer<typeof insertCrmActivityLogSchema>;
export type CrmActivityLog = typeof crmActivityLogs.$inferSelect;

export type InsertCrmEmailLog = z.infer<typeof insertCrmEmailLogSchema>;
export type CrmEmailLog = typeof crmEmailLogs.$inferSelect;

export type InsertCrmEmailTemplate = z.infer<typeof insertCrmEmailTemplateSchema>;
export type CrmEmailTemplate = typeof crmEmailTemplates.$inferSelect;

// Offers & Audit Trail tables
export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  offerNumber: text("offer_number").notNull().unique(),
  clientId: integer("client_id").notNull(),
  items: jsonb("items").notNull(), // Array of OfferItem objects
  totalAmount: text("total_amount"),
  currency: text("currency").default("EUR"),
  notes: text("notes"),
  terms: text("terms"),
  paymentTerms: text("payment_terms"),
  date: timestamp("date").defaultNow(),
  expiryDate: timestamp("expiry_date"),
  status: text("status").notNull().default("draft"), // draft, sent, accepted, declined
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"), 
  action: text("action").notNull(), // e.g., 'content_edit', 'offer_create', 'email_send'
  resourceType: text("resource_type").notNull(), // e.g., 'product', 'client', 'offer'
  resourceId: text("resource_id"), // ID of the affected resource
  details: jsonb("details"), // Additional details about the action
  timestamp: timestamp("timestamp").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // e.g., 'info', 'warning', 'success'
  read: boolean("read").default(false),
  resourceType: text("resource_type"), // e.g., 'client', 'offer', 'inquiry'
  resourceId: text("resource_id"), // ID of the related resource
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOfferSchema = createInsertSchema(offers).pick({
  offerNumber: true,
  clientId: true,
  items: true,
  totalAmount: true,
  currency: true,
  notes: true,
  terms: true,
  paymentTerms: true,
  date: true,
  expiryDate: true,
  status: true,
  createdBy: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).pick({
  userId: true,
  action: true,
  resourceType: true,
  resourceId: true,
  details: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  title: true,
  message: true,
  type: true,
  resourceType: true,
  resourceId: true,
});

export type InsertOffer = z.infer<typeof insertOfferSchema>;
export type Offer = typeof offers.$inferSelect;

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// Define the OfferItem structure for use in offers
export interface OfferItem {
  productName: string;
  specifications?: string;
  quantity: number;
  price?: number | null;
  total?: number | null;
}

// Documents Module
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  filePath: text("file_path").notNull(),
  fileType: text("file_type").notNull(), // pdf, docx, jpg, png, etc.
  fileSize: integer("file_size"), // in bytes
  thumbnail: text("thumbnail"), // path to thumbnail image
  documentType: text("document_type").notNull(), // catalog, datasheet, certificate, etc.
  documentCategoryId: integer("document_category_id"), // Reference to document category
  productCategories: text("product_categories").array(), // Array of product categories this document is related to
  tags: text("tags").array(), // Additional tags for filtering
  language: text("language").notNull().default("en"),
  downloads: integer("downloads").default(0), // Counter for downloads
  isPublic: boolean("is_public").default(true), // Whether the document is publicly accessible
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  title: true,
  description: true,
  filePath: true,
  fileType: true,
  fileSize: true,
  thumbnail: true,
  documentType: true,
  documentCategoryId: true,
  productCategories: true,
  tags: true,
  language: true,
  isPublic: true,
  createdBy: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

// Featured Projects (Case Studies) module
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(), // URL-friendly identifier
  title: text("title").notNull(),
  year: integer("year").notNull(),
  location: text("location").notNull(), // City, Country
  summary: text("summary").notNull(), // Short summary
  description: text("description").notNull(), // Full description
  productTags: text("product_tags").array(), // Array of product categories or specific product IDs
  images: jsonb("images").notNull(), // Array of image URLs or paths
  published: boolean("published").default(false),
  language: text("language").notNull().default("en"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  slug: true,
  title: true,
  year: true,
  location: true,
  summary: true,
  description: true,
  productTags: true,
  images: true,
  published: true,
  language: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Product-Document Relationships
export const productDocuments = pgTable("product_documents", {
  id: serial("id").primaryKey(),
  productId: text("product_id").notNull(), // References the productId in products table
  documentId: integer("document_id").notNull(), // References the id in documents table
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductDocumentSchema = createInsertSchema(productDocuments).pick({
  productId: true,
  documentId: true,
});

export type InsertProductDocument = z.infer<typeof insertProductDocumentSchema>;
export type ProductDocument = typeof productDocuments.$inferSelect;

// Document Categories
export const documentCategories = pgTable("document_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  documentType: text("document_type").notNull(), // certificate, datasheet, catalog, manual, etc.
  icon: text("icon").default("file-text"), // Lucide icon name
  color: text("color").default("#4f46e5"), // Brand color for visual distinction
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDocumentCategorySchema = createInsertSchema(documentCategories).pick({
  name: true,
  description: true,
  slug: true,
  documentType: true,
  icon: true,
  color: true,
  isDefault: true,
});

export type InsertDocumentCategory = z.infer<typeof insertDocumentCategorySchema>;
export type DocumentCategory = typeof documentCategories.$inferSelect;

// Page Builder Components

export const pageTemplates = pgTable("page_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  structure: jsonb("structure").notNull().default({}), // JSON structure defining the template layout
  category: text("category").default("general"), // e.g., 'landing', 'product', 'contact'
  isArchived: boolean("is_archived").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pageComponents = pgTable("page_components", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  structure: jsonb("structure").notNull().default({}), // JSON structure containing the component definition
  category: text("category").default("general"), // For grouping in the UI
  isSystem: boolean("is_system").default(false), // System components that can't be deleted
  isArchived: boolean("is_archived").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const customPages = pgTable("custom_pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  content: jsonb("content").notNull().default({}), // JSON structure containing the page builder content
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  ogImage: text("og_image"),
  status: text("status").default("draft"), // draft, published, archived
  templateId: integer("template_id"),
  language: text("language").default("en"),
  author: integer("author"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  publishedAt: timestamp("published_at"),
});

export const insertPageTemplateSchema = createInsertSchema(pageTemplates).extend({
  structure: z.record(z.string(), z.any()),
}).pick({
  name: true,
  slug: true,
  description: true,
  thumbnail: true,
  structure: true,
  category: true,
  isArchived: true,
});

export const insertPageComponentSchema = createInsertSchema(pageComponents).extend({
  structure: z.record(z.string(), z.any()),
}).pick({
  name: true,
  description: true,
  thumbnail: true,
  structure: true,
  category: true,
  isSystem: true,
  isArchived: true,
});

export const insertCustomPageSchema = createInsertSchema(customPages).pick({
  title: true,
  slug: true,
  description: true,
  content: true,
  metaTitle: true,
  metaDescription: true,
  ogImage: true,
  status: true,
  templateId: true,
  language: true,
  author: true,
});

export type InsertPageTemplate = z.infer<typeof insertPageTemplateSchema>;
export type PageTemplate = typeof pageTemplates.$inferSelect;

export type InsertPageComponent = z.infer<typeof insertPageComponentSchema>;
export type DbPageComponent = typeof pageComponents.$inferSelect;

// Interface for use in the Page Builder
export interface PageComponent {
  id: string;
  name: string;
  type: string;
  parentSectionId?: string;
  content?: {
    text?: string;
    size?: string;
    alignment?: string;
    color?: string;
    fontWeight?: string;
    src?: string;
    alt?: string;
    caption?: string;
    width?: string;
    height?: string;
    borderRadius?: string;
    items?: string[];
    url?: string;
    openInNewTab?: boolean;
    margin?: string;
    type?: string;
    // Map component specific properties
    address?: string;
    zoom?: number;
    mapType?: string;
    showMarker?: boolean;
    // General component properties
    [key: string]: any;
  };
}

export type InsertCustomPage = z.infer<typeof insertCustomPageSchema>;
export type CustomPage = typeof customPages.$inferSelect;

// Page Builder section and component interface definitions
export interface PageSection {
  id: string;
  title: string;
  type?: string;
  components: PageComponent[];
  content?: {
    padding?: string;
    background?: string;
    maxWidth?: string;
    fullWidth?: boolean;
    cssClasses?: string;
    [key: string]: any;
  };
  settings?: {
    backgroundColor?: string;
    paddingTop?: string;
    paddingBottom?: string;
    maxWidth?: string;
    fullWidth?: boolean;
    id?: string;
    cssClasses?: string;
    [key: string]: any;
  };
}

// Page Version schema to support version history
export const pageVersions = pgTable("page_versions", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").notNull(), // References the id in customPages table
  name: text("name").notNull(), // User-defined version name
  content: jsonb("content").notNull().default({}), // Saved page content for this version
  createdBy: integer("created_by"), // User who created this version
  isActive: boolean("is_active").default(false), // Whether this is the currently active version
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPageVersionSchema = createInsertSchema(pageVersions).pick({
  pageId: true,
  name: true,
  content: true,
  createdBy: true,
  isActive: true,
});

export type InsertPageVersion = z.infer<typeof insertPageVersionSchema>;
export type PageVersion = typeof pageVersions.$inferSelect;
