import type { Session } from '$lib/auth';
import type { Phantom } from '$lib/utils';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: Session | null;
		}
		interface PageData {
			flash?: { type: 'success' | 'error'; message: string };
		}
		// interface PageState {}
		// interface Platform {}
	}
}

// See
// - <https://tanstack.com/table/latest/docs/api/core/table#meta>
// - <https://tanstack.com/table/latest/docs/api/core/column-def#meta>
declare module '@tanstack/table-core' {
	// interface TableMeta<TData extends RowData> {
	//   foo: string
	// }
	interface ColumnMeta<TData extends RowData, TValue> extends Phantom<TData | TValue> {
		headerClass?: string;
		cellClass?: string;
	}
}

export {};
