<script lang="ts" module>
	import {
		Control as SnapControl,
		FieldErrors as SnapErrors,
		Field as SnapField,
		type ControlAttrs,
	} from 'formsnap';
	import type { Snippet } from 'svelte';
	import type { FormPath, SuperForm } from 'sveltekit-superforms';
	import FieldError from './field-error.svelte';
	import Field, { type FieldOrientation } from './field.svelte';

	export type Props<T extends Record<string, unknown>> = {
		form: SuperForm<T>;
		name: FormPath<T>;
		children?: Snippet<[{ props: ControlAttrs }]>;
		orientation?: FieldOrientation;
	};
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	const { form, name, children, orientation }: Props<T> = $props();
</script>

<SnapField {form} {name}>
	<Field {orientation}>
		<SnapControl {children} />
		<FieldError>
			<SnapErrors />
		</FieldError>
	</Field>
</SnapField>
