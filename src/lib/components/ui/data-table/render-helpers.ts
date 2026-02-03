import { cn, type Nullish } from '$lib/utils';
import type { Component, ComponentProps, Snippet } from 'svelte';
import { type SkeletonProps } from '../optional/_skeleton.svelte';
import { Skeleton } from '../skeleton';

/**
 * A helper class to make it easy to identify Svelte components in
 * `columnDef.cell` and `columnDef.header` properties.
 *
 * > NOTE: This class should only be used internally by the adapter. If you're
 * reading this and you don't know what this is for, you probably don't need it.
 *
 * @example
 * ```svelte
 * {@const result = content(context as any)}
 * {#if result instanceof RenderComponentConfig}
 *   {@const { component: Component, props } = result}
 *   <Component {...props} />
 * {/if}
 * ```
 */
export class RenderComponentConfig<TComponent extends Component> {
	component: TComponent;
	props: ComponentProps<TComponent> | Record<string, never>;
	constructor(
		component: TComponent,
		props: ComponentProps<TComponent> | Record<string, never> = {}
	) {
		this.component = component;
		this.props = props;
	}
}

/**
 * A helper class to make it easy to identify Svelte Snippets in `columnDef.cell` and `columnDef.header` properties.
 *
 * > NOTE: This class should only be used internally by the adapter. If you're
 * reading this and you don't know what this is for, you probably don't need it.
 *
 * @example
 * ```svelte
 * {@const result = content(context as any)}
 * {#if result instanceof RenderSnippetConfig}
 *   {@const { snippet, params } = result}
 *   {@render snippet(params)}
 * {/if}
 * ```
 */
export class RenderSnippetConfig<TProps> {
	snippet: Snippet<[TProps]>;
	params: TProps;
	constructor(snippet: Snippet<[TProps]>, params: TProps) {
		this.snippet = snippet;
		this.params = params;
	}
}

/**
 * A helper function to help create cells from Svelte components through ColumnDef's `cell` and `header` properties.
 *
 * This is only to be used with Svelte Components - use `renderSnippet` for Svelte Snippets.
 *
 * @param component A Svelte component
 * @param props The props to pass to `component`
 * @returns A `RenderComponentConfig` object that helps svelte-table know how to render the header/cell component.
 * @example
 * ```ts
 * // +page.svelte
 * const defaultColumns = [
 *   columnHelper.accessor('name', {
 *     header: header => renderComponent(SortHeader, { label: 'Name', header }),
 *   }),
 *   columnHelper.accessor('state', {
 *     header: header => renderComponent(SortHeader, { label: 'State', header }),
 *   }),
 * ]
 * ```
 * @see {@link https://tanstack.com/table/latest/docs/guide/column-defs}
 */
export function renderComponent<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends Component<any>,
	Props extends ComponentProps<T>,
>(component: T, props: Props = {} as Props) {
	return new RenderComponentConfig(component, props);
}

/**
 * A helper function to help create cells from Svelte Snippets through ColumnDef's `cell` and `header` properties.
 *
 * The snippet must only take one parameter.
 *
 * This is only to be used with Snippets - use `renderComponent` for Svelte Components.
 *
 * @param snippet
 * @param params
 * @returns - A `RenderSnippetConfig` object that helps svelte-table know how to render the header/cell snippet.
 * @example
 * ```ts
 * // +page.svelte
 * const defaultColumns = [
 *   columnHelper.accessor('name', {
 *     cell: cell => renderSnippet(nameSnippet, { name: cell.row.name }),
 *   }),
 *   columnHelper.accessor('state', {
 *     cell: cell => renderSnippet(stateSnippet, { state: cell.row.state }),
 *   }),
 * ]
 * ```
 * @see {@link https://tanstack.com/table/latest/docs/guide/column-defs}
 */
export function renderSnippet<TProps>(snippet: Snippet<[TProps]>, params: TProps = {} as TProps) {
	return new RenderSnippetConfig(snippet, params);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RenderConfig = RenderComponentConfig<any> | RenderSnippetConfig<any>;

export type RenderOptionalOpts<V> = {
	fnSome: (value: V) => RenderConfig;
	fnNull: () => RenderConfig;
};

export function renderOptional<V>(
	value: Nullish<V>,
	opts?: Partial<RenderOptionalOpts<V>>
): RenderConfig | V | undefined {
	if (value != null) {
		if (opts?.fnSome) {
			return opts.fnSome(value);
		} else {
			return value;
		}
	} else {
		if (opts?.fnNull) {
			return opts.fnNull();
		}
	}
}

export type RenderOptionalSkeletonOpts<V> = {
	fnSome: (value: V) => RenderConfig;
	skeletonProps?: Partial<SkeletonProps>;
};

export function renderOptionalSkeleton<V>(
	value: Nullish<V>,
	opts?: Partial<RenderOptionalSkeletonOpts<V>>
): RenderConfig | V | undefined {
	const skeletonProps = {
		...opts?.skeletonProps,
		class: cn('h-3', opts?.skeletonProps?.class),
	};
	return renderOptional(value, {
		...opts,
		fnNull: () => {
			return renderComponent(Skeleton, skeletonProps);
		},
	});
}
