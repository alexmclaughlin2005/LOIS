<script lang="ts">
	/**
	 * ResultsRenderer - Smart component that detects entity types and renders appropriate cards
	 *
	 * Analyzes the structure and fields of query results to determine:
	 * - What type of entity (project, contact, document, etc.)
	 * - Renders the correct card component for each entity
	 * - Groups results by type
	 * - Provides view switching between entity types
	 */

	import ProjectCard from './ProjectCard.svelte';
	import ContactCard from './ContactCard.svelte';
	import DocumentCard from './DocumentCard.svelte';

	export let data: Array<Record<string, any>> = [];
	export let showGrouping: boolean = true; // Show grouped view with tabs
	export let defaultView: 'all' | 'projects' | 'contacts' | 'documents' | 'auto' = 'auto';

	type EntityType = 'project' | 'contact' | 'document' | 'unknown';

	interface GroupedResults {
		projects: Array<Record<string, any>>;
		contacts: Array<Record<string, any>>;
		documents: Array<Record<string, any>>;
		unknown: Array<Record<string, any>>;
	}

	// Detect entity type from a single row
	function detectEntityType(row: Record<string, any>): EntityType {
		const fields = Object.keys(row);
		const fieldsLower = fields.map(f => f.toLowerCase());

		// Check for project/case indicators
		const projectIndicators = [
			'case_number',
			'case_type',
			'filing_date',
			'estimated_value',
			'jurisdiction',
			'phase'
		];
		const projectScore = projectIndicators.filter(ind => fieldsLower.includes(ind)).length;

		// Check for contact/person indicators
		const contactIndicators = [
			'first_name',
			'last_name',
			'email',
			'phone',
			'contact_type',
			'bar_number',
			'organization'
		];
		const contactScore = contactIndicators.filter(ind => fieldsLower.includes(ind)).length;

		// Check for document indicators
		const documentIndicators = [
			'document_type',
			'file_name',
			'file_size',
			'file_size_kb',
			'mime_type',
			'content',
			'date_filed'
		];
		const documentScore = documentIndicators.filter(ind => fieldsLower.includes(ind)).length;

		// Priority check: case_number is a strong project indicator
		// If present, it's almost certainly a project/case result
		if (fieldsLower.includes('case_number')) {
			return 'project';
		}

		// Determine type based on highest score
		const scores = [
			{ type: 'project' as EntityType, score: projectScore },
			{ type: 'contact' as EntityType, score: contactScore },
			{ type: 'document' as EntityType, score: documentScore }
		];

		scores.sort((a, b) => b.score - a.score);

		// If top score is at least 2 and clearly higher than others, use it
		if (scores[0].score >= 2 && scores[0].score > scores[1].score) {
			return scores[0].type;
		}

		// Fallback: check for specific fields as tiebreakers
		if (fieldsLower.includes('case_type')) {
			return 'project';
		}
		if (fieldsLower.includes('email') && (fieldsLower.includes('first_name') || fieldsLower.includes('last_name'))) {
			return 'contact';
		}
		if (fieldsLower.includes('document_type') || fieldsLower.includes('file_name')) {
			return 'document';
		}

		return 'unknown';
	}

	// Group results by entity type
	function groupResults(results: Array<Record<string, any>>): GroupedResults {
		const grouped: GroupedResults = {
			projects: [],
			contacts: [],
			documents: [],
			unknown: []
		};

		for (const row of results) {
			const type = detectEntityType(row);
			if (type === 'project') {
				grouped.projects.push(row);
			} else if (type === 'contact') {
				grouped.contacts.push(row);
			} else if (type === 'document') {
				grouped.documents.push(row);
			} else {
				grouped.unknown.push(row);
			}
		}

		return grouped;
	}

	// Determine which view to show by default
	function determineDefaultView(grouped: GroupedResults): 'all' | 'projects' | 'contacts' | 'documents' {
		// If only one type has results, show that
		const nonEmptyTypes = [
			{ type: 'projects' as const, count: grouped.projects.length },
			{ type: 'contacts' as const, count: grouped.contacts.length },
			{ type: 'documents' as const, count: grouped.documents.length }
		].filter(t => t.count > 0);

		if (nonEmptyTypes.length === 1) {
			return nonEmptyTypes[0].type;
		}

		// If multiple types, show 'all'
		return 'all';
	}

	// Reactive computations
	$: grouped = groupResults(data);
	$: totalCount = data.length;
	$: projectCount = grouped.projects.length;
	$: contactCount = grouped.contacts.length;
	$: documentCount = grouped.documents.length;
	$: unknownCount = grouped.unknown.length;

	// Determine initial view
	$: initialView = defaultView === 'auto' ? determineDefaultView(grouped) : defaultView;
	let activeView: 'all' | 'projects' | 'contacts' | 'documents' = initialView;

	// Update active view when data changes
	$: if (data) {
		activeView = initialView;
	}

	// Get counts for display
	$: counts = {
		all: totalCount,
		projects: projectCount,
		contacts: contactCount,
		documents: documentCount
	};

	// Determine if we should show tabs (only if we have multiple entity types)
	$: showTabs = showGrouping && (projectCount > 0 ? 1 : 0) + (contactCount > 0 ? 1 : 0) + (documentCount > 0 ? 1 : 0) > 1;
