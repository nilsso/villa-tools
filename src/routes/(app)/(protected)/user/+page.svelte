<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import ChangePasswordDialog from './(components)/ChangePasswordDialog.svelte';
	import UpdateUserDialog from './(components)/UpdateUserDialog.svelte';

	const { data } = $props();
	const user = $derived(data.user);
</script>

<div class="mx-auto max-w-md space-y-6">
	<div class="flex justify-between gap-4">
		<div class="space-y-1">
			<h1 class="text-2xl font-semibold">User</h1>
			<p class="text-muted-foreground">User information.</p>
		</div>
		<UpdateUserDialog data={data.updateUserForm} />
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
	<div class="space-y-1">
		<h2 class=" text-xl font-semibold">Actions</h2>
		<p class="text-muted-foreground">Additional user actions.</p>
	</div>
	<div class="grid gap-2">
		<ChangePasswordDialog data={data.changePasswordForm} />
	</div>
</div>
