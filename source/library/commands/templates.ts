import type { DictionarySearchMode } from "logos:constants/dictionaries";
import { handleDisplayAcknowledgements } from "logos/commands/handlers/acknowledgements";
import { handleAnswer } from "logos/commands/handlers/answer";
import { handleDisplayCefrGuide } from "logos/commands/handlers/cefr";
import { handleFindInContext, handleFindInContextAutocomplete } from "logos/commands/handlers/context";
import { handleMakeFullCorrection, handleMakePartialCorrection } from "logos/commands/handlers/correction";
import { handleDisplayCredits } from "logos/commands/handlers/credits";
import { handleStartGame } from "logos/commands/handlers/game";
import type { InteractionHandler } from "logos/commands/handlers/handler";
import { handleDisplayBotInformation } from "logos/commands/handlers/information/bot";
import {
	handleDisplayDetectorLicence,
	handleDisplayDetectorLicenceAutocomplete,
} from "logos/commands/handlers/licence/detector";
import {
	handleDisplayDictionaryLicence,
	handleDisplayDictionaryLicenceAutocomplete,
} from "logos/commands/handlers/licence/dictionary";
import {
	handleDisplayTranslatorLicence,
	handleDisplayTranslatorLicenceAutocomplete,
} from "logos/commands/handlers/licence/translator";
import { handleReloadBot } from "logos/commands/handlers/maintenance/reload/bot";
import { handleReloadServer, handleReloadServerAutocomplete } from "logos/commands/handlers/maintenance/reload/server";
import { handleRecogniseLanguageChatInput, handleRecogniseLanguageMessage } from "logos/commands/handlers/recognise";
import { handleDisplayResources } from "logos/commands/handlers/resources";
import { handleClearLanguage } from "logos/commands/handlers/settings/language/clear";
import { handleSetLanguage, handleSetLanguageAutocomplete } from "logos/commands/handlers/settings/language/set";
import { handleDisplaySettings } from "logos/commands/handlers/settings/view";
import {
	handleTranslateChatInput,
	handleTranslateChatInputAutocomplete,
	handleTranslateMessage,
} from "logos/commands/handlers/translate";
import { handleFindWord, handleFindWordAutocomplete } from "logos/commands/handlers/word";

