<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { Nullish } from '$lib/utils';

	export type Props<T> = {
		value: Nullish<T>;
		children?: Snippet<[T]>;
		fallback?: Snippet | string;
	};
</script>

<script lang="ts" generics="T">
	const { value, children, fallback = 'None' }: Props<T> = $props();
</script>

{#if value != null}
	{#if children}
		{@render children(value)}
	{:else}
		{value}
	{/if}
{:else if typeof fallback === 'string'}
	{fallback}
{:else}
	{@render fallback()}
{/if}
