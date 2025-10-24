/**
 * Query Router
 *
 * Routes queries to appropriate handlers based on classification
 * and provides LLM with context-aware prompts
 */

import { classifyQuery, type QueryType } from './queryClassifier';
import { supabase } from './supabase';

export interface QueryResult {
  type: QueryType;
  action: string; // User-friendly action description
  data: any;
  prompt: string; // Prompt for LLM to format response
  sqlQuery?: string; // For debugging SQL queries
  error?: string;
}

/**
 * Database schema context for SQL queries
 */
const SCHEMA_CONTEXT = `
# LOIS Database Schema

## Tables

### projects
- id (UUID, primary key)
- case_number (VARCHAR, unique) - Format: CV-2025-00001
- title (VARCHAR) - Case title
- case_type (VARCHAR) - Personal Injury, Corporate, Family Law, Employment, Real Estate
- status (VARCHAR) - Open, Closed, On Hold
- phase (VARCHAR) - Discovery, Trial, Settlement, Pre-Trial, Appeal
- jurisdiction (VARCHAR)
- court_name (VARCHAR)
- filing_date (DATE)
- estimated_value (DECIMAL)
- priority (VARCHAR) - High, Medium, Low
- custom_fields (JSONB) - Case-specific fields:
  - Personal Injury: medical_expenses, lost_wages, injury_type, accident_date
  - Corporate: contract_value, transaction_type, closing_date
  - Family Law: marital_assets_value, number_of_children
  - Employment: damages_sought, termination_date
  - Real Estate: property_value, property_type
- description (TEXT)
- created_at, updated_at (TIMESTAMPTZ)

### contacts
- id (UUID, primary key)
- first_name, last_name (VARCHAR)
- email, phone (VARCHAR)
- contact_type (VARCHAR) - Attorney, Client, Opposing Counsel, Witness, Expert
- organization (VARCHAR)
- title (VARCHAR)
- bar_number (VARCHAR) - For attorneys
- specialty (VARCHAR) - For experts

### project_contacts (junction table)
- project_id, contact_id (UUID, foreign keys)
- role (VARCHAR) - Lead Attorney, Plaintiff, Defendant, Expert Witness
- is_primary (BOOLEAN)

### documents
- id (UUID, primary key)
- project_id (UUID, foreign key)
- title (VARCHAR)
- document_type (VARCHAR) - Pleading, Discovery, Correspondence, Evidence, Contract, Motion
- content (TEXT) - Full-text searchable
- status (VARCHAR) - Draft, Final, Filed, Received
- date_filed, date_received (DATE)
- tags (VARCHAR[])

### calendar_entries
- id (UUID, primary key)
- project_id (UUID, foreign key)
- title (VARCHAR)
- entry_type (VARCHAR) - Court Date, Deposition, Deadline, Meeting, Hearing
- start_time, end_time (TIMESTAMPTZ)
- location (VARCHAR)
- status (VARCHAR) - Scheduled, Completed, Cancelled

### time_entries
- id (UUID, primary key)
- project_id (UUID, foreign key)
- attorney (UUID)
- date (DATE)
- hours (DECIMAL)
- activity_type (VARCHAR)
- hourly_rate (DECIMAL)
- total_amount (DECIMAL) - Computed: hours * hourly_rate
- is_billable (BOOLEAN)

### expenses
- id (UUID, primary key)
- project_id (UUID, foreign key)
- date (DATE)
- expense_type (VARCHAR)
- amount (DECIMAL)
- is_billable (BOOLEAN)

### invoices
- id (UUID, primary key)
- project_id (UUID, foreign key)
- invoice_number (VARCHAR)
- invoice_date, due_date (DATE)
- status (VARCHAR) - Draft, Sent, Paid, Overdue
- subtotal, total_amount, amount_paid (DECIMAL)

### notes & tasks
- Similar structure with project_id foreign key
- Tasks have: status, priority, due_date, assigned_to
- Notes have: note_type, author, is_pinned

## Common Query Patterns

1. Filter by case type: WHERE case_type = 'Personal Injury'
2. Filter by status: WHERE status = 'Open'
3. Custom field queries: WHERE (custom_fields->>'medical_expenses')::numeric > 100000
4. Date ranges: WHERE filing_date >= '2025-01-01'
5. Joins: JOIN project_contacts pc ON p.id = pc.project_id
6. Full-text search: WHERE to_tsvector('english', content) @@ to_tsquery('english', 'search terms')
`;

/**
 * Handle SQL-style queries
 */
