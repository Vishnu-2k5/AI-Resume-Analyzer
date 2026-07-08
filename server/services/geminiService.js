import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Service to interact with the Google Gemini API.
 */

// Define response schema to enforce structured JSON output.
const evaluationSchema = {
  type: 'object',
  properties: {
    overallScore: {
      type: 'integer',
      description: 'ATS match score between 0 and 100 based on the job description.'
    },
    resumeSummary: {
      type: 'string',
      description: 'A brief summary of the uploaded resume.'
    },
    strengths: {
      type: 'array',
      items: { type: 'string' },
      description: 'Key strengths noticed in the resume.'
    },
    missingSkills: {
      type: 'array',
      items: { type: 'string' },
      description: 'Skills explicitly or implicitly missing based on the job description.'
    },
    missingKeywords: {
      type: 'array',
      items: { type: 'string' },
      description: 'Keywords and industry buzzwords present in the job description but missing in the resume.'
    },
    matchedKeywords: {
      type: 'array',
      items: { type: 'string' },
      description: 'Keywords and phrases successfully matched between the resume and the job description.'
    },
    improvementSuggestions: {
      type: 'array',
      items: { type: 'string' },
      description: 'Actionable suggestions to improve the resume (formatting, content, phrasing).'
    },
    improvedSummary: {
      type: 'string',
      description: 'An optimized version of the professional summary tailored to the job description.'
    },
    finalVerdict: {
      type: 'string',
      description: 'A brief professional verdict recommending whether the candidate should proceed with the current resume or update it.'
    },
    skillGapRoadmap: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          week: { type: 'string', description: 'Week number or designation, e.g. "Week 1"' },
          topic: { type: 'string', description: 'Key domain or skill area to focus on' },
          tasks: {
            type: 'array',
            items: { type: 'string' },
            description: 'Specific learning items, mini projects or certifications.'
          }
        },
        required: ['week', 'topic', 'tasks']
      },
      description: 'A 4-week step-by-step roadmap to bridge the candidate’s skill gaps.'
    }
  },
  required: [
    'overallScore',
    'resumeSummary',
    'strengths',
    'missingSkills',
    'missingKeywords',
    'matchedKeywords',
    'improvementSuggestions',
    'improvedSummary',
    'finalVerdict',
    'skillGapRoadmap'
  ]
};

/**
 * Evaluates resume text against a job description using Gemini 2.5 Flash.
 *
 * @param {string} resumeText - Extracted text content of the candidate resume.
 * @param {string} jobDescription - Target job description text.
 * @returns {Promise<object>} Parsed JSON result representing the detailed resume analysis.
 * @throws {Error} If the Gemini API call fails or key is missing.
 */
export const analyzeResumeWithGemini = async (resumeText, jobDescription) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is not configured in the server environment (.env).');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: evaluationSchema
    }
  });

  const prompt = `
    Analyze the uploaded resume against the provided Job Description.
    
    Resume Text:
    """
    ${resumeText}
    """

    Job Description:
    """
    ${jobDescription}
    """

    Evaluate the resume for ATS compatibility and alignment.
    Provide constructive and realistic recommendations.
    Return ONLY a valid JSON object matching the requested schema. Do not output any markdown formatting (like \`\`\`json) outside of the raw json text.
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Gemini API Service Error:', error);
    throw new Error(`Failed to generate analysis from Gemini: ${error.message}`);
  }
};
