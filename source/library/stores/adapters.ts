import type { Client } from "logos/client";
import { DetectorStore } from "logos/stores/adapters/detectors";
import { DictionaryStore } from "logos/stores/adapters/dictionaries";
import { TranslatorStore } from "logos/stores/adapters/translators";

class AdapterStore {
	readonly detectors: DetectorStore;
	readonly dictionaries: DictionaryStore;
	readonly translators: TranslatorStore;

	constructor(client: Client) {
		this.detectors = new DetectorStore(client);
		this.dictionaries = new DictionaryStore(client);
		this.translators = new TranslatorStore(client);
	}
}

export { AdapterStore };
