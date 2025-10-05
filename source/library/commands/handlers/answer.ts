import type { Client } from "logos/client";
import { ConfirmationPrompt } from "logos/commands/components/confirmation-prompt/confirmation-prompt";
import { AnswerComposer } from "logos/commands/components/modal-composers/answer-composer";

async function handleAnswer(client: Client, interaction: Logos.Interaction): Promise<void> {
	const member = client.entities.members.get(interaction.guildId)?.get(interaction.user.id);
	if (member === undefined) {
		return;
	}

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

		const strings = {
			answer: constants.contexts.answer({ localise: client.localise, locale: submission.locale }),
			sureToDeleteAnswer: constants.contexts.sureToDeleteAnswer({
				localise: client.localise,
				locale: submission.locale,
			}),
		};

		const deletionConfirmation = new ConfirmationPrompt(client, {
			interaction: submission,
			title: strings.sureToDeleteAnswer.title,
			description: strings.sureToDeleteAnswer.description,
			yes: strings.sureToDeleteAnswer.yes,
			no: strings.sureToDeleteAnswer.no,
		});

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
								content: `– *${formData.answer}*`,
							},
							{
								type: Discord.MessageComponentTypes.TextDisplay,
								content: `-# ${constants.emojis.commands.answer} ${strings.answer.submittedBy({
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
										customId: deletionConfirmation.collector.customId,
										label: strings.answer.delete,
										style: Discord.ButtonStyles.Danger,
										emoji: { name: constants.emojis.delete },
									},
								],
							},
						],
					},
				],
			})
			.catch((error) =>
				client.log.warn(error, `Failed to send answer to ${client.diagnostics.channel(message.channelId)}.`),
			)
			.ignore();
	});

	await composer.open();
}

export { handleAnswer };
