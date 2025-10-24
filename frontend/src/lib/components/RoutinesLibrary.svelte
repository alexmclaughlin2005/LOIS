<script lang="ts">
	import { DEFAULT_ROUTINES, type Routine } from '$lib/types/routine';

	export let onClose: () => void = () => {};
	export let onRunRoutine: (routine: Routine) => void = () => {};

	let searchQuery = '';

	// Promoted routines data
	const promotedRoutines: Routine[] = [
		{
			id: '1',
			name: 'Client Care Package',
			description:
				'A set of routines designed to help you stay proactive with client communication and engagement.',
			organization: 'Vista Group',
			isPromoted: true,
			subroutines: [
				{ name: 'Client Birthdays', schedule: 'Every Monday at 8:00 AM' },
				{ name: 'No Activity in 30 Days', schedule: 'Everyday at 8:00 AM' },
				{ name: 'Client Follow-Ups', schedule: 'Every Friday at 9:00 AM' }
			]
		},
		{
			id: '2',
			name: 'Litigation Management Suite',
			description:
				'Automated routines that track litigation milestones, deposition schedules, and upcoming hearings.',
			organization: 'Shunnarah Law',
			isPromoted: true,
			subroutines: [
				{ name: 'Depos Next Month', schedule: 'Monthly on 1st' },
				{ name: 'Hearing Alerts', schedule: 'Weekly on Monday' },
				{ name: 'Discovery Progress Tracker', schedule: 'Every Thursday at 10:00 AM' }
			]
		},
		{
			id: '3',
			name: 'Financial Compliance Monitor',
			description:
				'Track trust account balances, pending payments, and generate monthly financial reports automatically.',
			organization: 'Morgan & Morgan',
			isPromoted: true,
			subroutines: [
				{ name: 'Trust Account Reconciliation', schedule: 'Daily at 6:00 AM' },
				{ name: 'Outstanding Invoices', schedule: 'Every Monday at 9:00 AM' },
				{ name: 'Monthly Financial Summary', schedule: 'Monthly on 1st at 8:00 AM' }
			]
		},
		{
			id: '4',
			name: 'Discovery Deadline Tracker',
			description:
				'Automatically monitor and alert on upcoming discovery deadlines, document production dates, and motion filing requirements.',
			organization: 'Baker & McKenzie',
			isPromoted: true,
			subroutines: [
				{ name: 'Discovery Responses Due', schedule: 'Daily at 7:00 AM' },
				{ name: 'Document Production Deadlines', schedule: 'Every Tuesday at 8:00 AM' },
				{ name: 'Motion Filing Reminders', schedule: 'Weekly on Wednesday' }
			]
		}
	];

	// My routines data - use DEFAULT_ROUTINES from types
	const myRoutines: Routine[] = DEFAULT_ROUTINES;

	let expandedRoutines: Set<string> = new Set();

	function toggleRoutine(id: string) {
		if (expandedRoutines.has(id)) {
			expandedRoutines.delete(id);
		} else {
			expandedRoutines.add(id);
		}
		expandedRoutines = expandedRoutines; // Trigger reactivity
	}
</script>

