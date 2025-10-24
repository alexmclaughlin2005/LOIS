/**
 * Query Classification System
 *
 * Analyzes user queries to determine intent and route to appropriate handlers:
 * - SQL Query: Structured data queries (aggregations, filters, joins)
 * - Document Search: Full-text search across documents
 * - General Question: Conversational queries about data
 */

export type QueryType = 'sql' | 'document_search' | 'general';

export interface ClassificationResult {
  type: QueryType;
  confidence: number;
  reasoning: string;
  suggestedAction: string; // User-friendly description of what we're doing
}

/**
 * Classify a user query to determine the appropriate handler
 */
export function classifyQuery(query: string): ClassificationResult {
  const normalized = query.toLowerCase().trim();

  // SQL Query indicators
  const sqlIndicators = {
    keywords: [
      'count', 'sum', 'average', 'total', 'how many', 'show me all',
      'list all', 'find cases where', 'filter', 'group by', 'aggregate',
      'greater than', 'less than', 'between', 'in the last', 'during',
      'statistics', 'breakdown', 'distribution', 'compare'
    ],
    patterns: [
      /how many .* (cases|projects|clients|contacts)/,
      /show me .* (cases|projects) (where|with|that)/,
      /list .* (with|having|where)/,
      /find .* (greater than|less than|between|exceeding)/,
      /what is the (total|average|sum|count)/,
      /(medical expenses|settlement|damages|fees) (over|under|above|below|exceeding)/,
      /cases in (discovery|trial|settlement|closed|open)/,
      /(last|past) \d+ (days|weeks|months|years)/
    ]
  };

  // Document Search indicators
  const documentIndicators = {
    keywords: [
      'search', 'find documents', 'search documents', 'look for',
      'find in documents', 'document containing', 'pleading', 'motion',
      'contract', 'correspondence', 'evidence', 'filed', 'document'
    ],
    patterns: [
      /search (for|documents|files)/,
      /find documents? (about|containing|with|mentioning)/,
      /what documents? (mention|contain|reference)/,
      /show me documents? (where|that|containing)/,
      /(pleading|motion|brief|contract|correspondence) (about|regarding|for)/
    ]
  };

  // General Question indicators
  const generalIndicators = {
    keywords: [
      'what is', 'who is', 'when did', 'why', 'how does', 'explain',
      'tell me about', 'describe', 'summarize', 'overview', 'status of',
      'update on', 'what happened', 'can you'
    ],
    patterns: [
      /^(what|who|when|where|why|how) (is|are|was|were|did|does)/,
      /tell me (about|more)/,
      /(explain|describe|summarize)/,
      /what('s| is) the (status|update|latest) (on|for)/,
      /can you (help|show|explain|tell)/
    ]
  };

  // Calculate scores for each type
  let sqlScore = 0;
  let documentScore = 0;
  let generalScore = 0;

  // Check SQL indicators
  sqlIndicators.keywords.forEach(keyword => {
    if (normalized.includes(keyword)) sqlScore += 1;
  });
  sqlIndicators.patterns.forEach(pattern => {
    if (pattern.test(normalized)) sqlScore += 2;
  });

  // Check Document indicators
  documentIndicators.keywords.forEach(keyword => {
    if (normalized.includes(keyword)) documentScore += 1;
  });
  documentIndicators.patterns.forEach(pattern => {
    if (pattern.test(normalized)) documentScore += 2;
  });

  // Check General indicators
  generalIndicators.keywords.forEach(keyword => {
    if (normalized.includes(keyword)) generalScore += 1;
  });
  generalIndicators.patterns.forEach(pattern => {
    if (pattern.test(normalized)) generalScore += 2;
  });

  // Special case: Questions starting with "Can you" could be any type
  if (normalized.startsWith('can you')) {
    generalScore += 0.5;
  }

  // Determine type based on highest score
  const maxScore = Math.max(sqlScore, documentScore, generalScore);
  const totalScore = sqlScore + documentScore + generalScore || 1;

  if (maxScore === 0) {
    // No clear indicators, default to general
    return {
      type: 'general',
      confidence: 0.5,
      reasoning: 'No specific indicators found, treating as general question',
      suggestedAction: 'Analyzing your question...'
    };
  }

  if (sqlScore === maxScore) {
    return {
      type: 'sql',
      confidence: sqlScore / totalScore,
      reasoning: 'Detected structured data query with filters or aggregations',
      suggestedAction: 'Querying case database...'
    };
  }

  if (documentScore === maxScore) {
    return {
      type: 'document_search',
      confidence: documentScore / totalScore,
      reasoning: 'Detected full-text document search request',
      suggestedAction: 'Searching through documents...'
    };
  }

  return {
    type: 'general',
    confidence: generalScore / totalScore,
    reasoning: 'Detected general conversational question',
    suggestedAction: 'Analyzing your question...'
  };
}

/**
 * Get examples for each query type (for testing/documentation)
 */
export function getQueryExamples() {
  return {
    sql: [
      'How many open personal injury cases are in discovery?',
      'Show me cases where medical expenses exceed $100,000',
      'What is the total billable hours for last month?',
      'List all cases filed in the last 30 days',
      'Find cases with settlement amounts between $50k and $100k',
      'How many cases do we have by case type?',
      'Show me all open cases assigned to Sarah Johnson'
    ],
    document_search: [
      'Search documents for "settlement agreement"',
      'Find all motions mentioning damages',
      'Show me documents containing "medical malpractice"',
      'What pleadings reference the accident date?',
      'Search for correspondence about the deposition',
      'Find contracts with payment terms'
    ],
    general: [
      'What is the status of the Thompson case?',
      'Tell me about our personal injury practice',
      'Who is the lead attorney on case PI-2025-00142?',
      'Explain the discovery process',
      'What happened with the mediation last week?',
      'Can you summarize the Johnson settlement?'
    ]
  };
}
