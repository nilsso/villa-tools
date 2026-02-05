<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Season } from '$generated/prisma/enums';
	import type { RosterModel as Roster } from '$generated/prisma/models';
	import SeasonDisplay from '$lib/components/SeasonDisplay.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as ButtonGroup from '$lib/components/ui/button-group';
	import DataTable from '$lib/components/ui/data-table/data-table.svelte';
	import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/render-helpers.js';
	import * as Empty from '$lib/components/ui/empty';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { simpleOnUpdated } from '$lib/utils/superforms.svelte';
	import {
		ChevronLeftIcon,
		CircleSlashIcon,
		ExternalLinkIcon,
		PencilIcon,
		TrashIcon,
	} from '@lucide/svelte/icons';
	import { createColumnHelper, type Row } from '@tanstack/table-core';
	import { sortBy } from 'es-toolkit';
	import { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import CreateRosterDialog from './(components)/CreateRosterDialog.svelte';
	import DeleteRosterDialog from './(components)/DeleteRosterDialog.svelte';
	import DeleteSchoolDialog from './(components)/DeleteSchoolDialog.svelte';
	import UpdateRosterDialog from './(components)/UpdateRosterDialog.svelte';
	import UpdateSchoolDialog from './(components)/UpdateSchoolDialog.svelte';
	import { DeleteRosterSchema, UpdateRosterSchema } from './schema';

	const { data } = $props();

	let updateRosterOpen = $state(false);
	const updateRosterForm = superForm(data.updateRosterForm, {
		validators: valibotClient(UpdateRosterSchema),
		dataType: 'json',
		onUpdated: simpleOnUpdated({
			success: 'Roster updated.',
			failure: 'Failed to update roster.',
			onSuccess: () => (updateRosterOpen = false),
		}),
	});
	const { form: updateRosterData } = updateRosterForm;
	function updateRosterTrigger(roster: Roster) {
		$updateRosterData = {
			rosterId: roster.id,
			data: roster,
		};
		updateRosterOpen = true;
	}

	let deleteRosterOpen = $state(false);
	const deleteRosterForm = superForm(data.deleteRosterForm, {
		validators: valibotClient(DeleteRosterSchema),
		onUpdated: simpleOnUpdated({
			success: 'Roster deleted.',
			failure: 'Failed to delete roster.',
			onSuccess: () => (deleteRosterOpen = false),
		}),
	});
	const { form: deleteRosterData } = deleteRosterForm;
	function deleteRosterTrigger(roster: Roster) {
		$deleteRosterData = {
			rosterId: roster.id,
		};
		deleteRosterOpen = true;
	}

	const SEASON_ORDERING: Record<Season, number> = {
		SPRING: 0,
		SUMMER: 1,
		FALL: 2,
		WINTER: 3,
	};

	function seasonSortingFn(lhs: Row<Roster>, rhs: Row<Roster>) {
		const a = SEASON_ORDERING[lhs.original.season];
		const b = SEASON_ORDERING[rhs.original.season];
		return b - a;
	}

	const rows: Roster[] = $derived(
		sortBy(data.school.rosters, ['year', (roster) => SEASON_ORDERING[roster.season], 'name'])
	);

	const columnHelper = createColumnHelper<Roster>();
	const columns = [
		columnHelper.accessor('year', {
			header: 'Year',
			// cell
		}),
		columnHelper.accessor('season', {
			header: 'Season',
			cell: ({ cell }) => renderComponent(SeasonDisplay, { season: cell.getValue() }),
			sortingFn: seasonSortingFn,
		}),
		columnHelper.accessor('name', {
			header: 'Name',
			// cell
		}),
		columnHelper.accessor('url', {
			header: 'URL',
			enableSorting: false,
			cell: ({ cell }) => renderSnippet(RosterUrl, { url: cell.getValue() }),
		}),
		columnHelper.display({
			id: 'controls',
			cell: ({ row }) => renderSnippet(RosterControlGroup, { roster: row.original }),
			meta: {
				headerClass: 'w-0',
			},
		}),
	];
</script>

{#snippet RosterUrl({ url }: { url: string })}
	<Button variant="link" href={url} target="_blank" rel="external" class="p-0!">
		{url}
		<ExternalLinkIcon />
	</Button>
{/snippet}

{#snippet RosterControlGroup({ roster }: { roster: Roster })}
	<ButtonGroup.Root>
		<Button variant="ghost" size="icon-sm" onclick={() => updateRosterTrigger(roster)}>
			<PencilIcon />
		</Button>
		<Button variant="ghost" size="icon-sm" onclick={() => deleteRosterTrigger(roster)}>
			<TrashIcon class="stroke-destructive" />
		</Button>
	</ButtonGroup.Root>
{/snippet}

<div class="space-y-6">
	<Button variant="outline" href={resolve('/(app)/(protected)/rosters')}>
		<ChevronLeftIcon />
		Return
	</Button>
	<div class="flex items-start justify-between gap-4">
		<div class="space-y-1">
			<h1 class="text-2xl font-semibold">{data.school.name}</h1>
			<p class="text-muted-foreground">School</p>
		</div>
		<div class="flex flex-col items-stretch gap-2 sm:flex-row md:items-center">
			<UpdateSchoolDialog data={data.updateSchoolForm} />
			<DeleteSchoolDialog />
		</div>
	</div>
	<Separator />
	<div class="flex items-start justify-between gap-4">
		<div class="space-y-1">
			<h2 class="text-lg font-medium">Rosters</h2>
			<p class="text-muted-foreground text-sm">Add, edit or delete rosters for this school.</p>
		</div>
		<CreateRosterDialog data={data.createRosterForm} />
	</div>
	<div class="rounded-md border">
		{#if !data.school.rosters.length}
			<Empty.Root>
				<Empty.Header>
					<Empty.Media variant="icon">
						<CircleSlashIcon />
					</Empty.Media>
					<Empty.Title>No Rosters</Empty.Title>
					<Empty.Description>No rosters have been added to this school.</Empty.Description>
				</Empty.Header>
			</Empty.Root>
		{:else}
			<DataTable {columns} {rows} />
		{/if}
	</div>
</div>
<UpdateRosterDialog form={updateRosterForm} bind:open={updateRosterOpen} />
<DeleteRosterDialog form={deleteRosterForm} bind:open={deleteRosterOpen} />
