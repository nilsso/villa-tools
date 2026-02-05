<script lang="ts">
	import { CreateSchoolSchema, type CreateSchoolSchemaType } from '$generated/valibot';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Field from '$lib/components/ui/field';
	import Input from '$lib/components/ui/input/input.svelte';
	import { simpleOnUpdated } from '$lib/utils/superforms.svelte';
	import { CirclePlusIcon } from '@lucide/svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';

	type Props = {
		data: SuperValidated<CreateSchoolSchemaType>;
	};

	const { data }: Props = $props();

	let open = $state(false);

	const form = superForm(data, {
		validators: valibotClient(CreateSchoolSchema),
		resetForm: false,
		applyAction: 'never',
		onUpdated: simpleOnUpdated({
			success: 'School created.',
			failure: 'Failed to create school.',
			onSuccess: () => (open = false),
		}),
	});
	const { form: formData, enhance } = form;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants()}>
		<CirclePlusIcon />
		Create School
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create School</Dialog.Title>
			<Dialog.Description>Create a new school.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/createSchool" class="contents" use:enhance>
			<Field.Group>
				<Field.Snap {form} name="name">
					{#snippet children({ props })}
						<Field.Label>Name</Field.Label>
						<Input {...props} bind:value={$formData.name} />
					{/snippet}
				</Field.Snap>
			</Field.Group>
			<Dialog.Footer>
				<Dialog.Close>Cancel</Dialog.Close>
				<Button type="submit">Create</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
