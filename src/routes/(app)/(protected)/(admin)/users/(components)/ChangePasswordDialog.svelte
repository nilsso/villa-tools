<script lang="ts">
	import { resolve } from '$app/paths';
	import PasswordInput from '$lib/components/PasswordInput.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Field from '$lib/components/ui/field';
	import type { SuperForm } from 'sveltekit-superforms';
	import type { ChangePasswordSchema } from '../schema';

	type Props = {
		form: SuperForm<ChangePasswordSchema>;
		open?: boolean;
	};

	let { form, open = $bindable(false) }: Props = $props();

	const { form: formData, enhance } = form;

	$effect(() => {
		if (!open) form.reset();
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Change User Password</Dialog.Title>
			<Dialog.Description>
				Change the password for this user. This will invalidate all user sessions.
			</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="{resolve('/users')}?/changePassword" use:enhance class="contents">
			<input hidden name="userId" bind:value={$formData.userId} />
			<Field.Group>
				<Field.Snap {form} name="password">
					{#snippet children({ props })}
						<Field.Label>Password</Field.Label>
						<PasswordInput {...props} bind:value={$formData.password} />
					{/snippet}
				</Field.Snap>
				<Field.Snap {form} name="passwordConfirm">
					{#snippet children({ props })}
						<Field.Label>Password (confirm)</Field.Label>
						<PasswordInput {...props} bind:value={$formData.passwordConfirm} />
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
