<div class="loading-skeleton">
	<div class="skeleton-header">
		<div class="skeleton-icon"></div>
		<div class="skeleton-text short"></div>
	</div>
	<div class="skeleton-table">
		<div class="skeleton-row header">
			<div class="skeleton-cell"></div>
			<div class="skeleton-cell"></div>
			<div class="skeleton-cell"></div>
		</div>
		<div class="skeleton-row">
			<div class="skeleton-cell"></div>
			<div class="skeleton-cell"></div>
			<div class="skeleton-cell"></div>
		</div>
		<div class="skeleton-row">
			<div class="skeleton-cell"></div>
			<div class="skeleton-cell"></div>
			<div class="skeleton-cell"></div>
		</div>
	</div>
	<div class="skeleton-footer">
		<div class="skeleton-text medium"></div>
	</div>
</div>

<style>
	.loading-skeleton {
		background: #F9F9F9;
		border: 1px solid #E0E0E0;
		border-radius: 8px;
		padding: 12px;
		margin-top: 12px;
	}

	.skeleton-header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 12px;
	}

	.skeleton-icon {
		width: 16px;
		height: 16px;
		background: linear-gradient(90deg, #E0E0E0 25%, #F0F0F0 50%, #E0E0E0 75%);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
		border-radius: 4px;
	}

	.skeleton-text {
		height: 14px;
		background: linear-gradient(90deg, #E0E0E0 25%, #F0F0F0 50%, #E0E0E0 75%);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
		border-radius: 4px;
	}

	.skeleton-text.short {
		width: 120px;
	}

	.skeleton-text.medium {
		width: 100px;
	}

	.skeleton-table {
		margin-bottom: 12px;
	}

	.skeleton-row {
		display: flex;
		gap: 8px;
		margin-bottom: 8px;
	}

	.skeleton-row.header .skeleton-cell {
		background: linear-gradient(90deg, #D0D0D0 25%, #E0E0E0 50%, #D0D0D0 75%);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
	}

	.skeleton-cell {
		flex: 1;
		height: 32px;
		background: linear-gradient(90deg, #E0E0E0 25%, #F0F0F0 50%, #E0E0E0 75%);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
		border-radius: 4px;
	}

	.skeleton-footer {
		padding-top: 8px;
		border-top: 1px solid #E0E0E0;
	}

	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}
</style>
