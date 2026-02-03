<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Field from '$lib/components/ui/field';
	import Input from '$lib/components/ui/input/input.svelte';
	import { CirclePlusIcon } from '@lucide/svelte';
	import * as Snap from 'formsnap';
	import { toast } from 'svelte-sonner';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import * as v from 'valibot';
	import { CreateSchoolSchema } from '$generated/valibot';
	import { resolve } from '$app/paths';

	const {
		data,
	}: {
		data: SuperValidated<Infer<typeof CreateSchoolSchema>>;
	} = $props();

	let open = $state(false);

	const form = superForm(data, {
		validators: valibotClient(
			v.object({
				...CreateSchoolSchema.entries,
				name: v.pipe(v.string(), v.nonEmpty('Name cannot be empty.')),
			})
		),
		async onUpdated() {
			toast.success('School created.');
			open = false;
			await invalidateAll();
		},
		onError() {
			toast.error('Failed to create school.');
		},
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
		<form
			method="POST"
			action="{resolve('/(app)/(protected)/rosters')}?/createSchool"
			use:enhance
			class="contents"
		>
			<Field.Group>
				<Snap.Field {form} name="name">
					<Field.Field>
						<Snap.Control>
							{#snippet children({ props })}
								<Field.Label>Name</Field.Label>
								<Input {...props} bind:value={$formData.name} />
							{/snippet}
						</Snap.Control>
						<Field.Error>
							<Snap.FieldErrors />
						</Field.Error>
					</Field.Field>
				</Snap.Field>
			</Field.Group>
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
				<Button type="submit">Create</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
