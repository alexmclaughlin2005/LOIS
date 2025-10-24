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
      prompt: `Found ${resultData?.length || 0} result${resultData?.length === 1 ? '' : 's'} for: "${query}"`,
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
          file_size_kb,
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
        prompt: `Found ${data?.length || 0} document${data?.length === 1 ? '' : 's'} across ${caseNumbers.length} case${caseNumbers.length === 1 ? '' : 's'}.`,
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
        prompt: `Found ${data?.length || 0} document${data?.length === 1 ? '' : 's'} matching "${searchTerms}".`,
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
    // Check if query mentions documents and we have case context
    const isDocumentQuery = /document|file|pleading|motion|brief|contract|correspondence/i.test(query);
    let documentData = null;
    let caseNumbers: string[] = [];

    if (isDocumentQuery && context?.previousResult && Array.isArray(context.previousResult)) {
      // Extract case numbers from previous results
      // Handle different result structures:
      // 1. Direct case queries: { case_number: "CV-2025-001" }
      // 2. Document queries: { projects: { case_number: "CV-2025-001" } }
      // 3. Document results with project_id: use project_id to get case_number
      caseNumbers = context.previousResult
        .map(row => {
          // Try direct case_number first
          if (row.case_number) return row.case_number;
          // Try nested projects.case_number
          if (row.projects?.case_number) return row.projects.case_number;
          // If we have project_id but no case_number, we'll need to fetch it
          return null;
        })
        .filter(Boolean);

      console.log('📄 Fetching documents for context:', caseNumbers);

      if (caseNumbers.length > 0) {
        // First, get project IDs for these case numbers
        const { data: projects, error: projectError } = await supabase
          .from('projects')
          .select('id, case_number')
          .in('case_number', caseNumbers);

        if (!projectError && projects && projects.length > 0) {
          const projectIds = projects.map(p => p.id);
          console.log('✅ Found', projectIds.length, 'project IDs for cases:', caseNumbers);

          // Now fetch documents for these project IDs
          const { data: docs, error: docsError } = await supabase
            .from('documents')
            .select(`
              id,
              title,
              document_type,
              content,
              date_filed,
              file_size_kb,
              project_id,
              projects!inner (case_number, title)
            `)
            .in('project_id', projectIds)
            .order('date_filed', { ascending: false })
            .limit(20);

          if (!docsError && docs) {
            documentData = docs;
            console.log('✅ Fetched', docs.length, 'documents for analysis');
          } else if (docsError) {
            console.error('❌ Error fetching documents:', docsError);
          }
        } else if (projectError) {
          console.error('❌ Error fetching projects:', projectError);
        }
      }
    }

    // If we have document data, return it for LLM analysis
    if (documentData && documentData.length > 0) {
      return {
        type: 'general',
        action: `Analyzing ${documentData.length} documents for ${caseNumbers.length} case(s)`,
        data: documentData,
        prompt: `You are LOIS, a legal operations intelligence assistant.

User query: "${query}"

Data source: Document database for case(s): ${caseNumbers.join(', ')}

Documents retrieved (${documentData.length}):
${documentData.map((doc: any, idx: number) => `
${idx + 1}. **${doc.title}** (${doc.document_type})
   - Case: ${doc.projects?.case_number}
   - Filed: ${doc.date_filed || 'Unknown'}
   - Content: ${doc.content?.substring(0, 500) || 'No content'}...
`).join('\n')}

Analyze and respond to the user's request based on these documents.`,
        sqlQuery: undefined
      };
    }

    // No document context - provide general guidance
    return {
      type: 'general',
      action: 'Analyzing your question',
      data: null,
      prompt: `You are LOIS, a legal operations intelligence assistant.

User query: "${query}"

Data source: General database query

I don't have specific data loaded for this query. Help the user by:
1. Acknowledging their question
2. Suggesting specific queries they could ask to get the data they need
3. Being helpful and professional

Available data types: cases, contacts, documents, calendar entries, time entries, tasks, notes.`,
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

  // Check if we have valid data to display in a table
  if (result.data === null || result.data === undefined) {
    return {
      message: result.prompt,
      hasTable: false
    };
  }

  return {
    message: result.prompt,
    hasTable: true,
    tableData: Array.isArray(result.data) ? result.data : [result.data]
  };
}