const templates = Object.freeze({
	information: {
		identifier: "information",
		type: Discord.ApplicationCommandTypes.ChatInput,
		contexts: [Discord.DiscordInteractionContextType.BotDm, Discord.DiscordInteractionContextType.PrivateChannel],
		options: [
			{
				identifier: "bot",
				type: Discord.ApplicationCommandOptionTypes.SubCommand,
				handle: handleDisplayBotInformation,
				options: [constants.parameters.show],
				showable: true,
			},
		],
	},
	answerMessage: {
		identifier: "answer.message",
		type: Discord.ApplicationCommandTypes.Message,
		handle: handleAnswer,
		contexts: [Discord.DiscordInteractionContextType.Guild, Discord.DiscordInteractionContextType.PrivateChannel],
	},
	cefr: {
		identifier: "cefr",
		type: Discord.ApplicationCommandTypes.ChatInput,
		handle: handleDisplayCefrGuide,
		options: [constants.parameters.show],
		showable: true,
	},
	correctionPartialMessage: {
		identifier: "correction.options.partial.message",
		type: Discord.ApplicationCommandTypes.Message,
		handle: handleMakePartialCorrection,
		contexts: [Discord.DiscordInteractionContextType.Guild, Discord.DiscordInteractionContextType.PrivateChannel],
	},
	correctionFullMessage: {
		identifier: "correction.options.full.message",
		type: Discord.ApplicationCommandTypes.Message,
		handle: handleMakeFullCorrection,
		contexts: [Discord.DiscordInteractionContextType.Guild, Discord.DiscordInteractionContextType.PrivateChannel],
	},
	game: {
		identifier: "game",
		type: Discord.ApplicationCommandTypes.ChatInput,
		handle: handleStartGame,
	},
	recognise: {
		identifier: "recognise",
		type: Discord.ApplicationCommandTypes.ChatInput,
		handle: handleRecogniseLanguageChatInput,
		options: [
			{
				identifier: "text",
				type: Discord.ApplicationCommandOptionTypes.String,
				required: true,
			},
		],
	},
	recogniseMessage: {
		identifier: "recognise.message",
		type: Discord.ApplicationCommandTypes.Message,
		handle: handleRecogniseLanguageMessage,
	},
	resources: {
		identifier: "resources",
		type: Discord.ApplicationCommandTypes.ChatInput,
		handle: handleDisplayResources,
		options: [constants.parameters.show],
		contexts: [Discord.DiscordInteractionContextType.Guild],
		showable: true,
	},
	translate: {
		identifier: "translate",
		type: Discord.ApplicationCommandTypes.ChatInput,
		handle: handleTranslateChatInput,
		handleAutocomplete: handleTranslateChatInputAutocomplete,
		options: [
			{
				identifier: "text",
				type: Discord.ApplicationCommandOptionTypes.String,
				required: true,
			},
			{
				identifier: "to",
				type: Discord.ApplicationCommandOptionTypes.String,
				autocomplete: true,
			},
			{
				identifier: "from",
				type: Discord.ApplicationCommandOptionTypes.String,
				autocomplete: true,
			},
			constants.parameters.show,
		],
		rateLimited: true,
		showable: true,
	},
	translateMessage: {
		identifier: "translate.message",
		type: Discord.ApplicationCommandTypes.Message,
		handle: handleTranslateMessage,
		showable: true,
	},
	...(Object.fromEntries(
		constants.dictionaries.searchModes.map((searchMode): [DictionarySearchMode, CommandTemplate] => [
			searchMode,
			{
				identifier: searchMode,
				type: Discord.ApplicationCommandTypes.ChatInput,
				defaultMemberPermissions: ["VIEW_CHANNEL"],
				handle: (client, interaction) => handleFindWord(client, interaction, { searchMode }),
				handleAutocomplete: handleFindWordAutocomplete,
				options: [
					{
						identifier: "parameters.word",
						type: Discord.ApplicationCommandOptionTypes.String,
						required: true,
					},
					{
						identifier: "parameters.language",
						type: Discord.ApplicationCommandOptionTypes.String,
						autocomplete: true,
					},
					{
						identifier: "parameters.verbose",
						type: Discord.ApplicationCommandOptionTypes.Boolean,
					},
					constants.parameters.show,
				],
				rateLimited: true,
				showable: true,
			},
		]),
	) as Record<DictionarySearchMode, CommandTemplate>),
	context: {
		identifier: "context",
		type: Discord.ApplicationCommandTypes.ChatInput,
		handle: handleFindInContext,
		handleAutocomplete: handleFindInContextAutocomplete,
		options: [
			{
				identifier: "phrase",
				type: Discord.ApplicationCommandOptionTypes.String,
				required: true,
			},
			{
				identifier: "language",
				type: Discord.ApplicationCommandOptionTypes.String,
				autocomplete: true,
			},
			{
				identifier: "caseSensitive",
				type: Discord.ApplicationCommandOptionTypes.Boolean,
			},
			constants.parameters.show,
		],
		rateLimited: true,
		showable: true,
	},
	acknowledgements: {
		identifier: "acknowledgements",
		type: Discord.ApplicationCommandTypes.ChatInput,
		handle: handleDisplayAcknowledgements,
		contexts: [Discord.DiscordInteractionContextType.BotDm],
	},
	credits: {
		identifier: "credits",
		type: Discord.ApplicationCommandTypes.ChatInput,
		handle: handleDisplayCredits,
		contexts: [Discord.DiscordInteractionContextType.BotDm],
	},
	licence: {
		identifier: "licence",
		type: Discord.ApplicationCommandTypes.ChatInput,
		contexts: [Discord.DiscordInteractionContextType.BotDm],
		options: [
			{
				identifier: "detector",
				type: Discord.ApplicationCommandOptionTypes.SubCommand,
				handle: handleDisplayDetectorLicence,
				handleAutocomplete: handleDisplayDetectorLicenceAutocomplete,
				options: [
					{
						identifier: "detector",
						type: Discord.ApplicationCommandOptionTypes.String,
						required: true,
						autocomplete: true,
					},
				],
			},
			{
				identifier: "dictionary",
				type: Discord.ApplicationCommandOptionTypes.SubCommand,
				handle: handleDisplayDictionaryLicence,
				handleAutocomplete: handleDisplayDictionaryLicenceAutocomplete,
				options: [
					{
						identifier: "dictionary",
						type: Discord.ApplicationCommandOptionTypes.String,
						required: true,
						autocomplete: true,
					},
				],
			},
			{
				identifier: "translator",
				type: Discord.ApplicationCommandOptionTypes.SubCommand,
				handle: handleDisplayTranslatorLicence,
				handleAutocomplete: handleDisplayTranslatorLicenceAutocomplete,
				options: [
					{
						identifier: "translator",
						type: Discord.ApplicationCommandOptionTypes.String,
						required: true,
						autocomplete: true,
					},
				],
			},
		],
	},
	settings: {
		identifier: "settings",
		type: Discord.ApplicationCommandTypes.ChatInput,
		contexts: [Discord.DiscordInteractionContextType.BotDm],
		options: [
			{
				identifier: "language",
				type: Discord.ApplicationCommandOptionTypes.SubCommandGroup,
				options: [
					{
						identifier: "clear",
						type: Discord.ApplicationCommandOptionTypes.SubCommand,
						handle: handleClearLanguage,
					},
					{
						identifier: "set",
						type: Discord.ApplicationCommandOptionTypes.SubCommand,
						handle: handleSetLanguage,
						handleAutocomplete: handleSetLanguageAutocomplete,
						options: [
							{
								identifier: "language",
								type: Discord.ApplicationCommandOptionTypes.String,
								required: true,
								autocomplete: true,
							},
						],
					},
				],
			},
			{
				identifier: "view",
				type: Discord.ApplicationCommandOptionTypes.SubCommand,
				handle: handleDisplaySettings,
			},
		],
	},
	maintenance: {
		identifier: "maintenance",
		type: Discord.ApplicationCommandTypes.ChatInput,
		contexts: [Discord.DiscordInteractionContextType.BotDm],
		options: [
			{
				identifier: "reload",
				type: Discord.ApplicationCommandOptionTypes.SubCommandGroup,
				options: [
					{
						identifier: "server",
						type: Discord.ApplicationCommandOptionTypes.SubCommand,
						handle: handleReloadServer,
						handleAutocomplete: handleReloadServerAutocomplete,
						options: [
							{
								identifier: "server",
								type: Discord.ApplicationCommandOptionTypes.String,
								autocomplete: true,
							},
						],
					},
					{
						identifier: "bot",
						type: Discord.ApplicationCommandOptionTypes.SubCommand,
						handle: handleReloadBot,
					},
				],
			},
		],
	},
} satisfies Record<string, CommandTemplate>);

type PropertiesToOmit = "name" | "nameLocalizations" | "description" | "descriptionLocalizations" | "options";

// ⚠️ Ensure these are kept in sync.
const propertiesToAdd = ["identifier", "handle", "handleAutocomplete", "rateLimited", "showable", "options"] as const;
interface PropertiesToAdd {
	readonly identifier: string;
	readonly handle?: InteractionHandler;
	readonly handleAutocomplete?: InteractionHandler;
	readonly rateLimited?: boolean;
	readonly showable?: boolean;
	readonly options?: OptionTemplate[];
}

type Command = Discord.CreateApplicationCommand & Required<Pick<Discord.CreateApplicationCommand, "type">>;
type Option = Discord.ApplicationCommandOption;

type CommandTemplate = Omit<Command, PropertiesToOmit> &
	PropertiesToAdd & {
		readonly type: Discord.ApplicationCommandTypes;
	};
type OptionTemplate = Omit<Option, PropertiesToOmit> & PropertiesToAdd;

export default templates;
export { propertiesToAdd };
export type { Command, Option, CommandTemplate, OptionTemplate };
