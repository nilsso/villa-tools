<script lang="ts">
	import { Season } from '$generated/prisma/enums';
	import SeasonDisplay from '$lib/components/SeasonDisplay.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { simpleOnUpdated } from '$lib/utils/superforms.svelte';
	import { CirclePlusIcon } from '@lucide/svelte/icons';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { CreateRosterSchema } from '../schema';

	type Props = {
		data: SuperValidated<CreateRosterSchema>;
	};

	const { data }: Props = $props();

	let open = $state(false);

	const form = superForm(data, {
		validators: valibotClient(CreateRosterSchema),
		resetForm: false,
		applyAction: 'never',
		onUpdated: simpleOnUpdated({
			success: 'Roster created.',
			failure: 'Failed to create roster.',
			onSuccess: () => (open = false),
		}),
	});
	const { form: formData, enhance } = form;
</script>

{#snippet SeasonRadioItem(value: Season)}
	<Field.Label>
		<Field.Field orientation="horizontal">
			<Field.Content class="text-2xs!">
				<Field.Title>
					<SeasonDisplay season={value} />
				</Field.Title>
			</Field.Content>
			<RadioGroup.Item {value} />
		</Field.Field>
	</Field.Label>
{/snippet}

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
		<form method="POST" action="?/createRoster" class="contents" use:enhance>
			<input name="school_id" type="hidden" bind:value={$formData.school_id} />
			<Field.Group>
				<Field.Snap {form} name="name">
					{#snippet children({ props })}
						<Field.Label>Name</Field.Label>
						<Input {...props} bind:value={$formData.name} />
					{/snippet}
				</Field.Snap>
				<Field.Snap {form} name="year">
					{#snippet children({ props })}
						<Field.Label>Year</Field.Label>
						<Input {...props} type="number" min={1} bind:value={$formData.year} />
					{/snippet}
				</Field.Snap>
				<Field.Snap {form} name="season">
					{#snippet children({ props })}
						<Field.Label>Season/Semester</Field.Label>
						<RadioGroup.Root
							{...props}
							bind:value={$formData.season}
							class="grid grid-cols-2 gap-2"
						>
							{@render SeasonRadioItem('SPRING')}
							{@render SeasonRadioItem('SUMMER')}
							{@render SeasonRadioItem('FALL')}
							{@render SeasonRadioItem('WINTER')}
						</RadioGroup.Root>
					{/snippet}
				</Field.Snap>
				<Field.Snap {form} name="url">
					{#snippet children({ props })}
						<Field.Label>URL</Field.Label>
						<Input {...props} bind:value={$formData.url} />
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
