import { supabase } from './supabase';

/**
 * Query open personal injury cases in discovery phase
 */
export async function getOpenPersonalInjuryCases() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('case_type', 'Personal Injury')
    .eq('status', 'Open')
    .eq('phase', 'Discovery');

  if (error) {
    console.error('Error fetching PI cases:', error);
    return [];
  }

  return data || [];
}

/**
 * Query cases with high medical expenses (>$100k)
 */
export async function getCasesWithHighMedicalExpenses() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('case_type', 'Personal Injury')
    .filter('custom_fields->>medical_expenses', 'gt', '100000')
    .order('custom_fields->>medical_expenses', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching high expense cases:', error);
    return [];
  }

  return data || [];
}

/**
 * Get all projects with optional filters
 */
export async function getProjects(filters: {
  caseType?: string;
  status?: string;
  limit?: number;
} = {}) {
  let query = supabase.from('projects').select('*');

  if (filters.caseType) {
    query = query.eq('case_type', filters.caseType);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
}

/**
 * Search projects by title or case number
 */
export async function searchProjects(searchTerm: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .or(`title.ilike.%${searchTerm}%,case_number.ilike.%${searchTerm}%`)
    .limit(20);

  if (error) {
    console.error('Error searching projects:', error);
    return [];
  }

  return data || [];
}

/**
 * Get upcoming deadlines (next 30 days)
 */
export async function getUpcomingDeadlines() {
  const now = new Date().toISOString();
  const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('calendar_entries')
    .select(`
      *,
      projects (case_number, title)
    `)
    .eq('entry_type', 'Deadline')
    .gte('start_time', now)
    .lte('start_time', thirtyDaysLater)
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching deadlines:', error);
    return [];
  }

  return data || [];
}

/**
 * Get billing summary for a project
 */
export async function getProjectBillingSummary(projectId: string) {
  const { data, error } = await supabase
    .from('time_entries')
    .select('hours, total_amount, is_billable')
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching billing summary:', error);
    return null;
  }

  const billableEntries = data.filter(entry => entry.is_billable);
  const totalHours = billableEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const totalAmount = billableEntries.reduce((sum, entry) => sum + entry.total_amount, 0);

  return {
    totalHours,
    totalAmount,
    entryCount: billableEntries.length
  };
}

/**
 * Get case statistics
 */
export async function getCaseStatistics() {
  // Get total counts by case type
  const { data, error } = await supabase
    .from('projects')
    .select('case_type, status');

  if (error) {
    console.error('Error fetching statistics:', error);
    return null;
  }

  const stats = {
    total: data.length,
    byType: {} as Record<string, number>,
    byStatus: {} as Record<string, number>
  };

  data.forEach(project => {
    stats.byType[project.case_type] = (stats.byType[project.case_type] || 0) + 1;
    stats.byStatus[project.status] = (stats.byStatus[project.status] || 0) + 1;
  });

  return stats;
}
