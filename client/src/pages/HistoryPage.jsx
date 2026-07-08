import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHistory, deleteHistoryById } from '../services/api';
import { Search, Eye, Trash2, Calendar, FileText, ArrowRight, Loader2 } from 'lucide-react';

/**
 * HistoryPage page: Lists past evaluations with a search filter,
 * color pills by score, and delete capabilities in a modern light theme.
 */
export default function HistoryPage() {
  const [historyList, setHistoryList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const fetchHistory = async (searchTerm = '') => {
    try {
      setLoading(true);
      setError('');
      const response = await getHistory(searchTerm);
      setHistoryList(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load analysis history. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search input to avoid hitting database on every keystroke.
    const delayDebounceFn = setTimeout(() => {
      fetchHistory(search);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis report? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoadingId(id);
      await deleteHistoryById(id);
      // Remove from state list
      setHistoryList((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete report. Please try again.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    if (score >= 50) return 'bg-amber-50 text-amber-700 border border-amber-100';
    return 'bg-rose-50 text-rose-700 border border-rose-100';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Analysis History
          </h1>
          <p className="mt-2 text-slate-500 text-sm">
            Review and manage all your past ATS evaluation reports.
          </p>
        </div>
        
        {/* Search Input filter */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-9 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-xs"
            placeholder="Search by file name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading && historyList.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-slate-500 text-sm">Searching records...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center max-w-2xl mx-auto shadow-xs">
          <p className="text-rose-700 font-semibold text-sm">{error}</p>
          <button
            onClick={() => fetchHistory(search)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-950 transition-colors shadow-2xs"
          >
            Retry Connection
          </button>
        </div>
      ) : historyList.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center max-w-2xl mx-auto shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400 mb-4">
            <FileText className="h-6 w-6 text-slate-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No Reports Found</h3>
          <p className="text-xs text-slate-500 mb-6">
            {search ? "We couldn't find any file matching your search query." : "You haven't analyzed any resumes yet."}
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:shadow-lg transition-all"
          >
            Analyze Now
            <ArrowRight className="h-4.5 w-4.5" />
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Resume File Name</th>
                  <th className="py-4 px-6">Upload Date & Time</th>
                  <th className="py-4 px-6 text-center">ATS Score</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {historyList.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-800 max-w-xs truncate sm:max-w-md">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                        <span>{item.fileName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block rounded-lg px-2.5 py-0.5 text-xs font-bold border ${getScoreBadgeClass(item.overallScore)}`}>
                        {item.overallScore} / 100
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/dashboard/${item._id}`}
                          className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                          title="View Analysis"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={(e) => handleDelete(item._id, e)}
                          disabled={deleteLoadingId === item._id}
                          className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-white border border-slate-200 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors disabled:opacity-50"
                          title="Delete Analysis"
                        >
                          {deleteLoadingId === item._id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-rose-600" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
