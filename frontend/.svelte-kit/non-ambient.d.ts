
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/admin" | "/api" | "/api/chat-sessions" | "/api/chat-sessions/[id]" | "/api/chat" | "/api/classify-query" | "/api/execute-query" | "/api/generate-query" | "/api/generate-response" | "/api/search" | "/api/snowflake" | "/api/snowflake/cortex-analyst" | "/api/snowflake/explore" | "/api/snowflake/nl-query" | "/api/snowflake/organizations" | "/api/snowflake/query" | "/api/snowflake/schema-map" | "/api/snowflake/test" | "/api/test-query" | "/chat" | "/results";
		RouteParams(): {
			"/api/chat-sessions/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/admin": Record<string, never>;
			"/api": { id?: string };
			"/api/chat-sessions": { id?: string };
			"/api/chat-sessions/[id]": { id: string };
			"/api/chat": { id?: string };
			"/api/classify-query": Record<string, never>;
			"/api/execute-query": Record<string, never>;
			"/api/generate-query": Record<string, never>;
			"/api/generate-response": Record<string, never>;
			"/api/search": Record<string, never>;
			"/api/snowflake": Record<string, never>;
			"/api/snowflake/cortex-analyst": Record<string, never>;
			"/api/snowflake/explore": Record<string, never>;
			"/api/snowflake/nl-query": Record<string, never>;
			"/api/snowflake/organizations": Record<string, never>;
			"/api/snowflake/query": Record<string, never>;
			"/api/snowflake/schema-map": Record<string, never>;
			"/api/snowflake/test": Record<string, never>;
			"/api/test-query": Record<string, never>;
			"/chat": Record<string, never>;
			"/results": Record<string, never>
		};
		Pathname(): "/" | "/admin" | "/admin/" | "/api" | "/api/" | "/api/chat-sessions" | "/api/chat-sessions/" | `/api/chat-sessions/${string}` & {} | `/api/chat-sessions/${string}/` & {} | "/api/chat" | "/api/chat/" | "/api/classify-query" | "/api/classify-query/" | "/api/execute-query" | "/api/execute-query/" | "/api/generate-query" | "/api/generate-query/" | "/api/generate-response" | "/api/generate-response/" | "/api/search" | "/api/search/" | "/api/snowflake" | "/api/snowflake/" | "/api/snowflake/cortex-analyst" | "/api/snowflake/cortex-analyst/" | "/api/snowflake/explore" | "/api/snowflake/explore/" | "/api/snowflake/nl-query" | "/api/snowflake/nl-query/" | "/api/snowflake/organizations" | "/api/snowflake/organizations/" | "/api/snowflake/query" | "/api/snowflake/query/" | "/api/snowflake/schema-map" | "/api/snowflake/schema-map/" | "/api/snowflake/test" | "/api/snowflake/test/" | "/api/test-query" | "/api/test-query/" | "/chat" | "/chat/" | "/results" | "/results/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}