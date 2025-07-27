import type { Client } from "logos/client";
import { User } from "logos/models/user";

async function handleDisplaySettings(client: Client, interaction: Logos.Interaction): Promise<void> {
	const userDocument = await User.getOrCreate(client, { userId: interaction.user.id.toString() });

	const strings = {
		...constants.contexts.settings({ localise: client.localise, locale: interaction.locale }),
		...constants.contexts.language({ localise: client.localise, locale: interaction.locale }),
	};
	client
		.notice(interaction, {
			title: strings.title,
			fields: [
				{
					name: strings.description.language.title,
					value:
						userDocument.preferredLanguage !== undefined
							? strings.language(userDocument.preferredLanguage)
							: `${strings.description.language.noLanguageSet} ${strings.description.language.defaultShown}`,
					inline: true,
				},
			],
		})
		.ignore();
}

export { handleDisplaySettings };
