<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Field from '$lib/components/ui/field';
	import Input from '$lib/components/ui/input/input.svelte';
	import { simpleOnUpdated } from '$lib/utils/superforms.svelte';
	import { PencilIcon } from '@lucide/svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { UpdateSchoolSchema } from '../schema';

	type Props = {
		data: SuperValidated<UpdateSchoolSchema>;
	};

	let { data }: Props = $props();

	let open = $state(false);

	const form = superForm(data, {
		validators: valibotClient(UpdateSchoolSchema),
		resetForm: false,
		applyAction: 'never',
		onUpdated: simpleOnUpdated({
			success: 'School renamed.',
			failure: 'Failed to rename school.',
			onSuccess: () => (open = false),
		}),
	});
	const { form: formData, enhance } = form;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants()}>
		<PencilIcon />
		Rename
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Rename</Dialog.Title>
			<Dialog.Description>Rename this school.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/update" class="contents" use:enhance>
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
				<Button type="submit">Submit</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
