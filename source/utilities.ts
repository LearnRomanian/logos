type WithRequired<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & Required<Pick<T, K>>;
type PromiseOr<T> = T | Promise<T>;

function* chunk<T>(array: T[], size: number): Generator<T[], void, void> {
	if (array.length === 0) {
		yield [];
		return;
	}

	if (size === 0) {
		throw new Error("The size of a chunk cannot be zero.");
	}

	const chunks = array.length <= size ? 1 : Math.ceil(array.length / size);
	for (const index of new Array(chunks).keys()) {
		const start = index * size;
		const end = start + size;
		yield array.slice(start, end);
	}
}

function isDefined<T>(element: T | undefined): element is T {
	return element !== undefined;
}

export { chunk, isDefined };
export type { WithRequired, PromiseOr };