</script>

<div class="results-renderer">
	<!-- Summary Header -->
	{#if totalCount > 0}
		<div class="results-summary">
			<div class="summary-text">
				Found <strong>{totalCount}</strong> result{totalCount !== 1 ? 's' : ''}
				{#if showTabs}
					<span class="summary-breakdown">
						{#if projectCount > 0}
							<span class="summary-item">
								{projectCount} case{projectCount !== 1 ? 's' : ''}
							</span>
						{/if}
						{#if contactCount > 0}
							<span class="summary-item">
								{contactCount} contact{contactCount !== 1 ? 's' : ''}
							</span>
						{/if}
						{#if documentCount > 0}
							<span class="summary-item">
								{documentCount} document{documentCount !== 1 ? 's' : ''}
							</span>
						{/if}
					</span>
				{/if}
			</div>
		</div>

		<!-- Tabs (if multiple entity types) -->
		{#if showTabs}
			<div class="view-tabs">
				<button
					class="tab"
					class:active={activeView === 'all'}
					on:click={() => activeView = 'all'}
				>
					All ({counts.all})
				</button>
				{#if projectCount > 0}
					<button
						class="tab"
						class:active={activeView === 'projects'}
						on:click={() => activeView = 'projects'}
					>
						Cases ({projectCount})
					</button>
				{/if}
				{#if contactCount > 0}
					<button
						class="tab"
						class:active={activeView === 'contacts'}
						on:click={() => activeView = 'contacts'}
					>
						Contacts ({contactCount})
					</button>
				{/if}
				{#if documentCount > 0}
					<button
						class="tab"
						class:active={activeView === 'documents'}
						on:click={() => activeView = 'documents'}
					>
						Documents ({documentCount})
					</button>
				{/if}
			</div>
		{/if}

		<!-- Results Display -->
		<div class="results-grid">
			<!-- All View -->
			{#if activeView === 'all'}
				<!-- Projects -->
				{#if grouped.projects.length > 0}
					<div class="result-section">
						{#if showTabs}
							<h3 class="section-title">Cases ({grouped.projects.length})</h3>
						{/if}
						{#each grouped.projects as project}
							<ProjectCard {project} />
						{/each}
					</div>
				{/if}

				<!-- Contacts -->
				{#if grouped.contacts.length > 0}
					<div class="result-section">
						{#if showTabs}
							<h3 class="section-title">Contacts ({grouped.contacts.length})</h3>
						{/if}
						{#each grouped.contacts as contact}
							<ContactCard {contact} />
						{/each}
					</div>
				{/if}

				<!-- Documents -->
				{#if grouped.documents.length > 0}
					<div class="result-section">
						{#if showTabs}
							<h3 class="section-title">Documents ({grouped.documents.length})</h3>
						{/if}
						{#each grouped.documents as document}
							<DocumentCard {document} />
						{/each}
					</div>
				{/if}

				<!-- Unknown (fallback to generic display) -->
				{#if grouped.unknown.length > 0}
					<div class="result-section">
						<h3 class="section-title">Other Results ({grouped.unknown.length})</h3>
						{#each grouped.unknown as item}
							<div class="generic-card">
								<pre>{JSON.stringify(item, null, 2)}</pre>
							</div>
						{/each}
					</div>
				{/if}
			{/if}

			<!-- Projects View -->
			{#if activeView === 'projects'}
				{#each grouped.projects as project}
					<ProjectCard {project} />
				{/each}
			{/if}

			<!-- Contacts View -->
			{#if activeView === 'contacts'}
				{#each grouped.contacts as contact}
					<ContactCard {contact} />
				{/each}
			{/if}

			<!-- Documents View -->
			{#if activeView === 'documents'}
				{#each grouped.documents as document}
					<DocumentCard {document} />
				{/each}
			{/if}
		</div>
	{:else}
		<div class="no-results">
			<svg width="48" height="48" viewBox="0 0 48 48" fill="none" class="no-results-icon">
				<circle cx="24" cy="24" r="20" stroke="#E0E0E0" stroke-width="2"/>
				<path d="M24 16V24M24 32H24.02" stroke="#999" stroke-width="2" stroke-linecap="round"/>
			</svg>
			<p class="no-results-text">No results found</p>
		</div>
	{/if}
</div>

<style>
	.results-renderer {
		width: 100%;
	}

	/* Summary */
	.results-summary {
		padding: 16px 0;
		border-bottom: 1px solid #F5F5F5;
		margin-bottom: 16px;
	}

	.summary-text {
		font-size: 14px;
		color: var(--color-text-secondary, #666);
	}

	.summary-text strong {
		color: var(--color-text-primary, #161616);
		font-weight: 600;
	}

	.summary-breakdown {
		margin-left: 8px;
	}

	.summary-item {
		margin: 0 8px;
		color: var(--color-text-secondary, #666);
	}

	.summary-item::before {
		content: '•';
		margin-right: 8px;
		color: #D0D0D0;
	}

	/* Tabs */
	.view-tabs {
		display: flex;
		gap: 4px;
		margin-bottom: 20px;
		border-bottom: 2px solid #F5F5F5;
		overflow-x: auto;
	}

	.tab {
		padding: 10px 16px;
		border: none;
		background: transparent;
		font-size: 14px;
		font-weight: 500;
		color: var(--color-text-secondary, #666);
		cursor: pointer;
		border-bottom: 2px solid transparent;
		margin-bottom: -2px;
		transition: all 0.15s;
		white-space: nowrap;
	}

	.tab:hover {
		color: var(--color-text-primary, #161616);
		background: #FAFAFA;
	}

	.tab.active {
		color: var(--color-brand-black, #000);
		border-bottom-color: var(--color-brand-black, #000);
		font-weight: 600;
	}

	/* Results Grid */
	.results-grid {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.result-section {
		margin-bottom: 24px;
	}

	.section-title {
		font-size: 16px;
		font-weight: 600;
		color: var(--color-text-primary, #161616);
		margin: 0 0 16px 0;
		padding-bottom: 8px;
		border-bottom: 1px solid #F5F5F5;
	}

	/* Generic Card (for unknown entity types) */
	.generic-card {
		background: white;
		border: 1px solid var(--color-border, #E0E0E0);
		border-radius: 8px;
		padding: 16px;
		margin-bottom: 12px;
	}

	.generic-card pre {
		margin: 0;
		font-size: 12px;
		color: var(--color-text-primary, #161616);
		overflow-x: auto;
		font-family: 'Monaco', 'Courier New', monospace;
	}

	/* No Results */
	.no-results {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60px 20px;
		text-align: center;
	}

	.no-results-icon {
		margin-bottom: 16px;
		opacity: 0.5;
	}

	.no-results-text {
		font-size: 16px;
		color: var(--color-text-secondary, #666);
		margin: 0;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.view-tabs {
			gap: 2px;
		}

		.tab {
			padding: 8px 12px;
			font-size: 13px;
		}

		.summary-breakdown {
			display: block;
			margin-left: 0;
			margin-top: 4px;
		}
	}
</style>
