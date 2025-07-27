import type { FeatureLanguage } from "logos:constants/languages/feature";
import type { LearningLanguage } from "logos:constants/languages/learning";
import type { Locale, LocalisationLanguage } from "logos:constants/languages/localisation";
import type { TranslationLanguage } from "logos:constants/languages/translation";

const FEATURE_LOCALE: Locale = "eng-GB";
const FEATURE_LANGUAGE: FeatureLanguage = "English";
const LEARNING_LOCALE: Locale = "eng-GB";
const LEARNING_LANGUAGE: LearningLanguage = "English/British";
const LOCALISATION_LOCALE: Locale = "eng-GB";
const LOCALISATION_LANGUAGE: LocalisationLanguage = "English/British";
const TRANSLATION_LANGUAGE: TranslationLanguage = "English/British";

export default Object.freeze({
	LOCALISATION_LANGUAGE,
	LOCALISATION_LOCALE,
	LEARNING_LANGUAGE,
	LEARNING_LOCALE,
	FEATURE_LANGUAGE,
	FEATURE_LOCALE,
	TRANSLATION_LANGUAGE,
});
