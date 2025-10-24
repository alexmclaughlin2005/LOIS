/**
 * Query Router
 *
 * Routes queries to appropriate handlers based on LLM classification
 * and provides LLM with context-aware prompts
 */

import type { QueryType } from './queryClassifier';
import { supabase } from './supabase';

export interface QueryContext {
  previousQuery?: string;
  previousResult?: any;
  previousSql?: string;
  conversationHistory?: Array<{ query: string; result: any }>;
}

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
 * Handle SQL-style queries using LLM to generate SQL
 */
async function handleSQLQuery(query: string, context?: QueryContext): Promise<QueryResult> {
  try {
    // Step 1: Use LLM to generate SQL from natural language
    console.log('🤖 Requesting SQL generation from LLM...');
    const generateResponse = await fetch('/api/generate-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, context })
    });

    if (!generateResponse.ok) {
      throw new Error('Failed to generate SQL query');
    }

    const generateData = await generateResponse.json();
    console.log('📦 Generate API Response:', generateData);

    const { success, sql, explanation, estimatedRows, error } = generateData;

    if (!success || error) {
      throw new Error(error || 'Failed to generate SQL query');
    }

    if (!sql || typeof sql !== 'string') {
      console.error('❌ Invalid SQL from generate API:', { sql, type: typeof sql });
      throw new Error('Generated SQL is invalid');
    }

    console.log('✅ Generated SQL:', sql);
    console.log('📝 Explanation:', explanation);

    // Step 2: Execute the generated SQL query via API
    const executePayload = { sql };
    console.log('📤 Sending to execute API:', executePayload);

    const executeResponse = await fetch('/api/execute-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(executePayload)
    });

    if (!executeResponse.ok) {
      const errorData = await executeResponse.json();
      throw new Error(errorData.error || 'Failed to execute query');
    }

    const { success: execSuccess, data: resultData, error: execError } = await executeResponse.json();

    if (!execSuccess || execError) {
      throw new Error(execError || 'Query execution failed');
    }

    console.log('✅ Query executed successfully, rows:', resultData?.length || 0);

    return {
      type: 'sql',
      action: explanation,
      data: resultData,
      prompt: `You are a legal assistant. The user asked: "${query}"

The system generated and executed this SQL query:
\`\`\`sql
${sql}
\`\`\`

Results: ${resultData?.length || 0} rows returned.

Present the results in a clear, conversational way highlighting:
- Key statistics and insights
- Notable patterns or trends
- Any important findings
- Actionable information

Be professional, concise, and helpful.`,
      sqlQuery: sql
    };

  } catch (error: any) {
    console.error('❌ SQL Query Error:', error);
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
async function handleDocumentSearch(query: string, context?: QueryContext): Promise<QueryResult> {
  try {
    // Check if we have context with case numbers
    let caseNumbers: string[] = [];
    if (context?.previousResult && Array.isArray(context.previousResult)) {
      // Extract case numbers from previous results
      caseNumbers = context.previousResult
        .map(row => row.case_number)
        .filter(Boolean);

      console.log('📋 Filtering documents by previous cases:', caseNumbers);
    }

    let data, error;

    if (caseNumbers.length > 0) {
      // Query documents for specific cases from context
      const result = await supabase
        .from('documents')
        .select(`
          id,
          title,
          document_type,
          date_filed,
          file_size,
          projects!inner (case_number, title)
        `)
        .in('projects.case_number', caseNumbers)
        .order('date_filed', { ascending: false })
        .limit(50);

      data = result.data;
      error = result.error;

      if (error) throw error;

      return {
        type: 'document_search',
        action: `Finding documents for ${caseNumbers.length} case(s) from previous result`,
        data: data,
        prompt: `You are a legal assistant helping with document search. The user asked: "${query}"

Based on the previous query results, I found documents for these ${caseNumbers.length} cases: ${caseNumbers.join(', ')}

Found ${data?.length || 0} documents.

Present the results:
- Total documents found for these cases
- Breakdown by document type
- Breakdown by case
- Most recent documents

Format as a table showing: Case Number, Document Title, Type, Date Filed.

Be professional and helpful.`,
        sqlQuery: `SELECT d.title, d.document_type, p.case_number FROM documents d JOIN projects p ON d.project_id = p.id WHERE p.case_number IN (${caseNumbers.map(cn => `'${cn}'`).join(', ')})`
      };

    } else {
      // No context - fall back to text search
      const searchTerms = query
        .toLowerCase()
        .replace(/search|find|documents?|for|about|containing|with|mentioning|related|these|those|this|that|cases?/g, '')
        .trim();

      const result = await supabase
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

      data = result.data;
      error = result.error;

      if (error) throw error;

      return {
        type: 'document_search',
        action: `Searching documents for "${searchTerms}"`,
        data: data,
        prompt: `You are a legal assistant helping with document search. The user asked: "${query}"

I searched through all documents for terms related to "${searchTerms}" and found ${data?.length || 0} matching documents.

Present the results:
- Total documents found
- Document types (Pleadings, Motions, etc.)
- Related cases
- Most relevant documents

Format as a table showing: Document Title, Type, Case, Date Filed.

If no results, suggest alternative search terms.`,
        sqlQuery: `SELECT title, document_type FROM documents WHERE to_tsvector('english', content) @@ websearch_to_tsquery('english', '${searchTerms}')`
      };
    }

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
async function handleGeneralQuestion(query: string, context?: QueryContext): Promise<QueryResult> {
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
 * Main router function - now uses LLM for classification
 */
export async function routeQuery(query: string, context?: QueryContext): Promise<QueryResult> {
  try {
    // Use LLM to classify the query
    console.log('🔍 Routing query:', query);
    if (context?.previousQuery) {
      console.log('📜 Previous query:', context.previousQuery);
      console.log('📊 Previous result count:', Array.isArray(context.previousResult) ? context.previousResult.length : 'N/A');
    }

    const classifyResponse = await fetch('/api/classify-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, context })
    });

    if (!classifyResponse.ok) {
      throw new Error('Failed to classify query');
    }

    const { success, type, confidence, reasoning, error } = await classifyResponse.json();

    if (!success || error) {
      throw new Error(error || 'Classification failed');
    }

    console.log(`🔍 Query Classification: ${type} (confidence: ${confidence})`);
    console.log(`💭 Reasoning: ${reasoning}`);

    // Route to appropriate handler
    switch (type) {
      case 'sql':
        return handleSQLQuery(query, context);

      case 'document_search':
        return handleDocumentSearch(query, context);

      case 'general':
        return handleGeneralQuestion(query, context);

      default:
        return handleGeneralQuestion(query, context);
    }
  } catch (error: any) {
    console.error('❌ Routing error:', error);
    // Fallback to general question handler if classification fails
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
