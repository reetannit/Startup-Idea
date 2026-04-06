/**
 * Mock AI Service — used when OPENAI_API_KEY is not configured.
 * Generates realistic-looking demo reports for any idea.
 */

const MOCK_REPORTS = [
  {
    problem: "Many aspiring entrepreneurs struggle to validate their startup ideas before investing significant time and capital. They lack access to structured market research, competitor analysis, and risk assessment frameworks that established companies use.",
    customer: "Early-stage founders aged 25-40 with technical backgrounds who have innovative ideas but limited business analysis experience. They are typically bootstrapping or seeking seed funding and need quick validation to convince investors.",
    market: "The global startup ecosystem is valued at over $3 trillion with 150+ million startups worldwide. The market research and validation tools segment is growing at 12% CAGR, driven by the rise of no-code tools and AI-powered analytics platforms.",
    competitor: [
      { name: "Lean Canvas", differentiation: "Our platform provides AI-driven analysis rather than manual template filling, saving hours of manual research" },
      { name: "CB Insights", differentiation: "We target early-stage founders at accessible price points, unlike enterprise-focused analytics platforms" },
      { name: "Crunchbase", differentiation: "We provide actionable validation reports rather than raw company data, offering structured recommendations" }
    ],
    tech_stack: ["React", "Node.js", "MongoDB", "OpenAI API", "Redis", "Docker"],
    risk_level: "Medium",
    profitability_score: 68,
    justification: "The market for startup validation tools is growing but competitive. The AI-powered approach provides a meaningful differentiator, though customer acquisition costs in the founder community can be high. Medium risk due to dependence on AI API costs and need for accurate, trustworthy outputs."
  },
  {
    problem: "Small and medium businesses waste 20-30% of their marketing budget on ineffective campaigns due to lack of real-time analytics and AI-driven optimization. Current tools are either too expensive or too complex for non-technical marketers.",
    customer: "Marketing managers and small business owners aged 30-50 who manage budgets under $50K/month. They need intuitive dashboards and actionable insights without requiring data science expertise.",
    market: "The digital marketing analytics market is projected to reach $10.2 billion by 2028, growing at 14.3% CAGR. SMBs represent 60% of the addressable market but are underserved by current enterprise solutions.",
    competitor: [
      { name: "HubSpot", differentiation: "Our AI-first approach automatically optimizes campaigns in real-time, unlike HubSpot's manual workflow-based system" },
      { name: "Google Analytics", differentiation: "We provide prescriptive recommendations rather than just descriptive analytics, telling users what to do next" },
      { name: "Mailchimp", differentiation: "We offer cross-channel optimization across email, social, and ads in a single unified dashboard" }
    ],
    tech_stack: ["Next.js", "Python", "PostgreSQL", "TensorFlow", "AWS Lambda"],
    risk_level: "Low",
    profitability_score: 78,
    justification: "Strong market demand with clear pain points and willingness to pay. The SMB segment is large and growing, with relatively lower customer acquisition costs through content marketing. Low risk due to proven market demand and multiple monetization paths through SaaS subscriptions."
  },
  {
    problem: "Healthcare providers spend an average of 15 hours per week on administrative paperwork, reducing patient care time by 30%. Existing EHR systems are clunky, non-interoperable, and designed for billing rather than clinical workflows.",
    customer: "Independent physicians, small clinics, and specialty practices with 1-20 providers who are frustrated with current EHR solutions. They value ease of use, quick implementation, and mobile-first design.",
    market: "The global EHR market is valued at $29.1 billion and expected to reach $47.2 billion by 2027. The AI-in-healthcare market is growing at 44.9% CAGR, with strong demand for workflow automation and clinical decision support.",
    competitor: [
      { name: "Epic Systems", differentiation: "We focus on small practices with 10x faster onboarding and a fraction of the cost, unlike Epic's enterprise-only approach" },
      { name: "Athenahealth", differentiation: "Our AI-first architecture automates 80% of documentation vs their rule-based templates" },
      { name: "DrChrono", differentiation: "We provide real-time clinical decision support and drug interaction checks powered by latest medical AI models" }
    ],
    tech_stack: ["React Native", "Node.js", "PostgreSQL", "FHIR API", "AWS", "Python"],
    risk_level: "High",
    profitability_score: 52,
    justification: "While the market opportunity is massive, healthcare is heavily regulated (HIPAA, FDA) with long sales cycles and high compliance costs. High risk due to regulatory barriers, but the potential for disruption and recurring revenue from SaaS model provides meaningful upside if executed well."
  }
];

/**
 * Returns a mock AI analysis report with a simulated delay.
 */
const analyzeIdeaMock = async (title, description) => {
  // Simulate AI processing time (2-4 seconds)
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

  // Pick a base report and customize it slightly based on input
  const base = MOCK_REPORTS[Math.floor(Math.random() * MOCK_REPORTS.length)];

  // Generate a somewhat deterministic score based on description length
  const descScore = Math.min(95, Math.max(25, 40 + Math.floor(description.length / 10)));
  const riskLevels = ['Low', 'Medium', 'High'];
  const riskIdx = descScore > 65 ? 0 : descScore > 40 ? 1 : 2;

  return {
    ...base,
    profitability_score: descScore,
    risk_level: riskLevels[riskIdx],
    justification: base.justification.replace(
      /Medium|Low|High/,
      riskLevels[riskIdx]
    )
  };
};

module.exports = { analyzeIdeaMock };
