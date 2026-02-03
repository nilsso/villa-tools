<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { buttonVariants } from '$lib/components/ui/button';
	import { TrashIcon } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	const {
		rosterId,
	}: {
		rosterId: string;
	} = $props();

	let open = $state(false);

	async function deleteRoster() {
		const url = resolve('/(app)/(protected)/rosters/roster/[id]', { id: rosterId });
		const res = await fetch(url, { method: 'DELETE' });
		if (res.ok) {
			toast.success('Roster deleted.');
			open = false;
			await invalidateAll();
		} else {
			toast.error('Failed to delete roster.');
		}
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger
		class={buttonVariants({
			variant: 'ghost',
			size: 'icon-sm',
			class: 'text-destructive',
		})}
	>
		<TrashIcon />
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure?</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete this roster? This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				class={buttonVariants({ variant: 'destructive' })}
				onclick={() => deleteRoster()}
			>
				Confirm
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
