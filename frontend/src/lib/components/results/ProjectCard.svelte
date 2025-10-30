<script lang="ts">
	/**
	 * ProjectCard - Display legal case/project details
	 *
	 * Shows case information in a rich, entity-specific card format
	 * matching the Figma design specifications.
	 */

	export let project: {
		id?: string;
		case_number?: string;
		title?: string;
		case_type?: string;
		status?: string;
		phase?: string;
		priority?: string;
		filing_date?: string;
		estimated_value?: number;
		assigned_attorney?: string;
		description?: string;
		custom_fields?: Record<string, any>;
		// Legacy field names (from old demo data)
		project?: string; // Maps to title
		type?: string; // Maps to case_type
		primary?: string; // Maps to assigned_attorney
	};

	// Normalize field names (support both new and legacy formats)
	$: caseNumber = project.case_number || '';
	$: caseTitle = project.title || project.project || 'Untitled Case';
	$: caseType = project.case_type || project.type || 'Unknown';
	$: status = project.status || 'Unknown';
	$: phase = project.phase || '';
	$: priority = project.priority || 'Medium';
	$: filingDate = project.filing_date || '';
	$: estimatedValue = project.estimated_value;
	$: attorney = project.assigned_attorney || project.primary || '';
	$: description = project.description || '';
	$: customFields = project.custom_fields || {};

	// Get initials from attorney name
	function getInitials(name: string): string {
		if (!name) return '?';
		const parts = name.trim().split(' ');
		if (parts.length >= 2) {
			return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
		}
		return name[0].toUpperCase();
	}

	// Format date for display
	function formatDate(dateStr: string): string {
		if (!dateStr) return '';
		try {
			const date = new Date(dateStr);
			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			});
		} catch {
			return dateStr;
		}
	}

	// Format currency
	function formatCurrency(value: number | null | undefined): string {
		if (value == null) return '';
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(value);
	}

	// Get status badge color
	function getStatusColor(status: string): string {
		const statusLower = status.toLowerCase();
		if (statusLower === 'open') return 'status-open';
		if (statusLower === 'closed') return 'status-closed';
		if (statusLower === 'pending' || statusLower === 'on hold') return 'status-pending';
		return 'status-default';
	}

	// Get priority badge color
	function getPriorityColor(priority: string): string {
		const priorityLower = priority.toLowerCase();
		if (priorityLower === 'urgent' || priorityLower === 'high') return 'priority-high';
		if (priorityLower === 'medium') return 'priority-medium';
		return 'priority-low';
	}

	// Get case type icon
	function getCaseTypeIcon(type: string): string {
		const typeLower = type.toLowerCase();
		if (typeLower.includes('personal injury')) return '🩹';
		if (typeLower.includes('corporate')) return '🏢';
		if (typeLower.includes('family')) return '👨‍👩‍👧';
		if (typeLower.includes('criminal')) return '⚖️';
		if (typeLower.includes('real estate')) return '🏘️';
		if (typeLower.includes('employment')) return '💼';
		if (typeLower.includes('intellectual property') || typeLower.includes('ip')) return '💡';
		if (typeLower.includes('estate')) return '📜';
		return '📋';
	}

	// Extract important custom fields based on case type
	function getKeyCustomFields(): Array<{ label: string; value: string }> {
		const fields: Array<{ label: string; value: string }> = [];

		if (caseType.toLowerCase().includes('personal injury')) {
			if (customFields.medical_expenses) {
				fields.push({
					label: 'Medical Expenses',
					value: formatCurrency(customFields.medical_expenses)
				});
			}
			if (customFields.injury_type) {
				fields.push({ label: 'Injury Type', value: customFields.injury_type });
			}
		} else if (caseType.toLowerCase().includes('corporate')) {
			if (customFields.contract_value) {
				fields.push({
					label: 'Contract Value',
					value: formatCurrency(customFields.contract_value)
				});
			}
		} else if (caseType.toLowerCase().includes('family')) {
			if (customFields.marital_assets_value) {
				fields.push({
					label: 'Marital Assets',
					value: formatCurrency(customFields.marital_assets_value)
				});
			}
		}

		return fields;
	}

	$: keyFields = getKeyCustomFields();
