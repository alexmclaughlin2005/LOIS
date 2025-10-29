<script lang="ts">
	export let result: {
		id: string;
		title: string;
		subtitle?: string;
		snippet: string;
		relevanceReason: string;
		metadata?: Record<string, any>;
		onClick?: () => void;
	};

	function handleClick() {
		if (result.onClick) {
			result.onClick();
		}
	}
</script>

<div class="search-result-card" on:click={handleClick} role="button" tabindex="0">
	<!-- Title and Subtitle -->
	<div class="result-header">
		<h3 class="result-title">{result.title}</h3>
		{#if result.subtitle}
			<span class="result-subtitle">{result.subtitle}</span>
		{/if}
	</div>

	<!-- Snippet -->
	<p class="result-snippet">{result.snippet}</p>

	<!-- Metadata Badges (if any) -->
	{#if result.metadata && Object.keys(result.metadata).length > 0}
		<div class="result-metadata">
			{#each Object.entries(result.metadata) as [key, value]}
				<span class="metadata-badge">
					<span class="badge-label">{key}:</span>
					<span class="badge-value">{value}</span>
				</span>
			{/each}
		</div>
	{/if}

	<!-- Relevance Footer -->
	<div class="result-footer">
		<svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="relevance-icon">
			<path d="M7 1L8.5 4.5L12 5L9.5 7.5L10 11L7 9L4 11L4.5 7.5L2 5L5.5 4.5L7 1Z" fill="currentColor"/>
		</svg>
		<span class="relevance-text">{result.relevanceReason}</span>
	</div>
</div>

<style>
	.search-result-card {
		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 10px;
		padding: 18px 20px;
		margin-bottom: 10px;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.search-result-card:hover {
		border-color: #3b82f6;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
		transform: translateY(-1px);
	}

	.search-result-card:active {
		transform: translateY(0);
	}

	/* Header Section */
	.result-header {
		margin-bottom: 10px;
	}

	.result-title {
		font-size: 17px;
		font-weight: 600;
		color: #111827;
		margin: 0 0 4px 0;
		line-height: 1.3;
	}

	.result-subtitle {
		display: inline-block;
		font-size: 13px;
		color: #6b7280;
		font-weight: 500;
		background: #f3f4f6;
		padding: 2px 10px;
		border-radius: 6px;
	}

	/* Snippet */
	.result-snippet {
		font-size: 14px;
		color: #374151;
		line-height: 1.6;
		margin: 0 0 12px 0;
	}

	/* Metadata Badges */
	.result-metadata {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 12px;
	}

	.metadata-badge {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 4px 10px;
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		font-size: 12px;
	}

	.badge-label {
		color: #6b7280;
		font-weight: 500;
	}

	.badge-value {
		color: #111827;
		font-weight: 600;
	}

	/* Relevance Footer */
	.result-footer {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		padding-top: 12px;
		border-top: 1px solid #f3f4f6;
	}

	.relevance-icon {
		color: #f59e0b;
		flex-shrink: 0;
		margin-top: 2px;
	}

	.relevance-text {
		font-size: 13px;
		color: #6b7280;
		font-style: italic;
		line-height: 1.5;
	}

	/* Keyboard navigation */
	.search-result-card:focus {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.search-result-card {
			padding: 14px 16px;
		}

		.result-title {
			font-size: 16px;
		}

		.result-snippet {
			font-size: 13px;
		}

		.metadata-badge {
			font-size: 11px;
			padding: 3px 8px;
		}
	}
</style>
