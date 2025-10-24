/**
 * Saved Prompt Data Structure
 */
export interface SavedPrompt {
	id: string;
	title: string;
	description: string;
	promptText: string;
	category: 'search' | 'report' | 'analysis' | 'document' | 'general';
	tags: string[];
	createdAt: string;
	updatedAt: string;
	usageCount: number;
	isFavorite: boolean;
}

/**
 * Prompt Category Metadata
 */
export const PROMPT_CATEGORIES = {
	search: {
		label: 'Search',
		icon: 'search',
		color: '#2196F3',
		description: 'Find specific entities, cases, or contacts'
	},
	report: {
		label: 'Report',
		icon: 'document',
		color: '#FF9F66',
		description: 'Generate structured reports and summaries'
	},
	analysis: {
		label: 'Analysis',
		icon: 'chart',
		color: '#9C27B0',
		description: 'Analyze data and identify patterns'
	},
	document: {
		label: 'Document',
		icon: 'file',
		color: '#4CAF50',
		description: 'Search and analyze document content'
	},
	general: {
		label: 'General',
		icon: 'question',
		color: '#6F6F6F',
		description: 'General questions and queries'
	}
} as const;

/**
 * Example/Default Prompts
 */
export const DEFAULT_PROMPTS: SavedPrompt[] = [
	{
		id: 'prompt-1',
		title: 'High Medical Expenses',
		description: 'Find all personal injury cases with medical expenses exceeding $100,000',
		promptText: 'Show me all personal injury cases where medical expenses exceed $100,000',
		category: 'report',
		tags: ['personal injury', 'medical expenses', 'high value'],
		createdAt: '2025-10-20T10:00:00Z',
		updatedAt: '2025-10-20T10:00:00Z',
		usageCount: 12,
		isFavorite: true
	},
	{
		id: 'prompt-2',
		title: 'Discovery Phase Cases',
		description: 'List all open cases currently in the discovery phase',
		promptText: 'Show me all open cases in the discovery phase',
		category: 'report',
		tags: ['discovery', 'active cases', 'phase'],
		createdAt: '2025-10-20T10:00:00Z',
		updatedAt: '2025-10-20T10:00:00Z',
		usageCount: 8,
		isFavorite: true
	},
	{
		id: 'prompt-3',
		title: 'Upcoming Depositions',
		description: 'Find all depositions scheduled in the next 30 days',
		promptText: 'What depositions are scheduled in the next 30 days?',
		category: 'report',
		tags: ['depositions', 'schedule', 'upcoming'],
		createdAt: '2025-10-20T10:00:00Z',
		updatedAt: '2025-10-20T10:00:00Z',
		usageCount: 15,
		isFavorite: true
	},
	{
		id: 'prompt-4',
		title: 'Find Contact',
		description: 'Quick search for a specific contact by name',
		promptText: '[CONTACT NAME]',
		category: 'search',
		tags: ['contact', 'person', 'search'],
		createdAt: '2025-10-20T10:00:00Z',
		updatedAt: '2025-10-20T10:00:00Z',
		usageCount: 25,
		isFavorite: false
	},
	{
		id: 'prompt-5',
		title: 'Case by Number',
		description: 'Look up a specific case by its case number',
		promptText: '[CASE NUMBER]',
		category: 'search',
		tags: ['case', 'number', 'lookup'],
		createdAt: '2025-10-20T10:00:00Z',
		updatedAt: '2025-10-20T10:00:00Z',
		usageCount: 18,
		isFavorite: false
	},
	{
		id: 'prompt-6',
		title: 'Settlement Analysis',
		description: 'Analyze settlement patterns and amounts across cases',
		promptText: 'Analyze all settlements in the past year and identify patterns by case type',
		category: 'analysis',
		tags: ['settlement', 'patterns', 'analysis'],
		createdAt: '2025-10-20T10:00:00Z',
		updatedAt: '2025-10-20T10:00:00Z',
		usageCount: 5,
		isFavorite: false
	},
	{
		id: 'prompt-7',
		title: 'Document Search',
		description: 'Search for specific terms across all case documents',
		promptText: 'Search all documents for [SEARCH TERM]',
		category: 'document',
		tags: ['documents', 'search', 'full-text'],
		createdAt: '2025-10-20T10:00:00Z',
		updatedAt: '2025-10-20T10:00:00Z',
		usageCount: 10,
		isFavorite: true
	},
	{
		id: 'prompt-8',
		title: 'Inactive Clients',
		description: 'Find clients with no recent activity or communications',
		promptText: 'Show me all clients with no communications in the past 60 days',
		category: 'report',
		tags: ['clients', 'inactive', 'follow-up'],
		createdAt: '2025-10-20T10:00:00Z',
		updatedAt: '2025-10-20T10:00:00Z',
		usageCount: 6,
		isFavorite: false
	}
];
