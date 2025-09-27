import { list } from "logos:constants/formatting";
import type { Client } from "logos/client";

async function handleDisplayBotInformation(client: Client, interaction: Logos.Interaction): Promise<void> {
	const strings = constants.contexts.botInformation({ localise: client.localise, locale: interaction.displayLocale });

	const featuresFormatted = list([
		`${constants.emojis.commands.information.bot.features.definitions} ${strings.function.features.definitions}`,
		`${constants.emojis.commands.information.bot.features.translations} ${strings.function.features.translations}`,
		`${constants.emojis.commands.information.bot.features.games} ${strings.function.features.games}`,
		`${constants.emojis.commands.information.bot.features.messages} ${strings.function.features.messages}`,
		`${constants.emojis.commands.information.bot.features.guides} ${strings.function.features.guides}`,
	]);

	client
		.notice(
			interaction,
			{
				flags: Discord.MessageFlags.IsComponentV2,
				components: [
					{
						type: Discord.MessageComponentTypes.Container,
						components: [
							{
								type: Discord.MessageComponentTypes.TextDisplay,
								content: `### ${constants.emojis.commands.information.bot.features.bot} ${strings.concept.title}\n${strings.concept.description}`,
							},
							{
								type: Discord.MessageComponentTypes.TextDisplay,
								content: `### ${constants.emojis.commands.information.bot.features.function} ${strings.function.title}\n${strings.function.description}\n${featuresFormatted}`,
							},
							{
								type: Discord.MessageComponentTypes.TextDisplay,
								content: `### ${constants.emojis.commands.information.bot.features.languages} ${strings.languages.title}\n${strings.languages.description}`,
							},
							...(interaction.parameters.show
								? []
								: ([
										{
											type: Discord.MessageComponentTypes.Separator,
											spacing: Discord.SeparatorSpacingSize.Large,
										},
										{
											type: Discord.MessageComponentTypes.ActionRow,
											components: interaction.parameters.show
												? []
												: [
														client.services
															.global("interactionRepetition")
															.getShowButton(interaction),
													],
										},
									] satisfies Discord.ContainerComponent["components"])),
						],
					},
				],
			},
			{ visible: interaction.parameters.show },
		)
		.ignore();
}

export { handleDisplayBotInformation };
