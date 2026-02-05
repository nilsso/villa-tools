<script lang="ts" module>
	import { CircleAlertIcon } from '@lucide/svelte';
	import * as Tooltip from './ui/tooltip';
	import type { Snippet } from 'svelte';

	export type Props = {
		children: Snippet;
	};
</script>

<script lang="ts">
	const { children }: Props = $props();
</script>

<Tooltip.Root delayDuration={0}>
	<Tooltip.Trigger>
		<CircleAlertIcon class="stroke-muted-foreground -mt-2 inline-block size-3" />
	</Tooltip.Trigger>
	<Tooltip.Content align="center">
		{@render children()}
	</Tooltip.Content>
</Tooltip.Root>
