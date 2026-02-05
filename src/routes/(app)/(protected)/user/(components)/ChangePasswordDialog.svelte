<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { RotateCcwKeyIcon } from '@lucide/svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { ChangePasswordSchema } from '../schema.js';
	import ResetPasswordForm from './ResetPasswordForm.svelte';

	type Props = {
		data: SuperValidated<Infer<typeof ChangePasswordSchema>>;
	};

	const { data }: Props = $props();
	const id = $props.id();

	let open = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants()}>
		<RotateCcwKeyIcon />
		Change Password
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Change Password</Dialog.Title>
			<Dialog.Description>Change your user password.</Dialog.Description>
		</Dialog.Header>
		<ResetPasswordForm {data} onSuccess={() => (open = false)} id="{id}-form" />
		<Dialog.Footer>
			<Dialog.Close>Cancel</Dialog.Close>
			<Button type="submit" form="{id}-form">Submit</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
