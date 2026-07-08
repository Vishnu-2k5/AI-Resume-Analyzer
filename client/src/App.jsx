import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';

/**
 * App layout component wiring router paths and structural components.
 */
export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-blue-500/20">
        {/* Navigation Bar */}
        <Navbar />

        {/* Page Content Container */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/dashboard/:id" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
            {/* Fallback to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p>© {new Date().getFullYear()} AI Resume Analyzer. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
