<script lang="ts" module>
	import { cn, type WithoutChild } from '$lib/utils';
	import type { ComponentProps } from 'svelte';
	import Badge from '../badge/badge.svelte';
	import { match } from 'ts-pattern';

	export type Position = 'top' | 'middle' | 'bottom';
	export type Placement = 'start' | 'center' | 'end';
	export type Anchor = `${Position}-${Placement}`;

	// NOTE: largely based on <https://mantine.dev/core/indicator>

	const EFFECTS: Record<string, string> = {
		ping: 'animate-ping',
	};

	export type Effect = keyof typeof EFFECTS;

	export type Props = WithoutChild<ComponentProps<typeof Badge>> & {
		label?: string;
		effect?: Effect;
		anchor?: Anchor;
		offset?: number | { x?: number; y?: number };
		show?: boolean;
	};

	type AnchorVariable =
		| '--indicator-top'
		| '--indicator-bottom'
		| '--indicator-left'
		| '--indicator-right'
		| '--indicator-translate-x'
		| '--indicator-translate-y'
		| '--indicator-offset-x'
		| '--indicator-offset-y';

	type AnchorVariables = Partial<Record<AnchorVariable, string>>;

	function makeVariables(anchor: Anchor, offsetX: number, offsetY: number): AnchorVariables {
		const variables: AnchorVariables = {
			'--indicator-offset-x': offsetX.toString(),
			'--indicator-offset-y': offsetY.toString(),
		};

		const [position, placement] = anchor.split('-') as [Position, Placement];
		const offsetXRule = 'calc(var(--spacing) * var(--indicator-offset-x))';
		const offsetYRule = 'calc(var(--spacing) * var(--indicator-offset-y))';

		// TODO: inside/outside/edge

		// Position (top/middle/bottom)
		match(position)
			.with('top', () => {
				// x-x-x
				// o o o
				// o-o-o
				variables['--indicator-top'] = offsetYRule;
				variables['--indicator-translate-y'] = '-50%';
			})
			.with('middle', () => {
				// o-o-o
				// x x x
				// o-o-o
				variables['--indicator-top'] = '50%';
				variables['--indicator-translate-y'] = '-50%';
			})
			.with('bottom', () => {
				// o-o-o
				// o o o
				// x-x-x
				variables['--indicator-bottom'] = offsetYRule;
				variables['--indicator-translate-y'] = '50%';
			})
			.exhaustive();

		// Placement (start/center/end)
		match(placement)
			.with('start', () => {
				// x-o-o
				// x o o
				// x-o-o
				variables['--indicator-left'] = offsetXRule;
				variables['--indicator-translate-x'] = '-50%';
			})
			.with('center', () => {
				// o-x-o
				// o x o
				// o-x-o
				variables['--indicator-left'] = '50%';
				variables['--indicator-translate-x'] = '-50%';
			})
			.with('end', () => {
				// o-o-x
				// o o x
				// o-o-x
				variables['--indicator-right'] = offsetXRule;
				variables['--indicator-translate-x'] = '50%';
			})
			.exhaustive();

		return variables;
	}
</script>

<script lang="ts">
	const {
		label,
		anchor = 'top-end',
		offset = 0,
		show = true,
		effect,
		variant,
		class: className,
		children,
		...restProps
	}: Props = $props();

	const { offsetX, offsetY } = $derived(
		typeof offset === 'number'
			? { offsetX: offset, offsetY: offset }
			: { offsetX: offset.x ?? 0, offsetY: offset.y ?? 0 }
	);
	const variables = $derived(makeVariables(anchor, offsetX, offsetY));
	const style = $derived(
		Object.entries(variables)
			.map(([k, v]) => `${k}:${v}`)
			.join(';')
	);

	const effectClass = $derived(effect ? EFFECTS[effect] : undefined);
</script>

<div class="relative w-fit overflow-visible">
	{#if show}
		<div
			class={cn(
				'absolute top-0 right-0 flex translate-x-1/2',
				'top-(--indicator-top)',
				'bottom-(--indicator-bottom)',
				'left-(--indicator-left)',
				'right-(--indicator-right)',
				'translate-x-(--indicator-translate-x)',
				'translate-y-(--indicator-translate-y)'
			)}
			{style}
		>
			<Badge
				{...restProps}
				class={cn(
					[
						'relative',
						'min-w-[.5rem]',
						'min-h-[.5rem]',
						'p-[.125rem]',
						'rounded-full',
						'bg-red-500',
						'text-[.5rem]',
						'leading-none',
					],
					className
				)}
				{variant}
			>
				{label}
			</Badge>
			{#if effect}
				<Badge
					class={cn('absolute inset-0 w-auto rounded-full p-0', effectClass, className)}
					{variant}
				/>
			{/if}
		</div>
	{/if}
	{@render children?.()}
</div>
