import { type PromiseOr, chunk } from "logos:core/utilities";
import * as Discord from "@discordeno/bot";

Array.prototype.toChunked = function <T>(this, size: number) {
	return Array.from<T[]>(chunk(this, size));
};

Object.mirror = <T extends Record<string, string>>(object: T) => {
	return Object.fromEntries(Object.entries(object).map(([key, value]) => [value, key])) as unknown as {
		[K in keyof T as T[K]]: K;
	};
};

Promise.createRace = async function* <T, R>(
	this,
	elements: T[],
	doAction: (element: T) => PromiseOr<R | undefined>,
): AsyncGenerator<{ element: T; result?: R }, void, void> {
	const promisesWithResolver = elements.map(() => Promise.withResolvers<{ element: T; result?: R }>());

	const resolvers = [...promisesWithResolver];
	for (const element of elements) {
		Promise.resolve(doAction(element)).then((result) => {
			const { resolve } = resolvers.shift()!;

			if (result === undefined) {
				resolve({ element });
			} else {
				resolve({ element, result });
			}
		});
	}

	for (const { promise } of promisesWithResolver) {
		yield promise;
	}
};

Promise.prototype.ignore = function (this): void {
	this.catch();
};

const globals = globalThis as any;
globals.Discord = Discord;
globals.constants = await import("./constants/constants.ts").then((module) => module.default);
