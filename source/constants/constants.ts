import acknowledgements from "logos:constants/acknowledgements";
import colours from "logos:constants/colours";
import components from "logos:constants/components";
import contexts from "logos:constants/contexts";
import contributions from "logos:constants/contributions";
import database from "logos:constants/database";
import defaults from "logos:constants/defaults";
import dictionaries from "logos:constants/dictionaries";
import directories from "logos:constants/directories";
import discord from "logos:constants/discord";
import emojis from "logos:constants/emojis";
import endpoints from "logos:constants/endpoints";
import keys from "logos:constants/keys";
import languages from "logos:constants/languages";
import lengths from "logos:constants/lengths";
import licences from "logos:constants/licences";
import links from "logos:constants/links";
import localisations from "logos:constants/localisations";
import logTargets from "logos:constants/log-targets";
import loggers from "logos:constants/loggers";
import parameters from "logos:constants/parameters";
import patterns from "logos:constants/patterns";
import properties from "logos:constants/properties";
import special from "logos:constants/special";

const constants = Object.freeze({
	PROJECT_NAME: "Logos",
	USER_AGENT: "Logos (https://github.com/vxern/logos)",
	TEST_GUILD_TEMPLATE_CODE: "EaEy336gYh3C",
	TEST_GUILD_NAME: "Logos Test Environment",
	TEST_GUILD_ICON_URL: Discord.guildIconUrl(1175841125546856608n, "24adda5d3f30a46aef193b621e3952b4", {
		format: "png",
		size: 1024,
	}),
	STATUS_MESSAGE: "Helping you learn languages! 🌍",
	COMMAND_RATE_LIMIT_COUNT: 5,
	COMMAND_RATE_LIMIT_WITHIN: 10 * 1000, // 10 seconds
	MAXIMUM_DELETABLE_MESSAGES: 500,
	MAXIMUM_INDEXABLE_MESSAGES: 1000,
	MAXIMUM_CORRECTION_MESSAGE_LENGTH: 3072,
	MAXIMUM_VOLUME: 100,
	MAXIMUM_HISTORY_ENTRIES: 100,
	MAXIMUM_QUEUE_ENTRIES: 100,
	RESULTS_PER_PAGE: 10,
	AUTO_DELETE_MESSAGE_TIMEOUT: 10 * 1000, // 10 seconds
	PICK_MISSING_WORD_CHOICES: 4,
	SHORT_TEXT_LENGTH: 60,
	SENTENCE_PAIRS_TO_SHOW: 5,
	ROW_INDENTATION: 3,
	DEFINITIONS_PER_VIEW: 5,
	TRANSLATIONS_PER_VIEW: 5,
	EXPRESSIONS_PER_VIEW: 5,
	EXAMPLES_PER_VIEW: 5,
	DEFINITIONS_PER_VERBOSE_VIEW: 1,
	TRANSLATIONS_PER_VERBOSE_VIEW: 1,
	EXPRESSIONS_PER_VERBOSE_VIEW: 1,
	EXAMPLES_PER_VERBOSE_VIEW: 1,
	INCLUDE_EXPRESSION_RELATIONS: false,
	SEARCH_MODE: "word",
} as const);

export default Object.freeze({
	...constants,
	acknowledgements,
	colours,
	components,
	contexts,
	contributions,
	database,
	defaults,
	dictionaries,
	directories,
	discord,
	emojis,
	endpoints,
	keys,
	languages,
	lengths,
	licences,
	links,
	localisations,
	logTargets,
	loggers,
	parameters,
	patterns,
	properties,
	special,
});
