import type { FeatureLanguage } from "logos:constants/languages/feature";
import type { LearningLanguage } from "logos:constants/languages/learning";
import type { Locale, LocalisationLanguage } from "logos:constants/languages/localisation";
import type { TranslationLanguage } from "logos:constants/languages/translation";
import type { TimeStruct } from "logos:constants/time";
import type { RateLimit } from "logos/models/guild";

const FEATURE_LOCALE: Locale = "eng-GB";
const FEATURE_LANGUAGE: FeatureLanguage = "English";
const LEARNING_LOCALE: Locale = "eng-GB";
const LEARNING_LANGUAGE: LearningLanguage = "English/British";
const LOCALISATION_LOCALE: Locale = "eng-GB";
const LOCALISATION_LANGUAGE: LocalisationLanguage = "English/British";
const TRANSLATION_LANGUAGE: TranslationLanguage = "English/British";

const COMMAND_RATE_LIMIT: RateLimit = { uses: 5, within: [10, "second"] };
const REPORT_RATE_LIMIT: RateLimit = { uses: 50, within: [1, "day"] };
const RESOURCE_RATE_LIMIT: RateLimit = { uses: 500, within: [1, "day"] };
const SUGGESTION_RATE_LIMIT: RateLimit = { uses: 50, within: [1, "day"] };
const TICKET_RATE_LIMIT: RateLimit = { uses: 10, within: [1, "day"] };
const PRAISE_RATE_LIMIT: RateLimit = { uses: 10, within: [1, "day"] };

const WARN_LIMIT = 3;
const WARN_EXPIRY: TimeStruct = [2, "month"];
const WARN_TIMEOUT: TimeStruct = [1, "day"];

const FLOOD_INTERVAL: TimeStruct = [5, "second"];
const FLOOD_MESSAGE_COUNT = 3;
const FLOOD_TIMEOUT: TimeStruct = [1, "day"];

const MUSIC_DISCONNECT_TIMEOUT: TimeStruct = [2, "minute"];

const MINIMUM_VOICE_CHANNELS = 0;
const MAXIMUM_VOICE_CHANNELS = 5;

export default Object.freeze({
	LOCALISATION_LANGUAGE,
	LOCALISATION_LOCALE,
	LEARNING_LANGUAGE,
	LEARNING_LOCALE,
	FEATURE_LANGUAGE,
	FEATURE_LOCALE,
	TRANSLATION_LANGUAGE,
	COMMAND_RATE_LIMIT,
	REPORT_RATE_LIMIT,
	RESOURCE_RATE_LIMIT,
	TICKET_RATE_LIMIT,
	SUGGESTION_RATE_LIMIT,
	PRAISE_RATE_LIMIT,
	WARN_LIMIT,
	WARN_EXPIRY,
	WARN_TIMEOUT,
	FLOOD_INTERVAL,
	FLOOD_MESSAGE_COUNT,
	FLOOD_TIMEOUT,
	MUSIC_DISCONNECT_TIMEOUT,
	MINIMUM_VOICE_CHANNELS,
	MAXIMUM_VOICE_CHANNELS,
});
