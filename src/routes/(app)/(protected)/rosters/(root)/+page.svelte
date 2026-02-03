<script lang="ts" module>
	import { resolve } from '$app/paths';
	import { Season } from '$generated/prisma/enums.js';
	import type { RosterModel as Roster, SchoolModel as School } from '$generated/prisma/models';
	import SeasonDisplay from '$lib/components/SeasonDisplay.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { DataTable, renderComponent, renderSnippet } from '$lib/components/ui/data-table';
	import Input from '$lib/components/ui/input/input.svelte';
	import { ChevronRightIcon, ExternalLinkIcon } from '@lucide/svelte';
	import { createColumnHelper, type Row } from '@tanstack/table-core';
	import { omit, sortBy } from 'es-toolkit';
	import CreateSchoolDialog from './(components)/CreateSchoolDialog.svelte';

	type TableData = {
		id: string;
		school: School;
		roster?: Roster;
	};

	function makeTableData(school: School, roster?: Roster): TableData {
		const id = roster != null ? `${school.id}-${roster.id}` : `${school.id}-none`;
		return { id, school, roster };
	}

	const SEASON_ORDERING: Record<Season, number> = {
		SPRING: 0,
		SUMMER: 1,
		FALL: 2,
		WINTER: 3,
	};

	function seasonOrdering(season: Season | undefined): number | undefined {
		if (season != null) return SEASON_ORDERING[season];
	}

	function seasonSortingFn(lhs: Row<TableData>, rhs: Row<TableData>) {
		const a = seasonOrdering(lhs.original.roster?.season);
		const b = seasonOrdering(rhs.original.roster?.season);
		if (a == null) return -1;
		if (b == null) return 1;
		return b - a;
	}

	const columnHelper = createColumnHelper<TableData>();
	const columns = [
		columnHelper.accessor('school.name', {
			header: 'School',
			cell: ({ row }) => renderSnippet(SchoolLink, { school: row.original.school }),
		}),
		columnHelper.accessor('roster.year', {
			header: 'Year',
			cell: ({ cell }) => renderOptionalSkeleton(cell.getValue()),
		}),
		columnHelper.accessor('roster.season', {
			header: 'Season',
			cell: ({ cell }) =>
				renderOptionalSkeleton(cell.getValue(), {
					fnSome: (season) => renderComponent(SeasonDisplay, { season }),
				}),
			sortingFn: seasonSortingFn,
		}),
		columnHelper.accessor('roster.name', {
			header: 'Roster',
			cell: ({ row }) => renderSnippet(RosterLink, { roster: row.original.roster }),
		}),
	];
</script>

<script lang="ts">
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { renderOptionalSkeleton } from '$lib/components/ui/data-table/render-helpers.js';

	const { data } = $props();

	const rows: TableData[] = $derived.by(() => {
		const rows = data.schools.flatMap((school) => {
			const s = omit(school, ['rosters']);
			return school.rosters.length > 0
				? school.rosters.map((r) => makeTableData(s, r))
				: [makeTableData(s)];
		});
		return sortBy(rows, [
			(row) => row.school.name,
			(row) => row.roster?.year,
			(row) => seasonOrdering(row.roster?.season),
			(row) => row.roster?.name,
		]);
	});

	let globalFilter = $state('');
</script>

{#snippet SchoolLink({ school }: { school: School })}
	{@const { id, name } = school}
	<Button
		variant="link"
		href={resolve('/(app)/(protected)/rosters/school/[id]', { id: id })}
		class="p-0!"
	>
		{name}
		<ChevronRightIcon />
	</Button>
{/snippet}

{#snippet RosterLink({ roster }: { roster: Roster | undefined })}
	{#if roster != null}
		{@const { name, url: href } = roster}
		<Button variant="link" {href} target="_blank" rel="external" class="p-0!">
			{name}
			<ExternalLinkIcon />
		</Button>
	{:else}
		<span class="text-muted-foreground"> No rosters </span>
	{/if}
{/snippet}

<div class="space-y-6">
	<div class="flex items-start justify-between">
		<div class="space-y-1">
			<h1 class="text-2xl font-semibold">Rosters</h1>
			<p class="text-muted-foreground">All schools and rosters.</p>
		</div>
	</div>
	<div class="space-y-4">
		<div class="flex items-center justify-between gap-4">
			<Input bind:value={globalFilter} placeholder="Filter" class="w-[15rem]" />
			<CreateSchoolDialog data={data.schoolForm} />
		</div>
		<div class=" rounded-md border">
			<DataTable {columns} {rows} bind:globalFilter />
		</div>
	</div>
</div>
