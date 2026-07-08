import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DragDropUpload from '../components/DragDropUpload';
import { analyzeResume } from '../services/api';
import { AlertCircle, Play, Loader2, CheckCircle2 } from 'lucide-react';

/**
 * UploadPage page: Orchestrates file selections and job description entries,
 * tracking multi-stage progress loaders during AI evaluation.
 */
export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadPercent, setUploadPercent] = useState(0);
  
  const navigate = useNavigate();

  // Defined steps for loading progress.
  const steps = [
    { label: 'Uploading Resume...', description: 'Sending file to the server' },
    { label: 'Extracting PDF...', description: 'Extracting clean text content' },
    { label: 'Analyzing with Gemini...', description: 'Executing semantic match and scoring' },
    { label: 'Saving Results...', description: 'Saving results to history database' },
    { label: 'Completed', description: 'Redirecting to report dashboard' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please upload a PDF resume file.');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please provide the Job Description to analyze against.');
      return;
    }

    setLoading(true);
    setCurrentStep(0);
    setUploadPercent(0);

    try {
      // 1. Send API Request. Track actual upload progress.
      const result = await analyzeResume(file, jobDescription, (percent) => {
        setUploadPercent(percent);
        if (percent === 100) {
          // Immediately move to Stage 2 once upload completes
          setCurrentStep(1);
          
          // Simulate some timing for stages 3 and 4 while waiting for Gemini API response
          setTimeout(() => {
            setCurrentStep((prev) => (prev === 1 ? 2 : prev));
          }, 1500);
        }
      });

      // 2. Once API finishes successfully, progress to completion
      setCurrentStep(3);
      setTimeout(() => {
        setCurrentStep(4);
        setTimeout(() => {
          navigate(`/dashboard/${result.data._id}`);
        }, 800);
      }, 500);

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || 
        'An unexpected error occurred during analysis. Please check your credentials and try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Analyze Resume
        </h1>
        <p className="mt-3 text-slate-500 text-sm">
          Upload your resume and paste the target job description to run a detailed evaluation.
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-xs">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
          <div>
            <h4 className="font-bold">Evaluation Failed</h4>
            <p className="mt-1 text-xs">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-slate-800">{steps[currentStep].label}</h3>
              <p className="text-xs text-slate-500 mt-1">{steps[currentStep].description}</p>
            </div>
          </div>

          {/* Progress indicators */}
          <div className="mt-8 space-y-4 max-w-md mx-auto">
            {currentStep === 0 && (
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadPercent}%` }}
                />
                <span className="text-2xs text-slate-400 mt-1 block">{uploadPercent}% uploaded</span>
              </div>
            )}

            <div className="flex flex-col gap-2.5 text-left border-t border-slate-100 pt-6 mt-6">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    idx < currentStep 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                      : idx === currentStep 
                      ? 'bg-blue-50 text-blue-600 border border-blue-100 animate-pulse' 
                      : 'bg-slate-50 text-slate-400 border border-slate-200/50'
                  }`}>
                    {idx < currentStep ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                  </div>
                  <span className={`text-xs ${idx === currentStep ? 'font-semibold text-slate-800' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* File upload input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Resume File</label>
            <DragDropUpload file={file} setFile={setFile} setError={setError} />
          </div>

          {/* Job description input */}
          <div className="space-y-2">
            <label htmlFor="jobDescription" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Job Description
            </label>
            <textarea
              id="jobDescription"
              rows={8}
              className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-xs"
              placeholder="Paste the job description or role requirements here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="h-4 w-4 fill-white" />
            Analyze Resume
          </button>
        </form>
      )}
    </div>
  );
}
