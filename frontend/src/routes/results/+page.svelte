<script lang="ts">
	// LOIS Results Page - Matches Figma Design
	// This page shows the chat conversation with inline data tables

	type Message = {
		role: 'user' | 'assistant';
		content: string;
	};

	// Sample data matching Figma design
	let messages: Message[] = [
		{
			role: 'user',
			content: 'How many open personal injury cases are currently in the discovery phase?'
		},
		{
			role: 'assistant',
			content: 'I found 42 open personal injury cases that are now in the discovery phase.'
		}
	];

	// Sample table data from Figma
	const tableData = [
		{ project: { name: 'Ava Thompson', avatar: 'female-3' }, type: 'Personal Injury', phase: 'Discovery', primary: 'Daniel Ruiz' },
		{ project: { name: 'Billy Snead', avatar: 'male-1' }, type: 'Personal Injury', phase: 'Discovery', primary: 'Rachel Hegmann' },
		{ project: { name: 'Sofia Nguyen', avatar: 'female-2' }, type: 'Personal Injury', phase: 'Discovery', primary: 'Mary Berry' },
		{ project: { name: 'Billy Snead', avatar: 'male-1' }, type: 'Personal Injury', phase: 'Potential New Cli...', primary: 'Mary Berry' },
		{ project: { name: 'Billy Snead', avatar: 'male-1' }, type: 'Personal Injury', phase: 'Potential New Cli...', primary: 'Mary Berry' },
		{ project: { name: 'Billy Snead', avatar: 'male-1' }, type: 'Personal Injury', phase: 'Potential New Cli...', primary: 'Mary Berry' },
		{ project: { name: 'Billy Snead', avatar: 'male-1' }, type: 'Personal Injury', phase: 'Potential New Cli...', primary: 'Mary Berry' },
		{ project: { name: 'Billy Snead', avatar: 'male-1' }, type: 'Personal Injury', phase: 'Potential New Cli...', primary: 'Mary Berry' },
		{ project: { name: 'Billy Snead', avatar: 'male-1' }, type: 'Personal Injury', phase: 'Potential New Cli...', primary: 'Mary Berry' },
		{ project: { name: 'Billy Snead', avatar: 'male-1' }, type: 'Personal Injury', phase: 'Potential New Cli...', primary: 'Mary Berry' },
		{ project: { name: 'Billy Snead', avatar: 'male-1' }, type: 'Personal Injury', phase: 'Potential New Cli...', primary: 'Mary Berry' },
		{ project: { name: 'Billy Snead', avatar: 'male-1' }, type: 'Personal Injury', phase: 'Potential New Cli...', primary: 'Mary Berry' }
	];

	// Get initials from name
	function getInitials(name: string): string {
		const parts = name.split(' ');
		if (parts.length >= 2) {
			return parts[0][0] + parts[1][0];
		}
		return name[0];
	}
</script>

<svelte:head>
	<title>Personal Injury Cases in Discovery Phase - LOIS</title>
</svelte:head>

