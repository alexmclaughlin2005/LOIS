<script lang="ts">
	/**
	 * DocumentCard - Display document details
	 *
	 * Shows legal document information with preview
	 * in a rich, entity-specific card format.
	 */

	export let document: {
		id?: string;
		title?: string;
		document_type?: string;
		file_name?: string;
		file_size_kb?: number;
		mime_type?: string;
		content?: string;
		status?: string;
		date_filed?: string;
		date_received?: string;
		tags?: string[];
		// Nested project data (from JOIN)
		projects?: {
			case_number?: string;
			title?: string;
		};
		// Alternative: direct case_number field
		case_number?: string;
	};

	// Computed values
	$: title = document.title || 'Untitled Document';
	$: documentType = document.document_type || 'Document';
	$: fileName = document.file_name || '';
	$: fileSize = document.file_size_kb;
	$: mimeType = document.mime_type || '';
	$: content = document.content || '';
	$: status = document.status || '';
	$: dateFiled = document.date_filed || '';
	$: dateReceived = document.date_received || '';
	$: tags = document.tags || [];
	$: caseNumber = document.case_number || document.projects?.case_number || '';
	$: caseTitle = document.projects?.title || '';

	// Format file size
	function formatFileSize(sizeKb: number | undefined | null): string {
		if (!sizeKb) return '';
		if (sizeKb < 1024) return `${sizeKb} KB`;
		const sizeMb = (sizeKb / 1024).toFixed(1);
		return `${sizeMb} MB`;
	}

	// Format date
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

	// Get document type icon and color
	function getDocumentTypeInfo(type: string): { icon: string; color: string } {
		const typeLower = type.toLowerCase();
		if (typeLower.includes('pleading')) return { icon: '📄', color: '#1565C0' };
		if (typeLower.includes('discovery')) return { icon: '🔍', color: '#F57C00' };
		if (typeLower.includes('evidence')) return { icon: '📸', color: '#C62828' };
		if (typeLower.includes('contract')) return { icon: '📝', color: '#6A1B9A' };
		if (typeLower.includes('correspondence') || typeLower.includes('email')) return { icon: '✉️', color: '#00695C' };
		if (typeLower.includes('brief')) return { icon: '📑', color: '#283593' };
		if (typeLower.includes('motion')) return { icon: '⚖️', color: '#4E342E' };
		if (typeLower.includes('memo')) return { icon: '📋', color: '#5D4037' };
		return { icon: '📄', color: '#616161' };
	}

	// Get status badge color
	function getStatusColor(status: string): string {
		const statusLower = status.toLowerCase();
		if (statusLower === 'final' || statusLower === 'filed') return 'status-final';
		if (statusLower === 'draft') return 'status-draft';
		if (statusLower === 'received') return 'status-received';
		return 'status-default';
	}

	// Get file extension from filename or mime type
	function getFileExtension(): string {
		if (fileName) {
			const ext = fileName.split('.').pop();
			if (ext) return ext.toUpperCase();
		}
		if (mimeType) {
			if (mimeType.includes('pdf')) return 'PDF';
			if (mimeType.includes('word')) return 'DOCX';
			if (mimeType.includes('text')) return 'TXT';
		}
		return '';
	}

	// Truncate content for preview
	function getContentPreview(text: string, maxChars: number = 150): string {
		if (!text) return '';
		const preview = text.trim().substring(0, maxChars);
		return preview + (text.length > maxChars ? '...' : '');
	}

	$: docTypeInfo = getDocumentTypeInfo(documentType);
	$: contentPreview = getContentPreview(content, 150);
	$: fileExt = getFileExtension();
</script>

