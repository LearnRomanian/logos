import type { Collection } from "logos:constants/database";
import type { Environment } from "logos:core/loaders/environment";
import type { PromiseOr } from "logos:core/utilities";
import type { DatabaseAdapter, DocumentSession } from "logos/adapters/databases/adapter";
import { CouchDBAdapter } from "logos/adapters/databases/couchdb/database";
import { InMemoryAdapter } from "logos/adapters/databases/in-memory/database";
import { MongoDBAdapter } from "logos/adapters/databases/mongodb/database";
import { RavenDBAdapter } from "logos/adapters/databases/ravendb/database";
import { RethinkDBAdapter } from "logos/adapters/databases/rethinkdb/database";
import { DatabaseMetadata } from "logos/models/database-metadata";
import { Guild } from "logos/models/guild";
import { GuildStatistics } from "logos/models/guild-statistics";
import type { ModelConstructor } from "logos/models/model";
import { User } from "logos/models/user";
import type { CacheStore } from "logos/stores/cache";
import type pino from "pino";

class DatabaseStore {
	static readonly #classes: Record<Collection, ModelConstructor> = Object.freeze({
		DatabaseMetadata: DatabaseMetadata,
		GuildStatistics: GuildStatistics,
		Guilds: Guild,
		Users: User,
	} as const);

	readonly log: pino.Logger;
	readonly cache: CacheStore;

	readonly #adapter: DatabaseAdapter;

	get conventionsFor(): DatabaseAdapter["conventionsFor"] {
		return this.#adapter.conventionsFor.bind(this.#adapter);
	}

	get withSession(): <T>(callback: (session: DocumentSession) => PromiseOr<T>) => Promise<T> {
		return (callback) => this.#adapter.withSession(callback, { database: this });
	}

	constructor({ log, adapter, cache }: { log: pino.Logger; adapter: DatabaseAdapter; cache: CacheStore }) {
		this.log = log;
		this.cache = cache;

		this.#adapter = adapter;
	}

	static create({
		log,
		environment,
		cache,
	}: { log: pino.Logger; environment: Environment; cache: CacheStore }): DatabaseStore {
		log = log.child({ name: "DatabaseStore" });

		let adapter: DatabaseAdapter | undefined;
		switch (environment.databaseSolution) {
			case "mongodb": {
				adapter = MongoDBAdapter.tryCreate({ log, environment });
				break;
			}
			case "ravendb": {
				adapter = RavenDBAdapter.tryCreate({ log, environment });
				break;
			}
			case "couchdb": {
				adapter = CouchDBAdapter.tryCreate({ log, environment });
				break;
			}
			case "rethinkdb": {
				adapter = RethinkDBAdapter.tryCreate({ log, environment });
				break;
			}
		}

		if (adapter === undefined) {
			if (environment.databaseSolution === undefined) {
				log.error(
					"`DATABASE_SOLUTION` was not provided. If this was intentional, explicitly define `DATABASE_SOLUTION` as 'none'.",
				);
			}

			log.info("Logos is running in memory. Data will not persist in-between sessions.");

			adapter = new InMemoryAdapter({ log });
		}

		return new DatabaseStore({ log, adapter, cache });
	}

	static getModelClassByCollection({ collection }: { collection: Collection }): ModelConstructor {
		return DatabaseStore.#classes[collection];
	}

	async setup(): Promise<void> {
		this.log.info("Setting up database store...");

		await this.#adapter.setup();

		this.log.info("Database store set up.");
	}

	async teardown(): Promise<void> {
		await this.#adapter.teardown();
	}
}

export { DatabaseStore };
