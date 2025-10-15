import { isContextCommand, isSlashCommand } from "logos:constants/commands";
import { isAutocompleteInteraction } from "logos:constants/interactions";
import { isDefined } from "logos:core/utilities";
import type { Client } from "logos/client";
import type { InteractionHandler } from "logos/commands/handlers/handler";
import templates, { propertiesToAdd } from "logos/commands/templates";
import type { Command, CommandTemplate, Option, OptionTemplate } from "logos/commands/templates";
import type { DescriptionLocalisations, LocalisationStore, NameLocalisations } from "logos/stores/localisations";
import type pino from "pino";

interface RateLimit {
	nextAllowedUsageTimestamp: number;
}
class CommandStore {
	readonly log: pino.Logger;
	readonly commands: Command[];

	readonly #client: Client;
	readonly #localisations: LocalisationStore;
	readonly #collection: {
		readonly showable: Set<string>;
		readonly rateLimited: Set<string>;
	};
	// The keys are member IDs, the values are command usage timestamps mapped by command IDs.
	readonly #lastCommandUseTimestamps: Map<bigint, Map<bigint, number[]>>;
	readonly #handlers: {
		readonly execute: Map<string, InteractionHandler>;
		readonly autocomplete: Map<string, InteractionHandler>;
	};

	constructor(client: Client, { localisations }: { localisations: LocalisationStore }) {
		this.log = client.log.child({ name: "CommandStore" });
		this.commands = [];

		this.#client = client;
		this.#localisations = localisations;
		this.#collection = { showable: new Set(), rateLimited: new Set() };
		this.#lastCommandUseTimestamps = new Map();
		this.#handlers = { execute: new Map(), autocomplete: new Map() };
	}

	loadCommands(): void {
		for (const template of Object.values(templates) as CommandTemplate[]) {
			this.load({ template });
		}
	}

	load(_: { template: CommandTemplate; prefixes?: { key: string; commandName: string } }): Command | undefined;
	load(_: { template: OptionTemplate; prefixes?: { key: string; commandName: string } }): Option | undefined;
	load({
		template,
		prefixes,
	}: { template: CommandTemplate | OptionTemplate; prefixes?: { key: string; commandName: string } }):
		| Command
		| Option
		| undefined {
		let key: string;
		if (prefixes !== undefined) {
			key = `${prefixes.key}.options.${template.identifier}`;
		} else {
			key = template.identifier;
		}

		const nameLocalisations = this.#localisations.buildNameLocalisations({ key });
		const descriptionLocalisations = this.#localisations.buildDescriptionLocalisations({ key });
		if (nameLocalisations === undefined || descriptionLocalisations === undefined) {
			return undefined;
		}

		let commandName: string;
		if (prefixes !== undefined) {
			commandName = `${prefixes.commandName} ${nameLocalisations.name}`;
		} else {
			commandName = nameLocalisations.name;
		}

		const options = (template.options ?? [])
			.map((option) => this.load({ template: option, prefixes: { key, commandName } }))
			.filter(isDefined);

		let result: Command | Option;
		if (prefixes !== undefined) {
			result = this.buildOption({
				template: template as OptionTemplate,
				nameLocalisations,
				descriptionLocalisations,
				options,
			});
		} else {
			result = this.buildCommand({
				template: template as CommandTemplate,
				nameLocalisations,
				descriptionLocalisations,
				options,
			});
		}

		if (template.showable ?? false) {
			this.#collection.showable.add(commandName);
		}

		if (template.rateLimited ?? false) {
			this.#collection.rateLimited.add(commandName);
		}

		if (template.handle !== undefined) {
			this.#handlers.execute.set(commandName, template.handle);
		}

		if (template.handleAutocomplete !== undefined) {
			this.#handlers.autocomplete.set(commandName, template.handleAutocomplete);
		}

		return result;
	}

	buildCommand({
		template,
		nameLocalisations,
		descriptionLocalisations,
		options,
	}: {
		template: CommandTemplate;
		nameLocalisations: NameLocalisations;
		descriptionLocalisations: DescriptionLocalisations;
		options?: Option[];
	}): Command {
		const copy = { ...template };
		for (const property of propertiesToAdd) {
			delete copy[property];
		}

		if (isContextCommand(template.type)) {
			return {
				...nameLocalisations,
				...copy,
				type: template.type,
			} satisfies Discord.CreateContextApplicationCommand;
		}

		if (isSlashCommand(template.type)) {
			return {
				...nameLocalisations,
				...descriptionLocalisations,
				...copy,
				type: template.type,
				options,
			} satisfies Discord.CreateSlashApplicationCommand;
		}

		throw new Error(`Could not resolve any types in command '${template.identifier}'`);
	}

	buildOption({
		template,
		nameLocalisations,
		descriptionLocalisations,
		options,
	}: {
		template: OptionTemplate;
		nameLocalisations: NameLocalisations;
		descriptionLocalisations: DescriptionLocalisations;
		options?: Option[];
	}): Option {
		const copy = { ...template };
		for (const property of propertiesToAdd) {
			delete copy[property];
		}

		return {
			...nameLocalisations,
			...descriptionLocalisations,
			...copy,
			options,
		};
	}

	async setup(): Promise<void> {
		this.log.info("Setting up the commands store...");

		this.loadCommands();

		await this.registerGlobalCommands();

		this.log.info("Commands store set up.");
	}

	async registerGlobalCommands(): Promise<void> {
		if (!this.#client.environment.isDevelopmentMode) {
			return;
		}

		await this.#client.bot.helpers
			.upsertGlobalApplicationCommands(this.commands)
			.catch((error) => this.log.warn(error, "Failed to upsert global commands."));
	}

	async registerGuildCommands({ guildId }: { guildId: bigint }): Promise<void> {
		if (this.#client.environment.isDevelopmentMode) {
			return;
		}

		await this.#client.bot.helpers
			.upsertGuildApplicationCommands(guildId, this.commands)
			.catch((error) =>
				this.log.warn(error, `Failed to upsert commands on ${this.#client.diagnostics.guild(guildId)}.`),
			);
	}

	getHandler(interaction: Logos.Interaction): InteractionHandler | undefined {
		if (isAutocompleteInteraction(interaction)) {
			return this.#handlers.autocomplete.get(interaction.commandName);
		}

		return this.#handlers.execute.get(interaction.commandName);
	}

	isShowable(interaction: Logos.Interaction) {
		return this.#collection.showable.has(interaction.commandName);
	}

	isRateLimited(interaction: Logos.Interaction) {
		return this.#collection.rateLimited.has(interaction.commandName);
	}

	#getLastCommandUseTimestamps({
		id,
		commandId,
		executedAt,
		intervalMilliseconds,
	}: {
		id: bigint;
		commandId: bigint;
		executedAt: number;
		intervalMilliseconds: number;
	}): number[] {
		if (!this.#lastCommandUseTimestamps.has(id)) {
			return [];
		}

		const lastCommandUseTimestamps = this.#lastCommandUseTimestamps.get(id)!;
		if (!lastCommandUseTimestamps.has(commandId)) {
			return [];
		}

		const lastUseTimestamps = lastCommandUseTimestamps.get(commandId)!;

		return lastUseTimestamps.filter((timestamp) => executedAt - timestamp <= intervalMilliseconds);
	}

	getRateLimit(interaction: Logos.Interaction, { executedAt }: { executedAt: number }): RateLimit | undefined {
		const commandId = interaction.data?.id;
		if (commandId === undefined) {
			return undefined;
		}

		let memberId: bigint | undefined;
		if (interaction.guildId !== undefined) {
			memberId = this.#client.bot.transformers.snowflake(`${interaction.user.id}${interaction.guildId}`);
		}

		const id = memberId ?? interaction.user.id;

		const timestamps = this.#getLastCommandUseTimestamps({
			id,
			commandId,
			executedAt,
			intervalMilliseconds: constants.COMMAND_RATE_LIMIT_WITHIN,
		});

		if (timestamps.length + 1 > constants.COMMAND_RATE_LIMIT_COUNT) {
			const lastTimestamp = timestamps.at(0);
			if (lastTimestamp === undefined) {
				throw new Error("Unexpectedly undefined initial timestamp.");
			}

			const nextAllowedUsageTimestamp = constants.COMMAND_RATE_LIMIT_WITHIN - executedAt - lastTimestamp;

			return { nextAllowedUsageTimestamp };
		}

		const lastCommandUseTimestamps = this.#lastCommandUseTimestamps.get(id);
		if (lastCommandUseTimestamps === undefined) {
			this.#lastCommandUseTimestamps.set(id, new Map([[commandId, [executedAt]]]));
			return undefined;
		}

		const lastTimestamps = lastCommandUseTimestamps.get(commandId);
		if (lastTimestamps === undefined) {
			lastCommandUseTimestamps.set(commandId, [executedAt]);
			return undefined;
		}

		lastTimestamps.push(executedAt);

		return undefined;
	}
}

export { CommandStore };
