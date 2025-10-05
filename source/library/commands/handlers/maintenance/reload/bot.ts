import { run } from "logos:scripts/run";
import type { Client } from "logos/client";

async function handleReloadBot(
	client: Client,
	interaction: Logos.Interaction<any, { guild: string | undefined }>,
): Promise<void> {
	const context = client.localisations.useContexts(["reloadBot", "unauthorised"], {
		locale: interaction.displayLocale,
	});

	if (!constants.MAINTAINER_IDS.includes(interaction.user.id)) {
		await client.error(interaction, {
			flags: Discord.MessageFlags.IsComponentV2,
			components: [
				{
					type: Discord.MessageComponentTypes.Container,
					components: [
						{
							type: Discord.MessageComponentTypes.TextDisplay,
							content: `# ${context.unauthorised.title()}\n${context.unauthorised.description()}`,
						},
					],
				},
			],
		});
		return;
	}

	await client.notice(interaction, {
		flags: Discord.MessageFlags.IsComponentV2,
		components: [
			{
				type: Discord.MessageComponentTypes.Container,
				components: [
					{
						type: Discord.MessageComponentTypes.TextDisplay,
						content: `# ${context.reloadBot.reloading.title()}\n${context.reloadBot.reloading.description()}`,
					},
				],
			},
		],
	});

	await client.stop();
	await run();
}

export { handleReloadBot };
