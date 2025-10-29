<script lang="ts">
	import { onMount } from 'svelte';
	import type { SavedPrompt } from '$lib/types/prompt';
	import { PROMPT_CATEGORIES, DEFAULT_PROMPTS } from '$lib/types/prompt';
	import PromptCreation from './PromptCreation.svelte';

	export let onUsePrompt: (promptText: string) => void;
	export let onClose: () => void;

	const STORAGE_KEY = 'lois_saved_prompts';

	// Load prompts from localStorage or use defaults
	let prompts: SavedPrompt[] = [];
	let showCreation = false;
	let editingPrompt: SavedPrompt | null = null;
	let selectedCategory: SavedPrompt['category'] | 'all' = 'all';
	let searchQuery = '';
	let showFavoritesOnly = false;
	let expandedPromptId: string | null = null; // Track which prompt is expanded

	// Load prompts from localStorage on mount
	onMount(() => {
		loadPromptsFromStorage();
	});

	function loadPromptsFromStorage() {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				prompts = JSON.parse(stored);
				console.log('✅ Loaded', prompts.length, 'saved prompts from localStorage');
			} else {
				// First time - use defaults
				prompts = [...DEFAULT_PROMPTS];
				savePromptsToStorage();
				console.log('✅ Initialized with', prompts.length, 'default prompts');
			}
		} catch (error) {
			console.error('❌ Error loading prompts from localStorage:', error);
			prompts = [...DEFAULT_PROMPTS];
		}
	}

	function savePromptsToStorage() {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
			console.log('💾 Saved', prompts.length, 'prompts to localStorage');
		} catch (error) {
			console.error('❌ Error saving prompts to localStorage:', error);
		}
	}

	// Filter prompts
	$: filteredPrompts = prompts.filter(prompt => {
		const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
		const matchesSearch =
			prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
		const matchesFavorite = !showFavoritesOnly || prompt.isFavorite;

		return matchesCategory && matchesSearch && matchesFavorite;
	}).sort((a, b) => {
		// Sort favorites first, then by usage count
		if (a.isFavorite && !b.isFavorite) return -1;
		if (!a.isFavorite && b.isFavorite) return 1;
		return b.usageCount - a.usageCount;
	});

	function handleUsePrompt(prompt: SavedPrompt) {
		// Increment usage count
		const index = prompts.findIndex(p => p.id === prompt.id);
		if (index !== -1) {
			prompts[index].usageCount++;
			prompts = [...prompts];
			savePromptsToStorage(); // Persist usage count
		}

		// If prompt has placeholders, show it for the user to fill in
		if (prompt.promptText.includes('[') && prompt.promptText.includes(']')) {
			// For now, just use as-is. In future, could show a modal to fill placeholders
			onUsePrompt(prompt.promptText);
		} else {
			onUsePrompt(prompt.promptText);
		}
	}

	function handleSavePrompt(newPrompt: Omit<SavedPrompt, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) {
		if (editingPrompt) {
			// Update existing
			const index = prompts.findIndex(p => p.id === editingPrompt.id);
			if (index !== -1) {
				prompts[index] = {
					...prompts[index],
					...newPrompt,
					updatedAt: new Date().toISOString()
				};
				prompts = [...prompts];
			}
		} else {
			// Create new
			const newId = `prompt-${Date.now()}`;
			const now = new Date().toISOString();
			prompts = [
				...prompts,
				{
					id: newId,
					...newPrompt,
					createdAt: now,
					updatedAt: now,
					usageCount: 0
				}
			];
		}

		savePromptsToStorage(); // Persist changes
		showCreation = false;
		editingPrompt = null;
	}

	function handleEditPrompt(prompt: SavedPrompt) {
		editingPrompt = prompt;
		showCreation = true;
	}

	function handleDeletePrompt(prompt: SavedPrompt) {
		if (confirm(`Are you sure you want to delete "${prompt.title}"?`)) {
			prompts = prompts.filter(p => p.id !== prompt.id);
			savePromptsToStorage(); // Persist deletion
		}
	}

	function handleToggleFavorite(prompt: SavedPrompt) {
		const index = prompts.findIndex(p => p.id === prompt.id);
		if (index !== -1) {
			prompts[index].isFavorite = !prompts[index].isFavorite;
			prompts = [...prompts];
			savePromptsToStorage(); // Persist favorite toggle
		}
	}

	function handleCreateNew() {
		editingPrompt = null;
		showCreation = true;
	}

	function handleCancelCreation() {
		showCreation = false;
		editingPrompt = null;
	}

	function toggleExpanded(promptId: string) {
		expandedPromptId = expandedPromptId === promptId ? null : promptId;
	}
