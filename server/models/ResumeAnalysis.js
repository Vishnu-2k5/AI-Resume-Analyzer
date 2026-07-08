import mongoose from 'mongoose';

/**
 * ResumeAnalysis Schema definitions for storing parsed resume evaluations.
 */
const resumeAnalysisSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true
    },
    jobDescription: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true
    },
    resumeText: {
      type: String,
      required: [true, 'Extracted resume text is required'],
      trim: true
    },
    overallScore: {
      type: Number,
      required: [true, 'Overall Score is required'],
      min: 0,
      max: 100
    },
    strengths: {
      type: [String],
      default: []
    },
    missingSkills: {
      type: [String],
      default: []
    },
    missingKeywords: {
      type: [String],
      default: []
    },
    matchedKeywords: {
      type: [String],
      default: []
    },
    improvementSuggestions: {
      type: [String],
      default: []
    },
    improvedSummary: {
      type: String,
      trim: true,
      default: ''
    },
    skillGapRoadmap: [
      {
        week: { type: String, required: true },
        topic: { type: String, required: true },
        tasks: { type: [String], default: [] }
      }
    ],
    finalVerdict: {
      type: String,
      trim: true,
      default: ''
    },
    geminiResponse: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Original raw Gemini JSON response is required']
    }
  },
  {
    timestamps: true, // Auto-generates createdAt and updatedAt. Matches uploadedAt requirement.
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * Virtual property matching 'uploadedAt' to Mongoose's auto-generated 'createdAt' timestamp
 * for backward/forward compatibility as requested.
 */
resumeAnalysisSchema.virtual('uploadedAt').get(function () {
  return this.createdAt;
});

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);

export default ResumeAnalysis;
