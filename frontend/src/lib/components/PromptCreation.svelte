<script lang="ts">
	import type { SavedPrompt } from '$lib/types/prompt';
	import { PROMPT_CATEGORIES } from '$lib/types/prompt';

	export let onSave: (prompt: Omit<SavedPrompt, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => void;
	export let onCancel: () => void;
	export let editingPrompt: SavedPrompt | null = null;

	let title = editingPrompt?.title || '';
	let description = editingPrompt?.description || '';
	let promptText = editingPrompt?.promptText || '';
	let category: SavedPrompt['category'] = editingPrompt?.category || 'general';
	let tags = editingPrompt?.tags?.join(', ') || '';
	let isFavorite = editingPrompt?.isFavorite || false;

	function handleSave() {
		if (!title.trim() || !promptText.trim()) {
			alert('Please fill in at least the title and prompt text.');
			return;
		}

		onSave({
			title: title.trim(),
			description: description.trim(),
			promptText: promptText.trim(),
			category,
			tags: tags.split(',').map(t => t.trim()).filter(Boolean),
			isFavorite
		});
	}

	function handleCancel() {
		onCancel();
	}
</script>

<div class="prompt-creation-card">
	<div class="card-header">
		<h3 class="card-title">{editingPrompt ? 'Edit Prompt' : 'Create New Prompt'}</h3>
		<button class="close-btn" on:click={handleCancel} aria-label="Close">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
				<path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
			</svg>
		</button>
	</div>

	<div class="form-content">
		<!-- Title -->
		<div class="field">
			<label class="field-label" for="prompt-title">
				TITLE <span class="required">*</span>
			</label>
			<input
				id="prompt-title"
				type="text"
				class="field-input"
				placeholder="e.g., High Medical Expenses"
				bind:value={title}
			/>
		</div>

		<!-- Description -->
		<div class="field">
			<label class="field-label" for="prompt-description">DESCRIPTION</label>
			<input
				id="prompt-description"
				type="text"
				class="field-input"
				placeholder="Brief description of what this prompt does"
				bind:value={description}
			/>
		</div>

		<!-- Category -->
		<div class="field">
			<label class="field-label" for="prompt-category">CATEGORY</label>
			<select id="prompt-category" class="field-select" bind:value={category}>
				{#each Object.entries(PROMPT_CATEGORIES) as [key, meta]}
					<option value={key}>{meta.label}</option>
				{/each}
			</select>
		</div>

		<!-- Prompt Text -->
		<div class="field">
			<label class="field-label" for="prompt-text">
				PROMPT TEXT <span class="required">*</span>
			</label>
			<textarea
				id="prompt-text"
				class="field-textarea"
				placeholder="Enter the prompt text... Use [PLACEHOLDER] for variables you'll fill in later"
				bind:value={promptText}
				rows="4"
			/>
			<div class="field-hint">
				Tip: Use [PLACEHOLDER] syntax for values you'll fill in when using the prompt
			</div>
		</div>

		<!-- Tags -->
		<div class="field">
			<label class="field-label" for="prompt-tags">TAGS</label>
			<input
				id="prompt-tags"
				type="text"
				class="field-input"
				placeholder="e.g., personal injury, medical expenses, high value"
				bind:value={tags}
			/>
			<div class="field-hint">Separate tags with commas</div>
		</div>

		<!-- Favorite -->
		<div class="field-checkbox">
			<input id="prompt-favorite" type="checkbox" bind:checked={isFavorite} />
			<label for="prompt-favorite">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
					<path
						d="M8 1L10 5.5L15 6L11.5 9.5L12.5 15L8 12.5L3.5 15L4.5 9.5L1 6L6 5.5L8 1Z"
						fill={isFavorite ? '#FFD700' : 'none'}
						stroke="currentColor"
						stroke-width="1.5"
					/>
				</svg>
				Mark as favorite
			</label>
		</div>

		<!-- Actions -->
		<div class="form-actions">
			<button class="btn-save" on:click={handleSave}>
				{editingPrompt ? 'Update Prompt' : 'Save Prompt'}
			</button>
			<button class="btn-cancel" on:click={handleCancel}>Cancel</button>
		</div>
	</div>
</div>

<style>
	.prompt-creation-card {
		background: white;
		border: 1px solid #E5E5E5;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		max-width: 600px;
		width: 100%;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 24px;
		border-bottom: 1px solid #E5E5E5;
	}

	.card-title {
		font-size: 18px;
		font-weight: 600;
		color: #161616;
		margin: 0;
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 0;
		background: transparent;
		border: none;
		color: #6F6F6F;
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.15s;
	}

	.close-btn:hover {
		background: #F4F4F4;
		color: #161616;
	}

	.form-content {
		padding: 20px 24px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.field-label {
		font-size: 11px;
		font-weight: 600;
		color: #6F6F6F;
		letter-spacing: 0.5px;
		text-transform: uppercase;
	}

	.required {
		color: #DA1E28;
	}

	.field-input,
	.field-select,
	.field-textarea {
		width: 100%;
		padding: 10px 12px;
		font-size: 14px;
		color: #161616;
		background: white;
		border: 1px solid #D0D0D0;
		border-radius: 4px;
		font-family: inherit;
		transition: border-color 0.15s;
	}

	.field-input:focus,
	.field-select:focus,
	.field-textarea:focus {
		outline: none;
		border-color: #161616;
	}

	.field-input::placeholder,
	.field-textarea::placeholder {
		color: #A0A0A0;
	}

	.field-select {
		cursor: pointer;
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236F6F6F' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 12px center;
		padding-right: 36px;
	}

	.field-textarea {
		resize: vertical;
		min-height: 100px;
		line-height: 1.5;
	}

	.field-hint {
		font-size: 12px;
		color: #6F6F6F;
		margin-top: -4px;
	}

	.field-checkbox {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.field-checkbox input[type='checkbox'] {
		width: 18px;
		height: 18px;
		cursor: pointer;
	}

	.field-checkbox label {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 14px;
		color: #161616;
		cursor: pointer;
		user-select: none;
	}

	.form-actions {
		display: flex;
		gap: 12px;
		margin-top: 4px;
	}

	.btn-save,
	.btn-cancel {
		flex: 1;
		padding: 12px 20px;
		font-size: 14px;
		font-weight: 500;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.15s;
		border: none;
	}

	.btn-save {
		background: #161616;
		color: white;
	}

	.btn-save:hover {
		background: #2D2D2D;
	}

	.btn-cancel {
		background: white;
		color: #6F6F6F;
		border: 1px solid #D0D0D0;
	}

	.btn-cancel:hover {
		background: #F4F4F4;
		border-color: #A0A0A0;
	}
</style>
