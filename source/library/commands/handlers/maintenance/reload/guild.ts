import type { Client } from "logos/client";

async function handleReloadGuild(
	client: Client,
	interaction: Logos.Interaction<any, { guild: string | undefined }>,
): Promise<void> {
	const context = client.localisations.useContexts(["reloadGuild", "unauthorised"], {
		locale: interaction.displayLocale,
	});

	let guildId: bigint;
	if (interaction.parameters.guild) {
		guildId = BigInt(interaction.parameters.guild);
		if (Number.isNaN(guildId)) {
			return;
		}
	} else {
		guildId = interaction.guildId;
	}

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
						content: `# ${context.reloadGuild.reloading.title()}\n${context.reloadGuild.reloading.description()}`,
					},
				],
			},
		],
	});

	await client.guilds.reloadGuild({ guildId });

	await client.noticed(interaction, {
		flags: Discord.MessageFlags.IsComponentV2,
		components: [
			{
				type: Discord.MessageComponentTypes.Container,
				components: [
					{
						type: Discord.MessageComponentTypes.TextDisplay,
						content: `# ${context.reloadGuild.reloaded.title()}\n${context.reloadGuild.reloaded.description()}`,
					},
				],
			},
		],
	});
}

export { handleReloadGuild };
