<script lang="ts">
	import type { QueryType } from '$lib/queryClassifier';

	export let queryType: QueryType | null = null;
	export let action: string = 'Processing your query...';
	export let show: boolean = true;

	// Icon and color based on query type
	$: typeConfig = {
		sql: {
			icon: '🔍',
			color: '#0066CC',
			bgColor: '#E6F2FF',
			label: 'Database Query'
		},
		document_search: {
			icon: '📄',
			color: '#7C3AED',
			bgColor: '#F3E8FF',
			label: 'Document Search'
		},
		general: {
			icon: '💬',
			color: '#059669',
			bgColor: '#D1FAE5',
			label: 'Processing'
		}
	}[queryType || 'general'];
</script>

{#if show}
	<div class="processing-indicator" style="border-left-color: {typeConfig.color}; background: {typeConfig.bgColor};">
		<div class="indicator-header">
			<span class="indicator-icon">{typeConfig.icon}</span>
			<span class="indicator-label" style="color: {typeConfig.color};">{typeConfig.label}</span>
			<div class="spinner"></div>
		</div>
		<div class="indicator-action">{action}</div>
	</div>
{/if}

<style>
	.processing-indicator {
		border-left: 3px solid;
		border-radius: 6px;
		padding: 12px 16px;
		margin: 12px 0;
		animation: fadeIn 0.3s ease-in;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.indicator-header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 6px;
	}

	.indicator-icon {
		font-size: 16px;
		line-height: 1;
	}

	.indicator-label {
		font-size: 13px;
		font-weight: 600;
		font-family: 'Helvetica Now Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		letter-spacing: 0.3px;
	}

	.spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(0, 0, 0, 0.1);
		border-top-color: currentColor;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		margin-left: auto;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.indicator-action {
		font-size: 13px;
		color: #525252;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		padding-left: 24px;
	}
</style>
