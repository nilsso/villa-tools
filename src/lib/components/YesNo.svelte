<script lang="ts" module>
	import { cn, type WithoutChildrenOrChild } from '$lib/utils';
	import { CheckIcon, XIcon, type IconProps } from '@lucide/svelte';
	import { merge } from 'es-toolkit';
	import type { SvelteHTMLElements } from 'svelte/elements';

	export interface SnippetProps extends IconProps {
		label: string;
	}

	export type Options = {
		label: string;
		iconProps?: Partial<IconProps>;
	};

	export type Props = WithoutChildrenOrChild<SvelteHTMLElements['div']> & {
		value: boolean;
		trueOpts?: Partial<Options>;
		falseOpts?: Partial<Options>;
	};

	export const DEFAULT_TRUE_OPTS: Options = {
		label: 'Yes',
		iconProps: {
			class: 'stroke-green-500',
		},
	};

	export const DEFAULT_FALSE_OPTS: Options = {
		label: 'No',
		iconProps: {
			class: 'stroke-red-500',
		},
	};
</script>

<script lang="ts">
	const {
		value,
		class: className,
		trueOpts: trueOptsProp,
		falseOpts: falseOptsProp,
		...restProps
	}: Props = $props();

	const trueOpts: Options = $derived(merge(DEFAULT_TRUE_OPTS, trueOptsProp ?? {}));
	const falseOpts: Options = $derived(merge(DEFAULT_FALSE_OPTS, falseOptsProp ?? {}));

	const { label, iconProps } = $derived(value ? trueOpts : falseOpts);
	const Icon = $derived(value ? CheckIcon : XIcon);
</script>

<div {...restProps} class={cn('flex items-center gap-2', className)}>
	<Icon {...iconProps} />
	{label}
</div>
