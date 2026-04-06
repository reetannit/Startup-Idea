const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `You are an expert startup consultant with deep knowledge of technology, markets, and business strategy. Analyze the given startup idea and return a structured JSON object.

Rules:
- Keep answers concise, realistic, and data-driven.
- "problem" should be a clear 2-3 sentence summary of the problem being solved.
- "customer" should describe the ideal customer persona in 2-3 sentences.
- "market" should provide a market overview with estimated size and growth potential.
- "competitor" must contain EXACTLY 3 competitors, each with a "name" and a one-line "differentiation" explaining how this startup would differ.
- "tech_stack" should list 4-6 practical technologies recommended for building the MVP.
- "risk_level" must be exactly one of: "Low", "Medium", or "High".
- "profitability_score" must be an integer between 0 and 100.
- "justification" should explain your reasoning for the risk level and profitability score in 2-3 sentences.

Return ONLY valid JSON with no markdown formatting, no code fences, no explanation outside the JSON.

Required JSON structure:
{
  "problem": "string",
  "customer": "string",
  "market": "string",
  "competitor": [
    {"name": "string", "differentiation": "string"},
    {"name": "string", "differentiation": "string"},
    {"name": "string", "differentiation": "string"}
  ],
  "tech_stack": ["string"],
  "risk_level": "Low|Medium|High",
  "profitability_score": 0-100,
  "justification": "string"
}`;

/**
 * Analyzes a startup idea using OpenAI and returns a structured report.
 * @param {string} title - The startup idea title
 * @param {string} description - The startup idea description
 * @returns {Object} Structured analysis report
 */
const analyzeIdea = async (title, description) => {
  try {
    const userPrompt = `Analyze this startup idea:\n\nTitle: ${title}\nDescription: ${description}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content;
    const report = JSON.parse(content);

    // Validate required fields
    const requiredFields = ['problem', 'customer', 'market', 'competitor', 'tech_stack', 'risk_level', 'profitability_score', 'justification'];
    for (const field of requiredFields) {
      if (!(field in report)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate data types
    if (!Array.isArray(report.competitor) || report.competitor.length !== 3) {
      throw new Error('Competitor must be an array of exactly 3 items');
    }
    if (!Array.isArray(report.tech_stack) || report.tech_stack.length < 4) {
      throw new Error('Tech stack must have at least 4 items');
    }
    if (!['Low', 'Medium', 'High'].includes(report.risk_level)) {
      throw new Error('Risk level must be Low, Medium, or High');
    }
    if (typeof report.profitability_score !== 'number' || report.profitability_score < 0 || report.profitability_score > 100) {
      throw new Error('Profitability score must be 0-100');
    }

    return report;
  } catch (error) {
    console.error('AI Analysis Error:', error.message);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
};

module.exports = { analyzeIdea };
