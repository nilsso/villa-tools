/** Mark ends item type. */
export type MarkEnds<T> = {
	isFirst: boolean;
	isLast: boolean;
	value: T;
};

/** Augment an iterable with flags marking the first and last elements.
 *
 * @param iterable - The iterable to augment.
 * @returns Generator yielding objects with isFirst, isLast and value.
 */
export function* markEnds<T>(iterable: Iterable<T>): Generator<MarkEnds<T>> {
	const iterator = iterable[Symbol.iterator]();
	let first = true;
	let current = iterator.next();
	if (current.done) return;
	for (let next = iterator.next(); !next.done; next = iterator.next()) {
		yield { isFirst: first, isLast: false, value: current.value };
		first = false;
		current = next;
	}
	yield { isFirst: first, isLast: true, value: current.value };
}

/** Asynchronous equivalent to {T[].some}. */
export async function someAsync<T>(
	items: T[],
	predicate: (item: T) => Promise<boolean>
): Promise<boolean> {
	const promises = items.map(async (item, index) => {
		const result = await predicate(item);
		return { result, index };
	});
	for (const promise of promises) {
		const { result } = await promise;
		if (result) return true;
	}
	return false;
}
