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

/**
 * @remarks
 * Commands, command groups and options are ordered alphabetically.
 */
const commands = Object.freeze({
	information: {
		identifier: "information",
		type: Discord.ApplicationCommandTypes.ChatInput,
		defaultMemberPermissions: ["VIEW_CHANNEL"],
		options: {
			bot: {
				identifier: "bot",
				type: Discord.ApplicationCommandOptionTypes.SubCommand,
				handle: handleDisplayBotInformation,
				options: { show: constants.parameters.show },
				flags: { isShowable: true },
			},
		},
	},
	answerMessage: {
		identifier: "answer.message",
		type: Discord.ApplicationCommandTypes.Message,
		defaultMemberPermissions: ["VIEW_CHANNEL"],
		handle: handleAnswer,
	},
	cefr: {
		identifier: "cefr",
		type: Discord.ApplicationCommandTypes.ChatInput,
		defaultMemberPermissions: ["VIEW_CHANNEL"],
		handle: handleDisplayCefrGuide,
		options: { show: constants.parameters.show },
		flags: { isShowable: true },
	},
	correctionPartialMessage: {
		identifier: "correction.options.partial.message",
		type: Discord.ApplicationCommandTypes.Message,
		defaultMemberPermissions: ["VIEW_CHANNEL"],
		handle: handleMakePartialCorrection,
	},
	correctionFullMessage: {
		identifier: "correction.options.full.message",
		type: Discord.ApplicationCommandTypes.Message,
		defaultMemberPermissions: ["VIEW_CHANNEL"],
		handle: handleMakeFullCorrection,
	},
	game: {
		identifier: "game",
		type: Discord.ApplicationCommandTypes.ChatInput,
		defaultMemberPermissions: ["VIEW_CHANNEL"],
		handle: handleStartGame,
	},
	recognise: {
		identifier: "recognise",
		type: Discord.ApplicationCommandTypes.ChatInput,
		defaultMemberPermissions: ["VIEW_CHANNEL"],
		handle: handleRecogniseLanguageChatInput,
		options: {
			text: {
				identifier: "text",
				type: Discord.ApplicationCommandOptionTypes.String,
				required: true,
			},
		},
	},
	recogniseMessage: {
		identifier: "recognise.message",
		type: Discord.ApplicationCommandTypes.Message,
		defaultMemberPermissions: ["VIEW_CHANNEL"],
		handle: handleRecogniseLanguageMessage,
	},
	resources: {
		identifier: "resources",
		type: Discord.ApplicationCommandTypes.ChatInput,
		defaultMemberPermissions: ["VIEW_CHANNEL"],
		handle: handleDisplayResources,
		options: { show: constants.parameters.show },
		flags: { isShowable: true },
	},
	translate: {
		identifier: "translate",
		type: Discord.ApplicationCommandTypes.ChatInput,
		defaultMemberPermissions: ["VIEW_CHANNEL"],
		handle: handleTranslateChatInput,
		handleAutocomplete: handleTranslateChatInputAutocomplete,
		options: {
			text: {
				identifier: "text",
				type: Discord.ApplicationCommandOptionTypes.String,
				required: true,
			},
			to: {
				identifier: "to",
				type: Discord.ApplicationCommandOptionTypes.String,
				autocomplete: true,
			},
			from: {
				identifier: "from",
				type: Discord.ApplicationCommandOptionTypes.String,
				autocomplete: true,
			},
			show: constants.parameters.show,
		},
		flags: { hasRateLimit: true, isShowable: true },
	},
	translateMessage: {
		identifier: "translate.message",
		type: Discord.ApplicationCommandTypes.Message,
		defaultMemberPermissions: ["VIEW_CHANNEL"],
		handle: handleTranslateMessage,
		flags: { isShowable: true },
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
				options: {
					word: {
						identifier: "parameters.word",
						type: Discord.ApplicationCommandOptionTypes.String,
						required: true,
					},
					language: {
						identifier: "parameters.language",
						type: Discord.ApplicationCommandOptionTypes.String,
						autocomplete: true,
					},
					verbose: {
						identifier: "parameters.verbose",
						type: Discord.ApplicationCommandOptionTypes.Boolean,
					},
					show: constants.parameters.show,
				},
				flags: { hasRateLimit: true, isShowable: true },
			},
		]),
	) as Record<DictionarySearchMode, CommandTemplate>),
	context: {
		identifier: "context",
		type: Discord.ApplicationCommandTypes.ChatInput,
		defaultMemberPermissions: ["VIEW_CHANNEL"],
		handle: handleFindInContext,
		handleAutocomplete: handleFindInContextAutocomplete,
		options: {
			phrase: {
				identifier: "phrase",
				type: Discord.ApplicationCommandOptionTypes.String,
				required: true,
			},
			language: {
				identifier: "language",
				type: Discord.ApplicationCommandOptionTypes.String,
				autocomplete: true,
			},
			"case-sensitive": {
				identifier: "caseSensitive",
				type: Discord.ApplicationCommandOptionTypes.Boolean,
			},
			show: constants.parameters.show,
		},
		flags: { hasRateLimit: true, isShowable: true },
	},
	acknowledgements: {
		identifier: "acknowledgements",
		type: Discord.ApplicationCommandTypes.ChatInput,
		handle: handleDisplayAcknowledgements,
		defaultMemberPermissions: ["VIEW_CHANNEL"],
	},
	credits: {
		identifier: "credits",
		type: Discord.ApplicationCommandTypes.ChatInput,
		handle: handleDisplayCredits,
		defaultMemberPermissions: ["VIEW_CHANNEL"],
	},
	licence: {
		identifier: "licence",
		type: Discord.ApplicationCommandTypes.ChatInput,
		defaultMemberPermissions: ["VIEW_CHANNEL"],
		options: {
			detector: {
				identifier: "detector",
				type: Discord.ApplicationCommandOptionTypes.SubCommand,
				handle: handleDisplayDetectorLicence,
				handleAutocomplete: handleDisplayDetectorLicenceAutocomplete,
				options: {
					dictionary: {
						identifier: "detector",
						type: Discord.ApplicationCommandOptionTypes.String,
						required: true,
						autocomplete: true,
					},
				},
			},
			dictionary: {
				identifier: "dictionary",
				type: Discord.ApplicationCommandOptionTypes.SubCommand,
				handle: handleDisplayDictionaryLicence,
				handleAutocomplete: handleDisplayDictionaryLicenceAutocomplete,
				options: {
					dictionary: {
						identifier: "dictionary",
						type: Discord.ApplicationCommandOptionTypes.String,
						required: true,
						autocomplete: true,
					},
				},
			},
			translator: {
				identifier: "translator",
				type: Discord.ApplicationCommandOptionTypes.SubCommand,
				handle: handleDisplayTranslatorLicence,
				handleAutocomplete: handleDisplayTranslatorLicenceAutocomplete,
				options: {
					dictionary: {
						identifier: "translator",
						type: Discord.ApplicationCommandOptionTypes.String,
						required: true,
						autocomplete: true,
					},
				},
			},
		},
	},
	settings: {
		identifier: "settings",
		type: Discord.ApplicationCommandTypes.ChatInput,
		defaultMemberPermissions: ["VIEW_CHANNEL"],
		options: {
			language: {
				identifier: "language",
				type: Discord.ApplicationCommandOptionTypes.SubCommandGroup,
				options: {
					clear: {
						identifier: "clear",
						type: Discord.ApplicationCommandOptionTypes.SubCommand,
						handle: handleClearLanguage,
					},
					set: {
						identifier: "set",
						type: Discord.ApplicationCommandOptionTypes.SubCommand,
						handle: handleSetLanguage,
						handleAutocomplete: handleSetLanguageAutocomplete,
						options: {
							language: {
								identifier: "language",
								type: Discord.ApplicationCommandOptionTypes.String,
								required: true,
								autocomplete: true,
							},
						},
					},
				},
			},
			view: {
				identifier: "view",
				type: Discord.ApplicationCommandOptionTypes.SubCommand,
				handle: handleDisplaySettings,
			},
		},
	},
} satisfies Record<string, CommandTemplate>);
type CommandTemplates = typeof commands;
type CommandName = keyof CommandTemplates;

