<script lang="ts">
	/**
	 * ContactCard - Display contact/person details
	 *
	 * Shows attorney, client, witness, or expert information
	 * in a rich, entity-specific card format.
	 */

	export let contact: {
		id?: string;
		first_name?: string;
		last_name?: string;
		email?: string;
		phone?: string;
		contact_type?: string;
		organization?: string;
		title?: string;
		bar_number?: string;
		specialty?: string;
		address_line1?: string;
		city?: string;
		state?: string;
		notes?: string;
	};

	// Computed values
	$: fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || 'Unknown Contact';
	$: contactType = contact.contact_type || 'Contact';
	$: organization = contact.organization || '';
	$: jobTitle = contact.title || '';
	$: email = contact.email || '';
	$: phone = contact.phone || '';
	$: barNumber = contact.bar_number || '';
	$: specialty = contact.specialty || '';
	$: location = contact.city && contact.state ? `${contact.city}, ${contact.state}` : contact.city || contact.state || '';

	// Get initials for avatar
	function getInitials(firstName: string = '', lastName: string = ''): string {
		const first = firstName.trim();
		const last = lastName.trim();
		if (first && last) {
			return first[0].toUpperCase() + last[0].toUpperCase();
		} else if (first) {
			return first[0].toUpperCase();
		} else if (last) {
			return last[0].toUpperCase();
		}
		return '?';
	}

	// Get contact type badge color
	function getContactTypeColor(type: string): string {
		const typeLower = type.toLowerCase();
		if (typeLower === 'attorney' || typeLower === 'lawyer') return 'type-attorney';
		if (typeLower === 'client') return 'type-client';
		if (typeLower === 'witness') return 'type-witness';
		if (typeLower === 'expert' || typeLower === 'expert witness') return 'type-expert';
		if (typeLower === 'paralegal') return 'type-paralegal';
		if (typeLower === 'court personnel') return 'type-court';
		return 'type-default';
	}

	// Get contact type icon
	function getContactTypeIcon(type: string): string {
		const typeLower = type.toLowerCase();
		if (typeLower === 'attorney' || typeLower === 'lawyer') return '⚖️';
		if (typeLower === 'client') return '👤';
		if (typeLower === 'witness') return '👁️';
		if (typeLower === 'expert' || typeLower === 'expert witness') return '🎓';
		if (typeLower === 'paralegal') return '📋';
		if (typeLower === 'court personnel') return '🏛️';
		return '👥';
	}

	// Format phone number
	function formatPhone(phoneStr: string): string {
		if (!phoneStr) return '';
		// Simple formatting for US phone numbers
		const digits = phoneStr.replace(/\D/g, '');
		if (digits.length === 10) {
			return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
		}
		return phoneStr;
	}

	$: initials = getInitials(contact.first_name, contact.last_name);
</script>

