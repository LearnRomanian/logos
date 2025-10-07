import type { Translation } from "logos:constants/contributions";
import type { LocalisationLanguage } from "logos:constants/languages/localisation";
import type { Client } from "logos/client";

async function handleDisplayCredits(client: Client, interaction: Logos.Interaction): Promise<void> {
	client.notice(interaction, getTranslationView(client, interaction)).ignore();
}

function getTranslationView(client: Client, interaction: Logos.Interaction): Discord.InteractionCallbackData {
	const strings = constants.contexts.credits({ localise: client.localise, locale: interaction.locale });

	function formatTranslation([language, data]: [LocalisationLanguage, Translation]): string {
		const strings = constants.contexts.language({ localise: client.localise, locale: interaction.locale });

		const formattedContributors = data.contributors
			.map((contributor) => {
				if (contributor.link !== undefined) {
					return `[${contributor.username}](${contributor.link})`;
				}

				return `${contributor.username}`;
			})
			.join(", ");

		return `### ${data.flag} ${strings.language(language)} (${data.completion * 10}%)\n${formattedContributors}`;
	}

	const translationsByCompletion = (
		Object.entries(constants.contributions.translation) as [LocalisationLanguage, Translation][]
	)
		.sort(([_, a], [__, b]) => b.completion - a.completion)
		.map((translation) => formatTranslation(translation))
		.join("\n");

	return {
		flags: Discord.MessageFlags.IsComponentV2,
		components: [
			{
				type: Discord.MessageComponentTypes.Container,
				components: [
					{
						type: Discord.MessageComponentTypes.TextDisplay,
						content: `# ${strings.translation}\n\n${translationsByCompletion}`,
					},
				],
			},
		],
	};
}

export { handleDisplayCredits };
