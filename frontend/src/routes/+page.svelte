<script lang="ts">
	import { goto } from '$app/navigation';
	import SavedPromptsLibrary from '$lib/components/SavedPromptsLibrary.svelte';
	import RoutinesLibrary from '$lib/components/RoutinesLibrary.svelte';
	import ChatHistoryList from '$lib/components/ChatHistoryList.svelte';
	import { DEFAULT_ROUTINES, type Routine } from '$lib/types/routine';

	let searchValue = '';
	let showSavedPrompts = false;
	let showRoutinesLibrary = false;

	// Get recent routines from DEFAULT_ROUTINES
	const recentRoutines = DEFAULT_ROUTINES.slice(0, 3);

	function handleSearch() {
		if (searchValue.trim()) {
			// Navigate to chat with the query
			goto(`/chat?q=${encodeURIComponent(searchValue.trim())}`);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSearch();
		}
	}

	function handleOpenSavedPrompts() {
		showSavedPrompts = true;
	}

	function handleCloseSavedPrompts() {
		showSavedPrompts = false;
	}

	function handleUsePrompt(promptText: string) {
		searchValue = promptText;
		showSavedPrompts = false;
		// Auto-navigate if it doesn't have placeholders
		if (!promptText.includes('[') || !promptText.includes(']')) {
			handleSearch();
		}
	}

	function handleRunRoutine(routine: Routine) {
		console.log('🔄 Running routine:', routine.name);
		// Close the routines library
		showRoutinesLibrary = false;
		// Navigate to chat with the routine prompt
		goto(`/chat?q=${encodeURIComponent(routine.prompt)}`);
	}

	function handleCreateRoutine() {
		console.log('📝 Creating new routine...');
		// TODO: Navigate to routine creation page or show modal
		goto('/chat?action=create-routine');
	}

	function handleClickRecentRoutine(routine: Routine) {
		console.log('🔄 Running recent routine:', routine.name);
		// Navigate to chat with the routine prompt
		goto(`/chat?q=${encodeURIComponent(routine.prompt)}`);
	}
</script>

<svelte:head>
	<title>LOIS - Search or Talk to LO\S</title>
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
			<button class="nav-item" on:click={() => goto('/chat')}>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path d="M8 2L8 14M2 8L14 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				</svg>
				New Chat
			</button>
			<button class="nav-item" on:click={handleCreateRoutine}>
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
				<span>Recent Routines</span>
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
					<path d="M3 5L6 8L9 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
			<div class="routine-list">
				{#each recentRoutines as routine, index}
					<button class="routine-item" on:click={() => handleClickRecentRoutine(routine)}>
						<div class="routine-content">
							<div class="routine-title">{routine.name}</div>
							<div class="routine-desc">{routine.description}</div>
						</div>
						<span class="routine-badge">{index + 2}</span>
					</button>
				{/each}
			</div>
		</div>

		<div class="sidebar-section">
			<button class="section-header">
				<span>Recent chats</span>
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
					<path d="M3 5L6 8L9 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
			<ChatHistoryList limit={8} />
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
						bind:value={searchValue}
						on:keydown={handleKeydown}
					/>
					<div class="input-controls">
						<div class="input-left">
							<button class="input-button dropdown">
								Look at...
								<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
									<path d="M3 5L6 8L9 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</button>
							<button class="input-button" on:click={handleOpenSavedPrompts}>
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
							<button class="ask-button" on:click={handleSearch}>
								Ask LO\S
								<span class="button-indicator"></span>
							</button>
						</div>
					</div>
				</div>

				<div class="action-cards">
					<button class="action-card">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="action-icon">
							<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
							<path d="M16 16L20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
						</svg>
						<span class="action-title">Search</span>
					</button>
					<button class="action-card">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="action-icon">
							<rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
							<path d="M9 8H15M9 12H15M9 16H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
						</svg>
						<span class="action-title">Report</span>
					</button>
					<button class="action-card">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="action-icon">
							<path d="M3 13L5 18L9 9L15 18L19 7L21 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
						<span class="action-title">Analyze</span>
					</button>
					<button class="action-card">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="action-icon">
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
		width: 100%;
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 12px;
		padding-left: 16px;
		border-radius: 8px;
		cursor: pointer;
		margin-bottom: 8px;
		background: white;
		border: 1px solid var(--color-border);
		border-left: 3px solid #FF9F66;
		transition: all 0.15s;
		text-align: left;
		font-family: inherit;
	}

	.routine-item:hover {
		border-left-color: var(--color-brand-coral);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
		display: flex;
		align-items: center;
		gap: 8px;
		position: relative;
	}

	.ask-button:hover {
		background: #333;
	}

	.button-indicator {
		width: 6px;
		height: 6px;
		background: #FF6B9D;
		border-radius: 50%;
		display: inline-block;
	}

	.action-cards {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.action-card {
		flex: 1;
		min-width: 160px;
		padding: 16px;
		border: 1px solid var(--color-border);
		background: white;
		border-radius: 8px;
		cursor: pointer;
		display: flex;
		flex-direction: row;
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
		flex-shrink: 0;
		width: 20px;
		height: 20px;
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

{#if showSavedPrompts}
	<SavedPromptsLibrary onUsePrompt={handleUsePrompt} onClose={handleCloseSavedPrompts} />
{/if}

{#if showRoutinesLibrary}
	<RoutinesLibrary
		onClose={() => showRoutinesLibrary = false}
		onRunRoutine={handleRunRoutine}
	/>
{/if}
