<script lang="ts">
	import { onMount } from 'svelte';

	let loading = false;
	let error = '';

	let databases: any[] = [];
	let schemas: any[] = [];
	let tables: any[] = [];
	let columns: any[] = [];
	let previewData: any[] = [];

	let selectedDatabase: string | null = null;
	let selectedSchema: string | null = null;
	let selectedTable: string | null = null;

	let activeView: 'databases' | 'schemas' | 'tables' | 'columns' | 'preview' = 'databases';
	let testConnection = false;
	let connectionStatus: { success: boolean; message?: string } | null = null;

	onMount(async () => {
		await testSnowflakeConnection();
		await loadDatabases();
	});

	async function testSnowflakeConnection() {
		testConnection = true;
		try {
			const response = await fetch('/api/snowflake/test');
			const data = await response.json();
			connectionStatus = data;
		} catch (e: any) {
			connectionStatus = { success: false, message: 'Failed to connect to Snowflake' };
		} finally {
			testConnection = false;
		}
	}

	async function loadDatabases() {
		loading = true;
		error = '';
		try {
			const response = await fetch('/api/snowflake/explore?type=databases');
			const data = await response.json();
			if (data.success) {
				databases = data.data;
				activeView = 'databases';
			} else {
				error = data.error;
			}
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	async function selectDatabase(dbName: string) {
		selectedDatabase = dbName;
		selectedSchema = null;
		selectedTable = null;
		schemas = [];
		tables = [];
		columns = [];
		previewData = [];

		loading = true;
		error = '';
		try {
			const response = await fetch(`/api/snowflake/explore?type=schemas&database=${dbName}`);
			const data = await response.json();
			if (data.success) {
				schemas = data.data;
				activeView = 'schemas';
			} else {
				error = data.error;
			}
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	async function selectSchema(schemaName: string) {
		selectedSchema = schemaName;
		selectedTable = null;
		tables = [];
		columns = [];
		previewData = [];

		loading = true;
		error = '';
		try {
			const response = await fetch(
				`/api/snowflake/explore?type=tables&database=${selectedDatabase}&schema=${schemaName}`
			);
			const data = await response.json();
			if (data.success) {
				tables = data.data;
				activeView = 'tables';
			} else {
				error = data.error;
			}
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	async function selectTable(tableName: string) {
		selectedTable = tableName;
		columns = [];
		previewData = [];

		loading = true;
		error = '';
		try {
			// Load columns
			const colResponse = await fetch(
				`/api/snowflake/explore?type=columns&database=${selectedDatabase}&schema=${selectedSchema}&table=${tableName}`
			);
			const colData = await colResponse.json();
			if (colData.success) {
				columns = colData.data;
				activeView = 'columns';
			} else {
				error = colData.error;
			}

			// Load preview data
			const previewResponse = await fetch(
				`/api/snowflake/explore?type=preview&database=${selectedDatabase}&schema=${selectedSchema}&table=${tableName}&limit=10`
			);
			const previewDataResult = await previewResponse.json();
			if (previewDataResult.success) {
				previewData = previewDataResult.data;
			}
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	function goBack() {
		if (activeView === 'columns' || activeView === 'preview') {
			selectedTable = null;
			columns = [];
			previewData = [];
			activeView = 'tables';
		} else if (activeView === 'tables') {
			selectedSchema = null;
			tables = [];
			activeView = 'schemas';
		} else if (activeView === 'schemas') {
			selectedDatabase = null;
			schemas = [];
			activeView = 'databases';
		}
	}

	function showPreview() {
		activeView = 'preview';
	}

	function showColumns() {
		activeView = 'columns';
	}
</script>

<div class="snowflake-explorer">
	<div class="explorer-header">
		<div class="header-top">
			<h2>Snowflake Data Explorer</h2>
			{#if connectionStatus}
				<div class="connection-status" class:connected={connectionStatus.success}>
					<span class="status-dot"></span>
					{connectionStatus.success ? 'Connected' : 'Disconnected'}
				</div>
			{/if}
		</div>
		<div class="breadcrumb">
			<button class="breadcrumb-item" on:click={loadDatabases}>
				<span class="breadcrumb-icon">🏠</span>
				Databases
			</button>
			{#if selectedDatabase}
				<span class="breadcrumb-sep">›</span>
				<button class="breadcrumb-item" on:click={() => selectDatabase(selectedDatabase)}>
					{selectedDatabase}
				</button>
			{/if}
			{#if selectedSchema}
				<span class="breadcrumb-sep">›</span>
				<button class="breadcrumb-item" on:click={() => selectSchema(selectedSchema)}>
					{selectedSchema}
				</button>
			{/if}
			{#if selectedTable}
				<span class="breadcrumb-sep">›</span>
				<span class="breadcrumb-item active">{selectedTable}</span>
			{/if}
		</div>
	</div>

	<!-- Quick Access Section -->
	{#if activeView === 'databases' && databases.length > 0}
		<div class="quick-access">
			<h3>Quick Access</h3>
			<div class="quick-buttons">
				<button
					class="quick-button"
					on:click={async () => {
						await selectDatabase('TEAM_THC2');
						setTimeout(async () => {
							await selectSchema('DATABRIDGE');
						}, 100);
					}}
				>
					<span class="quick-icon">⚡</span>
					<div>
						<div class="quick-title">Project Data</div>
						<div class="quick-desc">TEAM_THC2.DATABRIDGE</div>
					</div>
				</button>
				<button
					class="quick-button"
					on:click={async () => {
						await selectDatabase('PRODUCT');
						setTimeout(async () => {
							await selectSchema('TESTING');
						}, 100);
					}}
				>
					<span class="quick-icon">🧪</span>
					<div>
						<div class="quick-title">Testing Schema</div>
						<div class="quick-desc">PRODUCT.TESTING</div>
					</div>
				</button>
			</div>
		</div>
	{/if}

	{#if error}
		<div class="error-message">
			{error}
		</div>
	{/if}

	{#if loading}
		<div class="loading">Loading...</div>
	{:else}
		{#if activeView === 'databases'}
			<div class="explorer-section">
				<div class="section-header">
					<h3>Databases ({databases.length})</h3>
					<p class="hint">💡 Click on a database to explore its schemas</p>
				</div>
				<div class="item-list">
					{#each databases as db}
						<button class="item-card" on:click={() => selectDatabase(db.name)}>
							<div class="item-icon">🗄️</div>
							<div class="item-info">
								<div class="item-name">{db.name}</div>
								<div class="item-meta">Owner: {db.owner || 'N/A'}</div>
							</div>
							<div class="item-arrow">›</div>
						</button>
					{/each}
				</div>
			</div>
		{:else if activeView === 'schemas'}
			<div class="explorer-section">
				<div class="section-header">
					<h3>Schemas in {selectedDatabase} ({schemas.length})</h3>
					<p class="hint">💡 Select a schema to view its tables and views</p>
				</div>
				<div class="item-list">
					{#each schemas as schema}
						<button class="item-card" on:click={() => selectSchema(schema.name)}>
							<div class="item-icon">📁</div>
							<div class="item-info">
								<div class="item-name">{schema.name}</div>
								<div class="item-meta">Owner: {schema.owner || 'N/A'}</div>
							</div>
							<div class="item-arrow">›</div>
						</button>
					{/each}
				</div>
			</div>
		{:else if activeView === 'tables'}
			<div class="explorer-section">
				<div class="section-header">
					<h3>Tables & Views in {selectedDatabase}.{selectedSchema} ({tables.length})</h3>
					<p class="hint">💡 Click on a table or view to see its schema and data preview</p>
				</div>
				<div class="item-list">
					{#each tables as table}
						<button class="item-card" on:click={() => selectTable(table.name)}>
							<div class="item-icon">{table.kind === 'VIEW' ? '👁️' : '📊'}</div>
							<div class="item-info">
								<div class="item-name">{table.name}</div>
								<div class="item-meta">
									<span class="badge">{table.kind}</span>
									{#if table.rows > 0}
										• {table.rows.toLocaleString()} rows
									{/if}
								</div>
							</div>
							<div class="item-arrow">›</div>
						</button>
					{/each}
				</div>
			</div>
		{:else if activeView === 'columns' || activeView === 'preview'}
			<div class="explorer-section">
				<div class="table-detail-header">
					<h3>{selectedDatabase}.{selectedSchema}.{selectedTable}</h3>
					<div class="view-tabs">
						<button
							class="tab-button"
							class:active={activeView === 'columns'}
							on:click={showColumns}
						>
							Schema ({columns.length} columns)
						</button>
						<button
							class="tab-button"
							class:active={activeView === 'preview'}
							on:click={showPreview}
						>
							Preview ({previewData.length} rows)
						</button>
					</div>
				</div>

				{#if activeView === 'columns'}
					<div class="columns-table">
						<table>
							<thead>
								<tr>
									<th>Column Name</th>
									<th>Type</th>
									<th>Nullable</th>
									<th>Primary Key</th>
									<th>Comment</th>
								</tr>
							</thead>
							<tbody>
								{#each columns as col}
									<tr>
										<td class="column-name">{col.name}</td>
										<td class="column-type">{col.type}</td>
										<td>{col.null ? 'Yes' : 'No'}</td>
										<td>{col.primary_key ? '🔑' : ''}</td>
										<td class="column-comment">{col.comment || '-'}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<div class="preview-table">
						{#if previewData.length > 0}
							<table>
								<thead>
									<tr>
										{#each Object.keys(previewData[0]) as key}
											<th>{key}</th>
										{/each}
									</tr>
								</thead>
								<tbody>
									{#each previewData as row}
										<tr>
											{#each Object.values(row) as value}
												<td>{value !== null && value !== undefined ? value : '-'}</td>
											{/each}
										</tr>
									{/each}
								</tbody>
							</table>
						{:else}
							<div class="empty-state">No preview data available</div>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	{/if}
</div>

<style>
	.snowflake-explorer {
		background: var(--color-surface);
		border-radius: 12px;
		padding: 24px;
		margin-top: 24px;
	}

	.explorer-header {
		margin-bottom: 24px;
	}

	.header-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 12px;
	}

	.explorer-header h2 {
		margin: 0;
		font-size: 24px;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.connection-status {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 12px;
		border-radius: 20px;
		font-size: 13px;
		font-weight: 500;
		background: #fee;
		color: #c33;
	}

	.connection-status.connected {
		background: #efe;
		color: #3a3;
	}

	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: currentColor;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
	}

	.breadcrumb-item {
		display: flex;
		align-items: center;
		gap: 6px;
		background: none;
		border: none;
		color: var(--color-primary);
		cursor: pointer;
		padding: 6px 12px;
		border-radius: 6px;
		font-family: inherit;
		font-size: 14px;
		transition: all 0.2s;
	}

	.breadcrumb-item:hover {
		background: rgba(255, 107, 157, 0.1);
	}

	.breadcrumb-item.active {
		color: var(--color-text-primary);
		cursor: default;
		font-weight: 500;
		background: rgba(0, 0, 0, 0.05);
	}

	.breadcrumb-item.active:hover {
		background: rgba(0, 0, 0, 0.05);
	}

	.breadcrumb-icon {
		font-size: 16px;
	}

	.breadcrumb-sep {
		color: var(--color-text-tertiary);
		font-size: 18px;
		margin: 0 4px;
	}

	.quick-access {
		margin-bottom: 32px;
		padding: 20px;
		background: linear-gradient(135deg, rgba(255, 107, 157, 0.05) 0%, rgba(200, 109, 215, 0.05) 100%);
		border-radius: 12px;
		border: 1px solid rgba(255, 107, 157, 0.1);
	}

	.quick-access h3 {
		margin: 0 0 16px 0;
		font-size: 16px;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.quick-buttons {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 12px;
	}

	.quick-button {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px;
		background: white;
		border: 2px solid transparent;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
		font-family: inherit;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.quick-button:hover {
		border-color: var(--color-brand-coral);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(255, 107, 157, 0.15);
	}

	.quick-icon {
		font-size: 28px;
		line-height: 1;
	}

	.quick-title {
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: 4px;
	}

	.quick-desc {
		font-size: 13px;
		color: var(--color-text-secondary);
		font-family: 'Monaco', 'Courier New', monospace;
	}

	.section-header {
		margin-bottom: 16px;
	}

	.section-header h3 {
		margin: 0 0 8px 0;
	}

	.hint {
		font-size: 13px;
		color: var(--color-text-secondary);
		margin: 0;
		font-style: italic;
	}

	.error-message {
		background: #fee;
		border: 1px solid #fcc;
		color: #c33;
		padding: 12px;
		border-radius: 8px;
		margin-bottom: 16px;
	}

	.loading {
		text-align: center;
		padding: 40px;
		color: var(--color-text-secondary);
	}

	.explorer-section h3 {
		margin: 0 0 16px 0;
		font-size: 18px;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.item-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 12px;
	}

	.item-card {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px;
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
		font-family: inherit;
	}

	.item-card:hover {
		background: var(--color-surface-hover);
		border-color: var(--color-primary);
		transform: translateY(-2px);
	}

	.item-icon {
		font-size: 32px;
		line-height: 1;
	}

	.item-info {
		flex: 1;
		min-width: 0;
	}

	.item-name {
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: 4px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.item-meta {
		font-size: 13px;
		color: var(--color-text-secondary);
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.item-arrow {
		font-size: 20px;
		color: var(--color-text-tertiary);
		transition: transform 0.2s;
	}

	.item-card:hover .item-arrow {
		transform: translateX(4px);
		color: var(--color-primary);
	}

	.badge {
		display: inline-block;
		padding: 2px 8px;
		border-radius: 10px;
		font-size: 11px;
		font-weight: 600;
		background: rgba(255, 107, 157, 0.1);
		color: var(--color-brand-coral);
	}

	.table-detail-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
	}

	.view-tabs {
		display: flex;
		gap: 8px;
	}

	.tab-button {
		padding: 8px 16px;
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 6px;
		cursor: pointer;
		font-family: inherit;
		font-size: 14px;
		color: var(--color-text-secondary);
		transition: all 0.2s;
	}

	.tab-button:hover {
		background: var(--color-surface-hover);
		color: var(--color-text-primary);
	}

	.tab-button.active {
		background: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
	}

	.columns-table,
	.preview-table {
		overflow-x: auto;
		border: 1px solid var(--color-border);
		border-radius: 8px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 14px;
	}

	thead {
		background: var(--color-bg);
		position: sticky;
		top: 0;
	}

	th {
		padding: 12px;
		text-align: left;
		font-weight: 600;
		color: var(--color-text-primary);
		border-bottom: 2px solid var(--color-border);
	}

	td {
		padding: 12px;
		border-bottom: 1px solid var(--color-border);
		color: var(--color-text-secondary);
	}

	tr:last-child td {
		border-bottom: none;
	}

	tbody tr:hover {
		background: var(--color-surface-hover);
	}

	.column-name {
		font-weight: 500;
		color: var(--color-text-primary);
	}

	.column-type {
		font-family: 'Monaco', 'Courier New', monospace;
		color: var(--color-primary);
	}

	.column-comment {
		font-size: 13px;
		color: var(--color-text-tertiary);
	}

	.empty-state {
		padding: 40px;
		text-align: center;
		color: var(--color-text-tertiary);
	}
</style>
