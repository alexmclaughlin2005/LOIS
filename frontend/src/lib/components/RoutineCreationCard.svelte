<script lang="ts">
	export let onSave: (routine: RoutineData) => void;
	export let onCancel: () => void;

	type RoutineData = {
		description: string;
		repeat: string;
		every: string;
		on: string;
		at: string;
		type: string;
		prompt: string;
	};

	let routine: RoutineData = {
		description: 'Meds > $100k',
		repeat: 'Weekly',
		every: '2 Weeks',
		on: 'Tue',
		at: '2:30PM',
		type: 'Prompt',
		prompt: 'Medical expenses exceed $100,000'
	};
</script>

<div class="routine-card">
	<h3 class="routine-title">New Routine</h3>

	<div class="routine-form">
		<!-- Description -->
		<div class="field-row">
			<label class="field-label">DESCRIPTION</label>
			<div class="field-with-icon">
				<span class="field-value">{routine.description}</span>
				<button class="icon-btn" aria-label="Edit description">
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
						<path
							d="M10.333 1.66671C10.5081 1.49161 10.716 1.35272 10.9447 1.25796C11.1735 1.1632 11.4187 1.11442 11.6663 1.11442C11.914 1.11442 12.1592 1.1632 12.3879 1.25796C12.6167 1.35272 12.8246 1.49161 12.9997 1.66671C13.1748 1.8418 13.3137 2.04967 13.4084 2.27845C13.5032 2.50722 13.552 2.75242 13.552 3.00004C13.552 3.24766 13.5032 3.49286 13.4084 3.72163C13.3137 3.95041 13.1748 4.15828 12.9997 4.33337L4.66634 12.6667L1.33301 13.6667L2.33301 10.3334L10.6663 2.00004L10.333 1.66671Z"
							stroke="currentColor"
							stroke-width="1.2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
			</div>
		</div>

		<!-- Repeat & Every -->
		<div class="field-row-group">
			<div class="field-col">
				<label class="field-label">REPEAT</label>
				<select class="field-select" bind:value={routine.repeat}>
					<option value="Daily">Daily</option>
					<option value="Weekly">Weekly</option>
					<option value="Monthly">Monthly</option>
				</select>
			</div>
			<div class="field-col">
				<label class="field-label">EVERY</label>
				<select class="field-select" bind:value={routine.every}>
					<option value="1 Week">1 Week</option>
					<option value="2 Weeks">2 Weeks</option>
					<option value="3 Weeks">3 Weeks</option>
					<option value="4 Weeks">4 Weeks</option>
				</select>
			</div>
		</div>

		<!-- On & At -->
		<div class="field-row-group">
			<div class="field-col">
				<label class="field-label">ON</label>
				<select class="field-select" bind:value={routine.on}>
					<option value="Mon">Mon</option>
					<option value="Tue">Tue</option>
					<option value="Wed">Wed</option>
					<option value="Thu">Thu</option>
					<option value="Fri">Fri</option>
					<option value="Sat">Sat</option>
					<option value="Sun">Sun</option>
				</select>
			</div>
			<div class="field-col">
				<label class="field-label">AT</label>
				<select class="field-select" bind:value={routine.at}>
					<option value="12:00AM">12:00AM</option>
					<option value="1:00AM">1:00AM</option>
					<option value="2:00AM">2:00AM</option>
					<option value="2:30PM">2:30PM</option>
					<option value="3:00PM">3:00PM</option>
					<option value="4:00PM">4:00PM</option>
					<option value="5:00PM">5:00PM</option>
				</select>
			</div>
		</div>

		<!-- Type -->
		<div class="field-row">
			<label class="field-label">TYPE</label>
			<select class="field-select" bind:value={routine.type}>
				<option value="Prompt">Prompt</option>
				<option value="Report">Report</option>
				<option value="Alert">Alert</option>
			</select>
		</div>

		<!-- Prompt -->
		<div class="field-row">
			<label class="field-label">PROMPT</label>
			<div class="field-with-icon">
				<span class="field-value">{routine.prompt}</span>
				<button class="icon-btn" aria-label="Edit prompt">
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
						<path
							d="M10.333 1.66671C10.5081 1.49161 10.716 1.35272 10.9447 1.25796C11.1735 1.1632 11.4187 1.11442 11.6663 1.11442C11.914 1.11442 12.1592 1.1632 12.3879 1.25796C12.6167 1.35272 12.8246 1.49161 12.9997 1.66671C13.1748 1.8418 13.3137 2.04967 13.4084 2.27845C13.5032 2.50722 13.552 2.75242 13.552 3.00004C13.552 3.24766 13.5032 3.49286 13.4084 3.72163C13.3137 3.95041 13.1748 4.15828 12.9997 4.33337L4.66634 12.6667L1.33301 13.6667L2.33301 10.3334L10.6663 2.00004L10.333 1.66671Z"
							stroke="currentColor"
							stroke-width="1.2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
			</div>
		</div>

		<!-- Actions -->
		<div class="form-actions">
			<button class="btn-save" on:click={() => onSave(routine)}>Save Routine</button>
			<button class="btn-cancel" on:click={onCancel}>Cancel</button>
		</div>
	</div>
</div>

<style>
	.routine-card {
		background: white;
		border: 1px solid #E5E5E5;
		border-radius: 8px;
		margin-top: 16px;
		padding: 24px 28px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		width: 560px;
		min-width: 560px;
	}

	.routine-title {
		font-size: 18px;
		font-weight: 600;
		color: #161616;
		margin: 0 0 20px 0;
	}

	.routine-form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.field-row {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.field-row-group {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	.field-col {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.field-label {
		font-size: 11px;
		font-weight: 600;
		color: #6F6F6F;
		letter-spacing: 0.5px;
		text-transform: uppercase;
	}

	.field-with-icon {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 12px;
		background: #F4F4F4;
		border-radius: 4px;
		min-height: 40px;
	}

	.field-value {
		font-size: 14px;
		color: #161616;
		font-weight: 400;
	}

	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4px;
		background: transparent;
		border: none;
		color: #6F6F6F;
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.15s;
	}

	.icon-btn:hover {
		background: #E8E8E8;
		color: #161616;
	}

	.field-select {
		width: 100%;
		padding: 10px 32px 10px 12px;
		font-size: 14px;
		color: #161616;
		background: white;
		border: 1px solid #D0D0D0;
		border-radius: 4px;
		font-family: inherit;
		cursor: pointer;
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236F6F6F' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 12px center;
		transition: border-color 0.15s;
	}

	.field-select:hover {
		border-color: #A0A0A0;
	}

	.field-select:focus {
		outline: none;
		border-color: #161616;
	}

	.form-actions {
		display: flex;
		gap: 8px;
		margin-top: 8px;
	}

	.btn-save,
	.btn-cancel {
		flex: 1;
		padding: 10px 16px;
		font-size: 14px;
		font-weight: 500;
		border-radius: 4px;
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
		color: #DA1E28;
		border: 1px solid #DA1E28;
	}

	.btn-cancel:hover {
		background: #FFF1F1;
	}
</style>
