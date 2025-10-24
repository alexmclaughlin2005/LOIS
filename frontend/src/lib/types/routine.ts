/**
 * Routine Data Structure
 */
export interface Routine {
	id: string;
	name: string;
	description: string;
	prompt: string; // The query to execute
	schedule: string;
	repeat?: string; // Daily, Weekly, Monthly
	every?: string; // 1 Week, 2 Weeks, etc
	on?: string; // Mon, Tue, Wed, etc
	at?: string; // Time
	type?: 'Prompt' | 'Report' | 'Alert';
	lastRun?: string;
	organization?: string;
	isPromoted?: boolean;
	subroutines?: Array<Subroutine>;
}

export interface Subroutine {
	id?: string;
	name: string;
	prompt: string;
	schedule: string;
}

/**
 * Default/Sample Routines
 */
export const DEFAULT_ROUTINES: Routine[] = [
	{
		id: 'routine-1',
		name: 'Meds > $100k',
		description: 'Finds all cases where medical expenses exceed $100,000.',
		prompt: 'Show me all cases where medical expenses exceed $100,000',
		schedule: 'Weekly on Friday',
		repeat: 'Weekly',
		every: '1 Week',
		on: 'Fri',
		at: '9:00AM',
		type: 'Report',
		lastRun: 'Oct 18, 2025'
	},
	{
		id: 'routine-2',
		name: 'Depos Next Month',
		description: 'Lists all depositions scheduled for the upcoming month.',
		prompt: 'What depositions are scheduled in the next 30 days?',
		schedule: 'Monthly on 1st',
		repeat: 'Monthly',
		every: '1 Month',
		on: 'Mon',
		at: '8:00AM',
		type: 'Report',
		lastRun: 'Oct 1, 2025'
	},
	{
		id: 'routine-3',
		name: 'Inactive Clients',
		description: 'Alerts for clients with no communications in 60 days.',
		prompt: 'Show me all clients with no communications in the past 60 days',
		schedule: 'Every Monday',
		repeat: 'Weekly',
		every: '1 Week',
		on: 'Mon',
		at: '9:00AM',
		type: 'Alert',
		lastRun: 'Oct 21, 2025'
	},
	{
		id: 'routine-4',
		name: 'Settlement Offers',
		description: 'Track and report on all pending settlement offers and negotiations.',
		prompt: 'Show me all cases with pending settlement offers',
		schedule: 'Weekly on Tuesday',
		repeat: 'Weekly',
		every: '1 Week',
		on: 'Tue',
		at: '10:00AM',
		type: 'Report',
		lastRun: 'Oct 22, 2025'
	},
	{
		id: 'routine-5',
		name: 'Trial Prep Checklist',
		description: 'Monitor trial preparation tasks and upcoming court appearances.',
		prompt: 'Show me all cases with upcoming trial dates in the next 14 days',
		schedule: 'Daily at 8:00 AM',
		repeat: 'Daily',
		every: '1 Day',
		on: 'Mon',
		at: '8:00AM',
		type: 'Report',
		lastRun: 'Oct 23, 2025'
	},
	{
		id: 'routine-6',
		name: 'Statute of Limitations',
		description: 'Alert on cases approaching statute of limitations deadlines.',
		prompt: 'Show me all cases where statute of limitations expires in the next 90 days',
		schedule: 'Daily at 7:00 AM',
		repeat: 'Daily',
		every: '1 Day',
		on: 'Mon',
		at: '7:00AM',
		type: 'Alert',
		lastRun: 'Oct 23, 2025'
	},
	{
		id: 'routine-7',
		name: 'New Case Intake',
		description: 'Summary of new cases received and initial consultation schedules.',
		prompt: 'Show me all cases created in the past 7 days',
		schedule: 'Every Monday at 9:00 AM',
		repeat: 'Weekly',
		every: '1 Week',
		on: 'Mon',
		at: '9:00AM',
		type: 'Report',
		lastRun: 'Oct 21, 2025'
	},
	{
		id: 'routine-8',
		name: 'High Value Cases',
		description: 'Track cases with potential settlement value over $500k.',
		prompt: 'Show me all cases where estimated settlement value exceeds $500,000',
		schedule: 'Monthly on 15th',
		repeat: 'Monthly',
		every: '1 Month',
		on: 'Mon',
		at: '9:00AM',
		type: 'Report',
		lastRun: 'Oct 15, 2025'
	},
	{
		id: 'routine-9',
		name: 'Discovery Phase Cases',
		description: 'All open cases currently in the discovery phase',
		prompt: 'Show me all open cases in the discovery phase',
		schedule: 'Weekly on Monday',
		repeat: 'Weekly',
		every: '1 Week',
		on: 'Mon',
		at: '9:00AM',
		type: 'Report',
		lastRun: 'Oct 21, 2025'
	}
];
