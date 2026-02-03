<script lang="ts">
	import { page } from '$app/state';
	import Header from '$lib/components/layout/Header.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { delay } from 'es-toolkit';
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';
	import { match } from 'ts-pattern';

	let { data, children } = $props();

	const flash = getFlash(page);

	$effect(() => {
		if ($flash) {
			delay(100).then(() => {
				match($flash)
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
</script>

<svelte:document onkeydown={handleKeydown} />

<Header user={data.user} />
<main class="@container container mx-auto max-w-5xl p-4 lg:py-6">
	{@render children?.()}
</main>
<ModeWatcher />
<Toaster richColors />
