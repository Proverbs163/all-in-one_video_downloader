import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function DownloadHistory() {
  const downloads = useQuery(api.downloads.getUserDownloads) || [];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'processing': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'failed': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getPlatformIcon = (platform: string) => {
    const icons = {
      youtube: '🎥',
      tiktok: '🎵',
      instagram: '📸',
      facebook: '👥'
    };
    return icons[platform as keyof typeof icons] || '📹';
  };

  if (downloads.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📥</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No downloads yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Your download history will appear here once you start downloading videos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Download History
      </h2>
      
      {downloads.map((download) => (
        <div
          key={download._id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="flex items-start space-x-4">
            {download.thumbnail && (
              <img
                src={download.thumbnail}
                alt={download.title}
                className="w-20 h-12 object-cover rounded"
              />
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">{getPlatformIcon(download.platform)}</span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                  {download.platform}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(download.status)}`}>
                  {download.status}
                </span>
              </div>
              
              <h3 className="font-medium text-gray-900 dark:text-white truncate mb-1">
                {download.title}
              </h3>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{download.format.toUpperCase()}</span>
                {download.quality && <span>{download.quality}</span>}
                {download.duration && <span>{download.duration}</span>}
                {download.fileSize && <span>{formatFileSize(download.fileSize)}</span>}
              </div>
              
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {new Date(download._creationTime).toLocaleString()}
              </div>
            </div>
            
            {download.status === 'completed' && (
              download.downloadUrl ? (
                <a
                  href={download.downloadUrl}
                  download
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Download
                </a>
              ) : (
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-4 py-2 rounded-lg text-sm font-medium">
                  Demo Mode
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
