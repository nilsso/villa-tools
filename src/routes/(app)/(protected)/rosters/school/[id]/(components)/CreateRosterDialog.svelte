<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { CreateRosterSchema as SchemaBase } from '$generated/valibot';
	import SeasonDisplay from '$lib/components/SeasonDisplay.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Field from '$lib/components/ui/field';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { CirclePlusIcon } from '@lucide/svelte/icons';
	import * as Snap from 'formsnap';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import * as v from 'valibot';

	type Props = {
		data: SuperValidated<Infer<typeof SchemaBase>>;
	};

	const Schema = v.object({
		...SchemaBase.entries,
		name: v.message(SchemaBase.entries.name, 'Name cannot be empty.'),
		year: v.message(SchemaBase.entries.year, 'Must be a valid year.'),
		season: v.message(SchemaBase.entries.season, 'Pick a season.'),
		url: v.message(SchemaBase.entries.url, 'Must be a valid URL.'),
	});

	const { data }: Props = $props();

	let open = $state(false);

	const form = superForm(data, {
		validators: valibotClient(Schema),
		resetForm: false,
		applyAction: 'never',
		onUpdated({ form }) {
			if (form.valid) {
				open = false;
				toast.success('Roster created.');
			} else {
				toast.error('Failed to create roster.');
			}
		},
	});
	const { form: formData, enhance } = form;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants()}>
		<CirclePlusIcon />
		Create Roster
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create Roster</Dialog.Title>
			<Dialog.Description>Create a new roster for this school.</Dialog.Description>
		</Dialog.Header>
		<form
			method="POST"
			action="{resolve('/(app)/(protected)/rosters')}?/createRoster"
			class="contents"
			use:enhance
		>
			<input name="school_id" type="hidden" bind:value={page.params.id!} />
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
				<Snap.Field {form} name="year">
					<Field.Field>
						<Snap.Control>
							{#snippet children({ props })}
								<Field.Label>Year</Field.Label>
								<Input {...props} type="number" min={1} bind:value={$formData.year} />
							{/snippet}
						</Snap.Control>
						<Field.Error>
							<Snap.FieldErrors />
						</Field.Error>
					</Field.Field>
				</Snap.Field>
				<Snap.Field {form} name="season">
					<Field.Field>
						<Field.Label>Season/Semester</Field.Label>
						<Snap.Control>
							{#snippet children({ props })}
								<RadioGroup.Root
									{...props}
									bind:value={$formData.season}
									class="grid grid-cols-2 gap-2"
								>
									<Field.Label>
										<Field.Field orientation="horizontal">
											<Field.Content class="text-2xs!">
												<Field.Title>
													<SeasonDisplay season="SPRING" />
												</Field.Title>
											</Field.Content>
											<RadioGroup.Item value="SPRING" />
										</Field.Field>
									</Field.Label>
									<Field.Label>
										<Field.Field orientation="horizontal">
											<Field.Content class="text-2xs!">
												<Field.Title>
													<SeasonDisplay season="SUMMER" />
												</Field.Title>
											</Field.Content>
											<RadioGroup.Item value="SUMMER" />
										</Field.Field>
									</Field.Label>
									<Field.Label>
										<Field.Field orientation="horizontal">
											<Field.Content class="text-2xs!">
												<Field.Title>
													<SeasonDisplay season="FALL" />
												</Field.Title>
											</Field.Content>
											<RadioGroup.Item value="FALL" />
										</Field.Field>
									</Field.Label>
									<Field.Label>
										<Field.Field orientation="horizontal">
											<Field.Content class="text-2xs!">
												<Field.Title>
													<SeasonDisplay season="WINTER" />
												</Field.Title>
											</Field.Content>
											<RadioGroup.Item value="WINTER" />
										</Field.Field>
									</Field.Label>
								</RadioGroup.Root>
							{/snippet}
						</Snap.Control>
						<Field.Error>
							<Snap.FieldErrors />
						</Field.Error>
					</Field.Field>
				</Snap.Field>
				<Snap.Field {form} name="url">
					<Field.Field>
						<Snap.Control>
							{#snippet children({ props })}
								<Field.Label>URL</Field.Label>
								<Input {...props} bind:value={$formData.url} />
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
				<Button type="submit">Create</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
