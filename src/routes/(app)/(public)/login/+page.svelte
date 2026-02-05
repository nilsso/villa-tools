<script>
	import PasswordInput from '$lib/components/PasswordInput.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Field from '$lib/components/ui/field';
	import Input from '$lib/components/ui/input/input.svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { LoginSchema } from './schema.js';

	const { data } = $props();

	const form = superForm(data.form, {
		validators: valibotClient(LoginSchema),
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Login successful.');
			} else {
				toast.error('Failed to login.');
			}
		},
	});
	const { form: formData, enhance, message } = form;
</script>

<div class="grid gap-4">
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">Login</Card.Title>
			<Card.Description>Login with your email and password below.</Card.Description>
		</Card.Header>
		<form method="POST" use:enhance class="contents">
			<Card.Content>
				<Field.Group>
					<Field.Snap {form} name="email">
						{#snippet children({ props })}
							<Field.Label>Email</Field.Label>
							<Input {...props} type="email" bind:value={$formData.email} />
						{/snippet}
					</Field.Snap>
					<Field.Snap {form} name="password">
						{#snippet children({ props })}
							<Field.Label>Password</Field.Label>
							<PasswordInput {...props} bind:value={$formData.password} />
						{/snippet}
					</Field.Snap>
					{#if $message}
						<Field.Error>{$message}</Field.Error>
					{/if}
				</Field.Group>
			</Card.Content>
			<Card.Footer>
				<Button type="submit" class="flex-1">Login</Button>
			</Card.Footer>
		</form>
	</Card.Root>
	<div class="xs:grid-cols-3 mx-auto grid w-full max-w-sm gap-4">
		<form method="POST" class="contents">
			<input hidden name="email" value="admin@villa.net" />
			<input hidden name="password" value="password" />
			<Button type="submit" variant="secondary">As Admin</Button>
		</form>
		<form method="POST" class="contents">
			<input hidden name="email" value="moderator@villa.net" />
			<input hidden name="password" value="password" />
			<Button type="submit" variant="secondary">As Moderator</Button>
		</form>
		<form method="POST" class="contents">
			<input hidden name="email" value="user@villa.net" />
			<input hidden name="password" value="password" />
			<Button type="submit" variant="secondary">As User</Button>
		</form>
	</div>
</div>
