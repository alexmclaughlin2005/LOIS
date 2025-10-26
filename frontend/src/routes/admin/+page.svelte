<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import SnowflakeExplorer from '$lib/components/SnowflakeExplorer.svelte';

	interface ChatSession {
		id: string;
		title: string;
		created_at: string;
		updated_at: string;
		last_message_at: string;
		message_count: number;
		is_archived: boolean;
	}

	let sessions: ChatSession[] = [];
	let loading = true;
	let selectedSessions = new Set<string>();
	let includeArchived = false;
	let activeTab: 'chats' | 'snowflake' | 'settings' = 'chats';

	// Organization settings
	let organizations: { ORG_ID: string; ORG_NAME: string }[] = [];
	let selectedOrgId: string | null = null;
	let loadingOrgs = false;

	onMount(async () => {
		await loadSessions();
		await loadOrganizations();
		loadSelectedOrg();
	});

	async function loadOrganizations() {
		loadingOrgs = true;
		try {
			const response = await fetch('/api/snowflake/organizations');
			const data = await response.json();
			if (data.success) {
				organizations = data.organizations;
			}
		} catch (error) {
			console.error('Error loading organizations:', error);
		} finally {
			loadingOrgs = false;
		}
	}

	function loadSelectedOrg() {
		const saved = localStorage.getItem('selectedOrgId');
		if (saved) {
			selectedOrgId = saved;
		}
	}

	function selectOrg(orgId: string | null) {
		selectedOrgId = orgId;
		if (orgId) {
			localStorage.setItem('selectedOrgId', orgId);
		} else {
			localStorage.removeItem('selectedOrgId');
		}
	}

	async function loadSessions() {
		try {
			loading = true;
			const url = `/api/chat-sessions?limit=1000&includeArchived=${includeArchived}`;
			const response = await fetch(url);
			const data = await response.json();

			if (data.success) {
				sessions = data.sessions;
			} else {
				console.error('Failed to load sessions:', data.error);
			}
		} catch (error) {
			console.error('Error loading sessions:', error);
		} finally {
			loading = false;
		}
	}

	function toggleSession(id: string) {
		if (selectedSessions.has(id)) {
			selectedSessions.delete(id);
		} else {
			selectedSessions.add(id);
		}
		selectedSessions = selectedSessions; // Trigger reactivity
	}

	function toggleAll() {
		if (selectedSessions.size === sessions.length) {
			selectedSessions.clear();
		} else {
			sessions.forEach(s => selectedSessions.add(s.id));
		}
		selectedSessions = selectedSessions; // Trigger reactivity
	}

	async function deleteSelected() {
		if (selectedSessions.size === 0) {
			alert('No sessions selected');
			return;
		}

		const confirmed = confirm(`Are you sure you want to delete ${selectedSessions.size} session(s)? This cannot be undone.`);
		if (!confirmed) return;

		try {
			const deletePromises = Array.from(selectedSessions).map(id =>
				fetch(`/api/chat-sessions/${id}`, { method: 'DELETE' })
			);

			await Promise.all(deletePromises);
			alert(`Successfully deleted ${selectedSessions.size} session(s)`);
			selectedSessions.clear();
			await loadSessions();
		} catch (error) {
			console.error('Error deleting sessions:', error);
			alert('Failed to delete some sessions');
		}
	}

	async function deleteAll() {
		const count = sessions.length;
		const confirmed = confirm(`Are you sure you want to delete ALL ${count} sessions? This cannot be undone.`);
		if (!confirmed) return;

		const doubleConfirm = confirm('This will permanently delete all chat history. Are you absolutely sure?');
		if (!doubleConfirm) return;

		try {
			const deletePromises = sessions.map(s =>
				fetch(`/api/chat-sessions/${s.id}`, { method: 'DELETE' })
			);

			await Promise.all(deletePromises);
			alert(`Successfully deleted all ${count} sessions`);
			selectedSessions.clear();
			await loadSessions();
		} catch (error) {
			console.error('Error deleting all sessions:', error);
			alert('Failed to delete all sessions');
		}
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleString();
	}

	function viewSession(id: string) {
		goto(`/chat?session=${id}`);
	}
</script>

<svelte:head>
	<title>Admin - LOIS</title>
</svelte:head>

