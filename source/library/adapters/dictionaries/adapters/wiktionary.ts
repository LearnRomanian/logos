import type { LearningLanguage } from "logos:constants/languages/learning";
import { getWiktionaryLanguageName } from "logos:constants/languages/learning";
import { getPartOfSpeech } from "logos:constants/parts-of-speech";
import { DictionaryAdapter } from "logos/adapters/dictionaries/adapter";
import type { DictionaryEntry } from "logos/adapters/dictionaries/dictionary-entry";
import type { Client } from "logos/client";
import * as Wiktionary from "wiktionary-scraper";

class WiktionaryAdapter extends DictionaryAdapter<Wiktionary.Entry[]> {
	constructor(client: Client) {
		super(client, {
			identifier: "Wiktionary",
			provides: ["definitions", "translations", "etymology"],
		});
	}

	async fetch(lemma: string, learningLanguage: LearningLanguage): Promise<Wiktionary.Entry[] | undefined> {
		const targetLanguageWiktionary = getWiktionaryLanguageName(learningLanguage);

		let results: Wiktionary.Entry[] | undefined;
		try {
			results = await Wiktionary.get(lemma, {
				lemmaLanguage: targetLanguageWiktionary,
				userAgent: constants.USER_AGENT,
				followRedirect: true,
			});
		} catch (error) {
			this.client.log.error(error, `The request for lemma "${lemma}" failed.`);
			return undefined;
		}

		if (results === undefined || results.length === 0) {
			return undefined;
		}

		return results;
	}

	parse(
		_: Logos.Interaction,
		__: string,
		learningLanguage: LearningLanguage,
		results: Wiktionary.Entry[],
	): DictionaryEntry[] {
		const targetLanguageWiktionary = getWiktionaryLanguageName(learningLanguage);

		const entries: DictionaryEntry[] = [];
		for (const { lemma, partOfSpeech, etymology, definitions } of results) {
			if (partOfSpeech === undefined || definitions === undefined) {
				continue;
			}

			const [partOfSpeechFuzzy] = partOfSpeech.split(" ").reverse();
			const detection = getPartOfSpeech({
				terms: { exact: partOfSpeech, approximate: partOfSpeechFuzzy },
				learningLanguage,
			});

			const etymologyContents = etymology !== undefined ? etymology.paragraphs.join("\n\n") : undefined;

			entries.push({
				lemma,
				language: learningLanguage,
				partOfSpeech: { value: partOfSpeech, detected: detection.detected },
				definitions: definitions.flatMap(({ fields }) =>
					fields.map((field) => ({ labels: field.labels, value: field.value })),
				),
				etymology: etymologyContents !== undefined ? { value: etymologyContents } : undefined,
				sources: [
					{
						link: constants.links.wiktionaryDefinition(lemma.value, targetLanguageWiktionary),
						licence: constants.licences.dictionaries.wiktionary,
					},
				],
			});
		}

		return entries;
	}
}

export { WiktionaryAdapter };
