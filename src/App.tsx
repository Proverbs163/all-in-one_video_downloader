import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { VideoDownloader } from "./components/VideoDownloader";
import { DownloadHistory } from "./components/DownloadHistory";
import { Settings } from "./components/Settings";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CookieConsent } from "./components/CookieConsent";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useState } from "react";

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header />
        <main className="flex-1">
          <Content />
        </main>
        <Footer />
        <CookieConsent />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [activeTab, setActiveTab] = useState<'downloader' | 'history' | 'settings'>('downloader');

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
          All-in-One Video Downloader
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          Download videos from YouTube, TikTok, Instagram, and Facebook
        </p>
        
        <Unauthenticated>
          <div className="max-w-md mx-auto mb-8">
            <SignInForm />
          </div>
        </Unauthenticated>
      </div>

      <Authenticated>
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
              <button
                onClick={() => setActiveTab('downloader')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'downloader'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'
                }`}
              >
                Downloader
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'
                }`}
              >
                History
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'
                }`}
              >
                Settings
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'downloader' && <VideoDownloader />}
          {activeTab === 'history' && <DownloadHistory />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </Authenticated>

      <Unauthenticated>
        <VideoDownloader />
      </Unauthenticated>
    </div>
  );
}
