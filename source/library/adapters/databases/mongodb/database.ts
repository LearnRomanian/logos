import type { Collection } from "logos:constants/database";
import type { Environment } from "logos:core/loaders/environment";
import { DatabaseAdapter, type DocumentConventions } from "logos/adapters/databases/adapter";
import { MongoDBDocumentConventions } from "logos/adapters/databases/mongodb/conventions";
import type { MongoDBDocumentMetadata } from "logos/adapters/databases/mongodb/document";
import { MongoDBDocumentSession } from "logos/adapters/databases/mongodb/session";
import type { IdentifierDataOrMetadata, Model } from "logos/models/model";
import type { DatabaseStore } from "logos/stores/database";
import mongodb from "mongodb";
import type pino from "pino";

class MongoDBAdapter extends DatabaseAdapter {
	readonly #mongoClient: mongodb.MongoClient;
	readonly #database: string;

	constructor({
		log,
		username,
		password,
		host,
		port,
		database,
	}: {
		log: pino.Logger;
		username?: string;
		password?: string;
		host: string;
		port: string;
		database: string;
	}) {
		super({ identifier: "MongoDB", log });

		this.#mongoClient = new mongodb.MongoClient(`mongodb://${host}:${port}`, {
			auth: {
				username,
				password,
			},
		});
		this.#database = database;
	}

	static tryCreate({ log, environment }: { log: pino.Logger; environment: Environment }): MongoDBAdapter | undefined {
		if (
			environment.mongodbHost === undefined ||
			environment.mongodbPort === undefined ||
			environment.mongodbDatabase === undefined
		) {
			log.error(
				"One or more of `MONGODB_HOST`, `MONGODB_PORT` or `MONGODB_DATABASE` have not been provided. Logos will run in memory.",
			);
			return undefined;
		}

		return new MongoDBAdapter({
			log,
			username: environment.mongodbUsername,
			password: environment.mongodbPassword,
			host: environment.mongodbHost,
			port: environment.mongodbPort,
			database: environment.mongodbDatabase,
		});
	}

	async setup(): Promise<void> {
		await this.#mongoClient.connect();
	}

	async teardown(): Promise<void> {
		await this.#mongoClient.close();
	}

	conventionsFor({
		document,
		data,
		collection,
	}: {
		document: Model;
		data: IdentifierDataOrMetadata<Model, MongoDBDocumentMetadata>;
		collection: Collection;
	}): DocumentConventions {
		return new MongoDBDocumentConventions({ document, data, collection });
	}

	openSession({ database }: { database: DatabaseStore }): MongoDBDocumentSession {
		const mongoDatabase = this.#mongoClient.db(this.#database);
		return new MongoDBDocumentSession({ database, mongoDatabase });
	}
}

export { MongoDBAdapter };
