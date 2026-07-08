import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHistoryById } from '../services/api';
import {
  ScoreCard,
  StrengthsCard,
  MissingSkillsCard,
  KeywordsCard,
  SuggestionsCard,
  ImprovedSummaryCard,
  VerdictCard,
  SkillGapRoadmapCard
} from '../components/DashboardComponents';
import { ArrowLeft, Loader2, Calendar, FileText, AlertCircle } from 'lucide-react';

/**
 * DashboardPage component: Displays detailed analysis results of a single report.
 */
export default function DashboardPage() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getHistoryById(id);
        setAnalysis(response.data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.error || 
          'Failed to retrieve analysis report. It may have been deleted or the ID is invalid.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnalysis();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-slate-500 text-sm">Loading analysis dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 border border-rose-100 text-rose-600 mb-4">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Dashboard</h2>
        <p className="text-slate-500 text-sm mb-6">{error}</p>
        <Link
          to="/history"
          className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to History
        </Link>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* Back button and page title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <Link
            to="/history"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to History
          </Link>
          <div className="flex items-center gap-2.5">
            <FileText className="h-6 w-6 text-blue-600 shrink-0" />
            <h1 className="text-2xl font-extrabold text-slate-900 truncate max-w-md sm:max-w-xl">
              {analysis.fileName}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            <span>Analyzed on {formatDate(analysis.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Main grids layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: ATS Score & Overview details */}
        <div className="lg:col-span-1 space-y-6">
          <ScoreCard score={analysis.overallScore} />
          
          <VerdictCard verdict={analysis.finalVerdict} score={analysis.overallScore} />

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Resume Summary</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {analysis.geminiResponse?.resumeSummary || 'No summary available.'}
            </p>
          </div>
        </div>

        {/* Right Column: Strengths, gaps, keywords and roadmap */}
        <div className="lg:col-span-2 space-y-6">
          
          <KeywordsCard
            matchedKeywords={analysis.matchedKeywords}
            missingKeywords={analysis.missingKeywords}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StrengthsCard strengths={analysis.strengths} />
            <MissingSkillsCard missingSkills={analysis.missingSkills} />
          </div>

          <SuggestionsCard suggestions={analysis.improvementSuggestions} />

          <ImprovedSummaryCard 
            originalSummary={analysis.resumeText} 
            improvedSummary={analysis.improvedSummary} 
          />

          <SkillGapRoadmapCard roadmap={analysis.skillGapRoadmap} />

        </div>
      </div>
    </div>
  );
}
