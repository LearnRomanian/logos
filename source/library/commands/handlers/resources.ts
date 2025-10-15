import type { Client } from "logos/client";
import { Guild } from "logos/models/guild";

/** Displays a message with information on where to find the resources for a given language. */
async function handleDisplayResources(client: Client, interaction: Logos.Interaction): Promise<void> {
	if (interaction.guildId === undefined) {
		return;
	}

	const guildDocument = await Guild.getOrCreate(client, { guildId: interaction.guildId.toString() });
	const configuration = guildDocument.feature("resources");

	const strings = {
		...constants.contexts.redirect({
			localise: client.localise,
			locale: interaction.displayLocale,
		}),
		...constants.contexts.language({
			localise: client.localise,
			locale: interaction.displayLocale,
		}),
	};

	client
		.reply(
			interaction,
			{
				flags: Discord.MessageFlags.IsComponentV2,
				components: [
					{
						type: Discord.MessageComponentTypes.Container,
						components: [
							{
								type: Discord.MessageComponentTypes.ActionRow,
								components: [
									{
										type: Discord.MessageComponentTypes.Button,
										label: strings.redirect({
											language: strings.language(interaction.featureLanguage),
										}),
										style: Discord.ButtonStyles.Link,
										url: configuration.url,
									},
									...(interaction.parameters.show
										? []
										: [client.services.global("interactionRepetition").getShowButton(interaction)]),
								],
							},
						],
					},
				],
			},
			{ visible: interaction.parameters.show },
		)
		.ignore();
}

export { handleDisplayResources };
