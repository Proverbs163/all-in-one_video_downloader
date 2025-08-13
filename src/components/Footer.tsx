export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">VideoDownloader</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              The fastest and most reliable video downloader for all major platforms.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Supported Platforms</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>YouTube</li>
              <li>TikTok</li>
              <li>Instagram</li>
              <li>Facebook</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>HD Quality Downloads</li>
              <li>MP3 Extraction</li>
              <li>Watermark Removal</li>
              <li>Batch Downloads</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-600">DMCA</a></li>
              <li><a href="#" className="hover:text-blue-600">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            © 2024 VideoDownloader. All rights reserved. 
            <span className="block mt-2">
              Disclaimer: This tool is for personal use only. Please respect copyright laws and platform terms of service.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
