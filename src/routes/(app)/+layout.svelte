<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '$lib/components/ui/button/button.svelte';
	import { MoonIcon, SunIcon } from '@lucide/svelte/icons';
	import { toggleMode } from 'mode-watcher';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<header class="h-header flex items-center justify-between border-b p-2">
		<div class="flex items-center gap-4">
			<Button variant="link" href={resolve('/')}>Home</Button>
		</div>
		<div class="flex items-center gap-4">
			<Button onclick={toggleMode} variant="ghost" size="icon" class="relative overflow-clip">
				<SunIcon
					class="absolute translate-x-0 opacity-100 !transition-[translate,opacity] duration-350 dark:-translate-x-full dark:opacity-0"
				/>
				<MoonIcon
					class="absolute translate-x-full opacity-0 !transition-[translate,opacity] duration-350 dark:translate-x-0 dark:opacity-100"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</div>
	</header>
	<main class="@container container mx-auto flex flex-1 flex-col py-8">
		{@render children?.()}
	</main>
</div>
