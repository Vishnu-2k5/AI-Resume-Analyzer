import axios from 'axios';

// Access API base URL from environment variables, defaulting to local port 5000 API namespace
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000 // 60-second timeout for long Gemini processing requests
});

/**
 * Upload and evaluate a PDF resume file against a job description.
 *
 * @param {File} resumeFile - The PDF resume file object.
 * @param {string} jobDescription - Target job description text.
 * @param {function} onUploadProgress - Callback to track upload percentage.
 * @returns {Promise<object>} Detailed analysis response object.
 */
export const analyzeResume = async (resumeFile, jobDescription, onUploadProgress) => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  formData.append('jobDescription', jobDescription);

  const response = await api.post('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percentCompleted);
      }
    }
  });

  return response.data;
};

/**
 * Retrieve the summary history of all past evaluations.
 *
 * @param {string} [search=''] - Search term to filter results by file name.
 * @returns {Promise<object>} Array of history records.
 */
export const getHistory = async (search = '') => {
  const response = await api.get(`/history?search=${encodeURIComponent(search)}`);
  return response.data;
};

/**
 * Retrieve the detailed evaluation results of a specific report.
 *
 * @param {string} id - The MongoDB ObjectID of the report.
 * @returns {Promise<object>} Complete details of the resume report.
 */
export const getHistoryById = async (id) => {
  const response = await api.get(`/history/${id}`);
  return response.data;
};

/**
 * Delete a specific resume evaluation history record.
 *
 * @param {string} id - The MongoDB ObjectID of the report to delete.
 * @returns {Promise<object>} API success response status.
 */
export const deleteHistoryById = async (id) => {
  const response = await api.delete(`/history/${id}`);
  return response.data;
};

export default api;
