import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, History, BarChart3, HelpCircle } from 'lucide-react';

/**
 * Navbar component for navigation, with glassmorphism styling and mobile responsiveness.
 */
export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <Link to="/" className="text-slate-900 text-lg font-bold tracking-tight hover:text-blue-600 transition-colors">
              AI Resume Analyzer
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/upload"
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                isActive('/upload')
                  ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analyze</span>
            </Link>

            <Link
              to="/history"
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                isActive('/history')
                  ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
