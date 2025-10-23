<script lang="ts">
	export let title: string = 'Query Results';
	export let data: Array<Record<string, any>> = [];
	export let onViewFull: () => void;

	// Get column names and preview rows (first 3)
	$: columns = data.length > 0 ? Object.keys(data[0]).slice(0, 5) : [];
	$: previewRows = data.slice(0, 3);
	$: totalRows = data.length;
</script>

<div class="preview-wrapper">
	<div class="preview-header">
		<div class="preview-title">
			<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
				<rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" stroke-width="1.5"/>
				<path d="M2 6H14M6 2V14" stroke="currentColor" stroke-width="1.5"/>
			</svg>
			<span>{title}</span>
		</div>
		<div class="preview-meta">
			<span class="preview-subtitle">Table ⋅ Version 1</span>
			<button class="preview-menu" aria-label="More options">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
					<circle cx="10" cy="4" r="1.5" fill="currentColor"/>
					<circle cx="10" cy="10" r="1.5" fill="currentColor"/>
					<circle cx="10" cy="16" r="1.5" fill="currentColor"/>
				</svg>
			</button>
		</div>
	</div>

	<div class="preview-table">
		<table>
			<thead>
				<tr>
					{#each columns as column}
						<th>{column}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each previewRows as row}
					<tr>
						{#each columns as column}
							<td>{row[column] !== undefined ? row[column] : ''}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="preview-footer">
		<span class="preview-more">+{totalRows - 3} more rows</span>
		<button class="view-full-link" on:click={onViewFull}>
			<span>View Full Table</span>
			<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
				<path d="M3 6H9M9 6L6 3M9 6L6 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</button>
	</div>
</div>

<style>
	.preview-wrapper {
		background: white;
		border: 1px solid #E0E0E0;
		border-radius: 5px;
		margin-top: 12px;
		max-width: 100%;
		overflow: hidden;
	}

	.preview-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 12px;
		border-bottom: 1px solid #E0E0E0;
		background: white;
	}

	.preview-title {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.preview-title svg {
		color: var(--color-text-secondary);
		flex-shrink: 0;
	}

	.preview-meta {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.preview-subtitle {
		font-size: 11px;
		color: var(--color-text-secondary);
		font-weight: 400;
	}

	.preview-menu {
		width: 20px;
		height: 20px;
		padding: 0;
		border: none;
		background: transparent;
		color: var(--color-text-secondary);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: background 0.15s;
	}

	.preview-menu:hover {
		background: #F5F5F5;
	}

	.preview-table {
		overflow-x: auto;
		max-height: 200px;
		overflow-y: auto;
	}

	table {
		width: 100%;
		font-size: 11px;
		border-collapse: collapse;
	}

	thead {
		background: #FAFAFA;
		position: sticky;
		top: 0;
		z-index: 1;
	}

	th {
		padding: 6px 12px;
		text-align: left;
		font-weight: 600;
		font-size: 10px;
		color: #666;
		border-bottom: 1px solid #E0E0E0;
		white-space: nowrap;
	}

	td {
		padding: 8px 12px;
		color: var(--color-text-primary);
		font-size: 11px;
		border-bottom: 1px solid #F5F5F5;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 150px;
	}

	tbody tr:hover {
		background: #FAFAFA;
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	.preview-footer {
		padding: 8px 12px;
		border-top: 1px solid #E0E0E0;
		background: white;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 11px;
	}

	.preview-more {
		color: var(--color-text-secondary);
	}

	.view-full-link {
		border: none;
		background: transparent;
		color: #FF6B6B;
		font-size: 11px;
		font-weight: 600;
		cursor: pointer;
		padding: 0;
		display: flex;
		align-items: center;
		gap: 4px;
		transition: opacity 0.15s;
	}

	.view-full-link:hover {
		opacity: 0.7;
	}

	.view-full-link svg {
		flex-shrink: 0;
	}
</style>
