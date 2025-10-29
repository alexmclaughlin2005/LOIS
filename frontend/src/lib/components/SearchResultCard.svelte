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
	<div class="result-header">
		<div class="result-title-section">
			<h3 class="result-title">{result.title}</h3>
			{#if result.subtitle}
				<span class="result-subtitle">{result.subtitle}</span>
			{/if}
		</div>
		{#if result.metadata}
			<div class="result-metadata">
				{#each Object.entries(result.metadata) as [key, value]}
					<span class="metadata-badge">{key}: {value}</span>
				{/each}
			</div>
		{/if}
	</div>

	<p class="result-snippet">{result.snippet}</p>

	<div class="result-relevance">
		<svg width="12" height="12" viewBox="0 0 12 12" fill="none" class="relevance-icon">
			<path d="M6 1L7.5 4L11 4.5L8.5 7L9 10.5L6 8.75L3 10.5L3.5 7L1 4.5L4.5 4L6 1Z" fill="currentColor"/>
		</svg>
		<span class="relevance-text">{result.relevanceReason}</span>
	</div>
</div>

<style>
	.search-result-card {
		background: var(--white);
		border: 1px solid var(--gray-200);
		border-radius: 8px;
		padding: 16px;
		margin-bottom: 12px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.search-result-card:hover {
		border-color: var(--primary-500);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		transform: translateY(-1px);
	}

	.result-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 8px;
		gap: 12px;
	}

	.result-title-section {
		flex: 1;
		min-width: 0;
	}

	.result-title {
		font-size: 16px;
		font-weight: 600;
		color: var(--gray-900);
		margin: 0 0 4px 0;
		line-height: 1.4;
	}

	.result-subtitle {
		font-size: 13px;
		color: var(--gray-600);
		font-weight: 500;
	}

	.result-metadata {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		align-items: flex-start;
	}

	.metadata-badge {
		display: inline-block;
		padding: 2px 8px;
		background: var(--gray-100);
		color: var(--gray-700);
		border-radius: 4px;
		font-size: 11px;
		font-weight: 500;
		white-space: nowrap;
	}

	.result-snippet {
		font-size: 14px;
		color: var(--gray-700);
		line-height: 1.6;
		margin: 0 0 12px 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.result-relevance {
		display: flex;
		align-items: center;
		gap: 6px;
		padding-top: 12px;
		border-top: 1px solid var(--gray-100);
	}

	.relevance-icon {
		color: var(--amber-500);
		flex-shrink: 0;
	}

	.relevance-text {
		font-size: 13px;
		color: var(--gray-600);
		font-style: italic;
		line-height: 1.4;
	}

	/* Keyboard navigation */
	.search-result-card:focus {
		outline: 2px solid var(--primary-500);
		outline-offset: 2px;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.search-result-card {
			padding: 12px;
		}

		.result-header {
			flex-direction: column;
			gap: 8px;
		}

		.result-title {
			font-size: 15px;
		}

		.result-snippet {
			font-size: 13px;
		}
	}
</style>
