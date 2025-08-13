import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserSettings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    
    if (!settings) {
      // Return default settings
      return {
        theme: "system",
        language: "en",
        autoQuality: true,
        notifications: true,
      };
    }
    
    return settings;
  },
});

export const updateSettings = mutation({
  args: {
    theme: v.optional(v.string()),
    language: v.optional(v.string()),
    autoQuality: v.optional(v.boolean()),
    notifications: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const existingSettings = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    
    if (existingSettings) {
      await ctx.db.patch(existingSettings._id, args);
    } else {
      await ctx.db.insert("settings", {
        userId,
        theme: args.theme || "system",
        language: args.language || "en",
        autoQuality: args.autoQuality ?? true,
        notifications: args.notifications ?? true,
      });
    }
  },
});
