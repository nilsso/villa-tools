<script lang="ts">
	import { page } from '$app/state';
	import * as Empty from '$lib/components/ui/empty';
	import { BugIcon, CircleSlashIcon, CircleXIcon } from '@lucide/svelte';
	import { inRange } from 'es-toolkit';
</script>

<Empty.Root>
	<Empty.Header>
		<Empty.Media variant="icon">
			{#if page.status === 404}
				<CircleSlashIcon />
			{:else if inRange(page.status, 400, 500)}
				<CircleXIcon />
			{:else}
				<BugIcon />
			{/if}
		</Empty.Media>
		<Empty.Title>
			{#if page.status === 404}
				Page Not Found
			{:else}
				Error - {page.status}
			{/if}
		</Empty.Title>
		<Empty.Description>
			{#if page.status === 404}
				The requested page was not found.
			{:else if inRange(page.status, 400, 500)}
				Invalid page access.
			{:else}
				Oops... Looks like something broke on the server.
			{/if}
		</Empty.Description>
	</Empty.Header>
</Empty.Root>
