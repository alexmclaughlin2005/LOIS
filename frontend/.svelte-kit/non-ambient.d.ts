
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
		RouteId(): "/" | "/api" | "/api/chat" | "/api/classify-query" | "/api/execute-query" | "/api/generate-query" | "/api/generate-response" | "/api/test-query" | "/chat" | "/results";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/api": Record<string, never>;
			"/api/chat": Record<string, never>;
			"/api/classify-query": Record<string, never>;
			"/api/execute-query": Record<string, never>;
			"/api/generate-query": Record<string, never>;
			"/api/generate-response": Record<string, never>;
			"/api/test-query": Record<string, never>;
			"/chat": Record<string, never>;
			"/results": Record<string, never>
		};
		Pathname(): "/" | "/api" | "/api/" | "/api/chat" | "/api/chat/" | "/api/classify-query" | "/api/classify-query/" | "/api/execute-query" | "/api/execute-query/" | "/api/generate-query" | "/api/generate-query/" | "/api/generate-response" | "/api/generate-response/" | "/api/test-query" | "/api/test-query/" | "/chat" | "/chat/" | "/results" | "/results/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}