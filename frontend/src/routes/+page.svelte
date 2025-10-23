<script lang="ts">
	// LOIS Landing Page - Conversational Interface
</script>

<svelte:head>
	<title>LOIS - Search or Talk to LO\S</title>
</svelte:head>

<div class="app-container">
	<!-- Sidebar -->
	<aside class="sidebar">
		<div class="sidebar-header">
			<h1 class="logo">LO\S</h1>
			<button class="icon-button" aria-label="Toggle sidebar">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
					<rect x="3" y="4" width="14" height="2" rx="1" fill="currentColor"/>
					<rect x="3" y="9" width="14" height="2" rx="1" fill="currentColor"/>
					<rect x="3" y="14" width="14" height="2" rx="1" fill="currentColor"/>
				</svg>
			</button>
		</div>

		<nav class="sidebar-nav">
			<button class="nav-item">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path d="M8 2L8 14M2 8L14 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				</svg>
				New Chat
			</button>
			<button class="nav-item">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2"/>
					<path d="M8 5V9L10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				</svg>
				Create Routine
			</button>
			<button class="nav-item">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<rect x="3" y="4" width="10" height="10" rx="1" stroke="currentColor" stroke-width="2"/>
					<path d="M6 2V4M10 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				</svg>
				Routines Library
			</button>
		</nav>

		<div class="sidebar-section">
			<button class="section-header">
				<span>Recent Routines</span>
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
					<path d="M3 5L6 8L9 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
			<div class="routine-list">
				<div class="routine-item">
					<div class="routine-content">
						<div class="routine-title">Meds > $100k</div>
						<div class="routine-desc">Finds all cases where medical expenses exceed $100,000.</div>
					</div>
					<span class="routine-badge">2</span>
				</div>
				<div class="routine-item">
					<div class="routine-content">
						<div class="routine-title">Depos Next Month</div>
						<div class="routine-desc">Lists all depositions scheduled for the upcoming month.</div>
					</div>
					<span class="routine-badge">2</span>
				</div>
				<div class="routine-item">
					<div class="routine-content">
						<div class="routine-title">Inactive Clients</div>
						<div class="routine-desc">Alerts for clients with no communications in 60 days.</div>
					</div>
					<span class="routine-badge">3</span>
				</div>
			</div>
		</div>

		<div class="sidebar-section">
			<button class="section-header">
				<span>Recent chats</span>
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
					<path d="M3 5L6 8L9 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
			<div class="chat-list">
				<button class="chat-item">Personal Injury Cases in Discove...</button>
				<button class="chat-item">Upcoming Depositions – October</button>
				<button class="chat-item">Client Medical Record Summary</button>
				<button class="chat-item">Negligence Case Review</button>
				<button class="chat-item">Open Litigation Tracker</button>
				<button class="chat-item">Hearing Schedule – This Week</button>
				<button class="chat-item">Pending Settlement Report</button>
				<button class="chat-item">Inactive Client Follow-ups</button>
			</div>
		</div>

		<div class="sidebar-footer">
			<span class="sidebar-version">LOIS Landing V2</span>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="main-content">
		<div class="content-wrapper">
			<div class="hero-section">
				<h2 class="hero-title">Search or Talk to LO\S</h2>
				<p class="hero-subtitle">Find documents, search projects, ask questions, or have Lois take action</p>

				<div class="search-input-wrapper">
					<input
						type="text"
						class="search-input"
						placeholder="What would you like get done today?"
					/>
					<div class="input-controls">
						<div class="input-left">
							<button class="input-button">Look at...</button>
							<button class="input-button">
								<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
									<path d="M8 2L9.5 6.5H14L10.5 9.5L12 14L8 11L4 14L5.5 9.5L2 6.5H6.5L8 2Z"/>
								</svg>
								Saved Prompts
							</button>
						</div>
						<div class="input-right">
							<button class="icon-button" aria-label="Upload file">
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
									<path d="M10 14V6M6 10L10 6L14 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M4 16H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
								</svg>
							</button>
							<button class="icon-button" aria-label="Voice input">
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
									<path d="M10 2C8.34315 2 7 3.34315 7 5V10C7 11.6569 8.34315 13 10 13C11.6569 13 13 11.6569 13 10V5C13 3.34315 11.6569 2 10 2Z" stroke="currentColor" stroke-width="2"/>
									<path d="M5 10C5 12.7614 7.23858 15 10 15M10 15C12.7614 15 15 12.7614 15 10M10 15V18M8 18H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
								</svg>
							</button>
							<button class="ask-button">Ask LO\S</button>
						</div>
					</div>
				</div>

				<div class="action-cards">
					<button class="action-card">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="action-icon">
							<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
							<path d="M16 16L20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
						</svg>
						<span class="action-title">Search</span>
					</button>
					<button class="action-card">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="action-icon">
							<rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
							<path d="M9 8H15M9 12H15M9 16H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
						</svg>
						<span class="action-title">Report</span>
					</button>
					<button class="action-card">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="action-icon">
							<path d="M3 13L5 18L9 9L15 18L19 7L21 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
						<span class="action-title">Analyze</span>
					</button>
					<button class="action-card">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="action-icon">
							<path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
						</svg>
						<span class="action-title">Summarize</span>
					</button>
				</div>
			</div>
		</div>
	</main>
