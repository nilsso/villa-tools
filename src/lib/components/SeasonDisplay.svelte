<script lang="ts" module>
	import type { Season } from '$generated/prisma/enums';
	import { cn } from '$lib/utils';
	import { LeafIcon, SnowflakeIcon, SproutIcon, SunIcon } from '@lucide/svelte';
	import { upperFirst } from 'es-toolkit';

	export type Props = {
		season: Season;
	};

	const ICON_PARTS = {
		SPRING: {
			icon: SproutIcon,
			iconClass: 'text-emerald-600 dark:text-emerald-400',
		},
		SUMMER: {
			icon: SunIcon,
			iconClass: 'text-amber-600 dark:text-amber-400',
		},
		FALL: {
			icon: LeafIcon,
			iconClass: 'text-rose-600 dark:text-rose-400',
		},
		WINTER: {
			icon: SnowflakeIcon,
			iconClass: 'text-sky-600 dark:text-sky-400',
		},
	};
</script>

<script lang="ts">
	const { season }: Props = $props();
	const { icon: Icon, iconClass } = $derived(ICON_PARTS[season]);
</script>

<div class="flex items-center">
	<Icon class={cn('mr-2 inline-block size-4', iconClass)} />
	{upperFirst(season)}
</div>
