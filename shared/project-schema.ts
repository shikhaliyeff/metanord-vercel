import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import {
  integer,
  pgTable,
  text,
  serial,
  boolean,
  timestamp,
  json,
} from "drizzle-orm/pg-core";

export type ProjectCategory = "all" | "infrastructure" | "commercial" | "industrial" | "residential";

// Define the Project table
export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  year: integer("year").notNull(),
  location: text("location").notNull(),
  language: text("language").notNull().default("en"),
  category: text("category").notNull().default("infrastructure"),
  images: json("images").default([]),
  featuredImage: text("featured_image"),
  tags: json("tags").default([]),
  productTags: json("product_tags").default([]),
  brochureUrl: text("brochure_url"),
  relatedProducts: json("related_products").default([]),
  published: boolean("published").default(true),
  featured: boolean("featured").default(false),
});

// Create Zod schema for insert
export const insertProjectSchema = createInsertSchema(projectsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Define types
export type Project = typeof projectsTable.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

// Define interfaces for multilingual content
export interface MultilangProject {
  id: string;
  title: Record<string, string>;
  shortDescription: Record<string, string>;
  description: Record<string, string>;
  location: Record<string, string>;
  tags: Record<string, string[]>;
  year: number;
  category: ProjectCategory;
  images: string[];
  featuredImage: string;
  brochureUrl?: string;
  relatedProducts?: string[];
  published: boolean;
  featured: boolean;
}