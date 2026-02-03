<script lang="ts" module>
	import type { User } from '$lib/auth';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { MoonIcon, SunIcon } from '@lucide/svelte/icons';
	import { toggleMode } from 'mode-watcher';
	import NavbarDesktop from './NavbarDesktop.svelte';
	import NavbarMobile from './NavbarMobile.svelte';

	type Props = { user: User | undefined };

	const sunClass = cn([
		'absolute',
		'translate-x-0',
		'opacity-100',
		'!transition-[translate,opacity]',
		'duration-350',
		'dark:-translate-x-full',
		'dark:opacity-0',
	]);

	const moonClass = cn([
		'absolute',
		'translate-x-full',
		'opacity-0',
		'!transition-[translate,opacity]',
		'duration-350',
		'dark:translate-x-0',
		'dark:opacity-100',
	]);
</script>

<script lang="ts">
	const { user }: Props = $props();
</script>

<header class="flex items-center justify-between border-b p-2">
	<NavbarDesktop {user} class="hidden md:flex" />
	<NavbarMobile {user} class="md:hidden" />
	<Button onclick={toggleMode} variant="ghost" size="icon" class="relative overflow-clip">
		<SunIcon class={sunClass} />
		<MoonIcon class={moonClass} />
		<span class="sr-only">Toggle theme</span>
	</Button>
</header>
