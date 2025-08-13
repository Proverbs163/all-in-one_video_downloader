import { Authenticated } from "convex/react";
import { SignOutButton } from "../SignOutButton";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM5 8a1 1 0 000 2h8a1 1 0 100-2H5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">VideoDownloader</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Authenticated>
            <SignOutButton />
          </Authenticated>
        </div>
      </div>
    </header>
  );
}
