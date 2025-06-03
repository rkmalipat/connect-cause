import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  userType: text("user_type").notNull(), // 'donor', 'beneficiary', 'initiative_runner'
  fullName: text("full_name").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  location: text("location"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const initiatives = pgTable("initiatives", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'education', 'skill_development', 'community', 'healthcare'
  goalAmount: integer("goal_amount").notNull(),
  raisedAmount: integer("raised_amount").default(0),
  supportersCount: integer("supporters_count").default(0),
  coverImage: text("cover_image"),
  runnerId: integer("runner_id").notNull(),
  status: text("status").default("active"), // 'active', 'completed', 'paused'
  createdAt: timestamp("created_at").defaultNow(),
});

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  mediaUrl: text("media_url"),
  mediaType: text("media_type"), // 'image', 'video'
  authorId: integer("author_id").notNull(),
  initiativeId: integer("initiative_id"),
  heartsCount: integer("hearts_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  content: text("content").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  donorId: integer("donor_id").notNull(),
  initiativeId: integer("initiative_id").notNull(),
  amount: integer("amount").notNull(),
  message: text("message"),
  anonymous: boolean("anonymous").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const supports = pgTable("supports", {
  id: serial("id").primaryKey(),
  donorId: integer("donor_id").notNull(),
  beneficiaryId: integer("beneficiary_id").notNull(),
  initiativeId: integer("initiative_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertInitiativeSchema = createInsertSchema(initiatives).omit({
  id: true,
  raisedAmount: true,
  supportersCount: true,
  createdAt: true,
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  heartsCount: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  read: true,
  createdAt: true,
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
});

export const insertSupportSchema = createInsertSchema(supports).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Initiative = typeof initiatives.$inferSelect;
export type InsertInitiative = z.infer<typeof insertInitiativeSchema>;
export type Story = typeof stories.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Support = typeof supports.$inferSelect;
export type InsertSupport = z.infer<typeof insertSupportSchema>;
