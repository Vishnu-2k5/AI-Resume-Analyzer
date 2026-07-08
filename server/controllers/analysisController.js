import { processResumeAnalysis } from '../services/analysisService.js';

/**
 * Controller to handle resume upload and ATS analysis.
 * Thin controller delegation to analysisService.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const analyzeResume = async (req, res, next) => {
  try {
    const { jobDescription } = req.body;

    // Validate inputs
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No resume file uploaded. Please upload a PDF resume.'
      });
    }

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Job description is required.'
      });
    }

    // Call service to run end-to-end extraction and evaluation
    const analysis = await processResumeAnalysis(
      req.file.path,
      req.file.originalname,
      jobDescription
    );

    return res.status(201).json({
      success: true,
      message: 'Analysis completed successfully',
      data: analysis
    });
  } catch (error) {
    next(error); // Delegate to centralized error handler middleware
  }
};
