<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Field from '$lib/components/ui/field';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Snap from 'formsnap';
	import { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { LoginSchema } from './schema.js';
	import { toast } from 'svelte-sonner';

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
					<Field.Field>
						<Snap.Field {form} name="email">
							<Snap.Control>
								{#snippet children({ props })}
									<Field.Label>Email</Field.Label>
									<Input {...props} bind:value={$formData.email} />
								{/snippet}
							</Snap.Control>
							<Field.Error>
								<Snap.FieldErrors />
							</Field.Error>
						</Snap.Field>
					</Field.Field>
					<Field.Field>
						<Snap.Field {form} name="password">
							<Snap.Control>
								{#snippet children({ props })}
									<Field.Label>Password</Field.Label>
									<Input {...props} type="password" bind:value={$formData.password} />
								{/snippet}
							</Snap.Control>
							<Field.Error>
								<Snap.FieldErrors />
							</Field.Error>
						</Snap.Field>
					</Field.Field>
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
			<input hidden name="email" value="admin@example.net" />
			<input hidden name="password" value="password" />
			<Button type="submit" variant="secondary">As Admin</Button>
		</form>
		<form method="POST" class="contents">
			<input hidden name="email" value="moderator@example.net" />
			<input hidden name="password" value="password" />
			<Button type="submit" variant="secondary">As Moderator</Button>
		</form>
		<form method="POST" class="contents">
			<input hidden name="email" value="user@example.net" />
			<input hidden name="password" value="password" />
			<Button type="submit" variant="secondary">As User</Button>
		</form>
	</div>
</div>