<div class="app-container">
	<!-- Main Content Area -->
	<main class="main-content">
		<!-- Header with Title -->
		<header class="page-header">
			<div class="header-content">
				<button class="title-button">
					<span class="title-text">Personal Injury Cases in Discovery Phase</span>
					<svg width="25" height="25" viewBox="0 0 25 25" fill="none">
						<path d="M6.25 10.4166L12.5 16.6666L18.75 10.4166" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
		</header>

		<!-- Chat Messages Area -->
		<div class="chat-area">
			<div class="messages-container">
				<!-- User Query -->
				<div class="message-group user-message-group">
					<div class="user-message">
						{messages[0].content}
					</div>
				</div>

				<!-- Assistant Response -->
				<div class="message-group assistant-message-group">
					<div class="assistant-response">
						<p class="response-text">
							I found <strong>42</strong> open personal injury cases that are now in the discovery phase.
						</p>
					</div>

					<!-- Data Table Card -->
					<div class="table-card">
						<div class="table-header">
							<h3 class="table-title">Personal Injury Cases in Discovery Phase</h3>
							<span class="table-subtitle">Table · Version 1</span>
							<button class="table-menu-btn" aria-label="Table options">
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
									<circle cx="10" cy="4" r="1.5" fill="currentColor"/>
									<circle cx="10" cy="10" r="1.5" fill="currentColor"/>
									<circle cx="10" cy="16" r="1.5" fill="currentColor"/>
								</svg>
							</button>
						</div>

						<div class="table-wrapper">
							<table class="data-table">
								<thead>
									<tr>
										<th>
											<button class="column-header">
												<span>Project</span>
												<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
													<path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5"/>
												</svg>
											</button>
										</th>
										<th>
											<button class="column-header">
												<span>Type</span>
												<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
													<path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5"/>
												</svg>
											</button>
										</th>
										<th>
											<button class="column-header">
												<span>Phase</span>
												<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
													<path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5"/>
												</svg>
											</button>
										</th>
										<th>
											<button class="column-header">
												<span>Primary</span>
												<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
													<path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5"/>
												</svg>
											</button>
										</th>
										<th class="actions-col"></th>
									</tr>
								</thead>
								<tbody>
									{#each tableData as row}
										<tr>
											<td class="project-cell">
												<div class="project-content">
													<div class="avatar">
														{getInitials(row.project.name)}
													</div>
													<div class="project-info">
														<div class="project-name">{row.project.name}</div>
														<div class="project-subname">{row.project.name}</div>
													</div>
												</div>
											</td>
											<td>{row.type}</td>
											<td>{row.phase}</td>
											<td>{row.primary}</td>
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

						<div class="table-footer">
							<span class="row-count">+4 more rows</span>
							<button class="view-full-btn">View Full Table</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Input Area -->
		<div class="input-area">
			<div class="input-container">
				<input
					type="text"
					class="chat-input"
					placeholder=""
				/>
				<div class="input-controls">
					<div class="input-left">
						<button class="control-btn dropdown">
							Look at...
							<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
								<path d="M3 5L6 8L9 5" stroke="currentColor" stroke-width="1.5"/>
							</svg>
						</button>
						<button class="control-btn">
							<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
								<path d="M7 1L8.5 5.5H13L9.5 8.5L11 13L7 10L3 13L4.5 8.5L1 5.5H5.5L7 1Z"/>
							</svg>
							Saved Prompts
						</button>
					</div>
					<div class="input-right">
						<button class="icon-btn" aria-label="Upload">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
								<path d="M9 13V5M5 9L9 5L13 9" stroke="currentColor" stroke-width="1.5"/>
								<path d="M4 15H14" stroke="currentColor" stroke-width="1.5"/>
							</svg>
						</button>
						<button class="icon-btn" aria-label="Voice">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
								<rect x="7" y="3" width="4" height="7" rx="2" stroke="currentColor" stroke-width="1.5"/>
								<path d="M5 9C5 11.2 6.8 13 9 13M9 13C11.2 13 13 11.2 13 9M9 13V16M7 16H11" stroke="currentColor" stroke-width="1.5"/>
							</svg>
						</button>
						<button class="ask-btn">
							Ask LO\S
						</button>
					</div>
				</div>
			</div>
		</div>
	</main>

	<!-- Right Action Toolbar -->
	<aside class="action-toolbar">
		<button class="toolbar-btn" aria-label="Dock to right">
			<svg width="25" height="25" viewBox="0 0 25 25" fill="none">
				<path d="M3 6.5H14M3 12.5H14M3 18.5H14M18 6.5H22M18 12.5H22M18 18.5H22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
			</svg>
		</button>
		<button class="toolbar-btn" aria-label="Edit">
			<svg width="25" height="25" viewBox="0 0 25 25" fill="none">
				<path d="M4 16L4 21L9 21M4 16L15 5L20 10L9 21L4 21" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
			</svg>
		</button>
		<button class="toolbar-btn" aria-label="Add">
			<svg width="25" height="25" viewBox="0 0 25 25" fill="none">
				<circle cx="12.5" cy="12.5" r="9" stroke="currentColor" stroke-width="2"/>
				<path d="M12.5 8.5V16.5M8.5 12.5H16.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
			</svg>
		</button>
		<button class="toolbar-btn" aria-label="Book">
			<svg width="25" height="25" viewBox="0 0 25 25" fill="none">
				<path d="M4 4H11C12.1 4 13 4.9 13 6V20C13 19.4 12.6 19 12 19H4V4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
				<path d="M21 4H14C12.9 4 12 4.9 12 6V20C12 19.4 12.4 19 13 19H21V4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
			</svg>
		</button>
	</aside>
</div>

<style>
	.app-container {
		display: flex;
		height: 100vh;
		background: var(--color-bg-secondary);
		overflow: hidden;
	}

	/* Main Content */
	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		background: white;
		overflow: hidden;
	}

	/* Header */
	.page-header {
		background: white;
		border-bottom: 3px solid #E0E0E0;
		padding: 0;
		display: flex;
		align-items: center;
	}

	.header-content {
		width: 100%;
		padding: 15px 20px;
	}

	.title-button {
		display: flex;
		align-items: center;
		gap: 5px;
		border: none;
		background: transparent;
		cursor: pointer;
		padding: 0;
	}

	.title-text {
		font-size: 17.5px;
		font-weight: 400;
		color: #161616;
		font-family: 'Helvetica Now Text', -apple-system, sans-serif;
	}

	.title-button svg {
		color: #525252;
	}

	/* Chat Area */
	.chat-area {
		flex: 1;
		overflow-y: auto;
		background: var(--color-bg-secondary);
	}

	.messages-container {
		max-width: 1100px;
		margin: 0 auto;
		padding: 20px;
	}

	.message-group {
		margin-bottom: 15px;
	}

	.user-message-group {
		display: flex;
		justify-content: flex-end;
	}

	.user-message {
		background: #E8E8E8;
		padding: 15px 25px;
		border-radius: 10px;
		font-size: 14px;
		line-height: 20px;
		color: #161616;
		max-width: 70%;
	}

	.assistant-message-group {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.assistant-response {
		padding: 0;
	}

	.response-text {
		font-size: 14px;
		line-height: 20px;
		color: #161616;
		margin: 0;
	}

	.response-text strong {
		font-weight: 700;
	}

	/* Table Card */
	.table-card {
		background: white;
		border: 1px solid #BDBDBD;
		border-radius: 8px;
		overflow: hidden;
	}

	.table-header {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 15px;
		border-bottom: 1px solid #E0E0E0;
		position: relative;
	}

	.table-title {
		font-size: 14px;
		font-weight: 400;
		color: #161616;
		margin: 0;
	}

	.table-subtitle {
		font-size: 12px;
		color: #757575;
	}

	.table-menu-btn {
		margin-left: auto;
		border: none;
		background: transparent;
		cursor: pointer;
		color: #525252;
		padding: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: background 0.15s;
	}

	.table-menu-btn:hover {
		background: #F5F5F5;
	}

	/* Data Table */
	.table-wrapper {
		overflow-x: auto;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 14px;
	}

	.data-table thead {
		background: #F5F5F5;
		border-bottom: 1px solid #E0E0E0;
	}

	.data-table th {
		text-align: left;
		padding: 10px 15px;
		font-weight: 400;
		color: #525252;
	}

	.column-header {
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
	}

	.column-header svg {
		opacity: 0.6;
	}

	.data-table tbody tr {
		border-bottom: 1px solid #E0E0E0;
		transition: background 0.15s;
	}

	.data-table tbody tr:hover {
		background: #FAFAFA;
	}

	.data-table td {
		padding: 12px 15px;
		color: #161616;
	}

	.project-cell {
		padding: 8px 15px;
	}

	.project-content {
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

	.project-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.project-name {
		font-size: 14px;
		color: #161616;
		font-weight: 500;
	}

	.project-subname {
		font-size: 12px;
		color: #757575;
	}

	.actions-col {
		width: 40px;
	}

	.actions-cell {
		text-align: center;
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

	.table-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 15px;
		border-top: 1px solid #E0E0E0;
		background: #FAFAFA;
	}

	.row-count {
		font-size: 13px;
		color: #757575;
	}

	.view-full-btn {
		padding: 6px 12px;
		border: 1px solid #BDBDBD;
		background: white;
		border-radius: 6px;
		font-size: 13px;
		color: #161616;
		cursor: pointer;
		transition: all 0.15s;
	}

	.view-full-btn:hover {
		background: #F5F5F5;
	}

	/* Input Area */
	.input-area {
		background: white;
		border-top: 1px solid #E0E0E0;
		padding: 20px;
	}

	.input-container {
		max-width: 1060px;
		margin: 0 auto;
		background: white;
		border: 1px solid #BDBDBD;
		border-radius: 12px;
		padding: 16px;
	}

	.chat-input {
		width: 100%;
		border: none;
		font-size: 16px;
		padding: 8px 0;
		outline: none;
		color: #161616;
	}

	.chat-input::placeholder {
		color: #9E9E9E;
	}

	.input-controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 12px;
		padding-top: 12px;
		border-top: 1px solid #E0E0E0;
	}

	.input-left,
	.input-right {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.control-btn {
		padding: 6px 12px;
		border: 1px solid #BDBDBD;
		background: white;
		border-radius: 6px;
		font-size: 13px;
		color: #161616;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 4px;
		transition: background 0.15s;
	}

	.control-btn:hover {
		background: #F5F5F5;
	}

	.icon-btn {
		width: 28px;
		height: 28px;
		padding: 0;
		border: none;
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #757575;
		border-radius: 4px;
		transition: background 0.15s;
	}

	.icon-btn:hover {
		background: #F5F5F5;
	}

	.ask-btn {
		padding: 8px 20px;
		border: none;
		background: #161616;
		color: white;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s;
	}

	.ask-btn:hover {
		background: #333;
	}

	/* Right Action Toolbar */
	.action-toolbar {
		width: 55px;
		background: #F4F4F4;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		padding: 20px 15px;
	}

	.toolbar-btn {
		width: 25px;
		height: 25px;
		padding: 0;
		border: none;
		background: transparent;
		cursor: pointer;
		color: #525252;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.15s;
	}

	.toolbar-btn:hover {
		color: #161616;
	}
</style>
