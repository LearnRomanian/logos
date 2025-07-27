import type { Language } from "logos:constants/languages";
import type { Locale } from "logos:constants/languages/localisation";
import type { PartOfSpeech } from "logos:constants/parts-of-speech";
import type { Client } from "logos/client";

type ContextBuilder<T extends object> = ({
	localise,
	localiseRaw,
	locale,
}: { localise: Client["localise"]; localiseRaw?: Client["localiseRaw"]; locale: Locale }) => T;

export default Object.freeze({
	botInformation: ({ localise, locale }) => ({
		concept: {
			title: localise("information.options.bot.strings.concept.title", locale)(),
			description: localise("information.options.bot.strings.concept.description", locale)(),
		},
		function: {
			title: localise("information.options.bot.strings.function.title", locale)(),
			description: localise("information.options.bot.strings.function.description", locale)(),
			features: {
				definitions: localise("information.options.bot.strings.function.features.definitions", locale)(),
				translations: localise("information.options.bot.strings.function.features.translations", locale)(),
				games: localise("information.options.bot.strings.function.features.games", locale)(),
				messages: localise("information.options.bot.strings.function.features.messages", locale)(),
				guides: localise("information.options.bot.strings.function.features.guides", locale)(),
			},
		},
		languages: {
			title: localise("information.options.bot.strings.languages.title", locale)(),
			description: localise("information.options.bot.strings.languages.description", locale)(),
		},
	}),
	licence: ({ localise, locale }) => ({
		title: localise("licence.strings.license", locale),
		fields: {
			source: localise("licence.strings.source", locale)(),
			copyright: localise("licence.strings.copyright", locale)(),
		},
	}),
	invalidLicence: ({ localise, locale }) => ({
		title: localise("licence.strings.invalid.title", locale)(),
		description: localise("licence.strings.invalid.description", locale)(),
	}),
	answerModal: ({ localise, locale }) => ({
		title: localise("answer.title", locale)(),
		fields: {
			question: localise("answer.fields.question", locale)(),
			answer: localise("answer.fields.answer", locale)(),
		},
	}),
	correctionModal: ({ localise, locale }) => ({
		title: localise("correction.title", locale)(),
		fields: {
			original: localise("correction.fields.original", locale)(),
			corrected: localise("correction.fields.corrected", locale)(),
		},
	}),
	correctionTextsNotDifferent: ({ localise, locale }) => ({
		title: localise("correction.strings.textsNotDifferent.title", locale)(),
		description: localise("correction.strings.textsNotDifferent.description", locale)(),
	}),
	failedToSubmitForm: ({ localise, locale }) => ({
		title: localise("form.failedToSubmit.title", locale)(),
		description: localise("form.failedToSubmit.description", locale)(),
		continue: localise("prompts.continue", locale)(),
		cancel: localise("prompts.cancel", locale)(),
	}),
	page: ({ localise, locale }) => ({
		page: localise("interactions.page", locale)(),
	}),
	continuedOnNextPage: ({ localise, locale }) => ({
		continuedOnNextPage: localise("interactions.continuedOnNextPage", locale)(),
	}),
	cefrGuideBracketA: ({ localise, locale }) => ({
		brackets: {
			a: localise("cefr.strings.brackets.a", locale)(),
		},
		levels: {
			a0: {
				title: localise("cefr.strings.levels.a0.title", locale)(),
				description: localise("cefr.strings.levels.a0.description", locale)(),
			},
			a1: {
				title: localise("cefr.strings.levels.a1.title", locale)(),
				description: localise("cefr.strings.levels.a1.description", locale)(),
			},
			a2: {
				title: localise("cefr.strings.levels.a2.title", locale)(),
				description: localise("cefr.strings.levels.a2.description", locale)(),
			},
		},
	}),
	cefrGuideBracketB: ({ localise, locale }) => ({
		brackets: {
			b: localise("cefr.strings.brackets.b", locale)(),
		},
		levels: {
			b1: {
				title: localise("cefr.strings.levels.b1.title", locale)(),
				description: localise("cefr.strings.levels.b1.description", locale)(),
			},
			b2: {
				title: localise("cefr.strings.levels.b2.title", locale)(),
				description: localise("cefr.strings.levels.b2.description", locale)(),
			},
		},
	}),
	cefrGuideBracketC: ({ localise, locale }) => ({
		brackets: {
			c: localise("cefr.strings.brackets.c", locale)(),
		},
		levels: {
			c1: {
				title: localise("cefr.strings.levels.c1.title", locale)(),
				description: localise("cefr.strings.levels.c1.description", locale)(),
			},
			c2: {
				title: localise("cefr.strings.levels.c2.title", locale)(),
				description: localise("cefr.strings.levels.c2.description", locale)(),
			},
			c3: {
				title: localise("cefr.strings.levels.c3.title", locale)(),
				description: localise("cefr.strings.levels.c3.description", locale)(),
			},
		},
	}),
	cefrExamplesBracketA: ({ localise, locale }) => ({
		brackets: {
			a: localise("cefr.strings.brackets.a", locale)(),
		},
		levels: {
			a0: {
				title: localise("cefr.strings.levels.a0.title", locale)(),
			},
			a1: {
				title: localise("cefr.strings.levels.a1.title", locale)(),
			},
			a2: {
				title: localise("cefr.strings.levels.a2.title", locale)(),
			},
		},
	}),
	cefrExamplesBracketB: ({ localise, locale }) => ({
		brackets: {
			b: localise("cefr.strings.brackets.b", locale)(),
		},
		levels: {
			b1: {
				title: localise("cefr.strings.levels.b1.title", locale)(),
			},
			b2: {
				title: localise("cefr.strings.levels.b2.title", locale)(),
			},
		},
	}),
	cefrExamplesBracketC: ({ localise, locale }) => ({
		brackets: {
			c: localise("cefr.strings.brackets.c", locale)(),
		},
		levels: {
			c1: {
				title: localise("cefr.strings.levels.c1.title", locale)(),
			},
			c2: {
				title: localise("cefr.strings.levels.c2.title", locale)(),
			},
			c3: {
				title: localise("cefr.strings.levels.c3.title", locale)(),
			},
		},
	}),
	cefrButtons: ({ localise, locale }) => ({
		brackets: {
			a: localise("cefr.strings.brackets.a", locale)(),
			b: localise("cefr.strings.brackets.b", locale)(),
			c: localise("cefr.strings.brackets.c", locale)(),
		},
		tabs: {
			guide: localise("cefr.strings.tabs.guide", locale)(),
			examples: localise("cefr.strings.tabs.examples", locale)(),
		},
	}),
	cannotAnswer: ({ localise, locale }) => ({
		title: localise("answer.strings.cannotAnswer.title", locale)(),
		description: localise("answer.strings.cannotAnswer.description", locale)(),
	}),
	cannotAnswerOwn: ({ localise, locale }) => ({
		title: localise("answer.strings.cannotAnswerOwn.title", locale)(),
		description: localise("answer.strings.cannotAnswerOwn.description", locale)(),
	}),
	answer: ({ localise, locale }) => ({
		answer: localise("answer.strings.answer", locale)(),
		submittedBy: localise("answer.strings.submittedBy", locale),
	}),
	cannotCorrect: ({ localise, locale }) => ({
		title: localise("correction.strings.cannotCorrect.title", locale)(),
		description: localise("correction.strings.cannotCorrect.description", locale)(),
	}),
	cannotCorrectOwn: ({ localise, locale }) => ({
		title: localise("correction.strings.cannotCorrectOwn.title", locale)(),
		description: localise("correction.strings.cannotCorrectOwn.description", locale)(),
	}),
	userDoesNotWantCorrections: ({ localise, locale }) => ({
		title: localise("correction.strings.userDoesNotWantCorrections.title", locale)(),
		description: localise("correction.strings.userDoesNotWantCorrections.description", locale)(),
	}),
	correctionTooLong: ({ localise, locale }) => ({
		title: localise("correction.strings.tooLong.title", locale)(),
		description: {
			tooLong: localise("correction.strings.tooLong.description.tooLong", locale)(),
			maximumLength: localise("correction.strings.tooLong.description.maximumLength", locale),
		},
	}),
	correction: ({ localise, locale }) => ({
		suggestedBy: localise("correction.strings.suggestedBy", locale),
	}),
	cannotUseMessageForTranslation: ({ localise, locale }) => ({
		title: localise("translate.strings.cannotUse.title", locale)(),
		description: localise("translate.strings.cannotUse.description", locale)(),
	}),
	bothLanguagesInvalid: ({ localise, locale }) => ({
		title: localise("translate.strings.invalid.both.title", locale)(),
		description: localise("translate.strings.invalid.both.description", locale)(),
	}),
	sourceLanguageInvalid: ({ localise, locale }) => ({
		title: localise("translate.strings.invalid.source.title", locale)(),
		description: localise("translate.strings.invalid.source.description", locale)(),
	}),
	targetLanguageInvalid: ({ localise, locale }) => ({
		title: localise("translate.strings.invalid.target.title", locale)(),
		description: localise("translate.strings.invalid.target.description", locale)(),
	}),
	languagesNotDifferent: ({ localise, locale }) => ({
		title: localise("translate.strings.languagesNotDifferent.title", locale)(),
		description: localise("translate.strings.languagesNotDifferent.description", locale)(),
	}),
	cannotDetermineTargetLanguage: ({ localise, locale }) => ({
		title: localise("translate.strings.cannotDetermine.target.title", locale)(),
		description: {
			cannotDetermine: localise("translate.strings.cannotDetermine.target.description.cannotDetermine", locale)(),
			tryAgain: localise("translate.strings.cannotDetermine.target.description.tryAgain", locale)(),
		},
	}),
	noTranslationAdapters: ({ localise, locale }) => ({
		title: localise("translate.strings.noTranslationAdapters.title", locale)(),
		description: localise("translate.strings.noTranslationAdapters.description", locale)(),
	}),
	failedToTranslate: ({ localise, locale }) => ({
		title: localise("translate.strings.failed.title", locale)(),
		description: localise("translate.strings.failed.description", locale)(),
	}),
	cannotDetermineSourceLanguage: ({ localise, locale }) => ({
		title: localise("translate.strings.cannotDetermine.source.title", locale)(),
		description: {
			cannotDetermine: localise("translate.strings.cannotDetermine.source.description.cannotDetermine", locale)(),
			tryAgain: localise("translate.strings.cannotDetermine.source.description.tryAgain", locale)(),
		},
	}),
	languageNotSupported: ({ localise, locale }) => ({
		title: localise("translate.strings.languageNotSupported.title", locale)(),
		description: localise("translate.strings.languageNotSupported.description", locale),
	}),
	cannotClearSettings: ({ localise, locale }) => ({
		title: localise("settings.strings.cannotClear.title", locale)(),
		description: localise("settings.strings.cannotClear.description", locale)(),
	}),
	settingsCleared: ({ localise, locale }) => ({
		title: localise("settings.strings.cleared.title", locale)(),
		description: localise("settings.strings.cleared.description", locale)(),
	}),
	settings: ({ localise, locale }) => ({
		title: localise("settings.strings.settings.title", locale)(),
		description: {
			language: {
				title: localise("settings.strings.settings.fields.language.title", locale)(),
				noLanguageSet: localise(
					"settings.strings.settings.fields.language.description.noLanguageSet.noLanguageSet",
					locale,
				)(),
				defaultShown: localise(
					"settings.strings.settings.fields.language.description.noLanguageSet.defaultShown",
					locale,
				)(),
			},
		},
	}),
	// TODO(vxern): This is needs to be changed because none of these string keys are relevant.
	sureToCancel: ({ localise, locale }) => ({
		title: localise("report.strings.sureToCancel.title", locale)(),
		description: localise("report.strings.sureToCancel.description", locale)(),
		stay: localise("prompts.stay", locale)(),
		leave: localise("prompts.leave", locale)(),
	}),
	acknowledgements: ({ localise, locale }) => ({
		acknowledgements: localise("acknowledgements.strings.acknowledgements", locale)(),
	}),
	credits: ({ localise, locale }) => ({
		translation: localise("credits.strings.translation", locale)(),
	}),
	noSentencesAvailable: ({ localise, locale }) => ({
		title: localise("game.strings.noSentencesAvailable.title", locale)(),
		description: localise("game.strings.noSentencesAvailable.description", locale)(),
	}),
	game: ({ localise, locale }) => ({
		skip: localise("game.strings.skip", locale)(),
		correctGuesses: localise("game.strings.correctGuesses", locale),
		allTime: localise("game.strings.allTime", locale),
		next: localise("game.strings.next", locale)(),
	}),
	gameSentencesSourcedFrom: ({ localise, locale }) => ({
		sentence: localise("game.strings.sentence", locale)(),
		translation: localise("game.strings.translation", locale)(),
		sourcedFrom: localise("game.strings.sourcedFrom", locale),
	}),
	translationsSourcedFrom: ({ localise, locale }) => ({
		sourcedFrom: localise("translate.strings.sourcedFrom", locale),
	}),
	contextSentencesSourcedFrom: ({ localise, locale }) => ({
		sentence: localise("context.strings.sentence", locale),
		translation: localise("context.strings.translation", locale),
		sourcedFrom: localise("context.strings.sourcedFrom", locale),
	}),
	recognitionsMadeBy: ({ localise, locale }) => ({
		recognitionsMadeBy: localise("recognise.strings.recognitionsMadeBy", locale)(),
	}),
	translation: ({ localise, locale }) => ({
		sourceText: localise("translate.strings.sourceText", locale)(),
		translation: localise("translate.strings.translation", locale)(),
	}),
	sureToShow: ({ localise, locale }) => ({
		title: localise("interactions.show.sureToShow.title", locale)(),
		description: localise("interactions.show.sureToShow.description", locale)(),
		yes: localise("interactions.show.sureToShow.yes", locale)(),
		no: localise("interactions.show.sureToShow.no", locale)(),
	}),
	show: ({ localise, locale }) => ({
		show: localise("interactions.show", locale)(),
	}),
	source: ({ localise, locale }) => ({
		source: localise("interactions.source", locale)(),
	}),
	cannotUseForRecognition: ({ localise, locale }) => ({
		title: localise("recognise.strings.cannotUse.title", locale)(),
		description: localise("recognise.strings.cannotUse.description", locale)(),
	}),
	textEmpty: ({ localise, locale }) => ({
		title: localise("recognise.strings.textEmpty.title", locale)(),
		description: localise("recognise.strings.textEmpty.description", locale)(),
	}),
	unknownLanguage: ({ localise, locale }) => ({
		title: localise("recognise.strings.unknown.title", locale)(),
		description: {
			text: localise("recognise.strings.unknown.description.text", locale)(),
			message: localise("recognise.strings.unknown.description.message", locale)(),
		},
	}),
	invalidUser: ({ localise, locale }) => ({
		title: localise("interactions.invalidUser.title", locale)(),
		description: localise("interactions.invalidUser.description", locale)(),
	}),
	autocompleteLanguage: ({ localise, locale }) => ({
		autocomplete: localise("autocomplete.language", locale)(),
	}),
	languageAlreadySet: ({ localise, locale }) => ({
		title: localise("settings.strings.alreadySet.title", locale)(),
		description: localise("settings.strings.alreadySet.description", locale),
	}),
	languageUpdated: ({ localise, locale }) => ({
		title: localise("settings.strings.languageUpdated.title", locale)(),
		description: localise("settings.strings.languageUpdated.description", locale),
	}),
	languageInvalid: ({ localise, locale }) => ({
		title: localise("settings.strings.invalid.title", locale)(),
		description: localise("settings.strings.invalid.description", locale)(),
	}),
	likelyMatch: ({ localise, locale }) => ({
		title: localise("recognise.strings.fields.likelyMatches.title", locale)(),
		description: localise("recognise.strings.fields.likelyMatches.description.single", locale),
	}),
	likelyMatches: ({ localise, locale }) => ({
		title: localise("recognise.strings.fields.likelyMatches.title", locale)(),
		description: localise("recognise.strings.fields.likelyMatches.description.multiple", locale)(),
	}),
	thinking: ({ localise, locale }) => ({
		thinking: localise("interactions.thinking", locale)(),
	}),
	autocompleteUser: ({ localise, locale }) => ({
		autocomplete: localise("autocomplete.user", locale)(),
	}),
	language: ({ localise, locale }) => ({
		language: (language: Language) => localise(constants.localisations.languages[language], locale)(),
	}),
	possibleMatch: ({ localise, locale }) => ({
		title: localise("recognise.strings.fields.possibleMatches.title", locale)(),
		description: localise("recognise.strings.fields.possibleMatches.description.single", locale),
	}),
	possibleMatches: ({ localise, locale }) => ({
		title: localise("recognise.strings.fields.possibleMatches.title", locale)(),
		description: localise("recognise.strings.fields.possibleMatches.description.multiple", locale)(),
	}),
	redirect: ({ localise, locale }) => ({
		redirect: localise("resources.strings.redirect", locale),
	}),
	dexonlinePronoun: ({ localise, locale }) => ({
		title: localise("word.strings.nouns.cases.cases", locale)(),
		singular: localise("word.strings.nouns.singular", locale)(),
		plural: localise("word.strings.nouns.plural", locale)(),
		nominativeAccusative: localise("word.strings.nouns.cases.nominativeAccusative", locale)(),
		genitiveDative: localise("word.strings.nouns.cases.genitiveDative", locale)(),
		vocative: localise("word.strings.nouns.cases.vocative", locale)(),
	}),
	dexonlineNoun: ({ localise, locale }) => ({
		title: localise("word.strings.nouns.cases.cases", locale)(),
		singular: localise("word.strings.nouns.singular", locale)(),
		plural: localise("word.strings.nouns.plural", locale)(),
		nominativeAccusative: localise("word.strings.nouns.cases.nominativeAccusative", locale)(),
		genitiveDative: localise("word.strings.nouns.cases.genitiveDative", locale)(),
		vocative: localise("word.strings.nouns.cases.vocative", locale)(),
	}),
	dexonlineVerb: ({ localise, locale }) => ({
		moodsAndParticiples: {
			title: localise("word.strings.verbs.moodsAndParticiples", locale)(),
			infinitive: localise("word.strings.verbs.moods.infinitive", locale)(),
			longInfinitive: localise("word.strings.verbs.moods.longInfinitive", locale)(),
			imperative: localise("word.strings.verbs.moods.imperative", locale)(),
			supine: localise("word.strings.verbs.moods.supine", locale)(),
			present: localise("word.strings.verbs.participles.present", locale)(),
			past: localise("word.strings.verbs.participles.past", locale)(),
		},
		indicative: {
			title: localise("word.strings.verbs.moods.indicative", locale)(),
			present: localise("word.strings.verbs.tenses.present", locale)(),
			preterite: localise("word.strings.verbs.tenses.preterite", locale)(),
			imperfect: localise("word.strings.verbs.tenses.imperfect", locale)(),
			pluperfect: localise("word.strings.verbs.tenses.pluperfect", locale)(),
			perfect: localise("word.strings.verbs.tenses.perfect", locale)(),
			futureCertain: localise("word.strings.verbs.tenses.futureCertain", locale)(),
			futurePlanned: localise("word.strings.verbs.tenses.futurePlanned", locale)(),
			futureDecided: localise("word.strings.verbs.tenses.futureDecided", locale)(),
			futureIntended: localise("word.strings.verbs.tenses.futureIntended", locale)(),
			popular: localise("word.strings.verbs.popular", locale)(),
			futureInThePast: localise("word.strings.verbs.tenses.futureInThePast", locale)(),
			futurePerfect: localise("word.strings.verbs.tenses.futurePerfect", locale)(),
		},
		subjunctive: {
			title: localise("word.strings.verbs.moods.subjunctive", locale)(),
			present: localise("word.strings.verbs.tenses.present", locale)(),
			perfect: localise("word.strings.verbs.tenses.perfect", locale)(),
		},
		conditional: {
			title: localise("word.strings.verbs.moods.conditional", locale)(),
			present: localise("word.strings.verbs.tenses.present", locale)(),
			perfect: localise("word.strings.verbs.tenses.perfect", locale)(),
		},
		presumptive: {
			title: localise("word.strings.verbs.moods.presumptive", locale)(),
			present: localise("word.strings.verbs.tenses.present", locale)(),
			presentContinuous: localise("word.strings.verbs.tenses.presentContinuous", locale)(),
			perfect: localise("word.strings.verbs.tenses.perfect", locale)(),
		},
	}),
	dexonlineAdjective: ({ localise, locale }) => ({
		title: localise("word.strings.nouns.cases.cases", locale)(),
		singular: localise("word.strings.nouns.singular", locale)(),
		plural: localise("word.strings.nouns.plural", locale)(),
		nominativeAccusative: localise("word.strings.nouns.cases.nominativeAccusative", locale)(),
		genitiveDative: localise("word.strings.nouns.cases.genitiveDative", locale)(),
	}),
	dexonlineDeterminer: ({ localise, locale }) => ({
		title: localise("word.strings.nouns.cases.cases", locale)(),
		singular: localise("word.strings.nouns.singular", locale)(),
		plural: localise("word.strings.nouns.plural", locale)(),
		nominativeAccusative: localise("word.strings.nouns.cases.nominativeAccusative", locale)(),
		genitiveDative: localise("word.strings.nouns.cases.genitiveDative", locale)(),
	}),
	invalidLanguage: ({ localise, locale }) => ({
		title: localise("word.strings.invalid.language.title", locale)(),
		description: localise("word.strings.invalid.language.description", locale)(),
	}),
	noDictionaryAdapters: ({ localise, locale }) => ({
		title: localise("word.strings.noDictionaryAdapters.title", locale)(),
		description: localise("word.strings.noDictionaryAdapters.description", locale)(),
	}),
	noInformation: ({ localise, locale }) => ({
		title: localise("word.strings.noInformation.title", locale)(),
		description: localise("word.strings.noInformation.description", locale),
	}),
	wordPage: ({ localise, locale }) => ({
		page: localise("word.strings.page", locale)(),
	}),
	overviewTab: ({ localise, locale }) => ({
		definitions: localise("word.strings.overview", locale)(),
	}),
	inflectionTab: ({ localise, locale }) => ({
		inflection: localise("word.strings.inflection", locale)(),
	}),
	partOfSpeech: ({ localise, locale }) => ({
		partOfSpeech: (partOfSpeech: PartOfSpeech) =>
			localise(constants.localisations.partsOfSpeech[partOfSpeech], locale)(),
	}),
	partOfSpeechUnknown: ({ localise, locale }) => ({
		unknown: localise("words.unknown", locale)(),
	}),
	definitionsForWord: ({ localise, locale }) => ({
		definitionsForWord: localise("word.strings.definitionsForWord", locale),
	}),
	translationsForWord: ({ localise, locale }) => ({
		translationsForWord: localise("word.strings.translationsForWord", locale),
	}),
	definitions: ({ localise, locale }) => ({
		definitions: localise("word.strings.fields.definitions", locale)(),
	}),
	translations: ({ localise, locale }) => ({
		translations: localise("word.strings.fields.translations", locale)(),
	}),
	expressions: ({ localise, locale }) => ({
		expressions: localise("word.strings.fields.expressions", locale)(),
	}),
	relations: ({ localise, locale }) => ({
		relations: localise("word.strings.fields.relations", locale)(),
	}),
	pronunciation: ({ localise, locale }) => ({
		pronunciation: localise("word.strings.fields.pronunciation", locale)(),
	}),
	audio: ({ localise, locale }) => ({
		audio: localise("word.strings.fields.audio", locale)(),
	}),
	examples: ({ localise, locale }) => ({
		examples: localise("word.strings.fields.examples", locale)(),
	}),
	frequency: ({ localise, locale }) => ({
		frequency: localise("word.strings.fields.frequency", locale)(),
	}),
	etymology: ({ localise, locale }) => ({
		etymology: localise("word.strings.fields.etymology", locale)(),
	}),
	notes: ({ localise, locale }) => ({
		notes: localise("word.strings.fields.notes", locale)(),
	}),
	sourcedFromDictionaries: ({ localise, locale }) => ({
		sourcedResponsibly: localise("word.strings.sourcedResponsibly", locale),
	}),
	wordRelations: ({ localise, locale }) => ({
		synonyms: localise("word.strings.relations.synonyms", locale)(),
		antonyms: localise("word.strings.relations.antonyms", locale)(),
		diminutives: localise("word.strings.relations.diminutives", locale)(),
		augmentatives: localise("word.strings.relations.augmentatives", locale)(),
	}),
	definitionsOmitted: ({ localise, locale }) => ({
		definitionsOmitted: localise("word.strings.definitionsOmitted", locale),
	}),
	rateLimited: ({ localise, locale }) => ({
		title: localise("interactions.rateLimited.title", locale)(),
		description: {
			tooManyUses: localise("interactions.rateLimited.description.tooManyUses", locale),
			cannotUseUntil: localise("interactions.rateLimited.description.cannotUseAgainUntil", locale),
		},
	}),
	noSentencesFound: ({ localise, locale }) => ({
		title: localise("context.strings.noSentencesFound.title", locale)(),
		description: localise("context.strings.noSentencesFound.description", locale)(),
	}),
	phraseInContext: ({ localise, locale }) => ({
		title: localise("context.strings.phraseInContext.title", locale),
	}),
} satisfies Record<string, ContextBuilder<any>>);
export type { ContextBuilder };
