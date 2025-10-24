<script lang="ts">
	import type { SavedPrompt } from '$lib/types/prompt';
	import { PROMPT_CATEGORIES, DEFAULT_PROMPTS } from '$lib/types/prompt';
	import PromptCreation from './PromptCreation.svelte';

	export let onUsePrompt: (promptText: string) => void;
	export let onClose: () => void;

	let prompts: SavedPrompt[] = [...DEFAULT_PROMPTS];
	let showCreation = false;
	let editingPrompt: SavedPrompt | null = null;
	let selectedCategory: SavedPrompt['category'] | 'all' = 'all';
	let searchQuery = '';
	let showFavoritesOnly = false;

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
		}
	}

	function handleToggleFavorite(prompt: SavedPrompt) {
		const index = prompts.findIndex(p => p.id === prompt.id);
		if (index !== -1) {
			prompts[index].isFavorite = !prompts[index].isFavorite;
			prompts = [...prompts];
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
</script>

<div class="library-overlay" on:click={onClose} role="presentation">
	<div class="library-container" on:click|stopPropagation role="dialog" aria-modal="true">
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
					<div class="prompts-grid">
						{#each filteredPrompts as prompt (prompt.id)}
							<div class="prompt-card">
								<div class="card-header-row">
									<div class="category-badge" style="--badge-color: {PROMPT_CATEGORIES[prompt.category].color}">
										{PROMPT_CATEGORIES[prompt.category].label}
									</div>
									<button
										class="favorite-btn"
										class:active={prompt.isFavorite}
										on:click={() => handleToggleFavorite(prompt)}
										aria-label={prompt.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
									>
										<svg width="16" height="16" viewBox="0 0 16 16" fill={prompt.isFavorite ? '#FFD700' : 'none'}>
											<path
												d="M8 1L10 5.5L15 6L11.5 9.5L12.5 15L8 12.5L3.5 15L4.5 9.5L1 6L6 5.5L8 1Z"
												stroke="currentColor"
												stroke-width="1.5"
											/>
										</svg>
									</button>
								</div>

								<h3 class="card-title">{prompt.title}</h3>
								{#if prompt.description}
									<p class="card-description">{prompt.description}</p>
								{/if}

								<div class="card-prompt">
									<code>{prompt.promptText}</code>
								</div>

								{#if prompt.tags.length > 0}
									<div class="card-tags">
										{#each prompt.tags as tag}
											<span class="tag">{tag}</span>
										{/each}
									</div>
								{/if}

								<div class="card-footer">
									<div class="usage-count">
										<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
											<path d="M7 1V7H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
											<circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/>
										</svg>
										{prompt.usageCount} uses
									</div>

									<div class="card-actions">
										<button class="action-btn" on:click={() => handleEditPrompt(prompt)} aria-label="Edit">
											<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
												<path
													d="M10.333 1.667C10.5081 1.49189 10.716 1.353 10.9447 1.25824C11.1735 1.16348 11.4187 1.1147 11.6663 1.1147C11.914 1.1147 12.1592 1.16348 12.3879 1.25824C12.6167 1.353 12.8246 1.49189 12.9997 1.667C13.1748 1.84211 13.3137 2.04998 13.4084 2.27876C13.5032 2.50753 13.552 2.75273 13.552 3.00035C13.552 3.24797 13.5032 3.49317 13.4084 3.72194C13.3137 3.95072 13.1748 4.15859 12.9997 4.3337L4.66634 12.667L1.33301 13.667L2.33301 10.3337L10.6663 2.00035L10.333 1.667Z"
													stroke="currentColor"
													stroke-width="1.2"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
											</svg>
										</button>
										<button class="action-btn delete" on:click={() => handleDeletePrompt(prompt)} aria-label="Delete">
											<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
												<path
													d="M1.75 3.5H12.25M5.25 6.125V10.5M8.75 6.125V10.5M2.625 3.5L3.5 12.25C3.5 12.4821 3.59219 12.7046 3.75628 12.8687C3.92038 13.0328 4.14294 13.125 4.375 13.125H9.625C9.85706 13.125 10.0796 13.0328 10.2437 12.8687C10.4078 12.7046 10.5 12.4821 10.5 12.25L11.375 3.5M5.25 3.5V1.75C5.25 1.51794 5.34219 1.29538 5.50628 1.13128C5.67038 0.967187 5.89294 0.875 6.125 0.875H7.875C8.10706 0.875 8.32962 0.967187 8.49372 1.13128C8.65781 1.29538 8.75 1.51794 8.75 1.75V3.5"
													stroke="currentColor"
													stroke-width="1.2"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
											</svg>
										</button>
										<button class="btn-use" on:click={() => handleUsePrompt(prompt)}>
											Use Prompt
										</button>
									</div>
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
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 20px;
	}

	.library-container {
		background: white;
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
		max-width: 1200px;
		width: 100%;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	.creation-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40px 20px;
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

	.prompts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 16px;
	}

	.prompt-card {
		background: white;
		border: 1px solid #E5E5E5;
		border-radius: 8px;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		transition: all 0.15s;
	}

	.prompt-card:hover {
		border-color: #D0D0D0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.card-header-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.category-badge {
		padding: 4px 10px;
		font-size: 11px;
		font-weight: 600;
		color: white;
		background: var(--badge-color);
		border-radius: 12px;
		text-transform: uppercase;
		letter-spacing: 0.3px;
	}

	.favorite-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		padding: 0;
		background: transparent;
		border: none;
		color: #D0D0D0;
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.15s;
	}

	.favorite-btn:hover {
		background: #F4F4F4;
		color: #FFD700;
	}

	.favorite-btn.active {
		color: #FFD700;
	}

	.card-title {
		font-size: 16px;
		font-weight: 600;
		color: #161616;
		margin: 0;
	}

	.card-description {
		font-size: 13px;
		color: #6F6F6F;
		line-height: 1.5;
		margin: 0;
	}

	.card-prompt {
		background: #F4F4F4;
		border-radius: 6px;
		padding: 10px 12px;
		font-size: 13px;
		line-height: 1.5;
		max-height: 80px;
		overflow-y: auto;
	}

	.card-prompt code {
		color: #161616;
		font-family: 'SF Mono', Monaco, Consolas, monospace;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.card-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.tag {
		padding: 3px 8px;
		font-size: 11px;
		color: #6F6F6F;
		background: #F4F4F4;
		border-radius: 10px;
	}

	.card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 8px;
		border-top: 1px solid #E5E5E5;
		margin-top: auto;
	}

	.usage-count {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 12px;
		color: #6F6F6F;
	}

	.card-actions {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		padding: 0;
		background: transparent;
		border: none;
		color: #6F6F6F;
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.15s;
	}

	.action-btn:hover {
		background: #F4F4F4;
		color: #161616;
	}

	.action-btn.delete:hover {
		background: #FFF1F1;
		color: #DA1E28;
	}

	.btn-use {
		padding: 6px 12px;
		font-size: 13px;
		font-weight: 500;
		color: white;
		background: #161616;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background 0.15s;
	}

	.btn-use:hover {
		background: #2D2D2D;
	}
</style>