<div class="document-card">
	<!-- Card Header -->
	<div class="card-header">
		<div class="header-left">
			<div class="doc-icon" style="color: {docTypeInfo.color}">
				{docTypeInfo.icon}
			</div>
			<div class="doc-info">
				<h3 class="doc-title">{title}</h3>
				<div class="doc-meta">
					{#if caseNumber}
						<span class="case-number">{caseNumber}</span>
						{#if caseTitle}
							<span class="meta-separator">•</span>
							<span class="case-title-small">{caseTitle}</span>
						{/if}
					{/if}
				</div>
			</div>
		</div>
		<button class="action-button" aria-label="More actions" title="More actions">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
				<circle cx="8" cy="3" r="1.5" fill="currentColor"/>
				<circle cx="8" cy="8" r="1.5" fill="currentColor"/>
				<circle cx="8" cy="13" r="1.5" fill="currentColor"/>
			</svg>
		</button>
	</div>

	<!-- Card Body -->
	<div class="card-body">
		<!-- Document Type and Status -->
		<div class="badges-row">
			<span class="badge badge-type" style="border-color: {docTypeInfo.color}; color: {docTypeInfo.color}">
				{documentType}
			</span>
			{#if status}
				<span class="badge badge-status {getStatusColor(status)}">{status}</span>
			{/if}
			{#if fileExt}
				<span class="badge badge-file-type">{fileExt}</span>
			{/if}
		</div>

		<!-- Content Preview -->
		{#if contentPreview}
			<div class="content-preview">
				<div class="preview-label">Preview</div>
				<p class="preview-text">{contentPreview}</p>
			</div>
		{/if}

		<!-- Document Metadata -->
		<div class="metadata-grid">
			{#if dateFiled}
				<div class="metadata-item">
					<div class="metadata-label">Filed</div>
					<div class="metadata-value">{formatDate(dateFiled)}</div>
				</div>
			{/if}

			{#if dateReceived}
				<div class="metadata-item">
					<div class="metadata-label">Received</div>
					<div class="metadata-value">{formatDate(dateReceived)}</div>
				</div>
			{/if}

			{#if fileSize}
				<div class="metadata-item">
					<div class="metadata-label">File Size</div>
					<div class="metadata-value">{formatFileSize(fileSize)}</div>
				</div>
			{/if}

			{#if fileName}
				<div class="metadata-item full-width">
					<div class="metadata-label">File Name</div>
					<div class="metadata-value filename">{fileName}</div>
				</div>
			{/if}
		</div>

		<!-- Tags -->
		{#if tags && tags.length > 0}
			<div class="tags-section">
				{#each tags.slice(0, 4) as tag}
					<span class="tag">{tag}</span>
				{/each}
				{#if tags.length > 4}
					<span class="tag tag-more">+{tags.length - 4}</span>
				{/if}
			</div>
		{/if}

		<!-- Quick Actions -->
		<div class="quick-actions">
			<button class="quick-action-btn primary">
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
					<path d="M7 7C8.65685 7 10 5.65685 10 4C10 2.34315 8.65685 1 7 1C5.34315 1 4 2.34315 4 4C4 5.65685 5.34315 7 7 7Z" stroke="currentColor" stroke-width="1.5"/>
					<path d="M1 13C1 10.2386 3.23858 8 6 8H8C10.7614 8 13 10.2386 13 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
				</svg>
				View
			</button>
			<button class="quick-action-btn">
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
					<path d="M7 3V7M7 7H11M7 7V11M7 7H3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
				</svg>
				Download
			</button>
			<button class="quick-action-btn">
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
					<path d="M12 5L8 1M8 1L4 5M8 1V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M2 11V13C2 13.5523 2.44772 14 3 14H11C11.5523 14 12 13.5523 12 13V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
				</svg>
				Share
			</button>
		</div>
	</div>
</div>

<style>
	.document-card {
		background: white;
		border: 1px solid var(--color-border, #E0E0E0);
		border-radius: 8px;
		overflow: hidden;
		transition: all 0.2s;
		margin-bottom: 12px;
	}

	.document-card:hover {
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
		min-width: 0;
	}

	.doc-icon {
		font-size: 28px;
		line-height: 1;
		flex-shrink: 0;
	}

	.doc-info {
		flex: 1;
		min-width: 0;
	}

	.doc-title {
		font-size: 15px;
		font-weight: 600;
		color: var(--color-text-primary, #161616);
		margin: 0 0 4px 0;
		line-height: 1.3;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.doc-meta {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		color: var(--color-text-secondary, #666);
	}

	.case-number {
		font-family: 'Monaco', 'Courier New', monospace;
		font-weight: 600;
		color: #1565C0;
	}

	.meta-separator {
		color: #D0D0D0;
	}

	.case-title-small {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.action-button {
		width: 28px;
		height: 28px;
		padding: 0;
		border: none;
		background: transparent;
		border-radius: 4px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-secondary, #666);
		transition: all 0.15s;
		flex-shrink: 0;
	}

	.action-button:hover {
		background: #F5F5F5;
		color: var(--color-text-primary, #161616);
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
		font-size: 11px;
		font-weight: 600;
		line-height: 1;
	}

	.badge-type {
		background: white;
		border: 1.5px solid;
	}

	.badge-status {
		border: 1px solid;
	}

	.status-final {
		background: #E8F5E9;
		color: #2E7D32;
		border-color: #A5D6A7;
	}

	.status-draft {
		background: #FFF9C4;
		color: #F57C00;
		border-color: #FFD54F;
	}

	.status-received {
		background: #E3F2FD;
		color: #1565C0;
		border-color: #90CAF9;
	}

	.status-default {
		background: #F5F5F5;
		color: #616161;
		border-color: #BDBDBD;
	}

	.badge-file-type {
		background: #424242;
		color: white;
		font-family: 'Monaco', 'Courier New', monospace;
		padding: 4px 8px;
	}

	/* Content Preview */
	.content-preview {
		background: #F9F9F9;
		border-left: 3px solid #E0E0E0;
		padding: 10px 12px;
		margin-bottom: 12px;
		border-radius: 4px;
	}

	.preview-label {
		font-size: 10px;
		font-weight: 600;
		color: #999;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-bottom: 6px;
	}

	.preview-text {
		font-size: 12px;
		color: #525252;
		line-height: 1.5;
		margin: 0;
	}

	/* Metadata Grid */
	.metadata-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 10px;
		margin-bottom: 12px;
	}

	.metadata-item {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.metadata-item.full-width {
		grid-column: 1 / -1;
	}

	.metadata-label {
		font-size: 10px;
		font-weight: 600;
		color: #999;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.metadata-value {
		font-size: 12px;
		color: var(--color-text-primary, #161616);
		font-weight: 500;
	}

	.filename {
		font-family: 'Monaco', 'Courier New', monospace;
		font-size: 11px;
		color: #666;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Tags */
	.tags-section {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 12px;
	}

	.tag {
		display: inline-flex;
		align-items: center;
		padding: 3px 8px;
		background: #F5F5F5;
		border: 1px solid #E0E0E0;
		border-radius: 10px;
		font-size: 11px;
		color: #525252;
		font-weight: 500;
	}

	.tag-more {
		background: #E0E0E0;
		color: #616161;
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
	}

	.quick-action-btn.primary {
		background: var(--color-brand-black, #000);
		color: white;
		border-color: var(--color-brand-black, #000);
	}

	.quick-action-btn.primary svg {
		color: white;
	}

	.quick-action-btn.primary:hover {
		background: #333;
		border-color: #333;
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
