<script lang="ts">
	import { resolve } from '$app/paths';
	import { UpdateRosterSchema as SchemaBase } from '$generated/valibot';
	import SeasonDisplay from '$lib/components/SeasonDisplay.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Field from '$lib/components/ui/field';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { PencilIcon } from '@lucide/svelte';
	import * as Snap from 'formsnap';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import * as v from 'valibot';

	type Props = {
		rosterId: string;
		data: Infer<typeof SchemaBase>;
	};

	const Schema = v.object({
		...SchemaBase.entries,
		name: v.message(SchemaBase.entries.name, 'Name cannot be empty.'),
		year: v.message(SchemaBase.entries.year, 'Must be a valid year.'),
		season: v.message(SchemaBase.entries.season, 'Pick a season.'),
		url: v.message(SchemaBase.entries.url, 'Must be a valid URL.'),
	});

	let { rosterId, data }: Props = $props();

	let open = $state(false);

	const form = superForm(data, {
		validators: valibot(Schema),
		resetForm: false,
		// applyAction: 'never',
		onUpdated({ form }) {
			if (form.valid) {
				open = false;
				toast.success('Roster updated.');
			} else {
				toast.error('Failed to update roster.');
				console.debug(form);
			}
		},
	});
	const { form: formData, enhance } = form;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}>
		<PencilIcon />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Update Roster</Dialog.Title>
			<Dialog.Description>Update roster information then click submit.</Dialog.Description>
		</Dialog.Header>
		<form
			method="POST"
			action="{resolve('/(app)/(protected)/rosters/roster/[id]', { id: rosterId })}?/update"
			class="contents"
			use:enhance
		>
			<input name="id" type="hidden" bind:value={$formData.id} />
			<input name="school_id" type="hidden" bind:value={$formData.school_id} />
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
				<Button type="submit">Submit</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
