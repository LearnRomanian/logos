import { isDefined } from "logos:core/utilities";
import type { Client } from "logos/client";
import { handleSimpleAutocomplete } from "logos/commands/fragments/autocomplete/simple";

async function handleReloadServerAutocomplete(
	client: Client,
	interaction: Logos.Interaction<any, { server: string | undefined }>,
): Promise<void> {
	if (!constants.MAINTAINER_IDS.includes(interaction.user.id)) {
		return;
	}

	const guilds = Array.from(client.documents.guilds.values())
		.map((guild) => client.entities.guilds.get(BigInt(guild.guildId)))
		.filter(isDefined);

	await handleSimpleAutocomplete(client, interaction, {
		query: interaction.parameters.server ?? "",
		elements: guilds,
		formatChoice: (guild) => ({ name: `${guild.name} (ID ${guild.id})`, value: guild.id.toString() }),
	});
}

async function handleReloadServer(
	client: Client,
	interaction: Logos.Interaction<any, { server: string | undefined }>,
): Promise<void> {
	const context = client.localisations.useContexts(["reloadGuild", "unauthorised"], {
		locale: interaction.displayLocale,
	});

	let guildId: bigint;
	if (interaction.parameters.server) {
		guildId = BigInt(interaction.parameters.server);
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

export { handleReloadServerAutocomplete, handleReloadServer };
