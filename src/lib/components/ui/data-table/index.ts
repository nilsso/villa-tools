import type { NotFunction } from '$lib/utils.js';
import type { Updater } from '@tanstack/table-core';

export { default as FlexRender } from './flex-render.svelte';
export { renderComponent, renderSnippet } from './render-helpers.js';
export { createSvelteTable } from './data-table.svelte.js';

// NOTE: The rest is custom

export { default as DataTable } from './data-table.svelte';

export function resolveUpdater<T extends NotFunction>(updater: Updater<T>, state: T): T {
	if (typeof updater === 'function') {
		return updater(state);
	} else {
		return updater;
	}
}
