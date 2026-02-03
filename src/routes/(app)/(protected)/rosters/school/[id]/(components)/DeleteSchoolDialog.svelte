<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { buttonVariants } from '$lib/components/ui/button';
	import { TrashIcon } from '@lucide/svelte/icons';
	import { toast } from 'svelte-sonner';

	const {
		schoolId,
	}: {
		schoolId: string;
	} = $props();

	async function deleteSchool() {
		const url = resolve('/(app)/(protected)/rosters/school/[id]', { id: schoolId });
		const res = await fetch(url, { method: 'DELETE' });
		if (res.ok) {
			toast.success(`School deleted.`);
			await goto(resolve('/rosters'));
		} else {
			toast.error('Failed to delete school.');
		}
	}
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger class={buttonVariants({ variant: 'destructive' })}>
		<TrashIcon />
		Delete
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure?</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete this school entry? All of its rosters will also be deleted.
				This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action class={buttonVariants({ variant: 'destructive' })} onclick={deleteSchool}>
				Confirm
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
