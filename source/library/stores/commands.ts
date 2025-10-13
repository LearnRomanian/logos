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

	constructor(
		client: Client,
		{
			commands,
			showable,
			rateLimited,
			executeHandlers,
			autocompleteHandlers,
		}: {
			commands: Command[];
			showable: Set<string>;
			rateLimited: Set<string>;
			executeHandlers: Map<string, InteractionHandler>;
			autocompleteHandlers: Map<string, InteractionHandler>;
		},
	) {
		this.log = client.log.child({ name: "CommandStore" });
		this.commands = commands;

		this.#client = client;
		this.#collection = { showable, rateLimited };
		this.#lastCommandUseTimestamps = new Map();
		this.#handlers = { execute: executeHandlers, autocomplete: autocompleteHandlers };
	}

	static create(client: Client, { localisations }: { localisations: LocalisationStore }): CommandStore {
		const commands: Command[] = [];
		const showable = new Set<string>();
		const rateLimited = new Set<string>();
		const executeHandlers = new Map<string, InteractionHandler>();
		const autocompleteHandlers = new Map<string, InteractionHandler>();
		for (const template of Object.values(templates) as CommandTemplate[]) {
			const command = CommandStore.build({ localisations, template });
			if (command === undefined) {
				continue;
			}

			commands.push(command);

			if (template.handle !== undefined) {
				executeHandlers.set(command.name, template.handle);
			}

			if (template.handleAutocomplete !== undefined) {
				autocompleteHandlers.set(command.name, template.handleAutocomplete);
			}
		}

		return new CommandStore(client, {
			commands,
			showable,
			rateLimited,
			executeHandlers,
			autocompleteHandlers,
		});
	}

	static build(_: {
		localisations: LocalisationStore;
		template: CommandTemplate;
		keyPrefix?: string;
	}): Command | undefined;
	static build(_: { localisations: LocalisationStore; template: OptionTemplate; keyPrefix?: string }):
		| Option
		| undefined;
	static build({
		localisations,
		template,
		keyPrefix,
	}: {
		localisations: LocalisationStore;
		template: CommandTemplate | OptionTemplate;
		keyPrefix?: string;
	}): Command | Option | undefined {
		let key: string;
		if (keyPrefix !== undefined) {
			key = `${keyPrefix}.options.${template.identifier}`;
		} else {
			key = template.identifier;
		}

		const nameLocalisations = localisations.buildNameLocalisations({ key });
		if (nameLocalisations === undefined) {
			return undefined;
		}

		const descriptionLocalisations = localisations.buildDescriptionLocalisations({ key });
		if (descriptionLocalisations === undefined) {
			return undefined;
		}

		const options = template.options
			?.map((option) => CommandStore.build({ localisations, template: option, keyPrefix: key }))
			.filter(isDefined);

		if (keyPrefix !== undefined) {
			return CommandStore.buildOption({
				template: template as OptionTemplate,
				nameLocalisations,
				descriptionLocalisations,
				options,
			});
		}

		return CommandStore.buildCommand({
			template: template as CommandTemplate,
			nameLocalisations,
			descriptionLocalisations,
			options,
		});
	}

	static buildCommand({
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

	static buildOption({
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

		if (!this.#client.environment.isDevelopmentMode) {
			await this.registerGlobalCommands();
		}

		this.log.info("Commands store set up.");
	}

	async registerGlobalCommands(): Promise<void> {
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
		memberId,
		commandId,
		executedAt,
		intervalMilliseconds,
	}: { memberId: bigint; commandId: bigint; executedAt: number; intervalMilliseconds: number }): number[] {
		if (!this.#lastCommandUseTimestamps.has(memberId)) {
			return [];
		}

		const lastCommandUseTimestamps = this.#lastCommandUseTimestamps.get(memberId)!;
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

		const memberId = this.#client.bot.transformers.snowflake(`${interaction.user.id}${interaction.guildId}`);

		const timestamps = this.#getLastCommandUseTimestamps({
			memberId,
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

		const lastCommandUseTimestampsForMember = this.#lastCommandUseTimestamps.get(memberId);
		if (lastCommandUseTimestampsForMember === undefined) {
			this.#lastCommandUseTimestamps.set(memberId, new Map([[commandId, [executedAt]]]));
			return undefined;
		}

		const lastTimestamps = lastCommandUseTimestampsForMember.get(commandId);
		if (lastTimestamps === undefined) {
			lastCommandUseTimestampsForMember.set(commandId, [executedAt]);
			return undefined;
		}

		lastTimestamps.push(executedAt);

		return undefined;
	}
}

export { CommandStore };
