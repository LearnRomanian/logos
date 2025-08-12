import type { Client } from "logos/client";
import { GameViewComponent } from "logos/commands/components/game-view";

/** Starts a simple game of 'choose the correct word to fit in the blank'. */
async function handleStartGame(client: Client, interaction: Logos.Interaction): Promise<void> {
	const sentencePairCount = await client.volatile?.getSentencePairCount({
		learningLocale: interaction.learningLocale,
	});
	if (sentencePairCount === undefined || sentencePairCount === 0) {
		const strings = constants.contexts.noSentencesAvailable({
			localise: client.localise,
			locale: interaction.locale,
		});
		client
			.warning(
				interaction,
				{
					flags: Discord.MessageFlags.IsComponentV2,
					components: [
						{
							type: Discord.MessageComponentTypes.Container,
							components: [
								{
									type: Discord.MessageComponentTypes.TextDisplay,
									content: `# ${strings.title}\n${strings.description}`,
								},
							],
						},
					],
				},
				{ autoDelete: true },
			)
			.ignore();

		return;
	}

	const game = new GameViewComponent(client, { interaction });

	await game.display();
}

export { handleStartGame };
