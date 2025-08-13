import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const getUserDownloads = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    return await ctx.db
      .query("downloads")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);
  },
});

export const createDownload = mutation({
  args: {
    url: v.string(),
    platform: v.string(),
    format: v.string(),
    quality: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    return await ctx.db.insert("downloads", {
      userId: userId || undefined,
      url: args.url,
      platform: args.platform,
      title: "Processing...",
      format: args.format,
      quality: args.quality,
      status: "pending",
    });
  },
});

export const updateDownload = mutation({
  args: {
    downloadId: v.id("downloads"),
    title: v.optional(v.string()),
    thumbnail: v.optional(v.string()),
    status: v.optional(v.string()),
    downloadUrl: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    duration: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { downloadId, ...updates } = args;
    await ctx.db.patch(downloadId, updates);
  },
});

export const processDownload = action({
  args: {
    downloadId: v.id("downloads"),
    url: v.string(),
    platform: v.string(),
    format: v.string(),
    quality: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // Update status to processing
      await ctx.runMutation(api.downloads.updateDownload, {
        downloadId: args.downloadId,
        status: "processing",
      });

      // Simulate video processing (in real implementation, you'd use actual APIs)
      const videoInfo = await simulateVideoProcessing(args.url, args.platform, args.format, args.quality);
      
      // Update with results
      const updateData: any = {
        downloadId: args.downloadId,
        title: videoInfo.title,
        thumbnail: videoInfo.thumbnail,
        fileSize: videoInfo.fileSize,
        duration: videoInfo.duration,
        status: "completed",
      };
      
      if (videoInfo.downloadUrl) {
        updateData.downloadUrl = videoInfo.downloadUrl;
      }
      
      await ctx.runMutation(api.downloads.updateDownload, updateData);
      
    } catch (error) {
      await ctx.runMutation(api.downloads.updateDownload, {
        downloadId: args.downloadId,
        status: "failed",
      });
    }
  },
});

// Simulate video processing - replace with actual API calls
async function simulateVideoProcessing(url: string, platform: string, format: string, quality?: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const platformTitles = {
    youtube: "Amazing YouTube Video",
    tiktok: "Viral TikTok Dance",
    instagram: "Instagram Reel",
    facebook: "Facebook Video Post"
  };
  
  return {
    title: platformTitles[platform as keyof typeof platformTitles] || "Downloaded Video",
    thumbnail: `https://picsum.photos/320/180?random=${Math.floor(Math.random() * 1000)}`,
    downloadUrl: null, // Disabled fake downloads - integrate real APIs
    fileSize: Math.floor(Math.random() * 50000000) + 1000000, // 1-50MB
    duration: `${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
  };
}
