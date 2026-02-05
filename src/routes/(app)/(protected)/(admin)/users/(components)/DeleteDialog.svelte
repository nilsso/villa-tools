<script lang="ts">
	import { resolve } from '$app/paths';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { buttonVariants } from '$lib/components/ui/button';
	import { type SuperForm } from 'sveltekit-superforms';
	import { DeleteSchema } from '../schema';

	type Props = {
		form: SuperForm<DeleteSchema>;
		open?: boolean;
	};

	let { form, open = $bindable(false) }: Props = $props();
	const { form: formData, enhance } = form;

	$effect(() => {
		if (!open) form.reset();
	});
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure?</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete this user? This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<form method="POST" action="{resolve('/users')}?/delete" use:enhance>
				<input hidden name="userId" bind:value={$formData.userId} />
				<AlertDialog.Action type="submit" class={buttonVariants({ variant: 'destructive' })}>
					Confirm
				</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
