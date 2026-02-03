<script lang="ts" module>
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table';
	import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from '@lucide/svelte';
	import type { ColumnDef } from '@tanstack/table-core';
	import { createSvelteTable, resolveUpdater, FlexRender } from '$lib/components/ui/data-table';
	import {
		getCoreRowModel,
		getFilteredRowModel,
		getSortedRowModel,
		type SortingState,
	} from '@tanstack/table-core';

	export type Props<T> = {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		columns: ColumnDef<T, any>[];
		rows: T[];
		//
		globalFilter?: string;
	};
</script>

<script lang="ts" generics="T">
	let {
		columns,
		rows,
		//
		globalFilter = $bindable(''),
	}: Props<T> = $props();

	let sorting: SortingState = $state([]);

	const table = createSvelteTable({
		get data() {
			return rows;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		state: {
			get globalFilter() {
				return globalFilter;
			},
			get sorting() {
				return sorting;
			},
		},
		onGlobalFilterChange: (updater) => (globalFilter = resolveUpdater(updater, globalFilter)),
		onSortingChange: (updater) => (sorting = resolveUpdater(updater, sorting)),
	});
</script>

<Table.Root>
	<Table.Header>
		{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
			<Table.Row>
				{#each headerGroup.headers as header (header.id)}
					{@const col = header.column}
					{@const def = col.columnDef}
					<Table.Head colspan={header.colSpan} class={def.meta?.headerClass}>
						{#if !header.isPlaceholder}
							{#if col.getCanSort()}
								<!-- {@const sortIndex = col.getSortIndex()} -->
								{@const isSorted = col.getIsSorted()}
								<Button variant="link" class="p-0!" onclick={col.getToggleSortingHandler()}>
									<FlexRender content={def.header} context={header.getContext()} />
									{#if !isSorted}
										<ArrowUpDownIcon class="text-accent" />
									{:else if isSorted === 'asc'}
										<ArrowUpIcon />
									{:else if isSorted === 'desc'}
										<ArrowDownIcon />
									{/if}
								</Button>
							{:else}
								<FlexRender content={def.header} context={header.getContext()} />
							{/if}
						{/if}
					</Table.Head>
				{/each}
			</Table.Row>
		{/each}
	</Table.Header>
	<Table.Body>
		{#each table.getRowModel().rows as row (row.id)}
			<Table.Row data-state={row.getIsSelected() && 'selected'}>
				{#each row.getVisibleCells() as cell (cell.id)}
					{@const col = cell.column}
					{@const def = col.columnDef}
					<Table.Cell class={def.meta?.cellClass}>
						<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
					</Table.Cell>
				{/each}
			</Table.Row>
		{:else}
			<Table.Row>
				<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
