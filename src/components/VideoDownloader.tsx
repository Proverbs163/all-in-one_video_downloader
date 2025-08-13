import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

const PLATFORMS = {
  youtube: {
    name: "YouTube",
    icon: "🎥",
    color: "bg-red-500",
    formats: ["mp4", "mp3"],
    qualities: ["144p", "360p", "720p", "1080p", "1440p", "2160p"]
  },
  tiktok: {
    name: "TikTok",
    icon: "🎵",
    color: "bg-black",
    formats: ["mp4"],
    qualities: ["360p", "720p", "1080p"]
  },
  instagram: {
    name: "Instagram",
    icon: "📸",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    formats: ["mp4"],
    qualities: ["360p", "720p", "1080p"]
  },
  facebook: {
    name: "Facebook",
    icon: "👥",
    color: "bg-blue-600",
    formats: ["mp4"],
    qualities: ["360p", "720p", "1080p"]
  }
};

export function VideoDownloader() {
  const [url, setUrl] = useState("");
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("mp4");
  const [selectedQuality, setSelectedQuality] = useState("720p");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const createDownload = useMutation(api.downloads.createDownload);
  const processDownload = useAction(api.downloads.processDownload);

  const detectPlatform = (url: string): string | null => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook';
    return null;
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    const platform = detectPlatform(value);
    setDetectedPlatform(platform);
    
    if (platform && PLATFORMS[platform as keyof typeof PLATFORMS]) {
      const platformData = PLATFORMS[platform as keyof typeof PLATFORMS];
      setSelectedFormat(platformData.formats[0]);
      setSelectedQuality(platformData.qualities[1]); // Default to second quality option
    }
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      toast.error("Please enter a video URL");
      return;
    }

    if (!detectedPlatform) {
      toast.error("Unsupported platform. Please use YouTube, TikTok, Instagram, or Facebook URLs.");
      return;
    }

    setIsProcessing(true);
    
    try {
      const downloadId = await createDownload({
        url: url.trim(),
        platform: detectedPlatform,
        format: selectedFormat,
        quality: selectedQuality,
      });

      toast.success("Download started! Check your history for progress.");
      
      // Process the download in the background
      await processDownload({
        downloadId,
        url: url.trim(),
        platform: detectedPlatform,
        format: selectedFormat,
        quality: selectedQuality,
      });
      
      toast.success("Download completed!");
      setUrl("");
      setDetectedPlatform(null);
      
    } catch (error) {
      toast.error("Failed to start download. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const platformData = detectedPlatform ? PLATFORMS[detectedPlatform as keyof typeof PLATFORMS] : null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Ad Space */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-8 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Advertisement Space</p>
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mt-2 flex items-center justify-center">
          <span className="text-gray-400">Google AdSense</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        {/* Demo Notice */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="text-yellow-600 dark:text-yellow-400 mr-2">⚠️</div>
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Demo Mode:</strong> This is a demonstration. Real video downloading requires API integration with services like yt-dlp or RapidAPI.
            </div>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Video URL
          </label>
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="Paste your video URL here (YouTube, TikTok, Instagram, Facebook)"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            {detectedPlatform && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className={`px-2 py-1 rounded text-white text-xs font-medium ${platformData?.color}`}>
                  {platformData?.icon} {platformData?.name}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Platform Icons */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {Object.entries(PLATFORMS).map(([key, platform]) => (
            <div
              key={key}
              className={`p-4 rounded-lg text-center transition-all ${
                detectedPlatform === key
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'bg-gray-50 dark:bg-gray-700'
              }`}
            >
              <div className="text-2xl mb-2">{platform.icon}</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {platform.name}
              </div>
            </div>
          ))}
        </div>

        {/* Format and Quality Selection */}
        {platformData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Format
              </label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {platformData.formats.map((format) => (
                  <option key={format} value={format}>
                    {format.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quality
              </label>
              <select
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {platformData.qualities.map((quality) => (
                  <option key={quality} value={quality}>
                    {quality}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={!url.trim() || !detectedPlatform || isProcessing}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Download ${selectedFormat.toUpperCase()}`
          )}
        </button>

        {/* Features */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-green-600 dark:text-green-400 font-semibold text-sm">HD Quality</div>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-blue-600 dark:text-blue-400 font-semibold text-sm">Fast Download</div>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-purple-600 dark:text-purple-400 font-semibold text-sm">No Watermark</div>
          </div>
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-orange-600 dark:text-orange-400 font-semibold text-sm">Free Forever</div>
          </div>
        </div>
      </div>
    </div>
  );
}
