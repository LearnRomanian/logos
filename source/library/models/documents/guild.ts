import type { FeatureLanguage } from "logos:constants/languages/feature";
import type { LearningLanguage } from "logos:constants/languages/learning";
import type { LocalisationLanguage } from "logos:constants/languages/localisation";

interface GuildDocument {
	createdAt: number;
	languages: {
		localisation: LocalisationLanguage;
		target: LearningLanguage;
		feature: FeatureLanguage;
	};
	enabledFeatures: {
		answers: boolean;
		corrections: boolean;
		cefr: boolean;
		game: boolean;
		resources: boolean;
		translate: boolean;
		word: boolean;
		wordSigils: boolean;
		context: boolean;
		targetOnly: boolean;
		roleLanguages: boolean;
	};
	features: {
		corrections?: {
			doNotCorrectRoleIds: string[];
		};
		cefr?: {
			examples?: {
				a1: string;
				a2: string;
				b1: string;
				b2: string;
				c1: string;
				c2: string;
			};
		};
		resources?: {
			url: string;
		};
		targetOnly?: {
			channelIds: string[];
		};
		roleLanguages?: {
			ids: Record<string, LocalisationLanguage>;
		};
	};
}

interface FeatureManagement {
	roles?: string[];
	users?: string[];
}

interface DynamicVoiceChannel {
	id: string;
	minimum?: number;
	maximum?: number;
}

interface RoleWithIndicator {
	roleId: string;
	indicator: string;
}

export type { GuildDocument, DynamicVoiceChannel, RoleWithIndicator, FeatureManagement };
