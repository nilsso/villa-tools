<script lang="ts">
	import { resolve } from '$app/paths';
	import * as Card from '$lib/components/ui/card';
	import { ArrowUpRightIcon } from '@lucide/svelte';
</script>

<div class="space-y-6">
	<div class="flex items-start justify-between">
		<div class="space-y-1">
			<h1 class="text-2xl font-semibold">Tools</h1>
			<p class="text-muted-foreground">List of available tools.</p>
		</div>
	</div>
	<div class="grid gap-4 sm:grid-cols-2">
		<a href={resolve('/rosters')}>
			<Card.Root>
				<Card.Header>
					<Card.Title>Rosters</Card.Title>
					<Card.Description>Links to school rosters.</Card.Description>
					<Card.Action><ArrowUpRightIcon class="size-4" /></Card.Action>
				</Card.Header>
			</Card.Root>
		</a>
		<Card.Root>
			<Card.Header>
				<Card.Title>Inventory</Card.Title>
				<Card.Description>Inventory check-out system.</Card.Description>
				<Card.Action><ArrowUpRightIcon class="size-4" /></Card.Action>
			</Card.Header>
		</Card.Root>
	</div>
</div>
