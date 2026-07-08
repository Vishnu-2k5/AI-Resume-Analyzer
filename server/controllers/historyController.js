import {
  getAnalysesHistory,
  getAnalysisDetail,
  deleteAnalysisRecord
} from '../services/analysisService.js';

/**
 * Controller to manage the retrieval and deletion of resume analysis records.
 */

/**
 * Fetch all previous resume analyses (history summary).
 * Supports search filtering by file name.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const getHistory = async (req, res, next) => {
  try {
    const { search } = req.query;
    const history = await getAnalysesHistory(search);
    return res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch a single detailed analysis record by database ID.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const getHistoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const analysis = await getAnalysisDetail(id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: `Analysis report with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a specific analysis record from the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const deleteHistoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedRecord = await deleteAnalysisRecord(id);

    if (!deletedRecord) {
      return res.status(404).json({
        success: false,
        error: `Analysis report with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Analysis report deleted successfully',
      data: { id }
    });
  } catch (error) {
    next(error);
  }
};
