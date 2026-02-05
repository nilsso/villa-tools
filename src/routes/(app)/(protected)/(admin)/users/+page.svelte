<script lang="ts">
	import { resolve } from '$app/paths';
	import InfoTooltip from '$lib/components/InfoTooltip.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group';
	import Button from '$lib/components/ui/button/button.svelte';
	import { DataTable, renderComponent, renderSnippet } from '$lib/components/ui/data-table';
	import YesNo from '$lib/components/YesNo.svelte';
	import type { User } from '$lib/server/auth.js';
	import { simpleOnUpdated } from '$lib/utils/superforms.svelte.js';
	import { ChevronRightIcon, KeyIcon, PencilIcon, StarIcon, TrashIcon } from '@lucide/svelte';
	import { createColumnHelper } from '@tanstack/table-core';
	import { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import ChangePasswordDialog from './(components)/ChangePasswordDialog.svelte';
	import CreateDialog from './(components)/CreateDialog.svelte';
	import DeleteDialog from './(components)/DeleteDialog.svelte';
	import UpdateDialog from './(components)/UpdateDialog.svelte';
	import { ChangePasswordSchema, DeleteSchema, ToggleResetSchema, UpdateSchema } from './schema';

	const { data } = $props();

	let updateOpen = $state(false);
	const updateForm = superForm(data.updateForm, {
		validators: valibotClient(UpdateSchema),
		dataType: 'json',
		onUpdated: simpleOnUpdated({
			success: 'User updated.',
			failure: 'Failed to update user.',
			onSuccess: () => (updateOpen = false),
		}),
	});
	const { form: updateData } = updateForm;
	function updateTrigger(user: User) {
		$updateData = {
			userId: user.id,
			data: user,
		};
		updateOpen = true;
	}

	let deleteOpen = $state(false);
	const deleteForm = superForm(data.deleteForm, {
		validators: valibotClient(DeleteSchema),
		onUpdated: simpleOnUpdated({
			success: 'User deleted.',
			failure: 'Failed to delete user.',
			onSuccess: () => (deleteOpen = false),
		}),
	});
	const { form: deleteData } = deleteForm;
	function deleteTrigger(user: User) {
		$deleteData = {
			userId: user.id,
		};
		deleteOpen = true;
	}

	let changePasswordOpen = $state(false);
	const changePasswordForm = superForm(data.changePasswordForm, {
		validators: valibotClient(ChangePasswordSchema),
		onUpdated: simpleOnUpdated({
			success: 'User password changed.',
			failure: 'Failed to change user password.',
			onSuccess: () => (changePasswordOpen = false),
		}),
	});
	const { form: changePasswordData } = changePasswordForm;
	function changePasswordTrigger(user: User) {
		$changePasswordData = {
			userId: user.id,
			password: '',
			passwordConfirm: '',
		};
		changePasswordOpen = true;
	}

	const toggleResetForm = superForm(data.toggleResetForm, {
		validators: valibotClient(ToggleResetSchema),
		onUpdated: simpleOnUpdated({
			success: ({ form }) =>
				form.data.password_reset
					? 'Flagged user for password reset.'
					: 'Cleared user password reset flag.',
			failure: 'Failed to update user password reset flag.',
		}),
	});
	const { enhance: toggleResetEnhance } = toggleResetForm;

	const columnHelper = createColumnHelper<User>();
	const columns = [
		columnHelper.display({
			id: 'marker',
			cell: ({ row }) => {
				if (row.original.id === data.user.id) {
					return renderComponent(ChevronRightIcon, { class: 'size-4 stroke-muted-foreground' });
				}
			},
			meta: {
				headerClass: 'w-0',
			},
		}),
		columnHelper.accessor('email', {
			header: 'Email',
			cell: ({ row }) => renderSnippet(DisplayEmail, { user: row.original }),
		}),
		columnHelper.accessor('group', {
			header: 'Group',
			meta: {
				cellClass: 'font-mono',
			},
		}),
		columnHelper.accessor('password_reset', {
			header: () => renderSnippet(ToggleResetHeader),
			cell: ({ row }) => renderSnippet(ToggleReset, { user: row.original }),
			enableSorting: false,
		}),
		columnHelper.display({
			id: 'controls',
			cell: ({ row }) => renderSnippet(UserControls, { user: row.original }),
			meta: {
				headerClass: 'w-0',
			},
		}),
	];
</script>

{#snippet DisplayEmail({ user }: { user: User })}
	<div class="flex items-center gap-2">
		{user.email}
		{#if user.super}
			<StarIcon class="size-4 stroke-yellow-500" />
		{/if}
	</div>
{/snippet}

{#snippet ToggleResetHeader()}
	Password Reset
	<InfoTooltip>
		The next time this user logs in they will
		<br />
		be required to change their password.
	</InfoTooltip>
{/snippet}

{#snippet ToggleReset({ user }: { user: User })}
	<form method="POST" action="{resolve('/users')}?/toggleReset" use:toggleResetEnhance>
		<input hidden name="userId" value={user.id} />
		<input hidden name="password_reset" value={!user.password_reset} />
		<Button type="submit" variant="outline" size="sm" class="w-full" disabled={user.super}>
			<YesNo value={user.password_reset} />
		</Button>
	</form>
{/snippet}

{#snippet UserControls({ user }: { user: User })}
	<ButtonGroup.Root>
		<Button variant="ghost" size="icon-sm" onclick={() => updateTrigger(user)}>
			<PencilIcon />
		</Button>
		<Button variant="ghost" size="icon-sm" onclick={() => changePasswordTrigger(user)}>
			<KeyIcon />
		</Button>
		<Button
			variant="ghost"
			size="icon-sm"
			onclick={() => deleteTrigger(user)}
			disabled={user.super || user.id === data.user.id}
		>
			<TrashIcon class="stroke-destructive!" />
		</Button>
	</ButtonGroup.Root>
{/snippet}

<div class="mx-auto max-w-xl space-y-6">
	<div class="flex items-start justify-between">
		<div class="space-y-1">
			<h1 class="text-2xl font-semibold">Users</h1>
			<p class="text-muted-foreground">User administration.</p>
		</div>
	</div>
	<div class="space-y-4">
		<div class="flex flex-row-reverse items-center">
			<CreateDialog data={data.createForm} />
		</div>
		<div class="rounded-md border">
			<DataTable {columns} rows={data.users} />
		</div>
	</div>
</div>
<UpdateDialog form={updateForm} bind:open={updateOpen} />
<DeleteDialog form={deleteForm} bind:open={deleteOpen} />
<ChangePasswordDialog form={changePasswordForm} bind:open={changePasswordOpen} />
