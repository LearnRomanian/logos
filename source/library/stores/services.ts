import { isDefined } from "logos:core/utilities";
import type { Client } from "logos/client";
import type { Guild } from "logos/models/guild";
import { InteractionRepetitionService } from "logos/services/interaction-repetition";
import type { GlobalService, LocalService, Service } from "logos/services/service";
import { StatusService } from "logos/services/status";
import { WordSigilService } from "logos/services/word-sigils";
import type pino from "pino";

interface GlobalServices {
	readonly interactionRepetition: InteractionRepetitionService;
	readonly status: StatusService;
}

interface LocalServices {
	readonly wordSigils: WordSigilService;
}

interface CustomServices {
	readonly global: GlobalService[];
	readonly local: Map<bigint, Set<LocalService>>;
}

class ServiceStore {
	readonly log: pino.Logger;

	readonly #client: Client;
	readonly #global: GlobalServices;
	readonly #local: { [K in keyof LocalServices]: Map<bigint, LocalServices[K]> };
	readonly #custom: CustomServices;

	get #globalServices(): GlobalService[] {
		return [...Object.values(this.#global).filter(isDefined), ...this.#custom.global];
	}

	get #localServices(): LocalService[] {
		return [...Object.values(this.#local), ...Object.values(this.#custom.local)].flatMap((services) => [
			...services.values(),
		]);
	}

	constructor(client: Client) {
		this.log = client.log.child({ name: "ServiceStore" });

		this.#client = client;
		this.#global = {
			interactionRepetition: new InteractionRepetitionService(client),
			status: new StatusService(client),
		};
		this.#local = {
			wordSigils: new Map(),
		};
		this.#custom = {
			global: [],
			local: new Map(),
		};
	}

	#localServicesFor({ guildId }: { guildId: bigint }): LocalService[] {
		return [
			...Object.values(this.#local)
				.map((services) => services.get(guildId))
				.filter(isDefined),
			...(this.#custom.local.get(guildId)?.values() ?? []),
		];
	}

	async setup(): Promise<void> {
		this.log.info("Setting up service store...");

		await this.#startGlobalServices();
		// Local services are started when Logos receives a guild.

		this.log.info("Service store set up.");
	}

	async teardown(): Promise<void> {
		this.log.info("Tearing down service store...");

		await this.#stopGlobalServices();
		await this.#stopAllLocalServices();

		this.log.info("Service store torn down.");
	}

	async #startGlobalServices(): Promise<void> {
		const services = this.#globalServices;

		this.log.info(`Starting global services... (${services.length} services to start)`);

		await this.#startServices(services);

		this.log.info("Global services started.");
	}

	async #stopGlobalServices(): Promise<void> {
		const services = this.#globalServices;

		this.log.info(`Stopping global services... (${services.length} services to stop)`);

		await this.#stopServices(services);

		this.log.info("Global services stopped.");
	}

	async startForGuild({ guildId, guildDocument }: { guildId: bigint; guildDocument: Guild }): Promise<void> {
		const services: Service[] = [];

		if (guildDocument.hasEnabled("wordSigils")) {
			const service = new WordSigilService(this.#client, { guildId });
			services.push(service);

			this.#local.wordSigils.set(guildId, service);
		}

		await this.#startLocalServices({ guildId, services });
	}

	async stopForGuild({ guildId }: { guildId: bigint }): Promise<void> {
		await this.#stopLocalServices({ guildId });
	}

	async #startLocalServices({ guildId, services }: { guildId: bigint; services: Service[] }): Promise<void> {
		if (services.length === 0) {
			this.log.info(`There were no local services to start on ${this.#client.diagnostics.guild(guildId)}.`);
			return;
		}

		this.log.info(
			`Starting local services on ${this.#client.diagnostics.guild(guildId)}... (${services.length} services to start)`,
		);

		await this.#startServices(services);

		this.log.info(`Local services on ${this.#client.diagnostics.guild(guildId)} started.`);
	}

	async #stopLocalServices({ guildId }: { guildId: bigint }): Promise<void> {
		const services = this.#localServicesFor({ guildId });
		if (services.length === 0) {
			this.log.info(`There were no local services to stop on ${this.#client.diagnostics.guild(guildId)}.`);
			return;
		}

		this.log.info(
			`Stopping services on ${this.#client.diagnostics.guild(guildId)}... (${services.length} services to stop)`,
		);

		await this.#stopServices(services);

		this.log.info(`Local services on ${this.#client.diagnostics.guild(guildId)} stopped.`);
	}

	async #stopAllLocalServices(): Promise<void> {
		const services = this.#localServices;

		this.log.info(`Stopping all local services... (${services.length} services to stop)`);

		await this.#stopServices(services);

		this.log.info("All local services stopped.");
	}

	async #startServices(services: Service[]): Promise<void> {
		await Promise.all(services.map((service) => service.start()));
	}

	async #stopServices(services: Service[]): Promise<void> {
		await Promise.all(services.map((service) => service.stop()));
	}

	/**
	 * Registers and starts a service at runtime.
	 *
	 * @remarks
	 * This should only be used for loading services inside of plugins.
	 */
	async loadLocalService(service: LocalService): Promise<void> {
		this.log.info(`Loading local service ${service.identifier}...`);

		if (this.#custom.local.has(service.guildId)) {
			this.#custom.local.get(service.guildId)!.add(service);
		} else {
			this.#custom.local.set(service.guildId, new Set([service]));
		}

		await service.start();

		this.log.info(`Local service ${service.identifier} has been loaded.`);
	}

	/**
	 * Unregisters and stops a service at runtime.
	 *
	 * @remarks
	 * This should only be used for unloading services inside of plugins.
	 */
	async unloadLocalService(service: LocalService, { guildId }: { guildId: bigint }): Promise<void> {
		this.log.info(`Unloading custom local service ${service.identifier}...`);

		const isRemoved = this.#custom.local.get(guildId)?.delete(service) ?? false;
		if (isRemoved === undefined) {
			this.log.warn(`Could not unload local service ${service.identifier}: It wasn't loaded previously.`);
			return;
		}

		await service.stop();

		this.log.info(`Local service ${service.identifier} has been unloaded.`);
	}

	hasGlobalService<K extends keyof GlobalServices>(service: K): boolean {
		return this.#global[service] !== undefined;
	}

	/** ⚠️ If the service is not enabled, an error is raised. */
	global<K extends keyof GlobalServices>(service: K): NonNullable<GlobalServices[K]> {
		if (!this.hasGlobalService(service)) {
			throw new Error(`Attempted to get global service '${service}' that is not enabled.`);
		}

		return this.#global[service]!;
	}

	hasLocalService<K extends keyof LocalServices>(service: K, { guildId }: { guildId: bigint }): boolean {
		return this.#local[service].has(guildId);
	}

	/** ⚠️ If the service is not enabled on the given guild, an error is raised. */
	local<K extends keyof LocalServices>(service: K, { guildId }: { guildId: bigint }): LocalServices[K] {
		if (!this.hasLocalService(service, { guildId })) {
			throw new Error(
				`Attempted to get local service '${service}' that was not enabled on guild with ID ${guildId}.`,
			);
		}

		return this.#local[service].get(guildId)!;
	}
}

export { ServiceStore };
