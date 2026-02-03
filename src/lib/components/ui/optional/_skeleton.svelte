<script lang="ts" module>
	import { cn, type Nullish } from '$lib/utils';
	import type { ComponentProps, Snippet } from 'svelte';
	import Skeleton from '../skeleton/skeleton.svelte';
	import OptionalBase from './_base.svelte';
	import { merge } from 'es-toolkit';

	export type SkeletonProps = Omit<ComponentProps<typeof Skeleton>, 'value' | 'children'>;

	export type Props<T> = {
		value: Nullish<T>;
		children?: Snippet<[T]>;
		skeletonProps?: Partial<SkeletonProps>;
	};
</script>

<script lang="ts" generics="T">
	const { value, children, skeletonProps }: Props<T> = $props();
	const { class: className, ...restProps } = merge(skeletonProps ?? {}, {});
</script>

<OptionalBase {value} {children}>
	{#snippet fallback()}
		<Skeleton class={cn('h-4 min-w-16', className)} {...restProps} />
	{/snippet}
</OptionalBase>
