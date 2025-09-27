import { diffWordsWithSpace } from "diff";
import type { Client } from "logos/client";
import { CorrectionComposer } from "logos/commands/components/modal-composers/correction-composer";
import { Guild } from "logos/models/guild";

type CorrectionMode = "partial" | "full";

async function handleMakePartialCorrection(client: Client, interaction: Logos.Interaction): Promise<void> {
	await handleMakeCorrection(client, interaction, { mode: "partial" });
}

async function handleMakeFullCorrection(client: Client, interaction: Logos.Interaction): Promise<void> {
	await handleMakeCorrection(client, interaction, { mode: "full" });
}

async function handleMakeCorrection(
	client: Client,
	interaction: Logos.Interaction,
	{ mode }: { mode: CorrectionMode },
): Promise<void> {
	const guildDocument = await Guild.getOrCreate(client, { guildId: interaction.guildId.toString() });

	const member = client.entities.members.get(interaction.guildId)?.get(interaction.user.id);
	if (member === undefined) {
		return;
	}

	const message = interaction.data?.resolved?.messages?.array()?.at(0);
	if (message === undefined) {
		return;
	}

	if (message.author.toggles?.has("bot") || message.content.trim().length === 0) {
		const strings = constants.contexts.cannotCorrect({ localise: client.localise, locale: interaction.locale });
		client.warning(interaction, { title: strings.title, description: strings.description }).ignore();

		return;
	}

	if (message.author.id === interaction.user.id) {
		const strings = constants.contexts.cannotCorrectOwn({ localise: client.localise, locale: interaction.locale });
		client.warning(interaction, { title: strings.title, description: strings.description }).ignore();

		return;
	}

	const correctedMember = client.entities.members.get(interaction.guildId)?.get(message.author.id);
	if (correctedMember === undefined) {
		return;
	}

	const doNotCorrectMeRoleIds = guildDocument.feature("corrections").doNotCorrectRoleIds;
	if (correctedMember.roles.some((roleId) => doNotCorrectMeRoleIds.includes(roleId.toString()))) {
		const strings = constants.contexts.userDoesNotWantCorrections({
			localise: client.localise,
			locale: interaction.locale,
		});
		client.warning(interaction, { title: strings.title, description: strings.description }).ignore();

		return;
	}

	if (message.content.length > constants.MAXIMUM_CORRECTION_MESSAGE_LENGTH) {
		const strings = constants.contexts.correctionTooLong({
			localise: client.localise,
			locale: interaction.locale,
		});
		client
			.warning(interaction, {
				title: strings.title,
				description: `${strings.description.tooLong} ${strings.description.maximumLength({
					character_limit: constants.MAXIMUM_CORRECTION_MESSAGE_LENGTH,
				})}`,
			})
			.ignore();

		return;
	}

	const composer = new CorrectionComposer(client, {
		interaction,
		text: message.content,
		prefillCorrectedField: mode === "full",
	});

	composer.onSubmit(async (submission, { formData }) => {
		client.acknowledge(submission).ignore();

		const differences = diffWordsWithSpace(formData.original, formData.corrected, {
			intlSegmenter: new Intl.Segmenter(interaction.learningLocale, { granularity: "word" }),
		});
		const content = differences.reduce((content, part) => {
			if (part.added) {
				return `${content}__${part.value}__`;
			}

			if (part.removed) {
				return content;
			}

			return `${content}${part.value}`;
		}, "");

		const strings = constants.contexts.correction({ localise: client.localise, locale: interaction.locale });
		client.bot.helpers
			.sendMessage(message.channelId, {
				flags: Discord.MessageFlags.IsComponentV2,
				messageReference: {
					messageId: message.id,
					channelId: message.channelId,
					guildId: interaction.guildId,
					failIfNotExists: false,
				},
				components: [
					{
						type: Discord.MessageComponentTypes.Container,
						accentColor: constants.colours.success,
						components: [
							{
								type: Discord.MessageComponentTypes.TextDisplay,
								content,
							},
							{
								type: Discord.MessageComponentTypes.TextDisplay,
								content: `-# ${constants.emojis.commands.correction} ${strings.suggestedBy({
									username: interaction.member?.nick ?? interaction.user.username,
								})}`,
							},
						],
					},
				],
			})
			.catch((error) =>
				client.log.warn(
					error,
					`Failed to send correction to ${client.diagnostics.channel(message.channelId)}.`,
				),
			)
			.ignore();
	});

	await composer.open();
}

export { handleMakeFullCorrection, handleMakePartialCorrection };
