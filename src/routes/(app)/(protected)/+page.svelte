<script lang="ts">
	import { resolve } from '$app/paths';
	import { TOOLS, type MenuItem } from '$lib/components/layout/menu-items';
	import * as Card from '$lib/components/ui/card';
	import { ArrowUpRightIcon } from '@lucide/svelte';
</script>

{#snippet MenuItemCard({ label, description, placeholder }: MenuItem)}
	<Card.Root>
		<Card.Header>
			<Card.Title>{label}</Card.Title>
			{#if description}
				<Card.Description>{description}</Card.Description>
			{/if}
			{#if !placeholder}
				<Card.Action>
					<ArrowUpRightIcon class="size-4" />
				</Card.Action>
			{/if}
		</Card.Header>
	</Card.Root>
{/snippet}

<div class="space-y-6">
	<div class="flex items-start justify-between">
		<div class="space-y-1">
			<h1 class="text-2xl font-semibold">Tools</h1>
			<p class="text-muted-foreground">List of available tools.</p>
		</div>
	</div>
	<div class="grid gap-4 sm:grid-cols-2">
		{#each TOOLS as item, i (i)}
			{#if !item.placeholder}
				<a href={resolve(item.path)}>
					{@render MenuItemCard(item)}
				</a>
			{:else}
				{@render MenuItemCard(item)}
			{/if}
		{/each}
	</div>
</div>
