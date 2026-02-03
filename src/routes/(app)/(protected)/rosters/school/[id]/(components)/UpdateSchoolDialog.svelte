<script lang="ts">
	import { resolve } from '$app/paths';
	import { UpdateSchoolSchema } from '$generated/valibot';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Field from '$lib/components/ui/field';
	import Input from '$lib/components/ui/input/input.svelte';
	import { PencilIcon } from '@lucide/svelte';
	import * as Snap from 'formsnap';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import * as v from 'valibot';

	let {
		schoolId,
		data,
	}: {
		schoolId: string;
		data: SuperValidated<Infer<typeof UpdateSchoolSchema>>;
	} = $props();

	let open = $state(false);

	const Schema = v.object({
		...UpdateSchoolSchema.entries,
		name: v.pipe(v.string(), v.nonEmpty('Name cannot be empty.')),
	});

	const form = superForm(data, {
		validators: valibotClient(Schema),
		resetForm: false,
		applyAction: 'never',
		onUpdated({ form }) {
			if (form.valid) {
				open = false;
				toast.success('School renamed.');
			} else {
				toast.error('Failed to rename school.');
			}
		},
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
		<form
			method="POST"
			action="{resolve('/(app)/(protected)/rosters/school/[id]', { id: schoolId })}?/update"
			class="contents"
			use:enhance
		>
			<Field.Group>
				<Field.Field>
					<Snap.Field {form} name="name">
						<Snap.Control>
							{#snippet children({ props })}
								<Field.Label>Name</Field.Label>
								<Input {...props} bind:value={$formData.name} />
							{/snippet}
						</Snap.Control>
						<Field.Error>
							<Snap.FieldErrors />
						</Field.Error>
					</Snap.Field>
				</Field.Field>
			</Field.Group>
			<Dialog.Footer>
				<Dialog.Close>Cancel</Dialog.Close>
				<Button type="submit">Submit</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