<div class="admin-container">
	<header class="admin-header">
		<div class="header-content">
			<h1 class="logo">
				<span class="logo-gradient">LO</span><span class="logo-slash">\</span><span class="logo-gradient">S</span>
				<span class="admin-badge">Admin</span>
			</h1>
			<button class="btn-secondary" on:click={() => goto('/')}>Back to Home</button>
		</div>
	</header>

	<main class="admin-main">
		<div class="content-wrapper">
			<div class="page-header">
				<h2>Admin Dashboard</h2>
				<p class="subtitle">Manage chat sessions and explore data sources</p>
			</div>

			<div class="tabs">
				<button
					class="tab"
					class:active={activeTab === 'chats'}
					on:click={() => activeTab = 'chats'}
				>
					Chat Sessions
				</button>
				<button
					class="tab"
					class:active={activeTab === 'snowflake'}
					on:click={() => activeTab = 'snowflake'}
				>
					Snowflake Data
				</button>
				<button
					class="tab"
					class:active={activeTab === 'settings'}
					on:click={() => activeTab = 'settings'}
				>
					Settings
				</button>
			</div>

			{#if activeTab === 'chats'}

			<div class="controls">
				<div class="controls-left">
					<label class="checkbox-label">
						<input type="checkbox" checked={includeArchived} on:change={(e) => { includeArchived = e.currentTarget.checked; loadSessions(); }} />
						Include Archived
					</label>
					<button class="btn-secondary" on:click={loadSessions} disabled={loading}>
						{loading ? 'Loading...' : 'Refresh'}
					</button>
				</div>

				<div class="controls-right">
					<button class="btn-danger" on:click={deleteSelected} disabled={selectedSessions.size === 0}>
						Delete Selected ({selectedSessions.size})
					</button>
					<button class="btn-danger-outline" on:click={deleteAll} disabled={sessions.length === 0}>
						Delete All
					</button>
				</div>
			</div>

			{#if loading}
				<div class="loading-state">
					<div class="spinner"></div>
					<p>Loading sessions...</p>
				</div>
			{:else if sessions.length === 0}
				<div class="empty-state">
					<svg width="64" height="64" viewBox="0 0 24 24" fill="none">
						<path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
					<h3>No Chat Sessions</h3>
					<p>There are no chat sessions to display</p>
				</div>
			{:else}
				<div class="table-container">
					<table class="sessions-table">
						<thead>
							<tr>
								<th class="col-checkbox">
									<input
										type="checkbox"
										checked={selectedSessions.size === sessions.length}
										on:change={toggleAll}
									/>
								</th>
								<th class="col-title">Title</th>
								<th class="col-messages">Messages</th>
								<th class="col-date">Created</th>
								<th class="col-date">Last Updated</th>
								<th class="col-actions">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each sessions as session}
								<tr class:selected={selectedSessions.has(session.id)} class:archived={session.is_archived}>
									<td>
										<input
											type="checkbox"
											checked={selectedSessions.has(session.id)}
											on:change={() => toggleSession(session.id)}
										/>
									</td>
									<td class="session-title">
										{session.title}
										{#if session.is_archived}
											<span class="badge-archived">Archived</span>
										{/if}
									</td>
									<td class="text-center">{session.message_count}</td>
									<td class="text-muted">{formatDate(session.created_at)}</td>
									<td class="text-muted">{formatDate(session.last_message_at)}</td>
									<td>
										<div class="action-buttons">
											<button class="btn-small btn-primary" on:click={() => viewSession(session.id)}>
												View
											</button>
											<button
												class="btn-small btn-danger"
												on:click={async () => {
													if (confirm('Delete this session?')) {
														await fetch(`/api/chat-sessions/${session.id}`, { method: 'DELETE' });
														await loadSessions();
													}
												}}
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<div class="summary">
					<p>Total: {sessions.length} session(s)</p>
				</div>
			{/if}

			{:else if activeTab === 'snowflake'}
				<SnowflakeExplorer />

			{:else if activeTab === 'settings'}
				<div class="settings-section">
					<div class="settings-card">
						<h3>Organization Filter</h3>
						<p class="settings-description">
							Select an organization to filter all queries by ORG_ID. This setting will apply to Cortex Analyst queries and structured data queries.
						</p>

						{#if loadingOrgs}
							<div class="loading-state">
								<div class="spinner"></div>
								<p>Loading organizations...</p>
							</div>
						{:else if organizations.length === 0}
							<div class="empty-state">
								<p>No organizations found</p>
							</div>
						{:else}
							<div class="org-selector">
								<label class="org-option">
									<input
										type="radio"
										name="organization"
										checked={selectedOrgId === null}
										on:change={() => selectOrg(null)}
									/>
									<div class="org-info">
										<div class="org-name">All Organizations</div>
										<div class="org-desc">No filtering applied</div>
									</div>
								</label>

								{#each organizations as org}
									<label class="org-option">
										<input
											type="radio"
											name="organization"
											value={org.ORG_ID}
											checked={selectedOrgId === org.ORG_ID}
											on:change={() => selectOrg(org.ORG_ID)}
										/>
										<div class="org-info">
											<div class="org-name">{org.ORG_NAME}</div>
											<div class="org-desc">ID: {org.ORG_ID}</div>
										</div>
									</label>
								{/each}
							</div>

							{#if selectedOrgId}
								<div class="alert alert-info">
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
										<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
										<path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
									</svg>
									<div>
										<strong>Active Filter:</strong> All queries are now filtered to organization
										<strong>{organizations.find(o => o.ORG_ID === selectedOrgId)?.ORG_NAME}</strong>
										(ID: {selectedOrgId})
									</div>
								</div>
							{/if}
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</main>
</div>

<style>
	.admin-container {
		min-height: 100vh;
		background: var(--color-bg-secondary);
		display: flex;
		flex-direction: column;
	}

	.admin-header {
		background: white;
		border-bottom: 1px solid var(--color-border);
		padding: 16px 24px;
	}

	.header-content {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.logo {
		font-size: 24px;
		font-weight: 700;
		margin: 0;
		display: flex;
		align-items: center;
		gap: 12px;
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

	.admin-badge {
		font-size: 14px;
		font-weight: 500;
		color: white;
		background: #FF6B9D;
		padding: 4px 12px;
		border-radius: 12px;
	}

	.admin-main {
		flex: 1;
		padding: 32px 24px;
	}

	.content-wrapper {
		max-width: 1400px;
		margin: 0 auto;
	}

	.page-header {
		margin-bottom: 32px;
	}

	.page-header h2 {
		font-size: 28px;
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0 0 8px 0;
	}

	.subtitle {
		font-size: 16px;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
		padding: 16px;
		background: white;
		border-radius: 8px;
		border: 1px solid var(--color-border);
	}

	.controls-left,
	.controls-right {
		display: flex;
		gap: 12px;
		align-items: center;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		color: var(--color-text-primary);
		cursor: pointer;
	}

	.checkbox-label input[type="checkbox"] {
		cursor: pointer;
	}

	.btn-secondary,
	.btn-danger,
	.btn-danger-outline,
	.btn-primary,
	.btn-small {
		padding: 8px 16px;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s;
		border: 1px solid;
	}

	.btn-secondary {
		background: white;
		color: var(--color-text-primary);
		border-color: var(--color-border);
	}

	.btn-secondary:hover:not(:disabled) {
		background: #f5f5f5;
	}

	.btn-danger {
		background: #dc3545;
		color: white;
		border-color: #dc3545;
	}

	.btn-danger:hover:not(:disabled) {
		background: #c82333;
	}

	.btn-danger-outline {
		background: white;
		color: #dc3545;
		border-color: #dc3545;
	}

	.btn-danger-outline:hover:not(:disabled) {
		background: #dc3545;
		color: white;
	}

	.btn-primary {
		background: var(--color-brand-coral);
		color: white;
		border-color: var(--color-brand-coral);
	}

	.btn-primary:hover:not(:disabled) {
		opacity: 0.9;
	}

	.btn-small {
		padding: 4px 12px;
		font-size: 13px;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.loading-state,
	.empty-state {
		text-align: center;
		padding: 64px 32px;
		background: white;
		border-radius: 8px;
		border: 1px solid var(--color-border);
	}

	.spinner {
		width: 48px;
		height: 48px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid var(--color-brand-coral);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 16px;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.empty-state svg {
		color: var(--color-text-secondary);
		opacity: 0.5;
		margin-bottom: 16px;
	}

	.empty-state h3 {
		font-size: 20px;
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0 0 8px 0;
	}

	.empty-state p {
		font-size: 14px;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.table-container {
		background: white;
		border-radius: 8px;
		border: 1px solid var(--color-border);
		overflow: hidden;
	}

	.sessions-table {
		width: 100%;
		border-collapse: collapse;
	}

	.sessions-table thead {
		background: #f9fafb;
		border-bottom: 1px solid var(--color-border);
	}

	.sessions-table th {
		padding: 12px 16px;
		text-align: left;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.sessions-table td {
		padding: 12px 16px;
		font-size: 14px;
		color: var(--color-text-primary);
		border-bottom: 1px solid var(--color-border);
	}

	.sessions-table tbody tr:last-child td {
		border-bottom: none;
	}

	.sessions-table tbody tr:hover {
		background: #f9fafb;
	}

	.sessions-table tbody tr.selected {
		background: #fff5f7;
	}

	.sessions-table tbody tr.archived {
		opacity: 0.6;
	}

	.col-checkbox {
		width: 40px;
	}

	.col-title {
		min-width: 300px;
	}

	.col-messages {
		width: 100px;
		text-align: center;
	}

	.col-date {
		width: 180px;
	}

	.col-actions {
		width: 150px;
	}

	.session-title {
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.badge-archived {
		font-size: 11px;
		font-weight: 500;
		color: #856404;
		background: #fff3cd;
		padding: 2px 8px;
		border-radius: 10px;
	}

	.text-center {
		text-align: center;
	}

	.text-muted {
		color: var(--color-text-secondary);
		font-size: 13px;
	}

	.action-buttons {
		display: flex;
		gap: 8px;
	}

	.summary {
		margin-top: 16px;
		padding: 12px 16px;
		background: white;
		border-radius: 8px;
		border: 1px solid var(--color-border);
		font-size: 14px;
		color: var(--color-text-secondary);
	}

	.summary p {
		margin: 0;
	}

	.tabs {
		display: flex;
		gap: 8px;
		margin-bottom: 24px;
		border-bottom: 2px solid var(--color-border);
		padding-bottom: 0;
	}

	.tab {
		padding: 12px 24px;
		background: none;
		border: none;
		border-bottom: 3px solid transparent;
		font-size: 15px;
		font-weight: 500;
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: all 0.2s;
		margin-bottom: -2px;
	}

	.tab:hover {
		color: var(--color-text-primary);
		background: rgba(0, 0, 0, 0.02);
	}

	.tab.active {
		color: var(--color-brand-coral);
		border-bottom-color: var(--color-brand-coral);
	}

	.settings-section {
		margin-top: 24px;
	}

	.settings-card {
		background: white;
		border-radius: 12px;
		padding: 24px;
		border: 1px solid var(--color-border);
	}

	.settings-card h3 {
		margin: 0 0 8px 0;
		font-size: 20px;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.settings-description {
		margin: 0 0 24px 0;
		font-size: 14px;
		color: var(--color-text-secondary);
		line-height: 1.5;
	}

	.org-selector {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 24px;
	}

	.org-option {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px;
		border: 2px solid var(--color-border);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.org-option:hover {
		border-color: var(--color-brand-coral);
		background: rgba(255, 107, 157, 0.02);
	}

	.org-option input[type="radio"] {
		cursor: pointer;
		width: 18px;
		height: 18px;
		flex-shrink: 0;
	}

	.org-option input[type="radio"]:checked + .org-info {
		color: var(--color-brand-coral);
	}

	.org-info {
		flex: 1;
	}

	.org-name {
		font-weight: 600;
		font-size: 15px;
		color: var(--color-text-primary);
		margin-bottom: 4px;
	}

	.org-desc {
		font-size: 13px;
		color: var(--color-text-secondary);
		font-family: 'Monaco', 'Courier New', monospace;
	}

	.alert {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 16px;
		border-radius: 8px;
		font-size: 14px;
		line-height: 1.5;
	}

	.alert-info {
		background: rgba(13, 110, 253, 0.1);
		border: 1px solid rgba(13, 110, 253, 0.2);
		color: #084298;
	}

	.alert svg {
		flex-shrink: 0;
		margin-top: 2px;
	}
</style>
