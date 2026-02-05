<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { TriangleAlertIcon } from '@lucide/svelte';
	import ResetPasswordForm from '../(components)/ResetPasswordForm.svelte';

	const { data } = $props();
	const id = $props.id();
</script>

<div class="flex flex-col items-center gap-6">
	<Alert.Root class="w-fit">
		<TriangleAlertIcon />
		<Alert.Title>Password Reset Required</Alert.Title>
		<Alert.Description>
			Administrators have required that you reset your password.
		</Alert.Description>
	</Alert.Root>
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title>Reset Password</Card.Title>
			<Card.Description>Reset your user password.</Card.Description>
		</Card.Header>
		<Card.Content>
			<ResetPasswordForm data={data.form} onSuccess={() => goto(resolve('/'))} id="{id}-form" />
		</Card.Content>
		<Card.Footer class="justify-end">
			<Button type="submit" form="{id}-form">Submit</Button>
		</Card.Footer>
	</Card.Root>
</div>
