<script lang="ts">
	import PasswordInput from '$lib/components/PasswordInput.svelte';
	import * as Field from '$lib/components/ui/field';
	import type { WithoutChildren } from '$lib/utils';
	import { simpleOnUpdated } from '$lib/utils/superforms.svelte.js';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { ChangePasswordSchema } from '../schema.js';
	import { resolve } from '$app/paths';

	type Props = WithoutChildren<HTMLFormAttributes> & {
		data: SuperValidated<ChangePasswordSchema>;
		onSuccess?: () => void;
	};

	const { data, onSuccess, ...restProps }: Props = $props();

	const form = superForm(data, {
		validators: valibotClient(ChangePasswordSchema),
		onUpdated: simpleOnUpdated({
			success: 'Password reset.',
			failure: 'Password changed.',
			onSuccess,
		}),
	});
	const { form: formData, enhance } = form;
</script>

<form
	{...restProps}
	method="POST"
	action="{resolve('/user')}?/changePassword"
	use:enhance
	class="contents"
>
	<Field.Group>
		<Field.Snap {form} name="oldPassword">
			{#snippet children({ props })}
				<Field.Label>Old Password</Field.Label>
				<PasswordInput {...props} bind:value={$formData.oldPassword} />
			{/snippet}
		</Field.Snap>
		<Field.Snap {form} name="newPassword">
			{#snippet children({ props })}
				<Field.Label>New Password</Field.Label>
				<PasswordInput {...props} bind:value={$formData.newPassword} />
			{/snippet}
		</Field.Snap>
		<Field.Snap {form} name="newPasswordConfirm">
			{#snippet children({ props })}
				<Field.Label>New Password (confirm)</Field.Label>
				<PasswordInput {...props} bind:value={$formData.newPasswordConfirm} />
			{/snippet}
		</Field.Snap>
	</Field.Group>
</form>
