import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Cpu, Zap } from 'lucide-react';

/**
 * LandingPage component: Welcome view with features highlight and CTA in a modern light theme.
 */
export default function LandingPage() {
  return (
    <div className="relative isolate overflow-hidden bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-xs font-semibold text-blue-700 mb-6 shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            Empowered by Gemini 2.5 Flash
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl leading-tight">
            Optimize Your Resume For ATS Compatibility
          </h1>
          
          <p className="mt-6 text-lg leading-relaxed text-slate-500 max-w-2xl mx-auto">
            Scan your resume against any job description, pinpoint missing skills, and instantly generate AI-tailored summaries to land more interviews.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              to="/upload"
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
            >
              Start Free Analysis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link
              to="/history"
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-6 py-3.5 text-sm font-semibold text-slate-600 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              View History
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mx-auto mt-20 max-w-5xl sm:mt-24 lg:mt-32">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Feature 1 */}
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 border border-blue-100/50 text-blue-600 mb-6">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-800">AI ATS Scoring</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Instantly score your compatibility from 0 to 100 based on core qualifications and semantic analysis.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100/50 text-emerald-600 mb-6">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Bridging Roadmap</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Receive an actionable 4-week learning roadmap customized to address and close your identified skill gaps.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-200 sm:col-span-2 lg:col-span-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 border border-amber-100/50 text-amber-600 mb-6">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Keyword Matching</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Identify matching and missing keywords, letting you inject critical vocabulary before applying.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
