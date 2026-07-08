import React from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb, ListTodo, Sparkles, AlertCircle } from 'lucide-react';

/**
 * ScoreCard renders a clean, professional circular progress indicator for the ATS match score in light mode.
 *
 * @param {object} props - Component props.
 * @param {number} props.score - ATS match score between 0 and 100.
 */
export function ScoreCard({ score }) {
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine score color classes
  let strokeColor = 'stroke-rose-600';
  let textColor = 'text-rose-600';
  let cardBorder = 'border-rose-100 bg-rose-50/10';

  if (score >= 80) {
    strokeColor = 'stroke-emerald-600';
    textColor = 'text-emerald-600';
    cardBorder = 'border-emerald-100 bg-emerald-50/10';
  } else if (score >= 50) {
    strokeColor = 'stroke-amber-600';
    textColor = 'text-amber-600';
    cardBorder = 'border-amber-100 bg-amber-50/10';
  }

  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border bg-white p-6 shadow-sm ${cardBorder}`}>
      <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-4">ATS Match Score</h3>
      <div className="relative flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            className="stroke-slate-100"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Animated progress circle */}
          <circle
            className={`${strokeColor} transition-all duration-1000 ease-out`}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute text-center">
          <span className={`text-4xl font-extrabold tracking-tight ${textColor}`}>
            {score}
          </span>
          <span className="text-slate-400 text-xs block -mt-1">/ 100</span>
        </div>
      </div>
    </div>
  );
}

/**
 * StrengthsCard lists all the identified positive highlights in the resume.
 */
export function StrengthsCard({ strengths = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100/50 text-emerald-600">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Strengths</h3>
      </div>
      {strengths.length === 0 ? (
        <p className="text-sm text-slate-500">No notable strengths identified.</p>
      ) : (
        <ul className="space-y-3">
          {strengths.map((strength, index) => (
            <li key={index} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * MissingSkillsCard highlights gaps in technical or professional skills.
 */
export function MissingSkillsCard({ missingSkills = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 border border-rose-100/50 text-rose-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Missing Skills</h3>
      </div>
      {missingSkills.length === 0 ? (
        <p className="text-sm text-slate-500">No missing skills identified!</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {missingSkills.map((skill, index) => (
            <span
              key={index}
              className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-100"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * KeywordsCard displays matched and missing keywords side by side.
 */
export function KeywordsCard({ matchedKeywords = [], missingKeywords = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h4 className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Matched Keywords ({matchedKeywords.length})
        </h4>
        {matchedKeywords.length === 0 ? (
          <p className="text-xs text-slate-500">No keywords matched.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {matchedKeywords.map((kw, idx) => (
              <span key={idx} className="rounded-lg bg-emerald-50/50 border border-emerald-100 px-2 py-0.5 text-xs text-emerald-700 font-medium">
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 pt-4 md:border-t-0 md:border-l md:border-slate-100 md:pt-0 md:pl-6">
        <h4 className="text-xs font-bold text-amber-600 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Missing Keywords ({missingKeywords.length})
        </h4>
        {missingKeywords.length === 0 ? (
          <p className="text-xs text-slate-500">No critical keywords missing.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {missingKeywords.map((kw, idx) => (
              <span key={idx} className="rounded-lg bg-amber-50/50 border border-amber-100 px-2 py-0.5 text-xs text-amber-700 font-medium">
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * SuggestionsCard lists actions to optimize formatting, grammar, and alignment.
 */
export function SuggestionsCard({ suggestions = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-100/50 text-blue-600">
          <Lightbulb className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Improvement Suggestions</h3>
      </div>
      {suggestions.length === 0 ? (
        <p className="text-sm text-slate-500">No recommendations. Excellent job!</p>
      ) : (
        <ul className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * ImprovedSummaryCard shows the optimized professional summary from Gemini.
 */
export function ImprovedSummaryCard({ originalSummary = '', improvedSummary = '' }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100/50 text-indigo-600">
          <Sparkles className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Improved Professional Summary</h3>
      </div>
      <div className="space-y-4">
        {originalSummary && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Resume Summary / Preview</span>
            <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-3 rounded-lg border border-slate-200/60 leading-relaxed">
              {originalSummary}
            </p>
          </div>
        )}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 block mb-1">Tailored Summary Recommendation</span>
          <p className="text-sm text-slate-700 leading-relaxed bg-blue-50/20 p-4 rounded-lg border border-blue-100/50">
            {improvedSummary}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * VerdictCard renders the final recommendation verdict.
 */
export function VerdictCard({ verdict = '', score = 0 }) {
  let bgColor = 'bg-rose-50 border-rose-200';
  let iconColor = 'text-rose-600';
  let title = 'Needs Revision';

  if (score >= 80) {
    bgColor = 'bg-emerald-50 border-emerald-200';
    iconColor = 'text-emerald-600';
    title = 'Ready to Apply';
  } else if (score >= 50) {
    bgColor = 'bg-amber-50 border-amber-200';
    iconColor = 'text-amber-600';
    title = 'Minor Revisions Suggested';
  }

  return (
    <div className={`rounded-2xl border p-5 ${bgColor}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className={`h-5 w-5 shrink-0 mt-0.5 ${iconColor}`} />
        <div>
          <h3 className={`text-sm font-bold ${iconColor}`}>{title}</h3>
          <p className="mt-1 text-xs text-slate-700 leading-relaxed">{verdict}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * SkillGapRoadmapCard displays a weekly roadmap to address missing skills.
 */
export function SkillGapRoadmapCard({ roadmap = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 border border-blue-100/50 text-blue-600">
          <ListTodo className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Recommended Learning Roadmap</h3>
          <p className="text-xs text-slate-500">A step-by-step weekly guide to bridge your resume skill gaps.</p>
        </div>
      </div>

      {roadmap.length === 0 ? (
        <p className="text-sm text-slate-500">No skill gaps identified. You are fully aligned!</p>
      ) : (
        <div className="relative border-l border-slate-100 pl-6 ml-3 space-y-6">
          {roadmap.map((weekItem, index) => (
            <div key={index} className="relative">
              {/* Timeline Indicator dot */}
              <div className="absolute -left-[31px] mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-white border-2 border-blue-600 text-blue-600" />
              
              <div>
                <span className="inline-block rounded-lg bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-100">
                  {weekItem.week || `Week ${index + 1}`}
                </span>
                <h4 className="mt-2 text-sm font-bold text-slate-800">{weekItem.topic}</h4>
                {weekItem.tasks && weekItem.tasks.length > 0 && (
                  <ul className="mt-2 space-y-1.5">
                    {weekItem.tasks.map((task, taskIdx) => (
                      <li key={taskIdx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
