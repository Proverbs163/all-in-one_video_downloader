import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  downloads: defineTable({
    userId: v.optional(v.id("users")),
    url: v.string(),
    platform: v.string(),
    title: v.string(),
    thumbnail: v.optional(v.string()),
    format: v.string(),
    quality: v.optional(v.string()),
    status: v.string(), // "pending", "processing", "completed", "failed"
    downloadUrl: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    duration: v.optional(v.string()),
  }).index("by_user", ["userId"]),
  
  settings: defineTable({
    userId: v.id("users"),
    theme: v.string(), // "light", "dark", "system"
    language: v.string(),
    autoQuality: v.boolean(),
    notifications: v.boolean(),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
