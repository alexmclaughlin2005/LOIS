<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export let limit: number = 8;

	interface ChatSession {
		id: string;
		title: string;
		created_at: string;
		last_message_at: string;
		message_count: number;
	}

	let chatSessions: ChatSession[] = [];
	let loading = true;

	onMount(async () => {
		await loadChatHistory();
	});

	async function loadChatHistory() {
		try {
			loading = true;
			const response = await fetch(`/api/chat-sessions?limit=${limit}`);
			const data = await response.json();

			if (data.success) {
				chatSessions = data.sessions;
			} else {
				console.error('Failed to load chat history:', data.error);
			}
		} catch (error) {
			console.error('Error loading chat history:', error);
		} finally {
			loading = false;
		}
	}

	function handleChatClick(sessionId: string) {
		goto(`/chat?session=${sessionId}`);
	}

	// Expose refresh function for parent components
	export function refresh() {
		loadChatHistory();
	}
</script>

{#if loading}
	<div class="chat-list">
		<div class="loading">Loading chats...</div>
	</div>
{:else if chatSessions.length === 0}
	<div class="chat-list">
		<div class="empty-state">No chat history yet</div>
	</div>
{:else}
	<div class="chat-list">
		{#each chatSessions as session}
			<button class="chat-item" on:click={() => handleChatClick(session.id)}>
				{session.title}
			</button>
		{/each}
	</div>
{/if}

<style>
	.chat-list {
		margin-top: 8px;
	}

	.chat-item {
		width: 100%;
		padding: 8px 12px;
		border: none;
		background: transparent;
		cursor: pointer;
		font-size: 14px;
		color: var(--color-text-primary);
		text-align: left;
		border-radius: 6px;
		transition: background 0.15s;
		margin-bottom: 2px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-family: inherit;
	}

	.chat-item:hover {
		background: #f5f5f5;
	}

	.loading,
	.empty-state {
		padding: 8px 12px;
		font-size: 13px;
		color: var(--color-text-secondary);
		font-style: italic;
	}
</style>
