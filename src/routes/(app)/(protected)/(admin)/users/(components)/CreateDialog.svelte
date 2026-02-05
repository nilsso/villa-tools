<script lang="ts">
	import { resolve } from '$app/paths';
	import { CreateUserSchema, UserGroup } from '$lib/auth';
	import PasswordInput from '$lib/components/PasswordInput.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { CirclePlusIcon } from '@lucide/svelte';
	import { upperFirst } from 'es-toolkit';
	import { toast } from 'svelte-sonner';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';

	type Props = {
		data: SuperValidated<CreateUserSchema>;
	};

	const { data }: Props = $props();
	const id = $props.id();

	let open = $state(false);

	const form = superForm(data, {
		validators: valibotClient(CreateUserSchema),
		onUpdated({ form }) {
			if (form.valid) {
				open = false;
				toast.success('User created.');
			} else {
				toast.error('Failed to create user.');
			}
		},
	});
	const { form: formData, enhance } = form;
</script>

{#snippet UserGroupRadioItem(value: UserGroup)}
	<Field.Label>
		<Field.Field orientation="horizontal">
			<Field.Content class="text-2xs!">
				<Field.Title>{upperFirst(value)}</Field.Title>
			</Field.Content>
			<RadioGroup.Item {value} />
		</Field.Field>
	</Field.Label>
{/snippet}

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
		<form method="POST" action="{resolve('/users')}?/create" class="contents" use:enhance>
			<Field.Group>
				<Field.Snap {form} name="email">
					{#snippet children({ props })}
						<Field.Label>Email</Field.Label>
						<Input
							{...props}
							type="email"
							bind:value={$formData.email}
							placeholder="nils@villa.net"
						/>
					{/snippet}
				</Field.Snap>
				<Field.Snap {form} name="group">
					{#snippet children({ props })}
						<Field.Label>Group</Field.Label>
						<RadioGroup.Root {...props} bind:value={$formData.group} class="grid grid-cols-3 gap-2">
							{@render UserGroupRadioItem('USER')}
							{@render UserGroupRadioItem('MODERATOR')}
							{@render UserGroupRadioItem('ADMIN')}
						</RadioGroup.Root>
					{/snippet}
				</Field.Snap>
				<Field.Snap {form} name="password">
					{#snippet children({ props })}
						<Field.Label>Password</Field.Label>
						<PasswordInput {...props} bind:value={$formData.password} showPassword />
					{/snippet}
				</Field.Snap>
				<Field.Snap {form} name="requireReset" orientation="horizontal">
					{#snippet children({ props })}
						<Checkbox {...props} id="{id}-password-reset" bind:checked={$formData.requireReset} />
						<Field.Label for="{id}-password-reset" class="font-normal">
							Require password reset?
						</Field.Label>
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
