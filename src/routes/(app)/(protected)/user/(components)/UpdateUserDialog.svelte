<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Field from '$lib/components/ui/field';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Snap from 'formsnap';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { UpdateUserSchema } from '../schema';
	import { PencilIcon } from '@lucide/svelte';

	type Props = {
		data: SuperValidated<Infer<typeof UpdateUserSchema>>;
	};

	const { data }: Props = $props();

	let open = $state(false);

	const updateForm = superForm(data, {
		validators: valibotClient(UpdateUserSchema),
		resetForm: false,
		applyAction: 'never',
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('User updated.');
				open = false;
			} else {
				toast.error('Failed to update user.');
			}
		},
	});
	const { form: updateFormData, enhance: updateFormEnhance } = updateForm;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants()}>
		<PencilIcon />
		Update
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Update User</Dialog.Title>
			<Dialog.Description>Update your user information.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/update" class="contents" use:updateFormEnhance>
			<Field.Group>
				<Snap.Field form={updateForm} name="email">
					<Field.Field>
						<Snap.Control>
							{#snippet children({ props })}
								<Field.Label>Email</Field.Label>
								<Input {...props} type="email" bind:value={$updateFormData.email} />
							{/snippet}
						</Snap.Control>
						<Field.Error>
							<Snap.FieldErrors />
						</Field.Error>
					</Field.Field>
				</Snap.Field>
			</Field.Group>
			<Dialog.Footer>
				<Dialog.Close>Cancel</Dialog.Close>
				<Button type="submit">Submit</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
