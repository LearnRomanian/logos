import type { Client } from "logos/client";
import { InteractionCollector } from "logos/collectors";
import { ConfirmationPrompt } from "logos/commands/components/confirmation-prompt/confirmation-prompt";
import { AnswerComposer, type AnswerFormData } from "logos/commands/components/modal-composers/answer-composer";

async function handleAnswer(client: Client, interaction: Logos.Interaction): Promise<void> {
	const message = interaction.data?.resolved?.messages?.array()?.at(0);
	if (message === undefined) {
		return;
	}

	if (message.author.toggles?.has("bot") || message.content.trim().length === 0) {
		const strings = constants.contexts.cannotAnswer({ localise: client.localise, locale: interaction.locale });
		client.warning(interaction, { title: strings.title, description: strings.description }).ignore();

		return;
	}

	if (message.author.id === interaction.user.id) {
		const strings = constants.contexts.cannotAnswerOwn({ localise: client.localise, locale: interaction.locale });
		client.warning(interaction, { title: strings.title, description: strings.description }).ignore();

		return;
	}

	const composer = new AnswerComposer(client, { interaction, question: message.content });

	composer.onSubmit(async (submission, { formData }) => {
		client.acknowledge(submission).ignore();

		const strings = constants.contexts.sureToDeleteAnswer({ localise: client.localise, locale: submission.locale });

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

		const answerMessage = await client.bot.helpers
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
				client.log.warn(error, `Failed to send answer to ${client.diagnostics.channel(message.channelId)}.`);
				return undefined;
			});
		if (answerMessage === undefined) {
			return;
		}

		editButton.onInteraction(async (buttonPress) => {
			const composer = new AnswerComposer(client, {
				interaction: buttonPress,
				question: message.content,
				answer: formData.answer,
			});

			composer.onSubmit(async (submission, { formData: updatedFormData }) => {
				formData = updatedFormData;

				client.acknowledge(submission).ignore();

				await client.bot.helpers.editMessage(answerMessage.channelId, answerMessage.id, {
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
			client.bot.helpers.deleteMessage(answerMessage.channelId, answerMessage.id).catch((error) => {
				client.log.warn(error, "Failed to delete answer message.");
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
		formData: AnswerFormData;
		editButton: InteractionCollector;
		deleteButton: InteractionCollector;
	},
): Discord.MessageComponents {
	const strings = constants.contexts.answer({
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
					content: `– *${formData.answer}*`,
				},
				{
					type: Discord.MessageComponentTypes.TextDisplay,
					content: `-# ${constants.emojis.commands.answer} ${strings.submittedBy({
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

export { handleAnswer };