</script>

<div class="library-overlay" on:click={onClose} role="presentation">
	<div class="library-container" class:creation-mode={showCreation} on:click|stopPropagation role="dialog" aria-modal="true">
		{#if showCreation}
			<div class="creation-wrapper">
				<PromptCreation
					onSave={handleSavePrompt}
					onCancel={handleCancelCreation}
					editingPrompt={editingPrompt}
				/>
			</div>
		{:else}
			<div class="library-header">
				<div class="header-top">
					<h2 class="library-title">Saved Prompts</h2>
					<button class="close-btn" on:click={onClose} aria-label="Close">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
							<path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
						</svg>
					</button>
				</div>

				<div class="header-actions">
					<div class="search-box">
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="search-icon">
							<circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
							<path d="M11 11L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
						</svg>
						<input
							type="text"
							placeholder="Search prompts..."
							bind:value={searchQuery}
							class="search-input"
						/>
					</div>

					<button class="btn-create" on:click={handleCreateNew}>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
							<path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
						</svg>
						Create New
					</button>
				</div>

				<div class="filter-bar">
					<div class="category-filters">
						<button
							class="filter-chip"
							class:active={selectedCategory === 'all'}
							on:click={() => selectedCategory = 'all'}
						>
							All
						</button>
						{#each Object.entries(PROMPT_CATEGORIES) as [key, meta]}
							<button
								class="filter-chip"
								class:active={selectedCategory === key}
								on:click={() => selectedCategory = key}
								style="--chip-color: {meta.color}"
							>
								{meta.label}
							</button>
						{/each}
					</div>

					<button
						class="favorite-toggle"
						class:active={showFavoritesOnly}
						on:click={() => showFavoritesOnly = !showFavoritesOnly}
					>
						<svg width="16" height="16" viewBox="0 0 16 16" fill={showFavoritesOnly ? '#FFD700' : 'none'}>
							<path
								d="M8 1L10 5.5L15 6L11.5 9.5L12.5 15L8 12.5L3.5 15L4.5 9.5L1 6L6 5.5L8 1Z"
								stroke="currentColor"
								stroke-width="1.5"
							/>
						</svg>
						Favorites
					</button>
				</div>
			</div>

			<div class="library-content">
				{#if filteredPrompts.length === 0}
					<div class="empty-state">
						<svg width="48" height="48" viewBox="0 0 48 48" fill="none" class="empty-icon">
							<circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2"/>
							<path d="M24 16V24M24 28H24.02" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
						</svg>
						<p class="empty-text">No prompts found</p>
						<p class="empty-hint">Try adjusting your search or filters</p>
					</div>
				{:else}
					<div class="prompts-list">
						{#each filteredPrompts as prompt (prompt.id)}
							<div class="prompt-row" class:expanded={expandedPromptId === prompt.id}>
								<!-- Main row -->
								<div class="row-main">
									<div class="row-left">
										<button
											class="favorite-btn-inline"
											class:active={prompt.isFavorite}
											on:click={() => handleToggleFavorite(prompt)}
											aria-label={prompt.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
										>
											<svg width="14" height="14" viewBox="0 0 14 14" fill={prompt.isFavorite ? '#FFD700' : 'none'}>
												<path
													d="M7 0.875L8.75 4.8125L13.125 5.25L10.0625 8.3125L10.9375 13.125L7 10.9375L3.0625 13.125L3.9375 8.3125L0.875 5.25L5.25 4.8125L7 0.875Z"
													stroke="currentColor"
													stroke-width="1.2"
												/>
											</svg>
										</button>
										<span class="category-pill" style="--pill-color: {PROMPT_CATEGORIES[prompt.category].color}">
											{PROMPT_CATEGORIES[prompt.category].label}
										</span>
										<h3 class="row-title">{prompt.title}</h3>
									</div>
									<div class="row-right">
										<span class="usage-badge">{prompt.usageCount} uses</span>
										<button
											class="expand-btn"
											on:click={() => toggleExpanded(prompt.id)}
											aria-label={expandedPromptId === prompt.id ? 'Collapse' : 'Expand'}
										>
											<svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="chevron" class:rotated={expandedPromptId === prompt.id}>
												<path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
											</svg>
										</button>
									</div>
								</div>

								<!-- Prompt preview (always visible) -->
								<div class="row-preview">
									<code class="preview-text">{prompt.promptText}</code>
								</div>

								<!-- Expanded content -->
								{#if expandedPromptId === prompt.id}
									<div class="row-expanded">
										{#if prompt.description}
											<p class="expanded-description">{prompt.description}</p>
										{/if}
										{#if prompt.tags.length > 0}
											<div class="expanded-tags">
												{#each prompt.tags as tag}
													<span class="tag-chip">{tag}</span>
												{/each}
											</div>
										{/if}
									</div>
								{/if}

								<!-- Actions row -->
								<div class="row-actions">
									<button class="action-btn-small edit" on:click={() => handleEditPrompt(prompt)} aria-label="Edit">
										<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
											<path d="M9 1.5C9.16667 1.33333 9.38333 1.25 9.65 1.25C9.91667 1.25 10.1333 1.33333 10.3 1.5L10.5 1.7C10.6667 1.86667 10.75 2.08333 10.75 2.35C10.75 2.61667 10.6667 2.83333 10.5 3L3.5 10L1 11L2 8.5L9 1.5Z" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>
										Edit
									</button>
									<button class="action-btn-small delete" on:click={() => handleDeletePrompt(prompt)} aria-label="Delete">
										<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
											<path d="M1.5 3H10.5M4.5 5.25V9M7.5 5.25V9M2.25 3L3 10.5C3 10.7 3.1 10.875 3.25 11C3.4 11.125 3.575 11.25 3.75 11.25H8.25C8.425 11.25 8.6 11.125 8.75 11C8.9 10.875 9 10.7 9 10.5L9.75 3M4.5 3V1.5C4.5 1.3 4.6 1.125 4.75 1C4.9 0.875 5.075 0.75 5.25 0.75H6.75C6.925 0.75 7.1 0.875 7.25 1C7.4 1.125 7.5 1.3 7.5 1.5V3" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>
										Delete
									</button>
									<button class="btn-use-compact" on:click={() => handleUsePrompt(prompt)}>
										Use Prompt
									</button>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.library-overlay {
		/* Side panel - positioned on right side */
		position: absolute;
		top: 0;
		right: 0;
		width: 480px;
		min-width: 480px;
		max-width: 480px;
		height: 100%;
		display: flex;
		flex-direction: column;
		z-index: 100;
	}

	.library-container {
		background: white;
		border-left: 1px solid #E0E0E0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		overflow: hidden;
	}

	.library-container.creation-mode {
		/* Keep same styling in creation mode */
	}

	.creation-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		min-height: 400px;
	}

	.library-header {
		padding: 24px 28px;
		border-bottom: 1px solid #E5E5E5;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.header-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.library-title {
		font-size: 24px;
		font-weight: 600;
		color: #161616;
		margin: 0;
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		padding: 0;
		background: transparent;
		border: none;
		color: #6F6F6F;
		cursor: pointer;
		border-radius: 6px;
		transition: all 0.15s;
	}

	.close-btn:hover {
		background: #F4F4F4;
		color: #161616;
	}

	.header-actions {
		display: flex;
		gap: 12px;
		align-items: center;
	}

	.search-box {
		flex: 1;
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-icon {
		position: absolute;
		left: 12px;
		color: #6F6F6F;
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 10px 12px 10px 36px;
		font-size: 14px;
		color: #161616;
		background: #F4F4F4;
		border: 1px solid transparent;
		border-radius: 6px;
		font-family: inherit;
		transition: all 0.15s;
	}

	.search-input:focus {
		outline: none;
		background: white;
		border-color: #161616;
	}

	.btn-create {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 10px 16px;
		font-size: 14px;
		font-weight: 500;
		color: white;
		background: #161616;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: background 0.15s;
		white-space: nowrap;
	}

	.btn-create:hover {
		background: #2D2D2D;
	}

	.filter-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.category-filters {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.filter-chip {
		padding: 6px 12px;
		font-size: 13px;
		color: #6F6F6F;
		background: #F4F4F4;
		border: 1px solid transparent;
		border-radius: 20px;
		cursor: pointer;
		transition: all 0.15s;
		white-space: nowrap;
	}

	.filter-chip:hover {
		background: #E8E8E8;
		color: #161616;
	}

	.filter-chip.active {
		color: white;
		background: var(--chip-color, #161616);
		border-color: var(--chip-color, #161616);
	}

	.favorite-toggle {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px;
		font-size: 13px;
		color: #6F6F6F;
		background: #F4F4F4;
		border: 1px solid transparent;
		border-radius: 20px;
		cursor: pointer;
		transition: all 0.15s;
	}

	.favorite-toggle:hover,
	.favorite-toggle.active {
		background: #FFF9E6;
		color: #B8860B;
		border-color: #FFD700;
	}

	.library-content {
		flex: 1;
		overflow-y: auto;
		padding: 24px 28px;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60px 20px;
		text-align: center;
	}

	.empty-icon {
		color: #D0D0D0;
		margin-bottom: 16px;
	}

	.empty-text {
		font-size: 16px;
		font-weight: 500;
		color: #161616;
		margin: 0 0 8px 0;
	}

	.empty-hint {
		font-size: 14px;
		color: #6F6F6F;
		margin: 0;
	}

	/* Compact List Styles */
	.prompts-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.prompt-row {
		background: white;
		border: 1px solid #E5E5E5;
		border-radius: 8px;
		padding: 12px 16px;
		transition: all 0.15s;
	}

	.prompt-row:hover {
		border-color: #D0D0D0;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
	}

	.prompt-row.expanded {
		border-color: #161616;
	}

	/* Main row */
	.row-main {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 8px;
	}

	.row-left {
		display: flex;
		align-items: center;
		gap: 10px;
		flex: 1;
		min-width: 0;
	}

	.favorite-btn-inline {
		flex-shrink: 0;
		width: 24px;
		height: 24px;
		padding: 0;
		background: transparent;
		border: none;
		color: #D0D0D0;
		cursor: pointer;
		font-size: 16px;
		transition: all 0.15s;
	}

	.favorite-btn-inline:hover {
		color: #FFD700;
		transform: scale(1.1);
	}

	.favorite-btn-inline.active {
		color: #FFD700;
	}

	.category-pill {
		flex-shrink: 0;
		padding: 3px 8px;
		font-size: 10px;
		font-weight: 600;
		color: white;
		background: var(--pill-color);
		border-radius: 10px;
		text-transform: uppercase;
		letter-spacing: 0.3px;
	}

	.row-title {
		flex: 1;
		font-size: 14px;
		font-weight: 600;
		color: #161616;
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.row-right {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-shrink: 0;
	}

	.usage-badge {
		font-size: 11px;
		color: #6F6F6F;
		background: #F4F4F4;
		padding: 3px 8px;
		border-radius: 10px;
	}

	.expand-btn {
		width: 24px;
		height: 24px;
		padding: 0;
		background: transparent;
		border: none;
		color: #6F6F6F;
		cursor: pointer;
		font-size: 12px;
		transition: all 0.15s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.expand-btn:hover {
		background: #F4F4F4;
		color: #161616;
		border-radius: 4px;
	}

	.prompt-row.expanded .expand-btn {
		transform: rotate(180deg);
	}

	/* Preview row (always visible) */
	.row-preview {
		background: #F4F4F4;
		border-radius: 6px;
		padding: 8px 12px;
		margin-bottom: 8px;
		max-height: 60px;
		overflow: hidden;
	}

	.preview-text {
		font-size: 12px;
		line-height: 1.4;
		color: #161616;
		font-family: 'SF Mono', Monaco, Consolas, monospace;
		white-space: pre-wrap;
		word-break: break-word;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Expanded section */
	.row-expanded {
		padding: 12px 0;
		border-top: 1px solid #E5E5E5;
		margin-bottom: 8px;
		animation: slideDown 0.2s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			max-height: 0;
		}
		to {
			opacity: 1;
			max-height: 300px;
		}
	}

	.expanded-description {
		font-size: 13px;
		color: #6F6F6F;
		line-height: 1.5;
		margin: 0 0 12px 0;
	}

	.expanded-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.tag-chip {
		padding: 3px 8px;
		font-size: 11px;
		color: #6F6F6F;
		background: #F4F4F4;
		border-radius: 10px;
	}

	/* Actions row */
	.row-actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 8px;
		padding-top: 8px;
		border-top: 1px solid #E5E5E5;
	}

	.action-btn-small {
		padding: 5px 10px;
		font-size: 12px;
		font-weight: 500;
		color: #6F6F6F;
		background: transparent;
		border: 1px solid #E5E5E5;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.15s;
	}

	.action-btn-small:hover {
		background: #F4F4F4;
		color: #161616;
		border-color: #D0D0D0;
	}

	.action-btn-small.delete:hover {
		background: #FFF1F1;
		color: #DA1E28;
		border-color: #DA1E28;
	}

	.btn-use-compact {
		padding: 5px 14px;
		font-size: 12px;
		font-weight: 500;
		color: white;
		background: #161616;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background 0.15s;
	}

	.btn-use-compact:hover {
		background: #2D2D2D;
	}
</style>
