import type constants_ from "logos:constants/constants";
import type { FeatureLanguage, LearningLanguage, Locale, LocalisationLanguage } from "logos:constants/languages";
import type {
	DesiredProperties,
	DesiredPropertiesBehaviour,
	SelectedDesiredProperties,
} from "logos:constants/properties";
import type { SlowmodeLevel } from "logos:constants/slowmode";
import type { PromiseOr, WithRequired } from "logos:core/utilities";
import type { EntryRequest } from "logos/models/entry-request";
import type { Praise } from "logos/models/praise";
import type { Report } from "logos/models/report";
import type { Resource } from "logos/models/resource";
import type { Suggestion } from "logos/models/suggestion";
import type { Ticket } from "logos/models/ticket";
import type { Warning } from "logos/models/warning";

declare global {
	interface PromiseConstructor {
		createRace<T, R>(
			elements: T[],
			doAction: (element: T) => PromiseOr<R | undefined>,
		): AsyncGenerator<{ element: T; result?: R }, void, void>;
	}

	interface Promise {
		/** Ignores the result of the promise. Useful in fire-and-forget situations. */
		ignore(): void;
	}

	interface Array<T> {
		/**
		 * Taking an array, splits it into parts of equal sizes.
		 *
		 * @param size - The size of each chunk.
		 * @returns The chunked array.
		 */
		toChunked(size: number): T[][];
	}

	interface ObjectConstructor {
		mirror<O extends Record<string, string>>(
			object: O,
		): {
			[K in keyof O as O[K]]: K;
		};
	}
}

declare global {
	// biome-ignore lint/style/noNamespace: We use Logos types to make a distinction from Discordeno types.
	namespace Logos {
		type Guild = Discord.SetupDesiredProps<
			Omit<Discord.Guild, "roles" | "members" | "channels" | "voiceStates"> & {
				roles: Discord.Collection<bigint, Role>;
				members: Discord.Collection<bigint, Member>;
				channels: Discord.Collection<bigint, Channel>;
				voiceStates: Discord.Collection<bigint, VoiceState>;
			},
			SelectedDesiredProperties
		>;

		type RawInteraction = Discord.SetupDesiredProps<Discord.Interaction, SelectedDesiredProperties>;

		type Channel = Discord.SetupDesiredProps<Discord.Channel, SelectedDesiredProperties>;

		type User = Discord.SetupDesiredProps<Discord.User, SelectedDesiredProperties>;

		type Member = Discord.SetupDesiredProps<Discord.Member, SelectedDesiredProperties> & { user?: User };

		type Message = Discord.SetupDesiredProps<Discord.Message, SelectedDesiredProperties>;

		type Attachment = Discord.SetupDesiredProps<Discord.Attachment, SelectedDesiredProperties> &
			Discord.FileContent;

		type Role = Discord.SetupDesiredProps<Discord.Role, SelectedDesiredProperties>;

		type VoiceState = Discord.SetupDesiredProps<Discord.VoiceState, SelectedDesiredProperties>;

		interface InteractionLocaleData {
			// Localisation
			locale: Locale;
			language: LocalisationLanguage;
			guildLocale: Locale;
			guildLanguage: LocalisationLanguage;
			displayLocale: Locale;
			displayLanguage: LocalisationLanguage;
			// Learning
			learningLocale: Locale;
			learningLanguage: LearningLanguage;
			// Feature
			featureLanguage: FeatureLanguage;
		}

		type InteractionParameters<Parameters> = Parameters & {
			"@repeat": boolean;
			show: boolean;
			focused?: keyof Parameters;
		};

		type Interaction<
			Metadata extends string[] = any,
			Parameters extends Record<string, string | number | boolean | undefined> = any,
		> = WithRequired<
			Omit<RawInteraction, "locale" | "guildLocale" | "respond" | "edit" | "deferEdit" | "defer" | "delete">,
			"guildId" | "channelId"
		> &
			InteractionLocaleData & {
				commandName: string;
				metadata: [customId: string, ...data: Metadata];
				parameters: InteractionParameters<Parameters>;
			};

		/** Type representing events that occur within a guild. */
		type Events = {
			/** Fill-in Discord event for a member having been kicked. */
			guildMemberKick: [user: Logos.User, by: Logos.Member];
		} & {
			/** An entry request has been submitted. */
			entryRequestSubmit: [user: Logos.User, entryRequest: EntryRequest];

			/** An entry request has been accepted. */
			entryRequestAccept: [user: Logos.User, by: Logos.Member];

			/** An entry request has been rejected. */
			entryRequestReject: [user: Logos.User, by: Logos.Member];

			/** A member has been warned. */
			memberWarnAdd: [member: Logos.Member, warning: Warning, by: Logos.User];

			/** A member has had a warning removed from their account. */
			memberWarnRemove: [member: Logos.Member, warning: Warning, by: Logos.User];

			/** A member has been timed out. */
			memberTimeoutAdd: [member: Logos.Member, until: number, reason: string, by: Logos.User];

			/** A member's timeout has been cleared. */
			memberTimeoutRemove: [member: Logos.Member, by: Logos.User];

			/** A member has been praised. */
			praiseAdd: [member: Logos.Member, praise: Praise, by: Logos.User];

			/** A report has been submitted. */
			reportSubmit: [author: Logos.Member, report: Report];

			/** A resource has been submitted. */
			resourceSend: [member: Logos.Member, resource: Resource];

			/** A suggestion has been made. */
			suggestionSend: [member: Logos.Member, suggestion: Suggestion];

			/** A ticket has been opened. */
			ticketOpen: [member: Logos.Member, ticket: Ticket];

			/** An inquiry has been opened. */
			inquiryOpen: [member: Logos.Member, ticket: Ticket];

			/** A purging of messages has been initiated. */
			purgeBegin: [member: Logos.Member, channel: Logos.Channel, messageCount: number, author?: Logos.User];

			/** A purging of messages is complete. */
			purgeEnd: [member: Logos.Member, channel: Logos.Channel, messageCount: number, author?: Logos.User];

			/** A user has enabled slowmode in a channel. */
			slowmodeEnable: [user: Logos.User, channel: Logos.Channel, level: SlowmodeLevel];

			/** A user has disabled slowmode in a channel. */
			slowmodeDisable: [user: Logos.User, channel: Logos.Channel];

			/** A user has upgraded the slowmode level in a channel. */
			slowmodeUpgrade: [
				user: Logos.User,
				channel: Logos.Channel,
				previousLevel: SlowmodeLevel,
				currentLevel: SlowmodeLevel,
			];

			/** A user has downgraded the slowmode level in a channel. */
			slowmodeDowngrade: [
				user: Logos.User,
				channel: Logos.Channel,
				previousLevel: SlowmodeLevel,
				currentLevel: SlowmodeLevel,
			];
		};
	}

	const constants: typeof constants_;
}

declare global {
	// biome-ignore lint/performance/noReExportAll: This is fine because we need these types under the `Discord` namespace.
	export * as Discord from "@discordeno/bot";
}

declare module "@discordeno/bot" {
	type Locale = `${Discord.Locales}`;
	type VoiceServerUpdate = Parameters<
		Discord.EventHandlers<DesiredProperties, DesiredPropertiesBehaviour>["voiceServerUpdate"]
	>[0];
	type DeletedMessage = Discord.Events["messageDelete"][0];

	type Events = {
		[T in keyof Discord.EventHandlers<DesiredProperties, DesiredPropertiesBehaviour>]: Parameters<
			Discord.EventHandlers<DesiredProperties, DesiredPropertiesBehaviour>[T]
		>;
	};
}