async function handleSQLQuery(query: string): Promise<QueryResult> {
  // For now, we'll use predefined query patterns
  // In Phase 4, we'll use LLM to generate SQL from natural language

  const normalized = query.toLowerCase();

  try {
    // Pattern 1: Open PI cases in discovery
    if (normalized.includes('open') && normalized.includes('personal injury') && normalized.includes('discovery')) {
      const { data, error } = await supabase
        .from('projects')
        .select('case_number, title, status, phase, filing_date, estimated_value')
        .eq('case_type', 'Personal Injury')
        .eq('status', 'Open')
        .eq('phase', 'Discovery');

      if (error) throw error;

      return {
        type: 'sql',
        action: 'Querying open Personal Injury cases in Discovery phase',
        data: data,
        prompt: `You are a legal assistant analyzing case data. The user asked: "${query}"

I found ${data.length} open Personal Injury cases currently in the Discovery phase.

Present the results in a conversational way, highlighting key insights like:
- Total number of cases
- Any patterns in filing dates
- Estimated values
- Brief mention of specific cases if relevant

Format the data as a table showing: Case Number, Title, Filing Date, and Estimated Value.`,
        sqlQuery: 'SELECT case_number, title, status, phase FROM projects WHERE case_type = \'Personal Injury\' AND status = \'Open\' AND phase = \'Discovery\''
      };
    }

    // Pattern 2: High medical expenses
    if (normalized.includes('medical expenses') || normalized.includes('medical costs')) {
      const threshold = 100000; // Extract from query in future
      const { data, error } = await supabase
        .from('projects')
        .select('case_number, title, status, custom_fields')
        .eq('case_type', 'Personal Injury')
        .filter('custom_fields->>medical_expenses', 'gt', threshold.toString());

      if (error) throw error;

      // Format data to include medical expenses
      const formattedData = data.map(row => ({
        case_number: row.case_number,
        title: row.title,
        status: row.status,
        medical_expenses: row.custom_fields?.medical_expenses || 0,
        injury_type: row.custom_fields?.injury_type || 'Unknown'
      }));

      return {
        type: 'sql',
        action: `Querying cases with medical expenses exceeding $${threshold.toLocaleString()}`,
        data: formattedData,
        prompt: `You are a legal assistant analyzing personal injury cases. The user asked: "${query}"

I found ${formattedData.length} cases where medical expenses exceed $${threshold.toLocaleString()}.

Present the results highlighting:
- Total number of matching cases
- Range of medical expenses
- Types of injuries
- Any notable high-value cases

Format as a table showing: Case Number, Title, Medical Expenses (formatted as currency), and Injury Type.`,
        sqlQuery: `SELECT case_number, title, custom_fields FROM projects WHERE case_type = 'Personal Injury' AND (custom_fields->>'medical_expenses')::numeric > ${threshold}`
      };
    }

    // Pattern 3: Count cases by type
    if (normalized.includes('how many') && (normalized.includes('cases') || normalized.includes('projects'))) {
      const { data, error } = await supabase
        .from('projects')
        .select('case_type, status');

      if (error) throw error;

      // Aggregate by type
      const byType: Record<string, number> = {};
      const byStatus: Record<string, number> = {};

      data.forEach(row => {
        byType[row.case_type] = (byType[row.case_type] || 0) + 1;
        byStatus[row.status] = (byStatus[row.status] || 0) + 1;
      });

      return {
        type: 'sql',
        action: 'Calculating case statistics',
        data: { total: data.length, byType, byStatus },
        prompt: `You are a legal assistant providing case statistics. The user asked: "${query}"

Total cases: ${data.length}

Cases by type: ${JSON.stringify(byType, null, 2)}
Cases by status: ${JSON.stringify(byStatus, null, 2)}

Present these statistics in a clear, conversational way. Highlight:
- Total number of cases
- Breakdown by case type (percentages would be helpful)
- Status distribution (Open vs. Closed vs. On Hold)
- Any notable patterns or insights

Use a friendly, professional tone.`,
        sqlQuery: 'SELECT case_type, status FROM projects'
      };
    }

    // Pattern 4: Upcoming deadlines
    if (normalized.includes('deadline') || normalized.includes('due')) {
      const now = new Date().toISOString();
      const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('calendar_entries')
        .select(`
          title,
          start_time,
          entry_type,
          projects (case_number, title)
        `)
        .eq('entry_type', 'Deadline')
        .gte('start_time', now)
        .lte('start_time', thirtyDaysLater)
        .order('start_time', { ascending: true })
        .limit(20);

      if (error) throw error;

      return {
        type: 'sql',
        action: 'Finding upcoming deadlines in the next 30 days',
        data: data,
        prompt: `You are a legal assistant managing deadlines. The user asked: "${query}"

I found ${data.length} upcoming deadlines in the next 30 days.

Present the results highlighting:
- Number of deadlines
- Most urgent deadlines (soonest)
- Cases with multiple deadlines
- Any deadlines this week

Format as a table showing: Case, Deadline, Due Date (formatted as human-readable date).`,
        sqlQuery: 'SELECT title, start_time FROM calendar_entries WHERE entry_type = \'Deadline\' AND start_time BETWEEN NOW() AND NOW() + INTERVAL \'30 days\''
      };
    }

    // Default: General query
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .limit(10);

    if (error) throw error;

    return {
      type: 'sql',
      action: 'Searching case database',
      data: data,
      prompt: `You are a legal assistant. The user asked: "${query}"

I couldn't match this to a specific query pattern, so I'm showing recent cases.

Help the user by:
1. Acknowledging their question
2. Explaining what data we have available
3. Suggesting how they could rephrase their query
4. Showing some sample data

Be helpful and guide them to ask more specific questions.`,
      sqlQuery: 'SELECT * FROM projects LIMIT 10'
    };

  } catch (error: any) {
    return {
      type: 'sql',
      action: 'Database query encountered an error',
      data: null,
      prompt: '',
      error: error.message
    };
  }
}