type BuiltCommands = CommandTemplates & Record<CommandName, BuiltCommand>;

interface OptionFlags {
	readonly hasRateLimit?: boolean;
	readonly isShowable?: boolean;
}
interface OptionMetadata {
	readonly identifier: string;
	readonly handle?: InteractionHandler;
	readonly handleAutocomplete?: InteractionHandler;
	readonly flags?: OptionFlags;
}

type Command = Discord.CreateApplicationCommand;
type Option = Discord.ApplicationCommandOption;

interface CommandBuilderBase<Generic extends { built: boolean }> extends OptionMetadata {
	readonly type: Discord.ApplicationCommandTypes;
	readonly defaultMemberPermissions: Discord.PermissionStrings[];
	readonly options?: Record<string, OptionBuilder<Generic>>;
}
type CommandBuilder<Generic extends { built: boolean } = { built: boolean }> = true extends Generic["built"]
	? CommandBuilderBase<Generic> & {
			key: string;
			built: Discord.CreateApplicationCommand;
		}
	: CommandBuilderBase<Generic>;

interface OptionBuilderBase<Generic extends { built: boolean }> extends OptionMetadata {
	readonly type: Discord.ApplicationCommandOptionTypes;
	readonly required?: boolean;
	readonly choices?: Discord.ApplicationCommandOptionChoice[];
	readonly channelTypes?: Discord.ChannelTypes[];
	readonly minimumValue?: number;
	readonly maximumValue?: number;
	readonly minimumLength?: number;
	readonly maximumLength?: number;
	readonly autocomplete?: boolean;
	readonly options?: Record<string, OptionBuilder<Generic>>;
}
type OptionBuilder<Generic extends { built: boolean } = { built: boolean }> = true extends Generic["built"]
	? OptionBuilderBase<Generic> & {
			key: string;
			built: Discord.ApplicationCommandOption;
		}
	: OptionBuilderBase<Generic>;

type CommandTemplate = CommandBuilder<{ built: false }>;
type OptionTemplate = OptionBuilder<{ built: false }>;

type BuiltCommand = CommandBuilder<{ built: true }>;
type BuiltOption = OptionBuilder<{ built: true }>;

export default commands;
export type {
	CommandBuilder,
	OptionBuilder,
	BuiltCommands,
	BuiltCommand,
	BuiltOption,
	Command,
	CommandName,
	CommandTemplates,
	CommandTemplate,
	OptionMetadata,
	Option,
	OptionTemplate,
};
