<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { marked } from 'marked';
	import ResultsView from '$lib/components/ResultsView.svelte';
	import DataPreviewCard from '$lib/components/DataPreviewCard.svelte';
	import DataLoadingSkeleton from '$lib/components/DataLoadingSkeleton.svelte';
	import RoutineCreationCard from '$lib/components/RoutineCreationCard.svelte';
	import RoutinesLibrary from '$lib/components/RoutinesLibrary.svelte';
	import QueryProcessingIndicator from '$lib/components/QueryProcessingIndicator.svelte';
	import ResultsRenderer from '$lib/components/results/ResultsRenderer.svelte';
	import { testConnection } from '$lib/supabase';
	import { getOpenPersonalInjuryCases, getCasesWithHighMedicalExpenses } from '$lib/queries';
	import { routeQuery, formatResultForDisplay } from '$lib/queryRouter';
	import type { QueryType } from '$lib/queryClassifier';

	// Configure marked options
	marked.setOptions({
		breaks: true,
		gfm: true
	});

	// LOIS Chat Interface
	type Message = {
		role: 'user' | 'assistant';
		content: string;
		displayContent?: string; // Content to display (without JSON)
		hasStructuredData?: boolean;
		structuredData?: {
			title: string;
			subtitle: string;
			data: Array<Record<string, any>>;
		};
		sqlQuery?: string; // The SQL query that was executed (optional)
		showActionButton?: boolean;
		actionButtonText?: string;
		actionButtonCallback?: () => void;
		actionButtons?: Array<{
			text: string;
			callback: () => void;
			primary?: boolean;
		}>;
		showRoutineCreation?: boolean;
		routineCreationData?: {
			onSave: (routine: any) => void;
			onCancel: () => void;
		};
	};

	let messages: Array<Message> = [];
	let isThinking = false;
	let inputValue = '';
	let streamingContent = '';
	let streamingDisplayContent = ''; // Content to display (formatted, without raw JSON)
	let isStreaming = false;
	let isStreamingJSON = false; // Flag for when we're streaming JSON
	let isProcessingData = false; // Flag for when we detect JSON and are processing it

	// Conversation context tracking
	let lastQueryResult: any = null;
	let lastQuerySql: string | undefined = undefined;
	let lastQuery: string = '';
	let showResultsView = false;
	let currentResultsData: { title: string; subtitle: string; data: Array<Record<string, any>> } | null = null;
	let showRoutinesLibrary = false;

	// Demo mode: track conversation state for hardcoded demo flow
	let demoMode = false; // Set to false to use query router
	let demoState: 'initial' | 'showing_42_cases' | 'awaiting_followup' = 'initial';

	// Query processing state
	let currentQueryType: QueryType | null = null;
	let currentQueryAction: string = '';

	// Query pattern tracking for routine suggestions
	interface QueryPattern {
		topic: string; // e.g., "personal_injury_discovery", "high_medical_expenses"
		queries: string[]; // List of similar queries
		lastSQL: string; // The most recent SQL for this pattern
	}
	let queryPatterns: QueryPattern[] = [];
	let routineSuggestionShown = false; // Prevent multiple suggestions in same session

	// Test database connection on mount
	onMount(async () => {
		console.log('🔌 Testing Supabase connection...');
		const connected = await testConnection();

		if (connected) {
			// Test queries
			const piCases = await getOpenPersonalInjuryCases();
			const highExpenseCases = await getCasesWithHighMedicalExpenses();

			console.log(`📊 Found ${piCases.length} open PI cases in discovery`);
			console.log(`💰 Found ${highExpenseCases.length} cases with medical expenses >$100k`);
		}

		// Check if there's a query parameter from the homepage
		const query = $page.url.searchParams.get('q');
		if (query) {
			console.log('📥 Auto-executing query from homepage:', query);
			inputValue = query;
			// Wait a bit for the UI to be ready, then send the message
			setTimeout(() => {
				sendMessage();
			}, 100);
		}
	});

	// Demo data for first interaction (42 cases)
	const demo42Cases = [
		{ project: 'Ava Thompson', type: 'Personal Injury', phase: 'Discovery', primary: 'Daniel Ruiz' },
		{ project: 'Billy Snead', type: 'Personal Injury', phase: 'Discovery', primary: 'Rachel Hegmann' },
		{ project: 'Sofia Nguyen', type: 'Personal Injury', phase: 'Discovery', primary: 'Mary Berry' },
		{ project: 'James Wilson', type: 'Personal Injury', phase: 'Discovery', primary: 'Sarah Johnson' },
		{ project: 'Maria Garcia', type: 'Personal Injury', phase: 'Discovery', primary: 'Daniel Ruiz' },
		{ project: 'Robert Chen', type: 'Personal Injury', phase: 'Discovery', primary: 'Rachel Hegmann' },
		{ project: 'Jennifer Lee', type: 'Personal Injury', phase: 'Discovery', primary: 'Mary Berry' },
		{ project: 'Michael Davis', type: 'Personal Injury', phase: 'Discovery', primary: 'Sarah Johnson' },
		{ project: 'Sarah Brown', type: 'Personal Injury', phase: 'Discovery', primary: 'Daniel Ruiz' },
		{ project: 'David Miller', type: 'Personal Injury', phase: 'Discovery', primary: 'Rachel Hegmann' },
		{ project: 'Lisa Anderson', type: 'Personal Injury', phase: 'Discovery', primary: 'Mary Berry' },
		{ project: 'William Taylor', type: 'Personal Injury', phase: 'Discovery', primary: 'Sarah Johnson' },
		{ project: 'Emily Thomas', type: 'Personal Injury', phase: 'Discovery', primary: 'Daniel Ruiz' },
		{ project: 'John Martinez', type: 'Personal Injury', phase: 'Discovery', primary: 'Rachel Hegmann' },
		{ project: 'Jessica White', type: 'Personal Injury', phase: 'Discovery', primary: 'Mary Berry' },
		{ project: 'Christopher Lee', type: 'Personal Injury', phase: 'Discovery', primary: 'Sarah Johnson' },
		{ project: 'Amanda Harris', type: 'Personal Injury', phase: 'Discovery', primary: 'Daniel Ruiz' },
		{ project: 'Matthew Clark', type: 'Personal Injury', phase: 'Discovery', primary: 'Rachel Hegmann' },
		{ project: 'Ashley Lewis', type: 'Personal Injury', phase: 'Discovery', primary: 'Mary Berry' },
		{ project: 'Daniel Walker', type: 'Personal Injury', phase: 'Discovery', primary: 'Sarah Johnson' },
		{ project: 'Stephanie Hall', type: 'Personal Injury', phase: 'Discovery', primary: 'Daniel Ruiz' },
		{ project: 'Ryan Allen', type: 'Personal Injury', phase: 'Discovery', primary: 'Rachel Hegmann' },
		{ project: 'Nicole Young', type: 'Personal Injury', phase: 'Discovery', primary: 'Mary Berry' },
		{ project: 'Kevin King', type: 'Personal Injury', phase: 'Discovery', primary: 'Sarah Johnson' },
		{ project: 'Rachel Wright', type: 'Personal Injury', phase: 'Discovery', primary: 'Daniel Ruiz' },
		{ project: 'Brandon Scott', type: 'Personal Injury', phase: 'Discovery', primary: 'Rachel Hegmann' },
		{ project: 'Megan Green', type: 'Personal Injury', phase: 'Discovery', primary: 'Mary Berry' },
		{ project: 'Justin Adams', type: 'Personal Injury', phase: 'Discovery', primary: 'Sarah Johnson' },
		{ project: 'Lauren Baker', type: 'Personal Injury', phase: 'Discovery', primary: 'Daniel Ruiz' },
		{ project: 'Tyler Nelson', type: 'Personal Injury', phase: 'Discovery', primary: 'Rachel Hegmann' },
		{ project: 'Hannah Carter', type: 'Personal Injury', phase: 'Discovery', primary: 'Mary Berry' },
		{ project: 'Jordan Mitchell', type: 'Personal Injury', phase: 'Discovery', primary: 'Sarah Johnson' },
		{ project: 'Brittany Perez', type: 'Personal Injury', phase: 'Discovery', primary: 'Daniel Ruiz' },
		{ project: 'Austin Roberts', type: 'Personal Injury', phase: 'Discovery', primary: 'Rachel Hegmann' },
		{ project: 'Samantha Turner', type: 'Personal Injury', phase: 'Discovery', primary: 'Mary Berry' },
		{ project: 'Dylan Phillips', type: 'Personal Injury', phase: 'Discovery', primary: 'Sarah Johnson' },
		{ project: 'Victoria Campbell', type: 'Personal Injury', phase: 'Discovery', primary: 'Daniel Ruiz' },
		{ project: 'Nathan Parker', type: 'Personal Injury', phase: 'Discovery', primary: 'Rachel Hegmann' },
		{ project: 'Alexis Evans', type: 'Personal Injury', phase: 'Discovery', primary: 'Mary Berry' },
		{ project: 'Jacob Edwards', type: 'Personal Injury', phase: 'Discovery', primary: 'Sarah Johnson' },
		{ project: 'Olivia Collins', type: 'Personal Injury', phase: 'Discovery', primary: 'Daniel Ruiz' },
		{ project: 'Ethan Stewart', type: 'Personal Injury', phase: 'Discovery', primary: 'Rachel Hegmann' }
	];

	// Demo data for second interaction (3 cases with high medical expenses)
	const demo3Cases = [
		{ project: 'Ava Thompson', type: 'Personal Injury', phase: 'Discovery', primary: 'Daniel Ruiz', created_date: '10/15/2024' },
		{ project: 'Robert Chen', type: 'Personal Injury', phase: 'Discovery', primary: 'Rachel Hegmann', created_date: '10/17/2024' },
		{ project: 'Michael Davis', type: 'Personal Injury', phase: 'Discovery', primary: 'Sarah Johnson', created_date: '10/18/2024' }
	];

	// Function to check if query matches demo pattern
	function matchesDemoQuery(query: string): 'first' | 'second' | null {
		const normalized = query.toLowerCase().trim();

		// First query: "How many open personal injury cases are currently in the discovery phase?"
		if (
			(normalized.includes('how many') || normalized.includes('show me')) &&
			normalized.includes('personal injury') &&
			normalized.includes('discovery')
		) {
			return 'first';
		}

		// Second query: "Can you show me which of these cases have medical expenses exceed $100,000 this week?"
		if (
			(normalized.includes('which') || normalized.includes('show me')) &&
			(normalized.includes('medical expense') || normalized.includes('medical cost')) &&
			(normalized.includes('$100') || normalized.includes('100,000') || normalized.includes('100000'))
		) {
			return 'second';
		}

		return null;
	}

	// Function to extract display content (text without JSON)
	function extractDisplayContent(content: string): string {
		// Remove JSON arrays from content
		let displayText = content;

		// Remove JSON code blocks
		displayText = displayText.replace(/```json\s*[\s\S]*?\s*```/g, '');

		// Remove plain JSON arrays
		const startIdx = displayText.indexOf('[');
		if (startIdx !== -1) {
			let depth = 0;
			let endIdx = -1;
			for (let i = startIdx; i < displayText.length; i++) {
				if (displayText[i] === '[') depth++;
				if (displayText[i] === ']') {
					depth--;
					if (depth === 0) {
						endIdx = i + 1;
						break;
					}
				}
			}
			if (endIdx !== -1) {
				displayText = displayText.substring(0, startIdx) + displayText.substring(endIdx);
			}
		}

		// Clean up extra whitespace and newlines
		displayText = displayText.trim();

		return displayText;
	}

	// Function to detect if response contains structured data
	function detectStructuredData(content: string): { title: string; subtitle: string; data: Array<Record<string, any>> } | null {
		// Try to detect JSON code blocks first
		const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
		if (jsonMatch) {
			try {
				const parsed = JSON.parse(jsonMatch[1]);
				if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
					console.log('Detected JSON code block:', parsed);
					return {
						title: 'Query Results',
						subtitle: 'Table ⋅ Version 1',
						data: parsed
					};
				}
			} catch (e) {
				console.error('Failed to parse JSON code block:', e);
			}
		}

		// Try to detect plain JSON arrays (most greedy match)
		try {
			// Find the start of a JSON array
			const startIdx = content.indexOf('[');
			if (startIdx !== -1) {
				// Try to find matching closing bracket
				let depth = 0;
				let endIdx = -1;
				for (let i = startIdx; i < content.length; i++) {
					if (content[i] === '[') depth++;
					if (content[i] === ']') {
						depth--;
						if (depth === 0) {
							endIdx = i + 1;
							break;
						}
					}
				}

				if (endIdx !== -1) {
					const jsonStr = content.substring(startIdx, endIdx);
					console.log('Attempting to parse JSON substring:', jsonStr.substring(0, 100) + '...');
					const parsed = JSON.parse(jsonStr);
					if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
						console.log('Successfully detected JSON array:', parsed);
						return {
							title: 'Query Results',
							subtitle: 'Table ⋅ Version 1',
							data: parsed
						};
					}
				}
			}
		} catch (e) {
			console.error('Failed to parse plain JSON array:', e);
		}

		console.log('No structured data detected');
		return null;
	}

	// Test function to show sample data matching Figma design
	function showSampleData() {
		const sampleData = [
			{ project: 'Ava Thompson', type: 'Personal Injury', phase: 'Discovery', primary: 'Daniel Ruiz' },
			{ project: 'Billy Snead', type: 'Personal Injury', phase: 'Discovery', primary: 'Rachel Hegmann' },
			{ project: 'Sofia Nguyen', type: 'Personal Injury', phase: 'Discovery', primary: 'Mary Berry' },
			{ project: 'Billy Snead', type: 'Personal Injury', phase: 'Potential New Client', primary: 'Mary Berry' },
			{ project: 'Billy Snead', type: 'Personal Injury', phase: 'Potential New Client', primary: 'Mary Berry' },
			{ project: 'Billy Snead', type: 'Personal Injury', phase: 'Potential New Client', primary: 'Mary Berry' },
			{ project: 'Billy Snead', type: 'Personal Injury', phase: 'Potential New Client', primary: 'Mary Berry' },
			{ project: 'Billy Snead', type: 'Personal Injury', phase: 'Potential New Client', primary: 'Mary Berry' },
			{ project: 'Billy Snead', type: 'Personal Injury', phase: 'Potential New Client', primary: 'Mary Berry' },
			{ project: 'Billy Snead', type: 'Personal Injury', phase: 'Potential New Client', primary: 'Mary Berry' },
			{ project: 'Billy Snead', type: 'Personal Injury', phase: 'Potential New Client', primary: 'Mary Berry' },
			{ project: 'Billy Snead', type: 'Personal Injury', phase: 'Potential New Client', primary: 'Mary Berry' }
		];

		currentResultsData = {
			title: 'Personal Injury Cases in Discovery Phase',
			subtitle: 'Table ⋅ Version 1',
			data: sampleData
		};
		showResultsView = true;
	}

	function handleCloseResults() {
		showResultsView = false;
		currentResultsData = null;
	}

	/**
	 * Extract a topic/pattern from SQL query for pattern matching
	 */
	function extractQueryTopic(sql: string, userQuery: string): string {
		const sqlLower = sql.toLowerCase();
		const queryLower = userQuery.toLowerCase();

		// Extract key phrases that indicate what the query is about
		let topic = '';

		// Check for case types
		if (sqlLower.includes("case_type = 'personal injury'")) topic += 'personal_injury_';
		if (sqlLower.includes("case_type = 'corporate'")) topic += 'corporate_';
		if (sqlLower.includes("case_type = 'family law'")) topic += 'family_law_';

		// Check for status
		if (sqlLower.includes("status = 'open'")) topic += 'open_';
		if (sqlLower.includes("status = 'closed'")) topic += 'closed_';

		// Check for phase
		if (sqlLower.includes("phase = 'discovery'")) topic += 'discovery_';
		if (sqlLower.includes("phase = 'trial'")) topic += 'trial_';
		if (sqlLower.includes("phase = 'settlement'")) topic += 'settlement_';

		// Check for specific conditions
		if (sqlLower.includes('medical_expenses') && (sqlLower.includes('>') || sqlLower.includes('exceed'))) {
			topic += 'high_medical_expenses_';
		}
		if (sqlLower.includes('settlement') && sqlLower.includes('amount')) {
			topic += 'settlement_amounts_';
		}
		if (sqlLower.includes('billable') || sqlLower.includes('time_entries')) {
			topic += 'billable_time_';
		}

		// If no specific pattern found, use general terms from user query
		if (!topic) {
			if (queryLower.includes('expense')) topic += 'expenses_';
			if (queryLower.includes('time')) topic += 'time_';
			if (queryLower.includes('document')) topic += 'documents_';
			if (queryLower.includes('contact') || queryLower.includes('person')) topic += 'contacts_';
		}

		return topic || 'general_query';
	}

	/**
	 * Track query pattern and suggest routine if user has queried similar topic 2+ times
	 */
	function trackQueryPattern(userQuery: string, sql: string) {
		if (routineSuggestionShown) return; // Already suggested in this session

		const topic = extractQueryTopic(sql, userQuery);
		console.log('📊 Query topic:', topic);

		// Find existing pattern or create new one
		let pattern = queryPatterns.find(p => p.topic === topic);
		if (pattern) {
			pattern.queries.push(userQuery);
			pattern.lastSQL = sql;
		} else {
			pattern = {
				topic,
				queries: [userQuery],
				lastSQL: sql
			};
			queryPatterns.push(pattern);
		}

		// If user has queried this topic 2+ times, suggest creating a routine
		if (pattern.queries.length >= 2) {
			console.log('🔔 Suggesting routine creation for repeated query pattern');
			suggestRoutineCreation(pattern);
		}
	}

	/**
	 * Show routine creation suggestion with action buttons
	 */
	function suggestRoutineCreation(pattern: QueryPattern) {
		routineSuggestionShown = true;

		// Generate suggestion based on query pattern
		const queryType = pattern.topic.replace(/_/g, ' ').trim() || 'this data';

		messages = [
			...messages,
			{
				role: 'assistant',
				content: `Would you like me to create a routine to automatically report on ${queryType} every week?`,
				actionButtons: [
					{
						text: 'Yes, create routine',
						primary: true,
						callback: () => {
							// Remove the suggestion message and show routine creation form
							messages = messages.filter(m => !m.actionButtons);
							showRoutineCreationForm(pattern);
						}
					},
					{
						text: 'No, thanks',
						primary: false,
						callback: () => {
							// Just remove the suggestion message
							messages = messages.filter(m => !m.actionButtons);
						}
					}
				]
			}
		];
	}

	/**
	 * Show the actual routine creation form
	 */
	function showRoutineCreationForm(pattern: QueryPattern) {
		messages = [
			...messages,
			{
				role: 'assistant',
				content: '',
				showRoutineCreation: true,
				routineCreationData: {
					onSave: (routine: any) => {
						messages = [
							...messages.filter(m => !m.showRoutineCreation),
							{
								role: 'assistant',
								content: `Perfect! I've created the routine "${routine.description}" to run every ${routine.every.toLowerCase()}. You can manage it in your Routines Library.`
							}
						];
					},
					onCancel: () => {
						// Remove the routine creation card
						messages = messages.filter(m => !m.showRoutineCreation);
					}
				}
			}
		];
	}

	async function sendMessage() {
		if (!inputValue.trim()) return;

		const userMessage = inputValue;
		messages = [...messages, { role: 'user', content: userMessage }];
		inputValue = '';
		isThinking = true;
		streamingContent = '';
		streamingDisplayContent = '';
		isStreaming = false;
		isStreamingJSON = false;

		// Check if demo mode is enabled and query matches demo patterns
		if (demoMode) {
			const demoQuery = matchesDemoQuery(userMessage);

			if (demoQuery === 'first') {
				// First demo interaction: 42 cases
				await handleDemoResponse(
					'I found **42** open personal injury cases that are now in the discovery phase.',
					{
						title: 'Personal Injury Cases in Discovery Phase',
						subtitle: 'Table ⋅ Version 1',
						data: demo42Cases
					}
				);
				demoState = 'showing_42_cases';
				return;
			} else if (demoQuery === 'second' && demoState === 'showing_42_cases') {
				// Second demo interaction: 3 cases with high medical expenses
				await handleDemoResponse(
					'I found **3** cases where medical expenses exceed $100,000.\n\nWould you like me to create a **routine** to automatically report on new cases with medical expenses over $100,000 every week?',
					{
						title: 'High Medical Expense Cases',
						subtitle: 'Table ⋅ Version 1',
						data: demo3Cases
					},
					true, // Show action button
					'Yes, create routine',
					() => {
						// Handler for "Yes, create routine" button - show routine creation card
						messages = [
							...messages,
							{
								role: 'assistant',
								content: '',
								showRoutineCreation: true,
								routineCreationData: {
									onSave: (routine: any) => {
										messages = [
											...messages.filter(m => !m.showRoutineCreation),
											{
												role: 'assistant',
												content: `Great! I've created the routine "${routine.description}" to automatically check for new cases with medical expenses over $100,000 every ${routine.every.toLowerCase()}. You can find it in your Routines Library.`
											}
										];
										demoState = 'initial'; // Reset demo state
									},
									onCancel: () => {
										// Remove the routine creation card
										messages = messages.filter(m => !m.showRoutineCreation);
									}
								}
							}
						];
					}
				);
				demoState = 'awaiting_followup';
				return;
			}
		}

		try {
			// Use query router to classify and handle the query
			console.log('🔍 Routing query:', userMessage);

			// Build context from previous query
			const context = lastQueryResult ? {
				previousQuery: lastQuery,
				previousResult: lastQueryResult,
				previousSql: lastQuerySql
			} : undefined;

			// Route the query through our classification system
			const queryResult = await routeQuery(userMessage, context);
			console.log('📊 Query result:', queryResult);

			// Save context for next query
			lastQuery = userMessage;
			lastQueryResult = queryResult.data;
			lastQuerySql = queryResult.sqlQuery;

			// Track query pattern for routine suggestion (only for SQL queries with data)
			if (queryResult.type === 'sql' && queryResult.sqlQuery && queryResult.data && !queryResult.error) {
				trackQueryPattern(userMessage, queryResult.sqlQuery);
			}

			// Set query processing state for indicator
			currentQueryType = queryResult.type;
			currentQueryAction = queryResult.action;

			// Show thinking state with query type indicator
			isThinking = false;
			isStreaming = true;

			// Add empty assistant message that we'll update
			messages = [...messages, { role: 'assistant', content: '' }];

			// Check for errors
			if (queryResult.error) {
				messages = messages.map((msg, idx) =>
					idx === messages.length - 1
						? { ...msg, content: `I encountered an error: ${queryResult.error}` }
						: msg
				);
				isStreaming = false;
				currentQueryType = null;
				return;
			}

			// Simulate brief processing delay
			await new Promise(resolve => setTimeout(resolve, 300));

			// Format the result
			const formattedResult = formatResultForDisplay(queryResult);

			// Generate narrative response using LLM
			isStreaming = false;
			isProcessingData = true;

			console.log('🤖 Generating narrative response...');

			let narrativeResponse = formattedResult.message; // Fallback to prompt

			try {
				const responseResult = await fetch('/api/generate-response', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						query: userMessage,
						data: formattedResult.tableData || queryResult.data,
						queryType: queryResult.type
					})
				});

				if (responseResult.ok) {
					const responseData = await responseResult.json();
					if (responseData.success && responseData.response) {
						narrativeResponse = responseData.response;
						console.log('✅ Narrative response generated');
					}
				}
			} catch (error) {
				console.error('❌ Error generating narrative:', error);
				// Continue with fallback prompt
			}

			if (formattedResult.hasTable && formattedResult.tableData) {
				// Create structured data for display
				const structuredData = {
					title: queryResult.type === 'sql' ? 'Query Results' :
					        queryResult.type === 'document_search' ? 'Document Search Results' :
					        'Information',
					subtitle: 'Table ⋅ Version 1',
					data: formattedResult.tableData
				};

				// Update message with narrative response and structured data
				messages = messages.map((msg, idx) =>
					idx === messages.length - 1
						? {
							...msg,
							content: narrativeResponse,
							hasStructuredData: true,
							structuredData,
							displayContent: narrativeResponse,
							sqlQuery: queryResult.sqlQuery // Include the SQL query
						}
						: msg
				);

				currentResultsData = structuredData;
			} else {
				// Just show the narrative response
				messages = messages.map((msg, idx) =>
					idx === messages.length - 1
						? {
							...msg,
							content: narrativeResponse,
							sqlQuery: queryResult.sqlQuery // Include SQL query even without table
						}
						: msg
				);
			}

			isProcessingData = false;
			currentQueryType = null;

		} catch (error) {
			console.error('Error sending message:', error);
			isThinking = false;
			isStreaming = false;
			currentQueryType = null;
			messages = [
				...messages,
				{
					role: 'assistant',
					content: 'Sorry, I encountered an error. Please try again.'
				}
			];
		}
	}

	function showResults(data: { title: string; subtitle: string; data: Array<Record<string, any>> }) {
		currentResultsData = data;
		showResultsView = true;
	}

	// Handle demo responses with simulated streaming
	async function handleDemoResponse(
		responseText: string,
		structuredData: { title: string; subtitle: string; data: Array<Record<string, any>> },
		showActionButton: boolean = false,
		actionButtonText: string = '',
		actionButtonCallback?: () => void
	) {
		isThinking = false;
		isStreaming = true;

		// Add empty assistant message
		messages = [...messages, { role: 'assistant', content: '' }];

		// Simulate streaming the text character by character
		let currentText = '';
		for (let i = 0; i < responseText.length; i++) {
			currentText += responseText[i];
			messages = messages.map((msg, idx) =>
				idx === messages.length - 1 ? { ...msg, content: currentText } : msg
			);
			// Delay between characters for realistic streaming effect
			await new Promise(resolve => setTimeout(resolve, 10));
		}

		isStreaming = false;
		isProcessingData = true;

		// Show processing state
		await new Promise(resolve => setTimeout(resolve, 800));

		// Update message with structured data
		messages = messages.map((msg, idx) =>
			idx === messages.length - 1
				? {
					...msg,
					hasStructuredData: true,
					structuredData,
					displayContent: responseText,
					showActionButton,
					actionButtonText,
					actionButtonCallback
				}
				: msg
		);

		currentResultsData = structuredData;
		isProcessingData = false;
	}
