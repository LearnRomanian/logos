import type { Client } from "logos/client";

async function handleDisplayAcknowledgements(client: Client, interaction: Logos.Interaction): Promise<void> {
	const fields = constants.acknowledgements.map((acknowledgement) => {
		const contributorsFormatted = acknowledgement.users.map((contributor) => contributor.username).join(", ");

		return `### ${contributorsFormatted}:\n${acknowledgement.reason}`;
	});

	const strings = constants.contexts.acknowledgements({ localise: client.localise, locale: interaction.locale });
	client
		.notice(interaction, {
			flags: Discord.MessageFlags.IsComponentV2,
			components: [
				{
					type: Discord.MessageComponentTypes.Container,
					components: [
						{
							type: Discord.MessageComponentTypes.TextDisplay,
							content: `# ${strings.acknowledgements}\n${fields.join("\n")}`,
						},
					],
				},
			],
		})
		.ignore();
}

export { handleDisplayAcknowledgements };
