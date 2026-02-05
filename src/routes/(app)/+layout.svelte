<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import { page } from '$app/state';
	import Header from '$lib/components/layout/Header.svelte';
	import { delay } from 'es-toolkit';
	import { toggleMode } from 'mode-watcher';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';
	import { match } from 'ts-pattern';
	import { TriangleAlertIcon } from '@lucide/svelte';

	let { data, children } = $props();

	const flash = getFlash(page);

	$effect(() => {
		const t = $flash?.toast;
		if (t) {
			delay(100).then(() => {
				match(t)
					.with({ type: 'success' }, ({ message }) => toast.success(message))
					.with({ type: 'error' }, ({ message }) => toast.error(message))
					.exhaustive();
			});
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			toggleMode();
		}
	}

	// TODO: flash.banner should be expanded
</script>

<svelte:document onkeydown={handleKeydown} />

<Header user={data.user} />
<main class="@container container mx-auto max-w-5xl p-4 lg:py-6">
	{#if $flash?.banner}
		{@const { title, description } = $flash.banner}
		<Alert.Root>
			<TriangleAlertIcon />
			<Alert.Title>
				{title}
			</Alert.Title>
			{#if description}
				<Alert.Description>
					{description}
				</Alert.Description>
			{/if}
		</Alert.Root>
	{/if}
	{@render children?.()}
</main>
