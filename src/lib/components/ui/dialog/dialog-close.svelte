<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		type = 'button',
		...restProps
	}: DialogPrimitive.CloseProps = $props();
</script>

<DialogPrimitive.Close
	bind:ref
	data-slot="dialog-close"
	class={cn(buttonVariants({ variant: 'outline' }), className)}
	{type}
	{...restProps}
/>
