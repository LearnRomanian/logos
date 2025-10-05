import type { Client } from "logos/client";
import { InteractionCollector } from "logos/collectors";

type ConfirmEvent = () => Promise<void>;
type CancelEvent = () => Promise<void>;

class ConfirmationPrompt {
	readonly client: Client;
	readonly #anchor: Logos.Interaction;
	readonly collector: InteractionCollector;

	#onConfirm?: ConfirmEvent;
	#onCancel?: CancelEvent;

	constructor(client: Client, { interaction }: { interaction: Logos.Interaction }) {
		this.client = client;
		this.#anchor = interaction;
		this.collector = new InteractionCollector(client, {
			guildId: interaction.guildId,
			only: [interaction.user.id],
		});
	}

	async initialise(): Promise<void> {
		const strings = this.client.localisations.useContext("sureToDeleteCorrection", {
			locale: this.#anchor.displayLocale,
		});

		this.collector.onInteraction(async (buttonPress) => {
			await this.client.postponeReply(buttonPress);

			const confirmButton = new InteractionCollector(this.client, {
				only: [buttonPress.user.id],
				dependsOn: this.collector,
				isSingle: true,
			});
			const cancelButton = new InteractionCollector(this.client, {
				only: [buttonPress.user.id],
				dependsOn: this.collector,
				isSingle: true,
			});

			confirmButton.onInteraction(async (_) => {
				this.client.deleteReply(buttonPress).ignore();
				this.#onConfirm?.();
			});

			cancelButton.onInteraction((_) => {
				this.client.deleteReply(buttonPress).ignore();
				this.#onCancel?.();
			});

			await this.client.registerInteractionCollector(confirmButton);
			await this.client.registerInteractionCollector(cancelButton);

			this.client
				.pushedBack(buttonPress, {
					flags: Discord.MessageFlags.IsComponentV2,
					components: [
						{
							type: Discord.MessageComponentTypes.Container,
							components: [
								{
									type: Discord.MessageComponentTypes.TextDisplay,
									content: `# ${strings.title}\n${strings.description}`,
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
											customId: confirmButton.customId,
											label: strings.yes,
											style: Discord.ButtonStyles.Success,
										},
										{
											type: Discord.MessageComponentTypes.Button,
											customId: cancelButton.customId,
											label: strings.no,
											style: Discord.ButtonStyles.Danger,
										},
									],
								},
							],
						},
					],
				})
				.ignore();
		});

		await this.client.registerInteractionCollector(this.collector);
	}

	onConfirm(callback: ConfirmEvent): void {
		this.#onConfirm = callback;
	}

	onCancel(callback: CancelEvent): void {
		this.#onCancel = callback;
	}
}

export { ConfirmationPrompt };
