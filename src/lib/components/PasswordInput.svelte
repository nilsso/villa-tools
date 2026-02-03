<script lang="ts" module>
	import * as InputGroup from '$lib/components/ui/input-group';
	import type { WithoutChildren } from '$lib/utils';
	import { EyeIcon } from '@lucide/svelte';
	import type { ComponentProps } from 'svelte';

	type InputProps = WithoutChildren<
		Omit<ComponentProps<typeof InputGroup.Input>, 'type' | 'files'>
	>;

	export type Props = InputProps & {
		value?: string;
		showPassword?: boolean;
	};
</script>

<script lang="ts">
	let {
		value = $bindable(''),
		showPassword = $bindable(false),
		class: className,
		...restProps
	}: Props = $props();
</script>

<InputGroup.Root class={className}>
	<InputGroup.Input {...restProps} bind:value type={showPassword ? 'text' : 'password'} />
	<InputGroup.Addon align="inline-end">
		<InputGroup.Button size="icon-xs" onclick={() => (showPassword = !showPassword)}>
			<EyeIcon class={{ 'stroke-blue-500': showPassword }} />
		</InputGroup.Button>
	</InputGroup.Addon>
</InputGroup.Root>
