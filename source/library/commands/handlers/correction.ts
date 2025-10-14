import { diffWordsWithSpace } from "diff";
import type { Client } from "logos/client";
import { InteractionCollector } from "logos/collectors";
import { ConfirmationPrompt } from "logos/commands/components/confirmation-prompt/confirmation-prompt";
import {
	CorrectionComposer,
	type CorrectionFormData,
} from "logos/commands/components/modal-composers/correction-composer";
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
	let guildDocument: Guild | undefined;
	if (interaction.guildId !== undefined) {
		guildDocument = await Guild.getOrCreate(client, { guildId: interaction.guildId.toString() });
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

	if (guildDocument !== undefined) {
		const correctedMember = client.entities.members.get(BigInt(guildDocument.guildId))?.get(message.author.id);
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
		original: message.content,
		corrected: mode === "full" ? message.content : "",
	});

	composer.onSubmit(async (submission, { formData }) => {
		client.acknowledge(submission).ignore();

		const strings = constants.contexts.sureToDeleteCorrection({
			localise: client.localise,
			locale: interaction.locale,
		});

		const editButton = new InteractionCollector(client, {
			only: [submission.user.id],
		});

		const deletionConfirmation = new ConfirmationPrompt(client, {
			interaction: submission,
			title: strings.title,
			description: strings.description,
			yes: strings.yes,
			no: strings.no,
		});

		const correctionMessage = await client.bot.helpers
			.sendMessage(message.channelId, {
				flags: Discord.MessageFlags.IsComponentV2,
				messageReference: {
					messageId: message.id,
					channelId: message.channelId,
					guildId: interaction.guildId,
					failIfNotExists: false,
				},
				components: getComponents(client, {
					interaction,
					formData,
					editButton,
					deleteButton: deletionConfirmation.collector,
				}),
			})
			.catch((error) => {
				client.log.warn(
					error,
					`Failed to send correction to ${client.diagnostics.channel(message.channelId)}.`,
				);
				return undefined;
			});
		if (correctionMessage === undefined) {
			return;
		}

		editButton.onInteraction(async (buttonPress) => {
			const composer = new CorrectionComposer(client, {
				interaction: buttonPress,
				original: message.content,
				corrected: formData.corrected,
			});

			composer.onSubmit(async (submission, { formData: updatedFormData }) => {
				formData = updatedFormData;

				client.acknowledge(submission).ignore();

				await client.bot.helpers.editMessage(correctionMessage.channelId, correctionMessage.id, {
					components: getComponents(client, {
						interaction,
						formData,
						editButton,
						deleteButton: deletionConfirmation.collector,
					}),
				});
			});

			await composer.open();
		});

		await client.registerInteractionCollector(editButton);

		deletionConfirmation.onConfirm(() =>
			client.bot.helpers.deleteMessage(correctionMessage.channelId, correctionMessage.id).catch((error) => {
				client.log.warn(error, "Failed to delete correction message.");
			}),
		);

		await deletionConfirmation.initialise();
	});

	await composer.open();
}

function getComponents(
	client: Client,
	{
		interaction,
		formData,
		editButton,
		deleteButton,
	}: {
		interaction: Logos.Interaction;
		formData: CorrectionFormData;
		editButton: InteractionCollector;
		deleteButton: InteractionCollector;
	},
): Discord.MessageComponents {
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

	const strings = constants.contexts.correction({
		localise: client.localise,
		locale: interaction.guildLocale,
	});
	return [
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
				{
					type: Discord.MessageComponentTypes.Separator,
					spacing: Discord.SeparatorSpacingSize.Large,
				},
				{
					type: Discord.MessageComponentTypes.ActionRow,
					components: [
						{
							type: Discord.MessageComponentTypes.Button,
							customId: editButton.customId,
							label: strings.edit,
							style: Discord.ButtonStyles.Primary,
							emoji: { name: constants.emojis.edit },
						},
						{
							type: Discord.MessageComponentTypes.Button,
							customId: deleteButton.customId,
							label: strings.delete,
							style: Discord.ButtonStyles.Danger,
							emoji: { name: constants.emojis.delete },
						},
					],
				},
			],
		},
	];
}

export { handleMakeFullCorrection, handleMakePartialCorrection };
