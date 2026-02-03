<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import PasswordInput from '$lib/components/PasswordInput.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Field from '$lib/components/ui/field';
	import { EyeIcon } from '@lucide/svelte';
	import * as Snap from 'formsnap';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { ResetPasswordSchema } from '../schema.js';

	const { data } = $props();

	const form = superForm(data.form, {
		validators: valibotClient(ResetPasswordSchema),
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Password reset.');
				goto(resolve('/'));
			} else {
				toast.error(form.message ?? 'Failed to reset password.');
			}
		},
	});
	const { form: formData, enhance } = form;

	const showPasswords = $state([false, false, false]);
</script>

<Card.Root class="mx-auto max-w-sm">
	<Card.Header>
		<Card.Title>Reset Password</Card.Title>
		<Card.Description>Reset your user password.</Card.Description>
		<Card.Action>
			<Button
				variant="ghost"
				size="icon"
				onclick={() => showPasswords.forEach((_, i) => (showPasswords[i] = true))}
			>
				<EyeIcon />
			</Button>
		</Card.Action>
	</Card.Header>
	<form
		method="POST"
		action={resolve('/(app)/(protected)/user/reset-password')}
		use:enhance
		class="contents"
	>
		<Card.Content>
			<Field.Group>
				<Snap.Field {form} name="oldPassword">
					<Field.Field>
						<Snap.Control>
							{#snippet children({ props })}
								<Field.Label>Old Password</Field.Label>
								<PasswordInput
									{...props}
									bind:value={$formData.oldPassword}
									bind:showPassword={showPasswords[0]}
								/>
							{/snippet}
						</Snap.Control>
						<Field.Error>
							<Snap.FieldErrors />
						</Field.Error>
					</Field.Field>
				</Snap.Field>
				<Snap.Field {form} name="newPassword">
					<Field.Field>
						<Snap.Control>
							{#snippet children({ props })}
								<Field.Label>New Password</Field.Label>
								<PasswordInput
									{...props}
									bind:value={$formData.newPassword}
									bind:showPassword={showPasswords[1]}
								/>
							{/snippet}
						</Snap.Control>
						<Field.Error>
							<Snap.FieldErrors />
						</Field.Error>
					</Field.Field>
				</Snap.Field>
				<Snap.Field {form} name="newPasswordConfirm">
					<Field.Field>
						<Snap.Control>
							{#snippet children({ props })}
								<Field.Label>New Password (confirm)</Field.Label>
								<PasswordInput
									{...props}
									bind:value={$formData.newPasswordConfirm}
									bind:showPassword={showPasswords[2]}
								/>
							{/snippet}
						</Snap.Control>
						<Field.Error>
							<Snap.FieldErrors />
						</Field.Error>
					</Field.Field>
				</Snap.Field>
			</Field.Group>
		</Card.Content>
		<Card.Footer class="justify-end">
			<Button type="submit">Submit</Button>
		</Card.Footer>
	</form>
</Card.Root>
