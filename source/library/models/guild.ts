import type { Client } from "logos/client";
import type { GuildDocument } from "logos/models/documents/guild";
import { GuildStatistics } from "logos/models/guild-statistics";
import { type CreateModelOptions, GuildModel, type IdentifierData, Model } from "logos/models/model";
import type { DatabaseStore } from "logos/stores/database";

type CreateGuildOptions = CreateModelOptions<Guild, GuildDocument>;

interface Guild extends GuildDocument {}
class Guild extends GuildModel {
	readonly createdAt: number;

	get guildId(): string {
		return this.idParts[0];
	}

	constructor(
		database: DatabaseStore,
		{ createdAt, languages, enabledFeatures, features, ...data }: CreateGuildOptions,
	) {
		super(database, data, { collection: "Guilds" });

		this.createdAt = createdAt ?? Date.now();
		this.languages = languages ?? {
			localisation: constants.defaults.LOCALISATION_LANGUAGE,
			target: constants.defaults.LEARNING_LANGUAGE,
			feature: constants.defaults.FEATURE_LANGUAGE,
		};
		this.enabledFeatures = enabledFeatures ?? {
			answers: false,
			corrections: false,
			cefr: false,
			game: false,
			resources: false,
			translate: false,
			word: false,
			wordSigils: false,
			context: false,
			targetOnly: false,
			roleLanguages: false,
		};
		this.features = features ?? {};
	}

	static async get(client: Client, data: IdentifierData<Guild>): Promise<Guild | undefined> {
		const partialId = Model.buildPartialId(data);
		if (client.documents.guilds.has(partialId)) {
			return client.documents.guilds.get(partialId)!;
		}

		return client.database.withSession((session) => {
			return session.get<Guild>(Model.buildId<Guild>(data, { collection: "Guilds" }));
		});
	}

	static async create(client: Client, data: CreateGuildOptions): Promise<Guild> {
		const guildDocument = await client.database.withSession((session) => {
			return session.set(new Guild(client.database, data));
		});

		await GuildStatistics.getOrCreate(client, { guildId: guildDocument.id.toString() });

		return guildDocument;
	}

	static async getOrCreate(client: Client, data: CreateGuildOptions): Promise<Guild> {
		const guildDocument = await Guild.get(client, data);
		if (guildDocument !== undefined) {
			return guildDocument;
		}

		return Guild.create(client, data);
	}

	hasEnabled(feature: keyof Guild["enabledFeatures"]): boolean {
		return this.enabledFeatures[feature];
	}

	feature<K extends keyof Guild["features"]>(feature: K): NonNullable<Guild["features"][K]> {
		if (!this.hasEnabled(feature)) {
			throw new Error(
				`Attempted to get guild feature '${feature}' that was not enabled on guild with ID ${this.guildId}.`,
			);
		}

		const configuration = this.features[feature];
		if (configuration === undefined) {
			throw new Error(
				`Guild feature '${feature}' is enabled on guild with ID ${this.guildId}, but missing a configuration.`,
			);
		}

		return configuration;
	}

	isTargetLanguageOnlyChannel(channelId: string): boolean {
		if (!this.hasEnabled("targetOnly")) {
			return false;
		}

		return this.feature("targetOnly").channelIds.includes(channelId) ?? false;
	}
}

export { Guild };
export type { CreateGuildOptions };