/**
 * Handle document search queries
 */
async function handleDocumentSearch(query: string): Promise<QueryResult> {
  // Extract search terms (remove common words)
  const searchTerms = query
    .toLowerCase()
    .replace(/search|find|documents?|for|about|containing|with|mentioning/g, '')
    .trim();

  try {
    // Use PostgreSQL full-text search
    const { data, error } = await supabase
      .from('documents')
      .select(`
        title,
        document_type,
        date_filed,
        projects (case_number, title)
      `)
      .textSearch('content', searchTerms, {
        type: 'websearch',
        config: 'english'
      })
      .limit(20);

    if (error) throw error;

    return {
      type: 'document_search',
      action: `Searching documents for "${searchTerms}"`,
      data: data,
      prompt: `You are a legal assistant helping with document search. The user asked: "${query}"

I searched through all documents for terms related to "${searchTerms}" and found ${data.length} matching documents.

Present the results:
- Total documents found
- Document types (Pleadings, Motions, etc.)
- Related cases
- Most relevant documents

Format as a table showing: Document Title, Type, Case, Date Filed.

If no results, suggest alternative search terms.`,
      sqlQuery: `SELECT title, document_type FROM documents WHERE to_tsvector('english', content) @@ websearch_to_tsquery('english', '${searchTerms}')`
    };

  } catch (error: any) {
    return {
      type: 'document_search',
      action: 'Document search encountered an error',
      data: null,
      prompt: '',
      error: error.message
    };
  }
}

/**
 * Handle general questions
 */
async function handleGeneralQuestion(query: string): Promise<QueryResult> {
  // For general questions, we'll provide context about the database
  // and let the LLM respond conversationally

  try {
    // Get some general stats for context
    const { data: projects } = await supabase
      .from('projects')
      .select('case_type, status')
      .limit(200);

    const stats = {
      totalCases: projects?.length || 0,
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>
    };

    projects?.forEach(p => {
      stats.byType[p.case_type] = (stats.byType[p.case_type] || 0) + 1;
      stats.byStatus[p.status] = (stats.byStatus[p.status] || 0) + 1;
    });

    return {
      type: 'general',
      action: 'Analyzing your question',
      data: stats,
      prompt: `You are LOIS, a helpful legal operations intelligence assistant.

The user asked: "${query}"

Context about our database:
- Total cases: ${stats.totalCases}
- Case types: ${Object.keys(stats.byType).join(', ')}
- Statuses: ${Object.keys(stats.byStatus).join(', ')}

Available data:
- Projects (legal cases) with details, custom fields, status
- Contacts (attorneys, clients, witnesses, experts)
- Documents (pleadings, motions, discovery, correspondence)
- Calendar entries (court dates, deadlines, meetings)
- Time entries and billing data
- Tasks and notes

Respond conversationally to their question. If you need more specific data to answer:
1. Acknowledge the question
2. Explain what information we have
3. Ask clarifying questions to help them get the data they need
4. Suggest specific queries they could try

Be friendly, professional, and helpful. You're here to make legal operations easier.`,
      sqlQuery: undefined
    };

  } catch (error: any) {
    return {
      type: 'general',
      action: 'Processing question',
      data: null,
      prompt: '',
      error: error.message
    };
  }
}

/**
 * Main router function
 */
export async function routeQuery(query: string): Promise<QueryResult> {
  // Classify the query
  const classification = classifyQuery(query);

  console.log('🔍 Query Classification:', classification);

  // Route to appropriate handler
  switch (classification.type) {
    case 'sql':
      return handleSQLQuery(query);

    case 'document_search':
      return handleDocumentSearch(query);

    case 'general':
      return handleGeneralQuestion(query);

    default:
      return handleGeneralQuestion(query);
  }
}

/**
 * Format result for display in chat
 */
export function formatResultForDisplay(result: QueryResult): {
  message: string;
  hasTable: boolean;
  tableData?: any[];
  error?: string;
} {
  if (result.error) {
    return {
      message: `I encountered an error: ${result.error}`,
      hasTable: false,
      error: result.error
    };
  }

  // For now, return structured data that the chat component can render
  // In Phase 4, we'll use the LLM to generate natural language responses
  return {
    message: result.prompt,
    hasTable: true,
    tableData: Array.isArray(result.data) ? result.data : [result.data]
  };
}
