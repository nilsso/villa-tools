<script lang="ts" module>
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Season } from '$generated/prisma/enums';
	import type { RosterModel as Roster } from '$generated/prisma/models';
	import { Button } from '$lib/components/ui/button';
	import * as Empty from '$lib/components/ui/empty';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { ChevronLeftIcon, CircleSlashIcon, ExternalLinkIcon } from '@lucide/svelte/icons';
	import { createColumnHelper, type Row } from '@tanstack/table-core';
	import { sortBy } from 'es-toolkit';
	import CreateRosterDialog from './(components)/CreateRosterDialog.svelte';
	import DeleteSchoolDialog from './(components)/DeleteSchoolDialog.svelte';
	import UpdateSchoolDialog from './(components)/UpdateSchoolDialog.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group';

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

<script lang="ts">
	import DataTable from '$lib/components/ui/data-table/data-table.svelte';
	import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/render-helpers.js';
	import SeasonDisplay from '$lib/components/SeasonDisplay.svelte';
	import UpdateRosterDialog from './(components)/UpdateRosterDialog.svelte';
	import DeleteRosterDialog from './(components)/DeleteRosterDialog.svelte';

	const { data } = $props();

	const rows: Roster[] = $derived(
		sortBy(data.school.rosters, ['year', (roster) => SEASON_ORDERING[roster.season], 'name'])
	);

	const schoolId = $derived(page.params.id!);
</script>

{#snippet RosterUrl({ url }: { url: string })}
	<Button variant="link" href={url} target="_blank" rel="external" class="p-0!">
		{url}
		<ExternalLinkIcon />
	</Button>
{/snippet}

{#snippet RosterControlGroup({ roster: r }: { roster: Roster })}
	<ButtonGroup.Root>
		<UpdateRosterDialog rosterId={r.id} data={r} />
		<DeleteRosterDialog rosterId={r.id} />
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
		<div class="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
			<UpdateSchoolDialog {schoolId} data={data.updateSelfForm} />
			<DeleteSchoolDialog {schoolId} />
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
