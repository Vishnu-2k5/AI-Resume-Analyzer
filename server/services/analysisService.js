import fs from 'fs';
import pdf from 'pdf-parse';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import { analyzeResumeWithGemini } from './geminiService.js';

/**
 * Service handling all core business logic for resume parsing, evaluation, database operations.
 */

/**
 * Extracts plain text from a local PDF file path.
 *
 * @param {string} filePath - Absolute or relative path to the PDF file.
 * @returns {Promise<string>} Extracted plain text content.
 * @throws {Error} If pdf parsing fails.
 */
export const extractTextFromPdf = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parsedData = await pdf(dataBuffer);
    return parsedData.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error(`Failed to parse text from PDF file: ${error.message}`);
  }
};

/**
 * Handles the complete flow of reading a PDF, extracting text, calling Gemini, saving to MongoDB, and cleaning up the file.
 *
 * @param {string} filePath - Local path of the uploaded resume.
 * @param {string} originalName - Original file name of the resume.
 * @param {string} jobDescription - Job description content.
 * @returns {Promise<object>} The saved ResumeAnalysis Mongoose document.
 */
export const processResumeAnalysis = async (filePath, originalName, jobDescription) => {
  let resumeText = '';

  try {
    // 1. Extract text from PDF
    resumeText = await extractTextFromPdf(filePath);
    if (!resumeText || !resumeText.trim()) {
      throw new Error('Extracted resume text is empty. The PDF might be scanned or corrupted.');
    }

    // 2. Query Gemini API for analysis
    const geminiData = await analyzeResumeWithGemini(resumeText, jobDescription);

    // 3. Persist record in MongoDB Atlas
    const analysis = new ResumeAnalysis({
      fileName: originalName,
      jobDescription: jobDescription.trim(),
      resumeText: resumeText.trim(),
      overallScore: geminiData.overallScore,
      strengths: geminiData.strengths || [],
      missingSkills: geminiData.missingSkills || [],
      missingKeywords: geminiData.missingKeywords || [],
      matchedKeywords: geminiData.matchedKeywords || [],
      improvementSuggestions: geminiData.improvementSuggestions || [],
      improvedSummary: geminiData.improvedSummary || '',
      skillGapRoadmap: geminiData.skillGapRoadmap || [],
      finalVerdict: geminiData.finalVerdict || '',
      geminiResponse: geminiData
    });

    await analysis.save();
    return analysis;
  } finally {
    // 4. Always clean up uploaded file to prevent server bloat
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Failed to clean up temporary file: ${filePath}`, err);
      }
    }
  }
};

/**
 * Retrieves all analyses from the database, sorted newest first, with optional search filter by file name.
 *
 * @param {string} [search=''] - Keyword search to filter by fileName.
 * @returns {Promise<Array<object>>} List of resume analysis summaries.
 */
export const getAnalysesHistory = async (search = '') => {
  const filter = {};
  if (search && search.trim() !== '') {
    filter.fileName = { $regex: search, $options: 'i' };
  }

  // Return summaries sorted newest first (descending order)
  return await ResumeAnalysis.find(filter)
    .select('fileName createdAt overallScore finalVerdict strengths missingSkills')
    .sort({ createdAt: -1 });
};

/**
 * Retrieves a single complete analysis by its database ID.
 *
 * @param {string} id - The MongoDB ObjectID.
 * @returns {Promise<object|null>} The complete analysis record, or null if not found.
 */
export const getAnalysisDetail = async (id) => {
  return await ResumeAnalysis.findById(id);
};

/**
 * Deletes a single analysis record by its database ID.
 *
 * @param {string} id - The MongoDB ObjectID.
 * @returns {Promise<object|null>} The deleted record, or null if not found.
 */
export const deleteAnalysisRecord = async (id) => {
  return await ResumeAnalysis.findByIdAndDelete(id);
};