</div>

<style>
	.app-container {
		display: flex;
		height: 100vh;
		overflow: hidden;
	}

	/* Sidebar */
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
		font-size: 18px;
		font-weight: 600;
		color: var(--color-brand-coral);
		margin: 0;
		letter-spacing: 0.05em;
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

	.routine-list, .chat-list {
		margin-top: 8px;
	}

	.routine-item {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		padding: 8px;
		border-radius: 6px;
		cursor: pointer;
		margin-bottom: 4px;
		transition: background 0.15s;
	}

	.routine-item:hover {
		background: #f5f5f5;
	}

	.routine-content {
		flex: 1;
	}

	.routine-title {
		font-size: 14px;
		font-weight: 500;
		color: var(--color-text-primary);
		margin-bottom: 4px;
	}

	.routine-desc {
		font-size: 12px;
		color: var(--color-text-secondary);
		line-height: 1.4;
	}

	.routine-badge {
		width: 20px;
		height: 20px;
		background: #2196F3;
		color: white;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 11px;
		font-weight: 500;
		flex-shrink: 0;
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

	.sidebar-footer {
		padding: 16px;
		margin-top: auto;
		font-size: 12px;
		color: var(--color-text-secondary);
	}

	/* Main Content */
	.main-content {
		flex: 1;
		overflow-y: auto;
		background: var(--color-bg-secondary);
	}

	.content-wrapper {
		max-width: 800px;
		margin: 0 auto;
		padding: 80px 32px;
	}

	.hero-section {
		text-align: center;
	}

	.hero-title {
		font-size: 36px;
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0 0 12px 0;
	}

	.hero-subtitle {
		font-size: 16px;
		color: var(--color-text-secondary);
		margin: 0 0 40px 0;
	}

	.search-input-wrapper {
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 16px;
		margin-bottom: 32px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.search-input {
		width: 100%;
		border: none;
		font-size: 16px;
		padding: 8px 0;
		outline: none;
		color: var(--color-text-primary);
	}

	.search-input::placeholder {
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

	.ask-button {
		padding: 8px 20px;
		border: none;
		background: var(--color-brand-black);
		color: white;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s;
	}

	.ask-button:hover {
		background: #333;
	}

	.action-cards {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
	}

	.action-card {
		padding: 24px;
		border: 1px solid var(--color-border);
		background: white;
		border-radius: 8px;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		transition: all 0.15s;
	}

	.action-card:hover {
		border-color: var(--color-brand-coral);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.action-icon {
		color: var(--color-text-secondary);
	}

	.action-title {
		font-size: 14px;
		font-weight: 500;
		color: var(--color-text-primary);
	}

	@media (max-width: 768px) {
		.sidebar {
			position: fixed;
			left: -280px;
			z-index: 100;
			transition: left 0.3s;
		}

		.action-cards {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
