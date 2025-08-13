import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// API endpoint for external developers
http.route({
  path: "/api/download",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const { url, format = "mp4", quality = "720p" } = await request.json();
    
    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Detect platform
    const detectPlatform = (url: string): string | null => {
      if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
      if (url.includes('tiktok.com')) return 'tiktok';
      if (url.includes('instagram.com')) return 'instagram';
      if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook';
      return null;
    };

    const platform = detectPlatform(url);
    if (!platform) {
      return new Response(JSON.stringify({ error: "Unsupported platform" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const downloadId = await ctx.runMutation(api.downloads.createDownload, {
        url,
        platform,
        format,
        quality,
      });

      await ctx.runAction(api.downloads.processDownload, {
        downloadId,
        url,
        platform,
        format,
        quality,
      });

      return new Response(JSON.stringify({ 
        success: true, 
        downloadId,
        message: "Download started successfully" 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to process download" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// Health check endpoint
http.route({
  path: "/api/health",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(JSON.stringify({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