</script>

<svelte:head>
	<title>LOIS Chat</title>
</svelte:head>

<div class="app-container">
	<!-- Sidebar -->
	<aside class="sidebar">
		<div class="sidebar-header">
			<h1 class="logo">
				<span class="logo-gradient">LO</span><span class="logo-slash">\</span><span class="logo-gradient">S</span>
			</h1>
			<button class="icon-button" aria-label="Toggle sidebar">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
					<rect x="3" y="4" width="14" height="2" rx="1" fill="currentColor"/>
					<rect x="3" y="9" width="14" height="2" rx="1" fill="currentColor"/>
					<rect x="3" y="14" width="14" height="2" rx="1" fill="currentColor"/>
				</svg>
			</button>
		</div>

		<nav class="sidebar-nav">
			<a href="/" class="nav-item">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path d="M8 2L8 14M2 8L14 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				</svg>
				New Chat
			</a>
			<button class="nav-item">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2"/>
					<path d="M8 5V9L10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				</svg>
				Create Routine
			</button>
			<button class="nav-item" on:click={() => showRoutinesLibrary = !showRoutinesLibrary}>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<rect x="3" y="4" width="10" height="10" rx="1" stroke="currentColor" stroke-width="2"/>
					<path d="M6 2V4M10 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				</svg>
				Routines Library
			</button>
		</nav>

		<div class="sidebar-section">
			<button class="section-header">
				<span>Recent chats</span>
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
					<path d="M3 5L6 8L9 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
			<div class="chat-list">
				<button class="chat-item active">Personal Injury Cases in Discove...</button>
				<button class="chat-item">Upcoming Depositions – October</button>
				<button class="chat-item">Client Medical Record Summary</button>
				<button class="chat-item">Negligence Case Review</button>
			</div>
		</div>

		<div class="sidebar-footer">
			<span class="sidebar-version">LOIS Landing V2</span>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="chat-main">
		<div class="chat-container">
			<header class="chat-header">
				<button class="chat-title-button">
					<span>New Chat</span>
					<svg width="25" height="25" viewBox="0 0 25 25" fill="none">
						<path d="M6.25 10.4166L12.5 16.6666L18.75 10.4166" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
				<button class="test-button" on:click={showSampleData}>
					View Sample Results
				</button>
			</header>

			<div class="chat-content">
				<div class="messages">
					{#each messages as message}
						{#if message.role === 'user'}
							<div class="message-wrapper user-message-wrapper">
								<div class="message user-message">
									<div class="message-content">{@html marked(message.content)}</div>
								</div>
							</div>
						{:else}
							<div class="message-wrapper assistant-message-wrapper">
								<div class="message assistant-message">
									{#if message.hasStructuredData && message.displayContent}
										<div class="message-content">{@html marked(message.displayContent)}</div>
									{:else}
										<div class="message-content">{@html marked(message.content)}</div>
									{/if}
									{#if message.sqlQuery}
										<details class="sql-query-details">
											<summary class="sql-query-summary">
												<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
													<path d="M2 5L7 9L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
												</svg>
												View SQL Query
											</summary>
											<pre class="sql-query-code"><code>{message.sqlQuery}</code></pre>
										</details>
									{/if}
									{#if message.hasStructuredData && message.structuredData}
										{#if message.structuredData.data.length === 1}
											<!-- Single result: Show full card inline -->
											<div class="inline-single-result">
												<ResultsRenderer
													data={message.structuredData.data}
													showGrouping={false}
													defaultView="auto"
												/>
											</div>
										{:else}
											<!-- Multiple results: Show compact preview with "View Full" button -->
											<DataPreviewCard
												title={message.structuredData.title}
												data={message.structuredData.data}
												onViewFull={() => showResults(message.structuredData)}
											/>
										{/if}
									{/if}
									{#if message.showActionButton && message.actionButtonText}
										<button class="action-button" on:click={message.actionButtonCallback}>
											{message.actionButtonText}
										</button>
									{/if}
									{#if message.actionButtons && message.actionButtons.length > 0}
										<div class="action-buttons">
											{#each message.actionButtons as button}
												<button
													class="action-button"
													class:primary={button.primary}
													on:click={button.callback}
												>
													{button.text}
												</button>
											{/each}
										</div>
									{/if}
									{#if message.showRoutineCreation && message.routineCreationData}
										<RoutineCreationCard
											onSave={message.routineCreationData.onSave}
											onCancel={message.routineCreationData.onCancel}
										/>
									{/if}
								</div>
							</div>
						{/if}
					{/each}

					{#if isThinking}
						<div class="thinking-indicator">
							<span>Thinking...</span>
						</div>
					{/if}

					{#if currentQueryType && isStreaming}
						<div class="message-wrapper assistant-message-wrapper">
							<div class="message assistant-message">
								<QueryProcessingIndicator
									queryType={currentQueryType}
									action={currentQueryAction}
									show={true}
								/>
							</div>
						</div>
					{/if}

					{#if isStreamingJSON && isStreaming}
						<div class="message-wrapper assistant-message-wrapper">
							<div class="message assistant-message">
								<DataLoadingSkeleton />
							</div>
						</div>
					{/if}

					{#if isProcessingData}
						<div class="message-wrapper assistant-message-wrapper">
							<div class="message assistant-message">
								<DataLoadingSkeleton />
							</div>
						</div>
					{/if}
				</div>
			</div>

			<div class="chat-input-area">
				<div class="input-wrapper">
				<input
					type="text"
					class="chat-input"
					placeholder="Ask LOIS anything..."
					bind:value={inputValue}
					on:keydown={(e) => e.key === 'Enter' && sendMessage()}
				/>
				<div class="input-controls">
					<div class="input-left">
						<button class="input-button dropdown">
							Look at...
							<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
								<path d="M3 5L6 8L9 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</button>
						<button class="input-button">
							<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
								<path d="M7 1L8.5 5.5H13L9.5 8.5L11 13L7 10L3 13L4.5 8.5L1 5.5H5.5L7 1Z"/>
							</svg>
							Saved Prompts
						</button>
					</div>
					<div class="input-right">
						<button class="icon-button-small" aria-label="Upload file">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
								<path d="M9 13V5M5 9L9 5L13 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M4 15H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
							</svg>
						</button>
						<button class="icon-button-small" aria-label="Voice input">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
								<path d="M9 2C7.89543 2 7 2.89543 7 4V9C7 10.1046 7.89543 11 9 11C10.1046 11 11 10.1046 11 9V4C11 2.89543 10.1046 2 9 2Z" stroke="currentColor" stroke-width="1.5"/>
								<path d="M5 9C5 11.2091 6.79086 13 9 13M9 13C11.2091 13 13 11.2091 13 9M9 13V16M7 16H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
							</svg>
						</button>
						<button class="send-button" on:click={sendMessage}>
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
								<path d="M2 9L16 2L9 16L7 10L2 9Z" fill="currentColor"/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

		<!-- Results Side Panel -->
		{#if showResultsView && currentResultsData}
			<div class="results-panel">
				<ResultsView
					title={currentResultsData.title}
					subtitle={currentResultsData.subtitle}
					data={currentResultsData.data}
					onClose={handleCloseResults}
				/>
			</div>
		{/if}

		<!-- Routines Library Panel -->
		{#if showRoutinesLibrary}
			<RoutinesLibrary onClose={() => showRoutinesLibrary = false} />
		{/if}
	</main>
</div>

<style>
	.app-container {
		display: flex;
		height: 100vh;
		overflow: hidden;
	}

	/* Sidebar - Reusing styles from landing page */
	.sidebar {
		width: 280px;
		background: white;
		border-right: 1px solid var(--color-border);
		display: flex;
		flex-direction: column;
		overflow-y: auto;
	}

	.sidebar-header {
		padding: 16px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid var(--color-border);
	}

	.logo {
		font-size: 24px;
		font-weight: 700;
		margin: 0;
		letter-spacing: 0;
		display: flex;
		align-items: center;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	.logo-gradient {
		background: linear-gradient(135deg, #FF9F66 0%, #FF6B9D 50%, #C86DD7 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.logo-slash {
		background: linear-gradient(135deg, #FF6B9D 0%, #C86DD7 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin: 0 -1px;
	}

	.icon-button {
		width: 32px;
		height: 32px;
		padding: 0;
		border: none;
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-secondary);
		border-radius: 6px;
		transition: background 0.15s;
	}

	.icon-button:hover {
		background: #f5f5f5;
	}

	.sidebar-nav {
		padding: 12px;
		border-bottom: 1px solid var(--color-border);
	}

	.nav-item {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		border: none;
		background: transparent;
		cursor: pointer;
		font-size: 14px;
		color: var(--color-text-primary);
		border-radius: 6px;
		transition: background 0.15s;
		margin-bottom: 4px;
		text-decoration: none;
	}

	.nav-item:hover {
		background: #f5f5f5;
	}

	.sidebar-section {
		border-bottom: 1px solid var(--color-border);
		padding: 12px;
	}

	.section-header {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 4px;
		border: none;
		background: transparent;
		cursor: pointer;
		font-size: 13px;
		font-weight: 500;
		color: var(--color-text-secondary);
		text-align: left;
	}

	.chat-list {
		margin-top: 8px;
	}

	.chat-item {
		width: 100%;
		padding: 8px 12px;
		border: none;
		background: transparent;
		cursor: pointer;
		font-size: 14px;
		color: var(--color-text-primary);
		text-align: left;
		border-radius: 6px;
		transition: background 0.15s;
		margin-bottom: 2px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.chat-item:hover {
		background: #f5f5f5;
	}

	.chat-item.active {
		background: #f5f5f5;
	}

	.sidebar-footer {
		padding: 16px;
		margin-top: auto;
		font-size: 12px;
		color: var(--color-text-secondary);
	}

	/* Chat Main Area */
	.chat-main {
		flex: 1;
		display: flex;
		flex-direction: row;
		background: var(--color-bg-secondary);
		overflow: hidden;
		position: relative;
	}

	.chat-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		transition: margin-right 0.3s ease;
	}

	.results-panel {
		width: 60%;
		min-width: 600px;
		max-width: 900px;
		height: 100%;
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		background: white;
		box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
		animation: slideIn 0.3s ease;
		z-index: 10;
	}

	@keyframes slideIn {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}

	.chat-header {
		background: white;
		border-bottom: 3px solid var(--color-border);
		padding: 15px 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.chat-title-button {
		display: flex;
		align-items: center;
		gap: 5px;
		border: none;
		background: transparent;
		cursor: pointer;
		font-size: 17.5px;
		font-weight: 400;
		color: var(--color-text-primary);
		padding: 0;
	}

	.chat-title-button svg {
		color: var(--color-text-secondary);
	}

	.test-button {
		padding: 8px 16px;
		border: 1px solid var(--color-border);
		background: white;
		border-radius: 6px;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-text-primary);
		cursor: pointer;
		transition: all 0.15s;
	}

	.test-button:hover {
		background: var(--color-brand-coral);
		color: white;
		border-color: var(--color-brand-coral);
	}

	.chat-content {
		flex: 1;
		overflow-y: auto;
		padding: 20px;
	}

	.messages {
		max-width: 1345px;
		margin: 0 auto;
	}

	.message-wrapper {
		margin-bottom: 20px;
		display: flex;
	}

	.user-message-wrapper {
		justify-content: flex-end;
	}

	.assistant-message-wrapper {
		justify-content: flex-start;
	}

	.message {
		max-width: 70%;
		padding: 15px 25px;
		border-radius: 10px;
	}

	.user-message {
		background: #E9E9E9;
		color: var(--color-text-primary);
	}

	.assistant-message {
		background: white;
		border: 1px solid var(--color-border);
		color: var(--color-text-primary);
	}

	.message-content {
		font-size: 14px;
		line-height: 20px;
	}

	.message-content :global(p) {
		margin: 0 0 10px 0;
	}

	.message-content :global(p:last-child) {
		margin-bottom: 0;
	}

	.message-content :global(strong) {
		font-weight: 600;
	}

	.message-content :global(em) {
		font-style: italic;
		color: var(--color-text-secondary);
	}

	.message-content :global(code) {
		background: #F5F5F5;
		padding: 2px 6px;
		border-radius: 4px;
		font-family: 'Courier New', monospace;
		font-size: 13px;
	}

	.message-content :global(pre) {
		background: #F5F5F5;
		padding: 12px;
		border-radius: 6px;
		overflow-x: auto;
		margin: 10px 0;
	}

	.message-content :global(pre code) {
		background: none;
		padding: 0;
	}

	.message-content :global(ul),
	.message-content :global(ol) {
		margin: 10px 0;
		padding-left: 20px;
	}

	.message-content :global(li) {
		margin: 4px 0;
	}

	.message-content :global(h1),
	.message-content :global(h2),
	.message-content :global(h3) {
		margin: 12px 0 8px 0;
		font-weight: 600;
	}

	.message-content :global(h1) {
		font-size: 18px;
	}

	.message-content :global(h2) {
		font-size: 16px;
	}

	.message-content :global(h3) {
		font-size: 14px;
	}

	.message-content :global(blockquote) {
		border-left: 3px solid var(--color-border);
		padding-left: 12px;
		margin: 10px 0;
		color: var(--color-text-secondary);
	}

	.thinking-indicator {
		padding: 20px;
		font-size: 14px;
		color: var(--color-text-secondary);
		text-align: left;
	}

	/* SQL Query Display */
	.sql-query-details {
		margin-top: 12px;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		background: #f8f9fa;
		overflow: hidden;
	}

	.sql-query-summary {
		padding: 10px 12px;
		cursor: pointer;
		font-size: 13px;
		font-weight: 500;
		color: #666;
		display: flex;
		align-items: center;
		gap: 6px;
		user-select: none;
		transition: background 0.15s;
	}

	.sql-query-summary:hover {
		background: #f0f1f2;
	}

	.sql-query-summary svg {
		transition: transform 0.2s;
	}

	.sql-query-details[open] .sql-query-summary svg {
		transform: rotate(180deg);
	}

	.sql-query-code {
		margin: 0;
		padding: 12px;
		background: #2d3748;
		color: #e2e8f0;
		font-size: 12px;
		line-height: 1.6;
		overflow-x: auto;
		border-top: 1px solid var(--color-border);
	}

	.sql-query-code code {
		background: none;
		padding: 0;
		color: inherit;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
	}

	/* Inline Single Result */
	.inline-single-result {
		margin-top: 16px;
	}

	/* Action Buttons Container */
	.action-buttons {
		display: flex;
		gap: 12px;
		margin-top: 15px;
		align-items: center;
	}

	/* Action Button */
	.action-button {
		padding: 10px 20px;
		background: transparent;
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		display: inline-block;
	}

	.action-button.primary {
		background: var(--color-brand-black);
		color: white;
		border-color: var(--color-brand-black);
		font-weight: 600;
	}

	.action-button:hover {
		background: #f5f5f5;
		border-color: #ccc;
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.action-button.primary:hover {
		background: #333;
		border-color: #333;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.action-button:active {
		transform: translateY(0);
	}

	/* Chat Input Area */
	.chat-input-area {
		background: white;
		border-top: 1px solid var(--color-border);
		padding: 20px;
	}

	.input-wrapper {
		max-width: 1325px;
		margin: 0 auto;
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 16px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.chat-input {
		width: 100%;
		border: none;
		font-size: 16px;
		padding: 8px 0;
		outline: none;
		color: var(--color-text-primary);
	}

	.chat-input::placeholder {
		color: var(--color-text-secondary);
	}

	.input-controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 12px;
		padding-top: 12px;
		border-top: 1px solid var(--color-border);
	}

	.input-left, .input-right {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.input-button {
		padding: 6px 12px;
		border: 1px solid var(--color-border);
		background: white;
		border-radius: 6px;
		font-size: 13px;
		color: var(--color-text-primary);
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 4px;
		transition: background 0.15s;
	}

	.input-button:hover {
		background: #f5f5f5;
	}

	.input-button.dropdown svg {
		opacity: 0.6;
	}

	.icon-button-small {
		width: 28px;
		height: 28px;
		padding: 0;
		border: none;
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-secondary);
		border-radius: 4px;
		transition: background 0.15s;
	}

	.icon-button-small:hover {
		background: #f5f5f5;
	}

	.send-button {
		width: 32px;
		height: 32px;
		padding: 0;
		border: none;
		background: var(--color-brand-black);
		color: white;
		border-radius: 6px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.15s;
	}

	.send-button:hover {
		background: #333;
	}

	@media (max-width: 768px) {
		.sidebar {
			position: fixed;
			left: -280px;
			z-index: 100;
			transition: left 0.3s;
		}

		.message {
			max-width: 85%;
		}
	}
</style>
