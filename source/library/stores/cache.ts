import type { Collection } from "logos:constants/database";
import type { DesiredProperties, DesiredPropertiesBehaviour } from "logos:constants/properties";
import type { PromiseOr } from "logos:core/utilities";
import type { Guild } from "logos/models/guild";
import type { GuildStatistics } from "logos/models/guild-statistics";
import type { Model } from "logos/models/model";
import type { User } from "logos/models/user";
import type pino from "pino";

class CacheStore {
	readonly log: pino.Logger;
	readonly entities: {
		readonly guilds: Map<bigint, Logos.Guild>;
		readonly members: Map</* guildId: */ bigint, Map</* userId: */ bigint, Logos.Member>>;
		readonly channels: Map<bigint, Logos.Channel>;
		readonly roles: Map<bigint, Logos.Role>;
	};
	readonly documents: {
		readonly guildStatistics: Map<string, GuildStatistics>;
		readonly guilds: Map<string, Guild>;
		readonly users: Map<string, User>;
	};

	constructor({ log }: { log: pino.Logger }) {
		this.log = log.child({ name: "CacheStore" });
		this.entities = {
			guilds: new Map(),
			members: new Map(),
			channels: new Map(),
			roles: new Map(),
		};
		this.documents = {
			guildStatistics: new Map(),
			guilds: new Map(),
			users: new Map(),
		};
	}

	buildCacheHandlers(): Partial<Discord.Transformers<DesiredProperties, DesiredPropertiesBehaviour>["customizers"]> {
		return {
			guild: this.#cacheEntity(this.#cacheGuild.bind(this)),
			channel: this.#cacheEntity(this.#cacheChannel.bind(this)),
			member: this.#cacheEntity(this.#cacheMember.bind(this)),
			role: this.#cacheEntity(this.#cacheRole.bind(this)),
			voiceState: this.#cacheEntity(this.#cacheVoiceState.bind(this)),
		};
	}

	#cacheEntity<T>(
		callback: (entity: T) => PromiseOr<void>,
	): (bot: Discord.Bot<DesiredProperties, DesiredPropertiesBehaviour>, payload: unknown, entity: T) => T {
		return (_, __, entity) => {
			callback(entity);
			return entity;
		};
	}

	#cacheGuild(guild_: Discord.Guild): void {
		const oldGuild = this.entities.guilds.get(guild_.id);
		const guild = {
			...(guild_ as unknown as Logos.Guild),
			roles: new Discord.Collection([...(oldGuild?.roles ?? []), ...(guild_.roles ?? [])]),
			members: new Discord.Collection([...(oldGuild?.members ?? []), ...(guild_.members ?? [])]),
			channels: new Discord.Collection([...(oldGuild?.channels ?? []), ...(guild_.channels ?? [])]),
		};

		this.entities.guilds.set(guild.id, guild);

		for (const channel of guild.channels?.array() ?? []) {
			this.#cacheChannel(channel);
		}
	}

	#cacheChannel(channel: Discord.Channel): void {
		this.entities.channels.set(channel.id, channel);

		if (channel.guildId !== undefined) {
			this.entities.guilds.get(channel.guildId)?.channels?.set(channel.id, channel);
		}
	}

	#cacheMember(member: Discord.Member): void {
		if (member.guildId === undefined) {
			return;
		}

		if (this.entities.members.has(member.guildId)) {
			this.entities.members.get(member.guildId)!.set(member.id, member);
		} else {
			this.entities.members.set(member.guildId, new Map([[member.id, member]]));
		}

		this.entities.guilds.get(member.guildId)?.members?.set(member.id, member);
	}

	#cacheRole(role: Discord.Role): void {
		this.entities.roles.set(role.id, role);

		this.entities.guilds.get(role.guildId)?.roles?.set(role.id, role);
	}

	#cacheVoiceState(voiceState: Discord.VoiceState): void {
		if (voiceState.channelId !== undefined) {
			this.entities.guilds.get(voiceState.guildId)?.voiceStates?.set(voiceState.userId, voiceState);
		} else {
			this.entities.guilds.get(voiceState.guildId)?.voiceStates?.delete(voiceState.userId);
		}
	}

	cacheDocuments<M extends Model>(documents: M[]): void {
		if (documents.length === 0) {
			return;
		}

		this.log.debug(`Caching ${documents.length} documents...`);

		for (const document of documents) {
			this.cacheDocument(document);
		}
	}

	cacheDocument(document: any): void {
		switch (document.collection as Collection) {
			case "DatabaseMetadata": {
				// Uncached
				break;
			}
			case "GuildStatistics": {
				this.documents.guildStatistics.set(document.partialId, document);
				break;
			}
			case "Guilds": {
				this.documents.guilds.set(document.partialId, document);
				break;
			}
			case "Users": {
				this.documents.users.set(document.partialId, document);
				break;
			}
		}
	}

	unloadDocument(document: any): void {
		switch (document.collection as Collection) {
			case "DatabaseMetadata": {
				// Uncached
				break;
			}
			case "Guilds": {
				this.documents.guilds.delete(document.partialId);
				break;
			}
			case "GuildStatistics": {
				this.documents.guildStatistics.delete(document.partialId);
				break;
			}
			case "Users": {
				this.documents.users.delete(document.partialId);
				break;
			}
		}
	}
}

export { CacheStore };
