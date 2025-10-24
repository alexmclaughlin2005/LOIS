<script lang="ts">
	import ResultsRenderer from './results/ResultsRenderer.svelte';

	export let title: string = 'Results';
	export let subtitle: string = 'Table ⋅ Version 1';
	export let data: Array<Record<string, any>> = [];
	export let onClose: () => void;

	// View mode toggle: 'cards' or 'table'
	let viewMode: 'cards' | 'table' = 'cards';

	// Figma design uses exactly 4 columns
	// We'll either use the Figma column names if they exist, or take first 4 columns
	let allColumns: string[] = data && Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : [];

	// Check if data matches Figma structure
	const hasFigmaColumns = ['project', 'type', 'phase', 'primary'].every(col =>
		allColumns.map(c => c.toLowerCase()).includes(col)
	);

	// Use exactly 4 columns - either Figma columns or first 4 available
	let columns: string[] = hasFigmaColumns
		? ['project', 'type', 'phase', 'primary']
		: allColumns.slice(0, 4);

	// First column should always have avatars (contains names/projects)
	$: firstColumnKey = columns[0];

	// Get initials from name for avatar
	function getInitials(name: string): string {
		if (!name) return '?';
		const parts = name.trim().split(' ');
		if (parts.length >= 2) {
			return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
		}
		return name[0].toUpperCase();
	}

	// Check if a column should render as a person with avatar
	function isPersonColumn(columnName: string): boolean {
		const personColumns = ['project', 'client_name', 'name', 'client', 'contact'];
		return personColumns.some(col => columnName.toLowerCase().includes(col));
	}

	// Format column header for display
	function formatColumnHeader(columnName: string): string {
		return columnName
			.replace(/_/g, ' ')
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
</script>

<div class="results-container">
	<!-- Main Content Area -->
	<main class="results-main">
		<div class="results-content">
			<!-- Header -->
			<header class="results-header">
				<div class="results-header-left">
					<h2 class="results-title">{title}</h2>
					<p class="results-subtitle">{subtitle}</p>
				</div>
				<div class="results-header-right">
					<!-- View Toggle -->
					<div class="view-toggle">
						<button
							class="toggle-btn"
							class:active={viewMode === 'cards'}
							on:click={() => viewMode = 'cards'}
							aria-label="Card view"
							title="Card view"
						>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
								<rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
								<rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
								<rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
								<rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"/>
							</svg>
						</button>
						<button
							class="toggle-btn"
							class:active={viewMode === 'table'}
							on:click={() => viewMode = 'table'}
							aria-label="Table view"
							title="Table view"
						>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
								<path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
							</svg>
						</button>
					</div>

					<button class="share-button">
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
							<path d="M12 5L8 1M8 1L4 5M8 1V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M2 11V14C2 14.5523 2.44772 15 3 15H13C13.5523 15 14 14.5523 14 14V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
						</svg>
						Share
					</button>
					<button class="close-button" on:click={onClose} aria-label="Close">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
							<path d="M6 6L14 14M14 6L6 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
						</svg>
					</button>
				</div>
			</header>

			<!-- Results Display -->
			<div class="results-display-wrapper">
				{#if data.length > 0}
					{#if viewMode === 'cards'}
						<!-- Card View with ResultsRenderer -->
						<div class="cards-view">
							<ResultsRenderer
								{data}
								showGrouping={true}
								defaultView="auto"
							/>
						</div>
					{:else}
						<!-- Table View (legacy) -->
						<div class="table-view">
							<table class="results-table">
						<thead>
							<tr>
								{#each columns as column}
									<th>
										<button class="column-header-btn" aria-label="Sort by {formatColumnHeader(column)}">
											<span>{formatColumnHeader(column)}</span>
											<svg class="filter-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
												<path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5"/>
											</svg>
										</button>
									</th>
								{/each}
								<th class="actions-col"></th>
							</tr>
						</thead>
						<tbody>
							{#each data as row, rowIndex}
								<tr>
									{#each columns as column, colIndex}
										<td class={colIndex === 0 ? 'person-cell' : ''}>
											{#if colIndex === 0}
												<!-- First column always has avatar -->
												<div class="person-content">
													<div class="avatar">
														{getInitials(String(row[column] || ''))}
													</div>
													<div class="person-info">
														<div class="person-name">{row[column] || 'N/A'}</div>
														<div class="person-subname">{row[column] || ''}</div>
													</div>
												</div>
											{:else}
												<!-- Other columns show data directly -->
												{row[column] || '—'}
											{/if}
										</td>
									{/each}
									<td class="actions-cell">
										<button class="row-action-btn" aria-label="Row options">
											<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
												<circle cx="10" cy="5" r="1.5" fill="currentColor"/>
												<circle cx="10" cy="10" r="1.5" fill="currentColor"/>
												<circle cx="10" cy="15" r="1.5" fill="currentColor"/>
											</svg>
										</button>
									</td>
								</tr>
							{/each}
							</tbody>
						</table>
						</div>
					{/if}
				{:else}
					<div class="no-data">
						<p>No data to display</p>
					</div>
				{/if}
			</div>
		</div>
	</main>
</div>

<style>
	.results-container {
		display: flex;
		height: 100%;
		background: white;
		overflow: hidden;
	}

	/* Main Content */
	.results-main {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.results-content {
		flex: 1;
		overflow-y: auto;
		padding: 20px;
	}

	.results-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
		padding-bottom: 16px;
		border-bottom: 1px solid #E5E5E5;
	}

	.results-header-left {
		flex: 1;
	}

	.results-title {
		font-size: 16px;
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0 0 4px 0;
	}

	.results-subtitle {
		font-size: 12px;
		color: var(--color-text-secondary);
		margin: 0;
		font-weight: 400;
	}

	.results-header-right {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	/* View Toggle */
	.view-toggle {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 4px;
		background: #F5F5F5;
		border-radius: 6px;
	}

	.toggle-btn {
		width: 32px;
		height: 32px;
		padding: 0;
		border: none;
		background: transparent;
		border-radius: 4px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-secondary);
		transition: all 0.15s;
	}

	.toggle-btn:hover {
		background: #E5E5E5;
		color: var(--color-text-primary);
	}

	.toggle-btn.active {
		background: white;
		color: var(--color-brand-black);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.share-button {
		padding: 7px 14px;
		border: 1px solid #E5E5E5;
		background: white;
		border-radius: 6px;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-text-primary);
		cursor: pointer;
		transition: all 0.15s;
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.share-button svg {
		flex-shrink: 0;
		color: var(--color-text-secondary);
	}

	.share-button:hover {
		background: #FAFAFA;
		border-color: #D0D0D0;
	}

	.close-button {
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
		transition: all 0.15s;
	}

	.close-button:hover {
		background: #F5F5F5;
		color: var(--color-text-primary);
	}

	/* Results Display */
	.results-display-wrapper {
		overflow-y: auto;
		height: 100%;
	}

	/* Cards View */
	.cards-view {
		padding: 0 20px;
	}

	/* Table View */
	.table-view {
		overflow-x: auto;
		margin: 0 -20px;
		padding: 0 20px;
	}

	.results-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 14px;
	}

	.results-table thead {
		background: #F5F5F5;
		position: sticky;
		top: 0;
		z-index: 1;
	}

	.results-table th {
		padding: 10px 15px;
		text-align: left;
		font-weight: 400;
		font-size: 14px;
		color: #525252;
		border-bottom: 1px solid #E0E0E0;
	}

	.column-header-btn {
		display: flex;
		align-items: center;
		gap: 4px;
		border: none;
		background: transparent;
		cursor: pointer;
		font-size: 14px;
		color: #525252;
		padding: 0;
		font-family: inherit;
		font-weight: 400;
	}

	.column-header-btn:hover {
		color: #161616;
	}

	.filter-icon {
		color: #525252;
		flex-shrink: 0;
		opacity: 0.6;
	}

	.actions-col {
		width: 40px;
	}

	.results-table td {
		padding: 12px 15px;
		border-bottom: 1px solid #E0E0E0;
		color: #161616;
		font-size: 14px;
	}

	.person-cell {
		padding: 8px 15px;
	}

	.person-content {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.avatar {
		width: 35px;
		height: 35px;
		border-radius: 50%;
		background: #E0E0E0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		font-weight: 600;
		color: #525252;
		flex-shrink: 0;
	}

	.person-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.person-name {
		font-size: 14px;
		color: #161616;
		font-weight: 500;
	}

	.person-subname {
		font-size: 12px;
		color: #757575;
	}

	.actions-cell {
		text-align: center;
		padding: 8px;
	}

	.row-action-btn {
		border: none;
		background: transparent;
		cursor: pointer;
		color: #525252;
		padding: 4px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: background 0.15s;
	}

	.row-action-btn:hover {
		background: #F5F5F5;
	}

	.results-table tbody tr:hover {
		background: #FAFAFA;
	}

	.results-table tbody tr:last-child td {
		border-bottom: none;
	}

	.no-data {
		padding: 60px 20px;
		text-align: center;
		color: var(--color-text-secondary);
		font-size: 14px;
	}


</style>
