<script lang="ts">
	import { Season } from '$generated/prisma/enums';
	import SeasonDisplay from '$lib/components/SeasonDisplay.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import type { SuperForm } from 'sveltekit-superforms';
	import { UpdateRosterSchema } from '../schema';

	type Props = {
		form: SuperForm<UpdateRosterSchema>;
		open?: boolean;
	};

	let { form, open = $bindable(false) }: Props = $props();
	const { form: formData, enhance } = form;

	$effect(() => {
		if (!open) {
			form.reset();
		}
	});
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
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create Roster</Dialog.Title>
			<Dialog.Description>Create a new roster for this school.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/updateRoster" class="contents" use:enhance>
			<input name="rosterId" type="hidden" bind:value={$formData.rosterId} />
			<Field.Group>
				<Field.Snap {form} name="data.name">
					{#snippet children({ props })}
						<Field.Label>Name</Field.Label>
						<Input {...props} bind:value={$formData.data.name} />
					{/snippet}
				</Field.Snap>
				<Field.Snap {form} name="data.year">
					{#snippet children({ props })}
						<Field.Label>Year</Field.Label>
						<Input {...props} type="number" min={1} bind:value={$formData.data.year} />
					{/snippet}
				</Field.Snap>
				<Field.Snap {form} name="data.season">
					{#snippet children({ props })}
						<Field.Label>Season/Semester</Field.Label>
						<RadioGroup.Root
							{...props}
							bind:value={$formData.data.season}
							class="grid grid-cols-2 gap-2"
						>
							{@render SeasonRadioItem('SPRING')}
							{@render SeasonRadioItem('SUMMER')}
							{@render SeasonRadioItem('FALL')}
							{@render SeasonRadioItem('WINTER')}
						</RadioGroup.Root>
					{/snippet}
				</Field.Snap>
				<Field.Snap {form} name="data.url">
					{#snippet children({ props })}
						<Field.Label>URL</Field.Label>
						<Input {...props} bind:value={$formData.data.url} />
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