</script>

<div class="project-card">
	<!-- Card Header -->
	<div class="card-header">
		<div class="header-left">
			<span class="case-type-icon" aria-hidden="true">{getCaseTypeIcon(caseType)}</span>
			<div class="case-info">
				<h3 class="case-title">{caseTitle}</h3>
				{#if caseNumber}
					<p class="case-number">{caseNumber}</p>
				{/if}
			</div>
		</div>
		<div class="header-right">
			<button class="action-button open-tab-button" aria-label="Open in new tab" title="Open in new tab">
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
					<path d="M9 2H12V5M12 2L6 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M12 8V12H2V2H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
				</svg>
			</button>
		</div>
	</div>

	<!-- Card Body -->
	<div class="card-body">
		<!-- Status and Phase -->
		<div class="badges-row">
			<span class="badge badge-type">{caseType}</span>
			{#if status}
				<span class="badge badge-status {getStatusColor(status)}">{status}</span>
			{/if}
			{#if phase}
				<span class="badge badge-phase">{phase}</span>
			{/if}
			{#if priority && priority !== 'Medium'}
				<span class="badge badge-priority {getPriorityColor(priority)}">{priority}</span>
			{/if}
		</div>

		<!-- Description (if available) -->
		{#if description}
			<p class="case-description">{description}</p>
		{/if}

		<!-- Metadata Grid -->
		<div class="metadata-grid">
			{#if attorney}
				<div class="metadata-item">
					<div class="metadata-label">Assigned Attorney</div>
					<div class="metadata-value attorney-value">
						<div class="mini-avatar">{getInitials(attorney)}</div>
						<span>{attorney}</span>
					</div>
				</div>
			{/if}

			{#if filingDate}
				<div class="metadata-item">
					<div class="metadata-label">Filing Date</div>
					<div class="metadata-value">{formatDate(filingDate)}</div>
				</div>
			{/if}

			{#if estimatedValue}
				<div class="metadata-item">
					<div class="metadata-label">Estimated Value</div>
					<div class="metadata-value value-highlight">{formatCurrency(estimatedValue)}</div>
				</div>
			{/if}

			<!-- Custom Fields -->
			{#each keyFields as field}
				<div class="metadata-item">
					<div class="metadata-label">{field.label}</div>
					<div class="metadata-value">{field.value}</div>
				</div>
			{/each}
		</div>

		<!-- Quick Actions -->
		<div class="quick-actions">
			<button class="quick-action-btn">
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
					<path d="M7 1V7M7 7L13 7M7 7L7 13M7 7L1 7" stroke="currentColor" stroke-width="1.5"/>
				</svg>
				View Details
			</button>
			<button class="quick-action-btn">
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
					<path d="M12 5L7 10L2 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
				</svg>
				Documents
			</button>
			<button class="quick-action-btn">
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
					<rect x="2" y="3" width="10" height="9" rx="1" stroke="currentColor" stroke-width="1.5"/>
					<path d="M5 1V3M9 1V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
				</svg>
				Timeline
			</button>
		</div>
	</div>
</div>

<style>
	.project-card {
		background: white;
		border: 1px solid var(--color-border, #E0E0E0);
		border-radius: 8px;
		overflow: hidden;
		transition: all 0.2s;
		margin-bottom: 12px;
	}

	.project-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		border-color: #D0D0D0;
	}

	/* Header */
	.card-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		padding: 16px;
		border-bottom: 1px solid #F5F5F5;
	}

	.header-left {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		flex: 1;
	}

	.case-type-icon {
		font-size: 24px;
		line-height: 1;
		flex-shrink: 0;
	}

	.case-info {
		flex: 1;
		min-width: 0;
	}

	.case-title {
		font-size: 15px;
		font-weight: 600;
		color: var(--color-text-primary, #161616);
		margin: 0 0 4px 0;
		line-height: 1.3;
	}

	.case-number {
		font-size: 13px;
		color: var(--color-text-secondary, #666);
		margin: 0;
		font-family: 'Monaco', 'Courier New', monospace;
	}

	.header-right {
		display: flex;
		gap: 4px;
		margin-left: 8px;
	}

	.action-button {
		width: 28px;
		height: 28px;
		padding: 0;
		border: none;
		background: transparent;
		border-radius: 6px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-secondary, #666);
		transition: all 0.15s;
	}

	.action-button:hover {
		background: #F3F4F6;
		color: var(--color-text-primary, #161616);
	}

	.open-tab-button:hover {
		background: #3B82F6;
		color: white;
	}

	/* Body */
	.card-body {
		padding: 16px;
	}

	/* Badges */
	.badges-row {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 12px;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		padding: 4px 10px;
		border-radius: 12px;
		font-size: 12px;
		font-weight: 500;
		line-height: 1;
	}

	.badge-type {
		background: #F5F5F5;
		color: #525252;
	}

	.badge-status {
		border: 1px solid;
	}

	.status-open {
		background: #E8F5E9;
		color: #2E7D32;
		border-color: #A5D6A7;
	}

	.status-closed {
		background: #EEEEEE;
		color: #616161;
		border-color: #BDBDBD;
	}

	.status-pending {
		background: #FFF9C4;
		color: #F57C00;
		border-color: #FFD54F;
	}

	.status-default {
		background: #E3F2FD;
		color: #1565C0;
		border-color: #90CAF9;
	}

	.badge-phase {
		background: white;
		color: #525252;
		border: 1px solid #E0E0E0;
	}

	.badge-priority {
		font-weight: 600;
	}

	.priority-high {
		background: #FFEBEE;
		color: #C62828;
		border: 1px solid #FFCDD2;
	}

	.priority-medium {
		background: #FFF3E0;
		color: #E65100;
		border: 1px solid #FFE0B2;
	}

	.priority-low {
		background: #F5F5F5;
		color: #757575;
		border: 1px solid #E0E0E0;
	}

	/* Description */
	.case-description {
		font-size: 13px;
		color: #525252;
		line-height: 1.5;
		margin: 0 0 14px 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Metadata Grid */
	.metadata-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 12px;
		margin-bottom: 14px;
	}

	.metadata-item {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.metadata-label {
		font-size: 11px;
		font-weight: 500;
		color: #999;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.metadata-value {
		font-size: 13px;
		color: var(--color-text-primary, #161616);
		font-weight: 500;
	}

	.attorney-value {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.mini-avatar {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: #E0E0E0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		font-weight: 600;
		color: #525252;
		flex-shrink: 0;
	}

	.value-highlight {
		color: #2E7D32;
		font-weight: 600;
	}

	/* Quick Actions */
	.quick-actions {
		display: flex;
		gap: 8px;
		padding-top: 12px;
		border-top: 1px solid #F5F5F5;
	}

	.quick-action-btn {
		flex: 1;
		padding: 8px 12px;
		border: 1px solid #E0E0E0;
		background: white;
		border-radius: 6px;
		font-size: 12px;
		font-weight: 500;
		color: var(--color-text-primary, #161616);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		transition: all 0.15s;
	}

	.quick-action-btn svg {
		color: var(--color-text-secondary, #666);
		flex-shrink: 0;
	}

	.quick-action-btn:hover {
		background: #FAFAFA;
		border-color: #D0D0D0;
		color: var(--color-brand-black, #000);
	}

	.quick-action-btn:hover svg {
		color: var(--color-brand-black, #000);
	}

	.quick-action-btn:active {
		transform: scale(0.98);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.metadata-grid {
			grid-template-columns: 1fr;
		}

		.quick-actions {
			flex-direction: column;
		}

		.quick-action-btn {
			justify-content: flex-start;
		}
	}
</style>
