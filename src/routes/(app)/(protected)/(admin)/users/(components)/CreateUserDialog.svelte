<script lang="ts">
	import { resolve } from '$app/paths';
	import { CreateUserSchema as SchemaBase } from '$generated/valibot';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { CirclePlusIcon } from '@lucide/svelte';
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
		name: v.message(SchemaBase.entries.email, 'Enter a valid email.'),
		group: v.message(SchemaBase.entries.group, 'Select a group.'),
	});

	const { data }: Props = $props();

	let open = $state(false);

	const form = superForm(data, {
		validators: valibotClient(Schema),
		onUpdated({ form }) {
			if (form.valid) {
				open = false;
				toast.success('User create.');
			} else {
				toast.error('Failed to create user.');
			}
		},
	});
	const { form: formData, enhance } = form;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants()}>
		<CirclePlusIcon />
		Create User
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create User</Dialog.Title>
			<Dialog.Description>Create a new user.</Dialog.Description>
		</Dialog.Header>
		<form
			method="POST"
			action="{resolve('/(app)/(protected)/(admin)/users')}?/createUser"
			class="contents"
			use:enhance
		>
			<Field.Group>
				<Snap.Field {form} name="email">
					<Field.Field>
						<Snap.Control>
							{#snippet children({ props })}
								<Field.Label>Email</Field.Label>
								<Input {...props} bind:value={$formData.email} placeholder="nils@example.net" />
							{/snippet}
						</Snap.Control>
						<Field.Error>
							<Snap.FieldErrors />
						</Field.Error>
					</Field.Field>
				</Snap.Field>
				<Snap.Field {form} name="group">
					<Field.Field>
						<Field.Label>Group</Field.Label>
						<Snap.Control>
							{#snippet children({ props })}
								<RadioGroup.Root
									{...props}
									bind:value={$formData.group}
									class="grid grid-cols-2 gap-2"
								>
									<Field.Label>
										<Field.Field orientation="horizontal">
											<Field.Content class="text-2xs!">
												<Field.Title>User</Field.Title>
											</Field.Content>
											<RadioGroup.Item value="USER" />
										</Field.Field>
									</Field.Label>
									<Field.Label>
										<Field.Field orientation="horizontal">
											<Field.Content class="text-2xs!">
												<Field.Title>Moderator</Field.Title>
											</Field.Content>
											<RadioGroup.Item value="MODERATOR" />
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
			</Field.Group>
			<Dialog.Footer>
				<Dialog.Close>Cancel</Dialog.Close>
				<Button type="submit">Create</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
