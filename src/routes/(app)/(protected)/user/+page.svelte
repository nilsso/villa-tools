<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table';

	const { data } = $props();
	const user = $derived(data.user);
</script>

<div class="space-y-8">
	<div class="mx-auto grid max-w-xl flex-col gap-6 md:grid-cols-2">
		<div class="space-y-4">
			<div class="space-y-1">
				<h1 class="text-2xl font-semibold">User</h1>
				<p class="text-muted-foreground">User information.</p>
			</div>
			<Table.Root>
				<Table.Body>
					<Table.Row>
						<Table.Cell>Email</Table.Cell>
						<Table.Cell class="font-mono">{user.email}</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Group</Table.Cell>
						<Table.Cell class="font-mono">{user.group}</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</div>
		<div class="flex flex-col items-stretch gap-4">
			<h2 class=" text-xl font-semibold">Actions</h2>
			<Button href="/user/reset-password">Reset Password</Button>
		</div>
	</div>
</div>
