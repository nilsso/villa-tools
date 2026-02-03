<script lang="ts">
	import type { UserModel } from '$generated/prisma/models.js';
	import { DataTable } from '$lib/components/ui/data-table';
	import { createColumnHelper } from '@tanstack/table-core';
	import CreateUserDialog from './(components)/CreateUserDialog.svelte';

	const { data } = $props();

	type User = Omit<UserModel, 'password_hash'>;

	const columnHelper = createColumnHelper<User>();
	const columns = [
		columnHelper.accessor('email', {
			header: 'Email',
		}),
		columnHelper.accessor('group', {
			header: 'Group',
		}),
	];
</script>

<div class="space-y-6">
	<div class="flex items-start justify-between">
		<div class="space-y-1">
			<h1 class="text-2xl font-semibold">Users</h1>
			<p class="text-muted-foreground">User administration.</p>
		</div>
	</div>
	<div class="space-y-4">
		<div class="flex flex-row-reverse items-center">
			<CreateUserDialog data={data.createUserForm} />
		</div>
		<div class="rounded-md border">
			<DataTable {columns} rows={data.users} />
		</div>
	</div>
</div>