<div class="routines-library">
	<!-- Header -->
	<div class="library-header">
		<div class="header-title">
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path
					d="M3 6C3 4.89543 3.89543 4 5 4H8L10 6H15C16.1046 6 17 6.89543 17 8V14C17 15.1046 16.1046 16 15 16H5C3.89543 16 3 15.1046 3 14V6Z"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<span>Routines Library</span>
		</div>
		<div class="header-actions">
			<button class="btn-create">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path
						d="M8 3V13M3 8H13"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				Create Routine
			</button>
			<button class="btn-close" on:click={onClose}>
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
					<path
						d="M6 6L14 14M6 14L14 6"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		</div>
	</div>

	<!-- Search Bar -->
	<div class="search-container">
		<svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
			<path
				d="M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12Z"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M14 14L10.5 10.5"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		<input
			type="text"
			placeholder="Search for a routine"
			bind:value={searchQuery}
			class="search-input"
		/>
	</div>

	<!-- Content -->
	<div class="library-content">
		<!-- Promoted Routines Section -->
		<div class="section">
			<div class="section-header">
				<span class="section-title">PROMOTED ROUTINES</span>
				<a href="#" class="view-all">View all →</a>
			</div>

			{#each promotedRoutines as routine}
				<div class="routine-card promoted">
					<div class="routine-main" on:click={() => toggleRoutine(routine.id)}>
						<div class="routine-info">
							<div class="routine-header-row">
								<svg class="routine-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
									<path
										d="M3 6C3 4.89543 3.89543 4 5 4H8L10 6H15C16.1046 6 17 6.89543 17 8V14C17 15.1046 16.1046 16 15 16H5C3.89543 16 3 15.1046 3 14V6Z"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
								<h3 class="routine-name">{routine.name}</h3>
							</div>
							<p class="routine-description">{routine.description}</p>
						</div>
						<button class="expand-button" class:expanded={expandedRoutines.has(routine.id)}>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
								<path
									d="M4 6L8 10L12 6"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</button>
					</div>

					{#if routine.subroutines && expandedRoutines.has(routine.id)}
						<div class="subroutines">
							{#each routine.subroutines as subroutine}
								<div class="subroutine-item">
									<div class="subroutine-info">
										<span class="subroutine-name">{subroutine.name}</span>
										<span class="subroutine-schedule">
											<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
												<circle
													cx="6"
													cy="6"
													r="5"
													stroke="currentColor"
													stroke-width="1"
													fill="none"
												/>
												<path
													d="M6 3V6L8 8"
													stroke="currentColor"
													stroke-width="1"
													stroke-linecap="round"
												/>
											</svg>
											{subroutine.schedule}
										</span>
									</div>
								</div>
							{/each}
							<button class="btn-add-routine">
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
									<path
										d="M8 3V13M3 8H13"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
								Add to my routines
							</button>
						</div>
					{/if}

					{#if routine.organization}
						<div class="routine-footer">
							<span class="organization">{routine.organization}</span>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- My Routines Section -->
		<div class="section">
			<div class="section-header">
				<span class="section-title">MY ROUTINES</span>
			</div>

			<div class="my-routines-grid">
				{#each myRoutines as routine}
					<div class="my-routine-card">
						<div class="my-routine-header">
							<h3 class="my-routine-name">{routine.name}</h3>
							<span class="last-run">Last run: {routine.lastRun}</span>
						</div>
						<p class="my-routine-description">{routine.description}</p>
						<div class="my-routine-schedule">
							<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
								<circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1" fill="none" />
								<path
									d="M6 3V6L8 8"
									stroke="currentColor"
									stroke-width="1"
									stroke-linecap="round"
								/>
							</svg>
							{routine.schedule}
							<button class="details-link">Details →</button>
						</div>
						<div class="my-routine-actions">
							<button class="btn-run" on:click={() => onRunRoutine(routine)} title="Run now">
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
									<path
										d="M4 2L12 8L4 14V2Z"
										fill="currentColor"
									/>
								</svg>
								Run
							</button>
							<button class="btn-icon" title="Edit">
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
									<path
										d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L5.33301 13.3334L2.66634 14L3.33301 11.3334L11.9997 2.66671L11.333 2.00004Z"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.routines-library {
		position: fixed;
		right: 0;
		top: 0;
		bottom: 0;
		width: 480px;
		background: #F4F4F4;
		border-left: 1px solid #E0E0E0;
		display: flex;
		flex-direction: column;
		font-family: 'Helvetica Now Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		z-index: 100;
	}

	.library-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 20px;
		border-bottom: 1px solid #E0E0E0;
		background: #F4F4F4;
	}

	.header-title {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 17.5px;
		font-weight: 400;
		color: #161616;
		line-height: 25px;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.btn-create {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 16px;
		background: #161616;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s;
	}

	.btn-create:hover {
		background: #333;
	}

	.btn-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: transparent;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		color: #525252;
		transition: background 0.15s;
	}

	.btn-close:hover {
		background: #f4f4f4;
	}

	.search-container {
		position: relative;
		padding: 16px 20px;
		border-bottom: 1px solid #E0E0E0;
		background: #F4F4F4;
	}

	.search-icon {
		position: absolute;
		left: 32px;
		top: 50%;
		transform: translateY(-50%);
		color: #8D8D8D;
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 10px 12px 10px 36px;
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		font-size: 14px;
		color: #161616;
		background: white;
		transition: border-color 0.15s;
	}

	.search-input:focus {
		outline: none;
		border-color: #525252;
	}

	.search-input::placeholder {
		color: #8D8D8D;
	}

	.library-content {
		flex: 1;
		overflow-y: auto;
		padding: 20px;
		background: #F4F4F4;
	}

	.section {
		margin-bottom: 32px;
	}

	.section:last-child {
		margin-bottom: 0;
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	.section-title {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0px;
		color: #8D8D8D;
		font-family: 'Helvetica Now Micro', sans-serif;
	}

	.view-all {
		font-size: 13px;
		color: #0f62fe;
		text-decoration: none;
		font-weight: 500;
	}

	.view-all:hover {
		text-decoration: underline;
	}

	/* Promoted Routine Cards */
	.routine-card {
		background: #E9E9E9;
		border: none;
		border-radius: 10px;
		margin-bottom: 12px;
		overflow: hidden;
	}

	.routine-card:last-child {
		margin-bottom: 0;
	}

	.routine-main {
		display: flex;
		align-items: flex-start;
		padding: 15px 25px;
		cursor: pointer;
		transition: background 0.15s;
	}

	.routine-main:hover {
		background: #DEDEDE;
	}

	.routine-info {
		flex: 1;
		min-width: 0;
	}

	.routine-header-row {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 8px;
	}

	.routine-icon {
		color: #525252;
		flex-shrink: 0;
	}

	.routine-name {
		font-size: 17.5px;
		font-weight: 400;
		color: #161616;
		margin: 0;
		line-height: 25px;
	}

	.routine-description {
		font-size: 14px;
		color: #161616;
		line-height: 20px;
		margin: 0;
	}

	.expand-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		background: transparent;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		color: #525252;
		transition: all 0.2s;
		flex-shrink: 0;
		margin-left: 12px;
	}

	.expand-button:hover {
		background: #f4f4f4;
	}

	.expand-button.expanded {
		transform: rotate(180deg);
	}

	.subroutines {
		border-top: 1px solid #D6D6D6;
		padding: 12px 25px;
		background: #E9E9E9;
	}

	.subroutine-item {
		padding: 10px 0;
		border-bottom: 1px solid #e8e8e8;
	}

	.subroutine-item:last-child {
		border-bottom: none;
		padding-bottom: 12px;
	}

	.subroutine-info {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.subroutine-name {
		font-size: 14px;
		font-weight: 500;
		color: #161616;
	}

	.subroutine-schedule {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		color: #8d8d8d;
	}

	.btn-add-routine {
		display: flex;
		align-items: center;
		gap: 6px;
		width: 100%;
		padding: 10px 12px;
		margin-top: 8px;
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		font-size: 13px;
		font-weight: 500;
		color: #161616;
		cursor: pointer;
		transition: all 0.15s;
	}

	.btn-add-routine:hover {
		background: #f4f4f4;
		border-color: #525252;
	}

	.routine-footer {
		padding: 12px 25px;
		border-top: 1px solid #D6D6D6;
		background: #E9E9E9;
	}

	.organization {
		font-size: 12px;
		color: #8D8D8D;
	}

	/* My Routines Grid */
	.my-routines-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
	}

	.my-routine-card {
		background: white;
		border: 1px solid #E0E0E0;
		border-radius: 10px;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		transition: all 0.15s;
	}

	.my-routine-card:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		border-color: #525252;
	}

	.my-routine-header {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-bottom: 4px;
	}

	.my-routine-name {
		font-size: 14px;
		font-weight: 600;
		color: #161616;
		margin: 0;
	}

	.last-run {
		font-size: 11px;
		color: #8D8D8D;
	}

	.my-routine-description {
		font-size: 12px;
		color: #525252;
		line-height: 1.4;
		margin: 0;
		flex: 1;
	}

	.my-routine-schedule {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 11px;
		color: #8D8D8D;
		padding-bottom: 12px;
		border-bottom: 1px solid #E0E0E0;
	}

	.details-link {
		margin-left: auto;
		background: none;
		border: none;
		font-size: 11px;
		color: #0f62fe;
		cursor: pointer;
		padding: 0;
		font-weight: 500;
	}

	.details-link:hover {
		text-decoration: underline;
	}

	.my-routine-actions {
		display: flex;
		gap: 8px;
		margin-top: 4px;
	}

	.btn-run {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		flex: 1;
		padding: 8px 12px;
		background: #161616;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 13px;
		font-weight: 500;
		transition: all 0.15s;
	}

	.btn-run:hover {
		background: #333;
	}

	.btn-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: transparent;
		border: 1px solid #E0E0E0;
		border-radius: 6px;
		cursor: pointer;
		color: #525252;
		transition: all 0.15s;
	}

	.btn-icon:hover {
		background: #F4F4F4;
		border-color: #525252;
	}
</style>
