<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Field from '$lib/components/ui/field';
	import Input from '$lib/components/ui/input/input.svelte';
	import { type SuperForm } from 'sveltekit-superforms';
	import { UpdateSchema } from '../schema';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';

	type Props = {
		form: SuperForm<UpdateSchema>;
		open?: boolean;
	};

	let { form, open = $bindable(false) }: Props = $props();
	const id = $props.id();

	const { form: formData, enhance } = form;

	$effect(() => {
		if (!open) form.reset();
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Update User</Dialog.Title>
			<Dialog.Description>Update user information.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="{resolve('/users')}?/update" use:enhance class="contents">
			<input hidden name="userId" bind:value={$formData.userId} />
			<Field.Group>
				<Field.Snap {form} name="data.email">
					{#snippet children({ props })}
						<Field.Label>Email</Field.Label>
						<Input {...props} type="email" bind:value={$formData.data.email} />
					{/snippet}
				</Field.Snap>
				<Field.Snap {form} name="data.password_reset">
					{#snippet children({ props })}
						<Checkbox
							{...props}
							id="{id}-password-reset"
							bind:checked={$formData.data.password_reset}
						/>
						<Field.Label for="{id}-password-reset" class="font-normal">
							Require password reset?
						</Field.Label>
					{/snippet}
				</Field.Snap>
			</Field.Group>
			<Dialog.Footer>
				<Dialog.Close>Cancel</Dialog.Close>
				<Button type="submit">Submit</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