<div class="contact-card">
	<!-- Card Header -->
	<div class="card-header">
		<div class="avatar-section">
			<div class="avatar-large">{initials}</div>
			<div class="contact-info">
				<h3 class="contact-name">{fullName}</h3>
				<div class="contact-type-badge">
					<span class="type-icon" aria-hidden="true">{getContactTypeIcon(contactType)}</span>
					<span class="badge badge-contact-type {getContactTypeColor(contactType)}">
						{contactType}
					</span>
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
		<!-- Organization and Title -->
		{#if organization || jobTitle}
			<div class="organization-section">
				{#if organization}
					<div class="organization-name">{organization}</div>
				{/if}
				{#if jobTitle}
					<div class="job-title">{jobTitle}</div>
				{/if}
			</div>
		{/if}

		<!-- Contact Information -->
		<div class="contact-details">
			{#if email}
				<div class="contact-detail-item">
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="detail-icon">
						<rect x="1" y="3" width="12" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/>
						<path d="M1 4L7 8L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
					</svg>
					<a href="mailto:{email}" class="contact-link">{email}</a>
				</div>
			{/if}

			{#if phone}
				<div class="contact-detail-item">
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="detail-icon">
						<path d="M3 1H5L6 4L4.5 5C5.5 7 7 8.5 9 9.5L10 8L13 9V11C13 12.1 12.1 13 11 13C5.5 13 1 8.5 1 3C1 1.9 1.9 1 3 1Z" stroke="currentColor" stroke-width="1.5"/>
					</svg>
					<a href="tel:{phone}" class="contact-link">{formatPhone(phone)}</a>
				</div>
			{/if}

			{#if location}
				<div class="contact-detail-item">
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="detail-icon">
						<path d="M7 7C8.1 7 9 6.1 9 5C9 3.9 8.1 3 7 3C5.9 3 5 3.9 5 5C5 6.1 5.9 7 7 7Z" stroke="currentColor" stroke-width="1.5"/>
						<path d="M7 13C7 13 2 9 2 5C2 2.8 4.2 1 7 1C9.8 1 12 2.8 12 5C12 9 7 13 7 13Z" stroke="currentColor" stroke-width="1.5"/>
					</svg>
					<span class="contact-text">{location}</span>
				</div>
			{/if}
		</div>

		<!-- Professional Info -->
		{#if barNumber || specialty}
			<div class="professional-info">
				{#if barNumber}
					<div class="info-item">
						<span class="info-label">Bar Number:</span>
						<span class="info-value">{barNumber}</span>
					</div>
				{/if}
				{#if specialty}
					<div class="info-item">
						<span class="info-label">Specialty:</span>
						<span class="info-value">{specialty}</span>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Quick Actions -->
		<div class="quick-actions">
			<button class="quick-action-btn primary">
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
					<rect x="1" y="3" width="12" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/>
					<path d="M1 4L7 8L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
				</svg>
				Email
			</button>
			<button class="quick-action-btn">
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
					<path d="M3 1H5L6 4L4.5 5C5.5 7 7 8.5 9 9.5L10 8L13 9V11C13 12.1 12.1 13 11 13C5.5 13 1 8.5 1 3C1 1.9 1.9 1 3 1Z" stroke="currentColor" stroke-width="1.5"/>
				</svg>
				Call
			</button>
			<button class="quick-action-btn">
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
					<rect x="2" y="2" width="10" height="10" rx="1" stroke="currentColor" stroke-width="1.5"/>
					<path d="M5 2V4M9 2V4M2 6H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
				</svg>
				Cases
			</button>
		</div>
	</div>
</div>

<style>
	.contact-card {
		background: white;
		border: 1px solid var(--color-border, #E0E0E0);
		border-radius: 8px;
		overflow: hidden;
		transition: all 0.2s;
		margin-bottom: 12px;
	}

	.contact-card:hover {
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

	.avatar-section {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		flex: 1;
	}

	.avatar-large {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		font-weight: 600;
		color: white;
		flex-shrink: 0;
	}

	.contact-info {
		flex: 1;
		min-width: 0;
	}

	.contact-name {
		font-size: 16px;
		font-weight: 600;
		color: var(--color-text-primary, #161616);
		margin: 0 0 6px 0;
		line-height: 1.3;
	}

	.contact-type-badge {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.type-icon {
		font-size: 14px;
		line-height: 1;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		padding: 3px 8px;
		border-radius: 10px;
		font-size: 11px;
		font-weight: 600;
		line-height: 1;
	}

	.badge-contact-type {
		border: 1px solid;
	}

	.type-attorney {
		background: #E8F5E9;
		color: #2E7D32;
		border-color: #A5D6A7;
	}

	.type-client {
		background: #E3F2FD;
		color: #1565C0;
		border-color: #90CAF9;
	}

	.type-witness {
		background: #FFF9C4;
		color: #F57C00;
		border-color: #FFD54F;
	}

	.type-expert {
		background: #F3E5F5;
		color: #6A1B9A;
		border-color: #CE93D8;
	}

	.type-paralegal {
		background: #E0F2F1;
		color: #00695C;
		border-color: #80CBC4;
	}

	.type-court {
		background: #EFEBE9;
		color: #4E342E;
		border-color: #BCAAA4;
	}

	.type-default {
		background: #F5F5F5;
		color: #616161;
		border-color: #BDBDBD;
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

	/* Organization */
	.organization-section {
		margin-bottom: 12px;
		padding-bottom: 12px;
		border-bottom: 1px solid #F5F5F5;
	}

	.organization-name {
		font-size: 14px;
		font-weight: 600;
		color: var(--color-text-primary, #161616);
		margin-bottom: 2px;
	}

	.job-title {
		font-size: 13px;
		color: var(--color-text-secondary, #666);
	}

	/* Contact Details */
	.contact-details {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 12px;
	}

	.contact-detail-item {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.detail-icon {
		color: var(--color-text-secondary, #666);
		flex-shrink: 0;
	}

	.contact-link {
		font-size: 13px;
		color: #1565C0;
		text-decoration: none;
		transition: color 0.15s;
	}

	.contact-link:hover {
		color: #0D47A1;
		text-decoration: underline;
	}

	.contact-text {
		font-size: 13px;
		color: var(--color-text-primary, #161616);
	}

	/* Professional Info */
	.professional-info {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 10px;
		background: #F9F9F9;
		border-radius: 6px;
		margin-bottom: 12px;
	}

	.info-item {
		font-size: 12px;
		display: flex;
		gap: 6px;
	}

	.info-label {
		color: var(--color-text-secondary, #666);
		font-weight: 500;
	}

	.info-value {
		color: var(--color-text-primary, #161616);
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
		.quick-actions {
			flex-direction: column;
		}

		.quick-action-btn {
			justify-content: flex-start;
		}
	}
</style>
