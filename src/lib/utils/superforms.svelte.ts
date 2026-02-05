import { toast } from 'svelte-sonner';
import type { SuperValidated } from 'sveltekit-superforms';
import type { MaybePromise } from './_exported/typing';
import { trimEnd } from 'es-toolkit';

// ---------------------------------------------------------------------------------------------------------------------
// Type exports
// ---------------------------------------------------------------------------------------------------------------------

/** sveltekit-superforms form record (underlying data primitive). */
export type FormRecord = Record<string, unknown>;

/** sveltekit-superforms return form. */
export type ReturnForm<
	T extends FormRecord = FormRecord,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	M = any,
	In extends FormRecord = T,
> = Readonly<SuperValidated<T, M, In>>;

// ON UPDATED

/** sveltekit-superforms onUpdated event. */
export type OnUpdatedEvent<
	T extends FormRecord = FormRecord,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	M = any,
	In extends FormRecord = T,
> = { form: ReturnForm<T, M, In> };

/** sveltekit-superforms onUpdated handler. */
export type OnUpdatedHandler<
	T extends FormRecord = FormRecord,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	M = any,
	In extends FormRecord = T,
> = (event: OnUpdatedEvent<T, M, In>) => MaybePromise<unknown | void>;

// ---------------------------------------------------------------------------------------------------------------------
// Simple onUpdated
// ---------------------------------------------------------------------------------------------------------------------

/** Simple onUpdated success/failure message argument. */
export type OnUpdatedMessageArg<
	T extends FormRecord = FormRecord,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	M = any,
	In extends FormRecord = T,
> = string | ((event: OnUpdatedEvent<T, M, In>) => string);

/** Simple onUpdated options. */
export type OnUpdatedHandlerOpts<
	T extends FormRecord = FormRecord,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	M = any,
	In extends FormRecord = T,
> = {
	success?: OnUpdatedMessageArg<T, M, In>;
	failure?: OnUpdatedMessageArg<T, M, In>;
	onSuccess?: () => void;
};

/** Make a sveltekit-superforms simple onUpdated handler.
 *
 * @param success - Success message or message function.
 * @param failure - Failure message or message function.
 * @param onSuccess - Success callback.
 */
export function simpleOnUpdated<
	T extends FormRecord = FormRecord,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	M = any,
	In extends FormRecord = T,
>({ success, failure, onSuccess }: OnUpdatedHandlerOpts<T, M, In>): OnUpdatedHandler<T, M, In> {
	return (event) => {
		if (event.form.valid) {
			const message = resolveMessageArg(event, success, 'Success.');
			toast.success(message);
			onSuccess?.();
		} else {
			const message = resolveMessageArg(event, failure, 'Failure.');
			toast.error(message);
		}
	};
}

function resolveMessageArg<
	T extends FormRecord = FormRecord,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	M = any,
	In extends FormRecord = T,
>(
	event: OnUpdatedEvent<T, M, In>,
	arg: OnUpdatedMessageArg<T, M, In> | undefined,
	fallback: string
): string {
	const msg = arg != null ? (typeof arg === 'string' ? arg : arg(event)) : fallback;
	return event.form.message ? `${trimEnd(msg, '.')}: ${event.form.message}` : msg;
}
